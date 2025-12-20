import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a large viewport to capture high quality screenshots
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to app...');
    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (e) {
        console.error('Error navigating:', e);
        await browser.close();
        process.exit(1);
    }

    // Create screenshots directory
    const screenshotDir = 'screenshots';
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    console.log('Taking UI screenshot...');
    await page.screenshot({ path: path.join(screenshotDir, 'ui_overview.png') });

    console.log('Starting page capture...');
    // We'll capture roughly 30 steps to be safe
    for (let i = 0; i < 30; i++) {
        const filename = `page_${String(i).padStart(2, '0')}.png`;
        const filepath = path.join(screenshotDir, filename);

        console.log(`Capturing ${filename}...`);
        await page.screenshot({ path: filepath });

        // Find and click Next button
        // The button has title="Next"
        const nextBtn = await page.$('button[title="Next"]');
        if (!nextBtn) {
            console.log('Next button not found, stopping.');
            break;
        }

        await nextBtn.click();

        // Wait for page flip animation
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('Done!');
    await browser.close();
})();
