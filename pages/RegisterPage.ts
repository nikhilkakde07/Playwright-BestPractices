import { expect, Page, Locator } from "@playwright/test";

/**
 * RegisterPage
 * ─────────────────────────────────────────────────────────────────────────────
 * Represents https://automationexercise.com/signup
 * Reached after clicking Signup from the LoginPage.
 *
 * Contains all locators and actions for the full registration form:
 *   1. Account Information section (title, password, DOB, checkboxes)
 *   2. Address Information section (name, address, country, mobile)
 *   3. Post registration (Account Created heading + Continue button)
 */

export class RegisterPage {

    // ─── Page instance ────────────────────────────────────────────────────────
    private readonly page: Page

    // ─── Account Information Section Locators ─────────────────────────────────

    // "Enter Account Information" heading
    private readonly accountInfoHeading: Locator

    // Title radio buttons
    private readonly titleMrRadio: Locator
    private readonly titleMrsRadio: Locator

    // Password input
    private readonly passwordInput: Locator

    // Date of birth dropdowns
    private readonly dobDaySelect: Locator
    private readonly dobMonthSelect: Locator
    private readonly dobYearSelect: Locator

    // Checkboxes
    private readonly newsletterCheckbox: Locator
    private readonly offersCheckbox: Locator

    // ─── Address Information Section Locators ─────────────────────────────────

    // Name fields
    private readonly firstNameInput: Locator
    private readonly lastNameInput: Locator

    // Company (optional)
    private readonly companyInput: Locator

    // Address fields
    private readonly address1Input: Locator
    private readonly address2Input: Locator

    // Country, state, city, zipcode, mobile
    private readonly countrySelect: Locator
    private readonly stateInput: Locator
    private readonly cityInput: Locator
    private readonly zipcodeInput: Locator
    private readonly mobileInput: Locator

    // Create Account submit button
    private readonly createAccountBtn: Locator

    // ─── Post Registration Locators ───────────────────────────────────────────

    // "Account Created!" heading shown after successful registration
    private readonly accountCreatedHeading: Locator

    // "Continue" button shown after account is created
    private readonly continueBtn: Locator

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(page: Page) {

        this.page = page

        // Account information locators ----------------------------------------
        this.accountInfoHeading  = page.locator("//b[contains(text(),'Enter Account Information')]")
        this.titleMrRadio        = page.locator('#id_gender1')
        this.titleMrsRadio       = page.locator('#id_gender2')
        this.passwordInput       = page.locator('#password')
        this.dobDaySelect        = page.locator('#days')
        this.dobMonthSelect      = page.locator('#months')
        this.dobYearSelect       = page.locator('#years')
        this.newsletterCheckbox  = page.locator('#newsletter')
        this.offersCheckbox      = page.locator('#optin')

        // Address information locators ----------------------------------------
        this.firstNameInput  = page.locator('#first_name')
        this.lastNameInput   = page.locator('#last_name')
        this.companyInput    = page.locator('#company')
        this.address1Input   = page.locator('#address1')
        this.address2Input   = page.locator('#address2')
        this.countrySelect   = page.locator('#country')
        this.stateInput      = page.locator('#state')
        this.cityInput       = page.locator('#city')
        this.zipcodeInput    = page.locator('#zipcode')
        this.mobileInput     = page.locator('#mobile_number')
        this.createAccountBtn = page.getByRole('button', { name: 'Create Account' })

        // Post registration locators ------------------------------------------
        this.accountCreatedHeading = page.locator("//b[text()='Account Created!']")
        this.continueBtn           = page.getByRole('link', { name: 'Continue' })
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    /**
     * Fill out the complete registration form and submit
     * @param data - all required registration fields
     */
    async fillRegistrationForm(data: {
        title: 'Mr' | 'Mrs'
        password: string
        dobDay: string
        dobMonth: string
        dobYear: string
        firstName: string
        lastName: string
        company?: string
        address1: string
        address2?: string
        country: string
        state: string
        city: string
        zipcode: string
        mobile: string
    }): Promise<void> {

        // Step 1: Select title Mr or Mrs
        if (data.title === 'Mr') {
            await this.titleMrRadio.click()
        } else {
            await this.titleMrsRadio.click()
        }

        // Step 2: Enter password
        await this.passwordInput.fill(data.password)

        // Step 3: Select day of birth
        await this.dobDaySelect.selectOption(data.dobDay)

        // Step 4: Select month of birth
        await this.dobMonthSelect.selectOption(data.dobMonth)

        // Step 5: Select year of birth
        await this.dobYearSelect.selectOption(data.dobYear)

        // Step 6: Check newsletter checkbox if not already checked
        if (!(await this.newsletterCheckbox.isChecked())) {
            await this.newsletterCheckbox.check()
        }

        // Step 7: Check special offers checkbox if not already checked
        if (!(await this.offersCheckbox.isChecked())) {
            await this.offersCheckbox.check()
        }

        // Step 8: Fill first name
        await this.firstNameInput.fill(data.firstName)

        // Step 9: Fill last name
        await this.lastNameInput.fill(data.lastName)

        // Step 10: Fill company name (optional)
        if (data.company) {
            await this.companyInput.fill(data.company)
        }

        // Step 11: Fill address line 1
        await this.address1Input.fill(data.address1)

        // Step 12: Fill address line 2 (optional)
        if (data.address2) {
            await this.address2Input.fill(data.address2)
        }

        // Step 13: Select country from dropdown
        await this.countrySelect.selectOption(data.country)

        // Step 14: Fill state
        await this.stateInput.fill(data.state)

        // Step 15: Fill city
        await this.cityInput.fill(data.city)

        // Step 16: Fill zipcode
        await this.zipcodeInput.fill(data.zipcode)

        // Step 17: Fill mobile number
        await this.mobileInput.fill(data.mobile)

        // Step 18: Click Create Account button to submit the form
        await this.createAccountBtn.click()
    }

    /**
     * Verify "Account Created!" heading is visible after registration
     */
    async verifyAccountCreated(): Promise<void> {
        await expect(this.accountCreatedHeading).toBeVisible()
    }

    /**
     * Click the Continue button after account creation
     * Redirects to homepage as a logged-in user
     */
    async clickContinue(): Promise<void> {
        await this.continueBtn.click()
    }

    /**
     * Verify the registration form heading is visible
     * Used to confirm we landed on the correct page
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.accountInfoHeading).toBeVisible()
    }
}