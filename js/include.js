/**
 * Component including functionality
 * Allows dynamic loading of HTML components into placeholders
 */

// Export the include function
export function include(targetSelector, componentPath) {
    console.log(`Including ${componentPath} into ${targetSelector}`);
    
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
        console.error(`Target element not found: ${targetSelector}`);
        return;
    }
    
    // Make sure the path has .html extension
    if (!componentPath.endsWith('.html')) {
        componentPath = componentPath + '.html';
    }
    
    // Use absolute URL if not already
    if (!componentPath.startsWith('http') && !componentPath.startsWith('/')) {
        componentPath = '/' + componentPath;
    }
    
    // Fetch the component
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath} (${response.status})`);
            }
            return response.text();
        })
        .then(html => {
            // Insert the HTML
            targetElement.innerHTML = html;
            
            // Execute any scripts in the loaded component
            executeScripts(targetElement);
            
            console.log(`Component ${componentPath} loaded successfully`);
        })
        .catch(error => {
            console.error(`Error loading component ${componentPath}:`, error);
            targetElement.innerHTML = `<div class="p-4 text-center text-white/60">
                <p>Component could not be loaded</p>
                <p class="text-sm text-white/40">${error.message}</p>
            </div>`;
        });
}

/**
 * Execute scripts within a loaded component
 * @param {HTMLElement} container - The container element
 */
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy the content
        newScript.textContent = script.textContent;
        
        // Replace the old script with the new one
        script.parentNode.replaceChild(newScript, script);
    });
} 