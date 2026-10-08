import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL='https://iqfrakjlabkjxygdiktp.supabase.co';
const SUPABASE_KEY='sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const $=(s)=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmt=(d)=>d?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(d)):'—';
const labels={submitted:'Submetido',under_screening:'Triagem editorial',under_review:'Em avaliação',revision_requested:'Revisão solicitada',accepted:'Aceito',rejected:'Rejeitado',withdrawn:'Retirado',author:'Autor',reviewer:'Parecerista',editor_chief:'Editor-Chefe',managing_editor:'Editor Executivo'};
const alertBox=$('#portal-alert');
function notice(msg,type='ok'){alertBox.textContent=msg;alertBox.className='portal-alert '+type;alertBox.hidden=false;setTimeout(()=>alertBox.hidden=true,6500)}
function empty(text){return `<div class="empty-msg">${esc(text)}</div>`}
function showPortalTab(scope,target){
  const root=scope==='editor'?$('#editor-panel'):scope==='reviewer'?$('#reviewer-panel'):$('#author-panel');
  if(!root)return false;
  if(scope==='editor'&&(target==='users'||target==='lab')&&currentProfile?.role!=='editor_chief'){
    notice('Esta área é exclusiva do Editor-Chefe.','error');
    return false;
  }
  const pages=[...root.querySelectorAll('[data-tab-page]')];
  pages.forEach(p=>{
    const active=p.dataset.tabPage===target;
    p.hidden=!active;
    if(active)p.removeAttribute('hidden');else p.setAttribute('hidden','');
  });
  root.querySelectorAll('.portal-subnav-btn').forEach(b=>{
    const active=b.dataset.tabTarget===target;
    b.setAttribute('aria-selected',active?'true':'false');
  });
  const targetPage=pages.find(p=>p.dataset.tabPage===target);
  if(targetPage)targetPage.scrollIntoView({block:'start',behavior:'auto'});
  return !!targetPage;
}
document.addEventListener('click',async e=>{
  const btn=e.target.closest('.portal-subnav-btn');
  if(!btn)return;
  e.preventDefault();
  const nav=btn.closest('.portal-subnav');
  if(!nav)return;
  const scope=nav.dataset.tabScope,target=btn.dataset.tabTarget;
  const opened=showPortalTab(scope,target);
  if(!opened)return;
  if(scope==='editor'&&target==='users'&&currentProfile?.role==='editor_chief'){
    try{
      const {data,error}=await supabase.from('profiles').select('*').order('full_name');
      if(error)throw error;
      allProfiles=data||[];
      renderUsers(allProfiles);
    }catch(err){notice('Não foi possível atualizar a lista de usuários: '+err.message,'error')}
  }
  if(scope==='editor'&&target==='certificates')await loadEditorCertificates();
  if(scope==='author'&&target==='certificates')await loadCertificates('author');
  if(scope==='reviewer'&&target==='certificates')await loadCertificates('reviewer');
});
function safeFileName(name){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(-120)}
async function signed(bucket,path,seconds=900){const {data,error}=await supabase.storage.from(bucket).createSignedUrl(path,seconds);if(error)throw error;return data.signedUrl}

let currentUser=null,currentProfile=null,allProfiles=[];
async function profileFor(id){const {data,error}=await supabase.from('profiles').select('*').eq('id',id).single();if(error)throw error;return data}
async function refreshSession(){const {data:{session}}=await supabase.auth.getSession();if(!session){showAuth();return}currentUser=session.user;try{currentProfile=await profileFor(currentUser.id);if(currentProfile.force_password_change){showForcedPasswordChange();return}showApp();await loadRolePanel()}catch(e){notice('Não foi possível carregar seu perfil: '+e.message,'error')}}
function showAuth(){currentUser=currentProfile=null;$('#auth-view').hidden=false;$('#forced-password-view').hidden=true;$('#app-view').hidden=true}
function showForcedPasswordChange(){$('#auth-view').hidden=true;$('#app-view').hidden=true;$('#forced-password-view').hidden=false;$('#forced-user-email').textContent=currentProfile?.email||currentUser?.email||''}
function showApp(){ $('#auth-view').hidden=true;$('#forced-password-view').hidden=true;$('#app-view').hidden=false;$('#user-name').textContent=currentProfile.full_name||'Usuário';$('#user-email').textContent=currentProfile.email;$('#user-role').textContent=labels[currentProfile.role]||currentProfile.role;['author','reviewer','editor'].forEach(x=>$('#'+x+'-panel').hidden=true);if(currentProfile.role==='editor_chief'||currentProfile.role==='managing_editor'){$('#editor-panel').hidden=false;document.querySelectorAll('[data-editor-chief-only]').forEach(el=>el.hidden=currentProfile.role!=='editor_chief');showPortalTab('editor','overview')}else if(currentProfile.role==='reviewer'){$('#reviewer-panel').hidden=false;showPortalTab('reviewer','assignments')}else{$('#author-panel').hidden=false;showPortalTab('author','new')}}

$('#login-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const {error}=await supabase.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});if(error)return notice(error.message,'error');e.currentTarget.reset();await refreshSession()});
$('#signup-form')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,fd=new FormData(form),fullName=String(fd.get('full_name')||'').trim(),email=String(fd.get('email')||'').trim().toLowerCase(),password=String(fd.get('password')||''),confirmPassword=String(fd.get('confirm_password')||''),btn=form.querySelector('button[type=submit]');if(fullName.length<3)return notice('Informe seu nome completo.','error');if(password.length<8)return notice('A senha deve ter pelo menos 8 caracteres.','error');if(password!==confirmPassword)return notice('As senhas não coincidem.','error');btn.disabled=true;const originalText=btn.textContent;btn.textContent='Criando conta…';try{const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});if(error)throw error;if(!data?.user)throw new Error('Não foi possível concluir o cadastro. Tente novamente.');if(Array.isArray(data.user.identities)&&data.user.identities.length===0){throw new Error('Não foi possível criar uma nova conta com este e-mail. Se ele já estiver cadastrado, use a opção Entrar ou solicite a redefinição manual à equipe editorial.')}let session=data.session;if(!session){const login=await supabase.auth.signInWithPassword({email,password});if(!login.error)session=login.data.session}if(session){currentUser=session.user;let profile=null,lastError=null;for(let i=0;i<6;i++){try{profile=await profileFor(currentUser.id);break}catch(err){lastError=err;await new Promise(r=>setTimeout(r,250))}}if(!profile)throw lastError||new Error('A conta foi criada, mas o perfil ainda não ficou disponível. Tente entrar novamente em alguns segundos.');currentProfile=profile;form.reset();notice('Conta criada com sucesso. Bem-vindo à Área Restrita da SETARI.','ok');showApp();await loadRolePanel();return}form.reset();notice('Conta criada. Agora use o mesmo e-mail e senha para entrar.','ok')}catch(err){const msg=String(err?.message||'erro inesperado');if(/email rate limit exceeded|over_email_send_rate_limit/i.test(msg)){notice('O serviço de confirmação por e-mail atingiu temporariamente o limite de envios. Aguarde e tente novamente mais tarde. Se o prazo de submissão estiver próximo, entre em contato com setarijournal@gmail.com para que a equipe editorial auxilie no cadastro.','error')}else if(/already|registered|exists|duplicate/i.test(msg)){notice('Este e-mail já pode estar cadastrado. Tente entrar com sua senha ou solicite a redefinição manual à equipe editorial.','error')}else{notice('Não foi possível criar a conta: '+msg,'error')}}finally{btn.disabled=false;btn.textContent=originalText}});


$('#forced-password-form')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,fd=new FormData(form),password=String(fd.get('password')||''),confirmPassword=String(fd.get('confirm_password')||''),btn=form.querySelector('button[type=submit]');if(password.length<8)return notice('A nova senha deve ter pelo menos 8 caracteres.','error');if(password!==confirmPassword)return notice('As senhas não coincidem.','error');btn.disabled=true;try{const {error}=await supabase.auth.updateUser({password});if(error)throw error;const upd=await supabase.from('profiles').update({force_password_change:false,updated_at:new Date().toISOString()}).eq('id',currentUser.id);if(upd.error)throw upd.error;form.reset();currentProfile.force_password_change=false;notice('Nova senha definida com sucesso.','ok');showApp();await loadRolePanel()}catch(err){notice('Não foi possível definir a nova senha: '+err.message,'error')}finally{btn.disabled=false}});

