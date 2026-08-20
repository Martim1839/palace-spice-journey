# Fotos dentro do repositório (visíveis no GitHub)

Objetivo: manter exatamente o mesmo aspeto da galeria, hero e "A Nossa História", mas com as fotografias guardadas dentro do projeto em vez de apontadores para o CDN. Assim aparecem no GitHub e funcionam em qualquer alojamento, sem erros de build.

## Situação atual

As 10 imagens existem apenas como ficheiros de apontador (`src/assets/*.png.asset.json`) que referem URLs internos do Lovable (`/__l5e/assets-v1/...`). No GitHub vê-se só o texto JSON, e fora do Lovable esses caminhos relativos não resolvem.

## O que vai ser feito

1. Descarregar as 10 imagens originais (cocktail, thali, image, image-2 a image-8) e gravá-las como ficheiros reais em `src/assets/`.
2. Converter de PNG para JPEG de alta qualidade (mesma resolução, qualidade 88) para reduzir o peso total de cerca de 4,1 MB para algo na ordem de 1 a 1,5 MB, mantendo a nitidez visível no site.
3. Trocar os imports em `src/lib/restaurant.ts` de `@/assets/x.png.asset.json` para `@/assets/x.jpg`, usando o import direto da imagem (o Vite trata do resto). Sem `.url`, sem o cast intermédio do korma.
4. Remover os apontadores `.asset.json` já não usados, com o comando próprio (para não deixar ficheiros órfãos no CDN).
5. Não mexer no layout: o mosaico da galeria, os `span` (wide/tall/normal), o `object-cover`, o lightbox, o hero e o About ficam idênticos.
6. Verificar o build e confirmar visualmente que as 10 fotos carregam na galeria, no hero e no About.

## Notas técnicas

- Imagens importadas ficam com hash no nome no build final e ficheiros binários reais no Git, portanto aparecem normalmente no GitHub.
- Ficheiros `.jpg` (não `.png`) porque são fotografias sem transparência; nenhuma delas precisa de canal alfa.
- `restaurant.ts` é o único ponto onde as imagens são declaradas, logo `Gallery.tsx`, `Hero.tsx` e `About.tsx` não precisam de alterações.
