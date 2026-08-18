(()=>{
function lang(){return localStorage.getItem('setariLang')==='en'?'en':'pt'}
const set=(el,pt,en)=>{if(el)el.textContent=lang()==='en'?en:pt};
function apply(){
  const l=lang();
  document.documentElement.lang=l==='en'?'en':'pt-BR';
  // Rodapé: traduções por contexto
  document.querySelectorAll('.footer a[href$="about.html"]').forEach(e=>set(e,'Sobre','About'));
  document.querySelectorAll('.footer a[href$="editorial.html"]').forEach(e=>set(e,'Corpo Editorial','Editorial Board'));
  document.querySelectorAll('.footer a[href$="policies.html"]').forEach(e=>set(e,'Políticas Editoriais','Editorial Policies'));
  document.querySelectorAll('.footer a[href$="submissions.html"]').forEach(e=>set(e,'Normas para Autores','Author Guidelines'));
  document.querySelectorAll('.footer h4').forEach(e=>{
    const t=e.textContent.trim();
    if(['Periódico','Journal'].includes(t))set(e,'Periódico','Journal');
    else if(['Descoberta acadêmica','Discoverability'].includes(t))set(e,'Descoberta acadêmica','Discoverability');
    else if(['Open Science','Ciência Aberta'].includes(t))set(e,'Ciência Aberta','Open Science');
    else if(['Contato','Contact'].includes(t))set(e,'Contato','Contact');
  });
  // Barra superior com nós separados por tags <b>
  document.querySelectorAll('.topline span').forEach(s=>{
    [...s.childNodes].filter(n=>n.nodeType===3).forEach(n=>{
      const t=n.nodeValue.trim();
      if(t==='em processo ·'||t==='pending ·')n.nodeValue=l==='en'?' pending · ':' em processo · ';
      if(t==='Crossref após credenciamento'||t==='Crossref after accreditation')n.nodeValue=l==='en'?' Crossref after accreditation':' Crossref após credenciamento';
      if(t==='17/08/2026 a 30/09/2026'||t==='August 17, 2026 to September 30, 2026')n.nodeValue=l==='en'?' August 17, 2026 to September 30, 2026':' 17/08/2026 a 30/09/2026';
    });
  });
  // Títulos/metadados específicos por página
  const p=location.pathname.split('/').pop()||'index.html';
  const titles={
    'editorial.html':['Corpo Editorial · SETARI','Editorial Board · SETARI'],
    'submissions.html':['Submissões · SETARI','Submissions · SETARI'],
    'join-editorial.html':['Faça parte do Corpo Editorial · SETARI','Join the Editorial Board · SETARI'],
    'about.html':['Sobre · SETARI','About · SETARI'],
    'archive.html':['Arquivo · SETARI','Archive · SETARI'],
    'current.html':['Edição Atual · SETARI','Current Issue · SETARI'],
    'policies.html':['Políticas Editoriais · SETARI','Editorial Policies · SETARI'],
    'contact.html':['Contato · SETARI','Contact · SETARI'],
    'submission-success.html':['Submissão recebida · SETARI','Submission received · SETARI'],
    'form-success.html':['Formulário enviado · SETARI','Form submitted · SETARI']
  };
  if(titles[p])document.title=titles[p][l==='en'?1:0];
  // Eyebrows que deliberadamente usam os dois idiomas no HTML-base
  const eyebrowMap={
    'About · Sobre':['Sobre','About'],
    'Archive · Arquivo':['Arquivo','Archive'],
    'Current Issue · Edição atual':['Edição atual','Current Issue'],
    'Contact · Contato':['Contato','Contact'],
    'Editorial Policies · Políticas':['Políticas Editoriais','Editorial Policies'],
    'Editorial Board · Corpo Editorial':['Corpo Editorial','Editorial Board'],
    'Open Call · Chamada aberta':['Chamada aberta','Open Call']
  };
  document.querySelectorAll('.eyebrow').forEach(e=>{const x=eyebrowMap[e.textContent.trim()];if(x)e.textContent=x[l==='en'?1:0]});
  // Funções editoriais: uma língua por vez
  document.querySelectorAll('.role').forEach(e=>{
    const t=e.textContent.trim();
    if(['Editor-in-Chief · Editor-Chefe','Editor-in-Chief','Editor-Chefe'].includes(t))set(e,'Editor-Chefe','Editor-in-Chief');
    else if(['Associate Editor · Editora Associada','Associate Editor','Editora Associada'].includes(t))set(e,'Editora Associada','Associate Editor');
    else if(['Editorial Board · Conselho Editorial','Editorial Board','Conselho Editorial'].includes(t))set(e,'Conselho Editorial','Editorial Board');
    else if(['Reviewer · Parecerista','Reviewer','Parecerista'].includes(t))set(e,'Parecerista','Reviewer');
  });
  // Kicker da hierarquia editorial
  document.querySelectorAll('.eb .k').forEach(e=>{
    const t=e.textContent.trim();
    if(['Editor-in-Chief','Editor-Chefe'].includes(t))set(e,'Editor-Chefe','Editor-in-Chief');
    else if(['Associate Editors','Editores Associados'].includes(t))set(e,'Editores Associados','Associate Editors');
    else if(['Editorial Board','Conselho Editorial'].includes(t))set(e,'Conselho Editorial','Editorial Board');
    else if(['Peer Review Network','Rede de Avaliadores'].includes(t))set(e,'Rede de Avaliadores','Peer Review Network');
  });
  // Termos de interface que não devem ficar mistos
  document.querySelectorAll('a,button,h2,h3,span,p,small').forEach(e=>{
    if(e.children.length) return;
    const t=e.textContent.trim();
    const exact={
      'Call for Papers':['Chamada de Artigos','Call for Papers'],
      'Author resources':['Recursos para autores','Author resources'],
      'Template PT · DOCX':['Modelo PT · DOCX','Template PT · DOCX'],
      'Template EN · DOCX':['Modelo EN · DOCX','Template EN · DOCX'],
      'Guidelines EN · PDF':['Normas EN · PDF','Guidelines EN · PDF'],
      'Open Access':['Acesso aberto','Open Access'],
      'Double-blind peer review':['Avaliação por pares duplo-cega','Double-blind peer review'],
      'DOI-ready':['Preparado para DOI','DOI-ready'],
      'Scholar-ready':['Preparado para Google Scholar','Scholar-ready']
    }[t];
    if(exact)e.textContent=exact[l==='en'?1:0];
  });
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,30));
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]'))setTimeout(apply,30)});
window.SETARI_I18N_FIXES={apply};
})();