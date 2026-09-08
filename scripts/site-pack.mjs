/**
 * Puts site/index.html back into the single-file bundle.
 *
 * Re-escapes the page and replaces the __bundler/template block, leaving every
 * other byte of the bundle — including the 1.1 MB asset manifest — untouched.
 *
 *   node scripts/site-pack.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BUNDLE = 'IEEE GRSS - Observe Beyond Vision (6).html';
const SRC = 'site/index.html';

const bundle = readFileSync(BUNDLE, 'utf8');
const html = readFileSync(SRC, 'utf8');
const lines = bundle.split('\n');

const open = lines.findIndex((l) => l.includes('<script type="__bundler/template">'));
if (open === -1) throw new Error('No __bundler/template block found.');
const close = lines.indexOf('  </script>', open);
if (close === -1) throw new Error('Unterminated __bundler/template block.');

// Escape the slash of every closing tag as \u002F, exactly as the original
// bundler did (251 of them in the shipped page). Two reasons: it keeps the file
// byte-stable, so a content diff shows only what you actually changed, and it
// makes a literal </script> inside the page impossible — that would close the
// tag early and blank the site.
const payload = JSON.stringify(html).replace(/<\//g, '<\\u002F');

const rebuilt = [...lines.slice(0, open + 1), payload, ...lines.slice(close)].join('\n');
writeFileSync(BUNDLE, rebuilt);

// Re-read and re-parse: proves the bundle we just wrote is still decodable.
const check = readFileSync(BUNDLE, 'utf8').split('\n');
const o = check.findIndex((l) => l.includes('<script type="__bundler/template">'));
const c = check.indexOf('  </script>', o);
const roundTripped = JSON.parse(check.slice(o + 1, c).join('\n'));
if (roundTripped !== html) throw new Error('Round-trip mismatch — bundle NOT written safely.');

console.log(`Packed ${html.length.toLocaleString()} chars into the bundle.`);
console.log(`Bundle is now ${readFileSync(BUNDLE).length.toLocaleString()} bytes. Verified decodable.`);
