import fs from 'fs';
import path from 'path';

const duplicateFiles = [
  'mallorca-tennis-club-1964-palma.jpg',
  'poliesportiu-guillem-timoner-felanitx.jpg',
  'poliesportiu-municipal-alcudia.jpg',
  'poliesportiu-son-angelats-soller.jpg',
  'prana-yoga-studio-palma.jpg',
  'poliesportiu-melani-costa-calvia.jpg',
  'watersports-mallorca-playa-de-muro.jpg',
  'poliesportiu-torre-dels-enagistes-manacor.jpg',
  'poliesportiu-camp-esports-llucmajor.jpg',
  'tennis-club-inca-raiguer.jpg',
  'vivagym-son-moix-palma.jpg',
  'zunray-yoga-studio-palma.jpg'
];

function searchDir(dir: string): string[] {
  let res: string[] = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        res = res.concat(searchDir(p));
      }
    } else if (f.endsWith('.ts') || f.endsWith('.astro') || f.endsWith('.json')) {
      res.push(p);
    }
  }
  return res;
}

const allCodeFiles = searchDir('./src');

console.log('Searching references for the 12 duplicate image filenames:');
for (const imgName of duplicateFiles) {
  const refs: string[] = [];
  for (const file of allCodeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(imgName)) {
      refs.push(file);
    }
  }
  console.log(`\n${imgName}: (${refs.length} references)`);
  for (const r of refs) {
    console.log(`  - ${r}`);
  }
}
