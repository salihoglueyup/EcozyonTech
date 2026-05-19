const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
let totalFixes = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  
  // 1. Fix aliased hook calls: useRefE(), useStateApp(), useMemoF(), useEffectF() etc.
  const hookAliases = [
    /\buseState\w+\s*\(/g,
    /\buseEffect\w+\s*\(/g,
    /\buseRef\w+\s*\(/g,
    /\buseMemo\w+\s*\(/g,
    /\buseCallback\w+\s*\(/g,
    /\buseContext\w+\s*\(/g,
  ];
  
  const hookBase = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext'];
  
  for (let i = 0; i < hookAliases.length; i++) {
    const regex = hookAliases[i];
    const base = hookBase[i];
    c = c.replace(regex, (match) => {
      // Only replace if it's an aliased version (has extra chars after base name)
      const funcName = match.replace('(', '').trim();
      if (funcName !== base && funcName.startsWith(base)) {
        console.log(`  ${file}: ${funcName}() → ${base}()`);
        return base + '(';
      }
      return match;
    });
  }
  
  // 2. Also check for React.useMemo etc where useMemo is not imported  
  // Replace React.useState(...) with useState(...) if useState is already in import
  const importMatch = c.match(/import\s+React\s*,\s*\{([^}]+)\}\s*from\s*['"]react['"]/);
  if (importMatch) {
    const importedHooks = importMatch[1].split(',').map(s => s.trim());
    for (const hook of importedHooks) {
      const reactDot = new RegExp(`React\\.${hook}\\b`, 'g');
      if (reactDot.test(c)) {
        c = c.replace(reactDot, hook);
        console.log(`  ${file}: React.${hook} → ${hook}`);
      }
    }
  }

  if (c !== orig) {
    fs.writeFileSync(fp, c);
    totalFixes++;
  }
}

console.log(`\n✅ Fixed ${totalFixes} file(s)`);
