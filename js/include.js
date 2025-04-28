export async function inject(sel, url){
  const host = document.querySelector(sel);
  if(!host) return;
  try{
    const res = await fetch(url, {cache:'no-cache'});
    if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
    host.innerHTML = await res.text();
  }catch(e){
    console.error('[inject] failed:', url, e);
  }
} 