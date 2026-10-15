import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = await readFile(new URL("../src/lib/admin-content-filters.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleExports = {};
new Function("exports", compiled)(moduleExports);
const { buildAdminContentParams, hasActiveAdminContentFilters } = moduleExports;

test("builds a trimmed content query with selected filters and pagination", () => {
  assert.deepEqual(
    buildAdminContentParams(
      {
        search: "  array  ",
        subjectId: "subject-1",
        academicContext: "LECTURE",
        resourceType: "PDF",
        sourceType: "UPLOAD",
      },
      3,
    ),
    {
      search: "array",
      subjectId: "subject-1",
      academicContext: "LECTURE",
      resourceType: "PDF",
      sourceType: "UPLOAD",
      page: 3,
      limit: 20,
    },
  );
});

test("omits blank filters and reports whether filters are active", () => {
  const filters = {
    search: "   ",
    subjectId: "",
    academicContext: "",
    resourceType: "",
    sourceType: "",
  };

  assert.deepEqual(buildAdminContentParams(filters, 1), { page: 1, limit: 20 });
  assert.equal(hasActiveAdminContentFilters(filters), false);
  assert.equal(hasActiveAdminContentFilters({ ...filters, resourceType: "PDF" }), true);
});
