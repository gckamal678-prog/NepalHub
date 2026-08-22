function renderInventoryHTML() {
    const searchQuery = window.inventorySearchQuery || '';
    const filtered = inventory.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || (i.barcode && i.barcode.includes(searchQuery)));

    return `
        <div class="space-y-3">
            <div class="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span class="text-xs text-slate-800 dark:text-slate-200 font-bold">स्टक सूची (Inventory)</span>
                <button onclick="addItem()" class="px-3 py-1 bg-cyan-600 text-white rounded-lg text-xs font-bold">+ सामान थप</button>
            </div>
            <div>
                <input type="text" placeholder="सामान वा बारकोड (Barcode) खोज्नुहोस्..." value="${searchQuery}" oninput="window.inventorySearchQuery=this.value; renderApp();" class="w-full bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
            </div>
            <div class="space-y-2">
                ${filtered.length === 0 ? '<p class="text-xs text-slate-500 text-center py-6">कुनै सामान फेला परेन।</p>' : filtered.map(i => `
                    <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center shadow-sm">
                        <div>
                            <div class="text-xs font-bold text-slate-900 dark:text-white">${i.name} <span class="text-[10px] text-slate-400 font-mono">(${i.barcode || 'No Barcode'})</span></div>
                            <div class="text-[11px] text-cyan-600 dark:text-cyan-400">खरिद: रू ${i.costPrice || 0} | बिक्री: रू ${i.price} | स्टक: ${i.stock} ${i.unit || 'पिस'}</div>
                            <div class="text-[10px] text-slate-400 mt-0.5">Supplier: ${i.supplier || 'N/A'} | Rack: ${i.rack || 'N/A'}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] px-2 py-0.5 rounded-full border ${i.stock <= 2 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}">${i.stock <= 2 ? 'कमी' : 'पर्याप्त'}</span>
                            <button onclick="deleteItem('${i.id}')" class="text-rose-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addItem() {
    const name = prompt('सामानको नाम लेख्नुहोस्:');
    if(!name) return;
    const barcode = prompt('बारकोड (Barcode नम्बर):') || '';
    const costPrice = parseFloat(prompt('खरिद मूल्य (Cost Price रू):')) || 0;
    const price = parseFloat(prompt('बिक्री मूल्य (Selling Price रू):')) || 0;
    const stock = parseFloat(prompt('मात्रा (Stock Qty):')) || 1;
    const unit = prompt('इकाई (उदा: पिस / बोरा / केजी / लिटर):') || 'पिस';
    const supplier = prompt('आपूर्तिकर्ता/साहु (Supplier/Vendor Name & Phone):') || '';
    const rack = prompt('र्याक वा स्थान नम्बर (Rack Location Number):') || '';

    inventory.unshift({ id: String(Date.now()), name, barcode, costPrice, price, stock, unit, supplier, rack });
    localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    showToast('सामान थपियो!');
    renderApp();
}

function deleteItem(id) {
    if(confirm('के तपाईं यो सामान मेटाउन चाहनुहुन्छ?')) {
        inventory = inventory.filter(i => i.id !== id);
        localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
        renderApp();
    }
}
