export async function inject(sel, url){
  console.log(`[include] Trying to inject ${url} into ${sel}`);
  
  // If url is for old components/headbar or components/footer, 
  // we now want to load from partials/new-header.html
  if (url === '/components/headbar' || url === '/components/footer') {
    console.log(`[include] Redirecting ${url} to new location`);
    
    // For header component, add it directly after the Header Container comment
    if (url === '/components/headbar') {
      // Check if we're on a page with a header container comment
      const headerCommentNodes = Array.from(document.childNodes).filter(
        node => node.nodeType === Node.COMMENT_NODE && 
               node.textContent.includes('Header Container')
      );
      
      if (headerCommentNodes.length > 0) {
        console.log('[include] Found Header Container comment, injecting new header');
        try {
          const res = await fetch('/partials/new-header.html', {cache:'no-cache'});
          if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
          const content = await res.text();
          console.log(`[include] Loaded new header content (${content.length} bytes)`);
          
          // Create a container div and insert after the comment
          const headerContainer = document.createElement('div');
          headerContainer.innerHTML = content;
          headerCommentNodes[0].parentNode.insertBefore(
            headerContainer, 
            headerCommentNodes[0].nextSibling
          );
          console.log('[include] Successfully injected new header');
          return;
        } catch(e) {
          console.error('[include] Failed to load new header:', e);
        }
      }
    }
    
    // Skip footer includes for now
    console.log(`[include] Skipping footer injection`);
    return;
  }
  
  // Original code for other includes
  const host = document.querySelector(sel);
  if(!host) {
    console.error(`[include] Target element not found: ${sel}`);
    return;
  }
  console.log(`[include] Found target element`);
  
  try{
    console.log(`[include] Fetching from ${url}`);
    const res = await fetch(url, {cache:'no-cache'});
    if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
    const content = await res.text();
    console.log(`[include] Loaded content (${content.length} bytes)`);
    host.innerHTML = content;
    console.log(`[include] Successfully injected content into ${sel}`);
  }catch(e){
    console.error('[include] failed:', url, e);
    // If the component fails to load, hide the container
    host.style.display = 'none';
  }
} 