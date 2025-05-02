/**
 * Utility for including HTML snippets in pages
 * Use with <div data-include="path/to/your-file.html"></div>
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all elements with data-include attribute
  const includeElements = document.querySelectorAll('[data-include]');
  
  // Process each include element
  includeElements.forEach(function(element) {
    const filePath = element.getAttribute('data-include');
    
    // Skip if no path specified
    if (!filePath) return;
    
    // Fetch the HTML file
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load: ${filePath}`);
        }
        return response.text();
      })
      .then(html => {
        // Replace the element's content with the loaded HTML
        element.innerHTML = html;
        
        // Dispatch an event indicating the include is loaded
        element.dispatchEvent(new CustomEvent('include-loaded'));
        
        // Run any scripts that were included
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = script.textContent;
          script.parentNode.replaceChild(newScript, script);
        });
      })
      .catch(error => {
        console.error('Error including HTML:', error);
        element.innerHTML = `<p class="text-red-500">Error loading ${filePath}</p>`;
      });
  });
}); 