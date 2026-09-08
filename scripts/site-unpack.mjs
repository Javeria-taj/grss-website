/**
 * Extracts the editable page out of the single-file bundle.
 *
 * The bundle stores the real page as a JSON-escaped string inside
 * <script type="__bundler/template">. This writes that string out as ordinary
 * HTML you can edit in any editor, then site-pack.mjs puts it back.
 *
 *   node scripts/site-unpack.mjs
 *
 * Edit  site/index.html  — never line 187 of the bundle by hand.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BUNDLE = 'IEEE GRSS - Observe Beyond Vision (6).html';
const OUT = 'site/index.html';

const bundle = readFileSync(BUNDLE, 'utf8');
const lines = bundle.split('\n');

const open = lines.findIndex((l) => l.includes('<script type="__bundler/template">'));
if (open === -1) throw new Error('No __bundler/template block found.');
const close = lines.indexOf('  </script>', open);
if (close === -1) throw new Error('Unterminated __bundler/template block.');

const payload = lines.slice(open + 1, close).join('\n');
const html = JSON.parse(payload);

mkdirSync('site', { recursive: true });
writeFileSync(OUT, html);

console.log(`Unpacked ${html.length.toLocaleString()} chars -> ${OUT}`);
console.log(`(template occupied bundle lines ${open + 2}..${close})`);
