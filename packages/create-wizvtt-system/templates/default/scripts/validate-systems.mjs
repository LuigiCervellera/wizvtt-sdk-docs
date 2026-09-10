import fs from 'fs';
import path from 'path';

const SYSTEMS_DIR = path.resolve(process.cwd(), 'src/systems');
const FORBIDDEN_PATTERNS = [
  { pattern: /\beval\s*\(/g, name: 'eval() is forbidden' },
  { pattern: /\bFunction\s*\(/g, name: 'Function constructor is forbidden' },
  { pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi, name: 'Inline <script> tags are forbidden' },
  { pattern: /javascript:/gi, name: 'javascript: protocol is forbidden' },
  { pattern: /window\.localStorage|window\.sessionStorage|document\.cookie/g, name: 'Direct browser storage manipulation is forbidden' },
  { pattern: /fetch\s*\(|XMLHttpRequest/g, name: 'Arbitrary network calls from sheet components are forbidden' }
];

function scanFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(process.cwd(), filePath);
  const errors = [];
  const warnings = [];

  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(content)) {
      errors.push('Security Violation: ' + rule.name);
    }
  }

  if (filePath.endsWith('index.tsx') || filePath.endsWith('index.ts')) {
    if (!content.includes('id:') || !content.includes('name:') || !content.includes('version:')) {
      warnings.push('System definition may be missing required metadata fields (id, name, version).');
    }
  }

  return { file: relPath, errors, warnings };
}

async function run() {
  console.log('🛡️  Running WizVTT Community System Security & Schema Audit...\n');
  const files = scanFiles(SYSTEMS_DIR);
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const res = validateFile(file);
    if (res.errors.length > 0 || res.warnings.length > 0) {
      console.log('📄 \x1b[36m' + res.file + '\x1b[0m');
      res.errors.forEach(e => { console.log('   ❌ \x1b[31m' + e + '\x1b[0m'); totalErrors++; });
      res.warnings.forEach(w => { console.log('   ⚠️  \x1b[33m' + w + '\x1b[0m'); totalWarnings++; });
      console.log('');
    }
  }

  if (totalErrors > 0) {
    console.error('\n❌ CI Audit Failed with ' + totalErrors + ' security/schema error(s). Review required!\n');
    process.exit(1);
  }

  console.log('\n✅ CI Audit Passed! All ' + files.length + ' files conform to WizVTT security standards. (Warnings: ' + totalWarnings + ')\n');
}

run();
