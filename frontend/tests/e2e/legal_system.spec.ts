import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('Legal System End-to-End', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('signup flow creates new account', async () => {
    await page.goto(`${BASE_URL}/auth/signup`);

    // Fill signup form
    await page.fill('input[name="name"]', 'Test Lawyer');
    await page.fill('input[name="email"]', `test-${Date.now()}@firm.com`);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'test-firm-123');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('signup → upload document → see analysis flow', async () => {
    // Signup
    const email = `lawyer-${Date.now()}@firm.com`;
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.fill('input[name="name"]', 'John Lawyer');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'firm-test-123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

    // Create new case
    await page.click('button:has-text("New Case")');
    await page.fill('input[name="caseTitle"]', 'Test Contract Case');
    await page.fill('input[name="clientName"]', 'ABC Corporation');
    await page.fill('textarea[name="caseDescription"]', 'Service agreement dispute');
    await page.click('button:has-text("Create Case")');

    // Wait for case to be created
    await page.waitForURL(/\/cases\/[\w-]+/);

    // Upload document
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'contract.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nFake PDF content'),
    });

    // Wait for document upload
    await expect(page.locator('text=contract.pdf')).toBeVisible();

    // Click analyze button
    await page.click('button:has-text("Analyze Document")');

    // Wait for analysis results
    await expect(page.locator('text=Summary')).toBeVisible();
    await expect(page.locator('text=Parties')).toBeVisible();
    await expect(page.locator('text=Risks')).toBeVisible();

    // Verify analysis data is displayed
    const summary = await page.locator('[data-testid="analysis-summary"]').textContent();
    expect(summary).toBeTruthy();
    expect(summary?.length).toBeGreaterThan(0);

    const parties = await page.locator('[data-testid="analysis-parties"]').all();
    expect(parties.length).toBeGreaterThan(0);

    const risks = await page.locator('[data-testid="analysis-risks"]').all();
    expect(risks.length).toBeGreaterThan(0);
  });

  test('document upload validation', async () => {
    // Login
    const email = `uploader-${Date.now()}@firm.com`;
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.fill('input[name="name"]', 'Uploader');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'firm-123');
    await page.click('button[type="submit"]');

    // Create case
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    await page.click('button:has-text("New Case")');
    await page.fill('input[name="caseTitle"]', 'Case for Upload Test');
    await page.fill('input[name="clientName"]', 'Client');
    await page.click('button:has-text("Create Case")');
    await page.waitForURL(/\/cases\/[\w-]+/);

    // Try uploading without selecting file (should show error)
    const analyzeBtn = page.locator('button:has-text("Analyze Document")');
    await expect(analyzeBtn).toBeDisabled();

    // Upload valid PDF
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nContent'),
    });

    // Verify file appears in list
    await expect(page.locator('text=document.pdf')).toBeVisible();

    // Analyze button should now be enabled
    await expect(analyzeBtn).toBeEnabled();
  });

  test('case isolation - user cannot see other firm cases', async () => {
    // Create user A
    const emailA = `usera-${Date.now()}@firm-a.com`;
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.fill('input[name="name"]', 'User A');
    await page.fill('input[name="email"]', emailA);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'firm-a');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

    // Create case in firm A
    await page.click('button:has-text("New Case")');
    await page.fill('input[name="caseTitle"]', 'Case A');
    await page.fill('input[name="clientName"]', 'Client A');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/cases\/[\w-]+/);

    // Note case URL
    const caseUrlA = page.url();

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Create user B
    const emailB = `userb-${Date.now()}@firm-b.com`;
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.fill('input[name="name"]', 'User B');
    await page.fill('input[name="email"]', emailB);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'firm-b');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

    // Try to access user A's case directly
    await page.goto(caseUrlA);

    // Should see forbidden error
    await expect(page.locator('text=Access Denied')).toBeVisible({ timeout: 5000 });
  });

  test('draft generation workflow', async () => {
    // Signup and create case
    const email = `drafter-${Date.now()}@firm.com`;
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.fill('input[name="name"]', 'Drafter');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firmId"]', 'firm-123');
    await page.click('button[type="submit"]');

    await page.click('button:has-text("New Case")');
    await page.fill('input[name="caseTitle"]', 'Draft Test Case');
    await page.fill('input[name="clientName"]', 'Draft Client');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/cases\/[\w-]+/);

    // Click Generate Draft button
    await page.click('button:has-text("Generate Draft")');

    // Select template
    await page.selectOption('select[name="template"]', 'service_agreement');

    // Fill in template variables
    await page.fill('input[name="companyA"]', 'ACME Corp');
    await page.fill('input[name="companyB"]', 'Widget Inc');

    // Click generate
    await page.click('button:has-text("Generate")');

    // Wait for draft to appear
    await expect(page.locator('[data-testid="draft-content"]')).toBeVisible();

    // Verify content is markdown-formatted
    const draftContent = await page.locator('[data-testid="draft-content"]').textContent();
    expect(draftContent).toContain('ACME Corp');
    expect(draftContent).toContain('Widget Inc');
  });
});

