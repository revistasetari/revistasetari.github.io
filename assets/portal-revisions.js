import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase=createClient(
  'https://iqfrakjlabkjxygdiktp.supabase.co',
  'sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1',
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
);

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmt=(d)=>d?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(d)):'—';
const safe=(name='file')=>String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(-120);
const delay=(ms)=>new Promise(r=>setTimeout(r,ms));
let user=null,profile=null,refreshTimer=null;

function notify(msg,type='ok'){
  const box=$('#portal-alert');
  if(!box)return alert(msg);
  box.textContent=msg;
  box.className='portal-alert '+type;
  box.hidden=false;
  setTimeout(()=>box.hidden=true,6500);
}
async function signed(path){
  const {data,error}=await supabase.storage.from('manuscripts').createSignedUrl(path,900);
  if(error)throw error;
  return data.signedUrl;
}
function statusLabel(v){
  return ({submitted:'Aguardando editor',sent_to_reviewers:'Reencaminhada aos pareceristas',accepted:'Aceita'})[v]||v;
}
function findCardByCode(container,code){
  return $$('.item-card,.editorial-card',container).find(card=>String(card.textContent||'').includes(code));
}

async function loadContext(){
  const {data:{session}}=await supabase.auth.getSession();
  if(!session)return false;
  user=session.user;
  const {data,error}=await supabase.from('profiles').select('role,active').eq('id',user.id).single();
  if(error||!data?.active)return false;
  profile=data;
  return true;
}

async function decorateAuthor(){
  if(profile?.role!=='author')return;
  const panel=$('#author-submissions');
  if(!panel)return;

  const [{data:subs,error:se},{data:revs,error:re}]=await Promise.all([
    supabase.from('submissions').select('id,code,title,status,author_id').eq('author_id',user.id),
    supabase.from('submission_revisions').select('*').order('round_no',{ascending:false})
  ]);
  if(se||re)return;

  for(const s of subs||[]){
    const card=findCardByCode(panel,s.code);
    if(!card||card.dataset.revisionUi==='1')continue;
    card.dataset.revisionUi='1';
    const list=(revs||[]).filter(r=>r.submission_id===s.id).sort((a,b)=>b.round_no-a.round_no);
    const pending=list.find(r=>r.status==='submitted');

    const section=document.createElement('section');
    section.className='revision-flow-section author-revision-flow';
    let html='';

    if(s.status==='revision_requested'){
      if(pending){
        html+=`<div class="revision-waiting-editor"><span class="revision-badge">VERSÃO REVISADA RECEBIDA</span><strong>Rodada ${pending.round_no}</strong><span>Enviada em ${fmt(pending.submitted_at)} · aguardando decisão editorial.</span></div>`;
      }else{
        html+=`<div class="revision-request-box">
          <span class="revision-badge">REVISÃO SOLICITADA</span>
          <h4>Enviar versão revisada</h4>
          <p>Envie o novo manuscrito e uma carta-resposta aos pareceres. A versão original continuará preservada.</p>
          <form class="revision-upload-form portal-form">
            <label>Manuscrito revisado (PDF ou DOCX · até 25 MB)
              <input type="file" name="manuscript" accept=".pdf,.docx" required>
            </label>
            <label>Carta de resposta aos pareceres (PDF ou DOCX · até 25 MB)
              <input type="file" name="response" accept=".pdf,.docx" required>
            </label>
            <label>Observação ao editor (opcional)
              <textarea name="note" rows="3" placeholder="Resuma as principais alterações realizadas."></textarea>
            </label>
            <button class="btn primary" type="submit">Enviar versão revisada</button>
          </form>
        </div>`;
      }
    }

    if(list.length){
      html+=`<details class="revision-history">
        <summary>Histórico de versões revisadas (${list.length})</summary>
        <div class="revision-history-list">
          ${list.map(r=>`<article class="revision-history-row">
            <div class="revision-history-head"><div><strong>Rodada ${r.round_no}</strong><small>Enviada em ${fmt(r.submitted_at)}</small></div><span class="status">${esc(statusLabel(r.status))}</span></div>
            ${r.author_note?`<p>${esc(r.author_note)}</p>`:''}
            <div class="item-actions">
              <button class="btn revision-file-open" data-path="${esc(r.manuscript_path)}" type="button">Abrir manuscrito revisado</button>
              <button class="btn revision-file-open" data-path="${esc(r.response_letter_path)}" type="button">Abrir carta-resposta</button>
            </div>
          </article>`).join('')}
        </div>
      </details>`;
    }

    if(!html){section.remove();continue}
    section.innerHTML=html;
    card.appendChild(section);

    section.querySelectorAll('.revision-file-open').forEach(btn=>btn.onclick=async()=>{
      try{location.href=await signed(btn.dataset.path)}
      catch(e){notify('Não foi possível abrir o arquivo: '+e.message,'error')}
    });

    const form=$('.revision-upload-form',section);
    if(form)form.onsubmit=async e=>{
      e.preventDefault();
      if(!confirm('Enviar esta versão revisada para a equipe editorial?'))return;
      const fd=new FormData(form),manuscript=fd.get('manuscript'),response=fd.get('response');
      if(!manuscript?.size||!response?.size)return notify('Envie os dois arquivos obrigatórios.','error');
      if(manuscript.size>25*1024*1024||response.size>25*1024*1024)return notify('Cada arquivo deve ter no máximo 25 MB.','error');
      const btn=$('button[type="submit"]',form);btn.disabled=true;btn.textContent='Enviando…';
      try{
        const token=crypto.randomUUID();
        const base=`${user.id}/${s.id}/revisions/${token}`;
        const mp=`${base}-manuscript-${safe(manuscript.name)}`;
        const rp=`${base}-response-${safe(response.name)}`;
        const up1=await supabase.storage.from('manuscripts').upload(mp,manuscript,{upsert:false});
        if(up1.error)throw up1.error;
        const up2=await supabase.storage.from('manuscripts').upload(rp,response,{upsert:false});
        if(up2.error)throw up2.error;
        const created=await supabase.rpc('author_submit_revision',{
          p_submission_id:s.id,
          p_manuscript_path:mp,
          p_response_letter_path:rp,
          p_author_note:String(fd.get('note')||'').trim()||null
        });
        if(created.error)throw created.error;
        notify('Versão revisada enviada com sucesso.','ok');
        await refresh();
      }catch(err){notify('Não foi possível enviar a revisão: '+(err?.message||err),'error')}
      finally{btn.disabled=false;btn.textContent='Enviar versão revisada'}
    };
  }
}

