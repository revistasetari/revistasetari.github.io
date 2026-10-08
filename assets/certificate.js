import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabase=createClient('https://iqfrakjlabkjxygdiktp.supabase.co','sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1');
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmt=d=>d?new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(d)):'—';
const code=new URLSearchParams(location.search).get('codigo')||'';
const root=document.querySelector('#certificate');
document.querySelector('#print-btn')?.addEventListener('click',()=>window.print());
function bodyFor(data){
 const m=data.metadata||{};
 const holder=esc(m.holder_name||'');
 if(data.certificate_type==='reviewer'){
  return `Certificamos que <strong>${holder}</strong>${m.institution?' ('+esc(m.institution)+')':''} atuou como <strong>Parecerista Ad Hoc</strong> da SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation, contribuindo com o processo de avaliação científica por pares em atividade concluída em ${esc(fmt(m.activity_date))}. Em respeito à confidencialidade editorial e ao processo duplo-cego, este certificado não identifica o manuscrito avaliado.`;
 }
 if(data.certificate_type==='author_acceptance'){
  return `Certificamos que o manuscrito <strong>“${esc(m.title||'')}”</strong>, código <strong>${esc(m.submission_code||'')}</strong>, de autoria vinculada a <strong>${holder}</strong>, foi <strong>aceito para publicação</strong> na SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation em ${esc(fmt(m.accepted_at))}, após cumprimento do fluxo editorial da revista.`;
 }
 const bib=[m.volume?'Vol. '+esc(m.volume):'',m.issue?'nº '+esc(m.issue):'',m.publication_year?String(m.publication_year):'',m.pages?'p. '+esc(m.pages):''].filter(Boolean).join(' · ');
 return `Certificamos que o trabalho <strong>“${esc(m.title||'')}”</strong>, código <strong>${esc(m.submission_code||'')}</strong>, de autoria vinculada a <strong>${holder}</strong>, foi <strong>publicado</strong> na SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation em ${esc(fmt(m.published_at))}${bib?' ('+bib+')':''}${m.doi?'. DOI: '+esc(m.doi):''}.`;
}
function titleFor(t){return t==='reviewer'?'Certificado de Parecerista Ad Hoc':t==='author_acceptance'?'Certificado de Aceite':'Certificado de Publicação'}
async function load(){
 if(!code){root.innerHTML='<div class="error">Código de certificado não informado.</div>';return}
 const {data,error}=await supabase.rpc('validate_certificate',{p_code:code});
 if(error||!data?.valid){root.innerHTML='<div class="error">Certificado não localizado ou inválido.</div>';return}
 const title=titleFor(data.certificate_type);
 root.innerHTML=`<section class="sheet"><div class="brand">SETARI</div><div class="full">SCIENCE, ENGINEERING, TECHNOLOGY, APPLIED RESEARCH &amp; INNOVATION</div><div class="title">${title}</div><div class="body">${bodyFor(data)}</div><div class="sign">Dr. Leonardo de Carvalho Vidal<br><strong>Editor-Chefe</strong></div><div class="verify">Emitido em ${esc(fmt(data.issued_at))} · Código de autenticidade: <span class="code">${esc(data.certificate_code)}</span><br>Validação: revistasetari.github.io/validar-certificado.html</div></section>`;
}
load();