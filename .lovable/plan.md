

# Sostituzione logo con immagine ufficiale

## Panoramica
Sostituire l'icona HardHat + testo "Cantiere in Cloud" con le immagini logo ufficiali caricate dall'utente. La versione "light" (sfondo chiaro) e "dark" (sfondo scuro) verranno usate nei contesti appropriati.

## File logo
- `src/assets/logo-light.png` — logo per sfondi chiari (testo scuro)
- `src/assets/logo-dark.png` — logo per sfondi scuri (testo bianco/chiaro)
- `public/favicon.png` — favicon estratto dal logo (icona gru/elmetto)

## Luoghi da aggiornare (10 file)

### Sfondi chiari → `logo-light.png`
| File | Contesto |
|------|----------|
| `src/pages/Login.tsx` | Logo nella pagina login |
| `src/pages/Register.tsx` | Logo nella pagina registrazione |
| `src/components/layout/AppSidebar.tsx` | Logo sidebar app |
| `src/components/layout/SuperAdminSidebar.tsx` | Logo sidebar superadmin |
| `src/components/layout/TopBar.tsx` | Logo mobile header |
| `src/components/layout/SuperAdminLayout.tsx` | Logo mobile header superadmin |
| `src/components/badge/CertificatoConformita.tsx` | Header certificato |
| `src/pages/firma/FirmaPublica.tsx` | Header firma pubblica |

### Sfondi scuri → `logo-dark.png`
| File | Contesto |
|------|----------|
| `src/components/landing/LandingNavbar.tsx` | Navbar landing (bianco su hero scuro, poi switch) |
| `src/components/landing/LandingFooter.tsx` | Footer landing (sfondo nero) |

### PWA e Favicon
| File | Modifica |
|------|----------|
| `index.html` | Puntare a `/favicon.png` |
| `public/favicon.png` | Copiare logo come favicon |

## Approccio per ogni sostituzione
- Rimuovere import `HardHat` (dove usato solo come logo)
- Importare l'asset: `import logoLight from "@/assets/logo-light.png"`
- Sostituire `<HardHat> + <span>Cantiere in Cloud</span>` con `<img src={logoLight} alt="Cantiere in Cloud" className="h-8" />`
- Per la navbar landing