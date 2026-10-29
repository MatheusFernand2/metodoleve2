# Método Leve 28 — landing page de vendas

Página estática (HTML + CSS + JS puro, sem build, sem dependências). Sobe em qualquer host:
Cloudflare Pages, Netlify, Vercel, Hostinger ou até no Cloudflare Workers com assets estáticos.

```
metodo-leve-28/
├── index.html           # as 10 seções da página
├── assets/
│   ├── css/style.css    # tokens de design + estilos por seção
│   ├── js/main.js       # CONFIG (preço, checkout, garantia) + interações
│   └── img/             # vazio: reservado para og.jpg e fotos reais, se quiser
└── README.md
```

## Antes de publicar — checklist obrigatório

Tudo que depende da oferta real está concentrado em `assets/js/main.js`, no objeto `CONFIG`:

| Chave | O que é | Estado atual |
|---|---|---|
| `checkoutUrl` | Link de pagamento (Hotmart, Kiwify, Eduzz, Cakto…) | **vazio** — os botões de compra rolam até a FAQ e não fingem comprar nada |
| `price` | Valor à vista, sem "R$" | `"97"` (sugestão; confirme na plataforma) |
| `installments` | Texto do parcelamento | `"ou em até 12x no cartão"` — troque pelo valor real da parcela quando a plataforma calcular |
| `guaranteeDays` | Dias de garantia | `7` (padrão Hotmart/Kiwify e exigido pelo CDC para compras online) |
| `supportEmail` | E-mail de suporte | `contato@SEU-DOMINIO.com.br` |
| `showTestimonials` | Mostra a seção de depoimentos | `false` — a seção **nunca** aparece enquanto houver placeholders no HTML, mesmo com `true` |

Outros pontos marcados com `TODO` no `index.html`:

- **Depoimentos** (seção 06): substitua os `[Depoimento real…]`, `[Nome]`, `[Cidade/UF]` por depoimentos verdadeiros, com autorização de uso. Depois ligue `showTestimonials`.
- **Rodapé**: links de Termos de uso e Política de privacidade (obrigatórios para rodar tráfego pago) e razão social/CNPJ.
- **Open Graph**: descomente e aponte `og:image` para uma imagem 1200×630 em `assets/img/og.jpg`.
- **Analytics**: a função `track()` em `main.js` dispara `begin_checkout` no clique de compra. Conecte seu Meta Pixel / GA4 / GTM ali.

## Decisões de produto e copy (para você validar ou ajustar)

Como não havia um produto definido, a página foi construída em cima de uma oferta coerente e **realizável**. Se o material que você produzir for diferente, ajuste o HTML — não publique prometendo o que não existe.

- **Produto**: Método Leve 28 — reeducação alimentar em 4 semanas, sem dieta restritiva, sem contagem de calorias.
- **Público**: adultos (copy levemente orientada ao feminino, 30–55) que já tentaram várias dietas e recuperaram o peso. Tom: direto, empático, zero culpa corporal.
- **Pilares**: o prato que sacia · a rotina que cabe · o protocolo do dia ruim.
- **Entregáveis descritos**: Guia principal (e-book) · Plano de refeições de 28 dias com 4 listas de compras · Tabela de substituições · Diário de progresso.
- **Bônus descritos**: 40 receitas em até 20 minutos · Comer fora sem sabotar · Checklist da despensa.
- **Formato**: PDF, acesso por e-mail, sem área de membros obrigatória (se usar Hotmart Club/Kiwify, ajuste a resposta "Como eu recebo o material?").
- **Preço**: R$ 97 à vista. Não há "preço de/por" riscado porque não existe referência legítima; a ancoragem é feita por comparação honesta ("pizza de sexta-feira") e pela lista de tudo que está incluído.
- **Alegações**: nenhuma promessa de quilos, prazos ou resultados garantidos. A FAQ diz explicitamente que resultado varia. O rodapé traz o aviso de que o material é educativo e não substitui acompanhamento profissional.

## Design

- **Paleta**: damasco claro (#FBF4EC) como papel, berinjela (#2B1A2F) como tinta e seções escuras, framboesa (#C62E67) só nos botões de ação, sálvia (#A9BFA3) nas formas orgânicas.
- **Tipografia**: Fraunces (títulos, com eixos SOFT/opsz) + Manrope (texto), via Google Fonts.
- **Mockups**: os e-books e o celular são construídos em CSS (sem imagens), então mudam de cor/título editando o HTML. Se você tiver as capas reais, troque o conteúdo de `.book__cover` por `<img>`.
- **Movimento**: uma única sequência de entrada no hero; FAQ com acordeão animado; barra fixa de CTA no mobile que some sobre a oferta e o rodapé. `prefers-reduced-motion` é respeitado.

## Publicar na Cloudflare Pages

1. Crie um repositório com esta pasta (ou arraste a pasta no painel do Pages).
2. Framework preset: **None**. Build command: vazio. Output directory: `/`.
3. Depois do deploy, preencha `CONFIG.checkoutUrl` e faça um novo deploy.

## Testes feitos

Renderizada em 1440px, 820px e 390px de largura sem overflow horizontal; acordeão, barra fixa e revelação por rolagem verificados em Chromium headless. Teste em um iPhone/Android real antes de rodar tráfego.
