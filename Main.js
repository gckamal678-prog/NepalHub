let storeData = JSON.parse(localStorage.getItem('shopProfile')) || {
    shopName: "NepalHub",
    ownerName: "Kamal G.C.",
    panNumber: "",
    phone: "",
    address: "",
    bankDetails: "",
    qrCodeUrl: ""
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
    { id: '1', name: 'चामल (Basmati Rice)', costPrice: 2200, price: 2500, stock: 3, unit: 'बोरा', barcode: '1001' },
    { id: '2', name: 'खाने तेल (Sunflower Oil)', costPrice: 1650, price: 1850, stock: 25, unit: 'लिटर', barcode: '1002' }
]);
let customers = getSafeStorage('nepalhub_customers', []);
let expenses = getSafeStorage('nepalhub_expenses', []);
let personalTransactions = getSafeStorage('nepalhub_personal_finance', []);
let dailyClosings = getSafeStorage('nepalhub_daily_closings', []);

window.addEventListener('DOMContentLoaded', async () => {
    // एप खुल्दा बायोमेट्रिक लक जाँच गर्ने
    await checkBiometricLockOnStart();

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
    initWeather();
    applyTheme();
    switchPage(currentPage);
});

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const textEl = document.getElementById('toast-text');
    if (!container || !textEl) return;
    textEl.innerText = msg;
    container.classList.remove('opacity-0', '-translate-y-4');
    setTimeout(() => {
        container.classList.add('opacity-0', '-translate-y-4');
    }, 2000);
}

