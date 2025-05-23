# Byggkostnadskalkylator

En WordPress-plugin för att beräkna byggkostnader för olika projekt.

## Funktioner
- Beräkna kostnader för trallbygge
- Beräkna kostnader för inomhusmålning
- Beräkna kostnader för fasadmålning
- ROT-avdrag inkluderat i beräkningarna

## Utveckling och Test
1. Starta en lokal server:
```bash
python -m http.server 8000
```

2. Öppna webbläsaren och gå till:
```
http://localhost:8000/test.html
```

## Installation i WordPress
1. Ladda upp hela mappen till `/wp-content/plugins/`
2. Aktivera pluginen i WordPress admin
3. Använd shortcode `[calculation_form]` på valfri sida

## Filer
- `Byggkostnadskalkylatorn.php` - Huvudfil för WordPress-pluginen
- `plugin-style.css` - CSS-styling
- `js/plugin-script.js` - JavaScript för beräkningar

## Licens

Detta projekt är licensierat under [Proprietär Licensversion 1.0](LICENSE.txt).

## Bidragande
Sebastian Aldrin,
Victor Vilches

## Uppdateringar
- Version 1.1: Uppdaterade priser och beräkningar för fasadmålning
- Förbättrat ROT-avdrag
- Förbättrat kontaktformulär design
