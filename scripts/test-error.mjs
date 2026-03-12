import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a nice desktop size
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Visiting app...');
  await page.goto('https://name1-name2-970e5.web.app', { waitUntil: 'networkidle2' });

  // Expose a function to run firebase directly
  const error = await page.evaluate(async () => {
    // We can't easily use firebase from window if it's bundled.
    // Try to trigger the "Save Post" functionality? We can't if we aren't logged in.
    return null;
  });

  await browser.close();
  console.log('Script done!');
})();
