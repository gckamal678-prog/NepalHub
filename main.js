// १. स्प्ल्याश स्क्रिन सुरक्षित रूपमा हटाउने फङ्क्सन
function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }
}

// २. सेफ डाटा लोड गर्ने सहयोगी फङ्क्सन
function getSafeStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

// ३. ग्लोबल स्टोर डाटा
let storeData = getSafeStorage('shopProfile', {
    shopName: "NepalHub",
    ownerName: "साहुजी",
    panNumber: "",
    phone: "",
    address: ""
});

let currentPage = localStorage.getItem('nepalhub_last_page') || 'home';

// ४. DOM लोड हुनासाथ स्प्ल्याश स्क्रिन हटाएर ड्यासबोर्ड देखाउने
window.addEventListener('DOMContentLoaded', () => {
    // १ सेकेन्डपछि स्प्ल्याश स्क्रिन आफै हट्नेछ
    setTimeout(hideSplashScreen, 800);
    switchPage(currentPage);
});

// ५. पेज स्विच गर्ने फङ्क्सन
function switchPage(page) {
    currentPage = page;
    localStorage.setItem('nepalhub_last_page', page);
    
    // Bottom Nav Active Highlight
    ['home', 'inventory', 'udharo', 'pos'].forEach(p => {
        const btn = document.getElementById(`nav-${p}`);
        if (btn) {
            if (p === page) {
                btn.className = "text-cyan-400 font-bold text-xs flex flex-col items-center justify-center gap-1";
            } else {
                btn.className = "text-slate-400 text-xs flex flex-col items-center justify-center gap-1";
            }
        }
    });

    renderApp();
}

// ६. मुख्य ड्यासबोर्ड रेन्डर गर्ने फङ्क्सन
function renderApp() {
    const container = document.getElementById('app-container');
    if (!container) return;

    if (currentPage === 'home') {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1 shadow-sm">
                <h2 class="font-bold text-base">नमस्ते, ${storeData.ownerName}!</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">NepalHub पसल व्यवस्थापन प्रणालीमा स्वागत छ।</p>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-4">
                <button onclick="switchPage('pos')" class="p-4 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl text-cyan-600 dark:text-cyan-400 font-bold text-xs text-left shadow-sm hover:border-cyan-500 transition-all">
                    <span class="text-lg block mb-1">🛒</span> POS बिलिङ
                </button>
                <button onclick="switchPage('inventory')" class="p-4 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-xs text-left shadow-sm hover:border-emerald-500 transition-all">
                    <span class="text-lg block mb-1">📦</span> स्टक सामान
                </button>
                <button onclick="switchPage('udharo')" class="p-4 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl text-amber-600 dark:text-amber-400 font-bold text-xs text-left shadow-sm hover:border-amber-500 transition-all">
                    <span class="text-lg block mb-1">👥</span> उधारो खाता
                </button>
                <button onclick="switchPage('settings')" class="p-4 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl text-purple-600 dark:text-purple-400 font-bold text-xs text-left shadow-sm hover:border-purple-500 transition-all">
                    <span class="text-lg block mb-1">⚙️</span> पसल सेटिङ्ग
                </button>
            </div>
        `;
    } else if (currentPage === 'inventory' && typeof renderInventoryHTML === 'function') {
        container.innerHTML = renderInventoryHTML();
    } else if (currentPage === 'pos' && typeof renderPOSHTML === 'function') {
        container.innerHTML = renderPOSHTML();
    } else if (currentPage === 'udharo' && typeof renderUdharoHTML === 'function') {
        container.innerHTML = renderUdharoHTML();
    } else if (currentPage === 'settings' && typeof renderSettingsHTML === 'function') {
        container.innerHTML = renderSettingsHTML();
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}
