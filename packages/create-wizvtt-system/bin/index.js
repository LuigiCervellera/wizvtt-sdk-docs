#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);
let targetDir = args[0];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destName = entry.name;
    if (destName === '_gitignore') {
      destName = '.gitignore';
    }
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('\x1b[35m%s\x1b[0m', '🔮 Benvenuto in create-wizvtt-system!');
  console.log('Inizializzazione ambiente di sviluppo per schede e sistemi WizVTT.\n');

  if (!targetDir) {
    targetDir = await question('Nome della cartella del progetto (es. my-vtt-system): ');
    targetDir = targetDir.trim() || 'my-vtt-system';
  }

  const systemName = await question('Nome del Gioco di Ruolo / Sistema (es. D&D 5e Custom): ') || targetDir;
  const authorName = await question('Nome Autore / Studio: ') || 'WizVTT Creator';

  rl.close();

  const root = path.resolve(process.cwd(), targetDir);
  console.log(\n📦 Creazione progetto in: \x1b[36m\x1b[0m...);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const templateDir = path.resolve(__dirname, '../templates/default');
  copyDirSync(templateDir, root);

  // Customize package.json
  const pkgPath = path.join(root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = targetDir.toLowerCase().replace(/\s+/g, '-');
    pkg.description = ${systemName} - Scheda & Regole per WizVTT;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  // Customize system definition template
  const systemIndexPath = path.join(root, 'src', 'systems', 'my-system', 'index.tsx');
  if (fs.existsSync(systemIndexPath)) {
    let sysCode = fs.readFileSync(systemIndexPath, 'utf-8');
    sysCode = sysCode.replace(/id: 'my-system'/, id: '');
    sysCode = sysCode.replace(/name: 'Custom RPG System'/, 
ame: '');
    sysCode = sysCode.replace(/author: 'Community Developer'/, uthor: '');
    fs.writeFileSync(systemIndexPath, sysCode);
  }

  console.log('\x1b[32m%s\x1b[0m', '\n✨ Progetto creato con successo!');
  console.log('\nOra puoi iniziare con i seguenti comandi:');
  console.log(  cd );
  console.log('  npm install   (oppure: bun install / pnpm install)');
  console.log('  npm run dev   (oppure: bun dev / pnpm dev)\n');
  console.log('💡 I file di configurazione AI (.cursorrules, SKILL.md) sono già inclusi!');
  console.log('Buon sviluppo con WizVTT! 🎲\n');
}

main().catch((err) => {
  console.error('Errore durante la creazione del progetto:', err);
  process.exit(1);
});
