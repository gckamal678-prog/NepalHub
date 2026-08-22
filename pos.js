let selectedPaymentMethod = 'cash';

function renderPOSHTML() {
    return `
        <div class="space-y-4">
            <div class="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">बिक्री बिल (POS)</h3>
                <div class="space-y-2">
                    <label class="text-[11px] text-slate-500">सामान छान्नुहोस्</label>
                    <select id="pos-item-select" onchange="fillPOSItem(this.value)" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                        <option value="">-- सामान छान्नुहोस् --</option>
                        ${inventory.map(i => `<option value="${i.name}">${i.name} (स्टक: ${i.stock}) - मूल्य: रू ${i.price}</option>`).join('')}
                    </select>
                    <input id="pos-customer" placeholder="ग्राहकको नाम (Customer Name)" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                    <input id="pos-item" placeholder="सामानको नाम" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                    <div class="grid grid-cols-2 gap-2">
                        <input id="pos-qty" type="number" placeholder="मात्रा (Quantity)" value="1" oninput="calculatePOSTotal()" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                        <input id="pos-discount" type="number" placeholder="छुट रकम / डिस्काउन्ट (रू)" value="0" oninput="calculatePOSTotal()" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                    </div>
                    <input id="pos-amount" type="number" placeholder="खुद कुल रकम (Net Amount रू)" class="w-full bg-white border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white font-bold">
                </div>
                <div class="grid grid-cols-3 gap-2 py-2">
                    <button onclick="setPayment('cash')" id="btn-cash" class="py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs">नगद</button>
                    <button onclick="setPayment('qr')" id="btn-qr" class="py-2.5 rounded-xl bg-slate-200 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 font-bold text-xs">QR</button>
                    <button onclick="setPayment('udharo')" id="btn-udharo" class="py-2.5 rounded-xl bg-slate-200 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 font-bold text-xs">उधारो</button>
                </div>
                <button onclick="completeSale()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg">
                    बिक्री सेभ गर्नुहोस् र बिल प्रिन्ट गर्नुहोस्
                </button>
            </div>
        </div>
    `;
}

function fillPOSItem(name) {
    const found = inventory.find(i => i.name === name);
    if(found) {
        document.getElementById('pos-item').value = found.name;
        document.getElementById('pos-amount').value = found.price;
        calculatePOSTotal();
    }
}

function calculatePOSTotal() {
    const itemSelect = document.getElementById('pos-item-select').value;
    const found = inventory.find(i => i.name === itemSelect);
    if(found) {
        const qty = parseFloat(document.getElementById('pos-qty').value) || 1;
        const discount = parseFloat(document.getElementById('pos-discount').value) || 0;
        let total = (found.price * qty) - discount;
        document.getElementById('pos-amount').value = total >= 0 ? total : 0;
    }
}

function setPayment(method) {
    selectedPaymentMethod = method;
    ['cash', 'qr', 'udharo'].forEach(m => {
        const btn = document.getElementById(`btn-${m}`);
        if (btn) {
            btn.className = m === method 
                ? "py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md" 
                : "py-2.5 rounded-xl bg-[#131b2e] text-slate-300 border border-slate-800 font-bold text-xs";
        }
    });
}

function completeSale() {
    const itemName = document.getElementById('pos-item').value;
    const custName = document.getElementById('pos-customer').value || 'नगद ग्राहक';
    const qty = parseFloat(document.getElementById('pos-qty').value) || 1;
    const discount = parseFloat(document.getElementById('pos-discount').value) || 0;
    const total = parseFloat(document.getElementById('pos-amount').value);

    if(!itemName || isNaN(total) || total < 0) {
        showToast('कृपया सही विवरण भर्नुहोस्!');
        return;
    }

    const itemIndex = inventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (itemIndex !== -1) {
        inventory[itemIndex].stock = Math.max(0, inventory[itemIndex].stock - qty);
        localStorage.setItem('nepalhub_inventory', JSON.stringify(inventory));
    }

    if (selectedPaymentMethod === 'udharo') {
        customers.unshift({ id: String(Date.now()), name: custName, phone: '9800000000', amount: total });
        localStorage.setItem('nepalhub_customers', JSON.stringify(customers));
    }

    sales.push({ item: itemName, customer: custName, qty, discount, total, payment_method: selectedPaymentMethod, created_at: new Date().toLocaleDateString() });
    localStorage.setItem('nepalhub_sales', JSON.stringify(sales));
    
    showToast('बिक्री सफल र स्टक अपडेट भयो!');
    
    if(confirm('के तपाईं यो बिक्रीको बिल प्रिन्ट गर्न चाहनुहुन्छ?')) {
        printReceipt(itemName, custName, qty, discount, total);
    }
    
    switchPage('home');
}

function printReceipt(item, customer, qty, discount, total) {
    const profile = getSafeStorage('shopProfile', storeData);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Bill Receipt - ${profile.shopName}</title></head>
        <body style="font-family: monospace; padding: 20px; width: 300px; font-size: 12px;">
            <h3 style="text-align: center; margin-bottom: 2px;">${profile.shopName}</h3>
            <p style="text-align: center; font-size: 11px; margin-top: 0;">${profile.address || 'नेपाल'} | PAN: ${profile.panNumber || 'नभएको'}</p>
            <hr>
            <p><b>ग्राहक:</b> ${customer}</p>
            <p><b>मिति:</b> ${new Date().toLocaleDateString()}</p>
            <hr>
            <p><b>सामान:</b> ${item}</p>
            <p><b>मात्रा:</b> ${qty}</p>
            <p><b>छुट:</b> रू ${discount}</p>
            <p><b>कुल रकम: रू ${total}</b></p>
            <hr>
            <p style="text-align: center; font-size: 10px;">${profile.footerNote || 'धन्यवाद! पुनः पसिहाल्नुहोला।'}</p>
            <hr>
            <p style="text-align: center; font-size: 9px; color: gray;">Support: support@kamalgc.com.np<br>©️ 2026 NepalHub</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
