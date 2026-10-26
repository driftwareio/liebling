import {spawnSync} from 'node:child_process';
const result = spawnSync('npm', ['audit', '--json'], {cwd: new URL('.', import.meta.url), encoding: 'utf8'});
let audit;
try { audit = JSON.parse(result.stdout); } catch { throw new Error(result.stderr || 'npm audit failed'); }
if (audit.error) throw new Error(JSON.stringify(audit.error));
// No fixed release of extract-zip exists as of 2026-10-26. GScan is only used
// through check(directory), never checkZip(untrustedArchive). See docs/maintenance.md.
const allowed = new Set(['@tryghost/zip', 'extract-zip', 'gscan']);
const vulnerabilities = audit.vulnerabilities || {};
const unexpected = Object.entries(vulnerabilities).filter(([name, value]) => {
  if (!allowed.has(name)) return true;
  return value.via.some(via => typeof via === 'string' ? !allowed.has(via) : ![
    'GHSA-jmr9-qjv8-65gv', 'GHSA-7pqw-9j4j-h8q3'
  ].some(id => via.url?.endsWith(id)));
});
console.log(JSON.stringify(audit.metadata?.vulnerabilities));
if (Object.keys(vulnerabilities).length) console.log('Known GScan extract-zip advisory chain:', Object.keys(vulnerabilities).filter(n => allowed.has(n)).join(', '));
if (unexpected.length) { console.error(JSON.stringify(unexpected, null, 2)); process.exitCode = 1; }
