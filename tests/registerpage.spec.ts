import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite for the Registration flow on https://automationexercise.com
 *
 * Flow:
 *   /login (enter name + email → click Signup)
 *   → /signup (fill full registration form → click Create Account)
 *   → "Account Created!" confirmation → Continue → homepage
 *
 * Methods used from LoginPage.ts:
 *   - goToLoginPage()
 *   - usersignup(name, email)
 *
 * Methods used from RegisterPage.ts:
 *   - verifyPageLoaded()
 *   - fillRegistrationForm(data)
 *   - verifyAccountCreated()
 *   - clickContinue()
 *
 * Total: 4 Test Cases
 */

// ── Test Data ─────────────────────────────────────────────────────────────────
// Unique email generated per run to avoid "already registered" conflicts

const newUserName = 'Auto Tester'
const newEmail    = `autotester_${Date.now()}@mailtest.com`

const registrationData = {
    title:     'Mr' as 'Mr' | 'Mrs',
    password:  'AutoTest@123',
    dobDay:    '10',
    dobMonth:  '5',
    dobYear:   '1995',
    firstName: 'Auto',
    lastName:  'Tester',
    company:   'TestCorp',
    address1:  '123 Test Street',
    address2:  'Suite 456',
    country:   'United States',
    state:     'California',
    city:      'Los Angeles',
    zipcode:   '90001',
    mobile:    '9876543210',
}

// ── Shared page object instances ──────────────────────────────────────────────
// Declared outside so beforeEach can assign and all tests can use them

let loginPage: LoginPage
let registerPage: RegisterPage

// ── beforeEach ────────────────────────────────────────────────────────────────
// Creates fresh instances and navigates to /login before each test
// Registration always starts from the login page

test.beforeEach('Navigate to login page', async ({ page }) => {
    // Step 1: Create LoginPage and RegisterPage instances
    loginPage    = new LoginPage(page)
    registerPage = new RegisterPage(page)

    // Step 2: Navigate to /login — registration starts from here
    await loginPage.goToLoginPage()
})

// ════════════════════════════════════════════════════════════════════════════
//  REGISTRATION TEST CASES
// ════════════════════════════════════════════════════════════════════════════

// ── TC_01 ─────────────────────────────────────────────────────────────────
test('TC_REG_01 - Registration form should load after entering name and email in signup section', async ({ page }) => {
    /**
     * WHAT WE TEST:
     * After entering a new name + email in the signup section on /login
     * and clicking Signup, the full registration form at /signup should load
     * with "Enter Account Information" heading visible.
     *
     * METHODS USED:
     *   LoginPage    → usersignup(name, email)
     *   RegisterPage → verifyPageLoaded()
     */

    // Step 1: Enter name and unique email in the Signup section
    await loginPage.usersignup(newUserName, newEmail)

    // Step 2: Wait for navigation to /signup
    await page.waitForLoadState('domcontentloaded')

    // Step 3: Assert URL changed to /signup
    await expect(page).toHaveURL('https://automationexercise.com/signup')

    // Step 4: Verify "Enter Account Information" heading is visible
    await registerPage.verifyPageLoaded()
})

// ── TC_02 ─────────────────────────────────────────────────────────────────
test('TC_REG_02 - New user should register successfully with all fields filled', async ({ page }) => {
    /**
     * WHAT WE TEST:
     * When all required fields are filled correctly and Create Account is clicked,
     * the "Account Created!" heading should appear confirming successful registration.
     *
     * METHODS USED:
     *   LoginPage    → usersignup(name, email)
     *   RegisterPage → fillRegistrationForm(data)
     *   RegisterPage → verifyAccountCreated()
     */

    // Step 1: Initiate signup from /login with name and unique email
    await loginPage.usersignup(newUserName, newEmail)

    // Step 2: Wait for /signup page to load
    await page.waitForLoadState('domcontentloaded')

    // Step 3: Fill all registration form fields and click Create Account
    await registerPage.fillRegistrationForm(registrationData)

    // Step 4: Verify "Account Created!" heading is visible
    await registerPage.verifyAccountCreated()
})

// ── TC_03 ─────────────────────────────────────────────────────────────────
test('TC_REG_03 - After account creation clicking Continue should redirect to homepage', async ({ page }) => {
    /**
     * WHAT WE TEST:
     * After successful registration, clicking the "Continue" button
     * should redirect the user to the homepage as a logged-in user.
     *
     * METHODS USED:
     *   LoginPage    → usersignup(name, email)
     *   RegisterPage → fillRegistrationForm(data)
     *   RegisterPage → verifyAccountCreated()
     *   RegisterPage → clickContinue()
     */

    // Step 1: Start signup from /login
    await loginPage.usersignup(newUserName, newEmail)
    await page.waitForLoadState('domcontentloaded')

    // Step 2: Fill and submit the registration form
    await registerPage.fillRegistrationForm(registrationData)

    // Step 3: Verify Account Created heading before clicking Continue
    await registerPage.verifyAccountCreated()

    // Step 4: Click the Continue button
    await registerPage.clickContinue()

    // Step 5: Wait for homepage to load
    await page.waitForLoadState('domcontentloaded')

    // Step 6: Assert user is now on the homepage
    await expect(page).toHaveURL('https://automationexercise.com/')

    // Step 7: Assert "Logged in as" label is visible in navbar
    // Confirms the newly registered user is automatically logged in
    const loggedInLabel = page.locator("//a[text()=' Logged in as ']")
    await expect(loggedInLabel).toBeVisible()
})

// ── TC_04 ─────────────────────────────────────────────────────────────────
test('TC_REG_04 - Signup with already registered email should show error and not load form', async ({ page }) => {
    /**
     * WHAT WE TEST:
     * When a user tries to sign up with an already registered email,
     * the error "Email Address already exist!" should appear
     * and the user should NOT be taken to /signup.
     *
     * METHODS USED:
     *   LoginPage → usersignup(name, email)
     *   LoginPage → verifySignupErrorMsg()
     */

    // Step 1: Attempt signup with an already registered email
    await loginPage.usersignup(newUserName, 'admin@xyz.com')

    // Step 2: Verify the duplicate email error message is displayed
    await loginPage.verifySignupErrorMsg()

    // Step 3: Assert URL is still /login — no redirect to /signup happened
    await expect(page).toHaveURL('https://automationexercise.com/login')
})


//npx playwright test tests/registerpage.spec.ts
//npx allure generate allure-results --clean -o allure-report
//npx allure open allure-report