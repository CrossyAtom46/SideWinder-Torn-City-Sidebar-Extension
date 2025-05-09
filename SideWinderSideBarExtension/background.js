// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectEmojiPicker') {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: injectEmojiPickerScript
      })
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
      return true; // Keep the message channel open for the async response
    }
  });
  
  function injectEmojiPickerScript() {
    // This function runs in the context of the page, not the extension
    if (!window.emojiPickerInjected) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
      script.type = 'module';
      document.head.appendChild(script);
      window.emojiPickerInjected = true;
    }
  }