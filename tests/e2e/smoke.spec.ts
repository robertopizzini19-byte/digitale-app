import { test, expect } from "@playwright/test";

// Smoke test: home + pagine pubbliche rispondono e non hanno regressioni base.

test.describe("Smoke — pagine pubbliche", () => {
  test("home carica e contiene il brand", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/digITAle/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("accedi è raggiungibile", async ({ page }) => {
    await page.goto("/accedi");
    await expect(page.getByRole("heading", { name: /accedi|entra|bentornato/i })).toBeVisible();
  });

  test("registrati è raggiungibile", async ({ page }) => {
    await page.goto("/registrati");
    await expect(page.getByRole("heading", { name: /registr|crea account|inizia/i })).toBeVisible();
  });

  test("dashboard non autenticata non espone dati", async ({ page }) => {
    await page.goto("/dashboard");
    // Deve redirect ad accedi OR mostrare CTA login, MAI dati reali
    const url = page.url();
    const hasLoginCTA = await page
      .getByRole("link", { name: /accedi/i })
      .isVisible()
      .catch(() => false);
    const redirected = url.includes("/accedi");
    expect(hasLoginCTA || redirected).toBeTruthy();
  });

  test("security.txt pubblico", async ({ request }) => {
    const res = await request.get("/.well-known/security.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("security@digitale-italia.it");
  });
});

test.describe("Smoke — security headers (preview only)", () => {
  test("CSP + HSTS presenti", async ({ request, baseURL }) => {
    // Skip su localhost dove Netlify non applica headers
    test.skip(baseURL?.includes("localhost") ?? false, "headers sono applicati da Netlify in deploy");
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["strict-transport-security"]).toContain("max-age");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });
});