$('#logout-btn')?.addEventListener('click',async()=>{await supabase.auth.signOut();showAuth()});
supabase.auth.onAuthStateChange(()=>setTimeout(refreshSession,0));

async function loadRolePanel(){if(currentProfile.role==='editor_chief'||currentProfile.role==='managing_editor')return loadEditor();if(currentProfile.role==='reviewer')return loadReviewer();return loadAuthor()}

$('#submission-form')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,fd=new FormData(form),manuscript=fd.get('manuscript'),cover=fd.get('cover_sheet');if(!manuscript||!manuscript.size)return notice('Selecione o manuscrito anonimizado.','error');if(!cover||!cover.size)return notice('Selecione a folha de rosto.','error');if(manuscript.size>25*1024*1024)return notice('O manuscrito ultrapassa 25 MB.','error');if(cover.size>10*1024*1024)return notice('A folha de rosto ultrapassa 10 MB.','error');const mext=(manuscript.name.split('.').pop()||'').toLowerCase(),cext=(cover.name.split('.').pop()||'').toLowerCase();if(!['pdf','docx'].includes(mext))return notice('O manuscrito deve ser PDF ou DOCX.','error');if(!['pdf','docx'].includes(cext))return notice('A folha de rosto deve ser PDF ou DOCX.','error');const btn=form.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Enviando…';let manuscriptPath=null,coverPath=null;try{manuscriptPath=`${currentUser.id}/${crypto.randomUUID()}-${safeFileName(manuscript.name)}`;coverPath=`${currentUser.id}/${crypto.randomUUID()}-${safeFileName(cover.name)}`;let up=await supabase.storage.from('manuscripts').upload(manuscriptPath,manuscript,{upsert:false,contentType:manuscript.type||undefined});if(up.error)throw up.error;up=await supabase.storage.from('cover-sheets').upload(coverPath,cover,{upsert:false,contentType:cover.type||undefined});if(up.error)throw up.error;const {data:newSubmission,error}=await supabase.from('submissions').insert({author_id:currentUser.id,title:fd.get('title'),abstract:fd.get('abstract'),keywords:fd.get('keywords'),area:fd.get('area'),manuscript_path:manuscriptPath,cover_sheet_path:coverPath}).select('id,code').single();if(error)throw error;
let confirmationSent=false;
try{
  const confirmation=await supabase.functions.invoke('hyper-processor',{body:{submission_id:newSubmission.id}});
  if(!confirmation.error&&!confirmation.data?.error)confirmationSent=true;
}catch{}
form.reset();
notice(confirmationSent?'Submissão enviada com sucesso. A confirmação foi enviada para seu e-mail.':'Submissão enviada com sucesso. O artigo foi registrado, mas não foi possível confirmar o envio do e-mail agora.','ok');
await loadAuthor();showPortalTab('author','mine')}catch(err){const jobs=[];if(manuscriptPath)jobs.push(supabase.storage.from('manuscripts').remove([manuscriptPath]));if(coverPath)jobs.push(supabase.storage.from('cover-sheets').remove([coverPath]));if(jobs.length)await Promise.allSettled(jobs);notice('Falha ao submeter: '+err.message,'error')}finally{btn.disabled=false;btn.textContent='Enviar submissão'}});

async function loadAuthor(){const box=$('#author-submissions');box.innerHTML='<div class="empty-msg">Carregando…</div>';const {data,error}=await supabase.from('submissions').select('*').eq('author_id',currentUser.id).order('submitted_at',{ascending:false});if(error){box.innerHTML=empty(error.message);return}if(!data?.length){box.innerHTML=empty('Nenhuma submissão ainda.');return}box.innerHTML='';for(const s of data){let feedback=[];try{const r=await supabase.rpc('author_review_feedback',{p_submission_id:s.id});feedback=r.data||[]}catch{}const div=document.createElement('article');div.className='item-card';div.innerHTML=`<div class="item-meta"><span class="status">${esc(labels[s.status]||s.status)}</span><span>${esc(s.code||'')}</span><span>${fmt(s.submitted_at)}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.area||'')}</p><div class="file-separation"><div class="file-card manuscript-file"><div class="file-visual-head"><span class="file-icon">📄</span><div><span class="file-kind">ARTIGO / MANUSCRITO</span><strong>Manuscrito anonimizado</strong></div></div><span class="file-access-badge reviewer-access">✓ PARECERISTAS TÊM ACESSO</span><small>Este é o arquivo científico avaliado no processo duplo-cego.</small><button class="btn manuscript-btn" type="button">Abrir ARTIGO / MANUSCRITO</button></div><div class="file-card cover-file"><div class="file-visual-head"><span class="file-icon">👤</span><div><span class="file-kind">FOLHA DE ROSTO</span><strong>Identificação dos autores</strong></div></div><span class="file-access-badge editorial-access">🔒 SOMENTE EQUIPE EDITORIAL</span><small>Nomes, afiliações, e-mails, ORCID e autor correspondente.</small>${s.cover_sheet_path?'<button class="btn cover-btn" type="button">Abrir FOLHA DE ROSTO</button>':'<span class="file-missing">Não disponível nesta submissão anterior</span>'}</div></div>${feedback.length?`<div class="review-block"><strong>Pareceres liberados</strong>${feedback.map((r,i)=>`<p><b>Parecer ${i+1}:</b> ${esc(r.comments_to_author||'Sem comentário textual.')} <em>(${esc(r.recommendation||'')})</em></p>`).join('')}</div>`:''}`;div.querySelector('.manuscript-btn').onclick=async()=>{try{location.href=await signed('manuscripts',s.manuscript_path)}catch(e){notice(e.message,'error')}};const coverBtn=div.querySelector('.cover-btn');if(coverBtn)coverBtn.onclick=async()=>{try{location.href=await signed('cover-sheets',s.cover_sheet_path)}catch(e){notice(e.message,'error')}};box.appendChild(div)}await loadCertificates('author')}

