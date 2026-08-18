function nestedPage(){return location.pathname.includes('/articles/')||location.pathname.includes('/issue/')}
function assetPath(file){return nestedPage()?'../../assets/'+file:'assets/'+file}
function ensureBrandLogo(){
  document.querySelectorAll('.brand').forEach(b=>{
    let img=b.querySelector('img.brand-logo-img, img[src*="logo-setari"]');
    if(!img){img=document.createElement('img');img.src=assetPath('logo-setari.svg?v=20260818-4');img.alt='SETARI — Science, Engineering, Technology, Applied Research & Innovation';img.className='brand-logo-img';b.prepend(img)}else img.classList.add('brand-logo-img');
    b.classList.add('has-logo');
  });
  if(!document.getElementById('setari-brand-fix')){const s=document.createElement('style');s.id='setari-brand-fix';s.textContent='.brand.has-logo{display:flex;align-items:center;max-width:min(560px,72vw)}.brand.has-logo .brand-logo-img{display:block;width:min(520px,68vw);height:auto;max-height:92px;object-fit:contain;object-position:left center}.brand.has-logo>.brand-mark,.brand.has-logo>.brand-copy{display:none!important}@media(max-width:700px){.brand.has-logo{max-width:72vw}.brand.has-logo .brand-logo-img{width:72vw;max-height:76px}.brand-row{gap:.6rem}.journal-status{font-size:.72rem}}';document.head.appendChild(s)}
}
function loadI18n(){
  if(document.querySelector('script[data-setari-i18n-v2]'))return;
  const s=document.createElement('script');s.src=assetPath('i18n-v2.js?v=20260818-4');s.defer=true;s.dataset.setariI18nV2='1';
  s.onload=()=>{const f=document.createElement('script');f.src=assetPath('i18n-fixes.js?v=20260818-4');f.defer=true;f.dataset.setariI18nFixes='1';document.head.appendChild(f)};
  document.head.appendChild(s)
}
function boot(){ensureBrandLogo();loadI18n()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
