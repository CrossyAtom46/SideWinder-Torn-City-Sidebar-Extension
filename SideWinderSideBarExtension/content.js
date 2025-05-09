/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';
    addDragStyles();
    const CONSTANTS = {
        VERSION: '1.0',
        SIDEBAR_WIDTH: 425,
        MIN_GROUP_WIDTH: 180,
        MIN_GROUP_HEIGHT: 100,
        TRADEMARK: '𝕊𝕚𝕕𝕖𝕎𝕚𝕟𝕕𝕖𝕣🔰',
        TAGLINES: [
            "Made with love by Doobiesuckin [3255641]",
            "Sometimes, It Doobiesuckin",
            "Hope your Enjoying the SideWinder Script!",
            "Does anyone actually read these?",
            "Tokyo Syndicate is the Best Faction",
            "Detecting Multiple Leviathan Class lifeforms in the Region",
            "Wanna Sign My Petition?",
            "Gordon! Get away from the Beam!",
            "Wait...If I smack Dwayne Johnsons butt, Did I hit rock bottom?",
            "I wrote this Splash Text on 12-29-24",
            "A Friend with Weed is a Friend Indeed",
            "So, You like Jazz?",
            "Fixing Torn's UI One Script at a Time!",
            "Caution: May contain nuts.",
            "All bugs are intentional. Trust the process",
            "This Sidebar is Fully optimized for staring contests.",
            "You Should give me a Donation, You know you want to",
            "Check out Community Crafters on Discord Forums!",
            "30% Less Likely to scam you over Leslie!",
            "Did you know? The average cloud weighs about 1 million pounds!",
            "Did you know? Some snails can sleep for three years straight!",
            "Did you know? Cheese is the most stolen food in the world!",
            "Be sure to Like and Review our Forum post!",
            "-Insert Cool Sidebar Music-",
            "I'm alive! I'm Ali...ERR0r..Sidewinder Re-Initialized",
            "A Script Chedburn Himself is Jealous of!",
            "Woah, Was that Legal?",
            "Still trying to find the funny",
            "Did you Take a Xanax Today?",
            "Remember Bazaars? Those were cool huh",
            "Keep Grinding those Crimes!",
            "Why not sign yourself up for a race?",
            "Your so close to that Gambling win, I can Feel it!",
            "Voice Mode Enabled, You can now Start Voicing Commands",
            "Ooh Baby, I'm debugging myself right now.",
            "Never Gonna Give you up, Never gonna let you down",
            "1f c0d3 === l1f3) { r3sp4wn();",
            "I don't even know how to code! -Doobie",
            "There's no place like 127.0.0.1...",
            "Happiness is just a hospital trip away.",
            "One man's trash is another's bazaar stock.",
            "Sleep is overrated when there's money to be mugged.",
            "Peace is just the downtime between wars.",
            "You call it scamming. We call it creative capitalism.",
            "You can Drag and Resize Groups in Edit Mode",
            "You can Delete Links, Targets, Groups and more In Delete Mode",
            "Create New Groups by Clicking the Green + button!",
            "Use Unicode when Selectiong Emojis for Links",
            "Find me on Dread! JK",
            "Struggle is the enemy, Weed is my remedy",
            "Dirty Hands, Clean Money",
            "Loading Additional Skill Modules",
            "Fire Script. No cap, On God - You Probably",
            "Idle Hands Leave you evil thoughts",
            "100% American Made",
            "If Diddy Did Diddle Dudes, How many Dudes Did Diddy Diddle?",
            "Add a new Link! I can Take it!",
            "Why'd you just do that?",
            "You've been Blessed! No OD's For 0.25 seconds! Better Hurry!",
            "Is this thing on",
            "01010101 01001110 01100101 01110010 01100100",
            "Shout out my dog, Torque the Husky",
            "Find Torn Tutorials on Youtube, Forums, and more!",
            "That didnt go to plan...",
            "Grass tastes bad",
            "Thats what she said",
            "28:06:42:12",
            "I have an inferiority complex, but it's not a very good one",
            "You've gotta hand it to blind prostitutes.",
            "I havent slept for 4 days! That would be too long.",
            "I, for one, like Roman numerals.",
            "Remember, There is no i in denial",
            "This Script is Open Source on Github!",
        ],
        STATE_KEYS: {
            GROUPS: 'sidebarGroups',
            NOTEPADS: 'sidebarNotepads',
            ATTACK_LISTS: 'attackLists',
            TODO_LISTS: 'todoLists',
            LOAN_TRACKER: 'loanTracker',
            AUCTION_TRACKER: 'auctionTracker',
            COUNTDOWN_GROUPS: 'countdownGroups',
            MANUAL_COUNTDOWN_GROUPS: 'manualCountdownGroups',
            LIGHT_MODE: 'lightMode',
            MINIMIZE_STATES: 'minimizeStates',
            SIDEBAR_STATE: 'sidebarState',
            CURRENT_PAGE: 'currentPage',
            PAGE_DATA: 'pageData'
        },
        THEMES: {
            LIGHT: {
                BG: '#ffffff',
                TEXT: '#000000',
                subTEXT: '#333333',
                BORDER: '#cccccc',
                HEADER: '#e0e0e0',
                SECONDARY_BG: '#f0f0f0',
                BUTTON_BG: '#999',
                SUCCESS: '#336633',
                DANGER: '#cc3333'
            },
            DARK: {
                BG: '#1a1a1a',
                TEXT: '#ffffff',
                subTEXT: '#cccccc',
                BORDER: '#444444',
                HEADER: '#2c2c2c',
                SECONDARY_BG: '#333333',
                BUTTON_BG: '#444444',
                SUCCESS: '#55aa55',
                DANGER: '#ff5555'
            }
        }
    };

    let groups = [];
    let notepads = [];
    let attackLists = [];
    let todoLists = [];
    let loanTracker = { entries: [] };
    let auctionTracker = { auctions: [] };
    let countdownGroups = [];
    let manualCountdownGroups = [];
    let isEditMode = false;
    let isDeleteMode = false;
    let isDragging = false;
    let dragTarget = null;
    let isLightMode = false;
    let isGlobalResizing = false;
    let isAutoWidth = localStorage.getItem('sidebarAutoWidth') !== '0';
    let debugMenuOpen = false;
    let currentPage = 0;
    let pageData = [{}, {}, {}];
    let clockVisible = false;

    function getSidebarWidth() {
        if (window.innerWidth < 768) {
            return window.innerWidth;
        }
        if (isAutoWidth) {
            const allElements = [
                ...groups,
                ...notepads,
                ...attackLists,
                ...todoLists,
                ...(loanTracker ? [loanTracker] : []),
                ...(auctionTracker ? [auctionTracker] : []),
                ...countdownGroups
            ];
            const widths = allElements.map(el => (el.size?.width || CONSTANTS.MIN_GROUP_WIDTH));
            widths.sort((a, b) => b - a);
            const widest = widths[0] || CONSTANTS.MIN_GROUP_WIDTH;
            const secondWidest = widths[1] || CONSTANTS.MIN_GROUP_WIDTH;
            const minForTwoColumns = widest + secondWidest + 32;
            return Math.max(minForTwoColumns, Math.min(Math.floor(window.innerWidth * 0.3), 600)) + 8;
        }
        return parseInt(localStorage.getItem('sidebarWidth')) || CONSTANTS.SIDEBAR_WIDTH;
    }
    function applySidebarWidth() {
        const sidebar = document.getElementById('enhanced-sidebar');
        if (sidebar) {
            sidebar.style.width = getSidebarWidth() + 'px';
        }
    }
    
    function safeStorage(operation, data = null) {
        return new Promise((resolve) => {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    if (operation === 'get') {
                        chrome.storage.local.get(data, result => {
                            if (chrome.runtime.lastError) {
                                resolve(null);
                            } else {
                                resolve(result);
                            }
                        });
                    } else if (operation === 'set') {
                        chrome.storage.local.set(data, () => {
                            if (chrome.runtime.lastError) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    } else if (operation === 'remove') {
                        chrome.storage.local.remove(data, () => {
                            if (chrome.runtime.lastError) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                } else {
                    // Fallback to localStorage if Chrome storage is not available
                    if (operation === 'get') {
                        const result = {};
                        data.forEach(key => {
                            result[key] = localStorage.getItem(key);
                        });
                        resolve(result);
                    } else if (operation === 'set') {
                        Object.entries(data).forEach(([key, value]) => {
                            localStorage.setItem(key, JSON.stringify(value));
                        });
                        resolve(true);
                    } else if (operation === 'remove') {
                        data.forEach(key => {
                            localStorage.removeItem(key);
                        });
                        resolve(true);
                    }
                }
            } catch (err) {
                console.error('Storage operation failed:', err);
                resolve(null);
            }
        });
    }
    // Enchance this to clean if anything old
    function saveState(key, value) {
        try {
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);

            // Save to Chrome storage
            chrome.storage.local.set({[key]: valueToStore}, () => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    // Fallback to localStorage
                    localStorage.setItem(key, valueToStore);
                }
            });

            // Also save to localStorage as backup
            localStorage.setItem(key, valueToStore);
            localStorage.setItem(`${key}_updatedAt`, Date.now());

            // Create a backup of previous value
            const currentValue = localStorage.getItem(key);
            if (currentValue) {
                localStorage.setItem(`${key}_backup`, currentValue);
            }

            return true;
        } catch (error) {
            console.error('Error saving state:', error);
            return false;
        }
    }

    async function openColorPicker(element, index) {
        const theme = getTheme();
        const overlay = createOverlay();

        return new Promise((resolve) => {
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.style.cssText = `
            background-color: ${theme.SECONDARY_BG};
            padding: 20px;
            border-radius: 5px;
            min-width: 300px;
            border: 1px solid ${theme.BORDER};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;

            const header = document.createElement('h3');
            header.textContent = 'Pick a Color';
            header.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            color: ${theme.TEXT};
        `;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = element.color || theme.SECONDARY_BG;
            colorInput.style.cssText = `
            width: 100%;
            height: 40px;
            margin-bottom: 15px;
            cursor: pointer;
        `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.style.cssText = `
            padding: 5px 15px;
            background-color: ${theme.BUTTON_BG};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
            padding: 5px 15px;
            background-color: ${theme.DANGER};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

            saveButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve({
                    elementColor: colorInput.value,
                    index: index
                });
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);

            colorPickerContainer.appendChild(header);
            colorPickerContainer.appendChild(colorInput);
            colorPickerContainer.appendChild(buttonContainer);
            overlay.appendChild(colorPickerContainer);
            document.body.appendChild(overlay);
        });
    }

    function loadState(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            if (!value || value === "null") return defaultValue;
            return JSON.parse(value);
        } catch (e) {
            console.error(`Error loading state for ${key}:`, e);
            return defaultValue;
        }
    }

    function initializeState() {
        currentPage = loadState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, 0);
        pageData = loadState(CONSTANTS.STATE_KEYS.PAGE_DATA, [{}, {}, {}]);

        loadPageData();

        isLightMode = loadState(CONSTANTS.STATE_KEYS.LIGHT_MODE, false);
    }

    function loadPageData() {
        groups = loadState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, []);
        notepads = loadState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, []);
        attackLists = loadState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, []);
        todoLists = loadState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, []);
        loanTracker = loadState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, { entries: [] });
        auctionTracker = loadState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, { auctions: [] });
        countdownGroups = loadState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, []);
        manualCountdownGroups = loadState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${currentPage}`, []);
    }

    function savePageData() {
        saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
        saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
        saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
        saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
        saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
        saveState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${currentPage}`, manualCountdownGroups);
        saveState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, currentPage);
    }

    function changePage(pageNumber) {
        savePageData();

        currentPage = pageNumber;
        saveState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, currentPage);

        loadPageData();

        refreshSidebar();

        showToast(`Switched to Page ${pageNumber + 1}`, 'info');
    }

    async function saveDialogState(dialogId, state) {
        try {
            const data = { [dialogId]: state };
            await safeStorage('set', data);
            return true;
        } catch (err) {
            console.error('Error saving dialog state:', err);
            return false;
        }
    }

    async function removeDialogState(dialogId) {
        try {
            await safeStorage('remove', [dialogId]);
            return true;
        } catch (err) {
            console.error('Error removing dialog state:', err);
            return false;
        }
    }
    
    function getTheme() {
        return isLightMode ? CONSTANTS.THEMES.LIGHT : CONSTANTS.THEMES.DARK;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    function showToast(message, type = 'info') {
        const existingToast = document.getElementById('sidebar-toast');
        if (existingToast) {
            existingToast.remove();
        }
    
        const theme = getTheme();
        
        // Get the current sidebar width instead of using the constant
        const sidebar = document.getElementById('enhanced-sidebar');
        const currentSidebarWidth = sidebar ? sidebar.offsetWidth : CONSTANTS.SIDEBAR_WIDTH;
    
        const toast = document.createElement('div');
        toast.id = 'sidebar-toast';
    
        let backgroundColor, textColor, borderColor;
        if (type === 'error') {
            backgroundColor = isLightMode ? '#ffeeee' : '#552222';
            textColor = isLightMode ? '#cc3333' : '#ffcccc';
            borderColor = isLightMode ? '#ffcccc' : '#993333';
        } else if (type === 'success') {
            backgroundColor = isLightMode ? '#eeffee' : '#225522';
            textColor = isLightMode ? '#33cc33' : '#ccffcc';
            borderColor = isLightMode ? '#ccffcc' : '#339933';
        } else {
            backgroundColor = theme.SECONDARY_BG;
            textColor = theme.TEXT;
            borderColor = theme.BORDER;
        }
    
        toast.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: ${currentSidebarWidth / 2 - 150}px;
            width: 300px;
            padding: 10px 15px;
            background-color: ${backgroundColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 992000;
            text-align: center;
            animation: toastFadeIn 0.3s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes toastFadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);

        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    function validateState() {
        if (!Array.isArray(groups)) {
            console.error('Groups is not an array, resetting to default');
            groups = [];
        }

        if (!Array.isArray(notepads)) {
            console.error('Notepads is not an array, resetting to default');
            notepads = [];
        }

        if (!Array.isArray(attackLists)) {
            console.error('Attack lists is not an array, resetting to default');
            attackLists = [];
        }

        if (!Array.isArray(todoLists)) {
            console.error('Todo lists is not an array, resetting to default');
            todoLists = [];
        }

        if (!loanTracker || typeof loanTracker !== 'object') {
            console.error('Loan tracker is invalid, resetting to default');
            loanTracker = { entries: [] };
        } else if (!Array.isArray(loanTracker.entries)) {
            loanTracker.entries = [];
        }

        if (!auctionTracker || typeof auctionTracker !== 'object') {
            console.error('Auction tracker is invalid, resetting to default');
            auctionTracker = { auctions: [] };
        } else if (!Array.isArray(auctionTracker.auctions)) {
            auctionTracker.auctions = [];
        }

        if (!Array.isArray(countdownGroups)) {
            console.error('Countdown groups is not an array, resetting to default');
            countdownGroups = [];
        }

        if (!Array.isArray(manualCountdownGroups)) {
            console.error('Manual countdown groups is not an array, resetting to default');
            manualCountdownGroups = [];
        }

        let auctionsUpdated = false;
        auctionTracker.auctions.forEach(auction => {
            if (auction.timeLeft !== undefined && auction.endTime === undefined) {
                auction.endTime = Date.now() + (auction.timeLeft * 60 * 1000);
                auction.created = Date.now();
                delete auction.timeLeft;
                auctionsUpdated = true;
            }
        });

        if (auctionsUpdated) {
            saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
        }

        let loansUpdated = false;
        loanTracker.entries.forEach(entry => {
            if (!entry.payments) {
                entry.payments = [];
                entry.created = Date.now();
                loansUpdated = true;
            }
        });

        if (loansUpdated) {
            saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
        }

        // Ensure we only have one countdown group
        if (countdownGroups.length > 1) {
            // Merge all timers into the first group
            for (let i = 1; i < countdownGroups.length; i++) {
                if (countdownGroups[i].timers && Array.isArray(countdownGroups[i].timers)) {
                    if (!countdownGroups[0].timers) {
                        countdownGroups[0].timers = [];
                    }
                    countdownGroups[0].timers = countdownGroups[0].timers.concat(countdownGroups[i].timers);
                }
            }
            // Keep only the first group
            countdownGroups = [countdownGroups[0]];
            saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
        }
    }

    function preserveSidebarAnimation() {
        const sidebar = document.getElementById('enhanced-sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');

        if (sidebar && toggleButton) {
            const currentTransform = window.getComputedStyle(sidebar).transform;
            const isHidden = currentTransform.includes('-102') || currentTransform.includes('matrix');

            sidebar.style.transition = 'transform 0.3s ease-in-out';
            toggleButton.style.transition = 'transform 0.3s ease-in-out, background-color 0.2s ease';

            saveState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden });
        }
    }

    function getLighterColor(color) {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const num = parseInt(hex, 16);
            const r = (num >> 16) + 20;
            const g = ((num >> 8) & 0x00FF) + 20;
            const b = (num & 0x0000FF) + 20;
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        }
        return color;
    }

    function createResizer(element, onResize) {
        const resizer = document.createElement('div');
        resizer.setAttribute('data-resizer', 'true');
        resizer.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: ${isLightMode ? '#999' : '#666'};
            position: absolute;
            right: 0;
            bottom: 0;
            cursor: se-resize;
            border-radius: 0 0 5px 0;
            display: ${isEditMode ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            transition: background-color 0.2s;
            z-index: 9910;
        `;

        resizer.innerHTML = '⮧';

        function handleResize(mouseEvent) {
            mouseEvent.preventDefault();
            mouseEvent.stopPropagation();
        
            isGlobalResizing = true;
        
            // Clear all intervals in the element
            element.querySelectorAll('[data-timer-id], [data-flash-interval]').forEach(el => {
                const timerId = el.dataset.timerId;
                const flashId = el.dataset.flashInterval;
                if (timerId) clearInterval(Number(timerId));
                if (flashId) clearInterval(Number(flashId));
            });
        
            const startX = mouseEvent.clientX;
            const startY = mouseEvent.clientY;
            const startWidth = element.offsetWidth;
            const startHeight = element.offsetHeight;
            const contentContainer = element.querySelector('.content-container');
            const contentHeight = contentContainer ? contentContainer.scrollHeight + 60 : CONSTANTS.MIN_GROUP_HEIGHT;
            const minHeight = Math.max(CONSTANTS.MIN_GROUP_HEIGHT, contentHeight);
        
            const sidebar = document.getElementById('enhanced-sidebar');
            const sidebarRect = sidebar.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
        
            function resize(moveEvent) {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;
        
                let newWidth = Math.max(CONSTANTS.MIN_GROUP_WIDTH, startWidth + deltaX);
                let newHeight = Math.max(minHeight, startHeight + deltaY);
        
                const maxWidth = sidebarRect.right - elementRect.left - 20;
                const maxHeight = sidebarRect.bottom - elementRect.top - 20;
        
                newWidth = Math.min(newWidth, maxWidth);
                newHeight = Math.min(newHeight, maxHeight);
        
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
            }
        
            function stopResize() {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            
                isGlobalResizing = false;
            
                // Get the exact width and height from the style (removing 'px')
                const exactWidth = parseInt(element.style.width);
                const exactHeight = parseInt(element.style.height);
                
                // Update size in state with these exact values
                if (onResize) onResize(exactWidth, exactHeight);
            
                // Delay refresh to prevent freezing
                setTimeout(() => refreshSidebar(), 100);
            }

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }

        resizer.addEventListener('mousedown', handleResize);

        resizer.addEventListener('mouseover', () => {
            if (isEditMode) {
                resizer.style.backgroundColor = isLightMode ? '#aaa' : '#777';
            }
        });

        resizer.addEventListener('mouseout', () => {
            resizer.style.backgroundColor = isLightMode ? '#999' : '#666';
        });

        return resizer;
    }
    function createAddButton(onClick, theme, label = '+') {
        const button = document.createElement('button');
        button.textContent = label;
        button.className = 'no-drag';
        button.style.cssText = `
            background-color: ${theme.SUCCESS};
            color: white;
            border: none;
            padding: 2px 6px;
            cursor: pointer;
            border-radius: 3px;
            font-size: ${label === '+' ? '16px' : '12px'};
        `;

        button.addEventListener('click', onClick);

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = getLighterColor(theme.SUCCESS);
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = theme.SUCCESS;
        });

        return button;
    }

    function createDeleteButton(onClick, theme, label = '✕') {
        const button = document.createElement('button');
        button.textContent = label;
        button.className = 'no-drag';
        button.style.cssText = `
            background-color: ${theme.DANGER};
            color: white;
            border: none;
            padding: 2px 6px;
            cursor: pointer;
            border-radius: 3px;
            font-size: ${label === '✕' ? '14px' : '12px'};
        `;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = getLighterColor(theme.DANGER);
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = theme.DANGER;
        });

        return button;
    }

    function createPaymentInput(entry, index, theme) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Payment';
        input.style.cssText = `
            width: 80px;
            padding: 4px 6px;
            border-radius: 3px;
            border: 1px solid ${theme.BORDER};
            background-color: ${theme.BG};
            color: ${theme.TEXT};
            font-size: 13px;
        `;

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value).toLocaleString();
                e.target.value = value;
            }
        });

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.className = 'no-drag';
        applyButton.style.cssText = `
            background-color: ${theme.SUCCESS};
            color: white;
            border: none;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 13px;
        `;

        applyButton.addEventListener('click', () => {
            if (!input.value) {
                alert('Please enter a payment amount');
                return;
            }

            const payment = parseFloat(input.value.replace(/,/g, ''));

            if (isNaN(payment) || payment <= 0) {
                alert('Please enter a valid payment amount');
                return;
            }

            if (payment > entry.amount) {
                confirmDelete(`The payment ($${payment.toLocaleString()}) is greater than the remaining loan amount ($${entry.amount.toLocaleString()}). The excess will be ignored. Continue?`, () => {
                    processPayment(payment);
                });
            } else {
                confirmDelete(`Apply payment of $${payment.toLocaleString()}?`, () => {
                    processPayment(payment);
                });
            }
        });

        function processPayment(payment) {
            const timestamp = Date.now();

            const actualPayment = Math.min(payment, entry.amount);

            if (!entry.payments) {
                entry.payments = [];
            }

            entry.payments.push({
                amount: actualPayment,
                date: timestamp,
                remaining: entry.amount - actualPayment
            });

            entry.amount -= actualPayment;

            if (entry.amount <= 0) {
                entry.amount = 0;

                const paymentWrapper = wrapper.parentNode;
                const paidIndicator = document.createElement('div');
                paidIndicator.textContent = '✅ PAID';
                paidIndicator.style.cssText = `
                    color: ${theme.SUCCESS};
                   font-weight: bold;
                   padding: 5px;
                `;
                paymentWrapper.innerHTML = '';
                paymentWrapper.appendChild(paidIndicator);

                setTimeout(() => {
                    loanTracker.entries.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
                    refreshSidebar();
                }, 2000);
            }

            input.value = '';

            saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
            refreshSidebar();
        }

        wrapper.appendChild(input);
        wrapper.appendChild(applyButton);
        return wrapper;
    }

    function formatTimeLeft(endTime) {
        const now = Date.now();
        const remainingMs = endTime - now;

        if (remainingMs <= 0) return "Ended";

        const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else {
            return `${minutes}m ${seconds}s`;
        }
    }

    function isEnding(endTime) {
        return (endTime - Date.now()) <= 15 * 60 * 1000;
    }

    function getAuctionColor(endTime, theme) {
        const timeLeft = endTime - Date.now();

        if (timeLeft <= 0) {
            return theme.DANGER;
        } else if (timeLeft <= 5 * 60 * 1000) {
            return theme.DANGER;
        } else if (timeLeft <= 15 * 60 * 1000) {
            return '#FFA500';
        } else {
            return theme.SUCCESS;
        }
    }

    function isOverdue(entry) {
        if (!entry.dueDate) return false;

        const now = new Date();
        const due = new Date(entry.dueDate);
        return now > due;
    }

    function getDueDateColor(entry, theme) {
        if (!entry.dueDate) return theme.BORDER;

        if (isOverdue(entry)) {
            return theme.DANGER;
        }

        const now = new Date();
        const due = new Date(entry.dueDate);
        const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 3) {
            return '#FFA500';
        }

        return theme.SUCCESS;
    }

    function confirmDelete(message, callback) {
        const theme = getTheme();
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 992000;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: ${theme.HEADER};
            padding: 20px;
            border-radius: 5px;
            min-width: 300px;
            border: 1px solid ${theme.BORDER};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            color: ${theme.TEXT};
        `;

        dialog.innerHTML = `
            <p style="margin: 0 0 20px 0;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="cancelBtn" style="
                    padding: 5px 15px;
                    border-radius: 3px;
                    border: none;
                    background: ${theme.BUTTON_BG};
                    color: ${theme.TEXT};
                    cursor: pointer;
                ">Cancel</button>
                <button class="confirmBtn" style="
                    padding: 5px 15px;
                    border-radius: 3px;
                    border: none;
                    background: ${theme.DANGER};
                    color: white;
                    cursor: pointer;
                ">Yes, Confirm</button>
            </div>
        `;

        function cleanup() {
            document.body.removeChild(overlay);
        }

        dialog.querySelector('.cancelBtn').addEventListener('click', cleanup);
        dialog.querySelector('.confirmBtn').addEventListener('click', () => {
            cleanup();
            callback();
        });

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    let isTypingOrFocused = false;
    function handleInputFocus(e) {
        const isInput = e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.contentEditable === 'true';

        if (isInput) {
            isTypingOrFocused = true;
            pauseAutoRefresh();
        }
    }

    function handleInputBlur(e) {
        const isInput = e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.contentEditable === 'true';

        if (isInput) {
            isTypingOrFocused = false;
            resumeAutoRefresh();
        }
    }
    document.addEventListener('focusin', handleInputFocus);
    document.addEventListener('focusout', handleInputBlur);
    document.addEventListener('keydown', (e) => {
        const isInput = e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.contentEditable === 'true';

        if (isInput) {
            isTypingOrFocused = true;
            pauseAutoRefresh();
        }
    });

    document.addEventListener('keyup', (e) => {
        const isInput = e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.contentEditable === 'true';

        if (isInput && !document.activeElement.matches('input, textarea, [contenteditable]')) {
            isTypingOrFocused = false;
            resumeAutoRefresh();
        }
    });
    function addSidebarResizer() {
        const sidebar = document.getElementById('enhanced-sidebar');
        if (!sidebar || document.getElementById('sidebar-width-resizer')) return;
    
        const resizer = document.createElement('div');
        resizer.id = 'sidebar-width-resizer';
        resizer.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            cursor: ew-resize;
            z-index: 991001;
            background: transparent;
        `;
    
        let startX, startWidth;
    
        resizer.addEventListener('mousedown', (e) => {
            if (isAutoWidth || window.innerWidth < 768) return; // Disable manual resize in auto/fullscreen mode
            startX = e.clientX;
            startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
            document.body.style.userSelect = 'none';
    
            function onMouseMove(ev) {
                const dx = ev.clientX - startX;
                let newWidth = Math.max(180, startWidth + dx);
                newWidth = Math.min(newWidth, window.innerWidth - 40); // Prevent overflow
                sidebar.style.width = newWidth + 'px';
            }
    
            function onMouseUp(ev) {
                const dx = ev.clientX - startX;
                let newWidth = Math.max(180, startWidth + dx);
                newWidth = Math.min(newWidth, window.innerWidth - 40);
                localStorage.setItem('sidebarWidth', newWidth);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.userSelect = '';
            }
    
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    
        sidebar.appendChild(resizer);
    }
    function pauseAutoRefresh() {
        // Store the current state of any intervals that need to be paused
        if (window.auctionCheckIntervalId) {
            clearInterval(window.auctionCheckIntervalId);
        }
    }

    function resumeAutoRefresh() {
        // Restart necessary intervals
        if (!window.auctionCheckIntervalId) {
            initializeAuctionUpdates();
        }
    }
    function refreshSidebar() {
        if (isGlobalResizing) return;
        if (isDragging || isTypingOrFocused) {
            return;
        }

        const groupContainer = document.getElementById('group-container');
        if (!groupContainer) return;

        try {
            applySidebarWidth();
            addSidebarResizer();
            const scrollPosition = groupContainer.scrollTop;

            // Clear the entire container first
            groupContainer.innerHTML = '';

            try {
                const reversedGroups = [...groups].reverse();
                reversedGroups.forEach((group, idx) => {
                    const originalIndex = groups.length - 1 - idx;
                    const groupDiv = createGroupElement(group, originalIndex);
                    groupContainer.appendChild(groupDiv);
                });

                if (countdownGroups.length > 0) {
                    countdownGroups.forEach((group, index) => {
                        const countdownDiv = createCountdownElement(group, index);
                        groupContainer.appendChild(countdownDiv);
                    });
                }

                notepads.forEach((notepad, index) => {
                    const notepadDiv = createNotepadElement(notepad, index);
                    groupContainer.appendChild(notepadDiv);
                });

                attackLists.forEach((list, index) => {
                    const attackListDiv = createAttackListElement(list, index);
                    groupContainer.appendChild(attackListDiv);
                });

                todoLists.forEach((list, index) => {
                    const todoListDiv = createTodoListElement(list, index);
                    groupContainer.appendChild(todoListDiv);
                });

                const loanTrackerState = localStorage.getItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`);
                if (loanTrackerState && loanTrackerState !== "null" && JSON.parse(loanTrackerState) !== null) {
                    const loanTrackerDiv = createLoanTrackerElement();
                    groupContainer.appendChild(loanTrackerDiv);
                }

                const auctionTrackerState = localStorage.getItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`);
                if (auctionTrackerState && auctionTrackerState !== "null" && JSON.parse(auctionTrackerState) !== null) {
                    const auctionTrackerDiv = createAuctionTrackerElement();
                    groupContainer.appendChild(auctionTrackerDiv);
                }
                groupContainer.scrollTop = scrollPosition;

                // Force mode-specific styling after refresh
                applyModeSpecificStyling();
            } catch (error) {
                console.error('Error rendering elements:', error);

                const errorMessage = document.createElement('div');
                errorMessage.style.cssText = `
                    padding: 15px;
                    margin: 20px;
                    background-color: ${isLightMode ? '#ffeeee' : '#552222'};
                    border: 1px solid ${isLightMode ? '#ffcccc' : '#993333'};
                    color: ${isLightMode ? '#cc3333' : '#ffcccc'};
                    border-radius: 5px;
                    text-align: center;
                `;
                errorMessage.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 8px;">Error Refreshing Sidebar</div>
                    <div>${error.message}</div>
                    <div style="margin-top: 10px; font-size: 14px;">Try reloading the page or checking for script updates.</div>
                `;
                groupContainer.appendChild(errorMessage);
            }
        } catch (error) {
            console.error('Critical error in refreshSidebar:', error);
        }
    }



    // Extract the styling logic to a separate function
    function applyModeSpecificStyling() {
        if (isDeleteMode) {
            document.querySelectorAll('.draggable').forEach(element => {
                const deleteBtn = element.querySelector('button[class*="delete"]');
                if (deleteBtn) {
                    deleteBtn.style.display = 'flex';
                }
            });
        } else if (isEditMode) {
            document.querySelectorAll('[data-resizer]').forEach(resizer => {
                resizer.style.display = 'flex';
            });
            document.querySelectorAll('.draggable').forEach(element => {
                element.style.cursor = 'move';
            });
        }
    }

    function checkTodoListResets() {
        todoLists.forEach((list) => {
            if (list.resetDaily) {
                const now = new Date();
                const utcHour = now.getUTCHours();
                const utcMinute = now.getUTCMinutes();

                if (utcHour === 0 && utcMinute === 0) {
                    list.items = list.items.map(item => ({
                        ...item,
                        checked: false
                    }));
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                }
            }
        });
    }


    function setupDragListeners(container) {
        container.removeEventListener('mousedown', handleDragStart);
        container.addEventListener('mousedown', handleDragStart);

        function handleDragStart(mouseEvent) {
            if (!isEditMode) return;
            if (mouseEvent.target.classList.contains('no-drag') ||
                mouseEvent.target.closest('.no-drag') ||
                mouseEvent.target.hasAttribute('data-resizer') ||
                mouseEvent.target.closest('[data-resizer]')) {
                return;
            }
            const draggable = mouseEvent.target.closest('.draggable');
            if (!draggable) return;

            isDragging = true;
            dragTarget = draggable;

            const allDraggable = document.querySelectorAll('.draggable');
            let maxZ = 1;
            allDraggable.forEach(el => {
                const zIndex = parseInt(el.style.zIndex || '1');
                maxZ = Math.max(maxZ, zIndex);
            });
            draggable.style.zIndex = `${maxZ + 1}`;

            const startX = mouseEvent.clientX;
            const startY = mouseEvent.clientY;
            const startLeft = parseInt(draggable.style.left) || 0;
            const startTop = parseInt(draggable.style.top) || 0;

            const sidebar = document.getElementById('enhanced-sidebar');
            const maxLeft = sidebar.offsetWidth - draggable.offsetWidth;
            const maxTop = sidebar.offsetHeight - draggable.offsetHeight;

            draggable.style.transition = 'none';

            draggable.classList.add('dragging');

            let lastUpdateTime = 0;
            const throttleMs = 10;

            const MAGNET_THRESHOLD = 20;
            const SNAP_THRESHOLD = 10; 

            function drag(moveEvent) {
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime < throttleMs) {
                    return;
                }

                lastUpdateTime = currentTime;
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                let newLeft = startLeft + dx;
                let newTop = startTop + dy;

                const currentRect = {
                    left: newLeft,
                    top: newTop,
                    right: newLeft + draggable.offsetWidth,
                    bottom: newTop + draggable.offsetHeight
                };

                const otherElements = Array.from(document.querySelectorAll('.draggable')).filter(el => el !== draggable);
                let bestHorizontalSnap = { distance: MAGNET_THRESHOLD, position: null };
                let bestVerticalSnap = { distance: MAGNET_THRESHOLD, position: null };

                otherElements.forEach(element => {
                    const elementPos = {
                        left: parseInt(element.style.left) || 0,
                        top: parseInt(element.style.top) || 0,
                        right: (parseInt(element.style.left) || 0) + element.offsetWidth,
                        bottom: (parseInt(element.style.top) || 0) + element.offsetHeight
                    };

                    const leftToRightDist = Math.abs(currentRect.left - elementPos.right);
                    if (leftToRightDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: leftToRightDist,
                            position: elementPos.right,
                            type: 'left'
                        };
                    }
                    const rightToLeftDist = Math.abs(currentRect.right - elementPos.left);
                    if (rightToLeftDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: rightToLeftDist,
                            position: elementPos.left - draggable.offsetWidth,
                            type: 'right'
                        };
                    }

                    const topToBottomDist = Math.abs(currentRect.top - elementPos.bottom);
                    if (topToBottomDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: topToBottomDist,
                            position: elementPos.bottom,
                            type: 'top'
                        };
                    }
                    const bottomToTopDist = Math.abs(currentRect.bottom - elementPos.top);
                    if (bottomToTopDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: bottomToTopDist,
                            position: elementPos.top - draggable.offsetHeight,
                            type: 'bottom'
                        };
                    }
                    const leftAlignDist = Math.abs(currentRect.left - elementPos.left);
                    if (leftAlignDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: leftAlignDist,
                            position: elementPos.left,
                            type: 'align-left'
                        };
                    }
                    const rightAlignDist = Math.abs(currentRect.right - elementPos.right);
                    if (rightAlignDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: rightAlignDist,
                            position: elementPos.right - draggable.offsetWidth,
                            type: 'align-right'
                        };
                    }
                    const topAlignDist = Math.abs(currentRect.top - elementPos.top);
                    if (topAlignDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: topAlignDist,
                            position: elementPos.top,
                            type: 'align-top'
                        };
                    }
                    const bottomAlignDist = Math.abs(currentRect.bottom - elementPos.bottom);
                    if (bottomAlignDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: bottomAlignDist,
                            position: elementPos.bottom - draggable.offsetHeight,
                            type: 'align-bottom'
                        };
                    }
                });

                if (bestHorizontalSnap.position !== null && bestHorizontalSnap.distance < SNAP_THRESHOLD) {
                    newLeft = bestHorizontalSnap.position;
                    draggable.classList.add('snapped-horizontal');
                } else {
                    draggable.classList.remove('snapped-horizontal');
                }
                if (bestVerticalSnap.position !== null && bestVerticalSnap.distance < SNAP_THRESHOLD) {
                    newTop = bestVerticalSnap.position;
                    draggable.classList.add('snapped-vertical');
                } else {
                    draggable.classList.remove('snapped-vertical');
                }
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                let hasOverlap = true;
                const MAX_ITERATIONS = 5;
                let iterations = 0;

                while (hasOverlap && iterations < MAX_ITERATIONS) {
                    iterations++;
                    hasOverlap = false;

                    const currentRect = {
                        left: newLeft,
                        top: newTop,
                        right: newLeft + draggable.offsetWidth,
                        bottom: newTop + draggable.offsetHeight
                    };

                    for (const element of otherElements) {
                        const elementRect = {
                            left: parseInt(element.style.left) || 0,
                            top: parseInt(element.style.top) || 0,
                            right: (parseInt(element.style.left) || 0) + element.offsetWidth,
                            bottom: (parseInt(element.style.top) || 0) + element.offsetHeight
                        };
                        if (currentRect.left < elementRect.right &&
                            currentRect.right > elementRect.left &&
                            currentRect.top < elementRect.bottom &&
                            currentRect.bottom > elementRect.top) {

                            hasOverlap = true;
                            const overlapLeft = elementRect.right - currentRect.left;
                            const overlapRight = currentRect.right - elementRect.left;
                            const overlapTop = elementRect.bottom - currentRect.top;
                            const overlapBottom = currentRect.bottom - elementRect.top;
                            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                            if (minOverlap === overlapLeft) {
                                newLeft = elementRect.right;
                            } else if (minOverlap === overlapRight) {
                                newLeft = elementRect.left - draggable.offsetWidth;
                            } else if (minOverlap === overlapTop) {
                                newTop = elementRect.bottom;
                            } else if (minOverlap === overlapBottom) {
                                newTop = elementRect.top - draggable.offsetHeight;
                            }
                            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                            newTop = Math.max(0, Math.min(newTop, maxTop));
                        }
                    }
                }
                draggable.style.left = `${newLeft}px`;
                draggable.style.top = `${newTop}px`;
                moveEvent.preventDefault();
            }

            function stopDrag() {
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDrag);
                const finalLeft = parseInt(draggable.style.left) || 0;
                const finalTop = parseInt(draggable.style.top) || 0;
                draggable.classList.remove('dragging', 'snapped-horizontal', 'snapped-vertical');
                const draggableElements = Array.from(document.querySelectorAll('.draggable'))
                    .filter(el => el !== draggable)
                    .sort((a, b) => {
                        const aTop = parseInt(a.style.top) || 0;
                        const bTop = parseInt(b.style.top) || 0;
                        return aTop - bTop;
                    });
                if (draggable.classList.contains('snapped-vertical')) {
                    for (const element of draggableElements) {
                        const elementTop = parseInt(element.style.top) || 0;
                        const elementBottom = elementTop + element.offsetHeight;
                        if (Math.abs(finalTop - elementBottom) < 10) {
                            draggable.style.top = `${elementBottom}px`;
                            break;
                        }
                        if (Math.abs(finalTop + draggable.offsetHeight - elementTop) < 10) {
                            draggable.style.top = `${elementTop - draggable.offsetHeight}px`;
                            break;
                        }
                    }
                }
                const type = draggable.dataset.type;
                const index = draggable.dataset.index;
                const position = {
                    x: parseInt(draggable.style.left) || 0,
                    y: parseInt(draggable.style.top) || 0
                };
                try {
                    switch(type) {
                        case 'group':
                            groups[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
                            break;
                        case 'notepad':
                            notepads[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
                            break;
                        case 'attackList':
                            attackLists[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
                            break;
                        case 'todoList':
                            todoLists[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                            break;
                        case 'loanTracker':
                            loanTracker.position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
                            break;
                        case 'auctionTracker':
                            auctionTracker.position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
                            break;
                        case 'countdown':
                            countdownGroups[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
                            break;
                        case 'manualCountdown':
                            manualCountdownGroups[index].position = position;
                            saveState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${currentPage}`, manualCountdownGroups);
                            break;
                    }
                } catch (error) {
                    console.error('Error saving position:', error);
                }
                isDragging = false;
                dragTarget = null;
                draggable.style.transition = '';
                refreshSidebar();
            }
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            mouseEvent.preventDefault();
        }
    }
    function addDragStyles() {
        const styleEl = document.getElementById('drag-styles') || document.createElement('style');
        styleEl.id = 'drag-styles';
        styleEl.textContent = `
            .draggable {
                position: absolute;
                transition: box-shadow 0.2s ease;
            }
            
            .draggable.dragging {
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            /* Magnet snap visual indicators */
            .draggable.snapped-horizontal {
                border-left: 2px solid #4d90fe;
                border-right: 2px solid #4d90fe;
            }
            
            .draggable.snapped-vertical {
                border-top: 2px solid #4d90fe;
                border-bottom: 2px solid #4d90fe;
            }
            
            .draggable.snapped-horizontal.snapped-vertical {
                box-shadow: 0 0 0 2px #4d90fe;
            }
        `;

        if (!styleEl.parentNode) {
            document.head.appendChild(styleEl);
        }
    }
    async function createPromptDialog(title, fields, existingDialogId = null) {
        return new Promise((resolve) => {
            const dialogId = existingDialogId || 'dialog_' + Date.now();
            const theme = getTheme();

            const overlay = createOverlay();
            const dialog = createDialogContainer(title, theme);

            dialog.innerHTML += `
                <form id="promptForm_${dialogId}">
                    ${createDialogFields(fields, dialogId, theme)}
                    ${createDialogButtons(theme)}
                </form>
            `;

            function cleanup() {
                document.body.removeChild(overlay);
                removeDialogState(dialogId);
            }

            const form = dialog.querySelector(`#promptForm_${dialogId}`);
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const values = {};
                fields.forEach(field => {
                    const input = document.getElementById(`${field.id}_${dialogId}`);
                    values[field.id] = field.type === 'checkbox' ? input.checked : input.value;
                });
                cleanup();
                resolve(values);
            });

            dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            saveDialogState(dialogId, {
                type: 'prompt',
                title,
                fields
            });

            const firstInput = dialog.querySelector('input');
            if (firstInput) firstInput.focus();

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 992000;
        `;
        return overlay;
    }

    function createDialogContainer(title, theme) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: ${theme.HEADER};
            padding: 20px;
            border-radius: 5px;
            min-width: 300px;
            border: 1px solid ${theme.BORDER};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;

        dialog.innerHTML = `
            <h3 style="color: ${theme.TEXT}; margin: 0 0 15px 0;">${title}</h3>
        `;

        return dialog;
    }

    function createDialogFields(fields, dialogId, theme) {
        return fields.map(field => `
            <div style="margin-bottom: 10px;">
                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">
                    ${field.label}:
                </label>
                <input
                    type="${field.type || 'text'}"
                    id="${field.id}_${dialogId}"
                    style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                        ${field.type === 'checkbox' ? 'width: auto;' : ''}
                    "
                    ${field.type === 'checkbox' ? 'class="checkbox-input"' : ''}
                >
            </div>
        `).join('');
    }

    function createDialogButtons(theme) {
        return `
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button
                    type="button"
                    class="cancelBtn"
                    style="
                        padding: 5px 15px;
                        border-radius: 3px;
                        border: none;
                        background: ${theme.BUTTON_BG};
                        color: ${theme.TEXT};
                        cursor: pointer;
                    "
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style="
                        padding: 5px 15px;
                        border-radius: 3px;
                        border: none;
                        background: ${theme.SUCCESS};
                        color: white;
                        cursor: pointer;
                    "
                >
                    OK
                </button>
            </div>
        `;
    }

    function createLinkDialog(groupIndex, existingDialogId = null) {
        const dialogId = existingDialogId || 'linkdialog' + Date.now();
        const theme = getTheme();

        const overlay = createOverlay();
        const dialog = createDialogContainer('Add Link', theme);

        dialog.innerHTML += `
            <form id="linkForm_${dialogId}">
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link Name:</label>
                    <input type="text" id="linkName_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link URL:</label>
                    <input type="text" id="linkUrl_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Emoji:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" id="linkEmoji_${dialogId}" style="
                            flex: 1;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                        " placeholder="🔗">
                        ${createEmojiButtons(theme)}
                    </div>
                </div>
                ${createDialogButtons(theme)}
            </form>
        `;

        setupEmojiLookup(dialog);

        function cleanup() {
            document.body.removeChild(overlay);
            removeDialogState(dialogId);
        }

        const form = dialog.querySelector(`#linkForm_${dialogId}`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById(`linkName_${dialogId}`).value;
            const url = document.getElementById(`linkUrl_${dialogId}`).value || window.location.href;
            const emoji = document.getElementById(`linkEmoji_${dialogId}`).value;

            if (name && url) {
                groups[groupIndex].links.push({
                    name,
                    url,
                    emoji: emoji || '🔗'
                });
                saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
                refreshSidebar();
            }
            cleanup();
        });

        dialog.querySelector('.cancelBtn').addEventListener('click', cleanup);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        saveDialogState(dialogId, {
            type: 'link',
            groupIndex,
        });

        document.getElementById(`linkName_${dialogId}`).focus();

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    function createEmojiButtons(theme) {
        return `
            <div class="emoji-button-container" style="position: relative;">
                <button type="button" class="emoji-lookup" style="
                    padding: 5px 10px;
                    background: ${theme.BUTTON_BG};
                    color: ${theme.TEXT};
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                ">Emoji List</button>
                <div class="tooltip" style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${theme.HEADER};
                    color: ${theme.TEXT};
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 12px;
                    white-space: nowrap;
                    display: none;
                ">Opens Unicode Emoji Site</div>
            </div>
            <div class="emoji-button-container" style="position: relative;">
                <button type="button" class="emoji-lookup-2" style="
                    padding: 5px 10px;
                    background: ${theme.BUTTON_BG};
                    color: ${theme.TEXT};
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                ">Emoji List 2</button>
                <div class="tooltip" style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${theme.HEADER};
                    color: ${theme.TEXT};
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 12px;
                    white-space: nowrap;
                    display: none;
                ">Opens Emoji Reference Site</div>
            </div>
        `;
    }

    function setupEmojiLookup(dialog) {
        dialog.querySelectorAll('.emoji-button-container').forEach(container => {
            const button = container.querySelector('button');
            const tooltip = container.querySelector('.tooltip');

            button.addEventListener('mouseover', () => {
                tooltip.style.display = 'block';
            });

            button.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });
        });

        dialog.querySelector('.emoji-lookup').addEventListener('click', () => {
            window.open('http://xahlee.info/comp/unicode_index.html', '_blank');
        });

        dialog.querySelector('.emoji-lookup-2').addEventListener('click', () => {
            window.open('https://emojipedia.org', '_blank');
        });
    }

    async function createLoanEntryDialog(existingDialogId = null) {
        const dialogId = existingDialogId || 'loandialog' + Date.now();
        const theme = getTheme();

        const overlay = createOverlay();
        const dialog = createDialogContainer('Add Loan Entry', theme);

        dialog.innerHTML = `
            <form id="loanEntryForm_${dialogId}">
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">User:</label>
                    <input type="text" id="user_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Amount:</label>
                    <input
                        type="text"
                        id="amount_${dialogId}"
                        placeholder="Enter amount (e.g., 1,000,000)"
                        style="
                            width: 100%;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                        "
                    >
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Due Date (Optional):</label>
                    <input
                        type="date"
                        id="dueDate_${dialogId}"
                        style="
                            width: 100%;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                        "
                    >
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Notes (Optional):</label>
                    <textarea
                        id="notes_${dialogId}"
                        style="
                            width: 100%;
                            height: 60px;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                            resize: none;
                        "
                    ></textarea>
                </div>
                ${createDialogButtons(theme)}
            </form>
        `;

        return new Promise((resolve) => {
            function cleanup() {
                document.body.removeChild(overlay);
                removeDialogState(dialogId);
            }

            const amountInput = dialog.querySelector(`#amount_${dialogId}`);
            amountInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString();
                    e.target.value = value;
                }
            });

            dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            dialog.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById(`user_${dialogId}`).value.trim();
                const amountStr = document.getElementById(`amount_${dialogId}`).value;
                const amount = parseFloat(amountStr.replace(/,/g, ''));
                const dueDate = document.getElementById(`dueDate_${dialogId}`).value;
                const notes = document.getElementById(`notes_${dialogId}`).value.trim();

                if (!user) {
                    alert('Please enter a user name');
                    return;
                }

                if (!amountStr || isNaN(amount) || amount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                }

                cleanup();
                resolve({
                    user,
                    amount,
                    dueDate: dueDate || null,
                    notes: notes || '',
                    created: Date.now(),
                    payments: []
                });
            });

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            saveDialogState(dialogId, {
                type: 'loanEntry'
            });

            document.getElementById(`user_${dialogId}`).focus();

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
    async function createAuctionEntryDialog(existingDialogId = null) {
        const dialogId = existingDialogId || 'auctiondialog' + Date.now();
        const theme = getTheme();

        const overlay = createOverlay();
        const dialog = createDialogContainer('Add Auction Entry', theme);

        dialog.innerHTML = `
            <form id="auctionEntryForm_${dialogId}">
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Item:</label>
                    <input type="text" id="item_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Seller:</label>
                    <input type="text" id="seller_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Time Left:</label>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <div style="flex: 1;">
                            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Days:</label>
                            <input type="number" id="timeDays_${dialogId}" min="0" value="0" style="
                                width: 100%;
                                padding: 5px;
                                background: ${theme.BG};
                                border: 1px solid ${theme.BORDER};
                                color: ${theme.TEXT};
                                border-radius: 3px;
                            ">
                        </div>
                        <div style="flex: 1;">
                            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Hours:</label>
                            <input type="number" id="timeHours_${dialogId}" min="0" max="23" value="0" style="
                                width: 100%;
                                padding: 5px;
                                background: ${theme.BG};
                                border: 1px solid ${theme.BORDER};
                                color: ${theme.TEXT};
                                border-radius: 3px;
                            ">
                        </div>
                        <div style="flex: 1;">
                            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Minutes:</label>
                            <input type="number" id="timeMinutes_${dialogId}" min="0" max="59" value="0" style="
                                width: 100%;
                                padding: 5px;
                                background: ${theme.BG};
                                border: 1px solid ${theme.BORDER};
                                color: ${theme.TEXT};
                                border-radius: 3px;
                            ">
                        </div>
                    </div>
                </div>
                ${createDialogButtons(theme)}
            </form>
        `;

        return new Promise((resolve) => {
            function cleanup() {
                document.body.removeChild(overlay);
                removeDialogState(dialogId);
            }

            dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            dialog.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                const item = document.getElementById(`item_${dialogId}`).value.trim();
                const seller = document.getElementById(`seller_${dialogId}`).value.trim();
                const days = parseInt(document.getElementById(`timeDays_${dialogId}`).value) || 0;
                const hours = parseInt(document.getElementById(`timeHours_${dialogId}`).value) || 0;
                const minutes = parseInt(document.getElementById(`timeMinutes_${dialogId}`).value) || 0;

                if (!item) {
                    alert('Please enter an item name');
                    return;
                }

                if (!seller) {
                    alert('Please enter a seller name');
                    return;
                }

                if (days === 0 && hours === 0 && minutes === 0) {
                    alert('Please enter a valid time value');
                    return;
                }

                const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
                cleanup();
                resolve({ item, seller, timeLeft: totalMinutes });
            });

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            saveDialogState(dialogId, {
                type: 'auctionEntry'
            });

            document.getElementById(`item_${dialogId}`).focus();

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    async function createManualCountdownDialog(existingDialogId = null) {
        const dialogId = existingDialogId || 'countdowndialog' + Date.now();
        const theme = getTheme();

        const overlay = createOverlay();
        const dialog = createDialogContainer('Add Custom Countdown', theme);

        dialog.innerHTML = `
                <form id="countdownForm_${dialogId}">
                    <div style="margin-bottom: 10px;">
                        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Countdown Name:</label>
                        <input type="text" id="name_${dialogId}" style="
                            width: 100%;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                        ">
                    </div>
    
                    <div style="margin-bottom: 10px;">
                        <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Select Time Input Method:</div>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <label style=" color:${theme.subTEXT}; display: flex; align-items: center; gap: 5px;">
                                <input type="radio" name="timeMethod_${dialogId}" value="duration" checked>
                                Duration
                            </label>
                            <label style="color:${theme.subTEXT}; display: flex; align-items: center; gap: 5px;">
                                <input type="radio" name="timeMethod_${dialogId}" value="datetime">
                                Date/Time
                            </label>
                        </div>
                    </div>
    
                    <div id="durationInputs_${dialogId}">
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Days:</label>
                                <input type="number" id="timeDays_${dialogId}" min="0" value="0" style="
                                    width: 100%;
                                    padding: 5px;
                                    background: ${theme.BG};
                                    border: 1px solid ${theme.BORDER};
                                    color: ${theme.TEXT};
                                    border-radius: 3px;
                                ">
                            </div>
                            <div style="flex: 1;">
                                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Hours:</label>
                                <input type="number" id="timeHours_${dialogId}" min="0" max="23" value="0" style="
                                    width: 100%;
                                    padding: 5px;
                                    background: ${theme.BG};
                                    border: 1px solid ${theme.BORDER};
                                    color: ${theme.TEXT};
                                    border-radius: 3px;
                                ">
                            </div>
                            <div style="flex: 1;">
                                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Minutes:</label>
                                <input type="number" id="timeMinutes_${dialogId}" min="0" max="59" value="0" style="
                                    width: 100%;
                                    padding: 5px;
                                    background: ${theme.BG};
                                    border: 1px solid ${theme.BORDER};
                                    color: ${theme.TEXT};
                                    border-radius: 3px;
                                ">
                            </div>
                        </div>
                    </div>
    
                    <div id="dateTimeInputs_${dialogId}" style="display: none;">
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 2;">
                                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">End Date:</label>
                                <input type="date" id="endDate_${dialogId}" style="
                                    width: 100%;
                                    padding: 5px;
                                    background: ${theme.BG};
                                    border: 1px solid ${theme.BORDER};
                                    color: ${theme.TEXT};
                                    border-radius: 3px;
                                ">
                            </div>
                            <div style="flex: 1;">
                                <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">End Time:</label>
                                <input type="time" id="endTime_${dialogId}" style="
                                    width: 100%;
                                    padding: 5px;
                                    background: ${theme.BG};
                                    border: 1px solid ${theme.BORDER};
                                    color: ${theme.TEXT};
                                    border-radius: 3px;
                                ">
                            </div>
                        </div>
                    </div>
    
                    ${createDialogButtons(theme)}
                </form>
            `;
        return new Promise((resolve) => {
            function cleanup() {
                document.body.removeChild(overlay);
                removeDialogState(dialogId);
            }

            // Set up radio button listeners
            const radioButtons = dialog.querySelectorAll(`input[name="timeMethod_${dialogId}"]`);
            const durationInputs = dialog.querySelector(`#durationInputs_${dialogId}`);
            const dateTimeInputs = dialog.querySelector(`#dateTimeInputs_${dialogId}`);

            radioButtons.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'duration') {
                        durationInputs.style.display = 'block';
                        dateTimeInputs.style.display = 'none';
                    } else {
                        durationInputs.style.display = 'none';
                        dateTimeInputs.style.display = 'block';
                    }
                });
            });

            // Set up form submit handler
            dialog.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById(`name_${dialogId}`).value.trim();
                const timeMethod = dialog.querySelector(`input[name="timeMethod_${dialogId}"]:checked`).value;

                let endTime;
                if (timeMethod === 'duration') {
                    const days = parseInt(document.getElementById(`timeDays_${dialogId}`).value) || 0;
                    const hours = parseInt(document.getElementById(`timeHours_${dialogId}`).value) || 0;
                    const minutes = parseInt(document.getElementById(`timeMinutes_${dialogId}`).value) || 0;

                    if (days === 0 && hours === 0 && minutes === 0) {
                        alert('Please enter a valid duration');
                        return;
                    }

                    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
                    endTime = Date.now() + (totalMinutes * 60 * 1000);
                } else {
                    const date = document.getElementById(`endDate_${dialogId}`).value;
                    const time = document.getElementById(`endTime_${dialogId}`).value;

                    if (!date || !time) {
                        alert('Please enter both date and time');
                        return;
                    }

                    endTime = new Date(`${date}T${time}`).getTime();
                }

                if (!name) {
                    alert('Please enter a countdown name');
                    return;
                }

                cleanup();
                resolve({ name, endTime });
            });

            // Set up cancel button
            const cancelButton = dialog.querySelector('.cancelBtn');
            if (cancelButton) {
                cancelButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cleanup();
                    resolve(null);
                });
            }

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Save dialog state and set focus
            saveDialogState(dialogId, {
                type: 'manualCountdown'
            });

            document.getElementById(`name_${dialogId}`).focus();

            // Setup escape key handler
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'enhanced-sidebar';
        const theme = getTheme();
        const persistentState = loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden: false });

        sidebar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${CONSTANTS.SIDEBAR_WIDTH}px;
        height: 100%;
        background-color: ${theme.BG};
        color: ${theme.TEXT};
        z-index: 991000;
        display: flex;
        flex-direction: column;
        border-right: 2px solid ${theme.BORDER};
        transition: transform 0.3s ease-in-out;
        transform: translateX(${persistentState.isHidden ? '-102%' : '0'});
        will-change: transform;
        overflow-x: hidden; /* Prevent horizontal scrolling */
        box-sizing: border-box; /* Include borders in width calculation */
    `;

        sidebar.style.msOverflowStyle = 'none';
        sidebar.style.scrollbarWidth = 'none';
        sidebar.addEventListener('scroll', () => {
            sidebar.style.overflowY = 'hidden';
        });

        const topBar = createTopBar();
        const groupContainer = createGroupContainer();
        const tagline = createTagline();
        const pageSelector = createPageSelector(theme);

        pageSelector.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 10px;
            z-index: 991101;
        `;

        sidebar.appendChild(topBar);
        sidebar.appendChild(groupContainer);
        sidebar.appendChild(tagline);
        sidebar.appendChild(pageSelector);

        document.body.appendChild(sidebar);
        setupDragListeners(groupContainer);
        refreshSidebar();

        const toggleButton = createToggleButton(sidebar);
        document.body.appendChild(toggleButton);

        return sidebar;
    }

    function createToggleButton(sidebar) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'sidebar-toggle';
        const img = document.createElement('img');
    img.src = chrome.runtime.getURL('assets/menu.svg');
    img.alt = 'Menu';
    img.style.cssText = 'width: 24px; height: 24px; vertical-align: middle; filter: invert(1);';
    toggleButton.appendChild(img);
    
    toggleButton.title = 'Toggle SideWinder';
    const theme = getTheme();

    toggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: ${theme.BUTTON_BG};
        color: ${theme.TEXT};
        border: none;
        padding: 12px;
        cursor: pointer;
        z-index: 999999;
        transition: transform 0.3s ease-in-out;
        border-radius: 4px;
        visibility: visible !important;
        opacity: 1 !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        min-height: 48px;
    `;

        const savedBtnPos = localStorage.getItem('sidebarBtnPos') || 'top-left';
        setTimeout(() => updateSidebarBtnPosition(savedBtnPos), 0);


        toggleButton.addEventListener('click', () => {
            const sidebarState = loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden: false });
            const newHiddenState = !sidebarState.isHidden;

            saveState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden: newHiddenState });

            requestAnimationFrame(() => {
                sidebar.style.transform = newHiddenState ? 'translateX(-102%)' : 'translateX(0)';
                toggleButton.style.transform = newHiddenState ? 'rotate(180deg)' : 'rotate(0deg)';
                toggleButton.style.backgroundColor = newHiddenState ?
                    theme.SECONDARY_BG : theme.BUTTON_BG;
            });
        });

        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden: false }).isHidden ?
                theme.HEADER : theme.SECONDARY_BG;
        });

        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, { isHidden: false }).isHidden ?
                theme.SECONDARY_BG : theme.BUTTON_BG;
        });

        return toggleButton;
    }

    function createGroupContainer() {
        const container = document.createElement('div');
        container.id = 'group-container';
        container.style.cssText = `
            flex-grow: 1;
            padding: 10px;
            margin-top: 50px;
            margin-bottom: 30px;
            position: relative;
            overflow-y: auto;
            overflow-x: hidden;
        `;
        return container;
    }

    function createTagline() {
        const container = document.createElement('div');
        const theme = getTheme();

        container.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: ${theme.TEXT};
            font-style: italic;
            font-size: 14px;
            text-align: center;
            pointer-events: none;
            white-space: nowrap;
        `;

        container.textContent = CONSTANTS.TAGLINES[Math.floor(Math.random() * CONSTANTS.TAGLINES.length)];
        return container;
    }

    function createTopBar() {
        const topBar = document.createElement('div');
        topBar.id = 'top-bar';
        const theme = getTheme();

        topBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #2c2c2c;
            border-bottom: 1px solid #444444;
            width: 100%;
            position: absolute;
            top: 0;
            height: 50px;
            box-sizing: border-box;
            z-index: 991101;
        `;

        const trademarkContainer = document.createElement('div');
        trademarkContainer.style.cssText = `
            position: absolute;
            left: 60px;
            color: white;
            font-style: italic;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
            margin-left: 10px;
        `;
        trademarkContainer.textContent = CONSTANTS.TRADEMARK;
        topBar.appendChild(trademarkContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
            margin-left: auto;
        `;
                       const buttons = [
                {
                    id: 'clockButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/clock.svg')}" alt="Clock" style="width:20px;height:20px;vertical-align:middle;pointer-events: none;${isLightMode ? 'filter: invert(29%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(29%) contrast(92%);' : ''}">`,
                    color: theme.BUTTON_BG,
                    action: toggleClock,
                    title: 'Toggle Clock'
                },
                {
                    id: 'calculatorButton', 
                    icon: `<img src="${chrome.runtime.getURL('assets/calculator.svg')}" alt="Calculator" style="width:20px;height:20px;vertical-align:middle;pointer-events: none;${isLightMode ? 'filter: invert(29%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(29%) contrast(92%);' : ''}">`,
                    color: theme.BUTTON_BG,
                    action: showCalculator,
                    title: 'Calculator'
                },
                {
                    id: 'deleteButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/delete_mode.svg')}" alt="Delete" style="width:20px;height:20px;vertical-align:middle;${isLightMode ? 'filter: invert(29%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(29%) contrast(92%);' : ''}">`,
                    color: theme.DANGER,
                    action: toggleDeleteMode,
                    title: 'Delete Mode'
                },
                {
                    id: 'editButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/edit_mode.svg')}" alt="Edit" style="width:20px;height:20px;vertical-align:middle;${isLightMode ? 'filter: invert(29%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(29%) contrast(92%);' : ''}">`,
                    color: theme.BUTTON_BG,
                    action: toggleEditMode,
                    title: 'Edit Mode'
                },
                {
                    id: 'addButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/add.svg')}" alt="Add" style="width:32px;height:32px;vertical-align:middle;${isLightMode ? 'filter: invert(29%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(29%) contrast(92%);' : ''}">`,
                    color: theme.SUCCESS,
                    action: showAddMenu,
                    title: 'Add Group'
                }
            ];

            buttons.forEach(({ id, icon, color, action, title }) => {
                const button = createModeButton(id, icon, color, action, title);
                buttonsContainer.appendChild(button);
            });

            topBar.appendChild(buttonsContainer);
            return topBar;
        }

    function createPageSelector(theme) {
        const container = document.createElement('div');
        container.id = 'page-selector';
        container.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 50px;
            z-index: 991101;
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        const tooltip = document.createElement('div');
        tooltip.textContent = 'Page Selector';
        tooltip.style.cssText = `
            position: absolute;
            background-color: ${theme.HEADER};
            color: ${theme.TEXT};
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 12px;
            bottom: 0;
            right: -10px;
            transform: translateX(100%);
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            pointer-events: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        container.appendChild(tooltip);

        const currentPageCircle = document.createElement('div');
        currentPageCircle.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: ${theme.BUTTON_BG};
            color: ${theme.TEXT};
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            position: relative;
        `;
        currentPageCircle.innerHTML = '📑';
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/pages.svg');
        img.alt = 'Pages';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        currentPageCircle.textContent = ''; // Clear the + symbol
        currentPageCircle.appendChild(img);
        container.appendChild(currentPageCircle);

        currentPageCircle.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });

        currentPageCircle.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });

        const pageMenu = document.createElement('div');
        pageMenu.id = 'page-menu';
        pageMenu.style.cssText = `
            position: absolute;
            left: 0;
            bottom: 40px;
            display: none;
            flex-direction: column-reverse;
            gap: 10px;
            z-index: 991200;
            transition: all 0.3s ease;
            padding-bottom: 5px;
        `;

        function setupPageCircleEvents(pageCircle, pageIndex) {
            pageCircle.addEventListener('mouseover', () => {
                if (pageIndex !== currentPage) {
                    pageCircle.style.backgroundColor = theme.SECONDARY_BG;
                    pageCircle.style.transform = 'scale(1.1)';
                }
            });

            pageCircle.addEventListener('mouseout', () => {
                if (pageIndex !== currentPage) {
                    pageCircle.style.backgroundColor = theme.BG;
                    pageCircle.style.transform = 'scale(1)';
                }
            });

            pageCircle.addEventListener('click', () => {
                if (pageIndex !== currentPage) {
                    changePage(pageIndex);
                    currentPageCircle.innerHTML = '📑';
                    showPageNumber(pageIndex + 1);
                    pageMenu.style.display = 'none';
                    isPageMenuOpen = false;
                }
            });
        }

        function showPageNumber(number) {
            const originalContent = currentPageCircle.innerHTML;
            currentPageCircle.innerHTML = number;

            setTimeout(() => {
                currentPageCircle.innerHTML = originalContent;
            }, 1000);
        }

        for (let i = 0; i < 3; i++) {
            const pageCircle = document.createElement('div');

            pageCircle.textContent = (i + 1);
            pageCircle.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: ${i === currentPage ? theme.BUTTON_BG : theme.BG};
                color: ${theme.TEXT};
                border: 1px solid ${theme.BORDER};
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                transition: background-color 0.2s ease, transform 0.2s ease;
                transform: scale(${i === currentPage ? 1.1 : 1});
            `;

            setupPageCircleEvents(pageCircle, i);

            pageMenu.appendChild(pageCircle);
        }

        container.appendChild(pageMenu);

        let isPageMenuOpen = false;

        currentPageCircle.addEventListener('click', () => {
            isPageMenuOpen = !isPageMenuOpen;
            if (isPageMenuOpen) {
                pageMenu.style.display = 'flex';
                currentPageCircle.style.transform = 'scale(1.1)';
            } else {
                pageMenu.style.display = 'none';
                currentPageCircle.style.transform = 'scale(1)';
            }
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && isPageMenuOpen) {
                pageMenu.style.display = 'none';
                isPageMenuOpen = false;
                currentPageCircle.style.transform = 'scale(1)';
            }
        });

        return container;
    }
    function createModeButton(id, icon, color, action, title) {
        const button = document.createElement('button');
        button.id = id;
        button.innerHTML = icon;
        button.title = title || '';
        const theme = getTheme();

        // For delete button, only use red when delete mode is active
        let buttonColor = color;
        if (id === 'deleteButton') {
            buttonColor = isDeleteMode ? theme.DANGER : theme.BUTTON_BG;
        }
        // For edit button, only use green when edit mode is active
        else if (id === 'editButton') {
            buttonColor = isEditMode ? theme.SUCCESS : theme.BUTTON_BG;
        }
        // For clock button, highlight when active
        else if (id === 'clockButton') {
            buttonColor = clockVisible ? getLighterColor(theme.BUTTON_BG) : theme.BUTTON_BG;
        }

        button.style.cssText = `
        background-color: ${buttonColor};
        color: white;
        border: none;
        padding: 8px;
        font-size: 16px;
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 4px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none;
        position: relative;
    `;

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = title || '';
        tooltip.style.cssText = `
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${theme.HEADER};
        color: ${theme.TEXT};
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        pointer-events: none;
        z-index: 991200;
    `;
        button.appendChild(tooltip);

        button.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });

        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });

        button.addEventListener('click', () => {
            preserveSidebarAnimation();
            action();

            // Update button appearance after action
            if (id === 'deleteButton') {
                button.style.backgroundColor = isDeleteMode ? theme.DANGER : theme.BUTTON_BG;
            } else if (id === 'editButton') {
                button.style.backgroundColor = isEditMode ? theme.SUCCESS : theme.BUTTON_BG;
            } else if (id === 'clockButton') {
                button.style.backgroundColor = clockVisible ? getLighterColor(theme.BUTTON_BG) : theme.BUTTON_BG;
            }

            // Handle highlighting of active buttons
            const buttons = document.querySelectorAll('#top-bar button');
            buttons.forEach(btn => {
                if ((btn.id === 'editButton' && isEditMode) ||
                    (btn.id === 'deleteButton' && isDeleteMode) ||
                    (btn.id === 'clockButton' && clockVisible)) {
                    btn.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.5)';
                } else {
                    btn.style.boxShadow = 'none';
                }
            });
        });

        button.addEventListener('mouseover', () => {
            // For delete button, handle hover based on mode
            if (id === 'deleteButton') {
                button.style.backgroundColor = isDeleteMode ?
                    getLighterColor(theme.DANGER) : getLighterColor(theme.BUTTON_BG);
            } else if (id === 'editButton') {
                button.style.backgroundColor = isEditMode ?
                    getLighterColor(theme.SUCCESS) : getLighterColor(theme.BUTTON_BG);
            } else {
                button.style.backgroundColor = getLighterColor(buttonColor);
            }
        });

        button.addEventListener('mouseout', () => {
            // Restore original colors on mouseout
            if (id === 'deleteButton') {
                button.style.backgroundColor = isDeleteMode ? theme.DANGER : theme.BUTTON_BG;
            } else if (id === 'editButton') {
                button.style.backgroundColor = isEditMode ? theme.SUCCESS : theme.BUTTON_BG;
            } else {
                button.style.backgroundColor = buttonColor;
            }
        });

        return button;
    }

    function toggleLightMode() {
        isLightMode = !isLightMode;
        const sidebar = document.getElementById('enhanced-sidebar');
        const theme = getTheme();

        if (sidebar) {
            sidebar.style.backgroundColor = theme.BG;
            sidebar.style.color = theme.TEXT;

            const textElements = sidebar.querySelectorAll('div, span, p');
            textElements.forEach(element => {
                if (!element.classList.contains('no-light-mode')) {
                    element.style.color = theme.TEXT;
                }
            });

            const trademarkContainer = sidebar.querySelector('#top-bar div');
            if (trademarkContainer) {
                trademarkContainer.style.color = 'white';
            }
        }

        saveState(CONSTANTS.STATE_KEYS.LIGHT_MODE, isLightMode);
        refreshSidebar();
    }

    function toggleDeleteMode() {
        isDeleteMode = !isDeleteMode;
        isEditMode = false;

        const sidebar = document.getElementById('enhanced-sidebar');
        const theme = getTheme();
        const deleteButton = document.getElementById('deleteButton');

        if (sidebar) {
            sidebar.style.backgroundColor = isDeleteMode ?
                theme.DANGER : (isLightMode ? theme.BG : theme.BG);
        }

        // Update all delete buttons in ALL elements
        document.querySelectorAll('.draggable').forEach(element => {
            const deleteBtn = element.querySelector('button[class*="delete"]');
            if (deleteBtn) {
                deleteBtn.style.display = isDeleteMode ? 'flex' : 'none';
            }
        });

        // Update the main delete button in top bar
        if (deleteButton) {
            deleteButton.style.backgroundColor = isDeleteMode ? theme.DANGER : theme.BUTTON_BG;
        }

        // Also reset edit mode and hide resizers
        const editButton = document.getElementById('editButton');
        if (editButton) {
            editButton.style.backgroundColor = theme.BUTTON_BG;
        }
        document.querySelectorAll('[data-resizer]').forEach(resizer => {
            resizer.style.display = 'none';
        });

        refreshSidebar();

        if (isDeleteMode) {
            showToast('Delete Mode Activated', 'info');
        } else {
            showToast('Delete Mode Deactivated', 'info');
        }
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        isDeleteMode = false;

        const sidebar = document.getElementById('enhanced-sidebar');
        const theme = getTheme();
        const editButton = document.getElementById('editButton');

        if (sidebar) {
            sidebar.style.backgroundColor = isEditMode ?
                theme.SUCCESS : (isLightMode ? theme.BG : theme.BG);
        }

        // Update all resizers
        document.querySelectorAll('[data-resizer]').forEach(resizer => {
            resizer.style.display = isEditMode ? 'flex' : 'none';
        });

        // Update all draggable elements
        document.querySelectorAll('.draggable').forEach(element => {
            element.style.cursor = isEditMode ? 'move' : 'default';

            // Hide delete buttons when in edit mode
            const deleteBtn = element.querySelector('button[class*="delete"]');
            if (deleteBtn) {
                deleteBtn.style.display = 'none';
            }
        });

        // Update edit button
        if (editButton) {
            editButton.style.backgroundColor = isEditMode ? theme.SUCCESS : theme.BUTTON_BG;
        }

        // Also reset delete button
        const deleteButton = document.getElementById('deleteButton');
        if (deleteButton) {
            deleteButton.style.backgroundColor = theme.BUTTON_BG;
        }

        refreshSidebar();

        if (isEditMode) {
            showToast('Edit Mode Activated', 'info');
        } else {
            showToast('Edit Mode Deactivated', 'info');
        }
    }

    function toggleClock() {
        clockVisible = !clockVisible;

        const existingClock = document.getElementById('torn-city-clock');
        if (existingClock) {
            existingClock.remove();
        }

        if (clockVisible) {
            showClock();
            showToast('Clock Activated', 'info');
        } else {
            showToast('Clock Deactivated', 'info');
        }

        const clockButton = document.getElementById('clockButton');
        if (clockButton) {
            clockButton.style.boxShadow = clockVisible ?
                '0 0 15px rgba(255, 255, 255, 0.5)' : 'none';
        }
    }

    function showClock() {
        const theme = getTheme();
        const sidebar = document.getElementById('enhanced-sidebar');

        if (!sidebar || !clockVisible) return;

        const clockContainer = document.createElement('div');
        clockContainer.id = 'torn-city-clock';
        clockContainer.style.cssText = `
        position: absolute;
        top: 60px;
        right: 10px;
        background-color: ${theme.SECONDARY_BG};
        border: 1px solid ${theme.BORDER};
        border-radius: 5px;
        padding: 10px;
        width: 220px;
        z-index: 991200;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        color: ${theme.TEXT};
        text-align: center;
    `;

        const timeDisplay = document.createElement('div');
        timeDisplay.style.cssText = `
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
    `;

        const dateDisplay = document.createElement('div');
        dateDisplay.style.cssText = `
        font-size: 14px;
        margin-bottom: 8px;
    `;
        const resetCountdown = document.createElement('div');
        resetCountdown.style.cssText = `
        font-size: 14px;
        padding-top: 5px;
        border-top: 1px solid ${theme.BORDER};
        font-weight: bold;
    `;

        clockContainer.appendChild(timeDisplay);
        clockContainer.appendChild(dateDisplay);
        clockContainer.appendChild(resetCountdown);
        sidebar.appendChild(clockContainer);

        function updateClock() {
            if (!clockVisible) return;

            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const utcSeconds = now.getUTCSeconds();

            const timeString =
                `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`;

            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
            };
            const dateString = now.toLocaleDateString('en-US', options);

            timeDisplay.textContent = timeString;
            dateDisplay.textContent = dateString;

            // Update day reset countdown
            updateDayResetCountdown(resetCountdown);
        }

        updateClock();

        clockContainer.dataset.intervalId = setInterval(updateClock, 1000);
        document.addEventListener('click', function closeClockOutside(e) {
            if (clockVisible && clockContainer && !clockContainer.contains(e.target) && e.target.id !== 'clockButton') {
                toggleClock();
                document.removeEventListener('click', closeClockOutside);
            }
        });
    }

    function updateDayResetCountdown(element) {
        if (!element) return;

        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(0, 0, 0, 0);
        resetTime.setUTCDate(resetTime.getUTCDate() + 1);

        const remainingTime = resetTime - now;
        const hours = Math.floor(remainingTime / 3600000);
        const minutes = Math.floor((remainingTime % 3600000) / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        element.textContent = `${hours} Hours, ${minutes} Minutes, ${seconds} Seconds Until Day Reset`;
    }

    function showAddMenu() {
        const existingMenu = document.getElementById('addMenu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const theme = getTheme();
        const menu = document.createElement('div');
        menu.id = 'addMenu';
        menu.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            background-color: ${theme.SECONDARY_BG};
            border: 1px solid ${theme.BORDER};
            border-radius: 4px;
            padding: 5px;
            z-index: 991200;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;

        const options = [
            { text: 'Add Group', action: addGroup },
            { text: 'Add Notepad', action: addNotepad },
            { text: 'Add Attack List', action: addAttackList },
            { text: 'Add Todo List', action: addTodoList },
            { text: 'Add Loan Tracker', action: addLoanTracker },
            { text: 'Add Auction Tracker', action: addAuctionTracker },
            { text: 'Add Timer Group', action: addCountdownGroup }
        ];

        options.forEach(option => {
            const button = createAddMenuButton(option, theme);
            menu.appendChild(button);
        });

        document.querySelector('#top-bar').appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target.id !== 'addButton') {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    function createAddMenuButton(option, theme) {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px;
            margin: 2px 0;
            background-color: ${theme.BG};
            color: ${theme.TEXT};
            border: 1px solid ${theme.BORDER};
            cursor: pointer;
            text-align: left;
            border-radius: 3px;
            transition: background-color 0.2s ease;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = theme.SECONDARY_BG;
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = theme.BG;
        });

        button.addEventListener('click', () => {
            option.action();
            document.getElementById('addMenu').remove();
        });

        return button;
    }

    function getCurrentPageUserId() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('profiles.php') || currentUrl.includes('profile.php')) {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('XID') || urlParams.get('ID');

            if (userId && !isNaN(parseInt(userId))) {
                return parseInt(userId);
            }
        }

        // Try to find user ID in DOM
        const userIdElement = document.querySelector('[class*="userID"], [class*="userId"], [id*="userID"], [id*="userId"]');
        if (userIdElement && userIdElement.textContent) {
            const extractedId = parseInt(userIdElement.textContent.trim());
            if (!isNaN(extractedId)) {
                return extractedId;
            }
        }

        return null;
    }

    async function addGroup() {
        const result = await createPromptDialog('Add Group', [
            { id: 'groupName', label: 'Group Name', type: 'text' }
        ]);
    
        if (result && result.groupName) {
            const newGroup = {
                name: result.groupName,
                links: [],
                position: { x: 0, y: 0 },
                size: { 
                    width: CONSTANTS.MIN_GROUP_WIDTH, 
                    height: CONSTANTS.MIN_GROUP_HEIGHT 
                }
            };
            groups.unshift(newGroup);
            saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
            refreshSidebar();
            showToast(`Group "${result.groupName}" added`, 'success');
       }
    }

    async function addNotepad() {
        const result = await createPromptDialog('Add Notepad', [
            { id: 'notepadName', label: 'Notepad Name', type: 'text' }
        ]);

        if (result && result.notepadName) {
            notepads.push({
                name: result.notepadName,
                content: '',
                position: { x: 0, y: 0 },
                size: { width: 200, height: 150 }
            });
            saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
            refreshSidebar();
            showToast(`Notepad "${result.notepadName}" added`, 'success');
        }
    }

    async function addAttackList() {
        const result = await createPromptDialog('Add Attack List', [
            { id: 'listName', label: 'List Name', type: 'text' }
        ]);

        if (result && result.listName) {
            attackLists.push({
                name: result.listName,
                targets: [],
                attackUrl: 'https://www.torn.com/loader.php?sid=attack&user2ID=',
                position: { x: 0, y: 0 },
                size: { width: CONSTANTS.MIN_GROUP_WIDTH, height: CONSTANTS.MIN_GROUP_HEIGHT }
            });
            saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
            refreshSidebar();
            showToast(`Attack list "${result.listName}" added`, 'success');
        }
    }

    async function addTodoList() {
        const result = await createPromptDialog('Add Todo List', [
            { id: 'listName', label: 'List Name', type: 'text' },
            { id: 'resetDaily', label: 'Reset Daily?', type: 'checkbox' }
        ]);

        if (result && result.listName) {
            const newTodoList = {
                name: result.listName,
                items: [],
                resetDaily: result.resetDaily,
                position: { x: 0, y: 0 },
                size: { width: CONSTANTS.MIN_GROUP_WIDTH, height: CONSTANTS.MIN_GROUP_HEIGHT }
            };

            todoLists.push(newTodoList);
            saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);

            if (newTodoList.resetDaily) {
                setupDailyReset(todoLists.length - 1);
            }

            refreshSidebar();
            showToast(`Todo list "${result.listName}" added`, 'success');
        }
    }

    async function addAuctionTracker() {
        if (!auctionTracker.position) {
            auctionTracker.position = { x: 0, y: 0 };
            auctionTracker.size = { width: 200, height: 'auto' };
            auctionTracker.active = true;
            saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
        }
        refreshSidebar();
        showToast('Auction tracker added', 'success');
    }
    async function addAuctionEntry() {
        const result = await createAuctionEntryDialog();
        if (result) {
            const now = Date.now();
            const endTime = now + (result.timeLeft * 60 * 1000);

            auctionTracker.auctions.push({
                item: result.item,
                seller: result.seller,
                endTime: endTime,
                created: now
            });

            saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
            refreshSidebar();

            if (result.timeLeft > 5) {
                setTimeout(() => {
                    if (Notification.permission === "granted") {
                        new Notification(`Auction Ending Soon: ${result.item}`, {
                            body: `Seller: ${result.seller} - Ending in 5 minutes!`
                        });
                    }
                }, (result.timeLeft - 5) * 60 * 1000);
            }

            showToast(`Auction for "${result.item}" added`, 'success');
        }
    }

    function initializeAuctionUpdates() {
          // Check every second to ensure timely updates
        window.auctionCheckIntervalId = setInterval(() => {
            const now = Date.now();
            const initialCount = auctionTracker.auctions.length;
            auctionTracker.auctions = auctionTracker.auctions.filter(auction => {
                return auction.endTime > now;
            });

            if (auctionTracker.auctions.length !== initialCount) {
                saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
            }

            refreshSidebar();

        }, 1000);
    }

    async function addLoanTracker() {
        if (!loanTracker.position) {
            loanTracker.position = { x: 0, y: 0 };
            loanTracker.size = { width: CONSTANTS.MIN_GROUP_WIDTH, height: CONSTANTS.MIN_GROUP_HEIGHT }
            saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
        }
        refreshSidebar();
        showToast('Loan tracker added', 'success');
    }

    async function addLoanEntry() {
        const result = await createLoanEntryDialog();
        if (result) {
            if (!loanTracker.entries) {
                loanTracker.entries = [];
            }

            loanTracker.entries.push(result);
            saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
            refreshSidebar();
            showToast(`Loan for ${result.user} added`, 'success');
        }
    }

    async function addCountdownGroup() {
        if (countdownGroups.length > 0) {
            showToast('Timer group already exists', 'info');
            return;
        }

        const result = await createPromptDialog('Add Timer Group', [
            { id: 'groupName', label: 'Group Name', type: 'text' }
        ]);

        if (result && result.groupName) {
            const newGroup = {
                name: result.groupName || 'Timers',
                position: { x: 0, y: 0 },
                size: { width: CONSTANTS.MIN_GROUP_WIDTH, height: CONSTANTS.MIN_GROUP_HEIGHT },
                timers: []
            };

            countdownGroups.unshift(newGroup);
            saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
            refreshSidebar();
            showToast('Timer group added', 'success');
        }
    }

    async function addManualCountdownGroup() {
        const result = await createManualCountdownDialog();
        if (result) {
            if (countdownGroups.length === 0) {
                const newGroup = {
                    name: 'Timers',
                    position: { x: 0, y: 0 },
                    size: { width: CONSTANTS.MIN_GROUP_WIDTH, height: CONSTANTS.MIN_GROUP_HEIGHT },
                    timers: []
                };
                countdownGroups.unshift(newGroup);
            }

            if (!countdownGroups[0].timers) {
                countdownGroups[0].timers = [];
            }

            countdownGroups[0].timers.push({
                name: result.name,
                endTime: result.endTime,
                completed: false
            });

            saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
            refreshSidebar();
            showToast(`Custom countdown "${result.name}" added`, 'success');
        }
    }

    function setupDailyReset(listIndex) {
        setInterval(() => {
            const now = new Date();
            const utcHour = now.getUTCHours();
            const utcMinute = now.getUTCMinutes();

            if (utcHour === 0 && utcMinute === 0) {
                const list = todoLists[listIndex];
                if (list && list.items) {
                    list.items = list.items.map(item => ({
                        ...item,
                        checked: false
                    }));
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                    showToast(`Reset todo list: ${list.name}`, 'info');
                }
            }
        }, 1000);  // Check every second
    }

    async function addTarget(list) {
        const result = await createPromptDialog('Add Target', [
            { id: 'targetName', label: 'Target Name', type: 'text' },
            { id: 'targetId', label: 'Player ID', type: 'text' }
        ]);

        if (result && result.targetName && result.targetId) {
            try {
                const targetId = parseInt(result.targetId);
                if (isNaN(targetId)) {
                    throw new Error('Invalid Player ID');
                }

                list.targets.push({
                    name: result.targetName,
                    id: targetId
                });
                saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
                refreshSidebar();
                showToast(`Target "${result.targetName}" added`, 'success');
            } catch (error) {
                alert('Please enter a valid Player ID');
            }
        }
    }
    function addCurrentPageUserToList(list) {
        const userId = getCurrentPageUserId();

        if (!userId) {
            showToast('Could not find user ID on current page', 'error');
            return;
        }

        const existingTarget = list.targets.find(target => target.id === userId);
        if (existingTarget) {
            showToast(`User already in attack list`, 'info');
            return;
        }

        // Try to get user name with enhanced methods
        let userName = "Target";

        try {
            // Multiple selectors for different page layouts
            const selectors = [
                'div.user.name',
                '[data-placeholder]',
                '.profile-container .name',
                '.user-info .name',
                '.title-black',
                '#skip-to-content h4'
            ];

            // Try each selector
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    // First try data-placeholder attribute if it exists
                    if (element.getAttribute('data-placeholder')) {
                        userName = element.getAttribute('data-placeholder').trim();
                        break;
                    }
                    // Then try text content
                    if (element.textContent.trim()) {
                        userName = element.textContent.trim();
                        break;
                    }
                }
            }

            // If name not found in DOM elements, try page title
            if (userName === "Target" && document.title && document.title.includes('-')) {
                const titleParts = document.title.split('-');
                if (titleParts.length > 1) {
                    const potentialName = titleParts[0].trim();
                    if (potentialName && potentialName !== "Torn") {
                        userName = potentialName;
                    }
                }
            }
            console.log('Found username:', userName);
            console.log('Element with username:', document.querySelector('div.user.name'));
            console.log('Data-placeholder value:', document.querySelector('div.user.name')?.getAttribute('data-placeholder'));

        } catch (e) {
            console.error('Error getting username:', e);
        }

        list.targets.push({
            name: userName,
            id: userId
        });

        saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
        refreshSidebar();
        showToast(`Added ${userName} to attack list`, 'success');
    }

    async function addTodoItem(listIndex) {
        const dialogId = 'todoItem' + Date.now();
        const theme = getTheme();

        const overlay = createOverlay();
        const dialog = createDialogContainer('Add Todo Item', theme);

        dialog.innerHTML += `
            <form id="todoItemForm_${dialogId}">
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Task Name:</label>
                    <input type="text" id="itemName_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link (Optional):</label>
                    <input type="text" id="itemUrl_${dialogId}" style="
                        width: 100%;
                        padding: 5px;
                        background: ${theme.BG};
                        border: 1px solid ${theme.BORDER};
                        color: ${theme.TEXT};
                        border-radius: 3px;
                    ">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Emoji:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" id="itemEmoji_${dialogId}" style="
                            flex: 1;
                            padding: 5px;
                            background: ${theme.BG};
                            border: 1px solid ${theme.BORDER};
                            color: ${theme.TEXT};
                            border-radius: 3px;
                        " placeholder="✅">
                        ${createEmojiButtons(theme)}
                    </div>
                </div>
                ${createDialogButtons(theme)}
            </form>
        `;

        setupEmojiLookup(dialog);

        function cleanup() {
            document.body.removeChild(overlay);
        }

        return new Promise((resolve) => {
            const form = dialog.querySelector(`#todoItemForm_${dialogId}`);
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const itemName = document.getElementById(`itemName_${dialogId}`).value.trim();
                const itemUrl = document.getElementById(`itemUrl_${dialogId}`).value.trim();
                const itemEmoji = document.getElementById(`itemEmoji_${dialogId}`).value.trim() || '✅';
                if (!itemName) {
                    alert('Please enter a task name');
                    return;
                }

                cleanup();
                resolve({
                    name: itemName,
                    url: itemUrl,
                    emoji: itemEmoji
                });
            });

            dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            document.getElementById(`itemName_${dialogId}`).focus();

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }).then(result => {
            if (result) {
                const list = todoLists[listIndex];
                list.items.push({
                    name: result.name,
                    url: result.url || '',
                    emoji: result.emoji,
                    checked: false
                });
                saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                refreshSidebar();
                showToast(`Todo item "${result.name}" added`, 'success');
            }
        });
    }
    function getSecondaryColor(primaryColor) {
        if (!primaryColor) return getTheme().SECONDARY_BG;

        // Convert hex to RGB
        const hex = primaryColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness > 128) {
            // If primary color is light, make secondary darker
            return adjustColor(primaryColor, -30);
        } else {
            // If primary color is dark, make secondary lighter
            return adjustColor(primaryColor, 30);
        }
    }

    function adjustColor(color, amount) {
        color = color.replace('#', '');

        // Convert to decimal and add amount
        let r = Math.max(Math.min(parseInt(color.substring(0, 2), 16) + amount, 255), 0);
        let g = Math.max(Math.min(parseInt(color.substring(2, 4), 16) + amount, 255), 0);
        let b = Math.max(Math.min(parseInt(color.substring(4, 6), 16) + amount, 255), 0);

        // Convert back to hex
        const rr = ((r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16));
        const gg = ((g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16));
        const bb = ((b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16));

        return "#" + rr + gg + bb;
    }
    function createGroupElement(group, index) {
        const theme = getTheme();
        const groupDiv = document.createElement('div');
        groupDiv.className = 'draggable';
        groupDiv.dataset.type = 'group';
        groupDiv.dataset.index = index;

        const primaryColor = group.color || theme.SECONDARY_BG;
        const secondaryColor = getSecondaryColor(primaryColor);

        groupDiv.style.cssText = `
            background-color: ${primaryColor};
            padding: 10px;
            border: 1px solid ${theme.BORDER};
            border-radius: 5px;
            position: absolute;
            width: ${group.size?.width || CONSTANTS.MIN_GROUP_WIDTH}px;
            height: ${group.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
            left: ${group.position?.x || 0}px;
            top: ${group.position?.y || 0}px;
            ${isEditMode ? 'cursor: move;' : ''}
        `;


        const header = createGroupHeader(group, index, theme, secondaryColor);
        const linksContainer = createLinksContainer(group, index, theme, secondaryColor);

        groupDiv.appendChild(header);
        groupDiv.appendChild(linksContainer);

        if (isEditMode) {
            const resizer = createResizer(groupDiv, (width, height) => {
                group.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
            });
            groupDiv.appendChild(resizer);
        }

        return groupDiv;
    }
    function createGroupHeader(group, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
            color: ${theme.TEXT};
            font-size: 16px;
            padding: 5px;
            background-color: ${secondaryColor}; /* Apply the darker color */
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        header.textContent = group.name;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        const addLinkButton = createAddButton(() => createLinkDialog(index), theme);
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addLinkButton.textContent = ''; // Clear the + symbol
        addLinkButton.appendChild(img);
        buttonContainer.appendChild(addLinkButton);

        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(group, index);
                if (result) {
                    group.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this group?', () => {
                    groups.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
                    refreshSidebar();
                    showToast(`Group "${group.name}" deleted`, 'info');
                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }


    function createLinksContainer(group, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;

        group.links?.forEach((link, linkIndex) => {
            const linkDiv = createLinkElement(link, group, index, linkIndex, theme, secondaryColor);
            container.appendChild(linkDiv);
        });

        return container;
    }

    function createLinkElement(link, group, groupIndex, linkIndex, theme, secondaryColor) {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'no-drag';
        linkDiv.style.cssText = `
        background-color: ${secondaryColor};
        color: ${isLightMode ? '#0066cc' : '#8cb3d9'};
        border: 1px solid ${theme.BORDER};
        padding: 4px 10px;  /* Increased horizontal padding */
        cursor: pointer;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 120px;  /* Added minimum width */
    `;

        const linkText = document.createElement('span');
        linkText.textContent = `${link.emoji || '🔗'} ${link.name}`;
        linkDiv.appendChild(linkText);

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        if (isEditMode) {
            const moveButtons = createLinkMoveButtons(groupIndex, linkIndex, group.links.length, theme);
            buttonWrapper.appendChild(moveButtons);
        }

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this link?', () => {
                    group.links.splice(linkIndex, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
                    refreshSidebar();
                    showToast(`Link "${link.name}" deleted`, 'info');
                });
            }, theme);
            buttonWrapper.appendChild(deleteButton);
        }

        linkDiv.appendChild(buttonWrapper);
        linkDiv.addEventListener('click', () => {
            window.location.href = link.url;
        });

        return linkDiv;
    }

    function createLinkMoveButtons(groupIndex, linkIndex, totalLinks, theme) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            gap: 3px;
            margin-left: 5px;
        `;

        if (linkIndex > 0) {
            container.appendChild(createMoveButton('↑', () => {
                moveLink(groupIndex, linkIndex, linkIndex - 1);
            }, theme));
        }

        if (linkIndex < totalLinks - 1) {
            container.appendChild(createMoveButton('↓', () => {
                moveLink(groupIndex, linkIndex, linkIndex + 1);
            }, theme));
        }

        return container;
    }

    function createMoveButton(text, action, theme) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = 'no-drag';
        button.style.cssText = `
            background: none;
            border: none;
            color: ${theme.TEXT};
            cursor: pointer;
            padding: 0 2px;
            font-size: 12px;
            font-weight: bold;
            transition: transform 0.2s;
        `;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            action();
        });

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.2)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });

        return button;
    }

    function moveLink(groupIndex, fromIndex, toIndex) {
        const links = groups[groupIndex].links;
        const [movedLink] = links.splice(fromIndex, 1);
        links.splice(toIndex, 0, movedLink);
        saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${currentPage}`, groups);
        refreshSidebar();
    }

    function createNotepadElement(notepad, index) {
        const theme = getTheme();
        const notepadDiv = document.createElement('div');
        notepadDiv.className = 'draggable';
        notepadDiv.dataset.type = 'notepad';
        notepadDiv.dataset.index = index;

        const primaryColor = notepad.color || '#1a2a29';
        const secondaryColor = getSecondaryColor(primaryColor);

        notepadDiv.style.cssText = `
        background-color: ${primaryColor};
        border: 1px solid ${secondaryColor};
        padding: 10px;
        border-radius: 5px;
        position: absolute;
        width: ${notepad.size?.width || 200}px;
        height: ${notepad.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
        left: ${notepad.position?.x || 0}px;
        top: ${notepad.position?.y || 0}px;
        ${isEditMode ? 'cursor: move;' : ''}
    `;

        const header = document.createElement('div');
        header.style.cssText = `
        color: ${theme.TEXT};
        font-size: 16px;
        padding: 5px;
        background-color: ${secondaryColor}; /* Apply the darker color */
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    `;
        header.textContent = notepad.name;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(notepad, index);
                if (result) {
                    notepad.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }

        const deleteButton = createDeleteButton(() => {
            confirmDelete('Delete this notepad?', () => {
                notepads.splice(index, 1);
                saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
                refreshSidebar();
                showToast(`Attack list "${notepad.name}" deleted`, 'info');
            });
        }, theme);
        deleteButton.style.display = isDeleteMode ? 'flex' : 'none';
        buttonContainer.appendChild(deleteButton);

        header.appendChild(buttonContainer);
        notepadDiv.appendChild(header);

        const textarea = document.createElement('textarea');
        textarea.className = 'no-drag content-container';
        textarea.value = notepad.content || '';
        textarea.style.cssText = `
        width: 100%;
        height: calc(100% - 40px);
        background-color: ${primaryColor};
        color: ${theme.TEXT};
        border: 1px solid ${secondaryColor};
        resize: none;
        padding: 5px;
        display: block;
        font-family: monospace;
    `;

        textarea.addEventListener('input', (e) => {
            notepad.content = e.target.value;
            saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
        });

        notepadDiv.appendChild(textarea);

        if (isEditMode) {
            const resizer = createResizer(notepadDiv, (width, height) => {
                notepad.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${currentPage}`, notepads);
            });
            notepadDiv.appendChild(resizer);
        }

        return notepadDiv;
    }
    function createAttackListElement(list, index) {
        const theme = getTheme();
        const attackListDiv = document.createElement('div');
        attackListDiv.className = 'draggable';
        attackListDiv.dataset.type = 'attackList';
        attackListDiv.dataset.index = index;

        const primaryColor = list.color || (isLightMode ? '#f7e6e6' : '#331f1f');
        const secondaryColor = getSecondaryColor(primaryColor);

        attackListDiv.style.cssText = `
        background-color: ${primaryColor};
        padding: 10px;
        border: 1px solid ${secondaryColor};
        border-radius: 5px;
        position: absolute;
        width: ${list.size?.width || 200}px;
        height: ${list.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
        left: ${list.position?.x || 0}px;
        top: ${list.position?.y || 0}px;
        ${isEditMode ? 'cursor: move;' : ''}
    `;

        const header = createAttackListHeader(list, index, theme, secondaryColor);
        attackListDiv.appendChild(header);
        const targetsContainer = createTargetsContainer(list, index, theme, secondaryColor);
        attackListDiv.appendChild(targetsContainer);

        if (isEditMode) {
            const resizer = createResizer(attackListDiv, (width, height) => {
                list.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
            });
            attackListDiv.appendChild(resizer);
        }

        return attackListDiv;
    }

    function createAttackListHeader(list, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
        color: ${theme.TEXT};
        font-size: 16px;
        padding: 5px;
        background-color: ${secondaryColor}; /* Apply the darker color */
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
        header.textContent = list.name;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';


        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(list, index);
                if (result) {
                    list.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            colorButton.title = 'Change list color';
            buttonContainer.appendChild(colorButton);
        }


        const addTargetButton = createAddButton(() => addTarget(list, index), theme);
        buttonContainer.appendChild(addTargetButton);

        const addCurrentUserButton = document.createElement('button');
        addCurrentUserButton.textContent = '👤';

        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/pin.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addCurrentUserButton.textContent = ''; // Clear the + symbol
        addCurrentUserButton.appendChild(img);

        addCurrentUserButton.title = 'Add Current Page Target (MUST BE ON USERS PROFILE, Currently does not pull name)';
        addCurrentUserButton.className = 'no-drag';
        addCurrentUserButton.style.cssText = `
        background-color: ${theme.BUTTON_BG};
        color: white;
        border: none;
        padding: 2px 6px;
        cursor: pointer;
        border-radius: 3px;
        font-size: 14px;
    `;

        addCurrentUserButton.addEventListener('click', () => {
            addCurrentPageUserToList(list, index);
        });

        addCurrentUserButton.addEventListener('mouseover', () => {
            addCurrentUserButton.style.backgroundColor = getLighterColor(theme.BUTTON_BG);
        });

        addCurrentUserButton.addEventListener('mouseout', () => {
            addCurrentUserButton.style.backgroundColor = theme.BUTTON_BG;
        });

        buttonContainer.appendChild(addCurrentUserButton);

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this attack list?', () => {
                    attackLists.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
                    refreshSidebar();
                    showToast(`Attack list "${list.name}" deleted`, 'info');
                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }


    function createTargetsContainer(list, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-top: 10px;
        `;

        list.targets?.forEach((target, targetIndex) => {
            const targetDiv = createTargetElement(target, list, index, targetIndex, theme, secondaryColor);
            container.appendChild(targetDiv);
        });

        return container;
    }

    function createTargetElement(target, list, listIndex, targetIndex, theme, secondaryColor) {
        const targetDiv = document.createElement('div');
        targetDiv.style.cssText = `
            background-color: ${secondaryColor};
            padding: 5px 12px;  /* Increased horizontal padding */
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            position: relative;
            min-width: 130px;  /* Added minimum width */
        `;

        targetDiv.title = 'Attack ⚔️';
        targetDiv.addEventListener('click', (e) => {
            if (!isDeleteMode && !e.target.closest('.delete-button')) {
                window.location.href = `${list.attackUrl}${target.id}`;
            }
        });

        const nameContainer = document.createElement('div');
        nameContainer.style.cssText = `
            color: ${theme.TEXT};
        `;
        nameContainer.textContent = target.name;
        targetDiv.appendChild(nameContainer);

        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';

        const swordIcon = document.createElement('span');
        swordIcon.textContent = '⚔️';
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/attack.svg');
        img.alt = 'Attack';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        swordIcon.textContent = ''; // Clear the + symbol
        swordIcon.appendChild(img);
        swordIcon.style.cssText = `color: ${theme.TEXT};`;
        rightContainer.appendChild(swordIcon);

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this target?', () => {
                    list.targets.splice(targetIndex, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${currentPage}`, attackLists);
                    refreshSidebar();
                    showToast(`Target "${target.name}" deleted`, 'info');
                });
            }, theme);
            deleteButton.className = 'delete-button no-drag';
            rightContainer.appendChild(deleteButton);
        }

        targetDiv.appendChild(rightContainer);
        return targetDiv;
    }
    function createTodoListElement(list, index) {
        const theme = getTheme();
        const todoListDiv = document.createElement('div');
        todoListDiv.className = 'draggable';
        todoListDiv.dataset.type = 'todoList';
        todoListDiv.dataset.index = index;

        const primaryColor = list.color || theme.SECONDARY_BG;
        const secondaryColor = getSecondaryColor(primaryColor);

        todoListDiv.style.cssText = `
            background-color: ${primaryColor};
            padding: 10px;
            border: 1px solid ${secondaryColor};
            border-radius: 5px;
            position: absolute;
            width: ${list.size?.width || 200}px;
            height: ${list.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
            left: ${list.position?.x || 0}px;
            top: ${list.position?.y || 0}px;
            ${isEditMode ? 'cursor: move;' : ''}
        `;

        const header = createTodoListHeader(list, index, theme, secondaryColor);
        todoListDiv.appendChild(header);

        const itemsContainer = createTodoItemsContainer(list, index, theme, secondaryColor);
        todoListDiv.appendChild(itemsContainer);

        if (isEditMode) {
            const resizer = createResizer(todoListDiv, (width, height) => {
                list.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
            });
            todoListDiv.appendChild(resizer);
        }

        return todoListDiv;
    }

    function createTodoListHeader(list, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
            color: ${theme.TEXT};
            font-size: 16px;
            padding: 5px;
            background-color: ${secondaryColor}; /* Apply the darker color */
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        header.textContent = list.name;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        const addItemButton = createAddButton(() => addTodoItem(index), theme);
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addItemButton.textContent = ''; // Clear the + symbol
        addItemButton.appendChild(img);
        buttonContainer.appendChild(addItemButton);

        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(list, index);
                if (result) {
                    list.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this todo list?', () => {
                    todoLists.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                    showToast(`Todo list "${list.name}" deleted`, 'info');
                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }

    function createTodoItemsContainer(list, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        list.items?.forEach((item, itemIndex) => {
            const itemDiv = createTodoItemElement(item, list, itemIndex, theme, secondaryColor);
            container.appendChild(itemDiv);
        });

        return container;
    }

    function createTodoItemElement(item, list, itemIndex, theme, secondaryColor) {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 6px 10px;
            background-color: ${secondaryColor};
            border-radius: 3px;
            min-width: 125px;
        `;
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.style.cursor = 'pointer';
    
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                item.checked = true;
                if (!list.resetDaily) {
                    itemText.style.opacity = '0.5';
                    itemText.style.textDecoration = 'line-through';
    
                    setTimeout(() => {
                        list.items.splice(itemIndex, 1);
                        saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                        refreshSidebar();
                        showToast(`Todo item "${item.name}" completed & removed`, 'success');
                    }, 1000);
                } else {
                    itemText.style.opacity = '0.5';
                    itemText.style.textDecoration = 'line-through';
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    showToast(`Todo item "${item.name}" completed`, 'success');
                }
            } else {
                confirmDelete('Are you sure you want to uncheck this task?', () => {
                    item.checked = false;
                    itemText.style.opacity = '1';
                    itemText.style.textDecoration = 'none';
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                });
                checkbox.checked = true;
            }
        });
    
        const itemText = document.createElement('span');
        itemText.textContent = `${item.emoji || '✅'} ${item.name}`;
        itemText.style.cssText = `
            color: ${theme.TEXT};
            flex-grow: 1;
            text-decoration: ${item.checked ? 'line-through' : 'none'};
            opacity: ${item.checked ? '0.5' : '1'};
            cursor: ${item.url ? 'pointer' : 'default'};
        `;
    
        if (item.url) {
            itemText.addEventListener('click', () => {
                window.location.href = item.url;
            });
        }
    
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
    
        if (isEditMode) {
            const moveButtons = document.createElement('div');
            moveButtons.style.cssText = 'display: flex; gap: 3px;';
    
            if (itemIndex > 0) {
                const upButton = createMoveButton('↑', () => {
                    const temp = list.items[itemIndex];
                    list.items[itemIndex] = list.items[itemIndex - 1];
                    list.items[itemIndex - 1] = temp;
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                }, theme);
                moveButtons.appendChild(upButton);
            }
    
            if (itemIndex < list.items.length - 1) {
                const downButton = createMoveButton('↓', () => {
                    const temp = list.items[itemIndex];
                    list.items[itemIndex] = list.items[itemIndex + 1];
                    list.items[itemIndex + 1] = temp;
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                }, theme);
                moveButtons.appendChild(downButton);
            }
    
            buttonsContainer.appendChild(moveButtons);
        }
    
        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this task?', () => {
                    list.items.splice(itemIndex, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${currentPage}`, todoLists);
                    refreshSidebar();
                    showToast(`Todo item "${item.name}" deleted`, 'info');
                });
            }, theme);
            buttonsContainer.appendChild(deleteButton);
        }
    
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(itemText);
        itemDiv.appendChild(buttonsContainer);
    
        return itemDiv;
    }
    function showCalculator() {
        const existingCalculator = document.getElementById('calculator-modal');
        if (existingCalculator) {
            existingCalculator.parentNode.removeChild(existingCalculator);
            return;
        }
    
        const sidebar = document.getElementById('enhanced-sidebar');
        const theme = getTheme();
    
        // Define separate styles for light and dark themes
        const styles = {
            dark: {
                bg: '#111111',
                displayBg: '#222222',
                buttonBg: '#222222',
                operatorBg: '#333333',
                text: '#eeeeee',
                subText: '#999999',
                buttonHoverBg: '#333333',
                operatorHoverBg: '#444444',
                clearButtonBg: '#ff3333'
            },
            light: {
                bg: '#ffffff',
                displayBg: '#f5f5f5',
                buttonBg: '#e8e8e8',
                operatorBg: '#d4d4d4',
                text: '#333333',
                subText: '#666666',
                buttonHoverBg: '#dadada',
                operatorHoverBg: '#c4c4c4',
                clearButtonBg: '#ff4444'
            }
        };
    
        const currentStyle = isLightMode ? styles.light : styles.dark;
    
        const calculatorContainer = document.createElement('div');
        calculatorContainer.id = 'calculator-modal';
        calculatorContainer.style.cssText = `
            position: absolute;
            top: 60px;
            right: 10px;
            width: 240px;
            background-color: ${currentStyle.bg};
            border-radius: 5px;
            padding: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 991500;
            font-family: 'Arial', sans-serif;
            border: 1px solid ${theme.BORDER};
        `;
    
        const header = document.createElement('div');
        header.style.cssText = `
            color: ${currentStyle.text};
            font-size: 16px;
            padding: 5px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
        `;
        header.textContent = 'Calculator';
        calculatorContainer.appendChild(header);
    
        const display = document.createElement('div');
        display.id = 'calculator-display';
        display.style.cssText = `
            width: 100%;
            height: 50px;
            background-color: ${currentStyle.displayBg};
            color: ${currentStyle.text};
            border-radius: 5px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            font-size: 20px;
            border: 1px solid ${theme.BORDER};
        `;
    
        const displayLabel = document.createElement('div');
        displayLabel.textContent = 'Result';
        displayLabel.style.cssText = `
            font-size: 14px;
            color: ${currentStyle.subText};
        `;
    
        const displayValue = document.createElement('div');
        displayValue.textContent = '0';
        displayValue.style.cssText = `
            font-size: 20px;
            text-align: right;
            flex-grow: 1;
            margin-left: 10px;
            color: ${currentStyle.text};
        `;
    
        display.appendChild(displayLabel);
        display.appendChild(displayValue);
    
        const keypad = document.createElement('div');
        keypad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
        `;

        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let resetOnNextInput = true;

        const buttons = [
            { text: '7', type: 'number' },
            { text: '8', type: 'number' },
            { text: '9', type: 'number' },
            { text: '÷', type: 'operator', value: '/' },

            { text: '4', type: 'number' },
            { text: '5', type: 'number' },
            { text: '6', type: 'number' },
            { text: '×', type: 'operator', value: '*' },

            { text: '1', type: 'number' },
            { text: '2', type: 'number' },
            { text: '3', type: 'number' },
            { text: '-', type: 'operator' },

            { text: '.', type: 'decimal' },
            { text: '0', type: 'number' },
            { text: '=', type: 'equals' },
            { text: '+', type: 'operator' },
        ];

        const topRow = document.createElement('div');
        topRow.style.cssText = `
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 5px;
            margin-bottom: 5px;
            align-items: center;
        `;

        

        const createButton = (text, type = 'number') => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                background-color: ${type === 'operator' || type === 'equals' ? currentStyle.operatorBg : currentStyle.buttonBg};
                color: ${currentStyle.text};
                border: none;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.1s, background-color 0.1s;
            `;
    
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = type === 'operator' || type === 'equals' 
                    ? currentStyle.operatorHoverBg 
                    : currentStyle.buttonHoverBg;
            });
    
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = type === 'operator' || type === 'equals' 
                    ? currentStyle.operatorBg 
                    : currentStyle.buttonBg;
            });
    
            return button;
        };
    
        const clearButton = document.createElement('button');
        clearButton.textContent = 'C';
        clearButton.style.cssText = `
            background-color: ${currentStyle.clearButtonBg};
            color: white;
            border: none;
            padding: 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            height: 40px;
        `;

        clearButton.addEventListener('click', () => {
            currentValue = '0';
            previousValue = null;
            operation = null;
            resetOnNextInput = true;
            displayValue.textContent = currentValue;
        });

        topRow.appendChild(display);
        topRow.appendChild(clearButton);

        calculatorContainer.appendChild(topRow);

        calculatorContainer.appendChild(topRow);

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                background-color: ${btn.type === 'operator' || btn.type === 'equals' ? currentStyle.operatorBg : currentStyle.buttonBg};
                color: ${currentStyle.text};
                border: none;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.1s, background-color 0.1s;
            `;

            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ? currentStyle.operatorHoverBg : currentStyle.buttonHoverBg;

                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                    button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ? currentStyle.operatorHoverBg : currentStyle.buttonHoverBg;
                }, 100);

                const value = btn.value || btn.text;

                if (btn.type === 'decimal') {
                    if (!currentValue.includes('.')) {
                        currentValue = currentValue === '0' ? '0.' : currentValue + '.';
                    }
                }

                if (btn.type === 'number') {
                    if (resetOnNextInput) {
                        currentValue = value;
                        resetOnNextInput = false;
                    } else {
                        currentValue = currentValue === '0' ? value : currentValue + value;
                    }
                }
                else if (btn.type === 'operator') {
                    previousValue = currentValue;
                    operation = btn.value || btn.text;
                    resetOnNextInput = true;
                }
                else if (btn.type === 'equals') {
                    if (previousValue && operation) {
                        const prev = parseFloat(previousValue);
                        const current = parseFloat(currentValue);
                        let result;

                        switch (operation) {
                            case '+': result = prev + current; break;
                            case '-': result = prev - current; break;
                            case '*':
                            case '×': result = prev * current; break;
                            case '/':
                            case '÷':
                                if (current === 0) {
                                    result = 'Error';
                                } else {
                                    result = prev / current;
                                }
                                break;
                        }

                        currentValue = String(result);
                        previousValue = null;
                        operation = null;
                        resetOnNextInput = true;
                    }
                }

                displayValue.textContent = currentValue;
            });

            keypad.appendChild(button);
        });

        calculatorContainer.appendChild(keypad);

        document.addEventListener('click', function clickOutside(e) {
            if (!calculatorContainer.contains(e.target) && e.target.id !== 'calculatorButton') {
                if (sidebar.contains(calculatorContainer)) {
                    sidebar.removeChild(calculatorContainer);
                }
                document.removeEventListener('click', clickOutside);
                document.removeEventListener('keydown', handleKeyPress);
            }
        }, { capture: true });

        const handleKeyPress = (e) => {
            const key = e.key;

            if ('0123456789'.includes(key)) {
                const numberBtn = Array.from(keypad.children).find(btn => btn.textContent === key);
                if (numberBtn) numberBtn.click();
            } else if (key === '+' || key === '-') {
                const opBtn = Array.from(keypad.children).find(btn => btn.textContent === key);
                if (opBtn) opBtn.click();
            } else if (key === '*') {
                const multBtn = Array.from(keypad.children).find(btn => btn.textContent === '×');
                if (multBtn) multBtn.click();
            } else if (key === '/') {
                const divBtn = Array.from(keypad.children).find(btn => btn.textContent === '÷');
                if (divBtn) divBtn.click();
            } else if (key === 'Enter' || key === '=') {
                const equalsBtn = Array.from(keypad.children).find(btn => btn.textContent === '=');
                if (equalsBtn) equalsBtn.click();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearButton.click();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        sidebar.appendChild(calculatorContainer);

        setTimeout(() => {
            calculatorContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }, 0);
    }

    function createLoanTrackerElement() {
        const theme = getTheme();
        const loanTrackerDiv = document.createElement('div');
        loanTrackerDiv.className = 'draggable';
        loanTrackerDiv.dataset.type = 'loanTracker';

        const primaryColor = loanTracker.color || theme.SECONDARY_BG;
        const secondaryColor = getSecondaryColor(primaryColor);

        loanTrackerDiv.style.cssText = `
            background-color: ${primaryColor};
            padding: 10px;
            border: 1px solid ${secondaryColor};
            border-radius: 5px;
            position: absolute;
            width: ${loanTracker.size?.width || 200}px;
            height: ${loanTracker.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
            left: ${loanTracker.position?.x || 0}px;
            top: ${loanTracker.position?.y || 0}px;
            ${isEditMode ? 'cursor: move;' : ''}
        `;

        const header = createLoanTrackerHeader(theme, secondaryColor);
        loanTrackerDiv.appendChild(header);

        const entriesContainer = createLoanEntriesContainer(theme, secondaryColor);
        loanTrackerDiv.appendChild(entriesContainer);

        if (isEditMode) {
            const resizer = createResizer(loanTrackerDiv, (width, height) => {
                loanTracker.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
            });
            loanTrackerDiv.appendChild(resizer);
        }

        return loanTrackerDiv;
    }
    function createLoanTrackerHeader(theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
            color: ${theme.TEXT};
            font-size: 16px;
            padding: 5px;
            background-color: ${secondaryColor};
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        header.textContent = 'Loan Tracker';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';

       const addLoanButton = createAddButton(
            () => addLoanEntry(),
            theme,
         '+' // Use + symbol as fallback
        );

        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addLoanButton.textContent = ''; // Clear the + symbol
        addLoanButton.appendChild(img);
        buttonContainer.appendChild(addLoanButton);

        if(isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(loanTracker);
                if (result) {
                    loanTracker.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete Loan Tracker?', () => {
                    // Remove from localStorage
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`);
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}_backup`);

                    // Update pages state
                    if (pages[currentPage]) {
                        delete pages[currentPage].loanTracker;
                        savePages(); // Save the updated pages state
                    }

                    // Reset tracker
                    loanTracker = null;

                    // Force a complete refresh
                    refreshSidebar();
                    refreshMainContent();
                    refreshSidebar();
                    showToast('Loan Tracker deleted', 'info');

                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }


    function createLoanEntriesContainer(theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        loanTracker.entries?.forEach((entry, index) => {
            const entryDiv = createLoanEntryElement(entry, index, theme, secondaryColor);
            container.appendChild(entryDiv);
        });

        return container;
    }

    function createLoanEntryElement(entry, index, theme, secondaryColor) {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `
            background-color: ${secondaryColor};
            padding: 8px;
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 8px;
            border-left: 3px solid ${getDueDateColor(entry, theme)};
            position: relative;
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const userText = document.createElement('span');
        userText.innerHTML = `<strong> <img src="${chrome.runtime.getURL('assets/pin.svg')}" alt="Seller" style="height:12px;vertical-align:left;"> ${entry.user}</strong>`;
        userText.style.cssText = `color: ${theme.TEXT}; font-size: 14px;`;
        headerDiv.appendChild(userText);

        const amountText = document.createElement('span');
        amountText.textContent = `$${entry.amount.toLocaleString()}`;
        amountText.style.cssText = `
            color: ${theme.TEXT};
            font-weight: bold;
            font-size: 14px;
        `;
        headerDiv.appendChild(amountText);
        entryDiv.appendChild(headerDiv);

        if (entry.dueDate) {
            const dueDiv = document.createElement('div');
            dueDiv.textContent = `📅 Due: ${formatDate(entry.dueDate)}`;
            dueDiv.style.cssText = `
                color: ${getDueDateColor(entry, theme)};
                font-size: 13px;
                ${isOverdue(entry) ? 'font-weight: bold;' : ''}
            `;
            entryDiv.appendChild(dueDiv);
        }

        if (entry.notes) {
            const notesDiv = document.createElement('div');
            notesDiv.textContent = `📝 ${entry.notes}`;
            notesDiv.style.cssText = `
                color: ${theme.TEXT};
                font-size: 13px;
                font-style: italic;
            `;
            entryDiv.appendChild(notesDiv);
        }

        const paymentDiv = document.createElement('div');
        paymentDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
        `;

        let historyVisible = false;
        const historyToggle = document.createElement('button');
        historyToggle.textContent = 'History';
        historyToggle.className = 'no-drag';
        historyToggle.style.cssText = `
            background: none;
            border: 1px solid ${theme.BORDER};
            color: ${theme.TEXT};
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
            ${entry.payments && entry.payments.length > 0 ? '' : 'display: none;'}
        `;

        const historySection = document.createElement('div');
        historySection.style.cssText = `
            display: none;
            margin-top: 8px;
            padding: 5px;
            background-color: ${theme.SECONDARY_BG};
            border-radius: 3px;
            font-size: 12px;
        `;

        if (entry.payments && entry.payments.length > 0) {
            const historyTitle = document.createElement('div');
            historyTitle.textContent = 'Payment History';
            historyTitle.style.cssText = `
                color: ${theme.TEXT};
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 13px;
            `;
            historySection.appendChild(historyTitle);

            entry.payments.forEach(payment => {
                const paymentLine = document.createElement('div');
                paymentLine.textContent = `${formatDate(new Date(payment.date))} - $${payment.amount.toLocaleString()} paid (Remaining: $${payment.remaining.toLocaleString()})`;
                paymentLine.style.cssText = `
                    color: ${theme.TEXT};
                    margin-bottom: 3px;
                `;
                historySection.appendChild(paymentLine);
            });
        }

        historyToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            historyVisible = !historyVisible;
            historySection.style.display = historyVisible ? 'block' : 'none';
            historyToggle.textContent = historyVisible ? 'Hide History' : 'History';
        });

        const paymentInput = createPaymentInput(entry, index, theme);

        paymentDiv.appendChild(historyToggle);
        paymentDiv.appendChild(paymentInput);
        entryDiv.appendChild(paymentDiv);
        entryDiv.appendChild(historySection);

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this loan entry?', () => {
                    loanTracker.entries.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
                    refreshSidebar();
                    showToast(`Loan for "${entry.user}" deleted`, 'info');
                });
            }, theme);
            deleteButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
            `;
            entryDiv.appendChild(deleteButton);
        }

        return entryDiv;
    }

    function createAuctionTrackerElement() {
        const theme = getTheme();
        const auctionTrackerDiv = document.createElement('div');
        auctionTrackerDiv.className = 'draggable';
        auctionTrackerDiv.dataset.type = 'auctionTracker';

        const primaryColor = auctionTracker.color || theme.SECONDARY_BG;
        const secondaryColor = getSecondaryColor(primaryColor);

        auctionTrackerDiv.style.cssText = `
                background-color: ${primaryColor};
                padding: 8px;
                border: 1px solid ${secondaryColor};
                border-radius: 5px;
                position: absolute;
                width: ${auctionTracker.size?.width}px;
                height: ${auctionTracker.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
                left: ${auctionTracker.position?.x || 0}px;
                top: ${auctionTracker.position?.y || 0}px;
                ${isEditMode ? 'cursor: move;' : ''}
            `;

        const header = createAuctionTrackerHeader(theme, secondaryColor);
        auctionTrackerDiv.appendChild(header);

        const auctionsContainer = createAuctionsContainer(theme, secondaryColor);
        auctionTrackerDiv.appendChild(auctionsContainer);

        if (isEditMode) {
            const resizer = createResizer(auctionTrackerDiv, (width, height) => {
                auctionTracker.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
            });
            auctionTrackerDiv.appendChild(resizer);
        }

        return auctionTrackerDiv;
    }

    function createAuctionTrackerHeader(theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
                    color: ${theme.TEXT};
                    font-size: 14px;
                    padding: 4px;
                    background-color: ${secondaryColor};
                    border-radius: 3px;
                    display: flex; 
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                `;
        header.textContent = 'Auction Tracker';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 4px; align-items: center;';

        const addAuctionButton = createAddButton(() => addAuctionEntry(), theme, '+');
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addAuctionButton.textContent = ''; // Clear the + symbol
        addAuctionButton.appendChild(img);
        buttonContainer.appendChild(addAuctionButton);

        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(auctionTracker);
                if (result) {
                    auctionTracker.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete Auction Tracker?', () => {
                    // Remove from localStorage
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`);
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}_backup`);

                    // Update pages state
                    if (pages[currentPage]) {
                        delete pages[currentPage].auctionTracker;
                        savePages(); // Save the updated pages state
                    }

                    // Clear interval and reset tracker
                    if (window.auctionCheckIntervalId) {
                        clearInterval(window.auctionCheckIntervalId);
                    }
                    auctionTracker = null;

                    // Force a complete refresh
                    refreshSidebar();
                    refreshMainContent();
                    refreshSidebar();
                    showToast('Auction Tracker deleted', 'info');
                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }

    function createAuctionsContainer(theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                width: 100%;
                max-height: calc(100% - 40px);
                overflow-y: auto;
            `;

        auctionTracker.auctions?.forEach((auction, index) => {
            container.appendChild(createAuctionElement(auction, index, theme, secondaryColor));
        });

        return container;
    }

    function createAuctionElement(auction, index, theme, secondaryColor) {
        const auctionDiv = document.createElement('div');
        auctionDiv.style.cssText = `
                background-color: ${secondaryColor};
                padding: 4px 6px;
                border-radius: 3px;
                border-left: 3px solid ${getAuctionColor(auction.endTime, theme)};
                flex: 1 1 calc(50% - 4px);
                min-width: 150px;
                position: relative;
                margin: 0;
            `;

            const itemText = document.createElement('div');
            const imgItem = document.createElement('img');
            imgItem.src = chrome.runtime.getURL('assets/tag.svg');
            imgItem.alt = 'Item';
            imgItem.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
            itemText.appendChild(imgItem);
            itemText.appendChild(document.createTextNode(` ${auction.item}`));
            itemText.style.cssText = `
                color: ${theme.TEXT}; 
                font-size: 16px;
                padding-right: 20px;
                white-space: nowrap;
                margin-bottom: 2px;
            `;
            auctionDiv.appendChild(itemText);
            
            const sellerText = document.createElement('div');
            const imgSeller = document.createElement('img');
            imgSeller.src = chrome.runtime.getURL('assets/pin.svg');
            imgSeller.alt = 'Seller';
            imgSeller.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
            sellerText.appendChild(imgSeller);
            sellerText.appendChild(document.createTextNode(` ${auction.seller}`));
            sellerText.style.cssText = `
                color: ${theme.TEXT}; 
                font-size: 14px;
                white-space: nowrap;
                margin-bottom: 2px;
            `;
            auctionDiv.appendChild(sellerText);

        const timeLeftText = document.createElement('div');
        function updateTime() {
            const timeLeftFormatted = formatTimeLeft(auction.endTime);
            const imgTimer = document.createElement('img');
            imgTimer.src = chrome.runtime.getURL('assets/timer.svg');
            imgTimer.alt = 'Timer';
            imgTimer.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
            timeLeftText.innerHTML = ''; // Clear previous content
            timeLeftText.appendChild(imgTimer);
            timeLeftText.appendChild(document.createTextNode(` ${timeLeftFormatted}`));
            timeLeftText.style.cssText = `
                color: ${getAuctionColor(auction.endTime, theme)};
                font-weight: ${isEnding(auction.endTime) ? 'bold' : 'normal'};
                font-size: 14px;
                margin-top: 1px;
            `;
        }
        updateTime();

        if (isEnding(auction.endTime)) {
            auctionDiv.dataset.timerId = setInterval(updateTime, 1000);
        }

        auctionDiv.appendChild(timeLeftText);

        const auctionButton = document.createElement('button');
        auctionButton.innerHTML = '🔍';
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/search.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:24px;height:24px;vertical-align:middle;';
        auctionButton.textContent = ''; // Clear the + symbol
        auctionButton.appendChild(img);

        auctionButton.title = 'Go to auctions';
        auctionButton.className = 'no-drag';
        auctionButton.style.cssText = `
                position: absolute;
                top: 50%;
                right: 4px;
                transform: translateY(-50%);
                background-color: transparent;
                border: none;
                cursor: pointer;
                font-size: 14px;
                padding: 0;
                opacity: 0.7;
                transition: opacity 0.2s;
            `;

        auctionButton.addEventListener('mouseover', () => {
            auctionButton.style.opacity = '1';
        });

        auctionButton.addEventListener('mouseout', () => {
            auctionButton.style.opacity = '0.7';
        });

        auctionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'https://www.torn.com/amarket.php';
        });
        auctionDiv.appendChild(auctionButton);

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this auction entry?', () => {
                    if (auctionDiv.dataset.timerId) {
                        clearInterval(parseInt(auctionDiv.dataset.timerId));
                    }

                    auctionTracker.auctions.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
                    refreshSidebar();
                    showToast(`Auction for "${auction.item}" deleted`, 'info');
                    auctionTracker.active = false;
                });
            }, theme);
            deleteButton.style.cssText += `
                    position: absolute;
                    top: 50%;
                    right: 24px;
                    transform: translateY(-50%);
                    padding: 0;
                    font-size: 12px;
                `;
            auctionDiv.appendChild(deleteButton);
        }

        return auctionDiv;
    }
    function createCountdownElement(group, index) {
        const theme = getTheme();
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'draggable';
        countdownDiv.dataset.type = 'countdown';
        countdownDiv.dataset.index = index;

        const primaryColor = group.color || theme.SECONDARY_BG;
        const secondaryColor = getSecondaryColor(primaryColor);

        countdownDiv.style.cssText = `
        background-color: ${primaryColor};
        padding: 10px;
        border: 1px solid ${secondaryColor};
        border-radius: 5px;
        position: absolute;
        width: ${group.size?.width || 200}px;
        height: ${group.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px;
        left: ${group.position?.x || 0}px;
        top: ${group.position?.y || 0}px;
        ${isEditMode ? 'cursor: move;' : ''}
    `;

        const header = createCountdownHeader(group, index, theme, secondaryColor);
        countdownDiv.appendChild(header);

        const timersContainer = createTimersContainer(group, index, theme, secondaryColor);
        countdownDiv.appendChild(timersContainer);


        if (isEditMode) {
            const resizer = createResizer(countdownDiv, (width, height) => {
                group.size = { width, height };
                saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
            });
            countdownDiv.appendChild(resizer);
        }

        return countdownDiv;
    }
    function createCountdownHeader(group, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `
        color: ${theme.TEXT};
        font-size: 16px;
        padding: 5px;
        background-color: ${secondaryColor}; /* Apply the darker color */
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    `;
        header.textContent = group.name;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';

        if (isEditMode) {
            const colorButton = createAddButton(async () => {
                const result = await openColorPicker(group, index);
                if (result) {
                    group.color = result.elementColor;
                    saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
                    refreshSidebar();
                }
            }, theme, '🎨');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = ''; // Clear the + symbol
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }

        const addTimerButton = createAddButton(() => addManualCountdownGroup(), theme, '+');
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addTimerButton.textContent = ''; // Clear the + symbol
        addTimerButton.appendChild(img);
        buttonContainer.appendChild(addTimerButton);

        if (isDeleteMode) {
            const deleteButton = createDeleteButton(() => {
                confirmDelete('Delete this countdown group?', () => {
                    countdownGroups.splice(index, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
                    refreshSidebar();
                    showToast(`Countdown group "${group.name}" deleted`, 'info');
                });
            }, theme);
            buttonContainer.appendChild(deleteButton);
        }

        header.appendChild(buttonContainer);
        return header;
    }
    function createTimersContainer(group, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;

        group.timers?.forEach((timer, timerIndex) => {
            const timerDiv = createTimerElement(timer, group, index, timerIndex, theme, secondaryColor);
            container.appendChild(timerDiv);
        });

        return container;
    }
    function createTimerElement(timer, group, groupIndex, timerIndex, theme, secondaryColor) {
        const timerDiv = document.createElement('div');
        timerDiv.style.cssText = `
        background-color: ${secondaryColor};
        padding: 5px;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    `;

        const timerName = document.createElement('span');
        timerName.textContent = timer.name;
        timerName.style.cssText = `color: ${theme.TEXT};`;
        timerDiv.appendChild(timerName);

        const timeLeft = document.createElement('span');
        timeLeft.style.cssText = `color: ${theme.TEXT}; font-weight: bold;`;

        function updateTimer() {
            const now = Date.now();
            const remainingTime = timer.endTime - now;

            if (remainingTime <= 0) {
                timeLeft.textContent = 'Finished';
                timeLeft.style.color = theme.DANGER;
                startFlashing(timerDiv, group, groupIndex, timerIndex, theme);

                clearInterval(timerDiv.dataset.timerId);
            } else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                timeLeft.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }

        updateTimer();
        timerDiv.dataset.timerId = setInterval(updateTimer, 1000);

        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
        rightContainer.appendChild(timeLeft);

        if (isDeleteMode) {
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '❌';
            deleteButton.style.cssText = `
            background: none;
            border: none;
            color: ${theme.DANGER};
            cursor: pointer;
            font-size: 16px;
            padding: 0 5px;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

            deleteButton.addEventListener('mouseenter', () => {
                deleteButton.style.opacity = '1';
            });

            deleteButton.addEventListener('mouseleave', () => {
                deleteButton.style.opacity = '0.7';
            });

            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                confirmDelete('Delete this timer?', () => {
                    clearInterval(timerDiv.dataset.timerId);
                    if (timerDiv.dataset.flashInterval) {
                        clearInterval(parseInt(timerDiv.dataset.flashInterval));
                    }
                    group.timers.splice(timerIndex, 1);
                    saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
                    refreshSidebar();
                    showToast(`Timer "${timer.name}" deleted`, 'info');
                });
            });

            rightContainer.appendChild(deleteButton);
        }

        timerDiv.appendChild(rightContainer);
        return timerDiv;
    }

    function startFlashing(timerDiv, group, groupIndex, timerIndex, theme) {
        let isFlashing = false;
        const flashInterval = setInterval(() => {
            isFlashing = !isFlashing;
            timerDiv.style.backgroundColor = isFlashing ? theme.DANGER : theme.BG;
        }, 500);
        timerDiv.dataset.flashInterval = flashInterval.toString();
    }


    if (isDeleteMode) {
        const deleteButton = createDeleteButton(() => {
            confirmDelete('Delete this timer?', () => {
                if (timerDiv.dataset.flashInterval) {
                    clearInterval(Number(timerDiv.dataset.flashInterval));
                    delete timerDiv.dataset.flashInterval; // Clean up the dataset
                }
                group.timers.splice(timerIndex, 1);
                saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${currentPage}`, countdownGroups);
                refreshSidebar();
                showToast(`Timer "${timer.name}" deleted`, 'info');
            });
        }, theme);
        timerDiv.appendChild(deleteButton);
    }

    function addDebugManager() {
        const theme = getTheme(); // Get the theme here
        const debugButton = document.createElement('button');
        debugButton.textContent = '🔧';
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/settings.svg');
        img.alt = 'Settings';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        debugButton.textContent = ''; // Clear the + symbol
        debugButton.appendChild(img);
        debugButton.style.color = theme.TEXT;
        debugButton.title = 'SideWinder Settings';
        debugButton.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background-color: ${theme.BUTTON_BG};
            color: ${theme.TEXT};
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        `;

        debugButton.addEventListener('mouseover', () => {
            debugButton.style.opacity = '1';
        });

        debugButton.addEventListener('mouseout', () => {
            debugButton.style.opacity = '0.6';
        });

        debugButton.addEventListener('click', () => {
            if (!debugMenuOpen) {
                debugMenuOpen = true;
                showDebugMenu();
            }
        });

        document.body.appendChild(debugButton);
    }
    function updateSidebarBtnPosition(pos) {
        const btn = document.getElementById('sidebar-toggle');
        if (!btn) return;
        btn.style.top = '';
        btn.style.bottom = '';
        btn.style.left = '';
        btn.style.right = '';
        switch (pos) {
            case 'top-left':
                btn.style.top = '10px';
                btn.style.left = '10px';
                break;
            case 'top-right':
                btn.style.top = '10px';
                btn.style.right = '10px';
                break;
            case 'bottom-left':
                btn.style.bottom = '85px';
                btn.style.left = '10px';
                break;
            case 'bottom-right':
                btn.style.bottom = '85px';
                btn.style.right = '10px';
                break;
        }
    }
    function showDebugMenu() {
        const theme = getTheme();
        const overlay = createOverlay();
        const menu = document.createElement('div');

        menu.style.cssText = `
            background-color: ${theme.SECONDARY_BG};
            padding: 20px;
            border-radius: 5px;
            min-width: 350px;
            max-width: 500px;
            border: 1px solid ${theme.BORDER};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;

        menu.innerHTML = `
            <h3 style="margin-top: 0; color: ${theme.TEXT};">SideWinder Settings</h3>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Data Management</div>
                <div style="display: flex; gap: 10px;">
                    <button id="debug-export" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Export Data</button>

                    <button id="debug-import" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Import Data</button>

                    <button id="debug-reset" style="
                        padding: 5px 10px;
                        background-color: ${theme.DANGER};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Reset All Data</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Repair Functions</div>
                <div style="display: flex; gap: 10px;">
                    <button id="debug-validate" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Validate Data</button>

                    <button id="debug-fix-trackers" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Fix Trackers</button>

                    <button id="debug-refresh" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Force Refresh</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Auto Adjust Sidebar Width to Device</div>
                <label style="color: ${theme.subTEXT}; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="debug-auto-width" ${isAutoWidth ? 'checked' : ''}>
                    Auto Width (Best for screen)
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Sidebar Toggle Button Screen Position</div>
                <div id="sidebar-btn-pos-options" style="display: flex; gap: 15px;">
                    <label style="color: ${theme.subTEXT};" ><input type="radio" name="sidebar-btn-pos" value="top-left">Top Left</label>
                    <label style="color: ${theme.subTEXT};" ><input type="radio" name="sidebar-btn-pos" value="top-right">Top Right</label>
                    <label style="color: ${theme.subTEXT};" ><input type="radio" name="sidebar-btn-pos" value="bottom-left">Bottom Left</label>
                    <label style="color: ${theme.subTEXT};" ><input type="radio" name="sidebar-btn-pos" value="bottom-right">Bottom Right</label>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Appearance</div>
                <div style="display: flex; gap: 10px;">
                    <button id="debug-theme" style="
                        padding: 5px 10px;
                        background-color: ${theme.BUTTON_BG};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">${isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Debug Info</div>
                <div style="
                    padding: 5px;
                    background-color: ${theme.BG};
                    border: 1px solid ${theme.BORDER};
                    color: ${theme.TEXT};
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 12px;
                    height: 100px;
                    overflow-y: auto;
                " id="debug-info"></div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Script Status</div>
                <div style="
                    padding: 5px;
                    background-color: ${theme.BG};
                    border: 1px solid ${theme.BORDER};
                    color: ${theme.TEXT};
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 12px;
                ">
                    <div>SideWinder Version: ${CONSTANTS.VERSION || '2.2'}</div>
                    <div>Light Mode: ${isLightMode ? 'Enabled' : 'Disabled'}</div>
                    <div>Current Page: ${currentPage + 1}</div>
                    <div>Auction Timer: ${window.auctionCheckIntervalId ? 'Operational' : 'Not Running'}</div>
                </div>
            </div>

            <div style="text-align: right;">
                <button id="debug-close" style="
                    padding: 5px 15px;
                    background-color: ${theme.BUTTON_BG};
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;

        const savedBtnPos = localStorage.getItem('sidebarBtnPos') || 'top-left';
        const btnPosRadios = menu.querySelectorAll('input[name="sidebar-btn-pos"]');
        btnPosRadios.forEach(radio => {
            radio.checked = (radio.value === savedBtnPos);
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    localStorage.setItem('sidebarBtnPos', e.target.value);
                    updateSidebarBtnPosition(e.target.value);
                }
            });
        });
        updateSidebarBtnPosition(savedBtnPos);
        overlay.appendChild(menu);
        document.body.appendChild(overlay);

        const debugInfo = menu.querySelector('#debug-info');
        debugInfo.innerHTML = `
            Current Page: ${currentPage + 1}<br>
            Groups: ${groups.length}<br>
            Notepads: ${notepads.length}<br>
            Attack Lists: ${attackLists.length}<br>
            Todo Lists: ${todoLists.length}<br>
            Loan Entries: ${loanTracker.entries.length}<br>
            Auction Entries: ${auctionTracker.auctions.length}<br>
            Timer Groups: ${countdownGroups.length}<br>
            Custom Countdowns: ${manualCountdownGroups.length}<br>
        `;

        menu.querySelector('#debug-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
            debugMenuOpen = false;
        });

        menu.querySelector('#debug-export').addEventListener('click', () => {
            exportAllData();
        });

        menu.querySelector('#debug-import').addEventListener('click', () => {
            importAllData();
        });

        menu.querySelector('#debug-reset').addEventListener('click', () => {
            confirmDelete('This will reset ALL SideWinder data. Are you sure?', () => {
                resetAllData();
                document.body.removeChild(overlay);
                debugMenuOpen = false;
            });
        });

        menu.querySelector('#debug-validate').addEventListener('click', () => {
            validateState();
            showToast('Data validated', 'success');
        });

        menu.querySelector('#debug-fix-trackers').addEventListener('click', () => {
            fixTrackers();
            showToast('Trackers fixed', 'success');
        });

        menu.querySelector('#debug-refresh').addEventListener('click', () => {
            refreshSidebar();
            showToast('Sidebar refreshed', 'success');
        });

        menu.querySelector('#debug-theme').addEventListener('click', () => {
            toggleLightMode();
            document.body.removeChild(overlay);
            debugMenuOpen = false;
            showToast(`Switched to ${isLightMode ? 'Light' : 'Dark'} Mode`, 'success');

            setTimeout(() => {
                debugMenuOpen = true;
                showDebugMenu();
            }, 300);
        });
        const autoWidthCheckbox = menu.querySelector('#debug-auto-width');
        if (autoWidthCheckbox) {
            autoWidthCheckbox.addEventListener('change', (e) => {
                isAutoWidth = e.target.checked;
                localStorage.setItem('sidebarAutoWidth', isAutoWidth ? '1' : '0');
                applySidebarWidth();
                refreshSidebar();
            });
        }
    }

    function exportAllData() {
        const allPageData = [];
        for (let i = 0; i < 3; i++) {
            const pageData = {
                groups: loadState(`${CONSTANTS.STATE_KEYS.GROUPS}_${i}`, []),
                notepads: loadState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${i}`, []),
                attackLists: loadState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${i}`, []),
                todoLists: loadState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${i}`, []),
                countdownGroups: loadState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${i}`, []),
                manualCountdownGroups: loadState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${i}`, [])
            };
            try {
                const rawLoanTracker = localStorage.getItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${i}`);
                if (rawLoanTracker && rawLoanTracker !== "null") {
                    const loanData = JSON.parse(rawLoanTracker);
                    if (loanData && loanData.entries) {
                        pageData.loanTracker = loanData;
                    }
                }

                const rawAuctionTracker = localStorage.getItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${i}`);
                if (rawAuctionTracker && rawAuctionTracker !== "null") {
                    const auctionData = JSON.parse(rawAuctionTracker);
                    if (auctionData && auctionData.auctions) {
                        pageData.auctionTracker = auctionData;
                    }
                }
            } catch (e) {
                console.error(`Error processing tracker data for page ${i}:`, e);
            }

            allPageData.push(pageData);
        }

        const exportData = {
            version: CONSTANTS.VERSION || '2.2',
            timestamp: Date.now(),
            currentPage: currentPage,
            isLightMode: isLightMode,
            pages: allPageData
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'sidewinder_backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    function importAllData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);

                    if (!importedData.pages) {
                        throw new Error('Invalid backup file format');
                    }

                    confirmDelete('This will replace all your current data with the imported data. Continue?', () => {
                        savePageData();

                        importedData.pages.forEach((pageData, pageIndex) => {
                            if (pageIndex >= 3) return;

                            saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${pageIndex}`, pageData.groups || []);
                            saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${pageIndex}`, pageData.notepads || []);
                            saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${pageIndex}`, pageData.attackLists || []);
                            saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${pageIndex}`, pageData.todoLists || []);
                            if (pageData.loanTracker) {
                                saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${pageIndex}`, pageData.loanTracker);
                            }

                            if (pageData.auctionTracker) {
                                saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${pageIndex}`, pageData.auctionTracker);
                            }
                            saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${pageIndex}`, pageData.countdownGroups || []);
                            saveState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${pageIndex}`, pageData.manualCountdownGroups || []);
                        });

                        isLightMode = importedData.isLightMode || false;
                        saveState(CONSTANTS.STATE_KEYS.LIGHT_MODE, isLightMode);

                        currentPage = importedData.currentPage || 0;
                        if (currentPage >= 3) currentPage = 0;
                        saveState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, currentPage);

                        loadPageData();

                        refreshSidebar();

                        showToast('Data imported successfully', 'success');
                    });
                } catch (error) {
                    showToast(`Import error: ${error.message}`, 'error');
                }
            };
            reader.readAsText(file);
        });

        input.click();
    }

    function resetAllData() {
        // List all key prefixes that need to be completely removed
        const keyPrefixes = [
            CONSTANTS.STATE_KEYS.GROUPS,
            CONSTANTS.STATE_KEYS.NOTEPADS,
            CONSTANTS.STATE_KEYS.ATTACK_LISTS,
            CONSTANTS.STATE_KEYS.TODO_LISTS,
            CONSTANTS.STATE_KEYS.LOAN_TRACKER,
            CONSTANTS.STATE_KEYS.AUCTION_TRACKER,
            CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS,
            CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS,
            CONSTANTS.STATE_KEYS.DAY_RESET_TIMER,
            CONSTANTS.STATE_KEYS.MINIMIZE_STATES,
            CONSTANTS.STATE_KEYS.SIDEBAR_STATE,
            CONSTANTS.STATE_KEYS.LIGHT_MODE,
            CONSTANTS.STATE_KEYS.CURRENT_PAGE,
        ];

        // Find and remove all localStorage keys related to SideWinder
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Check if the key belongs to the SideWinder script
            const isSideWinderKey = keyPrefixes.some(prefix =>
                key === prefix ||
                key.startsWith(`${prefix}_`) ||
                key === `${prefix}_backup` ||
                key.startsWith(`${prefix}_backup_`)
            );

            if (isSideWinderKey) {
                try {
                    localStorage.removeItem(key);
                    // Adjust index because removing an item shifts the storage
                    i--;
                } catch (e) {
                    console.error(`Failed to remove key: ${key}`, e);
                }
            }
        }

        // Also try to clear GM storage if available
        const gmKeys = [
            CONSTANTS.STATE_KEYS.GROUPS,
            CONSTANTS.STATE_KEYS.NOTEPADS,
            CONSTANTS.STATE_KEYS.ATTACK_LISTS,
            CONSTANTS.STATE_KEYS.TODO_LISTS,
            CONSTANTS.STATE_KEYS.LOAN_TRACKER,
            CONSTANTS.STATE_KEYS.AUCTION_TRACKER,
            CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS,
            CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS,
            CONSTANTS.STATE_KEYS.DAY_RESET_TIMER,
            "groupZOrder",
            "sidebarState",
            "lightMode",
            "refreshRate",
            "currentPage",
        ];

        // Remove any GM storage values if they exist
        if (typeof chrome.storage.local.set !== 'undefined' && typeof chrome.storage.local.remove !== 'undefined') {
            for (const key of gmKeys) {
                try {
                    chrome.storage.local.remove(key);
                    // Also remove backup and page-specific values
                    for (let i = 0; i < 3; i++) {
                        chrome.storage.local.remove(`${key}_${i}`);
                        chrome.storage.local.remove(`${key}_${i}_backup`);
                    }
                    chrome.storage.local.remove(`${key}_backup`);
                } catch (e) {
                    console.error(`Failed to remove GM key: ${key}`, e);
                }
            }
        }

        // Reset all runtime variables to defaults
        groups = [];
        notepads = [];
        attackLists = [];
        todoLists = [];
        loanTracker = { entries: [] };
        auctionTracker = { auctions: [] };
        countdownGroups = [];
        manualCountdownGroups = [];
        isLightMode = false;
        currentPage = 0;

        // Refresh the sidebar
        refreshSidebar();

        showToast('All data has been completely reset', 'info');
    }
    function fixTrackers() {
        // Only fix auctionTracker if it exists in localStorage
        const savedAuctionTracker = localStorage.getItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`);
        if (savedAuctionTracker && savedAuctionTracker !== "null") {
            try {
                auctionTracker = JSON.parse(savedAuctionTracker);
                if (auctionTracker && auctionTracker.auctions) {
                    auctionTracker.auctions = auctionTracker.auctions.filter(auction => {
                        if (auction.timeLeft !== undefined && auction.endTime === undefined) {
                            auction.endTime = Date.now() + (auction.timeLeft * 60 * 1000);
                            auction.created = Date.now();
                            delete auction.timeLeft;
                        }
                        return auction.endTime > Date.now();
                    });
                    saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${currentPage}`, auctionTracker);
                }
            } catch (e) {
                console.error('Error processing auction tracker:', e);
            }
        }

        // Only fix loanTracker if it exists in localStorage
        const savedLoanTracker = localStorage.getItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`);
        if (savedLoanTracker && savedLoanTracker !== "null") {
            try {
                loanTracker = JSON.parse(savedLoanTracker);
                if (loanTracker && loanTracker.entries) {
                    loanTracker.entries.forEach(entry => {
                        if (!entry.payments) {
                            entry.payments = [];
                        }
                        if (typeof entry.amount !== 'number') {
                            entry.amount = parseFloat(entry.amount) || 0;
                        }
                        if (!entry.created) {
                            entry.created = Date.now();
                        }
                    });
                    saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${currentPage}`, loanTracker);
                }
            } catch (e) {
                console.error('Error processing loan tracker:', e);
            }
        }

        if (window.auctionCheckIntervalId) {
            clearInterval(window.auctionCheckIntervalId);
        }

        initializeAuctionUpdates();
        refreshSidebar();
    }

    function initialize() {
        initializeState();
        validateState();
        createSidebar();

        setInterval(checkTodoListResets, 1000); // Check every second for accurate resets

        todoLists.forEach((list, index) => {
            if (list.resetDaily) {
                setupDailyReset(index);
            }
        });

        window.addEventListener('resize', () => {
            preserveSidebarAnimation();
        });

        window.addEventListener('resize', () => {
            if (isAutoWidth || window.innerWidth < 768) {
                applySidebarWidth();
            }
        });

        // Check for any active auction timers
        initializeAuctionUpdates();

        addDebugManager();
    }

    initialize();
})();
