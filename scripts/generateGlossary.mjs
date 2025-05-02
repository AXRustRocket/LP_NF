#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const glossaryTerms = [
  {
    term: 'jito-bundle',
    title: 'Jito Bundle - Solana MEV Infrastructure',
    description: 'Learn about Jito bundles, how they work on Solana, and how they affect trading performance and front-running protection.',
    content: `
      <h1 class="text-4xl font-bold mb-8">Jito Bundle Explained</h1>
      <p class="mb-4">Jito bundles are specialized transaction batches on Solana that provide MEV (Maximal Extractable Value) protection and improved transaction ordering. By bundling transactions together, Jito helps traders avoid front-running and sandwich attacks.</p>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">How Jito Bundles Work</h2>
      <p class="mb-4">Jito operates a network of specialized validators that accept transaction bundles and include them atomically in blocks. This ensures that either all transactions in a bundle execute in the specified order, or none do.</p>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">Benefits for Meme Coin Trading</h2>
      <p class="mb-4">For meme coin traders, Jito bundles offer critical advantages:</p>
      <ul class="list-disc pl-8 mb-6 space-y-2">
        <li>Protection from front-running and sandwich attacks</li>
        <li>Reduced transaction failure rates during high congestion</li>
        <li>Lower effective gas costs through rebates</li>
        <li>Better price execution on DEXs</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">Rust Rocket Integration</h2>
      <p class="mb-4">Rust Rocket's sniper bot leverages Jito bundles to ensure your meme coin trades execute with:</p>
      <ul class="list-disc pl-8 mb-6 space-y-2">
        <li>Minimal slippage even during high volatility</li>
        <li>Protection from other bots trying to front-run your trades</li>
        <li>Optimized gas pricing that saves you money</li>
      </ul>
      
      <div class="mt-12 p-6 rounded-xl bg-spaceDark/60">
        <h3 class="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div class="space-y-6">
          <div>
            <h4 class="font-semibold">Is using Jito bundles legal?</h4>
            <p class="text-gray-300">Yes, Jito bundles are completely legal and an officially supported feature of the Solana network. They represent a fair way to optimize transaction execution.</p>
          </div>
          <div>
            <h4 class="font-semibold">Do I need to set up Jito manually?</h4>
            <p class="text-gray-300">No, Rust Rocket handles all Jito bundle integration automatically. Our platform manages the technical complexity so you don't have to.</p>
          </div>
          <div>
            <h4 class="font-semibold">Are there extra fees for Jito bundle usage?</h4>
            <p class="text-gray-300">Rust Rocket's premium tiers include Jito bundle integration at no additional cost. The small fee charged by the Jito network is often offset by better execution prices.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    term: 'front-run-protection',
    title: 'Front-Run Protection for Meme Coin Trading',
    description: 'Understand front-running attacks on DEXs and how Rust Rocket provides protection when trading meme coins on Solana.',
    content: `
      <h1 class="text-4xl font-bold mb-8">Front-Run Protection</h1>
      <p class="mb-4">Front-running is a predatory trading practice where bots monitor pending transactions (in the mempool) and submit their own transactions with higher gas fees to execute ahead of yours, profiting from the price movement your trade would cause.</p>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">How Front-Running Affects Meme Coin Trades</h2>
      <p class="mb-4">When trading meme coins with high volatility and sometimes thin liquidity, front-running can be particularly damaging:</p>
      <ul class="list-disc pl-8 mb-6 space-y-2">
        <li>Higher slippage resulting in worse execution prices</li>
        <li>Failed transactions during price spikes due to miners prioritizing higher-fee transactions</li>
        <li>Potential for significant losses when making large buys</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">Rust Rocket's Anti-Front-Running Solution</h2>
      <p class="mb-4">Our platform implements multiple layers of protection:</p>
      <ul class="list-disc pl-8 mb-6 space-y-2">
        <li>Private transaction relay networks that bypass the public mempool</li>
        <li>Integration with Jito bundles for atomic execution</li>
        <li>Dynamic gas pricing algorithms that optimize for execution without overpaying</li>
        <li>Smart transaction timing to avoid peak network congestion</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-10 mb-4">Technical Implementation</h2>
      <p class="mb-4">Rust Rocket uses a combination of:</p>
      <ul class="list-disc pl-8 mb-6 space-y-2">
        <li>Encrypted RPC endpoints to prevent transaction snooping</li>
        <li>Direct validator connections for premium tiers</li>
        <li>Multi-path transaction submission for reliability</li>
        <li>Real-time mempool analysis to detect and avoid front-running attempts</li>
      </ul>
      
      <div class="mt-12 p-6 rounded-xl bg-spaceDark/60">
        <h3 class="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div class="space-y-6">
          <div>
            <h4 class="font-semibold">Is front-running common on Solana?</h4>
            <p class="text-gray-300">Yes, especially for popular meme coins with high trading volume. The fast block times on Solana make it a target for sophisticated MEV bots.</p>
          </div>
          <div>
            <h4 class="font-semibold">How much can front-running protection save me?</h4>
            <p class="text-gray-300">For larger trades, protection can save anywhere from 1-5% of trade value in reduced slippage, which can amount to significant savings over time.</p>
          </div>
          <div>
            <h4 class="font-semibold">Does Rust Rocket guarantee no front-running?</h4>
            <p class="text-gray-300">While we implement industry-leading protection, no system can guarantee 100% protection. Our methods significantly reduce the risk compared to standard trading.</p>
          </div>
        </div>
      </div>
    `
  },
  // More terms would be added here...
];

async function generateGlossaryPages() {
  try {
    // Create glossary directory if it doesn't exist
    const glossaryDir = path.join(rootDir, 'glossary');
    await fs.mkdir(glossaryDir, { recursive: true });
    
    console.log('Generating glossary pages...');
    
    for (const { term, title, description, content } of glossaryTerms) {
      const pageContent = `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Rust Rocket</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="meme coin, solana, trading bot, ${term.replace(/-/g, ', ')}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rustrocket.io/glossary/${term}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://rustrocket.io/assets/og-image.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://rustrocket.io/glossary/${term}.html">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="https://rustrocket.io/assets/og-image.jpg">
    
    <!-- Favicon & Manifest -->
    <link rel="manifest" href="/manifest.webmanifest">
    
    <!-- Structured Data: FAQPage -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is ${term.replace(/-/g, ' ')}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This glossary page explains ${term.replace(/-/g, ' ')} in detail, how it works on Solana, and how Rust Rocket optimizes it for meme coin trading."
                }
            },
            {
                "@type": "Question",
                "name": "How does Rust Rocket implement ${term.replace(/-/g, ' ')}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rust Rocket integrates advanced ${term.replace(/-/g, ' ')} technology directly into its trading infrastructure, providing users with enhanced performance and protection."
                }
            },
            {
                "@type": "Question",
                "name": "Is ${term.replace(/-/g, ' ')} important for meme coin trading?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, ${term.replace(/-/g, ' ')} is critical for successful meme coin trading as it helps protect against common issues like front-running, slippage, and failed transactions during market volatility."
                }
            }
        ]
    }
    </script>
    
    <!-- Structured Data: BreadcrumbList -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rustrocket.io/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Glossary",
                "item": "https://rustrocket.io/glossary/"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "${title.split(' - ')[0]}",
                "item": "https://rustrocket.io/glossary/${term}.html"
            }
        ]
    }
    </script>
    
    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com/3.4.4"></script>
    <script>
        tailwind.config = {
            theme: {
                fontFamily: {
                    sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui']
                },
                extend: {
                    colors: {
                        spaceBlack: '#04070D',
                        spaceDark: '#0B1624',
                        rustBlue: '#0B3D91',
                        rocketPurple: '#7B2CBF',
                        neonGreen: '#2AFF62',
                    }
                }
            }
        };
    </script>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/lucide-icons-font@latest/lucide-icons.min.css" rel="stylesheet">
    
    <style>
        body {
            background: linear-gradient(135deg, #04070D 0%, #0B1624 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
    </style>
</head>

<body class="font-sans text-gray-100 antialiased">
    <!-- Navigation Container -->
    <div id="navContainer"></div>
    
    <main class="max-w-3xl mx-auto px-4 py-20">
        <div class="flex text-sm text-gray-400 mb-8">
            <a href="/" class="hover:text-white">Home</a>
            <span class="mx-2">›</span>
            <a href="/glossary/" class="hover:text-white">Glossary</a>
            <span class="mx-2">›</span>
            <span class="text-white">${title.split(' - ')[0]}</span>
        </div>
        
        ${content}
        
        <div class="mt-16 p-6 bg-spaceDark/60 rounded-xl">
            <h3 class="text-xl font-semibold mb-4">Explore More Meme Coin Trading Terms</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${glossaryTerms
                  .filter(item => item.term !== term)
                  .slice(0, 6)
                  .map(item => `<a href="/glossary/${item.term}.html" class="p-3 bg-spaceDark/80 hover:bg-spaceDark rounded-lg text-gray-200 hover:text-white hover:shadow-md transition-all">${item.title.split(' - ')[0]}</a>`)
                  .join('\n                ')}
            </div>
        </div>
    </main>
    
    <footer class="py-16 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <a href="/" class="text-primary text-xl font-bold flex items-center">
                        <span>Rust</span>
                        <span class="text-white ml-1">Rocket</span>
                    </a>
                    <p class="text-sm text-gray-400">Fast. Fair. Fully Audited.</p>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Product</h4>
                    <ul class="space-y-2">
                        <li><a href="/pricing.html" class="text-sm text-gray-400 hover:text-white">Pricing</a></li>
                        <li><a href="/features.html" class="text-sm text-gray-400 hover:text-white">Features</a></li>
                        <li><a href="/glossary/" class="text-sm text-gray-400 hover:text-white">Glossary</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Legal</h4>
                    <ul class="space-y-2">
                        <li><a href="/legal/imprint.html" class="text-sm text-gray-400 hover:text-white">Legal Notice</a></li>
                        <li><a href="/legal/privacy.html" class="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="/legal/terms.html" class="text-sm text-gray-400 hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Connect</h4>
                    <ul class="space-y-2">
                        <li><a href="https://twitter.com/rustrocket" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-twitter mr-2"></i> Twitter</a></li>
                        <li><a href="https://discord.gg/rustrocket" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-discord mr-2"></i> Discord</a></li>
                        <li><a href="mailto:hello@rustrocket.io" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-mail mr-2"></i> Email</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-500">© <script>document.write(new Date().getFullYear())</script> Axiom Enterprise AG. All rights reserved.</p>
                <p class="text-sm text-gray-500 mt-4 md:mt-0">TVTG-registered • Landstrasse 123, FL-9490 Vaduz</p>
            </div>
        </div>
    </footer>
    
    <script type="module">
        import {inject} from '../js/include.js';
        inject('#navContainer', '../components/nav.html');
    </script>
</body>
</html>
      `.trim();
      
      await fs.writeFile(path.join(glossaryDir, `${term}.html`), pageContent);
      console.log(`Generated: glossary/${term}.html`);
    }
    
    // Create an index page for the glossary
    const indexPageContent = `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Coin Trading Glossary | Rust Rocket</title>
    <meta name="description" content="Comprehensive glossary of meme coin trading terms, concepts, and technologies used in Solana trading and DeFi.">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rustrocket.io/glossary/">
    <meta property="og:title" content="Meme Coin Trading Glossary | Rust Rocket">
    <meta property="og:description" content="Comprehensive glossary of meme coin trading terms, concepts, and technologies used in Solana trading and DeFi.">
    <meta property="og:image" content="https://rustrocket.io/assets/og-image.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://rustrocket.io/glossary/">
    <meta property="twitter:title" content="Meme Coin Trading Glossary | Rust Rocket">
    <meta property="twitter:description" content="Comprehensive glossary of meme coin trading terms, concepts, and technologies used in Solana trading and DeFi.">
    <meta property="twitter:image" content="https://rustrocket.io/assets/og-image.jpg">
    
    <!-- Favicon & Manifest -->
    <link rel="manifest" href="/manifest.webmanifest">
    
    <!-- Structured Data: ItemList -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            ${glossaryTerms.map((item, index) => `{
                "@type": "ListItem",
                "position": ${index + 1},
                "url": "https://rustrocket.io/glossary/${item.term}.html",
                "name": "${item.title.split(' - ')[0]}"
            }`).join(',\n            ')}
        ]
    }
    </script>
    
    <!-- Structured Data: BreadcrumbList -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rustrocket.io/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Glossary",
                "item": "https://rustrocket.io/glossary/"
            }
        ]
    }
    </script>
    
    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com/3.4.4"></script>
    <script>
        tailwind.config = {
            theme: {
                fontFamily: {
                    sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui']
                },
                extend: {
                    colors: {
                        spaceBlack: '#04070D',
                        spaceDark: '#0B1624',
                        rustBlue: '#0B3D91',
                        rocketPurple: '#7B2CBF',
                        neonGreen: '#2AFF62',
                    }
                }
            }
        };
    </script>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/lucide-icons-font@latest/lucide-icons.min.css" rel="stylesheet">
    
    <style>
        body {
            background: linear-gradient(135deg, #04070D 0%, #0B1624 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
    </style>
</head>

<body class="font-sans text-gray-100 antialiased">
    <!-- Navigation Container -->
    <div id="navContainer"></div>
    
    <main class="max-w-5xl mx-auto px-4 py-20">
        <div class="flex text-sm text-gray-400 mb-8">
            <a href="/" class="hover:text-white">Home</a>
            <span class="mx-2">›</span>
            <span class="text-white">Glossary</span>
        </div>
        
        <h1 class="text-4xl font-bold mb-8">Meme Coin Trading Glossary</h1>
        <p class="mb-10 text-xl">Essential terms and concepts to understand when trading meme coins on Solana with Rust Rocket.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${glossaryTerms.map(item => `
            <a href="/glossary/${item.term}.html" class="glass-card p-6 rounded-xl hover:translate-y-[-4px] transition-all">
                <h2 class="text-xl font-semibold mb-2">${item.title.split(' - ')[0]}</h2>
                <p class="text-gray-300 text-sm">${item.description.split('.')[0]}.</p>
                <div class="mt-4 text-neonGreen text-sm">Read more →</div>
            </a>
            `).join('\n            ')}
        </div>
    </main>
    
    <footer class="py-16 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <a href="/" class="text-primary text-xl font-bold flex items-center">
                        <span>Rust</span>
                        <span class="text-white ml-1">Rocket</span>
                    </a>
                    <p class="text-sm text-gray-400">Fast. Fair. Fully Audited.</p>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Product</h4>
                    <ul class="space-y-2">
                        <li><a href="/pricing.html" class="text-sm text-gray-400 hover:text-white">Pricing</a></li>
                        <li><a href="/features.html" class="text-sm text-gray-400 hover:text-white">Features</a></li>
                        <li><a href="/glossary/" class="text-sm text-gray-400 hover:text-white">Glossary</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Legal</h4>
                    <ul class="space-y-2">
                        <li><a href="/legal/imprint.html" class="text-sm text-gray-400 hover:text-white">Legal Notice</a></li>
                        <li><a href="/legal/privacy.html" class="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="/legal/terms.html" class="text-sm text-gray-400 hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium mb-4">Connect</h4>
                    <ul class="space-y-2">
                        <li><a href="https://twitter.com/rustrocket" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-twitter mr-2"></i> Twitter</a></li>
                        <li><a href="https://discord.gg/rustrocket" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-discord mr-2"></i> Discord</a></li>
                        <li><a href="mailto:hello@rustrocket.io" class="text-sm text-gray-400 hover:text-white flex items-center"><i class="icon-mail mr-2"></i> Email</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-500">© <script>document.write(new Date().getFullYear())</script> Axiom Enterprise AG. All rights reserved.</p>
                <p class="text-sm text-gray-500 mt-4 md:mt-0">TVTG-registered • Landstrasse 123, FL-9490 Vaduz</p>
            </div>
        </div>
    </footer>
    
    <script type="module">
        import {inject} from '../js/include.js';
        inject('#navContainer', '../components/nav.html');
    </script>
</body>
</html>
    `.trim();
    
    await fs.writeFile(path.join(glossaryDir, 'index.html'), indexPageContent);
    console.log('Generated: glossary/index.html');
    
    // Update sitemap.xml
    await updateSitemap(glossaryTerms);
    
    console.log('Glossary generation completed successfully!');
  } catch (error) {
    console.error('Error generating glossary:', error);
    process.exit(1);
  }
}

async function updateSitemap(glossaryTerms) {
  try {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    const sitemapContent = await fs.readFile(sitemapPath, 'utf8');
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const sitemapData = parser.parse(sitemapContent);
    const urlset = sitemapData.urlset;
    const urls = Array.isArray(urlset.url) ? urlset.url : [urlset.url];
    
    // Filter out any existing glossary URLs
    const filteredUrls = urls.filter(url => !url.loc.includes('/glossary/'));
    
    // Add glossary URLs
    const today = new Date().toISOString().split('T')[0];
    
    // Add glossary index page
    filteredUrls.push({
      loc: 'https://rustrocket.io/glossary/',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
    
    // Add individual glossary term pages
    for (const { term } of glossaryTerms) {
      filteredUrls.push({
        loc: `https://rustrocket.io/glossary/${term}.html`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.7'
      });
    }
    
    // Build updated sitemap
    sitemapData.urlset.url = filteredUrls;
    
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: true
    });
    
    const updatedSitemapContent = builder.build(sitemapData);
    await fs.writeFile(sitemapPath, updatedSitemapContent);
    
    console.log('Updated sitemap.xml with glossary URLs');
  } catch (error) {
    console.error('Error updating sitemap:', error);
    throw error;
  }
}

// Execute the script
generateGlossaryPages(); 