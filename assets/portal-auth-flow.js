import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL='https://iqfrakjlabkjxygdiktp.supabase.co';
const SUPABASE_KEY='sb_publishable_kntNAWBHQRobiuQmh2xStA_BnCnz0p1';
const PORTAL_URL='https://revistasetari.github.io/portal.html';
const PENDING_KEY='setariPendingConfirmationEmail';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s);
const lang=()=>localStorage.getItem('setariLang')==='en'?'en':'pt';
const t=(pt,en)=>lang()==='en'?en:pt;
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function ensureStyles(){if($('#setari-auth-flow-style'))return;const s=document.createElement('style');s.id='setari-auth-flow-style';s.textContent=`
.signup-help{margin-top:1rem;padding:1rem 1.05rem;border-radius:10px;background:#f4f8f8;border:1px solid #d6e3e3;font-size:.9rem;line-height:1.55}.signup-help strong{color:#07383f}.confirmation-card{margin-top:1rem;padding:1.15rem;border:2px solid #69a9a4;border-radius:12px;background:#f4fbfa}.confirmation-card h3{margin:.15rem 0 .55rem}.confirmation-card ol{padding-left:1.25rem;margin:.65rem 0}.confirmation-card li{margin:.45rem 0}.confirmation-email{display:block;margin:.65rem 0;padding:.65rem .75rem;border-radius:7px;background:#fff;border:1px solid #d4e2e1;font-weight:800;word-break:break-word}.confirmation-actions{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.9rem}.confirmation-actions .btn{margin:0}.auth-result{margin:0 0 1rem;padding:1rem 1.1rem;border-radius:10px;border:1px solid #b8d8d4;background:#f0faf8}.auth-result.error{border-color:#e2b4b4;background:#fff5f5}.auth-result h3{margin:.1rem 0 .45rem}@media(max-width:640px){.confirmation-actions{display:grid}.confirmation-actions .btn{width:100%}}
`;document.head.appendChild(s)}

function addPreSignupHelp(){const form=$('#signup-form');if(!form||$('#signup-help'))return;const d=document.createElement('div');d.id='signup-help';d.className='signup-help';d.innerHTML=`<strong>${t('Como funciona o cadastro:','How registration works:')}</strong><br>${t('1. Preencha nome, e-mail e senha. 2. Clique em Criar conta. 3. Abra o e-mail de confirmação enviado pelo sistema. 4. Clique no link de confirmação. 5. Volte à Área Restrita e entre com o mesmo e-mail e senha.','1. Enter your name, email and password. 2. Click Create account. 3. Open the confirmation email sent by the system. 4. Click the confirmation link. 5. Return to the Restricted Area and sign in with the same email and password.')}`;form.parentElement?.appendChild(d)}

function showConfirmation(email){const form=$('#signup-form');if(!form)return;let card=$('#signup-confirmation-card');if(!card){card=document.createElement('div');card.id='signup-confirmation-card';card.className='confirmation-card';form.after(card)}form.hidden=true;const help=$('#signup-help');if(help)help.hidden=true;card.hidden=false;card.innerHTML=`
<span class="kicker">${t('ÚLTIMA ETAPA DO CADASTRO','FINAL REGISTRATION STEP')}</span>
<h3>${t('Conta criada — confirme seu e-mail','Account created — confirm your email')}</h3>
<p>${t('O cadastro ainda não está pronto para uso. Enviamos uma mensagem de confirmação para:','Your registration is not ready to use yet. We sent a confirmation message to:')}</p>
<span class="confirmation-email">${esc(email)}</span>
<ol>
<li>${t('Abra a caixa de entrada desse e-mail. Verifique também Spam/Lixo eletrônico.','Open that email inbox. Also check Spam/Junk mail.')}</li>
<li>${t('Localize a mensagem de confirmação enviada pelo sistema da SETARI/Supabase.','Find the confirmation message sent by the SETARI/Supabase system.')}</li>
<li><strong>${t('Clique no link/botão de confirmar e-mail.','Click the confirm email link/button.')}</strong></li>
<li>${t('Após a confirmação, volte para esta Área Restrita.','After confirmation, return to this Restricted Area.')}</li>
<li>${t('Entre com o mesmo e-mail e a senha que você acabou de criar.','Sign in with the same email and the password you just created.')}</li>
</ol>
<p class="fine">${t('O link de confirmação é de uso único. Se você clicar novamente depois de já ter confirmado, ele pode aparecer como expirado/inválido — isso não significa que a primeira confirmação falhou.','The confirmation link is one-time use. If you click it again after confirming, it may appear expired/invalid — this does not mean the first confirmation failed.')}</p>
<div class="confirmation-actions"><button id="resend-confirmation" class="btn ghost" type="button">${t('Reenviar e-mail de confirmação','Resend confirmation email')}</button><button id="go-login" class="btn primary" type="button">${t('Já confirmei — ir para Entrar','I confirmed — go to Sign in')}</button><button id="change-signup-email" class="btn ghost" type="button">${t('Usar outro e-mail','Use another email')}</button></div>`;
$('#resend-confirmation').onclick=()=>resend(email);
$('#go-login').onclick=()=>goLogin(email);
$('#change-signup-email').onclick=()=>{localStorage.removeItem(PENDING_KEY);card.hidden=true;form.hidden=false;if(help)help.hidden=false;form.querySelector('input[name="email"]')?.focus()};
}

