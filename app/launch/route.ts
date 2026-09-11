import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  const initPath = path.join(
    process.cwd(),
    'grss-mission-initialization (6).html'
  );
  const html = readFileSync(initPath);
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
