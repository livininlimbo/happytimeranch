const fs = require('fs');
const path = require('path');

const copyFonts = () => {
  // Copy specific font files from public/assets/fonts
  const publicFontsDir = path.join(__dirname, '../public/assets/fonts');
  const destFontsDir = path.join(__dirname, '../dist/assets/fonts');

  // Ensure destination directory exists
  if (!fs.existsSync(destFontsDir)) {
    fs.mkdirSync(destFontsDir, { recursive: true });
  }

  // Copy only font files from public directory
  if (fs.existsSync(publicFontsDir)) {
    const files = fs.readdirSync(publicFontsDir);
    files.forEach(file => {
      if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.woff') || file.endsWith('.woff2')) {
        const sourcePath = path.join(publicFontsDir, file);
        const destPath = path.join(destFontsDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied font: ${file}`);
      }
    });
  }

  // Copy fonts.css to root of dist
  const fontsCssSource = path.join(__dirname, '../public/fonts.css');
  const fontsCssDest = path.join(__dirname, '../dist/fonts.css');
  
  if (fs.existsSync(fontsCssSource)) {
    fs.copyFileSync(fontsCssSource, fontsCssDest);
    console.log('Copied fonts.css');
  }

  // Inject font CSS into index.html
  const indexHtmlPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Check if font links are already present
    if (!htmlContent.includes('fonts.css')) {
      // Add font preloads and CSS link
      const fontLinks = `    <link rel="preload" href="./assets/fonts/Ionicons.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="./fonts.css">`;
      
      // Insert before closing head tag
      htmlContent = htmlContent.replace('</head>', `${fontLinks}\n</head>`);
      
      fs.writeFileSync(indexHtmlPath, htmlContent);
      console.log('Injected font links into index.html');
    } else {
      console.log('Font links already present in index.html');
    }
  }
};

copyFonts();