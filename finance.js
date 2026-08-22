let personalFinanceType = 'income';

function renderFinanceHTML() {
    // सुरक्षित रूपमा ट्रान्जेक्सन डेटा लोड गर्ने
    const transactions = window.personalTransactions || [];
    
    const totalIncome = transactions.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = transactions.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return `
        <div class="space-y-4">
            <!-- ब्यालेन्स र समري कार्डहरू -->
            <div class="grid grid-cols-3 gap-2">
                <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">आम्दानी</p>
                    <p class="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs md:text-sm mt-1">रू ${totalIncome.toLocaleString()}</p>
                </div>
                <div class="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">खर्च</p>
                    <p class="text-rose-600 dark:text-rose-400 font-extrabold text-xs md:text-sm mt-1">रू ${totalExpense.toLocaleString()}</p>
                </div>
                <div class="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase">बचत (Net)</p>
                    <p class="text-cyan-600 dark:text-cyan-400 font-extrabold text-xs md:text-sm mt-1">रू ${netBalance.toLocaleString()}</p>
                </div>
            </div>

            <!-- नयाँ प्रविष्टि फर्म -->
            <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                <h3 class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="wallet" class="w-4 h-4 text-teal-500"></i> आय/व्यय थप्नुहोस्
                </h3>
                <div class="space-y-2.5">
                    <select id="fin-type" onchange="personalFinanceType=this.value" class="w-full bg-slate-50 border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
                        <option value="income" ${personalFinanceType === 'income' ? 'selected' : ''}>कमाई (Income)</option>
                        <option value="expense" ${personalFinanceType === 'expense' ? 'selected' : ''}>खर्च (Expense - भाडा/बिजुली आदि)</option>
                    </select>
                    <input type="text" id="fin-title" placeholder="विवरण / शीर्षक (जस्तै: पसल भाडा)" class="w-full bg-slate-50 border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white">
                    <input type="number" id="fin-amount" placeholder="रकम (रू)" class="w-full bg-slate-50 border border-slate-300 dark:bg-[#131b2e] dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold">
                    <button onclick="savePersonalTransaction()" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i> सेभ गर्नुहोस्
                    </button>
                </div>
            </div>

            <!-- ट्रान्जेक्सनको सूची (Transaction History List) -->
            <div class="space-y-2.5">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 px-1">हालैका कारोबारहरू</div>
                ${transactions.length === 0 ? `
                    <div class="text-center py-10 bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800">
                        <p class="text-xs text-slate-400">कुनै पनि कारोबार रेकर्ड गरिएको छैन।</p>
                    </div>
                ` : transactions.map(t => `
                    <div class="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} flex items-center justify-center shrink-0">
                                <i data-lucide="${t.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <div class="text-xs font-bold text-slate-900 dark:text-white">${t.title}</div>
                                <div class="text-[10px] text-slate-400">${t.date || 'आज'}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="text-xs font-extrabold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
                                ${t.type === 'income' ? '+' : '-'} रू ${t.amount.toLocaleString()}
                            </div>
                            <button onclick="deletePersonalTransaction('${t.id}')" class="text-slate-400 hover:text-rose-500 p-1 transition" title="मेटाउने">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function savePersonalTransaction() {
    const title = document.getElementById('fin-title').value.trim();
    const amount = parseFloat(document.getElementById('fin-amount').value);
    
    if (!title || isNaN(amount) || amount <= 0) {
        if (typeof showToast === 'function') showToast('कृपया विवरण र सही रकम भर्नुहोस्!');
        return;
    }
    
    if (typeof personalTransactions === 'undefined') {
        window.personalTransactions = [];
    }

    personalTransactions.unshift({ 
        id: String(Date.now()), 
        type: personalFinanceType, 
        title, 
        amount,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('nepalhub_personal_finance', JSON.stringify(personalTransactions));
    if (typeof showToast === 'function') showToast('कारोबार सफलतापूर्वक सेभ भयो!');
    
    if (typeof renderApp === 'function') renderApp();
}

function deletePersonalTransaction(id) {
    if (confirm('के तपाईं यो रेकर्ड मेटाउन चाहनुहुन्छ?')) {
        personalTransactions = personalTransactions.filter(t => t.id !== id);
        localStorage.setItem('nepalhub_personal_finance', JSON.stringify(personalTransactions));
        if (typeof showToast === 'function') showToast('कारोबार मेटाइयो!');
        if (typeof renderApp === 'function') renderApp();
    }
}
