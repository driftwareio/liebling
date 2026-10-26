import Handlebars from '../src/node_modules/handlebars/lib/index.js';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
export function render(template, {showTitle = true, members = true} = {}) {
  const h = Handlebars.create();
  const blocks = {};
  const safe = value => new h.SafeString(value);
  for (const file of readdirSync(new URL('partials/', root))) {
    if (file.endsWith('.hbs')) h.registerPartial(path.basename(file, '.hbs'), read(`partials/${file}`));
  }
  const author = {name: 'Test author', url: '/author/test/', bio: 'Author biography'};
  const posts = Array.from({length: 3}, (_, i) => ({id: String(i), title: `Test article ${i}`, url: `/article-${i}/`, published_at: '2026-10-26', primary_author: author, authors: [author], tags: []}));
  const cards = `<p><a id="text-link" href="/visited/">Text link</a></p>
    <figure class="kg-card kg-image-card"><img width="800" height="450" alt="Test" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23ccc'/%3E%3C/svg%3E"></figure>
    <figure class="kg-card kg-embed-card"><iframe title="Embed" src="about:blank" width="560" height="315"></iframe></figure>
    <div class="kg-card kg-callout-card"><div class="kg-callout-text">Callout example</div></div>
    <div class="kg-card kg-toggle-card"><button class="kg-toggle-card-icon">Toggle</button></div>`;
  const post = {...posts[0], title: 'Test post', html: cards, tags: []};
  const context = {post, posts, pagination: {page: 1, pages: 1, total: 3}, meta_title: 'Liebling test'};
  const data = {site: {title: 'Liebling test', description: 'Theme preview', locale: 'en', url: 'http://127.0.0.1:4173', members_enabled: members}, custom: {enable_native_search: true}, page: {show_title_and_feature_image: showTitle}};
  h.registerHelper('asset', name => `/assets/${name}`);
  h.registerHelper('t', text => text);
  h.registerHelper('post', function(o) { return o.fn(post); });
  h.registerHelper('foreach', function(items, o) { return h.helpers.each.call(this, items, o); });
  h.registerHelper('get', function(type, o) {
    const values = type === 'posts' ? posts : [];
    const ctx = {...this, [type]: values};
    return o.fn(ctx, {blockParams: [values]});
  });
  h.registerHelper('contentFor', function(name, o) { blocks[name] = (blocks[name] || '') + o.fn(this); return ''; });
  h.registerHelper('block', name => safe(blocks[name] || ''));
  h.registerHelper('content', function() { return safe(this.html || ''); });
  h.registerHelper('date', () => '26 October 2026');
  h.registerHelper('url', function() { return this.url || '/'; });
  h.registerHelper('img_url', value => value);
  h.registerHelper('is', function(value, o) { return value.includes(template === 'index' ? 'home' : template) ? o.fn(this) : o.inverse(this); });
  h.registerHelper('has', function(o) { return o.inverse(this); });
  h.registerHelper('encode', value => encodeURIComponent(value));
  for (const name of ['authors', 'reading_time', 'pagination', 'social_url', 'body_class', 'post_class', 'ghost_head', 'ghost_foot', 'plural']) h.registerHelper(name, () => '');
  const body = h.compile(read(`${template}.hbs`))(context, {data});
  return h.compile(read('default.hbs'))({...context, body}, {data});
}
