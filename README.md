# Almhem — Höstkollektionen 2026

## Om projektet

Ett portfolio-case: en produktionsanpassad ombyggnad av en design-handoff (hi-fi-prototyper i en
egen streaming-template-runtime) till ren HTML, CSS och JavaScript — inget ramverk, ingen
byggkedja. Två sidor för ett fiktivt möbelvarumärke, "Almhem": en kampanjlandningssida och en
produktsida.

Byggt inför en ansökan till en roll som **frontend & content producer** hos ett
möbel-e-handelsföretag som jobbar mycket med CMS. Därför vanilla HTML/CSS/JS istället för ett
ramverk — det visar direkt att man kan koda och hålla ordning på mallar utan ett
abstraktionslager, vilket är precis vad den typen av roll efterfrågar.

## Vad som byggdes

- **Landningssida** (`index.html`) — 13 sektioner: pinned hero med Ken Burns-effekt, USP-remsa,
  filtrerbart produktgrid, parallax-citatband, kategorigrid, en redaktionell "journal"-story,
  materialband, en mörk belysningssektion, nyhetsbrevsband, footer, och en varukorgsdrawer.
- **Produktsida** (`produkt-krona-savja.html`) för signaturprodukten "Krona Sävja, 12 ljus":
  galleri, finish-väljare, antal + lägg-i-korg, specifikationstabell, relaterade produkter.
- Delad promobar/header/footer-markup mellan sidorna, och en varukorg vars state delas mellan
  sidor **och** flikar via `localStorage` (+ ett `storage`-event för cross-tab-synk).

## Tekniska beslut värda att notera

- **Ingen byggkedja.** Båda sidorna går att öppna direkt via `file://`. Enda avsteget är
  `npm test` för enhetstesterna, vilket inte påverkar hur sidan i sig körs.
- **Riktiga interaktiva element.** Snabbköp, färgprickar, finish-val och antalssteg är
  `<button>` med rätt `aria-*`, tangentbordsnavigering och en dokumenterad `:focus-visible`-stil
  — inte klickbara `div`/`span` som i de ursprungliga designprototyperna.
- **Scroll-intoning** med `IntersectionObserver` (`threshold: 0`, negativ `rootMargin`) plus en
  passiv scroll-sweep som fallback, så en snabb skrollning inte kan lämna kort permanent osynliga.
- **Mobilmenyns öppna höjd är aldrig hårdkodad** — den animeras med
  `grid-template-rows: 0fr → 1fr` och anpassar sig alltså till sitt eget innehåll.
- **`prefers-reduced-motion` respekteras genomgående** — testat explicit (headless webbläsare)
  att alla element visas direkt utan animation när inställningen är på.
- **Ren varukorgslogik separerad från DOM:en**, i `cart-logic.js` (prismatte, sammanslagning av
  rader, fraktstatus) — enhetstestad med Nodes inbyggda testrunner, se `tests/`.
- **Responsiv bildladdning** — varje foto finns i fyra extra bredder (`srcset`), genererat en
  gång vid byggtillfället. Se `images/`.

## Medvetet avgränsat — inte buggar

- Produktdata, priser, lagerstatus och artikelnummer är fiktiva placeholders.
- Endast **"Krona Sävja"** har en fullständig produktsida i den här demon (tydligt markerat i
  produktgridet på landningssidan) — övriga sju kort visar katalogvyn.
- Nyhetsbrevet har en riktig submit-hanterare med success- och feltillstånd, men själva anropet
  är mockat (ingen backend finns ännu) — se kommentaren ovanför `mockSubscribe` i `main.js` för
  var en riktig endpoint kopplas in.
- Sök, konto och kassa är oruttade.
- Bilderna är AI-genererade placeholders — utom `images/verkstad-oljning.png` — och ska ersättas
  med riktig produktfotografi.

## Kör projektet

Öppna `index.html` direkt i en webbläsare. Ingen server krävs.

Vill du köra det över `http://` istället för `file://` (t.ex. för att testa nyhetsbrevets
`fetch`-liknande flöde som i produktion):

```
npx serve .
```

## Kör testerna

```
npm test
```
