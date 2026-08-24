(()=>{
const BUILD='20260824-2025';
const DENISE_LOCAL=`assets/denise-stolle-da-luz-weiss.jpg?v=${BUILD}`;
const LUIZ_FERNANDO_PHOTO=`assets/luiz-fernando-ribas-monteiro-v3.jpg?v=${BUILD}`;
const WESLLEY_PHOTO=`assets/weslley-luiz-da-silva-assis.jpg?v=${BUILD}`;

function ensurePhotoFor(name,src){
 document.querySelectorAll('.eb article').forEach(article=>{
  const h=article.querySelector('h3');
  if(!h||h.textContent.trim()!==name)return;
  let visual=[...article.children].find(el=>el.classList&&el.classList.contains('mono')) || article.querySelector(':scope > img');
  let img;
  if(visual && visual.tagName==='IMG') img=visual;
  else{
   img=document.createElement('img');
   if(article.classList.contains('card'))img.className='photo';
   if(visual)visual.replaceWith(img); else article.prepend(img);
  }
  if(article.classList.contains('card'))img.classList.add('photo');
  img.alt=name;
  img.src=src;
 });
}

function fixEditorialPhotoPresentation(){
 if(document.getElementById('setari-editorial-photo-layout-v2'))return;
 const style=document.createElement('style');
 style.id='setari-editorial-photo-layout-v2';
 style.textContent=`
 .eb .grid .card{grid-template-columns:174px minmax(0,1fr)!important;align-items:stretch!important}
 .eb .grid .card .photo{width:146px!important;height:220px!important;min-height:220px!important;max-height:220px!important;object-fit:cover!important;object-position:center top!important;padding:0!important;margin:14px 0 14px 14px!important;align-self:start!important;border-radius:10px!important;background:#f4f8f7!important;box-sizing:border-box!important;box-shadow:inset 0 0 0 1px #e2ebeb!important}
 .eb .reviewers .rev{grid-template-columns:100px minmax(0,1fr) auto!important;align-items:start!important}
 .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:100px!important;height:118px!important;min-height:118px!important;max-height:118px!important;object-fit:cover!important;object-position:center top!important;padding:0!important;margin:0!important;border-radius:8px!important;background:#f4f8f7!important;box-sizing:border-box!important}
 @media(max-width:900px){
   .eb .reviewers .rev{grid-template-columns:88px minmax(0,1fr)!important}
   .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:88px!important;height:104px!important;min-height:104px!important;max-height:104px!important}
   .eb .reviewers .rev .links{grid-column:2!important}
 }
 @media(max-width:640px){
   .eb .grid .card{grid-template-columns:1fr!important}
   .eb .grid .card .photo{width:min(240px,calc(100% - 28px))!important;height:300px!important;min-height:300px!important;max-height:300px!important;margin:14px auto 0!important;padding:0!important;object-fit:cover!important;object-position:center top!important}
   .eb .reviewers .rev{grid-template-columns:74px minmax(0,1fr)!important;gap:.75rem!important}
   .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:74px!important;height:88px!important;min-height:88px!important;max-height:88px!important;padding:0!important}
   .eb .reviewers .rev .links{grid-column:1/-1!important}
 }
 `;
 document.head.appendChild(style);
}

function showDenisePhoto(){ensurePhotoFor('Denise Stolle da Luz Weiss',DENISE_LOCAL);}
function showLuizPhoto(){ensurePhotoFor('Luiz Fernando Ribas Monteiro',LUIZ_FERNANDO_PHOTO);}
function showWeslleyPhoto(){ensurePhotoFor('Weslley Luiz da Silva Assis',WESLLEY_PHOTO);}

function keepLuizOnlyAsReviewer(){
 document.querySelectorAll('.eb article').forEach(article=>{
  const h=article.querySelector('h3');
  if(!h||h.textContent.trim()!=='Luiz Fernando Ribas Monteiro')return;
  if(!article.closest('.reviewers'))article.remove();
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

function addLuizReviewer(){
 const list=document.querySelector('.reviewers');
 if(!list) return;
 if([...list.querySelectorAll('h3')].some(h=>h.textContent.trim()==='Luiz Fernando Ribas Monteiro')){showLuizPhoto();return;}
 const article=document.createElement('article');
 article.className='rev';
 article.innerHTML=`<img src="${LUIZ_FERNANDO_PHOTO}" alt="Luiz Fernando Ribas Monteiro"><div><span class="role" data-pt="Parecerista" data-en="Reviewer">Parecerista</span><h3>Luiz Fernando Ribas Monteiro</h3><p>Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) · Brasil</p><p data-pt="Redes Inteligentes · Microrredes · Planejamento e Otimização de Sistemas Elétricos de Potência · Inteligência Artificial · Controle · Segurança Cibernética" data-en="Smart Grids · Microgrids · Power System Planning and Optimization · Artificial Intelligence · Control · Cybersecurity">Redes Inteligentes · Microrredes · Planejamento e Otimização de Sistemas Elétricos de Potência · Inteligência Artificial · Controle · Segurança Cibernética</p></div><div class="links"><a href="https://orcid.org/0009-0003-1668-6414" target="_blank" rel="noopener">ORCID</a><a href="https://www.webofscience.com/wos/author/record/ITR-8588-2023" target="_blank" rel="noopener">Web of Science</a><a href="https://scholar.google.com/citations?user=22PEl5wAAAAJ&hl=pt-BR&oi=ao" target="_blank" rel="noopener">Google Scholar</a><a href="http://lattes.cnpq.br/0794752062606721" target="_blank" rel="noopener">Lattes</a></div>`;
 list.appendChild(article);
 const lang=localStorage.getItem('setariLang')==='en'?'en':'pt';
 article.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.textContent=lang==='en'?el.dataset.en:el.dataset.pt;});
 [...list.querySelectorAll(':scope>article.rev')]
   .sort((a,b)=>(a.querySelector('h3')?.textContent||'').localeCompare((b.querySelector('h3')?.textContent||''),'pt-BR',{sensitivity:'base'}))
   .forEach(x=>list.appendChild(x));
 showLuizPhoto();
}

function applyPageFixes(){
 fixEditorialPhotoPresentation();
 keepLuizOnlyAsReviewer();
 showDenisePhoto();
 showWeslleyPhoto();
 updateLeonardoQualification();
 addLuizReviewer();
 showLuizPhoto();
 keepLuizOnlyAsReviewer();
}

const s=document.createElement('script');
s.src=`assets/nilmara-guimaraes-original.js?v=${BUILD}`;
s.async=false;
s.onload=applyPageFixes;
document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyPageFixes);else applyPageFixes();
setTimeout(applyPageFixes,400);
setTimeout(applyPageFixes,1500);
})();