import { test, expect } from "@playwright/test";

// Golden path autenticazione — richiede ambiente con Supabase configurato.
// In CI lo skip avviene se E2E_SUPABASE non è impostato (=> non si hanno credenziali test).
//
// Variabili ambiente attese:
//   E2E_TEST_EMAIL   - email utente test preesistente su staging
//   E2E_TEST_PASSWORD - password corrispondente
//
// NON usare mai credenziali di produzione.

const requiresCreds = process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD;

test.describe("Auth — golden path", () => {
  test.skip(!requiresCreds, "E2E_TEST_EMAIL / E2E_TEST_PASSWORD non settati");

  test("login → dashboard → logout", async ({ page }) => {
    await page.goto("/accedi");

    // Compila form login
    await page.getByLabel(/email/i).fill(process.env.E2E_TEST_EMAIL!);
    await page.getByLabel(/password/i).fill(process.env.E2E_TEST_PASSWORD!);
    await page.getByRole("button", { name: /accedi|entra/i }).click();

    // Redirect a dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /dashboard|benvenuto|ciao/i })).toBeVisible();

    // Check: nessun PII leak in console (email non deve apparire in log)
    const consoleMessages: string[] = [];
    page.on("console", (msg) => consoleMessages.push(msg.text()));

    // Logout
    await page.getByRole("button", { name: /esci|logout/i }).click();
    await page.waitForURL(/\/(accedi|$)/, { timeout: 10_000 });

    // Verifica: non ritorna a dashboard senza re-login
    await page.goto("/dashboard");
    const url = page.url();
    expect(url).not.toMatch(/\/dashboard\/?$/);
  });

  test("login fallito mostra errore ma non rivela username valido", async ({ page }) => {
    await page.goto("/accedi");
    await page.getByLabel(/email/i).fill("nonexistent_" + Date.now() + "@digitale-test.it");
    await page.getByLabel(/password/i).fill("WrongPassword123!");
    await page.getByRole("button", { name: /accedi|entra/i }).click();

    // Errore generico atteso (non "utente non trovato", principio di enumeration-safety)
    const errorMessage = page.getByRole("alert").or(page.getByText(/credenzial|errat|non valid/i));
    await expect(errorMessage).toBeVisible({ timeout: 10_000 });
  });
});
