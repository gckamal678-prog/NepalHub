let selectedPaymentMethod = 'cash';

function renderPOSHTML() {
    return `
        <div class="space-y-4">
            <div class="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="shopping-cart" class="w-4 h-4 text-cyan-600"></i> बिक्री बिल (POS)
                </h3>
                
                <div class="space-y-2">
                    <!-- सामान छान्ने ड्रपडाउन -->
                    <label class="text-[11px] text-slate-500 font-medium">सामान छान्नुहोस्</label>
                    <select id="pos-item-select" onchange="fillPOSItem(this.value)" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
                        <option value="">-- सामान छान्नुहोस् --</option>
                        ${inventory.map(i => `<option value="${i.name}">${i.name} (स्टक: ${i.stock}) - मूल्य: रू ${i.price}</option>`).join('')}
                    </select>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input id="pos-customer" placeholder="ग्राहकको नाम (Customer Name)" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
                        <input id="pos-item" placeholder="सामानको नाम" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white" readonly>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <div>
                            <label class="text-[10px] text-slate-400">मात्रा (Qty)</label>
                            <input id="pos-qty" type="number" value="1" min="1" oninput="calculatePOSTotal()" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-400">छुट (Discount)</label>
                            <input id="pos-discount" type="number" value="0" min="0" oninput="calculatePOSTotal()" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-400">खुद कुल रकम (रू)</label>
                            <input id="pos-amount" type="number" placeholder="0" class="w-full bg-slate-100 border border-slate-300 dark:bg-slate-950 dark:border-slate-800 rounded-xl p-2.5 text-xs text-cyan-600 dark:text-cyan-400 font-extrabold" readonly>
                        </div>
                    </div>
                </div>

                <!-- भुक्तानीका तरिकाहरू -->
                <div class="space-y-1">
                    <label class="text-[11px] text-slate-500 font-medium">भुक्तानीको माध्यम</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button type="button" onclick="setPayment('cash')" id="btn-cash" class="py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md transition-all">नगद (Cash)</button>
                        <button type="button" onclick="setPayment('qr')" id="btn-qr" class="py-2.5 rounded-xl bg-slate-200 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 font-bold text-xs transition-all">QR</button>
                        <button type="button" onclick="setPayment('udharo')" id="btn-udharo" class="py-2.5 rounded-xl bg-slate-200 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 font-bold text-xs transition-all">उधारो (Credit)</button>
                    </div>
                </div>

                <button onclick="completeSale()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4"></i> बिक्री सेभ गर्नुहोस् र बिल प्रिन्ट गर्नुहोस्
                </button>
            </div>
        </div>
    `;
}

function fillPOSItem(name) {
    const found = inventory.find(i => i.name === name);
    if(found) {
        document.getElementById('pos-item').value = found.name;
        calculatePOSTotal();
    }
}

function calculatePOSTotal() {
    const itemSelect = document.getElementById('pos-item-select').value;
    const found = inventory.find(i => i.name === itemSelect);
    if(found) {
        const qty = parseFloat(document.getElementById('pos-qty').value) || 1;
        const discount = parseFloat(document.getElementById('pos-discount').value) || 0;
        
        let subtotal = found.price * qty;
        let total = subtotal - discount;
        
        document.getElementById('pos-amount').value = total >= 0 ? total : 0;
    }
}

function setPayment(method) {
    selectedPaymentMethod = method;
    ['cash', 'qr', 'udharo'].forEach(m => {
        const btn = document.getElementById(`btn-${m}`);
        if (btn) {
            btn.className = m === method 
                ? "py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md transition-all" 
                : "py-2.5 rounded-xl bg-slate-200 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 font-bold text-xs transition-all";
        }
    });
}

function completeSale() {
    const itemName = document.getElementById('pos-item').value;
    const custName = document.getElementById('pos-customer').value.trim() || 'नगद ग्राहक';
    const qty = parseFloat(document.getElementById('pos-qty').value) || 1;
    const discount = parseFloat(document.getElementById('pos-discount').value) || 0;
    const total = parseFloat(document.getElementById('pos-amount').value);

    if(!itemName || isNaN(total) || total < 0) {
        showToast('कृपया सही विवरण र सामान छान्नुहोस्!');
        return;
    }

    // स्टक पर्याप्त छ कि छैन जाँच गर्ने
    const itemIndex = inventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (itemIndex !== -1) {
        if (inventory[itemIndex].stock < qty) {
            showToast(`त्रुटि: स्टकमा केवल ${inventory[itemIndex].stock} पिस मात्र उपलब्ध छ!`);
            return;
        }
        inventory[itemIndex].stock = Math.max(0, inventory[itemIndex].stock - qty);
        localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    }

    if (selectedPaymentMethod === 'udharo') {
        if (typeof customers !== 'undefined') {
            customers.unshift({ id: String(Date.now()), name: custName, phone: '9800000000', amount: total });
            localStorage.setItem('nepalhub_customers', JSON.stringify(customers));
        }
    }

    if (typeof sales !== 'undefined') {
        sales.push({ item: itemName, customer: custName, qty, discount, total, payment_method: selectedPaymentMethod, created_at: new Date().toLocaleDateString() });
        localStorage.setItem('nepalhub_sales', JSON.stringify(sales));
    }
    
    showToast('बिक्री सफल र स्टक अपडेट भयो!');
    
    if(confirm('के तपाईं यो बिक्रीको बिल प्रिन्ट गर्न चाहनुहुन्छ?')) {
        if (typeof printReceipt === 'function') {
            printReceipt(itemName, custName, qty, discount, total);
        }
    }
    if (typeof switchPage === 'function') {
        switchPage('home');
    }
}
