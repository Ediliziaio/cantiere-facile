

# Fix: 404 su /app/calendario — Build failure

## Problema
La pagina `/app/calendario` mostra un 404 perché il build fallisce. La causa è l'import inutilizzato `CalendarX` in `DayView.tsx` — rimasto dopo la rimozione del blocco "Nessuna attività" nella modifica precedente.

## Fix

### `src/components/calendario/DayView.tsx`
- Rimuovere `CalendarX` dall'import di lucide-react (riga 6):
```tsx
// Da:
import { Users, AlertTriangle, Clock, MapPin, Building2, CalendarX } from "lucide-react";
// A:
import { Users, AlertTriangle, Clock, MapPin, Building2 } from "lucide-react";
```

Una modifica su un solo file.

