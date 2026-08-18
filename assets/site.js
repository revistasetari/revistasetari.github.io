function nestedPage(){return location.pathname.includes('/articles/')||location.pathname.includes('/issue/')}
function assetPath(file){return nestedPage()?'../../assets/'+file:'assets/'+file}
function ensureBrandLogo(){
  document.querySelectorAll('.brand').forEach(b=>{
    let img=b.querySelector('img.brand-logo-img, img[src*="logo-setari"]');
    if(!img){img=document.createElement('img');img.src=assetPath('logo-setari.svg?v=20260818-2');img.alt='SETARI — Science, Engineering, Technology, Applied Research & Innovation';img.className='brand-logo-img';b.prepend(img)}else img.classList.add('brand-logo-img');
    b.classList.add('has-logo');
  });
  if(!document.getElementById('setari-brand-fix')){const s=document.createElement('style');s.id='setari-brand-fix';s.textContent='.brand.has-logo{display:flex;align-items:center;max-width:min(560px,72vw)}.brand.has-logo .brand-logo-img{display:block;width:min(520px,68vw);height:auto;max-height:92px;object-fit:contain;object-position:left center}.brand.has-logo>.brand-mark,.brand.has-logo>.brand-copy{display:none!important}@media(max-width:700px){.brand.has-logo{max-width:72vw}.brand.has-logo .brand-logo-img{width:72vw;max-height:76px}.brand-row{gap:.6rem}.journal-status{font-size:.72rem}}';document.head.appendChild(s)}
}
function applyCustomLanguage(){const lang=localStorage.getItem('setariLang')||'pt';document.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.innerHTML=lang==='en'?el.dataset.en:el.dataset.pt});document.querySelectorAll('[data-pt-attr][data-en-attr]').forEach(el=>{const attr=el.dataset.i18nAttr||'aria-label';el.setAttribute(attr,lang==='en'?el.dataset.enAttr:el.dataset.ptAttr)})}
function loadI18n(){if(window.SETARI_I18N){applyCustomLanguage();return}if(document.querySelector('script[data-setari-i18n]'))return;const s=document.createElement('script');s.src=assetPath('i18n.js?v=20260818-2');s.defer=true;s.dataset.setariI18n='1';s.onload=()=>{applyCustomLanguage();if(window.SETARI_I18N)window.SETARI_I18N.apply()};document.head.appendChild(s)}
function boot(){ensureBrandLogo();loadI18n();applyCustomLanguage()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]'))setTimeout(applyCustomLanguage,0)});
