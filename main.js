let storeData = JSON.parse(localStorage.getItem('shopProfile')) || {
    shopName: "NepalHub",
    ownerName: "Kamal G.C.",
    panNumber: "",
    phone: "",
    address: "",
    footerNote: "बिक्री भएका सामानहरू फिर्ता हुँदैनन्। धन्यवाद!"
};

let currentTheme = localStorage.getItem('nepalhub_theme') || 'dark';
let currentPage = localStorage.getItem('nepalhub_last_page') || 'home';
let selectedPaymentMethod = 'cash';
let currentTaxMode = 'PAN';
let personalFinanceType = 'income';

function getSafeStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

let sales = getSafeStorage('nepalhub_sales', []);
let inventory = getSafeStorage('nepalhub_inventory', [
    { id: '1', name: 'चामल (Basmati Rice)', costPrice: 2200, price: 2500, stock: 3, unit: 'बोरा', barcode: '1001', supplier: 'Himalayan Wholesale (9800000000)', rack: 'Rack-A1' },
    { id: '2', name: 'खाने तेल (Sunflower Oil)', costPrice: 1650, price: 1850, stock: 25, unit: 'लिटर', barcode: '1002', supplier: 'Nepal Oil Ltd (9811111111)', rack: 'Rack-B2' }
]);
let customers = getSafeStorage('nepalhub_customers', []);
let expenses = getSafeStorage('nepalhub_expenses', []);
let personalTransactions = getSafeStorage('nepalhub_personal_finance', []);

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }
    }, 800);

    loadShopProfile();
    updateStoreInfoUI();
    checkLoginState();
    initLiveDateTime();
    initGeolocationAndWeather();
    applyTheme();
    switchPage(currentPage);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
});

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const textEl = document.getElementById('toast-text');
    textEl.innerText = msg;
    container.classList.remove('opacity-0', '-translate-y-4');
    setTimeout(() => {
        container.classList.add('opacity-0', '-translate-y-4');
    }, 2000);
}

function checkLoginState() {
    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        storeData.ownerName = loggedUser;
        updateStoreInfoUI();
    } else {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');
    }
}

function showForm(formType) {
    document.getElementById('signup-box').classList.add('hidden');
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('forgot-box').classList.add('hidden');
    document.getElementById('auth-message').innerText = '';

    if (formType === 'signup') document.getElementById('signup-box').classList.remove('hidden');
    else if (formType === 'login') document.getElementById('login-box').classList.remove('hidden');
    else if (formType === 'forgot') document.getElementById('forgot-box').classList.remove('hidden');
}

document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    let users = getSafeStorage('users', []);
    if (users.find(u => u.email === email)) {
        setAuthMessage('इमेल पहिले नै रजिस्टर्ड छ!', 'text-rose-500');
        return;
    }
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setAuthMessage('सफलतापूर्वक रजिस्टर्ड भयो! अब लगइन गर्नुहोस्।', 'text-emerald-500');
    setTimeout(() => showForm('login'), 1500);
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let users = getSafeStorage('users', []);
    let validUser = users.find(u => u.email === email && u.password === password);

    if (validUser) {
        localStorage.setItem('logged_user', validUser.name);
        checkLoginState();
    } else {
        setAuthMessage('गलत इमेल वा पासवर्ड!', 'text-rose-500');
    }
});

document.getElementById('forgot-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const newPassword = document.getElementById('forgot-new-password').value;

    let users = getSafeStorage('users', []);
    let index = users.findIndex(u => u.email === email);

    if (index !== -1) {
        users[index].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        setAuthMessage('पासवर्ड सफलतापूर्वक परिवर्तन भयो!', 'text-emerald-500');
        setTimeout(() => showForm('login'), 1500);
    } else {
        setAuthMessage('इमेल भेट्टाएन!', 'text-rose-500');
    }
});

function setAuthMessage(text, className) {
    const msg = document.getElementById('auth-message');
    msg.className = `text-center text-xs mt-3 font-medium ${className}`;
    msg.innerText = text;
}

function switchPage(page) {
    currentPage = page;
    localStorage.setItem('nepalhub_last_page', page);
    ['home', 'pos', 'inventory', 'udharo'].forEach(p => {
        const btn = document.getElementById(`nav-${p}`);
        if (btn) {
            btn.className = p === page 
                ? "flex flex-col items-center justify-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold"
                : "flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400";
        }
    });
    renderApp();
}

function renderApp() {
    const container = document.getElementById('app-container');
    if (currentPage === 'home') container.innerHTML = renderHomeHTML();
    else if (currentPage === 'pos') container.innerHTML = renderPOSHTML();
    else if (currentPage === 'inventory') container.innerHTML = renderInventoryHTML();
    else if (currentPage === 'udharo') container.innerHTML = renderUdharoHTML();
    else if (currentPage === 'tax-audit') container.innerHTML = renderTaxAuditHTML();
    else if (currentPage === 'finance') container.innerHTML = renderFinanceHTML();
    else if (currentPage === 'calendar') container.innerHTML = renderCalendarHTML();
    else if (currentPage === 'settings') {
        container.innerHTML = renderSettingsHTML();
        setTimeout(loadShopProfile, 50);
    }
    if(window.lucide) lucide.createIcons();
}

