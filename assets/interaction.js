(()=>{
const KEY='setariLang';
const isEN=()=>localStorage.getItem(KEY)==='en';
const tx=(pt,en)=>isEN()?en:pt;

function injectStyles(){
 if(document.getElementById('setari-interaction-style'))return;
 const s=document.createElement('style');
 s.id='setari-interaction-style';
 s.textContent=`
:root{--setari-action:#0c6974;--setari-action-dark:#064a52;--setari-action-light:#dff3f1;--setari-ok:#176b52;--setari-warn:#946400;--setari-err:#9f2f2f}
button,.btn,input[type="submit"],input[type="button"]{transition:transform .13s ease,background-color .18s ease,color .18s ease,border-color .18s ease,box-shadow .18s ease,filter .18s ease;position:relative;overflow:hidden;cursor:pointer}
button:hover:not(:disabled),.btn:hover:not([aria-disabled="true"]),input[type="submit"]:hover:not(:disabled),input[type="button"]:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 7px 18px rgba(7,56,63,.16);filter:saturate(1.08)}
button:active:not(:disabled),.btn:active:not([aria-disabled="true"]),input[type="submit"]:active:not(:disabled),input[type="button"]:active:not(:disabled),.setari-action-active{transform:translateY(1px) scale(.975)!important;background-color:var(--setari-action-dark)!important;color:#fff!important;border-color:var(--setari-action-dark)!important;box-shadow:0 2px 6px rgba(7,56,63,.22)!important}
button:focus-visible,.btn:focus-visible,input[type="submit"]:focus-visible,input[type="button"]:focus-visible{outline:3px solid rgba(12,105,116,.28);outline-offset:3px}
button:disabled,input[type="submit"]:disabled,input[type="button"]:disabled,.btn[aria-disabled="true"]{cursor:wait;opacity:.68;filter:grayscale(.15)}
.setari-ripple{position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,255,255,.38);transform:scale(0);animation:setariRipple .58s ease-out forwards;z-index:3}
@keyframes setariRipple{to{transform:scale(4);opacity:0}}
@keyframes setariPulse{0%,100%{box-shadow:0 0 0 0 rgba(12,105,116,.18)}50%{box-shadow:0 0 0 6px rgba(12,105,116,0)}}
.setari-processing{animation:setariPulse .75s ease 1}
#setari-toast-stack{position:fixed;right:18px;bottom:18px;z-index:99999;display:grid;gap:9px;width:min(390px,calc(100vw - 36px));pointer-events:none}
.setari-toast{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;background:#fff;border:1px solid #cddfdd;border-left:5px solid var(--setari-action);border-radius:11px;padding:12px 14px;box-shadow:0 14px 34px rgba(3,34,38,.19);color:#18383c;font-size:.9rem;line-height:1.4;animation:setariToastIn .2s ease-out;pointer-events:auto}
.setari-toast strong{display:block;margin-bottom:2px;color:#07383f}.setari-toast .ico{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--setari-action-light);font-weight:900;color:var(--setari-action-dark)}
.setari-toast.ok{border-left-color:var(--setari-ok)}.setari-toast.ok .ico{color:var(--setari-ok)}
.setari-toast.warn{border-left-color:var(--setari-warn)}.setari-toast.warn .ico{color:var(--setari-warn);background:#fff5d9}
.setari-toast.error{border-left-color:var(--setari-err)}.setari-toast.error .ico{color:var(--setari-err);background:#fff0f0}
@keyframes setariToastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.portal-alert{position:relative!important;border-radius:10px!important;box-shadow:0 9px 24px rgba(3,34,38,.12)!important;animation:setariToastIn .2s ease-out!important;font-weight:700!important}
.portal-alert:not([hidden]){display:block!important}
.portal-alert.ok{border-left:5px solid var(--setari-ok)!important;background:#eef9f5!important}.portal-alert.error{border-left:5px solid var(--setari-err)!important;background:#fff2f2!important}
@media(max-width:640px){#setari-toast-stack{right:10px;bottom:10px;width:calc(100vw - 20px)}.setari-toast{font-size:.86rem}}
@media(prefers-reduced-motion:reduce){button,.btn,input[type="submit"],input[type="button"],.setari-toast{transition:none!important;animation:none!important}.setari-ripple{display:none}}
 `;
 document.head.appendChild(s);
}

function stack(){
 let el=document.getElementById('setari-toast-stack');
 if(el)return el;
 el=document.createElement('div');el.id='setari-toast-stack';el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','false');document.body.appendChild(el);return el;
}

function toast(message,type='info',title=''){
 const box=document.createElement('div');box.className='setari-toast '+type;
 const icon=type==='ok'?'✓':type==='error'?'!':type==='warn'?'!':'↻';
 box.innerHTML=`<div class="ico">${icon}</div><div>${title?`<strong>${title}</strong>`:''}<span></span></div>`;
 box.querySelector('span').textContent=message;
 stack().appendChild(box);
 const ttl=type==='error'?5200:2600;
 setTimeout(()=>{box.style.opacity='0';box.style.transform='translateY(8px)';setTimeout(()=>box.remove(),180)},ttl);
 return box;
}

function labelOf(el){
 const data=isEN()?el.getAttribute('data-en'):el.getAttribute('data-pt');
 return (data||el.getAttribute('aria-label')||el.textContent||el.value||tx('ação','action')).replace(/\s+/g,' ').trim().slice(0,70);
}

function ripple(el,e){
 if(!(el instanceof HTMLElement))return;
 const r=el.getBoundingClientRect();const size=Math.max(r.width,r.height);const dot=document.createElement('span');dot.className='setari-ripple';dot.style.width=dot.style.height=size+'px';
 const x=(e.clientX||r.left+r.width/2)-r.left-size/2;const y=(e.clientY||r.top+r.height/2)-r.top-size/2;dot.style.left=x+'px';dot.style.top=y+'px';el.appendChild(dot);setTimeout(()=>dot.remove(),650);
}

function isAction(el){return el.matches('button,.btn,input[type="submit"],input[type="button"]')}
function transientPress(el,e){ripple(el,e);el.classList.add('setari-action-active','setari-processing');setTimeout(()=>el.classList.remove('setari-action-active'),260);setTimeout(()=>el.classList.remove('setari-processing'),850)}

function feedback(el){
 if(el.matches('[data-lang-toggle]'))return;
 if(el.matches('[aria-selected]')||el.closest('.demo-tabs')){toast(tx('Visualização alterada.','View changed.'),'ok');return}
 const form=el.form||el.closest('form');
 const type=(el.getAttribute('type')||'').toLowerCase();
 const isSubmit=(el.tagName==='INPUT'&&type==='submit')||(el.tagName==='BUTTON'&&(type==='submit'||(!type&&form)));
 if(isSubmit&&form){
  if(!form.checkValidity()){
   toast(tx('Revise os campos obrigatórios destacados antes de continuar.','Review the highlighted required fields before continuing.'),'warn',tx('Ação não enviada','Action not sent'));
   return;
  }
  toast(tx(`Comando recebido: ${labelOf(el)}. Processando…`,`Command received: ${labelOf(el)}. Processing…`),'info',tx('Ação recebida','Action received'));
  return;
 }
 if(el.matches('.delete-account')){toast(tx('Solicitação de exclusão recebida. Confirme a operação na próxima mensagem.','Deletion request received. Confirm the operation in the next prompt.'),'warn');return}
 if(el.matches('.deactivate-account')){toast(tx('Solicitação de desativação recebida. Confirme a operação.','Deactivation request received. Confirm the operation.'),'warn');return}
 toast(tx(`Ação selecionada: ${labelOf(el)}.`,`Action selected: ${labelOf(el)}.`),'ok');
}

document.addEventListener('pointerdown',e=>{const el=e.target.closest?.('button,.btn,input[type="submit"],input[type="button"]');if(el&&!el.disabled)transientPress(el,e)},true);
document.addEventListener('click',e=>{const el=e.target.closest?.('button,.btn,input[type="submit"],input[type="button"]');if(!el||!isAction(el)||el.disabled||el.getAttribute('aria-disabled')==='true')return;feedback(el)},false);

function boot(){injectStyles();stack();window.SETARI_FEEDBACK={toast};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();