# SETARI - Implantação institucional no GitHub Pages

## Identidade oficial

- Periódico: **SETARI - Science, Engineering, Technology, Applied Research & Innovation**
- E-mail institucional: **revistasetari@gmail.com**
- Conta GitHub recomendada: **revistasetari**
- Repositório recomendado: **revistasetari.github.io**
- URL preparada neste pacote: **https://revistasetari.github.io/**

## Importante

O e-mail `revistasetari@gmail.com` deve ser usado para criar/administrar a conta institucional da revista no GitHub. A conta GitHub atualmente conectada ao ChatGPT em nome pessoal não deve ser utilizada para a infraestrutura oficial da SETARI.

A criação de conta no GitHub exige senha, verificação de e-mail e eventualmente autenticação de segurança, portanto deve ser concluída pelo responsável da revista. Após criar e conectar essa conta, o conteúdo desta pasta pode ser publicado integralmente.

## Passos

1. Entre no GitHub usando uma conta criada com `revistasetari@gmail.com`.
2. Prefira o nome de usuário `revistasetari`, se estiver disponível.
3. Crie um repositório **público** chamado `revistasetari.github.io`.
4. Envie todo o conteúdo desta pasta para a raiz do repositório.
5. Em **Settings > Pages**, confirme publicação a partir da branch principal (`main`) e raiz (`/root`).
6. Verifique o acesso em `https://revistasetari.github.io/`.
7. Quando houver domínio próprio, substitua as URLs canônicas, sitemap, robots.txt, páginas de artigos e XML Crossref pela URL definitiva.

## Google Scholar

Cada artigo real deverá ter uma landing page HTML individual, PDF pesquisável e os metadados `citation_*`. O arquivo `articles/_template/index.html` permanece com `noindex,nofollow` enquanto contiver dados fictícios.

## Crossref

O arquivo `crossref/deposit-template.xml` já utiliza `revistasetari@gmail.com` como e-mail do depositante. Antes do depósito real, preencher prefixo DOI, registrante, ISSN, autores, datas e URL do artigo, e validar contra o schema Crossref vigente.

## Contato editorial

**revistasetari@gmail.com**


## Editorial Board form
The page `join-editorial.html` uses FormSubmit to forward submissions to revistasetari@gmail.com. The first live submission triggers a confirmation email; open it and confirm the form before expecting normal delivery.
