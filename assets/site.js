function nestedPage(){return location.pathname.includes('/articles/')||location.pathname.includes('/issue/')}
function assetPath(file){return nestedPage()?'../../assets/'+file:'assets/'+file}
function applyCustomLanguage(){const lang=localStorage.getItem('setariLang')||'pt';document.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.innerHTML=lang==='en'?el.dataset.en:el.dataset.pt});document.querySelectorAll('[data-pt-attr][data-en-attr]').forEach(el=>{const attr=el.dataset.i18nAttr||'aria-label';el.setAttribute(attr,lang==='en'?el.dataset.enAttr:el.dataset.ptAttr)})}
function loadI18n(){if(window.SETARI_I18N){applyCustomLanguage();return}if(document.querySelector('script[data-setari-i18n]'))return;const s=document.createElement('script');s.src=assetPath('i18n.js?v=20260818-1');s.defer=true;s.dataset.setariI18n='1';s.onload=applyCustomLanguage;document.head.appendChild(s)}
document.addEventListener('DOMContentLoaded',()=>{loadI18n();applyCustomLanguage()});
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]'))setTimeout(applyCustomLanguage,0)});
