import { webkit } from 'playwright';

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:3004';
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  // Ensure theme is dark via localStorage before any page scripts run
  await context.addInitScript(() => {
    try { localStorage.setItem('theme', 'dark'); } catch(e) { /* noop */ }
  });

  const page = await context.newPage();

  async function snap(path) {
    await page.waitForTimeout(800);
    await page.screenshot({ path, fullPage: true });
    console.log('Saved', path);
  }

  try {
    console.log('navigating to', `${base}/`);
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await snap('screenshots/home-dark.png');

    console.log('navigating to', `${base}/about`);
    await page.goto(`${base}/about`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await snap('screenshots/about-dark.png');
  } catch (err) {
    console.error('Screenshot error', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
