import fs from 'fs';
import path from 'path';
import archiverPkg from 'archiver';

const archiver = typeof archiverPkg === 'function' ? archiverPkg : archiverPkg.default || archiverPkg;

const output = fs.createWriteStream(path.join(process.cwd(), 'htdocs.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(`htdocs.zip created successfully (${archive.pointer()} total bytes)`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Append files from dist directory to root of zip
archive.directory('dist/', false);

archive.finalize();
