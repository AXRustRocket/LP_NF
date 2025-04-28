export async function inject(selector, url){
  const el = document.querySelector(selector);
  if(!el) return;
  try{
    const resp = await fetch(url);
    el.innerHTML = await resp.text();
  }catch(err){ console.error('Include error', url, err); }
} 