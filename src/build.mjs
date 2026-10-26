import {build, context} from 'esbuild';
import * as sass from 'sass';
import {readdir, mkdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const options = {
  absWorkingDir: root,
  entryPoints: ['app', 'home', 'post', 'page'].map(name => `src/js/${name}.js`),
  outdir: 'assets/js', bundle: true, format: 'esm', minify: true,
  target: ['es2022'], external: ['https://*'], metafile: true
};
await rm(path.join(root, 'assets/js'), {recursive: true, force: true});
await mkdir(path.join(root, 'assets/css'), {recursive: true});
async function styles() {
  for (const name of await readdir(path.join(root, 'src/sass'))) {
    if (!name.endsWith('.scss')) continue;
    const result = await sass.compileAsync(path.join(root, 'src/sass', name), {
      style: 'compressed', silenceDeprecations: ['import', 'global-builtin', 'color-functions']
    });
    await writeFile(path.join(root, 'assets/css', name.replace('.scss', '.css')), result.css);
  }
}
await styles();
if (process.argv.includes('--watch')) {
  const ctx = await context(options);
  await ctx.watch();
  const {watch} = await import('node:fs');
  watch(path.join(root, 'src/sass'), {recursive: true}, () => styles().catch(console.error));
} else {
  const result = await build(options);
  if (Object.keys(result.metafile.inputs).some(name => name.includes('node_modules'))) {
    throw new Error('Runtime libraries must remain CDN imports');
  }
}