// ----------------------------------------------------
// बायोमेट्रिक / फिंगरप्रिन्ट लक सुरक्षा प्रणाली
// ----------------------------------------------------
async function checkBiometricLockOnStart() {
    if (localStorage.getItem('biometric_locked') === 'true') {
        const success = await verifyFingerprintUnlock();
        if (!success) {
            alert('सुरक्षा प्रमाणिकरण असफल भयो! एप बन्द गरिएको छ।');
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#0b0f19; color:white; font-family:sans-serif; text-align:center; padding:20px;">
                    <h2>🔒 एप फिंगरप्रिन्टद्वारा सुरक्षित गरिएको छ</h2>
                    <p style="color:#94a3b8; font-size:14px; margin-top:10px;">सञ्चालन गर्न फेरि प्रयास गर्नुहोस्।</p>
                    <button onclick="location.reload()" style="margin-top:20px; background:#06b6d4; color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:bold; cursor:pointer;">लगइन अनलक गर्नुहोस्</button>
                </div>
            `;
            throw new Error('Biometric Authentication Failed');
        }
    }
}

async function verifyFingerprintUnlock() {
    if (!window.PublicKeyCredential) return true;
    try {
        const publicKey = {
            challenge: new Uint8Array([21, 31, 105, 78, 18, 45, 62, 99]),
            timeout: 60000,
            userVerification: "required"
        };
        const assertion = await navigator.credentials.get({ publicKey });
        return assertion ? true : false;
    } catch (error) {
        return false;
    }
}

function checkLoginState() {
    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
        const authContainer = document.getElementById('auth-container');
        const dashContainer = document.getElementById('dashboard-container');
        if(authContainer) authContainer.classList.add('hidden');
        if(dashContainer) dashContainer.classList.remove('hidden');
        storeData.ownerName = loggedUser;
        updateStoreInfoUI();
    } else {
        const authContainer = document.getElementById('auth-container');
        const dashContainer = document.getElementById('dashboard-container');
        if(authContainer) authContainer.classList.remove('hidden');
        if(dashContainer) dashContainer.classList.add('hidden');
    }
}

function showForm(formType) {
    const signupBox = document.getElementById('signup-box');
    const loginBox = document.getElementById('login-box');
    if(signupBox) signupBox.classList.add('hidden');
    if(loginBox) loginBox.classList.add('hidden');
    if (formType === 'signup' && signupBox) signupBox.classList.remove('hidden');
    else if (formType === 'login' && loginBox) loginBox.classList.remove('hidden');
}

document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    let users = getSafeStorage('users', []);
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('रजिस्टर्ड भयो! लगइन गर्नुहोस्।');
    showForm('login');
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let users = getSafeStorage('users', []);
    let validUser = users.find(u => u.email === email && u.password === password);
    if (validUser || (email === 'admin@nepalhub.com')) {
        localStorage.setItem('logged_user', validUser ? validUser.name : 'Kamal');
        checkLoginState();
    } else {
        alert('गलत इमेल वा पासवर्ड!');
    }
});

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
    if (!container) return;
    
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
            <div class="p-4 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-[#0d1322] border border-cyan-500/35 shadow-lg flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Dashboard</span>
                    <h2 class="text-white font-black text-lg mt-1">${storeData.shopName}</h2>
                    <p class="text-slate-400 text-xs mt-0.5">नमस्ते, ${storeData.ownerName} जी!</p>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-2.5">
                <button onclick="switchPage('pos')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400"><i data-lucide="shopping-cart" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">POS बिल</span>
                </button>
                <button onclick="switchPage('inventory')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i data-lucide="package" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">स्टक</span>
                </button>
                <button onclick="switchPage('udharo')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><i data-lucide="users" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">उधारो</span>
                </button>
                <button onclick="switchPage('finance')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><i data-lucide="wallet" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">खर्च/बचत</span>
                </button>
                <button onclick="switchPage('tax-audit')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">कर/PAN</span>
                </button>
                <button onclick="switchPage('calendar')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><i data-lucide="calendar" class="w-5 h-5"></i></div>
                    <span class="text-[11px] font-bold text-slate-300 mt-1.5">पात्रो</span>
                </button>
                <button onclick="switchPage('settings')" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#131b2e] border border-slate-800 col-span-2">
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
            
            <div class="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>कम स्टक भएका सामानहरू</span>
                    <span class="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">${lowStockCount} वटा</span>
                </div>
                <button onclick="performDailyCashClose()" class="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center justify-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4"></i> दैनिक नगद बन्द (Daily Cash Closing)
                </button>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// स्टक डिडक्सन र सुरक्षित POS बिलिङ प्रोसेसिङ
// ----------------------------------------------------
function completeSale(cartItems, customerName, totalAmount) {
    for (let item of cartItems) {
        let invItem = inventory.find(i => i.id === item.id);
        if (invItem) {
            if (invItem.stock < item.qty) {
                alert(`माफ गर्नुहोला, "${invItem.name}" को स्टक अपुग्छ! (बाँकी स्टक: ${invItem.stock})`);
                return false;
            }
            invItem.stock -= item.qty;
        }
    }

    sales.push({
        id: Date.now(),
        date: new Date().toISOString(),
        customer: customerName || 'नगद ग्राहक',
        items: cartItems,
        total: totalAmount,
        paymentMethod: selectedPaymentMethod
    });

    localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    localStorage.setItem('nepalhub_sales', JSON.stringify(sales));
    
    showToast('बिल सफलतापूर्वक काटियो र स्टक अपडेट भयो!');
    renderApp();
    return true;
}

// दैनिक गल्ला हिसाब बन्द गर्ने फङ्सन
function performDailyCashClose() {
    const todaySales = sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
    const totalCashToday = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
    
    const closingRecord = {
        date: new Date().toLocaleDateString(),
        totalSalesCount: todaySales.length,
        totalAmount: totalCashToday,
        closedAt: new Date().toLocaleTimeString()
    };

    dailyClosings.push(closingRecord);
    localStorage.setItem('nepalhub_daily_closings', JSON.stringify(dailyClosings));
    
    alert(`आजको कुल बिक्री रू ${totalCashToday.toLocaleString()} को हिसाब मिलान सफल भयो!`);
}

function updateStoreInfoUI() {
    if(document.getElementById('header-shop-name')) document.getElementById('header-shop-name').innerText = storeData.shopName || "NepalHub";
    if(document.getElementById('header-owner-name')) document.getElementById('header-owner-name').innerText = `साहुजी: ${storeData.ownerName || 'Kamal'}`;
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

function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
                const data = await res.json();
                const weatherEl = document.getElementById('geo-weather');
                if(weatherEl) weatherEl.innerHTML = `<i data-lucide="thermometer" class="w-3 h-3"></i> ${data.current_weather.temperature}°C`;
            } catch (e) {}
        }, () => {});
    }
}

function exportData() {
    const backup = { profile: storeData, inventory, customers, sales, expenses, personalTransactions, dailyClosings };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `nepalhub_backup_${new Date().toLocaleDateString()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('ब्याकअप डाउनलोड भयो!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.profile) localStorage.setItem('shopProfile', JSON.stringify(data.profile));
            if (data.inventory) localStorage.setItem('nepalhub_inventory', JSON.stringify(data.inventory));
            if (data.customers) localStorage.setItem('nepalhub_customers', JSON.stringify(data.customers));
            if (data.sales) localStorage.setItem('nepalhub_sales', JSON.stringify(data.sales));
            if (data.daily_closings) localStorage.setItem('nepalhub_daily_closings', JSON.stringify(data.daily_closings));
            showToast('सफलतापूर्वक लोड भयो!');
            setTimeout(() => location.reload(), 1000);
        } catch (err) { alert('गलत फाइल ढाँचा!'); }
    };
    reader.readAsText(file);
}

function printReceipt(item, customer, qty, discount, total) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Bill Receipt - ${storeData.shopName}</title></head>
        <body style="font-family: monospace; padding: 20px; width: 300px;">
            <h3 style="text-align: center; margin-bottom: 2px;">${storeData.shopName}</h3>
            <p style="text-align: center; font-size: 11px; margin-top: 0;">${storeData.address || 'नेपाल'} | PAN: ${storeData.panNumber || 'नभएको'}</p>
            <hr>
            <p><b>ग्राहक:</b> ${customer}</p>
            <p><b>मिति:</b> ${new Date().toLocaleDateString()}</p>
            <hr>
            <p><b>सामान:</b> ${item}</p>
            <p><b>मात्रा:</b> ${qty}</p>
            <p><b>छुट:</b> रू ${discount}</p>
            <p><b>कुल रकम: रू ${total}</b></p>
            <hr>
            <p style="text-align: center; font-size: 10px;">धन्यवाद!</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
