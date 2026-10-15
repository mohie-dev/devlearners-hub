import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const ts = require("typescript");

async function loadTypeScriptModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Function("exports", compiled)(exports);
  return exports;
}

const tokenModule = await loadTypeScriptModule("../src/lib/auth/token.ts");
const academicProfileModule = await loadTypeScriptModule("../src/lib/auth/academic-profile.ts");
const redirectModule = await loadTypeScriptModule("../src/lib/auth/redirect.ts");

const {
  clearAuthSession,
  getAuthSessionSnapshot,
  setAuthSession,
  subscribeAuthSession,
} = tokenModule;
const { isDepartmentSelectionAllowed, resolveRegistrationDepartment } = academicProfileModule;
const { getSafeRedirectPath } = redirectModule;

test("only Levels 3 and 4 allow department selection", () => {
  for (const level of [1, 2]) {
    assert.equal(isDepartmentSelectionAllowed(level), false);
    assert.equal(resolveRegistrationDepartment(level, "CS"), "GENERAL");
  }

  assert.equal(isDepartmentSelectionAllowed(3), true);
  assert.equal(resolveRegistrationDepartment(3, "CS"), "CS");
  assert.equal(isDepartmentSelectionAllowed(4), true);
  assert.equal(resolveRegistrationDepartment(4, "IT"), "IT");
});

test("auth redirects stay within the app", () => {
  assert.equal(getSafeRedirectPath("/subjects/123?tab=content"), "/subjects/123?tab=content");
  assert.equal(getSafeRedirectPath("https://outside.example"), "/dashboard");
  assert.equal(getSafeRedirectPath("//outside.example"), "/dashboard");
});

test("auth-session subscribers update immediately after sign-in and logout", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const listeners = new EventTarget();
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };

  Object.defineProperty(globalThis, "window", { configurable: true, value: listeners });
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });

  try {
    const snapshots = [];
    const unsubscribe = subscribeAuthSession(() => snapshots.push(getAuthSessionSnapshot()));
    const student = {
      id: "student-1",
      fullName: "Test Student",
      email: "student@example.test",
      role: "STUDENT",
    };

    setAuthSession("test-access-token", student);
    assert.deepEqual(getAuthSessionSnapshot(), { user: student, isLoggedIn: true });
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].isLoggedIn, true);

    clearAuthSession();
    assert.deepEqual(getAuthSessionSnapshot(), { user: null, isLoggedIn: false });
    assert.equal(snapshots.length, 2);
    assert.equal(snapshots[1].isLoggedIn, false);
    unsubscribe();
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else delete globalThis.window;
    if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
    else delete globalThis.localStorage;
  }
});
