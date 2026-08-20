(()=>{
function addPauloCicero(){
 const list=document.querySelector('.reviewers'); if(!list) return;
 if([...list.querySelectorAll('h3')].some(h=>h.textContent.trim()==='Paulo Cícero Fritzen')) return;
 const article=document.createElement('article'); article.className='rev';
 article.innerHTML=`<img src="assets/paulo-cicero-fritzen.jpg" alt="Paulo Cícero Fritzen"><div><span class="role">Reviewer · Parecerista</span><h3>Paulo Cícero Fritzen</h3><p>Universidade Tecnológica Federal do Paraná (UTFPR) · Brasil</p><p data-pt="Engenharia Elétrica e Energia · Smart Grids · Sistemas de Distribuição · Proteção de Sistemas Elétricos · Geração Distribuída · Energias Renováveis · Eficiência Energética · Redes Neurais" data-en="Electrical Engineering and Energy · Smart Grids · Distribution Systems · Power System Protection · Distributed Generation · Renewable Energy · Energy Efficiency · Neural Networks">Engenharia Elétrica e Energia · Smart Grids · Sistemas de Distribuição · Proteção de Sistemas Elétricos · Geração Distribuída · Energias Renováveis · Eficiência Energética · Redes Neurais</p></div><div class="links"><a href="https://orcid.org/0000-0003-1928-8027" target="_blank">ORCID</a><a href="https://lattes.cnpq.br/3904244896211234" target="_blank">Lattes</a></div>`;
 list.appendChild(article);
 if(window.SETARI_I18N?.apply) window.SETARI_I18N.apply();
 if(window.SETARI_I18N_FIXES?.apply) window.SETARI_I18N_FIXES.apply();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addPauloCicero); else addPauloCicero();
})();