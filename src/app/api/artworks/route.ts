// app/api/proxy/artworks/route.ts
import { NextResponse } from "next/server";

/**
 * MOCK: liefert Demo-Artworks mit Base64-Bildern
 * → ersetzt Backend für lokale Tests
 */
export async function GET() {
  const items = [
    {
      id: "1",
      title: "Neon Doodle",
      author: "Mock Artist",
      mime: "image/png",
      // tiny pink square PNG
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAI0lEQVQoU2NkYGBg+M8ABYwMjIwgFoYmBqYGigBkA1OwEAwAwZgswM6AQBwAAAABJRU5ErkJggg==",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Green Glitch",
      author: "Mock User",
      mime: "image/png",
      // tiny green square PNG
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIklEQVQoU2NkYGBg+A8EwDiQYGBg+M/AwPCfgYGB4T8DAwMAAAxRAwFVrD3RAAAAAElFTkSuQmCC",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Blue Tape",
      author: "Anonymous",
      mime: "image/png",
      // tiny blue square PNG
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQoU2NkQAP///8/AwPDfwYGBgYGBob///8ZGBgYAwCGEA0r6r3xNwAAAABJRU5ErkJggg==",
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json({ items, nextCursor: null }, { status: 200 });
}
