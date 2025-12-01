# LandingPage — Redesign Minimalista

## Paleta de Cores
- Primária: `primary` (aplicada via utilitários do tema: `text-primary`, `bg-primary`)
- Neutros: `background`, `foreground`, `muted` (tokens do tema: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`)
- Acento sutil: uso pontual da primária em estados positivos (ícones e badges). Evitamos cores adicionais para manter 2–3 cores principais.

## Tipografia
- Sans moderna já disponível no tema (`font-display`/`font-sans`).
- Hierarquia clara: títulos com `font-display` e `font-bold`, subtítulos e textos com `text-muted-foreground` e espaçamento generoso.

## Layout e Responsividade
- Containers com larguras máximas consistentes (`max-w-6xl`, `max-w-4xl`) e `space-y-*` para respiro.
- Grades responsivas: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Mobile-first; microinterações suaves mantidas em mobile sem exageros.

## Microinterações
- Transições leves: `transition`, `duration-200/300`, `ease-out`.
- Hover discreto: leve `scale` ou `translate` em CTAs e cards.
- Acessibilidade: `focus:ring` aplicado nos elementos interativos.

## Desempenho Visual
- Remoção de textura remota no Hero; substituição por gradiente CSS leve.
- Redução de sombras pesadas; preferência por bordas e `bg-muted`.
- `loading="lazy"` em imagem de depoimentos.

## Preservação de Funcionalidade
- Todos os `Link` e âncoras originais mantidos.
- Lógica de `mobileMenuOpen` e `billingCycle` intacta.
- Renderização de preços e conteúdo das seções preservados.

## Seções Atualizadas
- Navegação: borda e fundo translúcidos, transições nos itens.
- Hero: gradiente sutil, tipografia focada e CTAs com microinterações.
- Features: cards planos com ícones em círculos e hover leve.
- Depoimentos: bloco limpo, avatar com `lazy`, cartões sem gradientes fortes.
- Preços: toggle minimalista, destaque suave no plano Premium, CTAs com microinterações.
- CTA final: banda sólida primária, botão secundário contrastante com escala leve.
- Rodapé: espaçamento ampliado e links essenciais.

## Como Ajustar a Paleta
- Ajuste os tokens no tema (Tailwind/CSS vars) que alimentam `bg-background`, `text-foreground`, `text-primary` e `bg-muted`. As classes da página usam somente esses tokens para manter consistência.

## Testes e Validação
- Verifique âncoras (`#features`, `#testimonials`, `#pricing`) e navegação móvel.
- Teste alternância `Mensal/Anual` e destaque do plano Premium.
- Inspecione responsividade em `sm`, `md` e `lg`.

## Dependências
- Nenhuma dependência nova foi adicionada; reuso de Tailwind, `shadcn/ui`, `lucide-react` e `wouter` existentes.