function renderHomeHTML() {
    const totalRev = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalUdharo = customers.reduce((sum, c) => sum + (c.amount || 0), 0);
    const lowStockCount = inventory.filter(i => i.stock <= 2).length;

    return `
        <div class="space-y-3.5 animate-fadeIn">
            <div class="p-4 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-[#0d1322] border border-cyan-500/30 shadow-lg flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Dashboard</span>
                    <h2 class="text-white font-black text-lg mt-1">${storeData.shopName}</h2>
                    <p class="text-slate-400 text-xs mt-0.5">नमस्ते, ${storeData.ownerName} जी!</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
                    ${storeData.shopName ? storeData.shopName.charAt(0) : 'N'}
                </div>
            </div>

            <div class="grid grid-cols-4 gap-2.5">
                <button onclick="switchPage('pos')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400"><i data-lucide="shopping-cart" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">POS बिल</span>
                </button>
                <button onclick="switchPage('inventory')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i data-lucide="package" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">स्टक</span>
                </button>
                <button onclick="switchPage('udharo')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><i data-lucide="users" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">उधारो</span>
                </button>
                <button onclick="switchPage('finance')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><i data-lucide="wallet" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">खर्च/बचत</span>
                </button>
                <button onclick="switchPage('tax-audit')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">कर/PAN</span>
                </button>
                <button onclick="switchPage('calendar')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><i data-lucide="calendar" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">पात्रो</span>
                </button>
                <button onclick="switchPage('settings')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-cyan-500/40 transition col-span-2">
                    <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><i data-lucide="settings" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">सेटिङ्ग तथा प्रोफाइल</span>
                </button>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div class="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="text-slate-400 text-xs">आजको कुल बिक्री</div>
                    <div class="text-white font-black text-lg mt-2">रू ${totalRev.toLocaleString()}</div>
                </div>
                <div class="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="text-slate-400 text-xs">उधारो लिन बाँकी</div>
                    <div class="text-amber-400 font-black text-lg mt-2">रू ${totalUdharo.toLocaleString()}</div>
                </div>
            </div>

            <div class="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="toggleCalculator(true)" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center justify-center gap-2">
                        <i data-lucide="calculator" class="w-4 h-4"></i> क्याल्कुलेटर
                    </button>
                    <button onclick="toggleNotifications()" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 flex items-center justify-center gap-2">
                        <i data-lucide="bell" class="w-4 h-4"></i> कम स्टक (${lowStockCount})
                    </button>
                </div>
            </div>

            <div class="text-center pt-2 pb-1 space-y-1">
                <p class="text-[11px] text-slate-400">Policy & Feedback: <a href="mailto:support@kamalgc.com.np" class="text-cyan-400 underline">support@kamalgc.com.np</a></p>
                <p class="text-[10px] text-slate-500">©️ 2026 NepalHub. All Rights Reserved.</p>
            </div>
        </div>
    `;
}

function renderCalendarHTML() {
    return `
        <div class="space-y-4">
            <div class="bg-[#111827] border border-slate-800 rounded-2xl p-3 space-y-2 text-center">
                <h3 class="text-white font-bold text-sm">नेपाली पात्रो र चाडपर्वहरू</h3>
                <div class="bg-white rounded-xl overflow-hidden mt-2 border border-slate-800 w-full flex justify-center">
                    <iframe src="https://www.hamropatro.com/widgets/calender-full.php" style="width: 100%; max-width: 350px; height: 480px; border: none;" scrolling="no"></iframe>
                </div>
            </div>
        </div>
    `;
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nepalhub_theme', currentTheme);
    applyTheme();
}

function applyTheme() {
    const html = document.documentElement;
    if (currentTheme === 'light') html.classList.remove('dark');
    else html.classList.add('dark');
    if(window.lucide) lucide.createIcons();
}

function makeCall() {
    alert("सम्पर्क सेवा चालू छ...");
}

function initLiveDateTime() {
    setInterval(() => {
        const now = new Date();
        let h = now.getHours(), m = now.getMinutes().toString().padStart(2, '0');
        let ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const timeEl = document.getElementById('live-time');
        if (timeEl) timeEl.innerText = `🕒 ${h}:${m} ${ampm}`;

        try {
            const nepaliDate = new NepaliDate(now);
            const monthsNepali = ["बैशाख", "जेठ", "आषाढ", "श्रावण", "भाद्र", "आश्विन", "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"];
            const y = nepaliDate.getYear();
            const mName = monthsNepali[nepaliDate.getMonth()];
            const d = nepaliDate.getDate();
            const dateEl = document.getElementById('live-nepali-date');
            if (dateEl) dateEl.innerText = `📅 ${y} ${mName} ${d}`;
        } catch (e) {}
    }, 1000);
}

function initGeolocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
                const data = await res.json();
                document.getElementById('geo-weather').innerHTML = `<i data-lucide="thermometer" class="w-3 h-3"></i> ${data.current_weather.temperature}°C`;
            } catch (e) {}
        }, () => {});
    }
}
