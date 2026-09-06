(()=>{
const BUILD='20260906-2055';
const PHOTOS={
  'Denise Stolle da Luz Weiss':`assets/denise-stolle-da-luz-weiss.jpg?v=${BUILD}`,
  'Luiz Fernando Ribas Monteiro':`assets/luiz-fernando-ribas-monteiro-v3.jpg?v=${BUILD}`,
  'Luciana Maria Margoti':`assets/luciana-maria-margoti-v2.jpg?v=${BUILD}`,
  'Nilmara Almeida Guimarães':`assets/nilmara-almeida-guimaraes.jpg?v=${BUILD}`
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
  applyLang(article);
}
function fixStyle(){
 if(document.getElementById('setari-reviewer-photo-fix'))return;
 const s=document.createElement('style'); s.id='setari-reviewer-photo-fix';
 s.textContent=`.eb .reviewers .rev{grid-template-columns:100px minmax(0,1fr) auto!important;align-items:start!important}.eb .reviewers .rev>img{width:100px!important;height:118px!important;min-height:118px!important;max-height:118px!important;object-fit:cover!important;object-position:center top!important;padding:0!important;margin:0!important;border-radius:8px!important;background:#f4f8f7!important}.eb .reviewers .rev>img[alt="Luiz Fernando Ribas Monteiro"]{object-fit:contain!important;object-position:center!important;padding:3px!important}@media(max-width:900px){.eb .reviewers .rev{grid-template-columns:88px minmax(0,1fr)!important}.eb .reviewers .rev>img{width:88px!important;height:104px!important;min-height:104px!important;max-height:104px!important}.eb .reviewers .rev .links{grid-column:2!important}}@media(max-width:640px){.eb .reviewers .rev{grid-template-columns:74px minmax(0,1fr)!important}.eb .reviewers .rev>img{width:74px!important;height:88px!important;min-height:88px!important;max-height:88px!important}.eb .reviewers .rev .links{grid-column:1/-1!important}}`;
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