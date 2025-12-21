import { expect, test } from "@playwright/test";

// sign up
test("user can sign up and access protected page", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-up");

  await page.fill('input[id="email"]', "test-play@example.com");
  await page.fill('input[id="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("Protected Page");
});

// sign in
test("user can sign in and access protected page", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-in");

  await page.fill('input[id="email"]', "test-play@example.com");
  await page.fill('input[id="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("Protected Page");
});

// sign out
test("user can sign out and is redirected to sign-in", async ({ page }) => {
  await page.goto("http://localhost:3000/protected");

  await page.click('button:text("Sign Out")');

  await page.waitForURL("**/auth/sign-in");
  await expect(page.locator("h2")).toHaveText("Sign In");
});

// protected route guard
test("unauthenticated user is redirected when accessing protected page", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/protected");

  await page.waitForURL("**/auth/sign-in");
  await expect(page.locator("h2")).toHaveText("Sign In");
});

// invalid credentials
test("user sees error on invalid sign-in", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-in");

  await page.fill('input[id="email"]', "wrong@example.com");
  await page.fill('input[id="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page.locator("p")).toHaveText("Invalid email or password.");
});

// session persistence
test("user session persists after page reload", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-in");

  await page.fill('input[id="email"]', "test-play@example.com");
  await page.fill('input[id="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/protected");
  await expect(page.locator("h1")).toHaveText("Protected Page");

  // Reload the page
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Protected Page");
});
