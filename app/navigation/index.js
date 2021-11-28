import document from "document";

let pages = {};

// De navigatie initialiseren met de router (zie router.js)
export function init(router) {
  pages = router;
}

// De naam van de huidige view ophalen.
export function getPage() {
  const re = /.*\/+(.*)+\..*/;
  return document.location.pathname.replace(re, "$1");
}

// Functie wordt hieronder aangeroepen. Nodig voor het terugswipen.
export function onUnload() {
  const page = getPage();
  if (pages[page] && pages[page].destroy) pages[page].destroy();
}

export async function switchPage(nextPage, stack) {
  const pagePath = `./resources/pages/${nextPage}.view`;

  // De huidige pagina in een constante steken zodat we deze in de functies hieronder kunnen gebruiken.
  const page = getPage();

  // Controleren of de geselecteerde pagina niet huidige pagina is.
  if (pagePath !== document.location.pathname) {
    if (stack) {
      await document.location.assign(pagePath);
    } else {
      await document.location.replace(pagePath);
    }

    // Event om te weten wanneer er wordt teruggeswiped.
    document.onbeforeunload = onUnload;

    // De vorige pagina vernietigen.
    if (!stack && pages[page] && pages[page].destroy) pages[page].destroy();

    // Een nieuwe pagina starten.
    if (pages[nextPage] && pages[nextPage].init) pages[nextPage].init();
  }
}
