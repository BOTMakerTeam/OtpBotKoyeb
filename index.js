const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');
const axios = require('axios');

const botToken = '8158173689:AAGx3Olc5x--__MhnuokE8lGG7HKhWbeX7g';
const chatId = '-4928449512';
const targetURL = 'http://94.23.120.156/ints/agent/SMSCDRStats';
const cookie = 'PHPSESSID=shvi6hbaespuvg9gv1gt8gjif8';

async function checkOTP() {
  try {
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: true
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ cookie });
    await page.goto(targetURL, { waitUntil: 'domcontentloaded' });

    const content = await page.content();
    const match = content.match(/My OTP is (\d{6})/);

    if (match) {
      const otp = match[1];
      console.log("📩 OTP Found:", otp);
      await axios.get(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=📩 OTP: ${otp}`);
    } else {
      console.log("❌ OTP not found");
    }
    await browser.close();
  } catch (err) {
    console.error("🔥 Error:", err.message);
  }
}

setInterval(checkOTP, 2000);
