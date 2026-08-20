import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addDirectoryToZip(dirPath, zipFolder) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirectoryToZip(fullPath, subFolder);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

addDirectoryToZip('dist', zip);

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  .then((content) => {
    fs.writeFileSync('htdocs.zip', content);
    console.log('htdocs.zip created successfully!');
  })
  .catch((err) => {
    console.error('Error generating zip:', err);
  });
