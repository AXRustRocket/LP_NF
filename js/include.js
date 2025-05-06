/**
 * Komponenten-Injection-Utility
 * Lädt HTML-Komponenten asynchron und injiziert sie in die Webseite.
 */

/**
 * Lädt eine HTML-Komponente und injiziert sie in das angegebene Ziel-Element.
 * @param {string} targetSelector - CSS-Selektor des Zielelements
 * @param {string} sourceUrl - Pfad zur HTML-Komponente
 */
export async function inject(targetSelector, sourceUrl) {
  try {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      console.error(`Zielelement ${targetSelector} nicht gefunden.`);
      return;
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Komponente: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    targetElement.innerHTML = html;

    // Führe alle Scripts innerhalb des importierten HTML aus
    const scripts = targetElement.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      
      // Kopiere alle Attribute des Original-Scripts
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Setze den Inhalt des Scripts
      newScript.textContent = script.textContent;
      
      // Ersetze das alte Script durch das neue
      script.parentNode.replaceChild(newScript, script);
    });

  } catch (error) {
    console.error('Fehler beim Laden der Komponente:', error);
  }
} 