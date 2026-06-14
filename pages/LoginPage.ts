/* import {Locator,Page} from '@playwright/test';
import { title } from 'node:process';

export class LoginPage {

    //page locators/object model for login page
    private readonly page: Page
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly warningMsg:Locator


    //Now we will initialize the locators in the constructor

    constructor(page:Page){

        this.page = page;
        this.emailId = page.locator('#input-email');
        this.password = page.getByRole('textbox', {name:'password'});
        this.loginBtn = page.getByRole('button', {name:'Login'});
        this.warningMsg = page.locator('.alert.alert-danger.alert-dismissible');
    }

    //page actions/methods for login page
    async goToLoginPage() {
        await this.page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/login');
    }

    //login to application

    async dologin(email:string, password:string) {
        await this.emailId.fill(email);
        await this.password.fill(password);
        await this.loginBtn.click({force:true, timeout:5000});
        const pageTitle= await this.page.title()
        console.log(`Home page title: ${pageTitle}`);
        return pageTitle
        
    }

    //get warning message for invalid login

    async getInvalidLoginMsg() {
        const errorMsg = await this.warningMsg.textContent();
        console.log(`Invalid login message is : ${errorMsg}`);
        return errorMsg;

    }
}
    */

//I will be writing the POM based on my understanding now 

import { expect, Page, Locator } from "@playwright/test";

/**
 * LoginPage
 * ─────────────────────────────────────────────────────────────────────────────
 * Represents https://automationexercise.com/login
 * This page contains TWO sections:
 *   1. Login section  → for existing users
 *   2. Signup section → for new users (just captures name + email)
 *
 * All locators and actions for both sections are defined here.
 */

export class LoginPage{
     // ─── Login Section Locators ────────────────────────────────────────────────

  // "Login to your account" heading
  private readonly page:Page
  //"Login to your account heading"
  private readonly loginHeading:Locator
  //email input for login
   private readonly loginInputEmail:Locator
   //Password input for login
  private readonly loginInputPassword:Locator
  //Login submit button 
  private readonly loginBtn:Locator
  //Invalid msg shown for invalid credentials
  private readonly loginErrorMsg:Locator
  
             //Signup section locators 
  //new user signup heading
  private readonly signupHeading:Locator
  //name input for signup
  private readonly signupNameInput:Locator
  //email input for signup
  private readonly signupEmailInput:Locator
  //Signup button 
  private readonly signupBtn:Locator
  //Error message shown when email is already registered
  private readonly signupErrorMsg: Locator;

//Now initialize the constructor

constructor(page:Page){

    //Login section locators ------------------------
    this.page=page
    this.loginHeading=page.locator("//h2[text()='Login to your account']")
    this.loginInputEmail=page.locator("//input[@data-qa='login-email']")
    this.loginInputPassword=page.getByRole("textbox",{name:'Password'})
    this.loginBtn=page.getByRole("button",{name:'Login'})
    this.loginErrorMsg=page.locator("//p[text()='Your email or password is incorrect!']")


    //Signupactions locators------------------------------
    this.signupHeading=page.locator("//h2[text()='New User Signup!']")
    this.signupNameInput=page.getByRole('textbox', { name: 'Name' })
    this.signupEmailInput=page.locator('//input[@data-qa="signup-email"]')
    this.signupBtn=page.getByRole('button', { name: 'Signup' })
    this.signupErrorMsg=page.locator('//p[text()="Email Address already exist!"]')

}

  //page actions/methods for login page
  //Navigate to landing page directly 
    async goToLoginPage() {
        await this.page.goto('https://automationexercise.com/login')
    }
    
  // ─── Login Actions ─────────────────────────────────────────────────────────

  /**
   * Perform a login action with email and password
   * @param email    - registered user email
   * @param password - user password
   */

  async login(email:string, password:string){

    //Type the email into login email
        await this.loginInputEmail.fill(email)
        await this.loginInputPassword.fill(password)
        await this.loginBtn.click()
  }

   /**
   * Verify that the login error message is displayed
   * Used for invalid credentials test scenarios
   */

   async verifyLoginError(){
    const loginerror=await this.loginErrorMsg.textContent()
     console.log(`Invalid login message is : ${loginerror}`);
        return loginerror;
   }

    // ─── Signup Actions ────────────────────────────────────────────────────────

  /**
   * Enter name and email in the signup section and click Signup
   * Redirects to the full registration form
   * @param name  - new user's name
   * @param email - new user's email (must not already be registered)
   */

  async usersignup(name:string, email:string){

    await this.signupNameInput.fill(name)
    await this.signupEmailInput.fill(email)
    await this.signupBtn.click()

  }

   /**
   * Verify that both login and signup sections are visible
   * Used to confirm the page loaded correctly
   */

   async verifyPageLoaded(){
        // Check the "Login to your account" heading is visible
        await expect(this.loginHeading).toBeVisible()

            // Check the "New User Signup!" heading is visible

            await expect(this.signupHeading).toBeVisible()

   }
   /**
   * Verify email-already-exists error in signup section
   */
  async verifySignupErrorMsg(){

    await expect (this.signupErrorMsg).toBeVisible()

  }




}