async function notifyReviewers(reviewerIds,submission){
  for(const rid of reviewerIds||[]){
    try{
      const p=await supabase.rpc('create_editorial_communication',{
        p_recipient_id:rid,
        p_submission_id:submission.id,
        p_subject:`SETARI · Nova rodada de avaliação · ${submission.code||'Submissão'}`,
        p_message:`Prezado(a) Parecerista,\n\nUma versão revisada do manuscrito ${submission.code||''} — ${submission.title||''} foi encaminhada para uma nova rodada de avaliação. O manuscrito revisado e a carta-resposta dos autores já estão disponíveis na Área Restrita da SETARI.\n\nAgradecemos pela continuidade da colaboração.\n\nSETARI Editorial Office`,
        p_communication_type:'review_followup'
      });
      if(p.error)continue;
      await supabase.functions.invoke('send-editorial-communication',{body:{communication_id:p.data}});
    }catch{}
  }
}

async function decorateEditor(){
  if(!['editor_chief','managing_editor'].includes(profile?.role))return;
  const panel=$('#editor-submissions');
  if(!panel)return;

  const [{data:subs,error:se},{data:revs,error:re}]=await Promise.all([
    supabase.from('submissions').select('id,code,title,status,author_id'),
    supabase.from('submission_revisions').select('*').order('round_no',{ascending:false})
  ]);
  if(se||re)return;

  for(const s of subs||[]){
    const card=findCardByCode(panel,s.code);
    if(!card||card.dataset.revisionUi==='1')continue;
    const list=(revs||[]).filter(r=>r.submission_id===s.id).sort((a,b)=>b.round_no-a.round_no);
    if(!list.length)continue;
    card.dataset.revisionUi='1';

    const section=document.createElement('section');
    section.className='revision-flow-section editor-revision-flow';
    section.innerHTML=`<div class="revision-section-head"><div><strong>Rodadas de revisão</strong><small>O histórico de cada versão e dos pareceres é preservado.</small></div></div>
      <div class="revision-history-list">
        ${list.map(r=>`<article class="revision-history-row editor-revision-row" data-revision-id="${r.id}">
          <div class="revision-history-head"><div><strong>Rodada ${r.round_no}</strong><small>Enviada em ${fmt(r.submitted_at)}</small></div><span class="status">${esc(statusLabel(r.status))}</span></div>
          ${r.author_note?`<p><b>Observação do autor:</b> ${esc(r.author_note)}</p>`:''}
          <div class="item-actions">
            <button class="btn revision-file-open" data-path="${esc(r.manuscript_path)}" type="button">Abrir manuscrito revisado</button>
            <button class="btn revision-file-open" data-path="${esc(r.response_letter_path)}" type="button">Abrir carta-resposta</button>
          </div>
          ${r.status==='submitted'?`<div class="revision-decision-box">
            <label>Novo prazo para parecer
              <input class="revision-due" type="date">
            </label>
            <div class="revision-decision-actions">
              <button class="btn primary revision-resend" type="button">Reencaminhar aos mesmos pareceristas</button>
              ${profile.role==='editor_chief'?'<button class="btn revision-accept" type="button">Aprovar versão revisada · Editor-Chefe</button>':'<span>Decisão de aceite: encaminhar ao Editor-Chefe.</span>'}
            </div>
            <small>Ao reencaminhar, será criada uma nova rodada para os mesmos pareceristas da rodada anterior. Os pareceres antigos não serão apagados.</small>
          </div>`:''}
        </article>`).join('')}
      </div>`;

    const pendingRevision=list.find(r=>r.status==='submitted');
    if(pendingRevision){
      const guidance=$('.editor-next-actions',card);
      if(guidance){
        $('h4',guidance).textContent='Versão revisada recebida — ação da editoria';
        $('p',guidance).textContent='Rodada '+pendingRevision.round_no+': abra o manuscrito revisado e a carta-resposta. O Editor-Chefe ou o Editor Executivo pode reencaminhar aos mesmos pareceristas; o aceite cabe ao Editor-Chefe.';
        const jump=$('[data-action="revisions"]',guidance);if(jump)jump.firstChild.textContent='Analisar versão revisada';
      }
    }
    const anchor=$('.article-author-email',card)||$('.reviewer-management',card);
    if(anchor?.parentNode)anchor.parentNode.insertBefore(section,anchor);
    else card.appendChild(section);

    section.querySelectorAll('.revision-file-open').forEach(btn=>btn.onclick=async()=>{
      try{location.href=await signed(btn.dataset.path)}
      catch(e){notify('Não foi possível abrir o arquivo: '+e.message,'error')}
    });

    section.querySelectorAll('.revision-resend').forEach(btn=>btn.onclick=async()=>{
      const row=btn.closest('.editor-revision-row'),rid=row.dataset.revisionId,due=$('.revision-due',row)?.value||'';
      if(!confirm('Reencaminhar esta versão revisada aos mesmos pareceristas da rodada anterior?'))return;
      btn.disabled=true;
      try{
        const r=await supabase.rpc('editor_resend_revision_same_reviewers',{
          p_revision_id:rid,
          p_due_at:due?new Date(due+'T23:59:59-03:00').toISOString():null
        });
        if(r.error)throw r.error;
        await notifyReviewers(r.data?.reviewer_ids||[],s);
        notify('Nova rodada criada para os mesmos pareceristas.','ok');
        await refresh();
      }catch(err){notify('Não foi possível reencaminhar: '+(err?.message||err),'error')}
      finally{btn.disabled=false}
    });

    section.querySelectorAll('.revision-accept').forEach(btn=>btn.onclick=async()=>{
      const rid=btn.closest('.editor-revision-row').dataset.revisionId;
      if(!confirm('Aprovar esta versão revisada sem nova rodada de parecer?'))return;
      btn.disabled=true;
      try{
        const r=await supabase.rpc('editor_accept_revision',{p_revision_id:rid});
        if(r.error)throw r.error;
        notify('Versão revisada aprovada. O artigo foi marcado como aceito.','ok');
        await refresh();
      }catch(err){notify('Não foi possível aprovar: '+(err?.message||err),'error')}
      finally{btn.disabled=false}
    });
  }
}

