# DigiITAle

Lo Standard Digitale Italiano. Un'unica piattaforma per fatture, documenti, clienti e burocrazia digitale.

**Live:** https://digitale-italia.netlify.app

## Stack

- **Framework:** Next.js 16 (App Router, Static Export)
- **Styling:** Tailwind CSS v4
- **Icons:** lucide-react
- **Font:** Inter (Google Fonts)
- **Deploy:** Netlify (static)

## Pagine

| Route | Descrizione |
|---|---|
| `/` | Landing page con 8 sezioni |
| `/accedi` | Login con credenziali demo |
| `/dashboard` | Dashboard interattiva completa |

## Sviluppo locale

```bash
npm install
npm run dev
```

## Build e deploy

```bash
npm run build          # genera /out (static export)
netlify deploy --dir=out --prod --no-build
```

## Architettura

```
src/
  components/
    BrandLogo.tsx       # Logo tricolore condiviso
  app/
    page.tsx            # Landing
    accedi/page.tsx     # Login
    dashboard/page.tsx  # Dashboard demo
    layout.tsx          # Root layout
    globals.css         # Design system tricolore
    icon.svg            # Favicon
    loading.tsx         # Loading spinner
    not-found.tsx       # 404 in italiano
```

## Brand

Palette tricolore italiana con colori per-letter su ITA:
- **I** verde (#009246)
- **T** bianco con text-shadow
- **A** rosso (#CE2B37)

## Licenza

Tutti i diritti riservati. Roberto Pizzini, 2026.
