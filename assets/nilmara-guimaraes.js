(()=>{
const DENISE_RAW='https://raw.githubusercontent.com/revistasetari/revistasetari.github.io/main/assets/denise-stolle-da-luz-weiss.jpg?v=20260824-1101';
const DENISE_LOCAL='assets/denise-stolle-da-luz-weiss.jpg?v=20260824-1101';
function showDenisePhoto(){
 document.querySelectorAll('.eb article').forEach(article=>{
  const h=article.querySelector('h3');
  if(!h||h.textContent.trim()!=='Denise Stolle da Luz Weiss')return;
  let visual=[...article.children].find(el=>el.classList&&el.classList.contains('mono')) || article.querySelector(':scope > img');
  let img;
  if(visual && visual.tagName==='IMG'){
   img=visual;
  }else{
   img=document.createElement('img');
   if(article.classList.contains('card'))img.className='photo';
   if(visual)visual.replaceWith(img); else article.prepend(img);
  }
  img.alt='Denise Stolle da Luz Weiss';
  img.onerror=()=>{
   if(img.dataset.fallback!=='1'){
    img.dataset.fallback='1';
    img.src=DENISE_LOCAL+'&fallback='+Date.now();
   }
  };
  img.src=DENISE_RAW+'&cb='+Date.now();
 });
}
function updateLeonardoQualification(){
 const pt='Engenheiro Eletricista. Mestre em Engenharia Mecânica, na área de Automação. Doutor em Engenharia Elétrica pela Universidade Federal de Itajubá (UNIFEI). Pós-Doutorado em Políticas Públicas, na área de Cidades Inteligentes, pela Escola Nacional de Administração Pública (ENAP). Professor efetivo do IFRJ e docente permanente do Programa de Pós-Graduação em Montagem Industrial (PPGMI) da UFF.';
 const en='Electrical Engineer. MSc in Mechanical Engineering, focused on Automation. PhD in Electrical Engineering from the Federal University of Itajubá (UNIFEI). Postdoctoral research in Public Policy, focused on Smart Cities, at the National School of Public Administration (ENAP). Professor at IFRJ and permanent faculty member of the Graduate Program in Industrial Assembly (PPGMI) at UFF.';
 document.querySelectorAll('.eb article').forEach(article=>{
  const h=article.querySelector('h3');
  if(!h||h.textContent.trim()!=='Leonardo de Carvalho Vidal')return;
  const qual=article.querySelector('.qual');
  if(!qual)return;
  qual.dataset.pt=pt;
  qual.dataset.en=en;
  qual.textContent=localStorage.getItem('setariLang')==='en'?en:pt;
 });
}
function applyPageFixes(){showDenisePhoto();updateLeonardoQualification();}
const s=document.createElement('script');
s.src='assets/nilmara-guimaraes-original.js?v=20260824-1101';
s.async=false;
s.onload=applyPageFixes;
document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyPageFixes);else applyPageFixes();
setTimeout(applyPageFixes,400);
setTimeout(applyPageFixes,1500);
})();