test.describe('Public Intake Form', () => {
  test('public intake form submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/intake`);

    // Verify form is visible
    await expect(page.locator('h1')).toContainText('Legal Intake Form');

    // Fill out form
    await page.fill('input[name="clientName"]', 'Jane Smith');
    await page.fill('input[name="clientEmail"]', `intake-${Date.now()}@example.com`);
    await page.fill('input[name="clientPhone"]', '+1-555-0123');
    await page.selectOption('select[name="caseType"]', 'employment');
    await page.fill(
      'textarea[name="description"]',
      'I was wrongfully terminated from my position.'
    );
    await page.selectOption('select[name="preferredContact"]', 'email');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('text=Thank you')).toBeVisible();
    await expect(page.locator('text=We have received your intake form')).toBeVisible();
  });

  test('public intake form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/intake`);

    // Try submitting without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();

    // Fill name only
    await page.fill('input[name="clientName"]', 'Test User');

    // Try submit again - should still show email error
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible();

    // Fill invalid email
    await page.fill('input[name="clientEmail"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('public intake form no authentication required', async ({ page }) => {
    // Access intake form without logging in
    await page.goto(`${BASE_URL}/intake`);

    // Should load without auth redirect
    await expect(page.locator('h1')).toContainText('Legal Intake Form');

    // Submit form
    await page.fill('input[name="clientName"]', 'No Auth User');
    await page.fill('input[name="clientEmail"]', `noauth-${Date.now()}@example.com`);
    await page.fill('input[name="clientPhone"]', '+1-555-9999');
    await page.selectOption('select[name="caseType"]', 'contract');
    await page.fill('textarea[name="description"]', 'Contract dispute');

    await page.click('button[type="submit"]');

    // Should succeed without authentication
    await expect(page.locator('text=Thank you')).toBeVisible();
  });

  test('intake form dropdown options', async ({ page }) => {
    await page.goto(`${BASE_URL}/intake`);

    // Verify case type options
    await page.selectOption('select[name="caseType"]', 'employment');
    await expect(page.locator('select[name="caseType"]')).toHaveValue('employment');

    await page.selectOption('select[name="caseType"]', 'contract');
    await expect(page.locator('select[name="caseType"]')).toHaveValue('contract');

    await page.selectOption('select[name="caseType"]', 'intellectual_property');
    await expect(page.locator('select[name="caseType"]')).toHaveValue('intellectual_property');

    // Verify contact preference options
    await page.selectOption('select[name="preferredContact"]', 'phone');
    await expect(page.locator('select[name="preferredContact"]')).toHaveValue('phone');

    await page.selectOption('select[name="preferredContact"]', 'email');
    await expect(page.locator('select[name="preferredContact"]')).toHaveValue('email');
  });
});
