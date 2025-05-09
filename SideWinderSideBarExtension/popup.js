document.addEventListener("DOMContentLoaded", () => {
    // Function to update theme and storage
    function updateTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        chrome.storage.local.set({ 'sidebarTheme': theme });
    }

    // Check if we're on Torn's page
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const isTornPage = tabs[0]?.url?.includes('torn.com');
        
        // Check storage first
        chrome.storage.local.get(['sidebarTheme'], (result) => {
            if (result.sidebarTheme && !isTornPage) {
                // Use saved theme if not on Torn
                updateTheme(result.sidebarTheme);
            } else if (isTornPage) {
                // Check page theme if on Torn
                if (!tabs[0]?.id) return;
                
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: checkTheme
                }, (results) => {
                    if (results?.[0]?.result) {
                        const theme = results[0].result;
                        updateTheme(theme);
                    }
                });
            } else {
                // Default to light theme
                updateTheme('light');
            }
        });
    });

    // Set version
    fetch(chrome.runtime.getURL('manifest.json'))
        .then(response => response.json())
        .then(data => {
            document.getElementById("version").textContent = data.version;
        })
        .catch(error => console.error('Error fetching version:', error));

    // Rate button
    document.getElementById("rateBtn")?.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID/reviews" });
    });

    // Form button
    document.getElementById("formButton")?.addEventListener("click", () => {
            chrome.tabs.create({ url: "https://torn.com/index.php" });
    });

});

function checkTheme() {
    const groupContainer = document.getElementById('enhanced-sidebar');
    if (groupContainer) {
        const color = getComputedStyle(groupContainer).backgroundColor;
        const theme = color === 'rgb(26, 26, 26)' ? 'dark' : 'light';
        return theme;
    }
    return 'light'; // Default theme
}