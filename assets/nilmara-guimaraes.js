(()=>{
function showDenisePhoto(){
 document.querySelectorAll('.eb article').forEach(article=>{
  const h=article.querySelector('h3');
  if(!h||h.textContent.trim()!=='Denise Stolle da Luz Weiss')return;
  const old=[...article.children].find(el=>el.classList&&el.classList.contains('mono'));
  if(!old)return;
  const img=document.createElement('img');
  img.src='assets/denise-stolle-da-luz-weiss.svg?v=20260824-1';
  img.alt='Denise Stolle da Luz Weiss';
  if(article.classList.contains('card'))img.className='photo';
  old.replaceWith(img);
 });
}
const s=document.createElement('script');
s.src='assets/nilmara-guimaraes-original.js?v=20260821-2012';
s.async=false;
s.onload=showDenisePhoto;
document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showDenisePhoto);else showDenisePhoto();
})();