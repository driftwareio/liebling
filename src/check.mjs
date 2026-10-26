import gscan from 'gscan';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const result = await gscan.check(root, {checkVersion: 'v6'});
const formatted = gscan.format(result);
console.log(JSON.stringify({score: formatted.results.score, error: formatted.results.error, warning: formatted.results.warning}, null, 2));
if (formatted.results.error.length || formatted.results.warning.length) process.exitCode = 1;
