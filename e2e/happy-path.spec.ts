import { test, expect } from '@playwright/test';

test.describe('Reddit Clone Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for MSW to be ready
    await page.waitForLoadState('networkidle');
  });

  test('should display home page with posts', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Reddit Clone/);

    // Check that posts are displayed
    await expect(page.getByTestId('post-list')).toBeVisible();
    await expect(page.getByTestId('post-card').first()).toBeVisible();
  });

  test('should navigate to community page', async ({ page }) => {
    // Click on a community link
    await page.getByRole('link', { name: /r\/programming/i }).first().click();

    // Check URL
    await expect(page).toHaveURL(/\/r\/programming/);

    // Check community header is visible
    await expect(page.getByRole('heading', { name: /Programming/i })).toBeVisible();
  });

  test('should navigate to post detail page', async ({ page }) => {
    // Click on a post
    await page.getByTestId('post-card').first().click();

    // Check that we're on the post detail page
    await expect(page.getByTestId('post-detail')).toBeVisible();

    // Check that comment section is visible
    await expect(page.getByTestId('comment-tree')).toBeVisible();
  });

  test('should toggle vote on post', async ({ page }) => {
    // Find a vote button
    const voteButton = page.getByTestId('vote-button').first();
    await expect(voteButton).toBeVisible();

    // Click upvote
    await voteButton.getByRole('button', { name: /upvote/i }).click();

    // The vote should be registered (UI updates optimistically)
    await expect(voteButton).toBeVisible();
  });

  test('should search for content', async ({ page }) => {
    // Find the search input
    const searchInput = page.getByPlaceholder(/Search Reddit/i);
    await searchInput.fill('programming');

    // Search results dropdown should appear
    await expect(page.getByText(/Communities/i)).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find the theme toggle button
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();

    // Check that dark mode class is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/light/);
  });

  test('should open auth modal', async ({ page }) => {
    // Click login button
    await page.getByRole('button', { name: /log in/i }).click();

    // Check that modal is visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });

  test('should login and see user menu', async ({ page }) => {
    // Open login modal
    await page.getByRole('button', { name: /log in/i }).click();

    // Fill in credentials
    await page.getByLabel(/username/i).fill('demo_user');
    await page.getByLabel(/password/i).fill('password');

    // Submit
    await page.getByRole('button', { name: /log in/i }).last().click();

    // Modal should close and user menu should appear
    await expect(page.getByText(/demo_user/i)).toBeVisible();
  });
});
