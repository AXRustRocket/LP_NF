#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const directoriesToScan = ['.', './components', './legal'];
const validLocalFiles = new Set(); // Will store all valid local files
const dashboardLinks = new Set(); // Will track all dashboard links

// Helper functions
function isExternalURL(url) {
  return /^(https?:\/\/|mailto:|tel:|#|javascript:|data:)/.test(url);
}

function normalizeUrl(url) {
  // Remove any hash or query parameters
  url = url.split('#')[0].split('?')[0];
  // Remove trailing slash
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function isDashboardURL(url) {
  // Check if the URL points to a dashboard
  const dashboardKeywords = [
    'dashboard', 
    'account', 
    'profile', 
    'admin', 
    'user', 
    'settings',
    'analytics',
    'stats'
  ];
  
  const normalizedUrl = url.toLowerCase();
  return dashboardKeywords.some(keyword => normalizedUrl.includes(keyword));
}

// Collect all HTML files
function collectHtmlFiles() {
  try {
    for (const dir of directoriesToScan) {
      if (!fs.existsSync(dir)) {
        console.log(`Directory does not exist: ${dir}`);
        continue;
      }

      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          validLocalFiles.add(filePath);
          if (filePath.endsWith('.html')) {
            validLocalFiles.add(filePath.replace(/^\.\//, ''));
          }
        }
      }
    }
    
    console.log(`Found ${validLocalFiles.size} valid files`);
  } catch (error) {
    console.error(`Error collecting HTML files: ${error.message}`);
  }
}

// Check all links in HTML files
function checkLinks() {
  try {
    const missingLocalUrls = new Set();
    
    for (const dir of directoriesToScan) {
      if (!fs.existsSync(dir)) continue;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filePath = path.join(dir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(fileContent);
        const document = dom.window.document;
        
        // Check all anchor tags
        const anchors = document.querySelectorAll('a');
        anchors.forEach(anchor => {
          const href = anchor.getAttribute('href');
          if (href) checkUrl(href, filePath, missingLocalUrls);
        });
        
        // Check buttons with onclick handlers
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          const onclick = button.getAttribute('onclick');
          if (onclick && onclick.includes('window.location')) {
            const match = onclick.match(/window\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/);
            if (match) checkUrl(match[1], filePath, missingLocalUrls);
          }
        });
        
        // Check data-href attributes (sometimes used for JS navigation)
        const dataHrefElements = document.querySelectorAll('[data-href]');
        dataHrefElements.forEach(el => {
          const href = el.getAttribute('data-href');
          if (href) checkUrl(href, filePath, missingLocalUrls);
        });
      }
    }
    
    // Log results
    console.log('\n--- MISSING LOCAL URLS ---');
    if (missingLocalUrls.size === 0) {
      console.log('No missing local URLs found!');
    } else {
      for (const url of missingLocalUrls) {
        console.log(url);
      }
    }
    
    console.log('\n--- DASHBOARD LINKS ---');
    if (dashboardLinks.size === 0) {
      console.log('No dashboard links found!');
    } else {
      for (const link of dashboardLinks) {
        console.log(link);
      }
    }
  } catch (error) {
    console.error(`Error checking links: ${error.message}`);
  }
}

// Helper function to check URLs
function checkUrl(url, sourceFile, missingLocalUrls) {
  // Skip empty URLs, javascript URLs, data URLs, etc.
  if (!url || url === '#' || url.startsWith('javascript:') || url.startsWith('data:')) {
    return;
  }
  
  // Check if it's a dashboard URL
  if (isDashboardURL(url)) {
    dashboardLinks.add(`${sourceFile} -> ${url}`);
  }
  
  // Skip external URLs
  if (isExternalURL(url)) {
    return;
  }
  
  // Normalize the URL
  const normalizedUrl = normalizeUrl(url);
  
  // Check if the local URL exists
  if (!validLocalFiles.has(normalizedUrl) && !validLocalFiles.has(`./${normalizedUrl}`)) {
    missingLocalUrls.add(`${sourceFile} -> ${url}`);
  }
}

// Run the check
collectHtmlFiles();
checkLinks();

console.log('\nLink check complete!'); 