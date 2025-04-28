/**
 * Link Checker Script for Rust Rocket Website
 * 
 * This script scans HTML files in the directory for links and checks if the targets exist.
 * It reports any broken internal links or references to missing pages.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');

// Configuration
const config = {
  rootDir: './',
  skipExternal: true, // Skip checking external links (http, https, etc.)
  checkAnchors: true, // Check if anchor (#section) targets exist
  fileExtensions: ['.html'],
  ignorePatterns: [
    'mailto:', // Ignore email links
    'tel:', // Ignore telephone links
    '#', // Ignore empty anchor links
    'javascript:' // Ignore javascript: links
  ]
};

// Store results
const results = {
  scanned: 0,
  broken: [],
  working: [],
  total: 0
};

// Get all HTML files
function getHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (item !== 'node_modules' && !item.startsWith('.')) {
        files = files.concat(getHtmlFiles(fullPath));
      }
    } else if (config.fileExtensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Check if a link target exists
function checkLinkTarget(target, basePath) {
  // Handle special cases
  if (config.ignorePatterns.some(pattern => target.startsWith(pattern))) {
    return true;
  }
  
  // Skip external links if configured
  if (config.skipExternal && (target.startsWith('http://') || target.startsWith('https://'))) {
    return true;
  }
  
  // Parse the link
  let filePath = target;
  let anchor = '';
  
  // Handle anchors
  if (target.includes('#')) {
    [filePath, anchor] = target.split('#');
    // If it's just an anchor, use current file
    if (filePath === '') {
      filePath = basePath;
    }
  }
  
  // Make path absolute if it's relative
  if (!filePath.startsWith('/') && !filePath.includes('://')) {
    filePath = path.join(path.dirname(basePath), filePath);
  }
  
  // Normalize the path
  filePath = path.normalize(filePath);
  
  // Check if the file exists
  try {
    // If the path has no extension and doesn't end with a slash, try adding .html
    if (!path.extname(filePath) && !filePath.endsWith('/')) {
      filePath += '.html';
    }
    
    // Remove leading slash for relative file paths
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    // If there's an anchor, check if it exists in the target file
    if (anchor && config.checkAnchors) {
      const content = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(content);
      const document = dom.window.document;
      
      // Check if element with ID exists
      const targetElement = document.getElementById(anchor);
      if (!targetElement) {
        // Check for named anchors too
        const namedAnchors = document.querySelectorAll(`a[name="${anchor}"]`);
        if (namedAnchors.length === 0) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking ${filePath}:`, error.message);
    return false;
  }
}

// Extract and check links from a file
function checkLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(content);
  const document = dom.window.document;
  
  // Get all links
  const links = document.querySelectorAll('a[href]');
  
  console.log(`\nChecking ${chalk.cyan(filePath)}: ${links.length} links found`);
  
  for (const link of links) {
    const href = link.getAttribute('href');
    results.total++;
    
    const isWorking = checkLinkTarget(href, filePath);
    
    if (isWorking) {
      results.working.push({
        file: filePath,
        href: href,
        text: link.textContent.trim()
      });
      console.log(`  ${chalk.green('✓')} ${href}`);
    } else {
      results.broken.push({
        file: filePath,
        href: href,
        text: link.textContent.trim()
      });
      console.log(`  ${chalk.red('✗')} ${href} ${chalk.gray(`(${link.textContent.trim()})`)}`);
    }
  }
}

// Main function
function main() {
  console.log(chalk.bold('🔎 Link Checker for Rust Rocket Website'));
  console.log('Scanning for HTML files...');
  
  const htmlFiles = getHtmlFiles(config.rootDir);
  console.log(`Found ${htmlFiles.length} HTML files to scan.`);
  
  results.scanned = htmlFiles.length;
  
  // Check links in each file
  for (const file of htmlFiles) {
    checkLinksInFile(file);
  }
  
  // Print summary
  console.log('\n' + chalk.bold('📊 Summary:'));
  console.log(`Total files scanned: ${results.scanned}`);
  console.log(`Total links found: ${results.total}`);
  console.log(`Working links: ${chalk.green(results.working.length)}`);
  console.log(`Broken links: ${chalk.red(results.broken.length)}`);
  
  // Print broken links
  if (results.broken.length > 0) {
    console.log('\n' + chalk.bold('🔴 Broken Links:'));
    results.broken.forEach(link => {
      console.log(`  ${chalk.red(link.href)} in ${chalk.cyan(link.file)} (${link.text})`);
    });
  }
}

// Run the script
main(); 