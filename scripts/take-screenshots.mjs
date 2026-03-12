import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a nice desktop size
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Taking Homepage screenshot...');
  // Homepage
  await page.goto('https://name1-name2-970e5.web.app', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/homepage.png', fullPage: true });

  console.log('Taking Login page screenshot...');
  // Login Page
  await page.goto('https://name1-name2-970e5.web.app/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/login.png', fullPage: true });

  console.log('Taking Admin Access Denied screenshot...');
  // Admin Page (will show access denied)
  await page.goto('https://name1-name2-970e5.web.app/admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/admin.png', fullPage: true });

  await browser.close();
  console.log('Screenshots generated successfully!');
})();
