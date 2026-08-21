(()=>{
if(window.__SETARI_BULK_DELETE_FIX__)return;window.__SETARI_BULK_DELETE_FIX__=true;
const PROJECT='iqfrakjlabkjxygdiktp',KEY='sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1',BASE='https://iqfrakjlabkjxygdiktp.supabase.co/rest/v1/rpc/';
const lang=()=>localStorage.getItem('setariLang')==='en'?'en':'pt',t=(pt,en)=>lang()==='en'?en:pt;
function token(){for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(!k.includes(PROJECT)||!k.includes('auth-token'))continue;try{const v=JSON.parse(localStorage.getItem(k)||'{}');return v?.access_token||v?.currentSession?.access_token||v?.session?.access_token||null}catch{}}return null}
async function rpc(name,args){const tk=token();if(!tk)throw new Error(t('Sessão não encontrada. Entre novamente.','Session not found. Sign in again.'));const r=await fetch(BASE+name,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${tk}`,'Content-Type':'application/json'},body:JSON.stringify(args||{})});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.message||d?.details||d?.hint||d?.error||`HTTP ${r.status}`);return d}
function feedback(msg,type='ok'){window.SETARI_FEEDBACK?.toast?.(msg,type);const a=document.getElementById('portal-alert');if(a){a.textContent=msg;a.className='portal-alert '+type;a.hidden=false;setTimeout(()=>a.hidden=true,6500)}}
async function handle(kind,button){
 let ok=false,name='',args={p_confirm:true};
 if(kind==='reviews'){ok=confirm(t('Apagar TODAS as revisões/pareceres do sistema? As submissões serão mantidas. Esta ação não pode ser desfeita.','Delete ALL reviews in the system? Submissions will be kept. This cannot be undone.'));name='editor_clear_reviews'}
 if(kind==='submissions'){ok=confirm(t('Apagar TODAS as submissões e TODOS os dados editoriais vinculados? Esta ação não pode ser desfeita.','Delete ALL submissions and ALL linked editorial data? This cannot be undone.'));name='editor_bulk_clear_submissions'}
 if(kind==='audit'){ok=confirm(t('Apagar TODO o histórico de auditoria? Esta ação não pode ser desfeita.','Delete ALL audit history? This action cannot be undone.'));name='editor_bulk_clear_audit'}
 if(!ok)return;
 if(button)button.disabled=true;
 try{
   const out=await rpc(name,args);
   if(kind==='reviews')feedback(t(`${out?.deleted_reviews||0} revisão(ões)/parecer(es) apagado(s).`,`${out?.deleted_reviews||0} review(s) deleted.`),'ok');
   if(kind==='submissions')feedback(t(`${out?.deleted_submissions||0} submissão(ões) apagada(s), com ${out?.deleted_reviews||0} parecer(es) vinculado(s).`,`${out?.deleted_submissions||0} submission(s) deleted, with ${out?.deleted_reviews||0} linked review(s).`),'ok');
   if(kind==='audit')feedback(t(`Histórico apagado. ${out?.deleted_events||0} evento(s) removido(s).`,`History deleted. ${out?.deleted_events||0} event(s) removed.`),'ok');
   setTimeout(()=>location.reload(),650);
 }catch(e){
   const prefix=kind==='reviews'?t('Não foi possível apagar todas as revisões: ','Could not delete all reviews: '):kind==='submissions'?t('Não foi possível apagar todas as submissões: ','Could not delete all submissions: '):t('Não foi possível apagar o histórico: ','Could not delete history: ');
   feedback(prefix+e.message,'error');if(button)button.disabled=false;
 }
}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('#sdm-delete-reviews-all,#sdm-delete-submissions-all,#audit-delete-all');if(!b)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(b.id==='sdm-delete-reviews-all')handle('reviews',b);
 else if(b.id==='sdm-delete-submissions-all')handle('submissions',b);
 else handle('audit',b);
},true);
})();