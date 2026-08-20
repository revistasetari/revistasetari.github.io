(()=>{
const PROJECT='iqfrakjlabkjxygdiktp';
const APIKEY='sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1';
const ENDPOINT='https://iqfrakjlabkjxygdiktp.supabase.co/functions/v1/editor-user-admin';
const lang=()=>localStorage.getItem('setariLang')==='en'?'en':'pt';
const t=(pt,en)=>lang()==='en'?en:pt;
function token(){for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(!k.includes(PROJECT)||!k.includes('auth-token'))continue;try{const v=JSON.parse(localStorage.getItem(k)||'{}');return v?.access_token||v?.currentSession?.access_token||v?.session?.access_token||null}catch{}}return null}
function feedback(msg,type='ok'){window.SETARI_FEEDBACK?.toast?.(msg,type);const a=document.getElementById('portal-alert');if(a){a.textContent=msg;a.className='portal-alert '+type;a.hidden=false;setTimeout(()=>a.hidden=true,5500)}}
async function call(email,mode){const access=token();if(!access)throw new Error(t('Sessão não encontrada. Saia e entre novamente.','Session not found. Sign out and sign in again.'));const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${access}`,'apikey':APIKEY},body:JSON.stringify({email,mode})});const data=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(data.error||'admin_action_failed');e.data=data;throw e}return data}
function styles(){if(document.getElementById('setari-user-admin-style'))return;const s=document.createElement('style');s.id='setari-user-admin-style';s.textContent=`.account-admin-actions{display:flex!important;gap:.5rem!important;flex-wrap:wrap!important;margin-top:.7rem!important}.account-admin-actions .delete-account{border-color:#b64040!important;color:#9f2f2f!important}.account-admin-actions .delete-account:hover{background:#fff1f1!important}`;document.head.appendChild(s)}
function addActions(row){
 if(row.dataset.accountActions==='1')return true;
 const sel=row.querySelector('select');const role=sel?.value||'';
 if(role==='editor_chief')return false;
 const email=[...row.querySelectorAll('.item-meta span')].map(x=>x.textContent?.trim()||'').find(x=>x.includes('@'))||'';
 if(!email)return false;
 row.dataset.accountActions='1';
 const wrap=document.createElement('div');wrap.className='item-actions account-admin-actions';
 wrap.innerHTML=`<button class="btn ghost deactivate-account" type="button">${t('Desativar conta','Deactivate account')}</button><button class="btn ghost delete-account" type="button">${t('Apagar usuário','Delete user')}</button>`;
 row.appendChild(wrap);
 wrap.querySelector('.deactivate-account').onclick=async()=>{if(!confirm(t(`Desativar a conta ${email}? O acesso será bloqueado e o histórico será preservado.`,`Deactivate ${email}? Access will be blocked and history preserved.`)))return;const b=wrap.querySelector('.deactivate-account');b.disabled=true;try{await call(email,'deactivate');feedback(t('Conta desativada com sucesso.','Account deactivated successfully.'),'ok');setTimeout(()=>location.reload(),700)}catch(e){feedback(t('Não foi possível desativar: ','Could not deactivate: ')+e.message,'error');b.disabled=false}};
 wrap.querySelector('.delete-account').onclick=async()=>{if(!confirm(t(`Apagar o usuário ${email}? Se houver histórico editorial, os dados pessoais serão anonimizados e o acesso será bloqueado.`,`Delete user ${email}? If editorial history exists, personal data will be anonymized and access blocked.`)))return;const confirmWord=prompt(t('Para confirmar, digite APAGAR.','To confirm, type DELETE.'));const ok=lang()==='en'?String(confirmWord||'').trim().toUpperCase()==='DELETE':String(confirmWord||'').trim().toUpperCase()==='APAGAR';if(!ok)return feedback(t('Operação cancelada.','Operation cancelled.'),'warn');const b=wrap.querySelector('.delete-account');b.disabled=true;try{const r=await call(email,'delete');if(r.action==='anonymized')feedback(t('Usuário removido e dados pessoais anonimizados; histórico editorial preservado.','User removed and personal data anonymized; editorial history preserved.'),'ok');else feedback(t('Usuário apagado definitivamente.','User permanently deleted.'),'ok');setTimeout(()=>location.reload(),800)}catch(e){feedback(t('Não foi possível apagar: ','Could not delete: ')+e.message,'error');b.disabled=false}};
 return true;
}
function decorate(){styles();const box=document.getElementById('editor-users');if(!box||box.closest('[hidden]'))return false;const rows=[...box.querySelectorAll('.user-row')];if(!rows.length)return false;let any=false;rows.forEach(r=>{if(addActions(r))any=true});return any}
function scheduleDecorate(){[0,400,900,1800,3500,7000,12000].forEach(ms=>setTimeout(decorate,ms))}
document.addEventListener('change',e=>{if(e.target?.closest?.('#editor-users'))setTimeout(decorate,700)},true);
document.addEventListener('click',e=>{if(e.target?.closest?.('#editor-panel'))setTimeout(decorate,250)},true);
function boot(){scheduleDecorate()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();