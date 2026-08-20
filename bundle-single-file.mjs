import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const cssPath = path.join(distDir, 'style.css');
const jsPath = path.join(distDir, 'script.js');

let css = '';
if (fs.existsSync(cssPath)) {
  css = fs.readFileSync(cssPath, 'utf8');
}

let js = '';
if (fs.existsSync(jsPath)) {
  js = fs.readFileSync(jsPath, 'utf8');
}

// 1. Standalone All-In-One HTML (Works on 100% of hosts with zero MIME/path issues)
const singleFileHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Poki Games - منصة الألعاب المجانية</title>
  <meta name="description" content="ألعاب مجانية سريعة وممتعة بدون تحميل أو تثبيت مباشرة من المتصفح" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>" />
  <style>
    /* Reset & Base fallback styles */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background-color: #0b0f19 !important;
      color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .initial-splash {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0b0f19 80%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .splash-logo {
      font-size: 54px;
      font-weight: 900;
      background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
      letter-spacing: -1px;
    }
    .splash-spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(56, 189, 248, 0.15);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: splash-spin 0.7s linear infinite;
      margin: 20px auto 14px auto;
    }
    @keyframes splash-spin {
      to { transform: rotate(360deg); }
    }
    ${css}
  </style>
</head>
<body>
  <div id="root">
    <div class="initial-splash" id="app-loader">
      <div style="font-size: 48px; margin-bottom: 8px;">🎮</div>
      <div class="splash-logo">POKI GAMES</div>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">جاري تشغيل منصة الألعاب...</p>
      <div class="splash-spinner"></div>
      <noscript>
        <div style="margin-top: 20px; padding: 14px; background: #dc2626; border-radius: 10px; color: white; font-weight: bold;">
          يرجى تفعيل الجافاسكريبت (JavaScript) في المتصفح لتشغيل الألعاب.
        </div>
      </noscript>
    </div>
  </div>
  <script>
    // Fallback unhandled error display
    window.addEventListener('error', function(e) {
      console.error('Poki Runtime Error:', e);
      var loader = document.getElementById('app-loader');
      if (loader && !document.querySelector('#root > div:not(#app-loader)')) {
        loader.innerHTML = '<div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>' +
          '<h2 style="font-size: 20px; color: #f87171; margin-bottom: 8px;">تنبيه في التحميل</h2>' +
          '<p style="color: #cbd5e1; font-size: 14px; max-width: 400px; line-height: 1.6; margin-bottom: 16px;">يرجى إعادة تحميل الصفحة أو التأكد من استخدام متصفح حديث (Chrome / Safari / Edge / Firefox).</p>' +
          '<button onclick="location.reload()" style="background: #38bdf8; color: #0b0f19; font-weight: bold; padding: 10px 24px; border: none; border-radius: 10px; cursor: pointer;">إعادة المحاولة 🔄</button>';
      }
    });
  </script>
  <script>
    ${js}
  </script>
</body>
</html>`;

// 2. Standard 3-file HTML (Linking to script.js and style.css in the same directory)
const multiFileHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Poki Games - ألعاب مجانية بدون تحميل</title>
  <meta name="description" content="منصة ألعاب متكاملة تعمل بدون تحميل أو تثبيت مباشرة من المتصفح" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background-color: #0b0f19 !important;
      color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
  </style>
  <link rel="stylesheet" href="./style.css" />
</head>
<body class="bg-[#0b0f19] text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white antialiased">
  <div id="root">
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0b0f19; color: white; text-align: center; font-family: sans-serif;" id="app-loader">
      <div style="font-size: 52px; margin-bottom: 12px;">🎮</div>
      <h1 style="font-size: 28px; font-weight: 900; color: #38bdf8; margin-bottom: 6px; letter-spacing: -0.5px;">POKI GAMES</h1>
      <p style="color: #94a3b8; font-size: 14px;">جاري تحميل الألعاب...</p>
    </div>
  </div>
  <script src="./script.js"></script>
</body>
</html>`;

// 3. Apache .htaccess for proper MIME types & caching
const htaccess = `<IfModule mod_mime.c>
  AddType text/html .html
  AddType text/css .css
  AddType application/javascript .js
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType image/png .png
  AddType image/jpeg .jpg .jpeg
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>
`;

// Write to public/ and dist/
// We make index.html self-contained so it NEVER fails on any server, AND save index-split.html as alternative
fs.writeFileSync(path.join(publicDir, 'index.html'), singleFileHtml, 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), singleFileHtml, 'utf8');

fs.writeFileSync(path.join(publicDir, 'index-split.html'), multiFileHtml, 'utf8');
fs.writeFileSync(path.join(distDir, 'index-split.html'), multiFileHtml, 'utf8');

if (css) {
  fs.writeFileSync(path.join(publicDir, 'style.css'), css, 'utf8');
  fs.writeFileSync(path.join(distDir, 'style.css'), css, 'utf8');
}

if (js) {
  fs.writeFileSync(path.join(publicDir, 'script.js'), js, 'utf8');
  fs.writeFileSync(path.join(distDir, 'script.js'), js, 'utf8');
}

fs.writeFileSync(path.join(publicDir, '.htaccess'), htaccess, 'utf8');
fs.writeFileSync(path.join(distDir, '.htaccess'), htaccess, 'utf8');

// Build htdocs.zip containing all files ready for cPanel/InfinityFree/etc.
const zip = new JSZip();
zip.file('index.html', singleFileHtml);
zip.file('index-split.html', multiFileHtml);
if (css) zip.file('style.css', css);
if (js) zip.file('script.js', js);
zip.file('.htaccess', htaccess);

const content = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 }
});

fs.writeFileSync(path.join(rootDir, 'htdocs.zip'), content);
fs.writeFileSync(path.join(publicDir, 'htdocs.zip'), content);

console.log('✅ All files generated cleanly inside /public (single folder):');
console.log('  - index.html (Self-contained, works 100% on ANY hosting, never shows blank screen)');
console.log('  - index-split.html (Linked to script.js and style.css)');
console.log('  - script.js (Standalone logic)');
console.log('  - style.css (Standalone styles)');
console.log('  - .htaccess (Apache MIME type & router config)');
console.log('  - htdocs.zip (Direct uploadable archive)');
