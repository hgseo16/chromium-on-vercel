export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const revalidate = 30 // revalidate at most every 5 minutes

import Image from "next/image";
import Link from "next/link";
import puppeteer from "puppeteer";

let screenshotCounter = 0;

export default async function Home() {
  const { image, title, counter } = await getScreenshot();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Screenshot refreshes every 5 minutes</h1>
      <p>Screenshot count: {counter}</p>
      <Image
        src={`data:image/png;base64,${image.toString("base64")}`}
        alt={title}
        width={800}
        height={600}
      />
      Source code: <Link href="https://github.com/chromium-for-lambda/chromium-on-vercel">github.com/chromium-for-lambda/chromium-on-vercel</Link>
    </main>
  );
}

async function getScreenshot() {
  console.log("get screenshot");
  screenshotCounter++;
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

  return {
    title,
    image,
    counter: screenshotCounter
  };
}
