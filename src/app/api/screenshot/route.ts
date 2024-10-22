import puppeteer from "puppeteer";


export async function GET() {
  const install = require(`puppeteer/internal/node/install.js`).downloadBrowser;
  await install();

  const browser = await puppeteer.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--single-process", "--no-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  const url = `https://news.ycombinator.com`;
  await page.goto(url);

  const [image, title] = await Promise.all([page.screenshot(), page.title()]);

  await page.close();
  await browser.close();

  return new Response(JSON.stringify({ title, image: image.toString("base64") }), {
    headers: { "Content-Type": "application/json" },
  });
}
