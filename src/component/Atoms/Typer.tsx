"use client";
import { useState, useEffect } from "react";
export default function Typer({
  paragraph,
  delay,
  interval,
}: {
  paragraph: string;
  delay?: number;
  interval: number;
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    const words = paragraph.split("");
    let index = 0;
  
    const timeouts: NodeJS.Timeout[] = [];
  
    words.forEach((char) => {
      const timeout = setTimeout(() => {
        setText((prev) => prev + char);
      }, (delay || 0) + index * interval);
      timeouts.push(timeout);
      index++;
    });
  
    return () => {
      timeouts.forEach(clearTimeout);
      setText(""); // Reset jika paragraph berubah
    };
  }, [paragraph, delay, interval]);
  
  return <>{text}</>;
}
