const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🟢 Server is running! Visit /run to trigger Puppeteer.");
});

app.get("/run", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://shophoadatviet.com", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const clickable = await page.$("a, button");
    if (clickable) {
      await clickable.click();
      console.log("✅ Click thành công!");
    }

    await page.waitForTimeout(3000);
    await browser.close();

    res.send("✅ Đã truy cập và click thành công!");
  } catch (e) {
    console.error("❌ Lỗi:", e.message);
    res.status(500).send("❌ Lỗi: " + e.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
