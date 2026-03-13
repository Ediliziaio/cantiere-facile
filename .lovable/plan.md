

# Tooltip "Apri in Google Maps" sugli indirizzi

## Cosa fare
Aggiungere un `Tooltip` da Radix UI su ogni link indirizzo (icona MapPin + testo) nelle tre viste calendario, mostrando "Apri in Google Maps" al passaggio del mouse.

## Modifiche

### 3 file — stesso pattern
Wrappare ogni `<a>` dell'indirizzo in `<Tooltip>` + `<TooltipTrigger asChild>` + `<TooltipContent>`:

| File | Posizione |
|------|-----------|
| `src/components/calendario/DayView.tsx` | Blocco appuntamento (~riga 190) |
| `src/components/calendario/WeekView.tsx` | Riga 112 |
| `src/components/dashboard/CalendarDayDetail.tsx` | Riga 167 |

Per ogni file:
1. Importare `Tooltip, TooltipTrigger, TooltipContent, TooltipProvider` da `@/components/ui/tooltip`
2. Wrappare il link indirizzo:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <a href={mapsUrl} ...>{app.indirizzo}</a>
    </TooltipTrigger>
    <TooltipContent>Apri in Google Maps</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Nessuna nuova dipendenza — `@radix-ui/react-tooltip` è già installato.

