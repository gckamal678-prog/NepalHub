function renderSettingsHTML() {
    const isBiometricEnabled = localStorage.getItem('biometric_locked') === 'true';

    return `
        <div class="space-y-4 pb-6">
            <!-- पसल प्रोफाइल तथा बैंक/QR सेटअप -->
            <form onsubmit="saveShopProfile(event)" class="space-y-3">
                <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                    <h3 class="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                        <i data-lucide="store" class="w-4 h-4"></i> पसल प्रोफाइल तथा बैंक/QR सेटअप
                    </h3>
                    <div class="space-y-2.5">
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">पसलको नाम (Shop Name)</label>
                            <input type="text" id="shopName" required class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">साहुजीको नाम (Owner Name)</label>
                            <input type="text" id="ownerName" class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">PAN / VAT नम्बर</label>
                            <input type="text" id="panNumber" class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">सम्पर्क फोन नम्बर</label>
                            <input type="text" id="phone" class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">ठेगाना</label>
                            <input type="text" id="address" class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">बैंक विवरण (Bank Details)</label>
                            <input type="text" id="bankDetails" placeholder="बैंक नाम र खाता नम्बर" class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <div>
                            <label class="text-[11px] text-slate-500 dark:text-slate-400">भुक्तानी QR कोड इमेज लिङ्क (QR Image URL)</label>
                            <input type="text" id="qrCodeUrl" placeholder="https://..." class="w-full bg-slate-50 border border-slate-300 dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl dark:border-slate-700 text-slate-900 dark:text-white mt-1">
                        </div>
                        <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs mt-2 transition shadow-md">
                            प्रोफाइल सुरक्षित गर्नुहोस्
                        </button>
                    </div>
                </div>
            </form>

            <!-- एप थिम कन्ट्रोल (Theme Switcher) -->
            <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                <h3 class="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <i data-lucide="moon" class="w-4 h-4"></i> एप थिम (Theme Mode)
                </h3>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="setAppTheme('light')" class="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center gap-2">
                        <i data-lucide="sun" class="w-4 h-4 text-amber-500"></i> लाइट मोड
                    </button>
                    <button onclick="setAppTheme('dark')" class="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs border border-slate-800 transition flex items-center justify-center gap-2">
                        <i data-lucide="moon" class="w-4 h-4 text-cyan-400"></i> डार्क मोड
                    </button>
                </div>
            </div>

            <!-- बायोमेट्रिक / फिंगरप्रिन्ट सुरक्षा -->
            <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                <h3 class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <i data-lucide="lock" class="w-4 h-4"></i> फिंगरप्रिन्ट / बायोमेट्रिक लक
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">तपाईंको फोन वा ल्यापटपको फिंगरप्रिन्ट प्रयोग गरेर पसलको हिसाब सुरक्षित गर्नुहोस्।</p>
                <div class="flex gap-2">
                    <button onclick="setupFingerprintLock()" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                        <i data-lucide="shield-check" class="w-4 h-4"></i> ${isBiometricEnabled ? 'लक अपडेट गर्नुहोस्' : 'लक अन गर्नुहोस्'}
                    </button>
                    ${isBiometricEnabled ? `
                        <button onclick="removeFingerprintLock()" class="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-xl text-xs transition border border-rose-500/30">
                            बन्द
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- डाटा ब्याकअप र सुरक्षा (Backup & Restore) -->
            <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                <h3 class="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <i data-lucide="database" class="w-4 h-4"></i> डाटा ब्याकअप र सुरक्षा (Backup & Restore)
                </h3>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="exportData()" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> ब्याकअप (JSON)
                    </button>
                    <label class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-center cursor-pointer transition flex items-center justify-center gap-1.5">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i> लोड गर्नुहोस् 
                        <input type="file" onchange="importData(event)" class="hidden" accept=".json">
                    </label>
                </div>
            </div>

            <!-- फ्याक्ट्री रिसेट (Factory Reset / Clear All Data) -->
            <div class="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-4 space-y-3 shadow-xl">
                <h3 class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <i data-lucide="alert-triangle" class="w-4 h-4"></i> खतरा जोन (Factory Reset)
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">यो बटनले सबै पुराना वा टेस्ट डेटा सधैंको लागि मेटाएर एपलाई नयाँ जस्तै बनाउँछ।</p>
                <button onclick="factoryResetApp()" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                    <i data-lucide="trash-2" class="w-4 h-4"></i> सबै डेटा खाली गर्नुहोस् (Reset All)
                </button>
            </div>
        </div>
    `;
}

// पसल प्रोफाइल सेभ गर्ने फङ्सन
function saveShopProfile(event) {
    event.preventDefault();
    const profileData = {
        shopName: document.getElementById('shopName').value,
        ownerName: document.getElementById('ownerName').value,
        panNumber: document.getElementById('panNumber').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        bankDetails: document.getElementById('bankDetails').value,
        qrCodeUrl: document.getElementById('qrCodeUrl').value
    };
    localStorage.setItem('shopProfile', JSON.stringify(profileData));
    if (typeof showToast === 'function') showToast('प्रोफाइल विवरण सेभ भयो!');
    renderApp();
}

// प्रोफाइल डेटा फर्ममा लोड गर्ने
function loadShopProfile() {
    const profile = JSON.parse(localStorage.getItem('shopProfile')) || {};
    if(document.getElementById('shopName')) {
        document.getElementById('shopName').value = profile.shopName || '';
        document.getElementById('ownerName').value = profile.ownerName || '';
        document.getElementById('panNumber').value = profile.panNumber || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('address').value = profile.address || '';
        if(document.getElementById('bankDetails')) document.getElementById('bankDetails').value = profile.bankDetails || '';
        if(document.getElementById('qrCodeUrl')) document.getElementById('qrCodeUrl').value = profile.qrCodeUrl || '';
    }
}

// थिम परिवर्तन गर्ने फङ्सन
function setAppTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('nepalhub_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('nepalhub_theme', 'light');
    }
    if (typeof showToast === 'function') showToast(`थिम ${theme === 'dark' ? 'डार्क' : 'लाइट'} बनाइयो!`);
}

// फिंगरप्रिन्ट / बायोमेट्रिक लक सेट गर्ने
async function setupFingerprintLock() {
    if (!window.PublicKeyCredential) {
        alert('तपाईंको ब्राउजर वा डिभाइसले बायोमेट्रिक लक सपोर्ट गर्दैन!');
        return;
    }

    try {
        const publicKey = {
            challenge: new Uint8Array([21, 31, 105, 78, 18, 45, 62, 99]),
            rp: { name: "NepalHub Business App" },
            user: {
                id: new Uint8Array([1]),
                name: "owner@nepalhub",
                displayName: "Shop Owner"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            timeout: 60000,
            attestation: "direct"
        };

        const credential = await navigator.credentials.create({ publicKey });
        
        if (credential) {
            localStorage.setItem('biometric_locked', 'true');
            if (typeof showToast === 'function') showToast('फिंगरप्रिन्ट लक सफलतापूर्वक सेभ भयो!');
            renderApp();
        }
    } catch (error) {
        console.error(error);
        alert('फिंगरप्रिन्ट प्रमाणित गर्न सकिएन वा रद्द गरियो।');
    }
}

// फिंगरप्रिन्ट लक हटाउने
function removeFingerprintLock() {
    if (confirm('के तपाईं फिंगरप्रिन्ट लक बन्द गर्न चाहनुहुन्छ?')) {
        localStorage.removeItem('biometric_locked');
        if (typeof showToast === 'function') showToast('फिंगरप्रिन्ट लक हटाइयो!');
        renderApp();
    }
}

// फ्याक्ट्री रिसेट फङ्सन
function factoryResetApp() {
    if (confirm('चेतावनी: के तपाईं सबै रेकर्ड, स्टक, बिक्री र उधारो खाता स्थायी रूपमा मेटाउन चाहनुहुन्छ? यो कार्य फिर्ता गर्न सकिंदैन!')) {
        localStorage.clear();
        if (typeof showToast === 'function') showToast('सबै डेटा सफलतापूर्वक खाली गरियो!');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}
