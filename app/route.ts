import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // If explicitly requesting landing page via query param (?landing=1, ?skipInit=1, ?home=1)
  if (searchParams.has('landing') || searchParams.has('skipInit') || searchParams.has('home')) {
    const landingPath = path.join(
      process.cwd(),
      'IEEE GRSS - Observe Beyond Vision (6).html'
    );
    const html = readFileSync(landingPath);
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  // Mission initialization comes before the landing page
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
