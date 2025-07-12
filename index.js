const puppeteer = require('puppeteer');

// 👉 Config
const TOTAL_VISITS = 3000;
const DELAY_BETWEEN_VISITS = 5000; // ms
const CLICK_DELAY = 3000; // giữ trang 3s
const START_HOUR = 1;

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
  start.setHours(START_HOUR, 0, 0, 0);

  if (now > start) {
    // Nếu đã qua 2:00 hôm nay → lên lịch ngày mai
    start.setDate(start.getDate() + 1);
  }

  return start - now;
}

(async () => {
  const msUntilStart = getMsUntilStartHour();
  console.log(`🕑 Hiện tại là ${getNowTime()}`);
  console.log(`⏳ Đang chờ đến 2:00 AM để bắt đầu... (${msUntilStart / 1000}s)`);

  await sleep(msUntilStart);

  console.log(`🚀 Bắt đầu truy cập lúc ${getNowTime()}`);

  for (let i = 0; i < TOTAL_VISITS; i++) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://shophoadatviet.com', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // 👉 Thực hiện click (ví dụ: click vào phần tử đầu tiên có class .btn hoặc tương tự)
    try {
      await page.click('a, button'); // bạn có thể thay bằng selector cụ thể nếu muốn
      console.log(`✅ Click thành công tại lượt ${i + 1}`);
    } catch (e) {
      console.log(`⚠️ Không click được tại lượt ${i + 1} - không tìm thấy phần tử`);
    }

    await sleep(CLICK_DELAY);
    await browser.close();

    if (i < TOTAL_VISITS - 1) {
      console.log(`⏳ Chờ 5 giây... (${i + 1}/${TOTAL_VISITS})\n`);
      await sleep(DELAY_BETWEEN_VISITS);
    }
  }

  console.log('✅ Hoàn tất 3000 lượt truy cập!');
})();
