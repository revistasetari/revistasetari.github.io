(()=>{
const PROJECT='iqfrakjlabkjxygdiktp';
const APIKEY='sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1';
const ENDPOINT='https://iqfrakjlabkjxygdiktp.supabase.co/functions/v1/editor-user-admin';
const lang=()=>localStorage.getItem('setariLang')==='en'?'en':'pt';
const t=(pt,en)=>lang()==='en'?en:pt;
function token(){
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i)||'';
    if(!k.includes(PROJECT)||!k.includes('auth-token'))continue;
    try{const v=JSON.parse(localStorage.getItem(k)||'{}');return v?.access_token||v?.currentSession?.access_token||v?.session?.access_token||null}catch{}
  }
  return null;
}
function feedback(msg,type='ok'){
  window.SETARI_FEEDBACK?.toast?.(msg,type);
  const a=document.getElementById('portal-alert');
  if(a){a.textContent=msg;a.className='portal-alert '+type;a.hidden=false;setTimeout(()=>a.hidden=true,5500)}
}
async function call(email,mode){
  const access=token();if(!access)throw new Error(t('Sessão não encontrada. Saia e entre novamente.','Session not found. Sign out and sign in again.'));
  const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${access}`,'apikey':APIKEY},body:JSON.stringify({email,mode})});
  const data=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(data.error||'admin_action_failed');e.data=data;throw e}return data;
}
function addActions(row){
  if(row.dataset.accountActions==='1')return;
  const role=row.querySelector('select')?.value||'';
  if(role==='editor_chief')return;
  const email=row.querySelector('.item-meta span')?.textContent?.trim()||'';
  if(!email||!email.includes('@'))return;
  row.dataset.accountActions='1';
  const wrap=document.createElement('div');wrap.className='item-actions account-admin-actions';wrap.style.marginTop='.65rem';
  wrap.innerHTML=`<button class="btn ghost deactivate-account" type="button">${t('Desativar conta','Deactivate account')}</button><button class="btn ghost delete-account" type="button">${t('Apagar conta','Delete account')}</button>`;
  row.appendChild(wrap);
  wrap.querySelector('.deactivate-account').onclick=async()=>{
    if(!confirm(t(`Desativar a conta ${email}? O acesso será bloqueado e o histórico será preservado.`,`Deactivate ${email}? Access will be blocked and history preserved.`)))return;
    const b=wrap.querySelector('.deactivate-account');b.disabled=true;
    try{await call(email,'deactivate');feedback(t('Conta desativada com sucesso.','Account deactivated successfully.'),'ok');setTimeout(()=>location.reload(),900)}catch(e){feedback(t('Não foi possível desativar: ','Could not deactivate: ')+e.message,'error');b.disabled=false}
  };
  wrap.querySelector('.delete-account').onclick=async()=>{
    if(!confirm(t(`Apagar definitivamente a conta ${email}? Isso só será permitido se não houver histórico editorial.`,`Permanently delete ${email}? This is allowed only if there is no editorial history.`)))return;
    const b=wrap.querySelector('.delete-account');b.disabled=true;
    try{await call(email,'delete');feedback(t('Conta apagada definitivamente.','Account permanently deleted.'),'ok');setTimeout(()=>location.reload(),900)}catch(e){
      if(e.data?.error==='editorial_history_exists'){
        const a=e.data.activity||{};
        const msg=t(`A conta possui histórico (${a.submissions||0} submissões, ${a.assignments||0} atribuições, ${a.reviews||0} pareceres) e não pode ser apagada. Deseja desativá-la?`,`The account has history (${a.submissions||0} submissions, ${a.assignments||0} assignments, ${a.reviews||0} reviews) and cannot be deleted. Deactivate it instead?`);
        if(confirm(msg)){try{await call(email,'deactivate');feedback(t('Conta desativada; histórico preservado.','Account deactivated; history preserved.'),'ok');setTimeout(()=>location.reload(),900)}catch(x){feedback(x.message,'error')}}
      }else feedback(t('Não foi possível apagar: ','Could not delete: ')+e.message,'error');
      b.disabled=false;
    }
  };
}
function decorate(){const box=document.getElementById('editor-users');if(!box||box.closest('[hidden]'))return false;const rows=[...box.querySelectorAll('.user-row')];if(!rows.length)return false;rows.forEach(addActions);return true}
function boot(){let tries=0;const timer=setInterval(()=>{tries++;if(decorate()||tries>=30)clearInterval(timer)},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();