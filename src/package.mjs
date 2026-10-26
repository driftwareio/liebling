import {ZipArchive} from 'archiver';
import {createWriteStream} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const output = createWriteStream(path.join(root, 'liebling.zip'));
const archive = new ZipArchive({zlib: {level: 9}});
const finished = new Promise((resolve, reject) => {
  output.on('close', resolve); output.on('error', reject); archive.on('error', reject);
});
archive.pipe(output);
for (const entry of await readdir(root)) {
  if (entry.endsWith('.hbs') || ['package.json', 'LICENSE'].includes(entry)) {
    archive.file(path.join(root, entry), {name: entry});
  }
}
for (const dir of ['assets', 'partials', 'locales']) {
  archive.glob('**/*', {cwd: path.join(root, dir), ignore: ['**/*.map', 'mix-manifest.json']}, {prefix: dir});
}
await archive.finalize();
await finished;
console.log(`Created liebling.zip (${archive.pointer()} bytes)`);
