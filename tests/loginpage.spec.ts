/* import{test,expect} from '@playwright/test'
import {LoginPage} from '../pages/LoginPage'

test('Login to application with valid credentials', async ({page})=>{

    //AAA--Arrange---Act----Assert

    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    const actualTitle=await loginPage.dologin('admin@abc.com', 'admin@123');
    await expect(page).toHaveTitle('My Account');

})

test('Verify invalid login', async ({page})=>{

    //AAA--Arrange---Act----Assert

    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.dologin('as+f@gmail.com','dhfj4fjke')
    const errormesg= await loginPage.getInvalidLoginMsg()
    expect(errormesg).toContain('Warning: No match for E-Mail Address and/or Password.')

})
 */

import { LoginPage } from "../pages/LoginPage";
import { test,Page,expect } from "@playwright/test";

//npx playwright test tests/loginpage.spec.ts

/* * ─────────────────────────────────────────────────────────────────────────────
 * Test suite for the Login page at https://automationexercise.com/login
 *
 * All test cases are written using YOUR LoginPage.ts methods:
 *   - goToLoginPage()
 *   - verifyPageLoaded()
 *   - login(email, password)
 *   - verifyLoginError()
 *   - usersignup(name, email)
 *   - verifySignupErrorMsg()
 *
 * Total: 7 Test Cases
 *   - 4 Login section tests
 *   - 3 Signup section tests
  */

// ── Test Data ────────────────────────────────────────────────────────────────
// Keeping test data at the top makes it easy to update in one place

const validEmail = 'admin@bcd.com'
const validPassword = 'admin@123'
const wrongEmail    = 'wrong@example.com';       // Email not registered
const wrongPassword = 'WrongPass123';            // Incorrect password
const existingEmail = 'admin@xyz.com';    // Already registered email (for signup error test)
const newEmail      = `newuser_${Date.now()}@gmail.com`; // Unique email for each run
const newUserName   = 'AutoTester';             // Name used in signup section



// ── Shared loginPage instance ─────────────────────────────────────────────────
// Declared outside tests so beforeEach can assign it and all tests can use it

let loginPage: LoginPage;

// ── beforeEach ───────────────────────────────────────────────────────────────
// Runs automatically before every test below
// Creates a fresh LoginPage and opens the login URL

test.beforeEach("Verify login",async({page})=>{

    loginPage=new LoginPage(page)
    // Step 2: Navigate to https://automationexercise.com/login
  await loginPage.goToLoginPage();

})


// ════════════════════════════════════════════════════════════════════════════
//  LOGIN SECTION TEST CASES
// ════════════════════════════════════════════════════════════════════════════

// ── TC_01 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_01 - Login page should load with both login and signup sections visible', async () => {
  /**
   * WHAT WE TEST:
   * When user opens /login, both "Login to your account"
   * and "New User Signup!" headings must be visible on the page.
   *
   * METHOD USED: verifyPageLoaded()
   */

  await loginPage.verifyPageLoaded()

})


// ── TC_02 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_02 - Valid credentials should login and redirect to homepage', async ({ page }) => {
  /**
   * WHAT WE TEST:
   * When a registered user enters correct email + password and clicks Login,
   * they should be redirected to the homepage and see "Logged in as" in navbar.
   *
   * METHOD USED: login(email, password)
   */

 // Step 1: Fill email, fill password and click Login button
  await loginPage.login(validEmail, validPassword);

  // Step 2: Wait for the page to fully load after login redirect
  await page.waitForLoadState('domcontentloaded')

   // Step 3: Assert the URL is now homepage '/'
  await expect(page).toHaveURL('https://automationexercise.com/');

  // Step 4: Assert "Logged in as" label is visible in the top navbar
  // This confirms login actually succeeded and session is active

  const loggedInLabel = page.locator("//a[text()=' Logged in as ']");
  await expect(loggedInLabel).toBeVisible();
//"//b[contains(text(),'Enter Account Information')]"
})


// ── TC_03 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_03 - Invalid credentials should display error message', async () => {
  /**
   * WHAT WE TEST:
   * When a user enters wrong email/password and clicks Login,
   * the error message "Your email or password is incorrect!" must appear.
   *
   * METHODS USED: login(email, password) + verifyLoginError()
   */

  // Step 1: Attempt login with incorrect credentials
await loginPage.login(wrongEmail,wrongPassword)

//// Step 2: Call verifyLoginError() which reads and returns the error message text
  // It also logs: "Invalid login message is : ..."

  const errormsg=await loginPage.verifyLoginError()

  // Step 3: Assert the returned message contains the expected error text
  expect(errormsg).toContain('Your email or password is incorrect!')

})


// ── TC_04 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_04 - Empty credentials should keep user on login page', async ({ page }) => {
  /**
   * WHAT WE TEST:
   * When a user clicks Login without entering email or password,
   * browser native validation blocks the form submission
   * and the user stays on /login.
   *
   * METHOD USED: login('', '')
   */

  // Step 1: Call login() with both fields empty
  await loginPage.login('','')

  // Step 2: Assert the URL still contains /login — no redirect happened

  await expect(page).toHaveURL('https://automationexercise.com/login')


})


// ════════════════════════════════════════════════════════════════════════════
//  SIGNUP SECTION TEST CASES
// ════════════════════════════════════════════════════════════════════════════

// ── TC_05 ─────────────────────────────────────────────────────────────────

test('TC_LOGIN_05 - Valid new user signup should navigate to registration form', async ({ page }) => {
  /**
   * WHAT WE TEST:
   * When a user enters a name and a brand new email in the signup section
   * and clicks Signup, they should be redirected to /signup (registration form).
   *
   * METHOD USED: usersignup(name, email)
   */

  //Step 1: Fill name and new unique email, then click Signup button

  await loginPage.usersignup(newUserName,newEmail)
  // Step 2: Wait for page to load after redirect
  await page.waitForLoadState('domcontentloaded')
  // Step 3: Assert URL changed to /signup (full registration form page)
  await expect(page).toHaveURL('https://automationexercise.com/signup')

   // Step 4: Assert "Enter Account Information" heading is visible
  // Confirms we landed on the correct registration form

  const registrationHeading=await page.locator("//b[contains(text(),'Enter Account Information')]")
  await expect (registrationHeading).toBeVisible()

})

// ── TC_06 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_06 - Signup with already registered email should show error message', async () => {
  /**
   * WHAT WE TEST:
   * When a user tries to signup with an email that is already registered,
   * the error "Email Address already exist!" must be displayed.
   *
   * METHODS USED: usersignup(name, email) + verifySignupErrorMsg()
   */

  // Step 1: Attempt signup with an already registered email
  await loginPage.usersignup(newUserName,existingEmail)

   // Step 2: Call verifySignupErrorMsg() which internally runs:
  //   expect(this.signupErrorMsg).toBeVisible()
  await loginPage.verifySignupErrorMsg()

})


// ── TC_07 ─────────────────────────────────────────────────────────────────
test('TC_LOGIN_07 - Signup with empty fields should keep user on login page', async ({ page }) => {
  /**
   * WHAT WE TEST:
   * When a user clicks Signup without entering name or email,
   * the browser native validation blocks form submission
   * and the user stays on /login.
   *
   * METHOD USED: usersignup('', '')
   */


  // Step 1: Call usersignup() with both fields empty
  await loginPage.usersignup('', '');

  // Step 2: Assert URL still contains /login — no redirect happened
  await expect(page).toHaveURL(/login/);
});




//npx playwright test tests/loginpage.spec.ts
//npx allure generate allure-results --clean -o allure-report
//npx allure open allure-report