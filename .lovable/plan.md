

## Cambio Font a Inter (standard)

Sostituisco i font Syne + DM Sans con **Inter** per tutto il testo (heading e body). Inter è un font moderno, professionale e altamente leggibile, standard per applicazioni SaaS B2B.

### Modifiche

**`index.html`**: Sostituisco il link Google Fonts da Syne+DM Sans a Inter.

**`src/index.css`**: Aggiorno le variabili CSS:
- `--font-heading: 'Inter', sans-serif`
- `--font-body: 'Inter', sans-serif`

**`tailwind.config.ts`**: Aggiorno le definizioni fontFamily:
- `heading: ['Inter', 'sans-serif']`
- `body: ['Inter', 'sans-serif']`

