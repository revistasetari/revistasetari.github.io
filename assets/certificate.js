import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm';

const supabase=createClient(
  'https://iqfrakjlabkjxygdiktp.supabase.co',
  'sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1'
);

const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmt=d=>d?new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(d)):'—';
const code=new URLSearchParams(location.search).get('codigo')||'';
const root=document.querySelector('#certificate');
const validateUrl=()=>location.origin+location.pathname.replace(/certificado\.html$/,'validar-certificado.html')+'?codigo='+encodeURIComponent(code);

document.querySelector('#print-btn')?.addEventListener('click',()=>window.print());
const validateLink=document.querySelector('#validate-link');
if(validateLink&&code)validateLink.href='validar-certificado.html?codigo='+encodeURIComponent(code);

function titleFor(type){
  if(type==='reviewer')return 'Reviewer Certificate';
  if(type==='author_acceptance')return 'Certificate of Acceptance';
  return 'Certificate of Publication';
}

function bodyFor(data){
  const m=data.metadata||{};
  const holder=esc(m.holder_name||'');

  if(data.certificate_type==='reviewer'){
    return `This is to certify that <strong>${holder}</strong>${m.institution?' ('+esc(m.institution)+')':''} served as an <strong>Ad Hoc Reviewer</strong> for <strong>SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation</strong>, contributing to the scientific peer-review process in an activity completed on <strong>${esc(fmt(m.activity_date))}</strong>. In accordance with editorial confidentiality and the double-blind review process, this certificate does not disclose the title, authorship, submission code, or any other identifying information related to the manuscript reviewed.`;
  }

  if(data.certificate_type==='author_acceptance'){
    return `This is to certify that the manuscript <strong>“${esc(m.title||'')}”</strong>, submission code <strong>${esc(m.submission_code||'')}</strong>, authored by <strong>${holder}</strong>, was <strong>accepted for publication</strong> in <strong>SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation</strong> on <strong>${esc(fmt(m.accepted_at))}</strong>, following completion of the journal’s editorial and peer-review process.`;
  }

  const bib=[
    m.volume?'Vol. '+esc(m.volume):'',
    m.issue?'No. '+esc(m.issue):'',
    m.publication_year?String(m.publication_year):'',
    m.pages?'pp. '+esc(m.pages):''
  ].filter(Boolean).join(' · ');

  return `This is to certify that the paper <strong>“${esc(m.title||'')}”</strong>, submission code <strong>${esc(m.submission_code||'')}</strong>, authored by <strong>${holder}</strong>, was <strong>published</strong> in <strong>SETARI — Science, Engineering, Technology, Applied Research &amp; Innovation</strong> on <strong>${esc(fmt(m.published_at))}</strong>${bib?' ('+bib+')':''}${m.doi?'. DOI: '+esc(m.doi):''}.`;
}

async function renderQR(){
  const img=document.querySelector('#qr');
  if(!img)return;
  try{
    img.src=await QRCode.toDataURL(validateUrl(),{
      width:180,
      margin:1,
      errorCorrectionLevel:'M'
    });
  }catch{
    img.style.display='none';
  }
}

async function load(){
  if(!code){
    root.innerHTML='<div class="error">Certificate code was not provided.</div>';
    return;
  }

  const {data,error}=await supabase.rpc('validate_certificate',{p_code:code});
  if(error||!data?.valid){
    root.innerHTML='<div class="error">Certificate not found or invalid.</div>';
    return;
  }

  const title=titleFor(data.certificate_type);
  root.innerHTML=`
    <section class="sheet">
      <span class="accent" aria-hidden="true"></span>
      <span class="corner" aria-hidden="true"></span>

      <img class="logo" src="assets/logo-setari.svg" alt="SETARI — Science, Engineering, Technology, Applied Research & Innovation">

      <div class="eyebrow">Official Certificate</div>
      <div class="title">${esc(title)}</div>
      <div class="rule" aria-hidden="true"></div>

      <div class="body">${bodyFor(data)}</div>

      <div class="signatures">
        <div class="signature">
          <b>Dr. Leonardo de Carvalho Vidal</b>
          Editor-in-Chief
        </div>
        <div class="signature">
          <b>Tayline Hândrea Pereira do Amaral</b>
          Executive Editor
        </div>
      </div>

      <div class="footer-meta">
        <div class="verify-copy">
          Issued on ${esc(fmt(data.issued_at))}<br>
          Authentication code: <span class="code">${esc(data.certificate_code)}</span><br>
          Verify this certificate at <strong>revistasetari.github.io/validar-certificado.html</strong>
        </div>
        <div class="qr-wrap">
          <img id="qr" alt="Certificate validation QR code">
          <span class="qr-label">Scan to verify</span>
        </div>
      </div>
    </section>
  `;

  await renderQR();
}
load();