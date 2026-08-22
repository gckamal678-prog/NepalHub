function renderSidebarHTML() {
    const profile = JSON.parse(localStorage.getItem('shopProfile')) || {
        shopName: "Koshar India Catering",
        ownerName: "Kamal G.C.",
        panNumber: "नभएको",
        phone: "9800000000",
        address: "नेपाल",
        bankDetails: "Nabil Bank - 0123456789",
        qrCodeUrl: ""
    };

    return `
        <div id="sidebar-drawer" class="fixed inset-0 z-50 flex justify-start bg-slate-950/60 backdrop-blur-sm hidden transition-all duration-300">
            <div class="bg-white dark:bg-[#0d1322] border-r border-slate-200 dark:border-slate-800 w-80 h-full flex flex-col shadow-2xl p-4 overflow-y-auto">
                
                <!-- Header -->
                <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                            ${profile.shopName.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-bold text-sm text-slate-900 dark:text-white">${profile.shopName}</h3>
                            <p class="text-[11px] text-cyan-600 dark:text-cyan-400">साहुजी: ${profile.ownerName}</p>
                        </div>
                    </div>
                    <button onclick="toggleSidebar()" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 transition">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Quick Navigation Links (थप गरिएको मेनु) -->
                <div class="py-3 border-b border-slate-200 dark:border-slate-800 space-y-1">
                    <div class="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider mb-1">मुख्य मेनु (Navigation)</div>
                    <button onclick="switchPage('home'); toggleSidebar();" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <i data-lucide="home" class="w-4 h-4 text-cyan-500"></i> गृहपृष्ठ (Dashboard)
                    </button>
                    <button onclick="switchPage('pos'); toggleSidebar();" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <i data-lucide="shopping-cart" class="w-4 h-4 text-cyan-500"></i> बिक्री बिल (POS)
                    </button>
                    <button onclick="switchPage('inventory'); toggleSidebar();" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <i data-lucide="package" class="w-4 h-4 text-cyan-500"></i> सामान सूची (Inventory)
                    </button>
                    <button onclick="switchPage('udharo'); toggleSidebar();" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <i data-lucide="book-user" class="w-4 h-4 text-amber-500"></i> उधारो खाता (Credit Book)
                    </button>
                </div>

                <!-- प्रोफाइल, पसल विवरण, बैंक र QR कोड खण्ड -->
                <div class="mt-3 space-y-3 flex-1">
                    <div class="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">पसलको जानकारी</div>
                    
                    <div class="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-1.5 text-xs">
                        <div class="font-bold text-cyan-500 mb-1 flex items-center gap-1.5"><i data-lucide="store" class="w-3.5 h-3.5"></i> पसल विवरण</div>
                        <div><span class="text-slate-400">PAN/VAT:</span> <span class="font-semibold text-slate-800 dark:text-white">${profile.panNumber || 'नभएको'}</span></div>
                        <div><span class="text-slate-400">फोन:</span> <span class="font-semibold text-slate-800 dark:text-white">${profile.phone || 'नभएको'}</span></div>
                        <div><span class="text-slate-400">ठेगाना:</span> <span class="font-semibold text-slate-800 dark:text-white">${profile.address || 'नभएको'}</span></div>
                    </div>

                    <div class="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-1.5 text-xs">
                        <div class="font-bold text-emerald-500 mb-1 flex items-center gap-1.5"><i data-lucide="landmark" class="w-3.5 h-3.5"></i> बैंक खाता</div>
                        <p class="text-slate-700 dark:text-slate-200 font-mono text-[11px]">${profile.bankDetails || 'विवरण छैन'}</p>
                    </div>

                    <div class="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center space-y-2">
                        <div class="font-bold text-amber-500 text-xs mb-1 flex items-center justify-center gap-1.5"><i data-lucide="qr-code" class="w-3.5 h-3.5"></i> भुक्तानी QR कोड</div>
                        <div class="w-32 h-32 mx-auto bg-white border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                            ${profile.qrCodeUrl ? `<img src="${profile.qrCodeUrl}" class="w-full h-full object-cover">` : '<span class="text-[10px] text-slate-400">QR राखिएको छैन</span>'}
                        </div>
                    </div>
                </div>

                <!-- Footer / Edit Button -->
                <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-center">
                    <button onclick="switchPage('settings'); toggleSidebar();" class="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i> प्रोफाइल सम्पादन गर्नुहोस्
                    </button>
                    <div class="text-[10px] text-slate-400">Version 1.0.0 • Business App</div>
                </div>
            </div>
        </div>
    `;
}

function toggleSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container.innerHTML.trim()) {
        container.innerHTML = renderSidebarHTML();
        if(window.lucide) lucide.createIcons();
    }
    const drawer = document.getElementById('sidebar-drawer');
    drawer.classList.toggle('hidden');
}
