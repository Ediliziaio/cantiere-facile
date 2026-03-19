

# Ingrandire il logo ovunque

## Modifiche

Aumentare l'altezza del logo in tutti i file dove è usato, portandolo a dimensioni più generose:

| File | Attuale | Nuovo |
|------|---------|-------|
| `AppSidebar.tsx` | `h-7` / `h-6` (collapsed) | `h-10` / `h-8` |
| `SuperAdminSidebar.tsx` | `h-7` / `h-6` (collapsed) | `h-10` / `h-8` |
| `TopBar.tsx` (mobile) | `h-6` | `h-8` |
| `SuperAdminLayout.tsx` (mobile) | `h-6` | `h-8` |
| `Login.tsx` | `h-9` | `h-12` |
| `Register.tsx` | `h-9` | `h-12` |
| `LandingNavbar.tsx` (dark + light + mobile) | `h-8` | `h-10` |
| `LandingFooter.tsx` | `h-8` | `h-10` |
| `FirmaPublica.tsx` | `h-6` | `h-8` |
| `CertificatoConformita.tsx` | `h-10` | `h-12` |

Nessuna modifica strutturale — solo la classe Tailwind dell'altezza su ogni `<img>` / `<motion.img>`.

