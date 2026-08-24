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
function applyPageFixes(){
 showDenisePhoto();
 updateLeonardoQualification();
}
const s=document.createElement('script');
s.src='assets/nilmara-guimaraes-original.js?v=20260821-2012';
s.async=false;
s.onload=applyPageFixes;
document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyPageFixes);else applyPageFixes();
})();