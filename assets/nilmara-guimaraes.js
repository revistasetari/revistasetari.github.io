(()=>{
const BUILD='20260904-1920';
const DENISE_LOCAL=`assets/denise-stolle-da-luz-weiss.jpg?v=${BUILD}`;
const LUIZ_FERNANDO_PHOTO='data:image/jpeg;base64,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';
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
 .eb .chief{grid-template-columns:174px minmax(0,1fr)!important;align-items:stretch!important}
 .eb .chief .photo[alt="Leonardo de Carvalho Vidal"]{width:146px!important;height:220px!important;min-height:220px!important;max-height:220px!important;object-fit:contain!important;object-position:center center!important;padding:0!important;margin:14px 0 14px 14px!important;align-self:start!important;border-radius:10px!important;background:#fff!important;box-sizing:border-box!important;box-shadow:inset 0 0 0 1px #e2ebeb!important}
 .eb .reviewers .rev{grid-template-columns:100px minmax(0,1fr) auto!important;align-items:start!important}
 .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:100px!important;height:118px!important;min-height:118px!important;max-height:118px!important;object-fit:cover!important;object-position:center top!important;padding:0!important;margin:0!important;border-radius:8px!important;background:#f4f8f7!important;box-sizing:border-box!important}
 .eb .reviewers .rev>img[alt="Luiz Fernando Ribas Monteiro"]{object-fit:contain!important;object-position:center center!important;padding:3px!important;background:#f4f8f7!important}
 @media(max-width:900px){
   .eb .reviewers .rev{grid-template-columns:88px minmax(0,1fr)!important}
   .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:88px!important;height:104px!important;min-height:104px!important;max-height:104px!important}
   .eb .reviewers .rev .links{grid-column:2!important}
 }
 @media(max-width:640px){
   .eb .grid .card,.eb .chief{grid-template-columns:1fr!important}
   .eb .grid .card .photo{width:min(240px,calc(100% - 28px))!important;height:300px!important;min-height:300px!important;max-height:300px!important;margin:14px auto 0!important;padding:0!important;object-fit:cover!important;object-position:center top!important}
   .eb .chief .photo[alt="Leonardo de Carvalho Vidal"]{width:min(240px,calc(100% - 28px))!important;height:300px!important;min-height:300px!important;max-height:300px!important;margin:14px auto 0!important;padding:0!important;object-fit:contain!important;object-position:center center!important}
   .eb .reviewers .rev{grid-template-columns:74px minmax(0,1fr)!important;gap:.75rem!important}
   .eb .reviewers .rev>img,.eb .reviewers .rev>.mono{width:74px!important;height:88px!important;min-height:88px!important;max-height:88px!important;padding:0!important}
   .eb .reviewers .rev>img[alt="Luiz Fernando Ribas Monteiro"]{object-fit:contain!important;object-position:center center!important;padding:2px!important}
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

function addLucianaReviewer(){
 const list=document.querySelector('.reviewers');
 if(!list)return;
 if([...list.querySelectorAll('h3')].some(h=>h.textContent.trim()==='Luciana Maria Margoti'))return;
 const article=document.createElement('article');
 article.className='rev';
 article.innerHTML=`<div class="mono" aria-label="Luciana Maria Margoti">LMM</div><div><span class="role" data-pt="Parecerista" data-en="Reviewer">Parecerista</span><h3>Luciana Maria Margoti</h3><p>Fundação Presidente Antônio Carlos (FUPAC/UNIPAC) · Brasil</p><p data-pt="Coordenadora e professora. Mestra em Engenharia Elétrica pela Universidade Federal de São João del-Rei (UFSJ), em programa UFSJ/CEFET-MG. Avaliadora BASis desde 2019 e revisora da IEEE Latin America Transactions." data-en="Coordinator and professor. MSc in Electrical Engineering from the Federal University of São João del-Rei (UFSJ), in a UFSJ/CEFET-MG program. BASis evaluator since 2019 and reviewer for IEEE Latin America Transactions.">Coordenadora e professora. Mestra em Engenharia Elétrica pela Universidade Federal de São João del-Rei (UFSJ), em programa UFSJ/CEFET-MG. Avaliadora BASis desde 2019 e revisora da IEEE Latin America Transactions.</p><p data-pt="Engenharia Elétrica · Modelagem e Controle · Redes Neurais" data-en="Electrical Engineering · Modeling and Control · Neural Networks">Engenharia Elétrica · Modelagem e Controle · Redes Neurais</p></div><div class="links"><a href="http://lattes.cnpq.br/0604873632052194" target="_blank" rel="noopener">Lattes</a></div>`;
 list.appendChild(article);
 const lang=localStorage.getItem('setariLang')==='en'?'en':'pt';
 article.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.textContent=lang==='en'?el.dataset.en:el.dataset.pt;});
 [...list.querySelectorAll(':scope>article.rev')]
   .sort((a,b)=>(a.querySelector('h3')?.textContent||'').localeCompare((b.querySelector('h3')?.textContent||''),'pt-BR',{sensitivity:'base'}))
   .forEach(x=>list.appendChild(x));
}

function applyPageFixes(){
 fixEditorialPhotoPresentation();
 keepLuizOnlyAsReviewer();
 showDenisePhoto();
 showWeslleyPhoto();
 updateLeonardoQualification();
 addLuizReviewer();
 addLucianaReviewer();
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