import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase=createClient(
  'https://iqfrakjlabkjxygdiktp.supabase.co',
  'sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1'
);

const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const labels={
  reviewer:'Reviewer Board Member Certificate',
  author_acceptance:'Certificate of Acceptance',
  author_publication:'Certificate of Publication'
};
const fmt=d=>d?new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(d)):'—';

const form=document.querySelector('#verify-form');
const input=document.querySelector('#code');
const result=document.querySelector('#result');
const q=new URLSearchParams(location.search).get('codigo');
if(q)input.value=q;

async function verify(){
  const code=input.value.trim();
  if(!code)return;

  result.innerHTML='<div class="result">Checking certificate…</div>';
  const {data,error}=await supabase.rpc('validate_certificate',{p_code:code});

  if(error){
    result.innerHTML='<div class="result invalid">The certificate could not be validated at this time.</div>';
    return;
  }

  if(!data?.valid){
    result.innerHTML='<div class="result invalid"><strong>Certificate not found.</strong><br>Please check the authentication code.</div>';
    return;
  }

  const m=data.metadata||{};
  const details=[
    ['Holder',m.holder_name],
    ['Institution',m.institution],
    ['Certificate type',labels[data.certificate_type]||data.certificate_type],
    ['Authentication code',data.certificate_code],
    ['Issued on',fmt(data.issued_at)]
  ];

  if(data.certificate_type==='reviewer'){
    details.push(['Review activity completed on',fmt(m.activity_date)]);
  }

  if(data.certificate_type==='author_acceptance'){
    details.push(
      ['Article',m.title],
      ['Submission code',m.submission_code],
      ['Accepted on',fmt(m.accepted_at)]
    );
  }

  if(data.certificate_type==='author_publication'){
    details.push(
      ['Article',m.title],
      ['Submission code',m.submission_code],
      ['Published on',fmt(m.published_at)],
      ['Volume',m.volume],
      ['Issue',m.issue],
      ['Year',m.publication_year],
      ['Pages',m.pages],
      ['DOI',m.doi]
    );
  }

  result.innerHTML=
    '<div class="result valid"><strong>✓ Valid SETARI certificate</strong>'+
    '<div class="meta">'+
    details.filter(x=>x[1]).map(x=>'<div><b>'+esc(x[0])+':</b> '+esc(x[1])+'</div>').join('')+
    '</div></div>';
}

form.addEventListener('submit',e=>{e.preventDefault();verify()});
if(q)verify();