async function loadReviewer(){const box=$('#reviewer-assignments');box.innerHTML='<div class="empty-msg">Carregando…</div>';const {data,error}=await supabase.rpc('reviewer_assigned_submissions');if(error){box.innerHTML=empty(error.message);return}if(!data?.length){box.innerHTML=empty('Nenhum artigo atribuído a você.');return}const {data:reviews}=await supabase.from('reviews').select('*').eq('reviewer_id',currentUser.id);const byAssign=Object.fromEntries((reviews||[]).map(r=>[r.assignment_id,r]));box.innerHTML='';for(const a of data){const existing=byAssign[a.assignment_id];const div=document.createElement('article');div.className='item-card';div.innerHTML=`<div class="item-meta"><span class="status">${esc(labels[a.status]||a.status)}</span><span>${esc(a.code||'')}</span><span>Prazo: ${a.due_at?fmt(a.due_at):'não definido'}</span></div><h3>${esc(a.title)}</h3><p><strong>Área:</strong> ${esc(a.area||'—')}</p><p><strong>Resumo:</strong> ${esc(a.abstract||'—')}</p><p><strong>Palavras-chave:</strong> ${esc(a.keywords||'—')}</p><div class="reviewer-manuscript-box"><div class="file-visual-head"><span class="file-icon">📄</span><div><span class="file-kind">ARTIGO PARA AVALIAÇÃO</span><strong>Manuscrito anonimizado</strong></div></div><span class="file-access-badge reviewer-access">✓ ÚNICO ARQUIVO DISPONÍVEL AO PARECERISTA</span><small>A folha de rosto e a identidade dos autores não são exibidas nesta área.</small><button class="btn manuscript-btn" type="button">Abrir ARTIGO / MANUSCRITO</button></div>${existing?.submitted?`<div class="review-block"><strong>Parecer enviado em ${fmt(existing.submitted_at)}</strong><p>${esc(existing.comments_to_author||'')}</p><p><b>Recomendação:</b> ${esc(existing.recommendation||'')}</p></div>`:`<form class="review-form"><label>Comentários aos autores<textarea name="comments_to_author" rows="6" required>${esc(existing?.comments_to_author||'')}</textarea></label><label>Comentários confidenciais ao Editor-Chefe<textarea name="confidential" rows="4">${esc(existing?.confidential_comments_to_editor||'')}</textarea></label><label>Recomendação<select name="recommendation" required><option value="">Selecione</option><option value="accept">Aceitar</option><option value="minor_revision">Revisão menor</option><option value="major_revision">Revisão maior</option><option value="reject">Rejeitar</option></select></label><label>Arquivo de parecer anotado (opcional)<input type="file" name="review_file" accept=".pdf,.docx"></label><button class="btn primary" type="submit">Enviar parecer final</button></form>`}`;div.querySelector('.manuscript-btn').onclick=async()=>{try{location.href=await signed('manuscripts',a.manuscript_path)}catch(e){notice(e.message,'error')}};const form=div.querySelector('.review-form');if(form)form.onsubmit=async ev=>{ev.preventDefault();if(!confirm('Enviar o parecer como final? Ele ficará visível ao Editor-Chefe.'))return;const fd=new FormData(form);const btn=form.querySelector('button');btn.disabled=true;try{let reviewPath=existing?.review_file_path||null,file=fd.get('review_file');if(file?.size){if(file.size>10*1024*1024)throw new Error('Arquivo de parecer maior que 10 MB.');reviewPath=`${currentUser.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;const up=await supabase.storage.from('reviews').upload(reviewPath,file,{upsert:false});if(up.error)throw up.error}const payload={assignment_id:a.assignment_id,reviewer_id:currentUser.id,comments_to_author:fd.get('comments_to_author'),confidential_comments_to_editor:fd.get('confidential'),recommendation:fd.get('recommendation'),review_file_path:reviewPath,submitted:true,submitted_at:new Date().toISOString(),updated_at:new Date().toISOString()};const q=existing?supabase.from('reviews').update(payload).eq('id',existing.id):supabase.from('reviews').insert(payload);const {error}=await q;if(error)throw error;await supabase.from('review_assignments').update({completed_at:new Date().toISOString()}).eq('id',a.assignment_id);notice('Parecer enviado ao Editor-Chefe.');await loadReviewer()}catch(e){notice(e.message,'error')}finally{btn.disabled=false}};box.appendChild(div)}await loadCertificates('reviewer')}


function certificateTypeLabel(type){
  return type==='reviewer'?'Certificado de Parecerista Ad Hoc':type==='author_acceptance'?'Certificado de Aceite':'Certificado de Publicação';
}
function certificateBody(cert){
  const m=cert.metadata||{};
  const holder=esc(m.holder_name||currentProfile?.full_name||'');
  if(cert.certificate_type==='reviewer'){
    const d=m.activity_date?new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(m.activity_date)):'';
    return `Certificamos que <strong>${holder}</strong>${m.institution?' ('+esc(m.institution)+')':''} atuou como <strong>Parecerista Ad Hoc</strong> da SETARI — Science, Engineering, Technology, Applied Research & Innovation, contribuindo com o processo de avaliação científica por pares${d?' em atividade concluída em '+esc(d):''}. Em respeito à confidencialidade editorial e ao processo duplo-cego, este certificado não identifica o manuscrito avaliado.`;
  }
  if(cert.certificate_type==='author_acceptance'){
    const d=m.accepted_at?new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(m.accepted_at)):'';
    return `Certificamos que o manuscrito <strong>“${esc(m.title||'')}”</strong>, código <strong>${esc(m.submission_code||'')}</strong>, de autoria vinculada a <strong>${holder}</strong>, foi <strong>aceito para publicação</strong> na SETARI — Science, Engineering, Technology, Applied Research & Innovation${d?' em '+esc(d):''}, após cumprimento do fluxo editorial da revista.`;
  }
  const d=m.published_at?new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(m.published_at)):'';
  const bib=[m.volume?'Vol. '+esc(m.volume):'',m.issue?'nº '+esc(m.issue):'',m.publication_year?String(m.publication_year):'',m.pages?'p. '+esc(m.pages):''].filter(Boolean).join(' · ');
  return `Certificamos que o trabalho <strong>“${esc(m.title||'')}”</strong>, código <strong>${esc(m.submission_code||'')}</strong>, de autoria vinculada a <strong>${holder}</strong>, foi <strong>publicado</strong> na SETARI — Science, Engineering, Technology, Applied Research & Innovation${d?' em '+esc(d):''}${bib?' ('+bib+')':''}${m.doi?'. DOI: '+esc(m.doi):''}.`;
}
function printCertificate(cert){
  const code=encodeURIComponent(cert.certificate_code||'');
  window.open('certificado.html?codigo='+code,'_blank','noopener,noreferrer');
}

async function loadCertificates(scope){
  const box=scope==='reviewer'?$('#reviewer-certificates'):$('#author-certificates');
  if(!box)return;
  box.innerHTML='<div class="empty-msg">Carregando certificados…</div>';
  const {data,error}=await supabase.rpc('my_certificate_options');
  if(error){box.innerHTML=empty('Não foi possível carregar os certificados: '+error.message);return}
  const wanted=(data||[]).filter(x=>scope==='reviewer'?x.certificate_type==='reviewer':x.certificate_type!=='reviewer');
  if(!wanted.length){box.innerHTML=empty(scope==='reviewer'?'Nenhum certificado disponível ainda. O certificado será liberado após a conclusão de um parecer.':'Nenhum certificado disponível ainda. O certificado de aceite será liberado após o aceite editorial; o de publicação, após a publicação.');return}
  box.innerHTML='';
  wanted.forEach(o=>{
    const card=document.createElement('article');card.className='certificate-card';
    card.innerHTML=`<div><span class="certificate-kind">${esc(certificateTypeLabel(o.certificate_type))}</span><h3>${esc(o.detail||'')}</h3>${o.certificate_code?'<small>Código: '+esc(o.certificate_code)+'</small>':'<small>Disponível para emissão</small>'}</div><button class="btn certificate-action" type="button">Abrir certificado</button>`;
    card.querySelector('.certificate-action').onclick=async()=>{
      try{
        const {data:cert,error}=await supabase.from('certificate_issues').select('*').eq('id',o.certificate_id).single();
        if(error)throw error;
        printCertificate(cert);
      }catch(err){notice('Não foi possível abrir o certificado: '+(err?.message||err),'error')}
    };
    box.appendChild(card);
  });
}


async function loadEditorCertificates(){
  const box=$('#editor-certificates');
  if(!box)return;
  box.innerHTML='<div class="empty-msg">Carregando certificados…</div>';

  const [{data,error},{data:mailLog,error:mailError}]=await Promise.all([
    supabase.rpc('editor_certificate_candidates'),
    supabase.from('certificate_email_log').select('*').order('created_at',{ascending:false})
  ]);

  if(error){box.innerHTML=empty('Não foi possível carregar: '+error.message);return}
  if(mailError){box.innerHTML=empty('Não foi possível carregar o histórico de envios: '+mailError.message);return}
  if(!data?.length){box.innerHTML=empty('Nenhum certificado elegível no momento.');return}

  const latestMail={};
  (mailLog||[]).forEach(m=>{if(!latestMail[m.certificate_id])latestMail[m.certificate_id]=m});

  box.innerHTML='';
  data.forEach(o=>{
    const card=document.createElement('article');
    card.className='certificate-card';
    const released=!!o.certificate_id;
    const mail=released?latestMail[o.certificate_id]:null;
    const mailText=mail
      ? (mail.status==='sent'
          ? 'Último envio: '+fmt(mail.sent_at||mail.created_at)+' · '+esc(mail.recipient_email)
          : mail.status==='failed'
            ? 'Última tentativa falhou · '+fmt(mail.created_at)
            : 'Envio pendente · '+fmt(mail.created_at))
      : 'Ainda não enviado por e-mail';

    card.innerHTML=`<div>
      <span class="certificate-kind">${esc(certificateTypeLabel(o.certificate_type))}</span>
      <h3>${esc(o.holder_name||'')} · ${esc(o.detail||'')}</h3>
      <small>${esc(o.holder_email||'')}${o.institution?' · '+esc(o.institution):''}${released?' · Código '+esc(o.certificate_code):''}</small>
      ${released?'<small class="certificate-mail-status">'+mailText+'</small>':''}
    </div>
    <div class="certificate-editor-actions">
      ${released?'<span class="status">LIBERADO</span>':'<button class="btn primary release-certificate-btn" type="button">Liberar certificado</button>'}
      ${released?'<button class="btn open-certificate-btn" type="button">Abrir</button><button class="btn primary email-certificate-btn" type="button">Enviar por e-mail</button>':''}
    </div>`;

    const release=card.querySelector('.release-certificate-btn');
    if(release)release.onclick=async()=>{
      if(!confirm('Liberar este certificado para '+(o.holder_name||'o usuário')+'?'))return;
      release.disabled=true;
      try{
        const {data:cert,error}=await supabase.rpc('editor_release_certificate',{p_type:o.certificate_type,p_reference_id:o.reference_id});
        if(error)throw error;
        notice('Certificado liberado com sucesso.','ok');
        printCertificate(cert);
        await loadEditorCertificates();
      }catch(err){notice('Não foi possível liberar o certificado: '+(err?.message||err),'error')}
      finally{release.disabled=false}
    };

    const open=card.querySelector('.open-certificate-btn');
    if(open)open.onclick=async()=>{
      try{
        const {data:cert,error}=await supabase.from('certificate_issues').select('*').eq('id',o.certificate_id).single();
        if(error)throw error;
        printCertificate(cert);
      }catch(err){notice('Não foi possível abrir o certificado: '+(err?.message||err),'error')}
    };

    const emailBtn=card.querySelector('.email-certificate-btn');
    if(emailBtn)emailBtn.onclick=async()=>{
      const destination=o.holder_email||'o destinatário';
      if(!confirm('Enviar manualmente este certificado para '+destination+'? A SETARI receberá uma cópia oculta.'))return;
      emailBtn.disabled=true;
      const original=emailBtn.textContent;
      emailBtn.textContent='Enviando…';
      try{
        const sent=await supabase.functions.invoke('send-certificate-email',{body:{certificate_id:o.certificate_id}});
        if(sent.error)throw new Error(sent.error.message||'Falha ao chamar o serviço de envio.');
        if(sent.data?.error)throw new Error(sent.data.error+(sent.data?.detail?' · '+sent.data.detail:''));
        notice('Certificado enviado por e-mail com cópia para a SETARI.','ok');
        await loadEditorCertificates();
      }catch(err){
        notice('Não foi possível enviar o certificado: '+(err?.message||err),'error');
      }finally{
        emailBtn.disabled=false;
        emailBtn.textContent=original;
      }
    };

    box.appendChild(card);
  });
}

async function loadEditor(){const reviewQuery=currentProfile.role==='managing_editor'?supabase.rpc('managing_editor_reviews'):supabase.from('reviews').select('*');const [ps,ss,aa,rr,mm,cc,pp]=await Promise.all([supabase.from('profiles').select('*').order('full_name'),supabase.from('submissions').select('*').order('submitted_at',{ascending:false}),supabase.from('review_assignments').select('*'),reviewQuery,supabase.from('editorial_messages').select('*').order('created_at',{ascending:false}),supabase.from('editorial_communications').select('*').order('created_at',{ascending:false}),supabase.from('article_publications').select('*')]);if(ps.error||ss.error||aa.error||rr.error||mm.error||cc.error||pp.error)return notice((ps.error||ss.error||aa.error||rr.error||mm.error||cc.error||pp.error).message,'error');allProfiles=ps.data||[];renderEditorSummary(ss.data||[],aa.data||[],rr.data||[]);renderReviewerWorkload(ss.data||[],aa.data||[],rr.data||[],allProfiles);renderEditorialCommunications(ss.data||[],allProfiles,cc.data||[]);if(currentProfile.role==='editor_chief')renderUsers(allProfiles);await renderEditorSubmissions(ss.data||[],aa.data||[],rr.data||[],mm.data||[],cc.data||[],pp.data||[]);await loadEditorCertificates()}

function renderEditorialCommunications(submissions,profiles,communications){
  const form=$('#editorial-communication-form'),recipient=$('#comm-recipient'),submission=$('#comm-submission'),type=$('#comm-type'),template=$('#comm-template'),subject=$('#comm-subject'),message=$('#comm-message'),history=$('#communication-history'),historyFilter=$('#comm-history-filter');
  if(!form||!recipient||!submission||!history)return;

  const activeRecipients=profiles.filter(p=>p.active&&['author','reviewer','managing_editor','editor_chief'].includes(p.role)&&p.id!==currentUser.id);
  recipient.innerHTML='<option value="">Selecione</option>'+activeRecipients.map(p=>`<option value="${p.id}">${esc(p.full_name||p.email)} · ${esc(labels[p.role]||p.role)} · ${esc(p.email)}</option>`).join('');
  submission.innerHTML='<option value="">Sem vínculo com artigo</option>'+submissions.filter(s=>!s.is_demo).map(s=>`<option value="${s.id}">${esc(s.code||'')} · ${esc(s.title)}</option>`).join('');

  const templates={
    review_invitation:{
      type:'review_invitation',
      subject:'SETARI · Convite para avaliação de manuscrito',
      message:'Prezado(a) Parecerista,\n\nGostaríamos de convidá-lo(a) para avaliar o manuscrito indicado nesta comunicação. A avaliação deve ser realizada pela Área Restrita da SETARI, observando o processo duplo-cego e a confidencialidade editorial.\n\nAgradecemos antecipadamente pela colaboração com a revista.\n\nSETARI Editorial Office'
    },
    review_reminder:{
      type:'review_followup',
      subject:'SETARI · Lembrete de parecer pendente',
      message:'Prezado(a) Parecerista,\n\nEste é um lembrete sobre o parecer ainda pendente para o manuscrito indicado nesta comunicação. Pedimos, por gentileza, que verifique a Área Restrita da SETARI e, se possível, conclua a avaliação dentro do prazo estabelecido.\n\nCaso necessite de prazo adicional, responda a este e-mail.\n\nSETARI Editorial Office'
    },
    author_review:{
      type:'author_update',
      subject:'SETARI · Atualização sobre sua submissão',
      message:'Prezado(a) Autor(a),\n\nSeu manuscrito segue em fluxo editorial na SETARI. Esta mensagem tem o objetivo de mantê-lo(a) informado(a) sobre o andamento da submissão indicada.\n\nQuando houver uma nova decisão ou parecer liberado, a informação também ficará disponível na Área Restrita.\n\nSETARI Editorial Office'
    },
    author_revision:{
      type:'revision',
      subject:'SETARI · Solicitação de revisão do manuscrito',
      message:'Prezado(a) Autor(a),\n\nApós análise editorial, solicitamos a revisão do manuscrito indicado nesta comunicação. Consulte as orientações e os pareceres disponibilizados na Área Restrita e envie a versão revisada conforme solicitado.\n\nSETARI Editorial Office'
    },
    general:{
      type:'general',
      subject:'SETARI · Comunicação Editorial',
      message:'Prezado(a),\n\nEscrevemos em nome da SETARI Editorial Office.\n\n[Digite aqui a mensagem.]\n\nAtenciosamente,\nSETARI Editorial Office'
    }
  };

  template.onchange=()=>{
    const t=templates[template.value];
    if(!t)return;
    type.value=t.type;subject.value=t.subject;message.value=t.message;
  };

  const profileMap=Object.fromEntries(profiles.map(p=>[p.id,p]));
  const subMap=Object.fromEntries(submissions.map(s=>[s.id,s]));

  const renderHistory=()=>{
    const filter=historyFilter?.value||'';
    const rows=communications.filter(c=>!filter||c.recipient_role===filter);
    if(!rows.length){history.innerHTML=empty('Nenhuma comunicação registrada.');return}
    history.innerHTML=rows.map(c=>{
      const p=profileMap[c.recipient_id];
      const s=c.submission_id?subMap[c.submission_id]:null;
      const state=c.email_status==='sent'?'Enviado':c.email_status==='failed'?'Falhou':c.email_status==='waiting_domain'?'Aguardando configuração':'Pendente';
      return `<article class="item-card communication-history-card"><div class="communication-history-meta"><span class="status">${esc(state)}</span><span>${fmt(c.created_at)}</span><span>${esc(labels[c.recipient_role]||c.recipient_role)}</span></div><h3>${esc(c.subject)}</h3><p><b>Para:</b> ${esc(p?.full_name||c.recipient_email||'Destinatário')} · ${esc(c.recipient_email||p?.email||'')}</p>${s?`<p><b>Artigo:</b> ${esc(s.code||'')} · ${esc(s.title||'')}</p>`:''}<details><summary>Ver mensagem</summary><p class="communication-message-preview">${esc(c.message)}</p>${c.email_error?`<p class="communication-error"><b>Erro:</b> ${esc(c.email_error)}</p>`:''}</details></article>`;
    }).join('');
  };
  if(historyFilter)historyFilter.onchange=renderHistory;
  renderHistory();

  form.onsubmit=async e=>{
    e.preventDefault();
    const recipientId=recipient.value;
    if(!recipientId)return notice('Selecione o destinatário.','error');
    const btn=form.querySelector('button[type="submit"]');
    btn.disabled=true;
    try{
      const {data:id,error}=await supabase.rpc('create_editorial_communication',{
        p_recipient_id:recipientId,
        p_submission_id:submission.value||null,
        p_subject:subject.value.trim(),
        p_message:message.value.trim(),
        p_communication_type:type.value||'general'
      });
      if(error)throw error;

      const {data:sendData,error:sendError}=await supabase.functions.invoke('send-editorial-communication',{body:{communication_id:id}});
      if(sendError)throw sendError;

      if(sendData?.email_status==='waiting_domain'){
        notice('Comunicação registrada. O envio externo aguarda a configuração do domínio/remetente no serviço de e-mail.','error');
      }else{
        notice('E-mail enviado e comunicação registrada.');
      }
      form.reset();
      await loadEditor();
      showPortalTab('editor','communications');
    }catch(err){
      notice('Não foi possível enviar a comunicação: '+(err?.message||err),'error');
    }finally{
      btn.disabled=false;
    }
  };
}

function editorWorkflowState(s,assignments,reviews){
  const submittedReviews=reviews.filter(r=>r.submitted);
  const pendingAssignments=assignments.filter(a=>!a.completed_at);
  if(s.status==='submitted')return {key:'triage',label:'AÇÃO NECESSÁRIA',text:'Fazer a triagem inicial e, se adequado, encaminhar para avaliação.',priority:1};
  if(s.status==='under_screening')return {key:'triage',label:'AÇÃO NECESSÁRIA',text:'Concluir a triagem e atribuir parecerista(s).',priority:1};
  if(s.status==='under_review'&&assignments.length===0)return {key:'assign',label:'AÇÃO NECESSÁRIA',text:'Nenhum parecerista atribuído. Selecione e atribua parecerista(s).',priority:1};
  if(s.status==='under_review'&&pendingAssignments.length>0)return {key:'waiting',label:'AGUARDANDO PARECER',text:`${pendingAssignments.length} parecer(es) ainda pendente(s) de ${assignments.length} atribuído(s).`,priority:2};
  if(s.status==='under_review'&&assignments.length>0&&submittedReviews.length>=assignments.length)return {key:'decision',label:'DECISÃO EDITORIAL',text:'Todos os pareceres atribuídos foram recebidos. Avalie os pareceres e defina a próxima decisão.',priority:1};
  if(s.status==='revision_requested')return {key:'revision',label:'AGUARDANDO AUTOR',text:'Revisão solicitada. Acompanhe o retorno do autor ou envie uma nova comunicação.',priority:2};
  if(s.status==='accepted')return {key:'done',label:'ACEITO',text:'Decisão final registrada. Verifique se a comunicação ao autor foi enviada.',priority:3};
  if(s.status==='rejected')return {key:'done',label:'REJEITADO',text:'Decisão final registrada. Verifique se a comunicação ao autor foi enviada.',priority:3};
  if(s.status==='withdrawn')return {key:'done',label:'RETIRADO',text:'Submissão retirada do fluxo editorial.',priority:4};
  return {key:'info',label:'ACOMPANHAMENTO',text:'Acompanhe o andamento desta submissão.',priority:3};
}
function renderEditorSummary(subs,assign,reviews){
  const triage=subs.filter(s=>s.status==='submitted'||s.status==='under_screening').length;
  const awaiting=subs.filter(s=>s.status==='under_review'&&assign.some(a=>a.submission_id===s.id&&!a.completed_at)).length;
  const decisions=subs.filter(s=>{if(s.status!=='under_review')return false;const aa=assign.filter(a=>a.submission_id===s.id);return aa.length>0&&aa.every(a=>a.completed_at)}).length;
  const revisions=subs.filter(s=>s.status==='revision_requested').length;
  $('#editor-summary').innerHTML=`<div class="summary-card action-card"><b>${triage}</b><span>Triagem / ação inicial</span></div><div class="summary-card"><b>${awaiting}</b><span>Aguardando pareceres</span></div><div class="summary-card action-card"><b>${decisions}</b><span>Decisão pendente</span></div><div class="summary-card"><b>${revisions}</b><span>Aguardando autor</span></div>`;
}
function renderReviewerWorkload(subs,assign,reviews,profiles){
  const box=$('#editor-reviewer-workload'),filter=$('#reviewer-workload-filter');
  if(!box||!filter)return;
  const reviewers=profiles.filter(p=>p.role==='reviewer'&&p.active);
  const subMap=Object.fromEntries(subs.map(s=>[s.id,s]));
  const reviewByAssign=Object.fromEntries(reviews.map(r=>[r.assignment_id,r]));
  const groups=reviewers.map(r=>({
    reviewer:r,
    assignments:assign.filter(a=>a.reviewer_id===r.id).map(a=>({assignment:a,submission:subMap[a.submission_id],review:reviewByAssign[a.id]})).filter(x=>x.submission)
  }));
  filter.innerHTML='<option value="">Todos os pareceristas</option>'+reviewers.map(r=>'<option value="'+r.id+'">'+esc(r.full_name||r.email)+'</option>').join('');
  const render=()=>{
    const chosen=filter.value;
    const selected=groups.filter(g=>!chosen||g.reviewer.id===chosen);
    box.innerHTML='';
    if(!selected.length){box.innerHTML=empty('Nenhum parecerista encontrado.');return}
    selected.forEach(g=>{
      const pending=g.assignments.filter(x=>!x.assignment.completed_at).length;
      const done=g.assignments.filter(x=>x.assignment.completed_at).length;
      const card=document.createElement('article');
      card.className='item-card reviewer-workload-card';
      card.innerHTML=`<div class="reviewer-workload-head"><div><h3>${esc(g.reviewer.full_name||'Parecerista')}</h3><div class="item-meta"><span>${esc(g.reviewer.email||'')}</span><span>${esc(g.reviewer.institution||'')}</span></div></div><div class="reviewer-workload-summary"><span><b>${g.assignments.length}</b> atribuídos</span><span><b>${pending}</b> pendentes</span><span><b>${done}</b> concluídos</span></div></div><div class="reviewer-assignment-list">${g.assignments.length?g.assignments.map(x=>{const a=x.assignment,s=x.submission,r=x.review;return `<div class="reviewer-assignment-row"><div><strong>${esc(s.code||'')} · ${esc(s.title)}</strong><small>Status do artigo: ${esc(labels[s.status]||s.status)}</small></div><div class="reviewer-assignment-state"><span class="${a.completed_at?'done':'pending'}">${a.completed_at?'Parecer recebido':'Pendente'}</span><small>Prazo: ${a.due_at?fmt(a.due_at):'não definido'}</small>${r?.recommendation?`<small>Recomendação: ${esc(r.recommendation)}</small>`:''}</div></div>`}).join(''):'<div class="empty-msg">Nenhum artigo atribuído.</div>'}</div>`;
      box.appendChild(card);
    });
  };
  filter.onchange=render;
  render();
}
function renderUsers(profiles){
  const box=$('#editor-users');
  if(!profiles.length){box.innerHTML=empty('Nenhum usuário.');return}
  const groups=[
    {role:'editor_chief',title:'Editor-Chefe',desc:'Administração completa do sistema'},
    {role:'managing_editor',title:'Editor Executivo',desc:'Operação do fluxo editorial'},
    {role:'reviewer',title:'Pareceristas',desc:'Usuários habilitados para avaliação por pares'},
    {role:'author',title:'Autores',desc:'Usuários cadastrados para submissão de artigos'}
  ];
  box.innerHTML='';
  groups.forEach(g=>{
    const members=profiles.filter(p=>p.role===g.role);
    const section=document.createElement('section');
    section.className='user-group';
    section.innerHTML=`<div class="user-group-head"><div><strong>${g.title}</strong><small>${g.desc}</small></div><span class="user-count">${members.length}</span></div><div class="user-group-list"></div>`;
    const list=section.querySelector('.user-group-list');
    if(!members.length){list.innerHTML='<div class="empty-msg">Nenhum usuário neste grupo.</div>'}
    members.forEach(p=>{
      const d=document.createElement('div');
      d.className='item-card user-row';
      d.innerHTML=`<div><strong>${esc(p.full_name||'Sem nome')}</strong><div class="item-meta"><span>${esc(p.email)}</span><span>${esc(p.institution||'')}</span>${p.force_password_change?'<span class="status">Troca de senha obrigatória</span>':''}</div></div><div class="item-actions"><select class="role-select"><option value="author" ${p.role==='author'?'selected':''}>Autor</option><option value="reviewer" ${p.role==='reviewer'?'selected':''}>Parecerista</option><option value="managing_editor" ${p.role==='managing_editor'?'selected':''}>Editor Executivo</option><option value="editor_chief" ${p.role==='editor_chief'?'selected':''}>Editor-Chefe</option></select>${p.id!==currentUser.id?'<input class="temp-password" type="password" minlength="8" placeholder="Senha temporária"><button class="btn ghost reset-password-btn" type="button">Resetar senha</button>':''}</div>`;
      const sel=d.querySelector('.role-select');
      sel.onchange=async()=>{
        const previous=p.role;
        const next=sel.value;
        if(p.id===currentUser.id){sel.value=previous;return notice('A função do Editor-Chefe não pode ser alterada por esta tela.','error')}
        sel.disabled=true;
        try{
          const {error}=await supabase.rpc('editor_set_user_role',{p_user_id:p.id,p_role:next});
          if(error)throw error;
          notice('Função atualizada. O usuário foi movido para o grupo correspondente.','ok');
          await loadEditor();
        }catch(err){
          sel.value=previous;
          notice('Não foi possível alterar a função: '+err.message,'error');
        }finally{sel.disabled=false}
      };
      const resetBtn=d.querySelector('.reset-password-btn');
      if(resetBtn)resetBtn.onclick=async()=>{
        const input=d.querySelector('.temp-password'),temporaryPassword=input.value;
        if(temporaryPassword.length<8)return notice('A senha temporária deve ter pelo menos 8 caracteres.','error');
        if(!confirm('Resetar a senha deste usuário? Os dados cadastrados serão mantidos.'))return;
        resetBtn.disabled=true;
        try{
          const result=await supabase.functions.invoke('admin-reset-password',{body:{user_id:p.id,temporary_password:temporaryPassword}});
          if(result.error)throw new Error(result.error.message||'Falha ao chamar o serviço de redefinição.');
          if(result.data?.error)throw new Error(result.data.error);
          const check=await supabase.from('profiles').select('force_password_change').eq('id',p.id).single();
          if(check.error)throw check.error;
          if(!check.data?.force_password_change)throw new Error('A redefinição não foi confirmada pelo servidor.');
          input.value='';
          notice('Senha temporária definida e confirmada.','ok');
          await loadEditor();
        }catch(err){notice('Não foi possível resetar a senha: '+err.message,'error')}
        finally{resetBtn.disabled=false}
      };
      list.appendChild(d);
    });
    box.appendChild(section);
  });
}
async function renderEditorSubmissions(subs,assign,reviews,messages,communications=[],publications=[]){
  const box=$('#editor-submissions');
  if(!subs.length){box.innerHTML=empty('Nenhuma submissão recebida.');return}
  const reviewers=allProfiles.filter(p=>p.role==='reviewer'&&p.active);
  const profileMap=Object.fromEntries(allProfiles.map(p=>[p.id,p]));
  const ordered=[...subs].sort((a,b)=>{
    const aa=assign.filter(x=>x.submission_id===a.id), ar=reviews.filter(r=>aa.some(x=>x.id===r.assignment_id));
    const ba=assign.filter(x=>x.submission_id===b.id), br=reviews.filter(r=>ba.some(x=>x.id===r.assignment_id));
    return editorWorkflowState(a,aa,ar).priority-editorWorkflowState(b,ba,br).priority || new Date(a.submitted_at)-new Date(b.submitted_at);
  });
  box.innerHTML='';
  for(const s of ordered){
    const as=assign.filter(a=>a.submission_id===s.id);
    const rs=reviews.filter(r=>as.some(a=>a.id===r.assignment_id));
    const author=profileMap[s.author_id];
    const publication=publications.find(p=>p.submission_id===s.id);
    const flow=editorWorkflowState(s,as,rs);
    const received=rs.filter(r=>r.submitted).length;
    const pending=as.filter(a=>!a.completed_at).length;
    const lastMessage=messages.find(m=>m.submission_id===s.id);
    const articleCommunications=communications.filter(c=>c.submission_id===s.id);
    const formalMessages=messages.filter(m=>m.submission_id===s.id).map(m=>({
      kind:'formal',
      created_at:m.created_at,
      recipient_id:s.author_id,
      recipient_email:m.recipient_email||author?.email||'',
      recipient_role:'author',
      subject:m.decision==='accepted'?'Decisão editorial · Aceite':m.decision==='rejected'?'Decisão editorial · Rejeição':m.decision==='revision_requested'?'Decisão editorial · Revisão solicitada':'Comunicação editorial ao autor',
      message:m.message,
      email_status:m.email_status||'pending'
    }));
    const articleHistory=[...articleCommunications,...formalMessages].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    const sentCommunicationCount=articleHistory.filter(c=>c.email_status==='sent').length;
    const reviewerInline=as.length
      ? `<div class="reviewer-inline-list"><strong>Pareceristas com este artigo</strong><div class="reviewer-inline-badges">${as.map(a=>{const p=profileMap[a.reviewer_id];const name=p?.full_name||p?.email||'Parecerista';const done=!!a.completed_at;return `<span class="reviewer-inline-chip ${done?'done':'pending'}"><span class="reviewer-inline-name">${esc(name)}</span><span class="reviewer-inline-state">${done?'parecer recebido':'parecer pendente'}${a.due_at?' · prazo '+fmt(a.due_at):''}</span></span>`}).join('')}</div></div>`
      : `<div class="reviewer-inline-list"><strong>Pareceristas com este artigo</strong><span class="reviewer-inline-empty">Nenhum parecerista atribuído ainda.</span></div>`;
    const decisionOptions=currentProfile.role==='editor_chief'
      ? '<option value="">Comunicação geral</option><option value="revision_requested">Solicitar revisão</option><option value="accepted">Comunicar aceite</option><option value="rejected">Comunicar rejeição</option>'
      : '<option value="">Comunicação geral</option><option value="revision_requested">Solicitar revisão</option>';
    const confidential= currentProfile.role==='editor_chief'
      ? rs.map((r,i)=>r.confidential_comments_to_editor?'<div class="confidential-note"><b>Confidencial · Parecer '+(i+1)+':</b> '+esc(r.confidential_comments_to_editor)+'</div>':'').join('')
      : '';
    const div=document.createElement('article');
    div.className='item-card editorial-card priority-'+flow.priority;
    div.innerHTML=`
      <div class="editorial-card-head">
        <div class="item-meta"><span class="status">${esc(labels[s.status]||s.status)}</span><span>${esc(s.code||'')}</span><span>${fmt(s.submitted_at)}</span></div>
        <span class="workflow-badge workflow-${flow.key}">${flow.label}</span>
      </div>
      <h3>${esc(s.title)}</h3>
      <div class="workflow-next"><strong>Próxima ação recomendada</strong><span>${esc(flow.text)}</span></div>
      <div class="review-progress">
        <div><b>${as.length}</b><span>Atribuídos</span></div>
        <div><b>${received}</b><span>Recebidos</span></div>
        <div><b>${pending}</b><span>Pendentes</span></div>
      </div>
      <details class="submission-details"><summary>Dados da submissão e resumo</summary>
        <p><b>Autor:</b> ${esc(author?.full_name||'')} · ${esc(author?.email||'')} ${author?.institution?'· '+esc(author.institution):''}</p>
        <p><b>Área:</b> ${esc(s.area||'—')}</p>
        <p><b>Resumo:</b> ${esc(s.abstract||'—')}</p>
      </details>
      <div class="file-separation editor-files"><div class="file-card manuscript-file"><div class="file-visual-head"><span class="file-icon">📄</span><div><span class="file-kind">ARTIGO / MANUSCRITO</span><strong>Manuscrito anonimizado</strong></div></div><span class="file-access-badge reviewer-access">✓ ARQUIVO ENVIADO AOS PARECERISTAS</span><small>Conteúdo científico usado na avaliação duplo-cega.</small>${reviewerInline}<button class="btn manuscript-btn">Abrir ARTIGO / MANUSCRITO</button></div><div class="file-card cover-file"><div class="file-visual-head"><span class="file-icon">👤</span><div><span class="file-kind">FOLHA DE ROSTO</span><strong>Identificação dos autores</strong></div></div><span class="file-access-badge editorial-access">🔒 NÃO É MOSTRADA AOS PARECERISTAS</span><small>Contém nomes, afiliações, e-mails, ORCID e autor correspondente.</small>${s.cover_sheet_path?'<button class="btn cover-btn">Abrir FOLHA DE ROSTO</button>':'<span class="file-missing">Não enviada — submissão anterior</span>'}</div></div>
      <div class="editor-action-bar">
        <select class="status-select">${(currentProfile.role==='managing_editor'?['submitted','under_screening','under_review','revision_requested','withdrawn']:['submitted','under_screening','under_review','revision_requested','accepted','rejected','withdrawn']).map(x=>`<option value="${x}" ${s.status===x?'selected':''}>${labels[x]}</option>`).join('')}</select>
        <button class="btn release-resubmission-btn" type="button">Liberar reenvio</button>
        ${currentProfile.role==='editor_chief'?'<button class="btn delete-submission-btn" type="button">Excluir submissão</button>':''}
      </div>
      ${['editor_chief','managing_editor'].includes(currentProfile.role)&&s.status==='accepted'?`<details class="publication-management" ${publication?'open':''}><summary><strong>${publication?'Publicação registrada':'Registrar publicação'}</strong></summary><form class="publication-form portal-form"><div class="form-row"><label>Volume<input name="volume" value="${esc(publication?.volume||'')}"></label><label>Número<input name="issue" value="${esc(publication?.issue||'')}"></label><label>Ano<input name="publication_year" type="number" min="2020" max="2100" value="${esc(publication?.publication_year||new Date().getFullYear())}"></label></div><div class="form-row"><label>Páginas<input name="pages" value="${esc(publication?.pages||'')}"></label><label>DOI<input name="doi" value="${esc(publication?.doi||'')}"></label></div><label>URL pública do artigo<input name="publication_url" type="url" value="${esc(publication?.publication_url||'')}"></label><label>Data da publicação<input name="published_at" type="date" value="${publication?.published_at?new Date(publication.published_at).toISOString().slice(0,10):new Date().toISOString().slice(0,10)}"></label><button class="btn primary" type="submit">${publication?'Atualizar dados de publicação':'Confirmar publicação'}</button><small>Ao registrar a publicação, o certificado de publicação ficará disponível para o autor.</small></form></details>`:''}
      <div class="review-block reviewer-management">
        <strong>Gestão dos pareceristas</strong>
        <div class="item-actions">
          <select class="reviewer-select"><option value="">Selecionar parecerista</option>${reviewers.map(r=>`<option value="${r.id}">${esc(r.full_name||r.email)} · ${esc(r.institution||'')}</option>`).join('')}</select>
          <input class="due-date" type="date">
          <button class="btn assign-btn">Atribuir</button>
        </div>
        ${as.length?`<div class="assigned-list">${as.map(a=>`<span class="${a.completed_at?'done':'pending'}">${esc(profileMap[a.reviewer_id]?.full_name||profileMap[a.reviewer_id]?.email||'Parecerista')} · ${a.completed_at?'parecer recebido':'pendente'}${a.due_at?' · '+fmt(a.due_at):''}</span>`).join('')}</div>`:'<p class="muted-line">Nenhum parecerista atribuído.</p>'}
      </div>
      ${rs.length?`<details class="review-block"><summary><strong>Pareceres recebidos (${received})</strong></summary>${rs.filter(r=>r.submitted).map((r,i)=>`<div class="review-block"><p><b>Parecerista:</b> ${esc(profileMap[r.reviewer_id]?.full_name||profileMap[r.reviewer_id]?.email||'')}</p><p><b>Recomendação:</b> ${esc(r.recommendation||'')}</p><p><b>Comentários aos autores:</b> ${esc(r.comments_to_author||'')}</p>${r.review_file_path?`<button class="btn review-file" data-path="${esc(r.review_file_path)}">Baixar arquivo do parecer</button>`:''}</div>`).join('')}${confidential}</details>`:''}
      <section class="author-communication article-author-email">
        <div class="communication-head">
          <div>
            <strong>Comunicar autor</strong>
            <small>Envio vinculado a este artigo. O histórico permanece registrado aqui.</small>
          </div>
          ${lastMessage
            ? `<div class="article-email-last-status">
                <span class="article-communication-status comm-${esc(lastMessage.email_status||'pending')}">${lastMessage.email_status==='sent'?'ENVIADO':lastMessage.email_status==='failed'?'FALHOU':lastMessage.email_status==='waiting_domain'?'AGUARDANDO':'PENDENTE'}</span>
                <strong>${esc(lastMessage.recipient_email||author?.email||'')}</strong>
                <small>${lastMessage.email_sent_at?'Enviado em '+fmt(lastMessage.email_sent_at):'Registrado em '+fmt(lastMessage.created_at)}</small>
              </div>`
            : '<span class="article-email-never">Nenhum e-mail enviado ainda</span>'}
        </div>
        ${formalMessages.length
          ? `<div class="article-email-history">
              <strong>Histórico deste artigo</strong>
              ${formalMessages.slice(0,5).map(m=>`<div class="article-email-history-row">
                <span class="article-communication-status comm-${esc(m.email_status||'pending')}">${m.email_status==='sent'?'ENVIADO':m.email_status==='failed'?'FALHOU':m.email_status==='waiting_domain'?'AGUARDANDO':'PENDENTE'}</span>
                <span>${esc(m.subject)}</span>
                <small>${fmt(m.created_at)}</small>
              </div>`).join('')}
            </div>`
          : ''}
        <input class="article-comm-recipient" type="hidden" value="${author?.id||''}" data-role="author">
        <div class="form-row">
          <label>Tipo de comunicação
            <select class="article-comm-type">
              <option value="general">Comunicação geral</option>
              <option value="author_update">Artigo em avaliação</option>
              <option value="revision_requested">Solicitar revisão</option>
              ${currentProfile.role==='editor_chief'?'<option value="accepted">Comunicar aceite</option><option value="rejected">Comunicar rejeição</option>':''}
            </select>
          </label>
          <label>Modelo rápido
            <select class="article-comm-template">
              <option value="">Escolha um modelo</option>
              <option value="author_review">Artigo em avaliação</option>
              <option value="author_revision">Solicitação de revisão</option>
              ${currentProfile.role==='editor_chief'?'<option value="accept">Aceite</option><option value="reject">Rejeição</option>':''}
            </select>
          </label>
        </div>
        <label>Assunto
          <input class="article-comm-subject" type="text" value="SETARI · ${esc(s.code||'Submissão')}">
        </label>
        <label>Mensagem
          <textarea class="article-comm-message" rows="6" placeholder="Escreva a mensagem que será enviada ao autor..."></textarea>
        </label>
        <div class="article-communication-send-row">
          <button class="btn primary article-comm-send" type="button">Registrar e enviar e-mail</button>
          <span>Para: <b>${esc(author?.email||'')}</b> · Respostas: setarijournal@gmail.com</span>
        </div>
      </section>`;

    div.querySelector('.manuscript-btn').onclick=async()=>{try{location.href=await signed('manuscripts',s.manuscript_path)}catch(e){notice(e.message,'error')}};
    const coverBtn=div.querySelector('.cover-btn');if(coverBtn)coverBtn.onclick=async()=>{try{location.href=await signed('cover-sheets',s.cover_sheet_path)}catch(e){notice(e.message,'error')}};
    div.querySelector('.status-select').onchange=async e=>{
      let error=null;
      if(currentProfile.role==='managing_editor'){const r=await supabase.rpc('managing_editor_set_status',{p_submission:s.id,p_status:e.target.value});error=r.error}
      else{const r=await supabase.from('submissions').update({status:e.target.value,updated_at:new Date().toISOString()}).eq('id',s.id);error=r.error}
      if(error)return notice(error.message,'error');
      notice('Status atualizado.','ok');await loadEditor()
    };
    div.querySelector('.release-resubmission-btn').onclick=async()=>{
      if(!confirm('Liberar o autor para fazer um novo envio? A submissão atual será marcada como retirada e permanecerá registrada no histórico.'))return;
      let error=null;
      if(currentProfile.role==='managing_editor'){const r=await supabase.rpc('managing_editor_set_status',{p_submission:s.id,p_status:'withdrawn'});error=r.error}
      else{const r=await supabase.from('submissions').update({status:'withdrawn',updated_at:new Date().toISOString()}).eq('id',s.id);error=r.error}
      if(error)return notice(error.message,'error');
      notice('Reenvio liberado. O autor pode fazer uma nova submissão.','ok');await loadEditor()
    };
    const removeBtn=div.querySelector('.delete-submission-btn');
    if(removeBtn)removeBtn.onclick=async()=>{
      if(!confirm('Confirma a exclusão desta submissão?'))return;
      removeBtn.disabled=true;
      try{
        const {error}=await supabase.rpc('editor_delete_submission',{p_submission_id:s.id});
        if(error)throw error;
        notice('Submissão excluída com sucesso.','ok');
        await loadEditor();
      }catch(err){
        notice('Não foi possível excluir a submissão: '+(err?.message||err),'error');
      }finally{
        removeBtn.disabled=false;
      }
    };

    const publicationForm=div.querySelector('.publication-form');
    if(publicationForm)publicationForm.onsubmit=async e=>{
      e.preventDefault();
      const fd=new FormData(publicationForm),btn=publicationForm.querySelector('button[type="submit"]');
      btn.disabled=true;
      try{
        const year=String(fd.get('publication_year')||'').trim();
        const date=String(fd.get('published_at')||'').trim();
        const {error}=await supabase.rpc('editor_upsert_publication',{
          p_submission_id:s.id,
          p_volume:String(fd.get('volume')||'').trim()||null,
          p_issue:String(fd.get('issue')||'').trim()||null,
          p_publication_year:year?Number(year):null,
          p_pages:String(fd.get('pages')||'').trim()||null,
          p_doi:String(fd.get('doi')||'').trim()||null,
          p_publication_url:String(fd.get('publication_url')||'').trim()||null,
          p_published_at:date?new Date(date+'T12:00:00-03:00').toISOString():new Date().toISOString()
        });
        if(error)throw error;
        notice('Publicação registrada. O certificado de publicação foi liberado para o autor.','ok');
        await loadEditor();
      }catch(err){notice('Não foi possível registrar a publicação: '+(err?.message||err),'error')}
      finally{btn.disabled=false}
    };

    div.querySelector('.assign-btn').onclick=async()=>{
      const rid=div.querySelector('.reviewer-select').value;
      if(!rid)return notice('Selecione um parecerista.','error');
      const due=div.querySelector('.due-date').value;
      const {error}=await supabase.rpc('assign_reviewer',{p_submission:s.id,p_reviewer:rid,p_due_at:due?new Date(due+'T23:59:59').toISOString():null});
      if(error)return notice(error.message,'error');
      notice('Parecerista atribuído.','ok');await loadEditor()
    };
    div.querySelectorAll('.review-file').forEach(b=>b.onclick=async()=>{try{location.href=await signed('reviews',b.dataset.path)}catch(e){notice(e.message,'error')}});

    const commRecipient=div.querySelector('.article-comm-recipient');
    const commType=div.querySelector('.article-comm-type');
    const commTemplate=div.querySelector('.article-comm-template');
    const commSubject=div.querySelector('.article-comm-subject');
    const commMessage=div.querySelector('.article-comm-message');

    commTemplate.onchange=()=>{
      const name=author?.full_name||'Autor(a)';
      const templates={
        author_review:{
          type:'author_update',
          subject:`SETARI · Atualização · ${s.code||'Submissão'}`,
          message:`Prezado(a) ${name},\n\nInformamos que o manuscrito ${s.code||''} — ${s.title} encontra-se em avaliação editorial/por pares. Acompanhe o andamento pela Área Restrita da SETARI.\n\nAtenciosamente,\nSETARI Editorial Office`
        },
        author_revision:{
          type:'revision_requested',
          subject:`SETARI · Revisão solicitada · ${s.code||'Submissão'}`,
          message:`Prezado(a) ${name},\n\nApós a avaliação editorial e dos pareceristas, solicitamos a revisão do manuscrito ${s.code||''} — ${s.title}. Consulte os pareceres disponibilizados na Área Restrita, realize os ajustes solicitados e encaminhe a nova versão.\n\nAtenciosamente,\nSETARI Editorial Office`
        },
        review_invitation:{
          type:'review_invitation',
          subject:`SETARI · Convite para avaliação · ${s.code||'Submissão'}`,
          message:`Prezado(a) Parecerista,\n\nGostaríamos de convidá-lo(a) para avaliar o manuscrito ${s.code||''} — ${s.title}. A avaliação deve ser realizada pela Área Restrita da SETARI, respeitando o processo duplo-cego e a confidencialidade editorial.\n\nAgradecemos pela colaboração.\n\nSETARI Editorial Office`
        },
        review_reminder:{
          type:'review_followup',
          subject:`SETARI · Lembrete de parecer · ${s.code||'Submissão'}`,
          message:`Prezado(a) Parecerista,\n\nEste é um lembrete sobre o parecer pendente referente ao manuscrito ${s.code||''} — ${s.title}. Pedimos, por gentileza, que verifique a Área Restrita e conclua a avaliação quando possível.\n\nCaso necessite de prazo adicional, responda a este e-mail.\n\nSETARI Editorial Office`
        },
        accept:{
          type:'accepted',
          subject:`SETARI · Manuscrito aceito · ${s.code||'Submissão'}`,
          message:`Prezado(a) ${name},\n\nTemos a satisfação de informar que o manuscrito ${s.code||''} — ${s.title} foi aceito para publicação na SETARI. As orientações para a etapa final serão encaminhadas pela equipe editorial.\n\nAtenciosamente,\nSETARI Editorial Office`
        },
        reject:{
          type:'rejected',
          subject:`SETARI · Decisão editorial · ${s.code||'Submissão'}`,
          message:`Prezado(a) ${name},\n\nApós a avaliação editorial e por pares, informamos que o manuscrito ${s.code||''} — ${s.title} não foi aceito para publicação nesta oportunidade. Agradecemos a submissão e a confiança na SETARI.\n\nAtenciosamente,\nSETARI Editorial Office`
        }
      };
      const t=templates[commTemplate.value];
      if(!t)return;
      commType.value=t.type;
      commSubject.value=t.subject;
      commMessage.value=t.message;
      if(['review_invitation','review_followup'].includes(t.type)){
      }
    };

    div.querySelector('.article-comm-send').onclick=async()=>{
      const recipientId=commRecipient.value;
      const selected=null;
      const recipientRole='author';
      const typeValue=commType.value;
      const text=commMessage.value.trim();
      const subject=commSubject.value.trim();
      if(!recipientId)return notice('Selecione o destinatário.','error');
      if(text.length<3)return notice('Escreva a mensagem antes de enviar.','error');
      const formalDecision=['revision_requested','accepted','rejected'].includes(typeValue);
      if(formalDecision&&recipientRole!=='author')return notice('Decisões editoriais formais devem ser enviadas ao autor.','error');
      if(!subject&&!formalDecision)return notice('Informe o assunto do e-mail.','error');
      const recipientLabel=author?.email||'autor';
      if(!confirm('Enviar esta comunicação de '+(s.code||'este artigo')+' para '+recipientLabel+'?'))return;

      const btn=div.querySelector('.article-comm-send');
      btn.disabled=true;btn.textContent='Enviando…';
      try{
        if(formalDecision){
          const created=await supabase.rpc('create_editorial_message',{p_submission_id:s.id,p_message:text,p_decision:typeValue});
          if(created.error)throw created.error;
          let statusError=null;
          if(currentProfile.role==='managing_editor'){
            const st=await supabase.rpc('managing_editor_set_status',{p_submission:s.id,p_status:typeValue});statusError=st.error;
          }else{
            const st=await supabase.from('submissions').update({status:typeValue,updated_at:new Date().toISOString()}).eq('id',s.id);statusError=st.error;
          }
          if(statusError)throw statusError;
          const sent=await supabase.functions.invoke('send-author-editorial-email',{body:{message_id:created.data}});
          if(sent.error)throw sent.error;
          if(sent.data?.error)throw new Error(sent.data.error);
        }else{
          const created=await supabase.rpc('create_editorial_communication',{
            p_recipient_id:recipientId,
            p_submission_id:s.id,
            p_subject:subject,
            p_message:text,
            p_communication_type:typeValue||'general'
          });
          if(created.error)throw created.error;
          const sent=await supabase.functions.invoke('send-editorial-communication',{body:{communication_id:created.data}});
          if(sent.error)throw sent.error;
          if(sent.data?.error)throw new Error(sent.data.error);
        }
        notice('E-mail enviado e registrado neste artigo.','ok');
        await loadEditor();
      }catch(err){
        notice('Não foi possível concluir o envio: '+(err?.message||err),'error');
      }finally{
        btn.disabled=false;btn.textContent='Enviar e-mail deste artigo';
      }
    };
    box.appendChild(div);
  }
}


refreshSession();