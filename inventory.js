function renderInventoryHTML() {
    const searchQuery = window.inventorySearchQuery || '';
    const filtered = inventory.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (i.barcode && i.barcode.includes(searchQuery))
    );

    // कुल स्टकको लगानी (Total Cost Value) हिसाब गर्ने
    const totalInventoryValue = inventory.reduce((sum, i) => sum + ((i.costPrice || 0) * (i.stock || 0)), 0);

    return `
        <div class="space-y-4">
            <!-- कुल स्टक समरी कार्ड -->
            <div class="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div>
                    <div class="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">कुल स्टक लगानी मूल्य</div>
                    <div class="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">रू ${totalInventoryValue.toLocaleString()}</div>
                </div>
                <div class="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <i data-lucide="package" class="w-5 h-5"></i>
                </div>
            </div>

            <!-- हेडर र थप्ने बटन -->
            <div class="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span class="text-xs text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
                    <i data-lucide="boxes" class="w-4 h-4 text-cyan-500"></i> स्टक सूची (Inventory)
                </span>
                <button onclick="addItem()" class="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> सामान थप
                </button>
            </div>

            <!-- खोज्ने बक्स (Search Input) -->
            <div>
                <input type="text" placeholder="सामानको नाम वा बारकोड (Barcode) खोज्नुहोस्..." value="${searchQuery}" oninput="window.inventorySearchQuery=this.value; renderApp();" class="w-full bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white shadow-inner">
            </div>

            <!-- सामानहरूको सूची -->
            <div class="space-y-2.5">
                ${filtered.length === 0 ? `
                    <div class="text-center py-12 bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800">
                        <i data-lucide="search-x" class="w-8 h-8 text-slate-400 mx-auto mb-2"></i>
                        <p class="text-xs text-slate-500 dark:text-slate-400">कुनै पनि सामान फेला परेन।</p>
                    </div>
                ` : filtered.map(i => `
                    <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex justify-between items-center shadow-sm hover:border-cyan-500/40 transition">
                        <div class="space-y-1">
                            <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                ${i.name} 
                                <span class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">(${i.barcode || 'बारकोड नभएको'})</span>
                            </div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3">
                                <span>खरिद: <b class="text-slate-700 dark:text-slate-300">रू ${i.costPrice || 0}</b></span>
                                <span>बिक्री: <b class="text-cyan-600 dark:text-cyan-400">रू ${i.price}</b></span>
                                <span>स्टक: <b class="${i.stock <= 2 ? 'text-rose-500' : 'text-emerald-500'}">${i.stock} ${i.unit || 'पिस'}</b></span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] px-2 py-1 rounded-xl font-bold border ${i.stock <= 2 ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}">
                                ${i.stock <= 2 ? 'कमी' : 'पर्याप्त'}
                            </span>
                            <button onclick="editItem('${i.id}')" title="सम्पादन गर्ने" class="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteItem('${i.id}')" title="मेटाउने" class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addItem() {
    const name = prompt('सामानको नाम लेख्नुहोस्:');
    if(!name || !name.trim()) return;
    const barcode = prompt('बारकोड (Barcode नम्बर):') || '';
    const costPrice = parseFloat(prompt('खरिद मूल्य (Cost Price रू):')) || 0;
    const price = parseFloat(prompt('बिक्री मूल्य (Selling Price रू):')) || 0;
    const stock = parseFloat(prompt('मात्रा (Stock Qty):')) || 1;
    const unit = prompt('इकाई (उदा: पिस / बोरा / केजी / लिटर):') || 'पिस';

    inventory.unshift({ 
        id: String(Date.now()), 
        name: name.trim(), 
        barcode: barcode.trim(), 
        costPrice: costPrice >= 0 ? costPrice : 0, 
        price: price >= 0 ? price : 0, 
        stock: stock >= 0 ? stock : 0, 
        unit: unit.trim() 
    });

    localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    if (typeof showToast === 'function') showToast('नयाँ सामान सफलतापूर्वक थपियो!');
    renderApp();
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const name = prompt('सामानको नाम:', item.name);
    if (name === null) return;
    const barcode = prompt('बारकोड:', item.barcode || '') || '';
    const costPrice = parseFloat(prompt('खरिद मूल्य (रू):', item.costPrice || 0));
    const price = parseFloat(prompt('बिक्री मूल्य (रू):', item.price));
    const stock = parseFloat(prompt('स्टक मात्रा:', item.stock));
    const unit = prompt('इकाई (पिस/केजी आदि):', item.unit || 'पिस');

    item.name = name.trim() || item.name;
    item.barcode = barcode.trim();
    item.costPrice = !isNaN(costPrice) ? costPrice : item.costPrice;
    item.price = !isNaN(price) ? price : item.price;
    item.stock = !isNaN(stock) ? stock : item.stock;
    item.unit = unit.trim() || item.unit;

    localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    if (typeof showToast === 'function') showToast('सामानको विवरण अपडेट भयो!');
    renderApp();
}

function deleteItem(id) {
    if(confirm('के तपाईं यो सामान स्थायी रूपमा मेटाउन चाहनुहुन्छ?')) {
        inventory = inventory.filter(i => i.id !== id);
        localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
        if (typeof showToast === 'function') showToast('सामान मेटाइयो!');
        renderApp();
    }
}
