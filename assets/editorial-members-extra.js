(()=>{
function hasName(root,name){return [...root.querySelectorAll('h3')].some(h=>h.textContent.trim()===name)}
function fixEditorialPhotoPresentation(){
 if(document.getElementById('setari-editorial-photo-fix'))return;
 const s=document.createElement('style');s.id='setari-editorial-photo-fix';
 s.textContent=`
 .eb .grid .card{grid-template-columns:170px minmax(0,1fr)!important;align-items:stretch!important}
 .eb .grid .card .photo{width:146px!important;height:210px!important;min-height:210px!important;max-height:210px!important;object-fit:contain!important;object-position:center!important;padding:8px!important;margin:14px 0 14px 14px!important;align-self:center!important;border-radius:10px!important;background:#f4f8f7!important;box-sizing:border-box!important;box-shadow:inset 0 0 0 1px #e2ebeb!important}
 .eb .grid .card .mono{width:146px!important;min-height:210px!important;margin:14px 0 14px 14px!important;border-radius:10px!important;align-self:center!important}
 @media(max-width:640px){
   .eb .grid .card{grid-template-columns:1fr!important}
   .eb .grid .card .photo{width:min(240px,calc(100% - 28px))!important;height:260px!important;min-height:260px!important;max-height:260px!important;margin:14px auto 0!important;padding:10px!important;object-fit:contain!important;object-position:center!important}
   .eb .grid .card .mono{width:min(240px,calc(100% - 28px))!important;min-height:150px!important;margin:14px auto 0!important}
 }
 `;
 document.head.appendChild(s);
}
function updateJulianaAlmansaPhoto(){
 document.querySelectorAll('.eb article').forEach(a=>{
  const h=a.querySelector('h3'); if(!h||h.textContent.trim()!=='Juliana Almansa Malagoli')return;
  const old=a.querySelector('.mono, img');
  if(old){const img=document.createElement('img');img.src='assets/juliana-almansa-malagoli.jpg?v=20260820-2';img.alt='Juliana Almansa Malagoli';img.className=a.classList.contains('card')?'photo':'';old.replaceWith(img)}
 });
}
function addCard(name,role,photo,inst,qualPt,qualEn,areaPt,areaEn,links){
 const grids=[...document.querySelectorAll('.eb .group')];
 let target=null;
 for(const g of grids){const h=g.querySelector('h2'); if(h&&h.textContent.includes(role==='associate'?'Editores Associados':'Conselho Editorial')){target=g.querySelector('.grid');break}}
 if(!target||hasName(target,name))return;
 const a=document.createElement('article');a.className='card';
 a.innerHTML=`${photo?`<img class="photo" src="${photo}" alt="${name}">`:`<div class="mono">${name.split(' ').map(x=>x[0]).slice(0,3).join('')}</div>`}<div class="copy"><span class="role">${role==='associate'?'Associate Editor · Editor Associado':'Editorial Board · Conselho Editorial'}</span><h3>${name}</h3><p class="inst">${inst}</p><p class="qual" data-pt="${qualPt}" data-en="${qualEn}">${qualPt}</p><p class="area" data-pt="${areaPt}" data-en="${areaEn}">${areaPt}</p><div class="links">${links}</div></div>`;
 target.appendChild(a)
}
function addReviewer(name,photo,inst,areaPt,areaEn,links){
 const list=document.querySelector('.reviewers');if(!list||hasName(list,name))return;
 const a=document.createElement('article');a.className='rev';
 a.innerHTML=`${photo?`<img src="${photo}" alt="${name}">`:`<div class="mono">${name.split(' ').map(x=>x[0]).slice(0,3).join('')}</div>`}<div><span class="role">Reviewer · Parecerista</span><h3>${name}</h3><p>${inst}</p><p data-pt="${areaPt}" data-en="${areaEn}">${areaPt}</p></div><div class="links">${links}</div>`;
 list.appendChild(a)
}
function apply(){
 fixEditorialPhotoPresentation();
 updateJulianaAlmansaPhoto();
 addCard('Juliana Ribas Monteiro','board','assets/juliana-ribas-monteiro.jpg?v=20260820-2','Instituto Federal de Educação, Ciência e Tecnologia do Rio de Janeiro (IFRJ) · Brasil','Professora do IFRJ Campus Volta Redonda. Bacharela em Engenharia Elétrica pela Faculdade de Engenharia de Resende, Mestra em Ciências em Engenharia Elétrica, na área de Sistemas de Controle, e Doutora em Ciências em Engenharia Elétrica, na área de Redes Inteligentes, pela Universidade Federal de Itajubá (UNIFEI).','Professor at IFRJ Volta Redonda Campus. BSc in Electrical Engineering, MSc in Electrical Engineering focused on Control Systems, and PhD in Electrical Engineering focused on Smart Grids from the Federal University of Itajubá (UNIFEI).','Sistemas de Controle · Modelagem de Sistemas Dinâmicos · Inteligência Artificial · Smart Grids · Geração Renovável','Control Systems · Dynamic Systems Modeling · Artificial Intelligence · Smart Grids · Renewable Generation','<a href="https://orcid.org/0000-0001-7836-1058" target="_blank">ORCID</a><a href="https://www.webofscience.com/wos/author/record/ABF-4027-2020" target="_blank">Web of Science</a><a href="http://lattes.cnpq.br/2652393084193388" target="_blank">Lattes</a>');
 addReviewer('Juliana Ribas Monteiro','assets/juliana-ribas-monteiro.jpg?v=20260820-2','Instituto Federal de Educação, Ciência e Tecnologia do Rio de Janeiro (IFRJ) · Brasil','Sistemas de Controle · Modelagem de Sistemas Dinâmicos · Inteligência Artificial · Smart Grids · Geração Renovável','Control Systems · Dynamic Systems Modeling · Artificial Intelligence · Smart Grids · Renewable Generation','<a href="https://orcid.org/0000-0001-7836-1058" target="_blank">ORCID</a><a href="https://www.webofscience.com/wos/author/record/ABF-4027-2020" target="_blank">Web of Science</a><a href="http://lattes.cnpq.br/2652393084193388" target="_blank">Lattes</a>');
 addCard('Weslley Luiz da Silva Assis','associate','assets/weslley-luiz-da-silva-assis.jpg?v=20260820-2','Universidade Federal Fluminense (UFF) · Brasil','Professor da Universidade Federal Fluminense. Doutor em Engenharia Metalúrgica pela UFF, com pós-doutorado na instituição e experiências internacionais de pesquisa em Cuba e na Alemanha. Atua em simulação computacional, cálculo numérico, transformação de fases, energias renováveis, hidrogênio e visão computacional aplicada à engenharia.','Professor at Fluminense Federal University. PhD in Metallurgical Engineering from UFF, with postdoctoral research at the institution and international research experience in Cuba and Germany. His work includes computational simulation, numerical methods, phase transformations, renewable energy, hydrogen and computer vision applied to engineering.','Engenharia Metalúrgica · Inteligência Artificial · Sistemas e Agentes Autônomos · Transformação de Fases · Visão Computacional','Metallurgical Engineering · Artificial Intelligence · Autonomous Systems and Agents · Phase Transformations · Computer Vision','<a href="https://orcid.org/0000-0001-6692-4837" target="_blank">ORCID</a><a href="http://lattes.cnpq.br/8444210181194986" target="_blank">Lattes</a>');
 addCard('Weslley Luiz da Silva Assis','board','assets/weslley-luiz-da-silva-assis.jpg?v=20260820-2','Universidade Federal Fluminense (UFF) · Brasil','Professor da Universidade Federal Fluminense. Doutor em Engenharia Metalúrgica pela UFF, com pós-doutorado na instituição e experiências internacionais de pesquisa em Cuba e na Alemanha.','Professor at Fluminense Federal University. PhD in Metallurgical Engineering from UFF, with postdoctoral research at the institution and international research experience in Cuba and Germany.','Engenharia Metalúrgica · Inteligência Artificial · Sistemas e Agentes Autônomos · Transformação de Fases · Visão Computacional','Metallurgical Engineering · Artificial Intelligence · Autonomous Systems and Agents · Phase Transformations · Computer Vision','<a href="https://orcid.org/0000-0001-6692-4837" target="_blank">ORCID</a><a href="http://lattes.cnpq.br/8444210181194986" target="_blank">Lattes</a>');
 addReviewer('Leandro Cândido Brasão','assets/leandro-candido-brasao.jpg?v=20260820-2','Instituto Federal do Triângulo Mineiro (IFTM) · Brasil','Eletrônica Embarcada · Arquitetura Automotiva · Energias Renováveis · Eletrotécnica · Engenharia Elétrica · Controle e Automação','Embedded Electronics · Automotive Architecture · Renewable Energy · Electrical Engineering · Control and Automation','<a href="https://orcid.org/0009-0005-6629-5301" target="_blank">ORCID</a><a href="http://lattes.cnpq.br/2279455060631459" target="_blank">Lattes</a>');
 if(window.SETARI_I18N?.apply)window.SETARI_I18N.apply();if(window.SETARI_I18N_FIXES?.apply)window.SETARI_I18N_FIXES.apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();