async function decorateReviewer(){
  if(profile?.role!=='reviewer')return;
  const panel=$('#reviewer-assignments');
  if(!panel)return;
  const {data,error}=await supabase.rpc('reviewer_assigned_submissions');
  if(error||!data?.length)return;
  const cards=$$('article.item-card',panel);
  data.forEach((a,i)=>{
    const card=cards[i];
    if(!card||card.dataset.revisionRoundUi==='1')return;
    card.dataset.revisionRoundUi='1';
    if(a.round_no){
      const meta=$('.item-meta',card);
      if(meta){
        const chip=document.createElement('span');
        chip.className='revision-round-chip';
        chip.textContent='Rodada '+a.round_no;
        meta.appendChild(chip);
      }
    }
    if(a.response_letter_path){
      const manuscriptBox=$('.reviewer-manuscript-box',card);
      if(manuscriptBox&&!$('.revision-response-open',manuscriptBox)){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='btn revision-response-open';
        btn.textContent='Abrir CARTA-RESPOSTA DOS AUTORES';
        btn.onclick=async()=>{try{location.href=await signed(a.response_letter_path)}catch(e){notify('Não foi possível abrir a carta-resposta: '+e.message,'error')}};
        manuscriptBox.appendChild(btn);
      }
    }
  });
}

async function decorate(){
  if(!user||!profile)return;
  await Promise.all([decorateAuthor(),decorateEditor(),decorateReviewer()]);
}

async function refresh(){
  $$('.revision-flow-section').forEach(x=>x.remove());
  $$('[data-revision-ui]').forEach(x=>delete x.dataset.revisionUi);
  $$('[data-revision-round-ui]').forEach(x=>delete x.dataset.revisionRoundUi);
  await delay(250);
  await decorate();
}

function scheduleDecorate(){
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>decorate().catch(()=>{}),180);
}

async function init(){
  if(!await loadContext())return;
  scheduleDecorate();
  const app=$('#app-view');
  if(app){
    new MutationObserver(scheduleDecorate).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('.portal-subnav-btn'))setTimeout(scheduleDecorate,120);
  });
}
init();