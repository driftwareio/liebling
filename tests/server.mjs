import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {render} from './render.mjs';
const root = new URL('../', import.meta.url);
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname.startsWith('/assets/')) {
    try {
      const file = await readFile(new URL(`.${pathname}`, root));
      res.setHeader('Content-Type', pathname.endsWith('.js') ? 'application/javascript' : pathname.endsWith('.css') ? 'text/css' : 'application/octet-stream');
      res.end(file);
    } catch {res.writeHead(404); res.end();}
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end(render(pathname === '/' ? 'index' : 'post'));
  }
}).listen(4173, '127.0.0.1');
