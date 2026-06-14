import{test,expect, Page, Locator} from "@playwright/test"
import { title } from "node:process";


/**
 * RegisterPage
 * ─────────────────────────────────────────────────────────────────────────────
 * Represents https://automationexercise.com/signup
 * Reached after clicking Signup from the LoginPage.
 *
 * Contains all locators and actions for the full registration form:
 * account info section + address info section.
 */

export class RegisterPage {

    private readonly page:Page
     // "Enter Account Information" heading
  private readonly accountInfoHeading: Locator;

  // "Mr." radio button
  private readonly titleMrRadio: Locator;

  // "Mrs." radio button
  private readonly titleMrsRadio: Locator;

  // Password input
  private readonly passwordInput: Locator;

  // Date of birth — Day dropdown
  private readonly dobDaySelect: Locator;

  // Date of birth — Month dropdown
  private readonly dobMonthSelect: Locator;

  // Date of birth — Year dropdown
  private readonly dobYearSelect: Locator;

  // Newsletter checkbox
  private readonly newsletterCheckbox: Locator;

  // Special offers checkbox
  private readonly offersCheckbox: Locator;

  // ─── Address Info Section Locators ────────────────────────────────────────

  // First name input
  private readonly firstNameInput: Locator;

  // Last name input
  private readonly lastNameInput: Locator;

  // Company input (optional)
  private readonly companyInput: Locator;

  // Address line 1
  private readonly address1Input: Locator;

  // Address line 2 (optional)
  private readonly address2Input: Locator;

  // Country dropdown
  private readonly countrySelect: Locator;

  // State input
  private readonly stateInput: Locator;

  // City input
  private readonly cityInput: Locator;

  // Zipcode input
  private readonly zipcodeInput: Locator;

  // Mobile number input
  private readonly mobileInput: Locator;

  // "Create Account" submit button
  private readonly createAccountBtn: Locator;

   // ─── Post Registration Locators ───────────────────────────────────────────

  // "Account Created!" heading shown after successful registration
  private readonly accountCreatedHeading: Locator;

  // "Continue" button shown after account creation
  private readonly continueBtn: Locator;


constructor(page:Page){
    this.page=page
       // Account info locators
    this.accountInfoHeading  = page.locator("//h2[contains(text(),'Enter Account Information')]");
    this.titleMrRadio        = page.locator('#id_gender1');
    this.titleMrsRadio       = page.locator('#id_gender2');
    this.passwordInput       = page.locator('#password');
    this.dobDaySelect        = page.locator('#days');
    this.dobMonthSelect      = page.locator('#months');
    this.dobYearSelect       = page.locator('#years');
    this.newsletterCheckbox  = page.locator('#newsletter');
    this.offersCheckbox      = page.locator('#optin');

    // Address info locators
    this.firstNameInput  = page.locator('#first_name');
    this.lastNameInput   = page.locator('#last_name');
    this.companyInput    = page.locator('#company');
    this.address1Input   = page.locator('#address1');
    this.address2Input   = page.locator('#address2');
    this.countrySelect   = page.locator('#country');
    this.stateInput      = page.locator('#state');
    this.cityInput       = page.locator('#city');
    this.zipcodeInput    = page.locator('#zipcode');
    this.mobileInput     = page.locator('#mobile_number');
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });

    
      // Post registration locators
    this.accountCreatedHeading = page.locator("//h2[@data-qa='account-created']");
    this.continueBtn           = page.getByRole('link', { name: 'Continue' });
}

 // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Fill out the entire registration form and submit
   * @param data - all required registration fields
   */

  async fillRegistrationForm(data:{

    title: 'Mr' | 'Mrs'
    password: string
    dobDay:string
    dobMonth: string;
    dobYear: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;

  })
  {
     // Step 1: Select title Mr or Mrs

     if(data.title==='Mr'){

        await this.titleMrRadio.check()
     }else{
        await this.titleMrsRadio.check()
     }

     // Step 2: Enter password
    await this.passwordInput.fill(data.password);

    //  // Step 3: Select day of birth from dropdown
    await this.dobDaySelect.selectOption(data.dobDay)

    // Step 4: Select month of birth from dropdown
    await this.dobMonthSelect.selectOption(data.dobMonth);

    // Step 5: Select year of birth from dropdown
    await this.dobYearSelect.selectOption(data.dobYear);

      // Step 6: Check newsletter checkbox
    if (!(await this.newsletterCheckbox.isChecked())) {
      await this.newsletterCheckbox.check();
    }

    // Step 7: Check special offers checkbox
    if (!(await this.offersCheckbox.isChecked())) {
      await this.offersCheckbox.check();
    }

      // Step 8: Fill first name
    await this.firstNameInput.fill(data.firstName);

    // Step 9: Fill last name
    await this.lastNameInput.fill(data.lastName);

    // Step 10: Fill company (optional)
    if (data.company) {
      await this.companyInput.fill(data.company);
    }

    // Step 11: Fill address line 1
    await this.address1Input.fill(data.address1);

    // Step 12: Fill address line 2 (optional)
    if (data.address2) {
      await this.address2Input.fill(data.address2);
    }

    // Step 13: Select country from dropdown
    await this.countrySelect.selectOption(data.country);

    // Step 14: Fill state
    await this.stateInput.fill(data.state);

    // Step 15: Fill city
    await this.cityInput.fill(data.city);

    // Step 16: Fill zipcode
    await this.zipcodeInput.fill(data.zipcode);

    // Step 17: Fill mobile number
    await this.mobileInput.fill(data.mobile);

    // Step 18: Click Create Account button to submit the form
    await this.createAccountBtn.click();
  
    
  }
}

