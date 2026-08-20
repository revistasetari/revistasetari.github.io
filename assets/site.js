function nestedPage(){return location.pathname.includes('/articles/')||location.pathname.includes('/issue/')}
function assetPath(file){return nestedPage()?'../../assets/'+file:'assets/'+file}
function loadMobileCss(){
  if(document.querySelector('link[data-setari-mobile]'))return;
  const l=document.createElement('link');l.rel='stylesheet';l.href=assetPath('mobile.css?v=20260820-1');l.dataset.setariMobile='1';document.head.appendChild(l);
}
function ensureBrandLogo(){
  document.querySelectorAll('.brand').forEach(b=>{
    let img=b.querySelector('img.brand-logo-img, img[src*="logo-setari"]');
    if(!img){img=document.createElement('img');img.src=assetPath('logo-setari.svg?v=20260820-1');img.alt='SETARI — Science, Engineering, Technology, Applied Research & Innovation';img.className='brand-logo-img';b.prepend(img)}else img.classList.add('brand-logo-img');
    b.classList.add('has-logo');
  });
  if(!document.getElementById('setari-brand-fix')){const s=document.createElement('style');s.id='setari-brand-fix';s.textContent='.brand.has-logo{display:flex;align-items:center;max-width:min(560px,72vw)}.brand.has-logo .brand-logo-img{display:block;width:min(520px,68vw);height:auto;max-height:92px;object-fit:contain;object-position:left center}.brand.has-logo>.brand-mark,.brand.has-logo>.brand-copy{display:none!important}@media(max-width:700px){.brand.has-logo{max-width:82vw}.brand.has-logo .brand-logo-img{width:min(320px,80vw);max-height:58px}.brand-row{gap:.6rem}.journal-status{font-size:.72rem}}';document.head.appendChild(s)}
}
function addEditorialScript(file,key){
  if(document.querySelector(`script[data-setari-${key}]`))return;
  const s=document.createElement('script');s.src=assetPath(file+'?v=20260820-2');s.defer=true;s.dataset['setari'+key.charAt(0).toUpperCase()+key.slice(1)]='1';document.head.appendChild(s);
}
function loadEditorialProfiles(){
  if(!location.pathname.endsWith('/editorial.html')&&!location.pathname.endsWith('editorial.html'))return;
  addEditorialScript('andrei-bonamigo.js','andrei');
  addEditorialScript('nilmara-guimaraes.js','nilmara');
  addEditorialScript('paulo-cicero-fritzen.js','pauloCicero');
}
function loadI18n(){
  if(document.querySelector('script[data-setari-i18n-v2]'))return;
  const s=document.createElement('script');s.src=assetPath('i18n-v2.js?v=20260820-2');s.defer=true;s.dataset.setariI18nV2='1';
  s.onload=()=>{const f=document.createElement('script');f.src=assetPath('i18n-fixes.js?v=20260820-2');f.defer=true;f.dataset.setariI18nFixes='1';f.onload=()=>{if(window.SETARI_I18N?.apply)window.SETARI_I18N.apply();if(window.SETARI_I18N_FIXES?.apply)window.SETARI_I18N_FIXES.apply();};document.head.appendChild(f)};
  document.head.appendChild(s)
}
function boot(){loadMobileCss();ensureBrandLogo();loadEditorialProfiles();loadI18n()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();