async function resend(email){const btn=$('#resend-confirmation');if(btn){btn.disabled=true;btn.textContent=t('Enviando…','Sending…')}
try{const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:PORTAL_URL}});if(error)throw error;showPageMessage(t('Novo e-mail enviado. Use sempre o link mais recente recebido.','A new email was sent. Always use the most recent link you received.'),'ok');let left=60;const timer=setInterval(()=>{left--;if(btn)btn.textContent=t(`Reenviar em ${left}s`,`Resend in ${left}s`);if(left<=0){clearInterval(timer);if(btn){btn.disabled=false;btn.textContent=t('Reenviar e-mail de confirmação','Resend confirmation email')}}},1000)}catch(e){const rate=String(e.message||'').toLowerCase().includes('security purposes')||String(e.message||'').includes('429');showPageMessage(rate?t('Aguarde cerca de 1 minuto antes de pedir outro e-mail de confirmação.','Please wait about 1 minute before requesting another confirmation email.'):t('Não foi possível reenviar: ','Could not resend: ')+e.message,'error');if(btn){btn.disabled=false;btn.textContent=t('Reenviar e-mail de confirmação','Resend confirmation email')}}}

function goLogin(email){const login=$('#login-form');if(!login)return;const inp=login.querySelector('input[name="email"]');if(inp)inp.value=email;login.scrollIntoView({behavior:'smooth',block:'center'});login.querySelector('input[name="password"]')?.focus()}

function showPageMessage(msg,type='ok',title=''){let box=$('#auth-flow-result');if(!box){box=document.createElement('div');box.id='auth-flow-result';const alert=$('#portal-alert');(alert?.parentElement||$('.wrap'))?.insertBefore(box,alert||null)}box.className='auth-result'+(type==='error'?' error':'');box.innerHTML=`${title?`<h3>${esc(title)}</h3>`:''}<div>${esc(msg)}</div>`;box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'center'})}

function interpretReturn(){const rawHash=new URLSearchParams(location.hash.replace(/^#/,''));const rawQuery=new URLSearchParams(location.search);const err=rawHash.get('error_description')||rawQuery.get('error_description');const code=rawHash.get('error_code')||rawQuery.get('error_code');const hasSession=rawHash.has('access_token')||rawHash.has('refresh_token');
if(err){const invalid=(code||'').includes('otp_expired')||/expired|invalid/i.test(err);showPageMessage(invalid?t('Este link está expirado, já foi utilizado ou não é mais válido. Se você já clicou nele uma vez, tente entrar normalmente. Caso o acesso não funcione, use “Reenviar e-mail de confirmação”.','This link has expired, was already used, or is no longer valid. If you already clicked it once, try signing in normally. If sign-in does not work, use “Resend confirmation email”.'):err,'error',t('Não foi possível usar este link','This link could not be used'));return}
if(hasSession){localStorage.removeItem(PENDING_KEY);showPageMessage(t('E-mail confirmado com sucesso. Sua conta está ativa. Você já pode acessar a Área Restrita.','Email confirmed successfully. Your account is active. You can now access the Restricted Area.'),'ok',t('E-mail confirmado','Email confirmed'));setTimeout(()=>history.replaceState({},document.title,location.pathname),1200)}}

async function handleSignup(e){e.preventDefault();e.stopImmediatePropagation();const form=e.target;if(form.id!=='signup-form')return;const fd=new FormData(form),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||''),fullName=String(fd.get('full_name')||'').trim();const btn=form.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.textContent=t('Criando conta…','Creating account…')}
try{const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:PORTAL_URL}});if(error)throw error;localStorage.setItem(PENDING_KEY,email);form.reset();if(data.session){localStorage.removeItem(PENDING_KEY);showPageMessage(t('Conta criada e autenticada com sucesso.','Account created and authenticated successfully.'),'ok')}else showConfirmation(email)}catch(err){const msg=String(err.message||err);const known=/already registered|already been registered|user already/i.test(msg);showPageMessage(known?t('Este e-mail já possui uma conta. Se você já confirmou o endereço, use a opção Entrar.','This email already has an account. If you have confirmed the address, use Sign in.'):t('Não foi possível criar a conta: ','Could not create the account: ')+msg,'error')}finally{if(btn){btn.disabled=false;btn.textContent=t('Criar conta','Create account')}}}

function restorePending(){const email=localStorage.getItem(PENDING_KEY);if(email&&!location.hash.includes('access_token'))showConfirmation(email)}
function refreshLanguage(){addPreSignupHelp();const email=localStorage.getItem(PENDING_KEY);if(email&&$('#signup-confirmation-card')&&!$('#signup-confirmation-card').hidden)showConfirmation(email)}
function boot(){ensureStyles();addPreSignupHelp();interpretReturn();restorePending();const form=$('#signup-form');if(form)form.addEventListener('submit',handleSignup,true);window.addEventListener('setari:lang',refreshLanguage)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
