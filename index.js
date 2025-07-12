const puppeteer = require('puppeteer');

const TOTAL_VISITS = 3000;
const DELAY_BETWEEN_VISITS = 5000;
const CLICK_DELAY = 3000;
const START_HOUR = 2; // 2:00AM giờ Việt Nam

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getNowTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

function getMsUntilStartHour() {
  const now = new Date();
  const start = new Date();
  start.setUTCHours(START_HOUR - 7, 0, 0, 0);
  if (now > start) start.setDate(start.getDate() + 1);
  return start - now;
}

(async () => {
  const msUntilStart = getMsUntilStartHour();
  console.log(`🕑 Hiện tại là ${getNowTime()}`);
  console.log(`⏳ Chờ đến 2:00AM giờ Việt Nam... (${Math.floor(msUntilStart / 1000)}s)`);

  await sleep(msUntilStart);

  console.log(`🚀 Bắt đầu truy cập lúc ${getNowTime()}`);

  for (let i = 0; i < TOTAL_VISITS; i++) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
      await page.goto('https://shophoadatviet.com', {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      try {
        await page.waitForSelector('a, button', { timeout: 10000 });

        const clickable = await page.$('a, button');
        if (clickable) {
          await clickable.click();
          console.log(`✅ Click thành công tại lượt ${i + 1}`);
        } else {
          console.log(`⚠️ Không tìm thấy phần tử để click tại lượt ${i + 1}`);
        }
      } catch (err) {
        console.log(`❌ Không tìm thấy phần tử hoặc lỗi khi click: ${err.message}`);
      }

    } catch (e) {
      console.log(`❌ Lỗi khi vào trang tại lượt ${i + 1}: ${e.message}`);
    }

    await sleep(CLICK_DELAY);
    await browser.close();

    if (i < TOTAL_VISITS - 1) {
      console.log(`⏳ Chờ 5 giây... (${i + 1}/${TOTAL_VISITS})\n`);
      await sleep(DELAY_BETWEEN_VISITS);
    }
  }

  console.log('🎉 Hoàn tất 3000 lượt truy cập!');
})();
