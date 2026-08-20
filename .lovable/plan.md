# Corrigir o erro "This page didn't load" no preview

## O que encontrei

O build atual está OK (sem erros) e as 10 fotos estão como ficheiros reais em `src/assets/`. O ponto suspeito é o `vite.config.ts`, que tem `base: "/palace-spice-journey/"` fixo (colocado para o GitHub Pages).

Confirmado no servidor local:
- `/palace-spice-journey/` responde 200 e serve o site
- `/` responde 302 (redireciona para o caminho do GitHub Pages)

Ou seja, o site só existe dentro de um subcaminho. O preview do Lovable serve a app na raiz, e todos os links, ficheiros JS/CSS e imagens ficam prefixados com `/palace-spice-journey/`. Ainda não consegui confirmar a resposta exata do preview alojado (as chamadas externas devolvem 302 de autenticação), por isso o primeiro passo é reproduzir e confirmar antes de mudar código.

## Passos

1. Reproduzir o erro no preview com um browser automatizado, capturando o pedido que falha, o estado da consola e a resposta do servidor. Isto confirma (ou desmente) que a causa é o `base`.
2. Tornar o `base` condicional: raiz (`/`) no Lovable (preview e publicação) e `/palace-spice-journey/` apenas no build do GitHub Pages, acionado por uma variável de ambiente definida no workflow `.github/workflows/deploy.yml`.
3. Reconstruir e voltar a testar preview na raiz e o build de Pages no subcaminho, garantindo que fotos, ementa e galeria carregam nos dois casos.
4. Se o passo 1 mostrar outra causa (por exemplo erro de SSR numa rota), corrijo essa causa em vez de mexer no `base`, e explico o que era.

## Notas técnicas

- `vite.config.ts`: `base` passa a ler `process.env.GITHUB_PAGES_BASE` (ou equivalente) com fallback `/`.
- `deploy.yml`: passa essa variável no passo `npm run build`.
- Nada muda no layout, nos componentes, nem nos dados do restaurante.
