export async function inject(sel, url){
  console.log(`[include] Trying to inject ${url} into ${sel}`);
  const host = document.querySelector(sel);
  if(!host) {
    console.error(`[include] Target element not found: ${sel}`);
    return;
  }
  console.log(`[include] Found target element`);
  
  try{
    const baseUrl = window.location.origin;
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    console.log(`[include] Fetching from ${url} (resolved to ${fullUrl})`);
    
    const res = await fetch(url, {cache:'no-cache'});
    if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
    const content = await res.text();
    console.log(`[include] Loaded content (${content.length} bytes)`);
    host.innerHTML = content;
    console.log(`[include] Successfully injected content into ${sel}`);
  }catch(e){
    console.error('[include] failed:', url, e);
  }
} 