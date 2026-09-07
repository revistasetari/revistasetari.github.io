(()=>{
const BUILD='20260907-1628-inline-photo';
const LUIZ_PHOTO='data:image/jpeg;base64,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';
const PHOTOS={
  'Denise Stolle da Luz Weiss':`/assets/denise-stolle-da-luz-weiss.jpg?v=${BUILD}`,
  'Luiz Fernando Ribas Monteiro':LUIZ_PHOTO,
  'Luciana Maria Margoti':`/assets/luciana-maria-margoti.svg?v=${BUILD}`,
  'Nilmara Almeida Guimarães':`/assets/nilmara-almeida-guimaraes.jpg?v=${BUILD}`
};

function lang(){return localStorage.getItem('setariLang')==='en'?'en':'pt';}
function applyLang(root=document){
  const l=lang();
  root.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.textContent=l==='en'?el.dataset.en:el.dataset.pt;});
}
function sortReviewers(){
  const list=document.querySelector('.reviewers'); if(!list)return;
  [...list.querySelectorAll(':scope>article.rev')]
    .sort((a,b)=>(a.querySelector('h3')?.textContent||'').localeCompare((b.querySelector('h3')?.textContent||''),'pt-BR',{sensitivity:'base'}))
    .forEach(el=>list.appendChild(el));
}
function ensurePhoto(name,src){
  document.querySelectorAll('.eb article').forEach(article=>{
    const h=article.querySelector('h3'); if(!h||h.textContent.trim()!==name)return;
    let visual=article.querySelector(':scope > img, :scope > .mono');
    if(!visual||visual.tagName!=='IMG'){
      const img=document.createElement('img');
      if(article.classList.contains('card'))img.className='photo';
      img.alt=name; img.src=src;
      if(visual)visual.replaceWith(img); else article.prepend(img);
    }else{
      visual.alt=name; visual.src=src;
    }
  });
}
function dedupe(name){
  const list=document.querySelector('.reviewers'); if(!list)return;
  const matches=[...list.querySelectorAll(':scope>article.rev')].filter(a=>a.querySelector('h3')?.textContent.trim()===name);
  matches.slice(1).forEach(a=>a.remove());
}
function addReviewer({name,institution,pt,en,links}){
  const list=document.querySelector('.reviewers'); if(!list)return;
  dedupe(name);
  let article=[...list.querySelectorAll(':scope>article.rev')].find(a=>a.querySelector('h3')?.textContent.trim()===name);
  if(!article){article=document.createElement('article');article.className='rev';list.appendChild(article);}
  article.innerHTML=`<img src="${PHOTOS[name]}" alt="${name}"><div><span class="role" data-pt="Parecerista" data-en="Reviewer">Parecerista</span><h3>${name}</h3><p>${institution}</p><p data-pt="${pt}" data-en="${en}">${pt}</p></div><div class="links">${links}</div>`;
  const img=article.querySelector('img');
  if(img && name==='Luciana Maria Margoti') img.onerror=()=>{img.onerror=null;img.src='/assets/luciana-maria-margoti.svg?v='+BUILD;};
  if(img && name==='Luiz Fernando Ribas Monteiro') img.onerror=()=>{img.onerror=null;img.src=LUIZ_PHOTO;};
  applyLang(article);
}
function fixStyle(){
 if(document.getElementById('setari-reviewer-photo-fix'))return;
 const s=document.createElement('style'); s.id='setari-reviewer-photo-fix';
 s.textContent=`.eb .reviewers .rev{grid-template-columns:100px minmax(0,1fr) auto!important;align-items:start!important}.eb .reviewers .rev>img{width:100px!important;height:118px!important;min-height:118px!important;max-height:118px!important;object-fit:cover!important;object-position:center top!important;padding:0!important;margin:0!important;border-radius:8px!important;background:#f4f8f7!important}.eb .reviewers .rev>img[alt="Luiz Fernando Ribas Monteiro"]{object-fit:cover!important;object-position:center top!important;padding:0!important}.eb .reviewers .rev>img[alt="Luciana Maria Margoti"]{object-fit:cover!important;object-position:center top!important;padding:0!important}@media(max-width:900px){.eb .reviewers .rev{grid-template-columns:88px minmax(0,1fr)!important}.eb .reviewers .rev>img{width:88px!important;height:104px!important;min-height:104px!important;max-height:104px!important}.eb .reviewers .rev .links{grid-column:2!important}}@media(max-width:640px){.eb .reviewers .rev{grid-template-columns:74px minmax(0,1fr)!important}.eb .reviewers .rev>img{width:74px!important;height:88px!important;min-height:88px!important;max-height:88px!important}.eb .reviewers .rev .links{grid-column:1/-1!important}}`;
 document.head.appendChild(s);
}
function updateLeonardo(){
 const pt='Engenheiro Eletricista. Mestre em Engenharia Mecânica, na área de Automação. Doutor em Engenharia Elétrica pela Universidade Federal de Itajubá (UNIFEI). Pós-Doutorado em Políticas Públicas, na área de Cidades Inteligentes, pela Escola Nacional de Administração Pública (ENAP). Professor efetivo do IFRJ e docente permanente do Programa de Pós-Graduação em Montagem Industrial (PPGMI) da UFF.';
 const en='Electrical Engineer. MSc in Mechanical Engineering, focused on Automation. PhD in Electrical Engineering from the Federal University of Itajubá (UNIFEI). Postdoctoral research in Public Policy, focused on Smart Cities, at the National School of Public Administration (ENAP). Professor at IFRJ and permanent faculty member of the Graduate Program in Industrial Assembly (PPGMI) at UFF.';
 document.querySelectorAll('.eb article').forEach(a=>{if(a.querySelector('h3')?.textContent.trim()==='Leonardo de Carvalho Vidal'){const q=a.querySelector('.qual');if(q){q.dataset.pt=pt;q.dataset.en=en;q.textContent=lang()==='en'?en:pt;}}});
}
function apply(){
 fixStyle();
 addReviewer({name:'Luiz Fernando Ribas Monteiro',institution:'Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) · Brasil',pt:'Redes Inteligentes · Microrredes · Planejamento e Otimização de Sistemas Elétricos de Potência · Inteligência Artificial · Controle · Segurança Cibernética',en:'Smart Grids · Microgrids · Power System Planning and Optimization · Artificial Intelligence · Control · Cybersecurity',links:'<a href="https://orcid.org/0009-0003-1668-6414" target="_blank" rel="noopener">ORCID</a><a href="https://www.webofscience.com/wos/author/record/ITR-8588-2023" target="_blank" rel="noopener">Web of Science</a><a href="https://scholar.google.com/citations?user=22PEl5wAAAAJ&hl=pt-BR&oi=ao" target="_blank" rel="noopener">Google Scholar</a><a href="http://lattes.cnpq.br/0794752062606721" target="_blank" rel="noopener">Lattes</a>'});
 addReviewer({name:'Luciana Maria Margoti',institution:'Fundação Presidente Antônio Carlos (FUPAC/UNIPAC) · Brasil',pt:'Engenharia Elétrica · Modelagem e Controle · Redes Neurais',en:'Electrical Engineering · Modeling and Control · Neural Networks',links:'<a href="http://lattes.cnpq.br/0604873632052194" target="_blank" rel="noopener">Lattes</a>'});
 addReviewer({name:'Nilmara Almeida Guimarães',institution:'Instituto Federal de Educação, Ciência e Tecnologia do Rio de Janeiro (IFRJ) · Brasil',pt:'Metrologia · Qualidade · Inovação',en:'Metrology · Quality · Innovation',links:'<a href="http://lattes.cnpq.br/8713579950615464" target="_blank" rel="noopener">Lattes</a>'});
 ensurePhoto('Denise Stolle da Luz Weiss',PHOTOS['Denise Stolle da Luz Weiss']);
 updateLeonardo();
 sortReviewers();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
setTimeout(apply,300); setTimeout(apply,1200);
})();