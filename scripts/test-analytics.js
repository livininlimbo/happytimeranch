#!/usr/bin/env node

// Simple test runner for analytics tracking
const { analyzeFile, analyzeLayoutFile, generateReport } = require('./debug-analytics');
const fs = require('fs');
const path = require('path');

// Quick test function
function quickTest() {
  console.log('🧪 Quick Analytics Test\n');
  
  const appDir = path.join(process.cwd(), 'app');
  const layoutPath = path.join(process.cwd(), 'src', '_layout.tsx');
  
  // Test a few key files
  const testFiles = [
    'index.tsx',
    'candles.tsx', 
    'cart.tsx',
    'contact.tsx'
  ].map(f => path.join(appDir, f)).filter(f => fs.existsSync(f));

  console.log(`Testing ${testFiles.length} key files...\n`);

  let allGood = true;

  // Test layout
  if (fs.existsSync(layoutPath)) {
    const layoutResult = analyzeLayoutFile(layoutPath);
    console.log(`Layout (_layout.tsx): ${layoutResult.issues.length === 0 ? '✅' : '❌'}`);
    if (layoutResult.issues.length > 0) {
      allGood = false;
      layoutResult.issues.forEach(issue => console.log(`  - ${issue}`));
    }
  }

  // Test screen files
  testFiles.forEach(filePath => {
    const result = analyzeFile(filePath);
    const fileName = path.basename(filePath);
    console.log(`${fileName}: ${result.issues.length === 0 ? '✅' : '❌'} (Screen: ${result.screenName || 'MISSING'})`);
    
    if (result.issues.length > 0) {
      allGood = false;
      result.issues.forEach(issue => console.log(`  - ${issue}`));
    }
  });

  console.log(`\n${allGood ? '✅ Quick test passed!' : '❌ Issues found. Run full debug for details.'}`);
  return allGood;
}

if (require.main === module) {
  const passed = quickTest();
  process.exit(passed ? 0 : 1);
}

module.exports = { quickTest };