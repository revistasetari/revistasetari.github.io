(()=>{
if(window.__SETARI_PORTAL_I18N_LITE__)return;window.__SETARI_PORTAL_I18N_LITE__=true;
const KEY='setariLang';let lang=localStorage.getItem(KEY)==='en'?'en':'pt';
const pairs=[
['Editor-Chefe','Editor-in-Chief'],['Parecerista','Reviewer'],['Autor','Author'],['Usuário','User'],
['Submetido','Submitted'],['Triagem editorial','Editorial screening'],['Em avaliação','Under review'],['Revisão solicitada','Revision requested'],['Aceito','Accepted'],['Rejeitado','Rejected'],['Retirado','Withdrawn'],
['Nova submissão','New submission'],['Minhas submissões','My submissions'],['Acompanhamento','Tracking'],['Artigos atribuídos','Assigned manuscripts'],['Submissões e pareceres','Submissions and reviews'],['Gestão de acesso','Access management'],['Usuários','Users'],
['Título','Title'],['Resumo','Abstract'],['Palavras-chave','Keywords'],['Área','Subject area'],['Selecione','Select'],['Prazo','Deadline'],['não definido','not set'],
['Enviar manuscrito','Submit manuscript'],['Baixar manuscrito anonimizado','Download anonymized manuscript'],['Baixar manuscrito','Download manuscript'],
['Comentários aos autores','Comments to authors'],['Comentários confidenciais ao Editor-Chefe','Confidential comments to the Editor-in-Chief'],['Recomendação','Recommendation'],['Aceitar','Accept'],['Revisão menor','Minor revision'],['Revisão maior','Major revision'],['Rejeitar','Reject'],['Enviar parecer final','Submit final review'],
['Parecer enviado','Review submitted'],['Pareceres liberados','Released reviews'],['Pareceres recebidos','Reviews received'],['Pareceres pendentes','Pending reviews'],['Atribuir parecerista','Assign reviewer'],['Atribuir','Assign'],['Atribuídos','Assigned'],
['Conta criada com sucesso.','Account created successfully.'],['Conta criada. Verifique seu e-mail para confirmar o cadastro antes de entrar.','Account created. Check your email to confirm registration before signing in.'],
['Artigo submetido com sucesso. A identidade do autor ficou separada do manuscrito.','Manuscript submitted successfully. Author identity has been kept separate from the manuscript.'],['Parecer enviado ao Editor-Chefe.','Review submitted to the Editor-in-Chief.'],['Função atualizada.','Role updated.'],
['Nenhuma submissão ainda.','No submissions yet.'],['Nenhum artigo atribuído a você.','No manuscripts assigned to you.'],['Nenhuma submissão recebida.','No submissions received.'],['Nenhum usuário.','No users.'],['Carregando…','Loading…'],['Sem nome','No name'],['pendente','pending'],
['Arquivo de parecer anotado (opcional)','Annotated review file (optional)'],['Baixar arquivo do parecer','Download review file'],['Comentários confidenciais ao editor','Confidential comments to the editor']
];
function staticApply(){
 document.documentElement.lang=lang==='en'?'en':'pt-BR';
 document.querySelectorAll('[data-pt][data-en]').forEach(el=>{const v=el.getAttribute(lang==='en'?'data-en':'data-pt');if(v==null)return;if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.value=v;else el.innerHTML=v});
 document.querySelectorAll('[data-placeholder-pt][data-placeholder-en]').forEach(el=>{el.placeholder=el.getAttribute(lang==='en'?'data-placeholder-en':'data-placeholder-pt')||''});
 document.querySelectorAll('[data-lang-toggle]').forEach(b=>{b.textContent=lang==='en'?'PT':'EN';b.setAttribute('aria-label',lang==='en'?'Mudar idioma para português':'Switch language to English')});
}
function translateText(s){if(!s)return s;let out=s;for(const [pt,en] of pairs){const from=lang==='en'?pt:en,to=lang==='en'?en:pt;if(out===from)out=to;else if(out.includes(from))out=out.split(from).join(to)}return out}
function dynamicApply(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){if(!n.nodeValue?.trim())return NodeFilter.FILTER_REJECT;const p=n.parentElement;if(!p||['SCRIPT','STYLE'].includes(p.tagName)||p.hasAttribute('data-pt'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes)n.nodeValue=translateText(n.nodeValue);
 document.querySelectorAll('option:not([data-pt])').forEach(o=>o.textContent=translateText(o.textContent));
}
function apply(){staticApply();dynamicApply()}
function schedule(){[0,500,1200,2600].forEach(ms=>setTimeout(apply,ms))}
function toggle(e){e?.preventDefault();e?.stopImmediatePropagation();lang=lang==='en'?'pt':'en';localStorage.setItem(KEY,lang);document.documentElement.lang=lang==='en'?'en':'pt-BR';location.reload()}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-lang-toggle]');if(b)return toggle(e);if(lang==='en')setTimeout(apply,250)},true);
document.addEventListener('submit',()=>{if(lang==='en'){setTimeout(apply,350);setTimeout(apply,1100)}},true);
function boot(){schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.SETARI_PORTAL_I18N={apply,lang:()=>lang};
})();