const APP_ORIGIN = "https://devlearners.invalid";

export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f]/.test(candidate)
  ) {
    return fallback;
  }

  try {
    const target = new URL(candidate, APP_ORIGIN);
    return target.origin === APP_ORIGIN
      ? `${target.pathname}${target.search}${target.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
