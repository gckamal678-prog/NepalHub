function renderUdharoHTML() {
    // कुल बाँकी उधारो रकम हिसाब गर्ने
    const totalUdharo = customers.reduce((sum, c) => sum + (c.amount || 0), 0);

    return `
        <div class="space-y-4">
            <!-- कुल उधारो समरी कार्ड -->
            <div class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div>
                    <div class="text-[11px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">कुल उठाउन बाँकी उधारो</div>
                    <div class="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">रू ${totalUdharo.toLocaleString()}</div>
                </div>
                <div class="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <i data-lucide="wallet" class="w-5 h-5"></i>
                </div>
            </div>

            <!-- हेडर र थप्ने बटन -->
            <div class="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span class="text-xs text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
                    <i data-lucide="book-user" class="w-4 h-4 text-amber-500"></i> उधारो खाता (Credit Book)
                </span>
                <button onclick="addCustomer()" class="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md">
                    <i data-lucide="user-plus" class="w-3.5 h-3.5"></i> ग्राहक थप
                </button>
            </div>

            <!-- ग्राहकहरूको सूची -->
            <div class="space-y-2.5">
                ${customers.length === 0 ? `
                    <div class="text-center py-12 bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800">
                        <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80"></i>
                        <p class="text-xs text-slate-500 dark:text-slate-400">कुनै पनि उधारो खाता बाँकी छैन!</p>
                    </div>
                ` : customers.map(c => `
                    <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex justify-between items-center shadow-sm hover:border-amber-500/40 transition">
                        <div class="space-y-0.5">
                            <div class="text-xs font-bold text-slate-900 dark:text-white">${c.name}</div>
                            <div class="text-[11px] text-slate-400 flex items-center gap-1">
                                <i data-lucide="phone" class="w-3 h-3"></i> ${c.phone || 'फोन नम्बर छैन'}
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="text-right">
                                <div class="text-[10px] text-slate-400">बाँकी</div>
                                <div class="text-xs text-amber-600 dark:text-amber-400 font-extrabold">रू ${c.amount.toLocaleString()}</div>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="receiveUdharoPayment('${c.id}')" title="रقم उठाउने" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold transition shadow-sm">
                                    असुल
                                </button>
                                <button onclick="deleteCustomer('${c.id}')" title="मेटाउने" class="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addCustomer() {
    const name = prompt('ग्राहकको नाम:');
    if(!name || !name.trim()) return;
    const phone = prompt('फोन नम्बर (اختياري):') || '';
    const amount = parseFloat(prompt('उधारो रकम (रू):')) || 0;
    
    customers.unshift({ 
        id: String(Date.now()), 
        name: name.trim(), 
        phone: phone.trim(), 
        amount: amount >= 0 ? amount : 0,
        created_at: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('nepalhub_customers', JSON.stringify(customers));
    if (typeof showToast === 'function') showToast('नयाँ उधारो खाता थपियो!');
    renderApp();
}

function deleteCustomer(id) {
    if(confirm('के तपाईं यो उधारो खाता स्थायी रूपमा मेटाउन चाहनुहुन्छ?')) {
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('nepalhub_customers', JSON.stringify(customers));
        if (typeof showToast === 'function') showToast('खाता मेटाइयो!');
        renderApp();
    }
}

function receiveUdharoPayment(id) {
    const cust = customers.find(c => c.id === id);
    if(!cust) return;
    
    const payAmt = parseFloat(prompt(`${cust.name}बाट कति रकम उठ्यो (रू)?\nकुल बाँकी: रू ${cust.amount}`)) || 0;
    
    if(payAmt > 0) {
        if(payAmt > cust.amount) {
            alert('त्रुटि: उठाएको रकम बाँकी उधारो भन्दा बढी हुन सक्दैन!');
            return;
        }
        cust.amount = Math.max(0, cust.amount - payAmt);
        localStorage.setItem('nepalhub_customers', JSON.stringify(customers));
        if (typeof showToast === 'function') showToast('उधारो रकम सफलतापूर्वक अपडेट भयो!');
        renderApp();
    }
}
