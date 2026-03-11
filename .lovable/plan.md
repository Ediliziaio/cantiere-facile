

# Piano: Spaziatura e velocità marquee su mobile

## Cosa fare

1. **Aumentare lo spazio tra i loghi su mobile** — passare da `mx-12` a `mx-16` su mobile (`md:mx-12` per desktop)
2. **Velocizzare l'animazione su mobile** — ridurre durata da 30s a 15s su schermi < 768px

## Implementazione

### `src/components/landing/HeroSection.tsx` (riga 189)

Cambiare:
```tsx
className="flex items-center gap-3 mx-12 select-none shrink-0"
```

In:
```tsx
className="flex items-center gap-3 mx-16 md:mx-12 select-none shrink-0"
```

### `src/index.css` (dopo riga 165)

Aggiungere media query:
```css
@media (max-width: 768px) {
  .marquee-track {
    animation-duration: 15s;
  }
}
```

## File modificati
- `src/components/landing/HeroSection.tsx` — spaziatura responsive
- `src/index.css` — velocità animazione mobile

