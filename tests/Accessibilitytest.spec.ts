import { Page,test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Accessibility Scan', async ({ page }) => {
  await page.goto('https://client.kfadvance.com/login');
  await page.locator("//button[@id='truste-consent-button']").click()
  await page.locator("#email").fill("nikhilkakde967+cocv1+microso+prrrd@gmail.com")
  await page.locator("#next-btn").click()
  await page.locator('#password').fill("Conference1!")
  await page.getByRole('button',{name:'LOG IN'}).click()

const goal=await page.getByRole('button',{name:'+ Add Goal'})
  console.log("Is goal visible",await goal.innerText());
  
   // Wait until login is successful
 

  console.log('Login successful - Running accessibility scan');

  // Run accessibility scan AFTER login
  const results = await new AxeBuilder({ page }).analyze();

  console.log(`Violations: ${results.violations.length}`);

  expect(results.violations).toEqual([]);
});

  //nikhilkakde967+cocv1+microso+prrrd@gmail.com




//npx playwright test tests/Accessibilitytest.spec.ts --headed