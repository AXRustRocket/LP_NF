export async function inject(sel, url){
  console.log(`[include] Trying to inject ${url} into ${sel}`);
  const host = document.querySelector(sel);
  if(!host) {
    console.error(`[include] Target element not found: ${sel}`);
    return;
  }
  console.log(`[include] Found target element`);
  
  // Skip header and footer includes
  if (url === '/components/headbar' || url === '/components/footer') {
    console.log(`[include] Skipping header/footer injection for ${url}`);
    // Remove the container elements to avoid empty space
    host.style.display = 'none';
    return;
  }
  
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