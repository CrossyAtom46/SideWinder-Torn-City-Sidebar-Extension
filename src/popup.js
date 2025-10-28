document.addEventListener("DOMContentLoaded", () => {
  function updateTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    chrome.storage.local.set({
      'sidebarTheme': theme
    });
  }
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    const isTornPage = tabs[0]?.url?.includes('torn.com');
    chrome.storage.local.get(['sidebarTheme'], (result) => {
      if (result.sidebarTheme && !isTornPage) {
        updateTheme(result.sidebarTheme);
      } else if (isTornPage) {
        if (!tabs[0]?.id) return;
        chrome.scripting.executeScript({
          target: {
            tabId: tabs[0].id
          },
          function: checkTheme
        }, (results) => {
          if (results?.[0]?.result) {
            const theme = results[0].result;
            updateTheme(theme);
          }
        });
      } else {
        updateTheme('light');
      }
    });
  });
  fetch(chrome.runtime.getURL('manifest.json')).then(response => response.json()).then(data => {
    document.getElementById("version").textContent = data.version;
  }).catch(error => console.error('Error fetching version:', error));
  document.getElementById("rateBtn")?.addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://chrome.google.com/webstore/detail/jcglaodacielmmbaphkljgmdaejbndci/reviews"
    });
  });
  document.getElementById("formButton")?.addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://www.torn.com/forums.php#/p=threads&f=67&t=16474152&b=0&a=0"
    });
  });
});

function checkTheme() {
  const groupContainer = document.getElementById('enhanced-sidebar');
  if (groupContainer) {
    const color = getComputedStyle(groupContainer).backgroundColor;
    const theme = color === 'rgb(26, 26, 26)' ? 'dark' : 'light';
    return theme;
  }
  return 'light';
}