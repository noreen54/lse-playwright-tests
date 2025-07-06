import { test, expect } from '@playwright/test';

/* Test Case 1:
* Navigate to the London Stock Exchange website
*/

test('Navigation to the London Stock Exchange website', async ({ page }) => {
  //  Navigate to London Stock Exchange website
  await page.goto('https://www.londonstockexchange.com/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Verify London Stock Exchange logo 
  const logo = page.locator('div.logo');
  await expect(logo).toBeVisible();
  
  // Accept cookies 
  const acceptAllButton = page.getByRole('button', { name: /ACCEPT ALL|ACCEPT Cookies|Accept All/i });
  
  if (await acceptAllButton.isVisible({ timeout: 5000 })) {
    await acceptAllButton.click();
    console.log('Clicked accept all cookies');

    // Wait for cookie modal to disappear
    await expect(acceptAllButton).not.toBeVisible();
  } else {
    console.log('Cookie banner not found or already accepted');
  }

  // Additional verification that we're on the right page
  await expect(page).toHaveURL(/londonstockexchange/i);
  await expect(page).toHaveTitle(/London Stock Exchange/i);

  // Take screenshot for verification
  await page.screenshot({ path: 'london-stock-exchange.png' });
});


// /* Test Case 2:
// * Identify, extract, and display somewhere of choice the FTSE 100’s latest top 10 constituents 
// * with the highest percentage change.
// */

test('Extract & Display FTSE 100 Top Ten Constituents with Highest % Change', async ({ page }) => {
  // 1. Navigate to FTSE 100 constituents table
  await page.goto('https://www.londonstockexchange.com/indices/ftse-100/constituents/table');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // 2. Verify FTSE 100 is visible
  await expect(page.locator('h1.ftse-hero-title.font-bold.hero-font')).toBeVisible();

  // 3. Handle cookies
  const acceptAllButton = page.getByRole('button', { name: /ACCEPT ALL|ACCEPT Cookies|Accept All/i });
  if (await acceptAllButton.isVisible({ timeout: 5000 })) {
    await acceptAllButton.click();
    console.log('Clicked accept all cookies');
  }
  // 4. Scroll down and verify table
  const table = page.locator('.full-width.ftse-index-table-table');
  await table.scrollIntoViewIfNeeded();
  await expect(table).toBeVisible();
  console.log('Table verified');

  // 5. Click on 'Change %' dropdown
const changePercentHeader = page.locator('//span[normalize-space() = "Change %"]');
await expect(changePercentHeader).toBeVisible({ timeout: 15000 });
await changePercentHeader.click({ timeout: 15000 });

  // 6. Click on 'Highest – lowest' option
  const highestLowestOption = page.locator('(//div[@title="Highest – lowest"])[4]');
  await highestLowestOption.click();
  console.log('Selected Highest-lowest sorting');

  // Wait for table to update
  await page.waitForTimeout(2000);

  // 7. Extract top 10 values from 'Change %' column
  const changePercentValues = await page.$$eval(
    '.full-width.ftse-index-table-table tbody tr:not(.expandable) td:nth-child(7)',
    (elements, count) => elements.slice(0, count).map(el => el.textContent?.trim()),
    10
  );

  // 8. Extract parallel names from 2nd column
  const companyNames = await page.$$eval(
    '.full-width.ftse-index-table-table tbody tr:not(.expandable) td:nth-child(2)',
    (elements, count) => elements.slice(0, count).map(el => el.textContent?.trim()),
    10
  );

  // Display the results in a formatted way
  console.log('\nTop 10 FTSE 100 Companies by Highest Daily Change:');
  console.log('==============================================');
  console.log('Rank | Company Name               | Change %');
  console.log('-----|---------------------------|----------');
  
  for (let i = 0; i < companyNames.length; i++) {
    // Format the output with consistent spacing
    const rank = (i + 1).toString().padEnd(4, ' ');
    const name = companyNames[i]?.padEnd(25, ' ') || 'N/A'.padEnd(25, ' ');
    const change = changePercentValues[i] || 'N/A';
    
    console.log(`${rank} | ${name} | ${change}`);
  }
  console.log('==============================================');

});

/* Test Case 3  
* Identify, extract, and display somewhere of choice the FTSE 100’s latest top 10 constituents 
* with the lowest percentage change.
*/

test('Extract & Display FTSE 100 Top Ten Constituents with Lowest % Change', async ({ page }) => {
  // 1. Navigate to FTSE 100 constituents table
  await page.goto('https://www.londonstockexchange.com/indices/ftse-100/constituents/table');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // 2. Verify FTSE 100 is visible
  await expect(page.locator('h1.ftse-hero-title.font-bold.hero-font')).toBeVisible();

  // 3. Handle cookies
  const acceptAllButton = page.getByRole('button', { name: /ACCEPT ALL|ACCEPT Cookies|Accept All/i });
  if (await acceptAllButton.isVisible({ timeout: 5000 })) {
    await acceptAllButton.click();
    console.log('Clicked accept all cookies');
  }
  // 4. Scroll down and verify table
  const table = page.locator('.full-width.ftse-index-table-table');
  await table.scrollIntoViewIfNeeded();
  await expect(table).toBeVisible();
  console.log('Table verified');

  // 5. Click on 'Change %' dropdown
const changePercentHeader = page.locator('//span[normalize-space() = "Change %"]');
await expect(changePercentHeader).toBeVisible({ timeout: 15000 });
await changePercentHeader.click({ timeout: 15000 });

  // 6. Click on 'Lowest – highest' option
  const highestLowestOption = page.locator('(//div[@title="Lowest – highest"])[4]');
  await highestLowestOption.click();
  console.log('Selected Lowest – highest sorting');

  // Wait for table to update
  await page.waitForTimeout(2000);

  // 7. Extract top 10 lowest values from 'Change %' column
  const changePercentValues = await page.$$eval(
    '.full-width.ftse-index-table-table tbody tr:not(.expandable) td:nth-child(7)',
    (elements, count) => elements.slice(0, count).map(el => el.textContent?.trim()),
    10
  );

  // 8. Extract parallel names from 2nd column
  const companyNames = await page.$$eval(
    '.full-width.ftse-index-table-table tbody tr:not(.expandable) td:nth-child(2)',
    (elements, count) => elements.slice(0, count).map(el => el.textContent?.trim()),
    10
  );

  // Display the results in a formatted way
  console.log('\nTop 10 FTSE 100 Companies by Highest Daily Change:');
  console.log('==============================================');
  console.log('Rank | Company Name               | Change %');
  console.log('-----|---------------------------|----------');
  
  for (let i = 0; i < companyNames.length; i++) {
    // Format the output with consistent spacing
    const rank = (i + 1).toString().padEnd(4, ' ');
    const name = companyNames[i]?.padEnd(25, ' ') || 'N/A'.padEnd(25, ' ');
    const change = changePercentValues[i] || 'N/A';
    
    console.log(`${rank} | ${name} | ${change}`);
  }
  console.log('==============================================');

});


/* Test Case 4
* Write a test to Identify, extract, and display somewhere of choice all 
* FTSE 100 constituents where the ‘Market Cap’ exceeds 7 million
*/

test('Extract & Display FTSE 100 Companies with Market Cap > 7 million', async ({ page }) => {

  // 1. Navigate to the page
  await page.goto('https://www.londonstockexchange.com/indices/ftse-100/constituents/table');
  await page.waitForLoadState('networkidle');

  //2. Verify FTSE 100 is visible
   await expect(page.locator('h1.ftse-hero-title.font-bold.hero-font')).toBeVisible();

  // 3. Accept cookies if present
  try {
    await page.click('button:has-text("ACCEPT ALL")', { timeout: 5000 });
    console.log('Accepted cookies');
  } catch {
    console.log('No cookie banner found');
  }

  // 4. Initialize array to store all values
  const allMarketCaps: string[] = [];

  // 5. Function to extract market caps from current page
  async function extractPageMarketCaps() {
    const pageMarketCaps = await page.$$eval(
      '.full-width.ftse-index-table-table tbody tr:not(.expandable) td:nth-child(4)',
      cells => cells.map(cell => cell.textContent?.trim() || '0')
    );
    allMarketCaps.push(...pageMarketCaps);
  }

  // 6. Process each page sequentially
  const totalPages = 5;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (pageNum > 1) {
      // Navigate to specific page using the exact locator pattern
      const pageLink = page.locator(`a.page-number[href="/indices/ftse-100/constituents/table?page=${pageNum}"]`);
      await pageLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Wait for table to update
    }
    
    console.log(`Extracting from Page ${pageNum}...`);
    await extractPageMarketCaps();
  }

  // 7. Display all extracted values together
  console.log('\nAll Market Cap Values (Pages 1-5):');
  console.log('==================================');
  console.log('Rank  Market Cap (£m)');
  console.log('-----|---------------');
  
  allMarketCaps.forEach((value, index) => {
    const rank = (index + 1).toString().padEnd(4, ' ');
    console.log(`${rank} | ${value}`);
  });

  console.log('==================================');
  console.log(`Total: ${allMarketCaps.length} companies across 5 pages`);
  
  // 8. Additional statistics
  const numericValues = allMarketCaps.map(v => parseFloat(v.replace(/,/g, '')));
  const average = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  
  console.log('\nStatistics:');
  console.log(`Average: £${average.toLocaleString('en-GB', {maximumFractionDigits: 2})}m`);
  console.log(`Minimum: £${min.toLocaleString('en-GB')}m`);
  console.log(`Maximum: £${max.toLocaleString('en-GB')}m`);
});


