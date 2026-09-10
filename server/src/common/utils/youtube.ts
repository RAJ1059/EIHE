import { BadRequestException } from "@nestjs/common";

const PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

export function extractYoutubeVideoId(url: string): string {
  for (const pattern of PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  throw new BadRequestException(
    "Could not recognize that as a YouTube URL (expected a watch?v=, youtu.be/, or embed/ link).",
  );
}
