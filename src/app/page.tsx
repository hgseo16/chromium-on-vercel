"use client"; // Add this directive to mark the component as a Client Component

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [screenshotData, setScreenshotData] = useState({
    image: "",
    title: "",
    counter: 0,
  });

  const updateScreenshot = async () => {
    const response = await fetch("/api/screenshot");
    const data = await response.json();
    setScreenshotData(data);
  };

  useEffect(() => {
    updateScreenshot(); // Fetch the initial screenshot

    const intervalId = setInterval(updateScreenshot, 10000); // Set interval to update every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Screenshot refreshes every 30 seconds</h1>
      <p>Screenshot count: {screenshotData.counter}</p>
      {screenshotData.image && (
        <Image
          src={`data:image/png;base64,${screenshotData.image}`}
          alt={screenshotData.title}
          width={800}
          height={600}
        />
      )}
      <p>
        Source code:{" "}
        <Link href="https://github.com/chromium-for-lambda/chromium-on-vercel">
          github.com/chromium-for-lambda/chromium-on-vercel
        </Link>
      </p>
    </main>
  );
}
