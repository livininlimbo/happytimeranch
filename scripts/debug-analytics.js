#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.cyan}${msg}${colors.reset}`),
  subheader: (msg) => console.log(`${colors.bold}${msg}${colors.reset}`)
};

// Required imports for analytics tracking
const requiredImports = {
  react: ['React'],
  'expo-router': ['useFocusEffect'],
  '../assets/components/analytics': ['trackScreenView']
};

// Required function calls
const requiredFunctionCalls = [
  'useFocusEffect',
  'React.useCallback',
  'trackScreenView'
];

function analyzeFile(filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const results = {
    fileName,
    filePath,
    hasReactImport: false,
    hasUseFocusEffectImport: false,
    hasTrackScreenViewImport: false,
    hasUseFocusEffectCall: false,
    hasReactCallbackCall: false,
    hasTrackScreenViewCall: false,
    screenName: null,
    issues: []
  };

  // Check for React import
  if (content.includes("import React") || content.includes("from 'react'")) {
    results.hasReactImport = true;
  } else {
    results.issues.push('Missing React import');
  }

  // Check for useFocusEffect import
  if (content.includes('useFocusEffect') && content.includes('expo-router')) {
    results.hasUseFocusEffectImport = true;
  } else {
    results.issues.push('Missing useFocusEffect import from expo-router');
  }

  // Check for trackScreenView import
  if (content.includes('trackScreenView') && content.includes('../assets/components/analytics')) {
    results.hasTrackScreenViewImport = true;
  } else {
    results.issues.push('Missing trackScreenView import from analytics');
  }

  // Check for useFocusEffect function call
  if (content.includes('useFocusEffect(')) {
    results.hasUseFocusEffectCall = true;
  } else {
    results.issues.push('Missing useFocusEffect() function call');
  }

  // Check for React.useCallback call
  if (content.includes('React.useCallback(')) {
    results.hasReactCallbackCall = true;
  } else {
    results.issues.push('Missing React.useCallback() call');
  }

  // Check for trackScreenView call and extract screen name
  const trackScreenViewMatch = content.match(/trackScreenView\(['"`]([^'"`]+)['"`]\)/);
  if (trackScreenViewMatch) {
    results.hasTrackScreenViewCall = true;
    results.screenName = trackScreenViewMatch[1];
  } else {
    results.issues.push('Missing trackScreenView() call or invalid screen name');
  }

  // Check for proper useFocusEffect structure
  const useFocusEffectPattern = /useFocusEffect\s*\(\s*React\.useCallback\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?trackScreenView\s*\(/;
  if (!useFocusEffectPattern.test(content)) {
    results.issues.push('Improper useFocusEffect structure - should use React.useCallback with trackScreenView');
  }

  return results;
}

function analyzeLayoutFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const results = {
    fileName: path.basename(filePath),
    filePath,
    hasReactImport: false,
    hasUseEffectImport: false,
    hasInitAnalyticsImport: false,
    hasUseEffectCall: false,
    hasInitAnalyticsCall: false,
    issues: []
  };

  // Check for React import (can be default import or might not be needed with new JSX transform)
  if (content.includes("import React") || content.includes("from 'react'")) {
    results.hasReactImport = true;
  }

  // Check for useEffect import (can be with React or separate from 'react')
  if (content.includes("useEffect") && content.includes("from 'react'")) {
    results.hasUseEffectImport = true;
  }

  // Add issues if missing (but be more lenient for layout files)
  if (!results.hasReactImport && !results.hasUseEffectImport) {
    results.issues.push('Missing React or useEffect import from react');
  } else if (!results.hasUseEffectImport) {
    results.issues.push('Missing useEffect import from react');
  }

  // Check for initAnalytics import
  if (content.includes('initAnalytics') && content.includes('../assets/components/analytics')) {
    results.hasInitAnalyticsImport = true;
  } else {
    results.issues.push('Missing initAnalytics import from analytics');
  }

  // Check for useEffect call
  if (content.includes('useEffect(')) {
    results.hasUseEffectCall = true;
  } else {
    results.issues.push('Missing useEffect() call');
  }

  // Check for initAnalytics call
  if (content.includes('initAnalytics()')) {
    results.hasInitAnalyticsCall = true;
  } else {
    results.issues.push('Missing initAnalytics() call');
  }

  return results;
}

function getAppFiles() {
  const appDir = path.join(process.cwd(), 'app');
  const files = [];
  
  try {
    const entries = fs.readdirSync(appDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.tsx') && entry.name !== '_layout.tsx') {
        files.push(path.join(appDir, entry.name));
      }
    }
  } catch (error) {
    log.error(`Error reading app directory: ${error.message}`);
  }
  
  return files;
}

function generateReport(results, layoutResult) {
  log.header('\n📊 ANALYTICS TRACKING DEBUG REPORT');
  log.header('=====================================\n');

  // Layout file analysis
  log.subheader('🏗️  Layout File Analysis (_layout.tsx)');
  console.log(`File: ${layoutResult.fileName}`);
  
  if (layoutResult.issues.length === 0) {
    log.success('Layout file is properly configured for analytics initialization');
  } else {
    log.error('Layout file has issues:');
    layoutResult.issues.forEach(issue => log.error(`  - ${issue}`));
  }
  
  console.log(`  React/useEffect Import: ${layoutResult.hasReactImport && layoutResult.hasUseEffectImport ? '✅' : '❌'}`);
  console.log(`  initAnalytics Import: ${layoutResult.hasInitAnalyticsImport ? '✅' : '❌'}`);
  console.log(`  useEffect Call: ${layoutResult.hasUseEffectCall ? '✅' : '❌'}`);
  console.log(`  initAnalytics Call: ${layoutResult.hasInitAnalyticsCall ? '✅' : '❌'}`);
  
  console.log('\n');

  // Screen files analysis
  log.subheader('📱 Screen Files Analysis');
  
  let totalFiles = results.length;
  let fullyCompliant = 0;
  let hasIssues = 0;

  results.forEach((result, index) => {
    const isCompliant = result.issues.length === 0;
    if (isCompliant) {
      fullyCompliant++;
    } else {
      hasIssues++;
    }

    console.log(`\n${index + 1}. ${result.fileName}`);
    console.log(`   Screen Name: ${result.screenName || 'NOT FOUND'}`);
    console.log(`   Status: ${isCompliant ? '✅ COMPLIANT' : '❌ HAS ISSUES'}`);
    
    if (!isCompliant) {
      console.log('   Issues:');
      result.issues.forEach(issue => {
        console.log(`     - ${issue}`);
      });
    }
    
    console.log(`   Imports: React(${result.hasReactImport ? '✅' : '❌'}) | useFocusEffect(${result.hasUseFocusEffectImport ? '✅' : '❌'}) | trackScreenView(${result.hasTrackScreenViewImport ? '✅' : '❌'})`);
    console.log(`   Calls: useFocusEffect(${result.hasUseFocusEffectCall ? '✅' : '❌'}) | React.useCallback(${result.hasReactCallbackCall ? '✅' : '❌'}) | trackScreenView(${result.hasTrackScreenViewCall ? '✅' : '❌'})`);
  });

  // Summary
  log.header('\n📋 SUMMARY');
  log.header('===========');
  console.log(`Total screen files analyzed: ${totalFiles}`);
  console.log(`Fully compliant files: ${fullyCompliant} (${Math.round((fullyCompliant/totalFiles)*100)}%)`);
  console.log(`Files with issues: ${hasIssues} (${Math.round((hasIssues/totalFiles)*100)}%)`);
  
  if (layoutResult.issues.length === 0 && hasIssues === 0) {
    log.success('\n🎉 All files are properly configured for analytics tracking!');
  } else {
    log.warning('\n⚠️  Some files need attention. Please review the issues above.');
  }

  // Screen names list
  log.header('\n📝 TRACKED SCREEN NAMES');
  log.header('=======================');
  const screenNames = results
    .filter(r => r.screenName)
    .map(r => r.screenName)
    .sort();
  
  if (screenNames.length > 0) {
    screenNames.forEach(name => console.log(`  - ${name}`));
  } else {
    log.warning('No screen names found!');
  }
}

function main() {
  log.header('🔍 Starting Analytics Tracking Debug Analysis...\n');

  // Analyze layout file
  const layoutPath = path.join(process.cwd(), 'src', '_layout.tsx');
  let layoutResult = null;
  
  if (fs.existsSync(layoutPath)) {
    layoutResult = analyzeLayoutFile(layoutPath);
  } else {
    log.error('Layout file not found at src/_layout.tsx');
    process.exit(1);
  }

  // Get and analyze all app files
  const appFiles = getAppFiles();
  
  if (appFiles.length === 0) {
    log.error('No .tsx files found in app directory');
    process.exit(1);
  }

  log.info(`Found ${appFiles.length} screen files to analyze`);

  const results = appFiles.map(analyzeFile);

  // Generate report
  generateReport(results, layoutResult);

  // Exit with appropriate code
  const hasAnyIssues = layoutResult.issues.length > 0 || results.some(r => r.issues.length > 0);
  process.exit(hasAnyIssues ? 1 : 0);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, analyzeLayoutFile, generateReport };