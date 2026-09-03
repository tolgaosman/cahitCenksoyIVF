const fs = require('fs');
const path = require('path');

const targetDir = __dirname;

const replacements = [
  { search: /c_cenksoy@hotmail\.com/g, replace: 'contact@johndoe.com' },
  { search: /ufukozbas0675@gmail\.com/g, replace: 'manager@johndoe.com' },
  { search: /admin@cahitcenksoy\.com/g, replace: 'admin@johndoe.com' },
  { search: /\+90 548 888 0 112/g, replace: '+1 555 123 45 67' },
  { search: /\+905488880112/g, replace: '+15551234567' },
  { search: /\+90 542 888 0 112/g, replace: '+1 555 987 65 43' },
  { search: /\+905428880112/g, replace: '+15559876543' },
  { search: /\+90 392 444 0 112/g, replace: '+1 555 444 00 00' },
  { search: /\+903924440112/g, replace: '+15554440000' },
  { search: /\+90 533 868 1983/g, replace: '+1 555 555 55 55' },
  { search: /\+905338681983/g, replace: '+15555555555' },
  { search: /Cahit Cenksoy/g, replace: 'John Doe' },
  { search: /cahit cenksoy/gi, replace: 'john doe' },
  { search: /cahitcenksoy/gi, replace: 'johndoe' },
  { search: /cahit/gi, replace: 'john' },
  { search: /cenksoy/gi, replace: 'doe' },
  { search: /Lefkoşa Sevinç/g, replace: 'Central General' },
  { search: /Sevinç Hastanesi/gi, replace: 'General Hospital' },
  { search: /Sevinç/gi, replace: 'General' },
  { search: /Hayriye Karakaya/g, replace: 'Jane Smith' },
  { search: /Elham/g, replace: 'Emma' },
  { search: /Gülseren/g, replace: 'Olivia' },
  { search: /Güneş/g, replace: 'Sophia' },
  { search: /Hayriye/g, replace: 'Isabella' },
  { search: /Selcan/g, replace: 'Mia' },
  { search: /Zekiye/g, replace: 'Ava' },
  
  // Image replacements
  { search: /cahit\.jpg/g, replace: 'https://via.placeholder.com/800x600?text=John+Doe' },
  { search: /cahitSignature\.png/g, replace: 'https://via.placeholder.com/200x50?text=Signature' },
  { search: /cahitSignature_white\.png/g, replace: 'https://via.placeholder.com/200x50?text=Signature' },
  { search: /ekip\.jpeg/g, replace: 'https://via.placeholder.com/800x400?text=Team' },
  { search: /elham\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Emma' },
  { search: /gulseren\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Olivia' },
  { search: /gunes\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Sophia' },
  { search: /hayriye\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Isabella' },
  { search: /selcan\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Mia' },
  { search: /zekiye\.jpg/g, replace: 'https://via.placeholder.com/400x400?text=Ava' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file !== '.git' && file !== 'node_modules' && file !== '.agents' && file !== 'admin') {
        processDirectory(fullPath);
      } else if (file === 'admin') { // process admin subfolder too
        processDirectory(fullPath);
      }
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.html', '.js', '.css', '.md', '.json', '.rules', '.py'].includes(ext)) {
        if (file === 'skills-lock.json' || file === 'anonymize.js') continue;
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const replacement of replacements) {
          if (replacement.search.test(content)) {
            content = content.replace(replacement.search, replacement.replace);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

const imagesToDelete = [
  'cahit.jpg',
  'cahitSignature.png',
  'cahitSignature_white.png',
  'ekip.jpeg',
  'elham.jpg',
  'gulseren.jpg',
  'gunes.jpg',
  'hayriye.jpg',
  'selcan.jpg',
  'zekiye.jpg'
];

function deleteImages() {
  for (const image of imagesToDelete) {
    const fullPath = path.join(targetDir, image);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${fullPath}`);
    }
  }
}

console.log('Starting anonymization process...');
processDirectory(targetDir);
deleteImages();
console.log('Anonymization complete.');
