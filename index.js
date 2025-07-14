const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🟢 Server is running! Gọi /run để auto click.");
});

app.get("/run", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto("https://shophoadatviet.com", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const clickable = await page.$("a, button");
    if (clickable) {
      await clickable.click();
      await page.waitForTimeout(3000);
    }

    await browser.close();
    res.send("✅ Auto click thành công!");
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    res.status(500).send("❌ Lỗi: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
