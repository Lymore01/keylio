import { expect, test } from "@playwright/test";

const randomEmail = () =>
  `test-${Math.random().toString(36).substring(7)}@example.com`;

// sign up
test("user can sign up and access protected page", async ({ page }) => {
  const email = randomEmail();
  const password = "password123";

  await page.goto("http://localhost:3000/auth/sign-up");

  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("You're authenticated");
});

// sign in
test("user can sign in and access protected page", async ({ page }) => {
  const email = randomEmail();
  const password = "password123";

  // Create account first
  await page.goto("http://localhost:3000/auth/sign-up");
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/protected");

  // Sign out
  await page.click('button:text("Sign Out")');
  await page.waitForURL("**/auth/sign-in");

  // Sign in
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("You're authenticated");
});

// sign out
test("user can sign out and is redirected to sign-in", async ({ page }) => {
  const email = randomEmail();
  const password = "password123";

  // Create account first
  await page.goto("http://localhost:3000/auth/sign-up");
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/protected");

  await page.click('button:text("Sign Out")');

  await page.waitForURL("**/auth/sign-in");
  await expect(page.locator("h2")).toHaveText("Welcome back");
});

// protected route guard
test("unauthenticated user is redirected when accessing protected page", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/protected");

  await page.waitForURL("**/auth/sign-in");
  await expect(page.locator("h2")).toHaveText("Welcome back");
});

// invalid credentials
test("user sees error on invalid sign-in", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-in");

  await page.fill('input[id="email"]', "wrong@example.com");
  await page.fill('input[id="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page.locator("p#error")).toHaveText(
    "Invalid email or password."
  );
});

// session persistence
test("user session persists after page reload", async ({ page }) => {
  const email = randomEmail();
  const password = "password123";

  // Create account first
  await page.goto("http://localhost:3000/auth/sign-up");
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("You're authenticated");

  // Reload the page
  await page.reload();
  await expect(page.locator("h1")).toHaveText("You're authenticated");
});