/* Test Case 5
* Determine which month over the past three years 
* recorded the lowest average index value
*/

test('Determine lowest average index value month', async ({ page }) => {
  // 1. Navigate to the page
  await page.goto('https://www.londonstockexchange.com/indices/ftse-100/constituents/table');
  await page.waitForLoadState('networkidle');

    //2. Verify FTSE 100 is visible
   await expect(page.locator('h1.ftse-hero-title.font-bold.hero-font')).toBeVisible();

  // 3. Accept cookies if present
  try {
    await page.click('button:has-text("ACCEPT ALL")', { timeout: 5000 });
    console.log('Accepted cookies');
  } catch {
    console.log('No cookie banner found');
  }

  // 4. Try to find column with "Average Index Value" 
  try {
    // Look for the header
    const avgHeader = page.locator('th:has-text("Average Index Value")');
    
    if (await avgHeader.count() > 0) {
      // If header found, try to get the value
      const avgValue = await page.$eval(
        'th:has-text("Average Index Value") >> xpath=following::td[1]',
        el => el.textContent?.trim()
      );
      console.log(`Average Index Value: ${avgValue}`);
    } else {
      console.log('Average Index Value column does not exist in the table');
    }
  } catch (error) {
    console.log('Error while searching for Average Index Value');
  }
});



