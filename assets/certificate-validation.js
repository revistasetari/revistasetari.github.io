import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabase=createClient('https://iqfrakjlabkjxygdiktp.supabase.co','sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1');
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const labels={reviewer:'Certificado de Parecerista Ad Hoc',author_acceptance:'Certificado de Aceite',author_publication:'Certificado de Publicação'};
const fmt=d=>d?new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(d)):'—';
const form=document.querySelector('#verify-form'),input=document.querySelector('#code'),result=document.querySelector('#result');
const q=new URLSearchParams(location.search).get('codigo');if(q)input.value=q;
async function verify(){
 const code=input.value.trim();if(!code)return;
 result.innerHTML='<div class="result">Verificando…</div>';
 const {data,error}=await supabase.rpc('validate_certificate',{p_code:code});
 if(error){result.innerHTML='<div class="result invalid">Não foi possível realizar a validação agora.</div>';return}
 if(!data?.valid){result.innerHTML='<div class="result invalid"><strong>Certificado não localizado.</strong><br>Confira o código informado.</div>';return}
 const m=data.metadata||{};
 const details=[['Titular',m.holder_name],['Instituição',m.institution],['Tipo',labels[data.certificate_type]||data.certificate_type],['Código',data.certificate_code],['Emitido em',fmt(data.issued_at)]];
 if(data.certificate_type==='author_acceptance')details.push(['Artigo',m.title],['Código da submissão',m.submission_code],['Aceite',fmt(m.accepted_at)]);
 if(data.certificate_type==='author_publication')details.push(['Artigo',m.title],['Código da submissão',m.submission_code],['Publicado em',fmt(m.published_at)],['Volume',m.volume],['Número',m.issue],['Ano',m.publication_year],['DOI',m.doi]);
 if(data.certificate_type==='reviewer')details.push(['Atividade concluída em',fmt(m.activity_date)]);
 result.innerHTML='<div class="result valid"><strong>✓ Certificado válido</strong><div class="meta">'+details.filter(x=>x[1]).map(x=>'<div><b>'+esc(x[0])+':</b> '+esc(x[1])+'</div>').join('')+'</div></div>';
}
form.addEventListener('submit',e=>{e.preventDefault();verify()});if(q)verify();