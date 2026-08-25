import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const outputDir = resolve('dist');
const output = resolve(outputDir, 'MON_CAP_A5.pdf');
const source = pathToFileURL(resolve('index.html')).href;

await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
});

try {
  const page = await browser.newPage();
  await page.goto(source, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: output,
    width: '148mm',
    height: '210mm',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log(`Generated ${output}`);
} finally {
  await browser.close();
}
