// १. स्प्ल्याश स्क्रिन हटाउने मुख्य फंक्सन
function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 700);
    }
}

// कुनै पनि हालतमा १ सेकेन्डभित्र स्प्ल्याश हट्नेछ
setTimeout(hideSplashScreen, 1000);

let storeData = JSON.parse(localStorage.getItem('shopProfile')) || {
    shopName: "NepalHub",
    ownerName: "Kamal G.C.",
    panNumber: "",
    phone: "",
    address: ""
};

let currentPage = localStorage.getItem('nepalhub_last_page') || 'home';

function getSafeStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) { me 
        return fallback;
    }
}

let sales = getSafeStorage('nepalhub_sales', []);
let inventory = getSafeStorage('nepalhub_inventory', []);
let customers = getSafeStorage('nepalhub_customers', []);

window.addEventListener('DOMContentLoaded', () => {
    hideSplashScreen();
    checkLoginState();
    switchPage(currentPage);
});

function checkLoginState() {
    const loggedUser = localStorage.getItem('logged_user');
    const authBox = document.getElementById('auth-container');
    const dashBox = document.getElementById('dashboard-container');

    if (loggedUser) {
        if (authBox) authBox.classList.add('hidden');
        if (dashBox) dashBox.classList.remove('hidden');
        storeData.ownerName = loggedUser;
    } else {
        if (authBox) authBox.classList.remove('hidden');
        if (dashBox) dashBox.classList.add('hidden');
    }
}

function showForm(formType) {
    document.getElementById('signup-box')?.classList.add('hidden');
    document.getElementById('login-box')?.classList.add('hidden');
    if (formType === 'signup') document.getElementById('signup-box')?.classList.remove('hidden');
    if (formType === 'login') document.getElementById('login-box')?.classList.remove('hidden');
}

document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    let users = getSafeStorage('users', []);
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('logged_user', name);
    checkLoginState();
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
        alert('गलत इमेल वा पासवर्ड!');
    }
});

function switchPage(page) {
    currentPage = page;
    renderApp();
}

function renderApp() {
    const container = document.getElementById('app-container');
    if (!container) return;

    if (currentPage === 'home') {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 text-white space-y-2">
                <h2 class="font-bold text-base">नमस्ते, ${storeData.ownerName}!</h2>
                <p class="text-xs text-slate-400">NepalHub - Complete Shop Management</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <button onclick="switchPage('pos')" class="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl text-cyan-400 font-bold text-xs">🛒 POS बिल</button>
                <button onclick="switchPage('inventory')" class="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl text-emerald-400 font-bold text-xs">📦 स्टक</button>
                <button onclick="switchPage('udharo')" class="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl text-amber-400 font-bold text-xs">👥 उधारो खाता</button>
                <button onclick="switchPage('settings')" class="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl text-purple-400 font-bold text-xs">⚙️ सेटिङ्ग</button>
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
    if (window.lucide) lucide.createIcons();
}
