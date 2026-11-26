const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  for (const [w, h, tag] of [[1280, 1200, 'desk'], [390, 844, 'phone']]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1.5 });
    await p.goto('http://localhost:3000/home-v2', { waitUntil: 'networkidle0', timeout: 90000 });
    await new Promise(r => setTimeout(r, 2000));
    await p.screenshot({ path: process.argv[2] + '/v2-' + tag + '.png', fullPage: true });
    await p.close();
  }
  await b.close();
})();
