import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {render} from './render.mjs';
const root = new URL('../', import.meta.url);
test('installable archive excludes tooling, vendor bundles and legacy consent code', () => {
  const zip = new URL('liebling.zip', root);
  const entries = execFileSync('unzip', ['-Z1', zip.pathname], {encoding: 'utf8'}).trim().split('\n');
  assert.ok(entries.includes('default.hbs'));
  assert.ok(entries.includes('assets/js/app.js'));
  assert.ok(!entries.some(p => /^(src|tests|docs|\.github|node_modules)\//.test(p)));
  assert.ok(!entries.some(p => /vendor|manifest\.js|consent|cookie|workerd/i.test(p)));
  for (const name of entries.filter(p => /\.(hbs|js|css|json)$/.test(p))) {
    const text = execFileSync('unzip', ['-p', zip.pathname, name], {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024});
    assert.doesNotMatch(text, /cookieconsent|usercentrics|consent-bootstrap|data-category|privacy-proxy|CookieConsent/i, name);
  }
});
test('page editor setting hides title and feature image while preserving page content', () => {
  assert.match(render('page'), /<h1[^>]*>Test post<\/h1>/);
  const hidden = render('page', {showTitle: false});
  assert.doesNotMatch(hidden, /<h1/);
  assert.match(hidden, /Text link/);
  assert.match(hidden, /<header class="m-header/);
});
test('Ghost native search, card assets, hooks and member forms remain available', () => {
  const html = render('post');
  assert.match(html, /data-ghost-search/);
  assert.match(html, /data-members-form="subscribe"/);
  const pkg = JSON.parse(readFileSync(new URL('package.json', root)));
  assert.equal(pkg.config.card_assets, true);
  const source = readFileSync(new URL('default.hbs', root), 'utf8');
  assert.match(source, /\{\{ghost_head\}\}/);
  assert.match(source, /\{\{ghost_foot\}\}/);
  assert.doesNotMatch(render('post', {members: false}), /data-members-form/);
});
test('only local theme code is compiled, browser libraries stay pinned CDN imports', () => {
  for (const file of readdirSync(new URL('assets/js/', root))) {
    const source = readFileSync(new URL(`assets/js/${file}`, root), 'utf8');
    assert.match(source, /https:\/\/cdn\.jsdelivr\.net\/npm\/.+@\d+\.\d+\.\d+/);
    assert.ok(source.length < 25000, `${file} unexpectedly contains a bundled runtime`);
  }
});
