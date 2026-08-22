function renderTaxAuditHTML() {
    // सुरक्षित रूपमा डेटा लोड गर्ने
    const currentSales = window.sales || [];
    const currentExpenses = window.expenses || [];
    const inventoryItems = window.inventory || [];
    const taxMode = window.currentTaxMode || 'PAN';

    const totalSales = currentSales.reduce((s, x) => s + (x.total || 0), 0);
    const totalExp = currentExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    
    // अनुमानित नाफा (सक्कल बिक्री - खर्च)
    const netProfit = totalSales - totalExp;
    
    // कर दायित्व हिसाब
    let taxLiability = 0;
    let taxLabel = '';
    let taxDescription = '';

    if (taxMode === 'PAN') {
        // सामान्यतया साना व्यवसायको कर स्ल्याब वा करिब २५% लाभांश कर
        taxLiability = netProfit > 0 ? netProfit * 0.25 : 0;
        taxLabel = 'अनुमानित आयकर दायित्व (25%)';
        taxDescription = 'खुद नाफाको आधारमा लाग्ने कर (बार्षिक लाभ अनुसार परिवर्तन हुन सक्छ)';
    } else {
        // साधारण भ्याट दायित्व (बिक्रीको १३%)
        taxLiability = totalSales * 0.13;
        taxLabel = 'कुल भ्याट दायित्व (13% VAT)';
        taxDescription = 'कुल बिक्री मूल्यमा लाग्ने मूल्य अभिवृद्धि कर';
    }

    return `
        <div class="space-y-4">
            <div class="bg-white dark:bg-[#111827] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
                
                <!-- Header & Mode Switcher -->
                <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                        <h2 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <i data-lucide="file-text" class="w-4 h-4 text-cyan-500"></i> कर प्रणाली (PAN / VAT Mode)
                        </h2>
                        <p class="text-[10px] text-slate-400 mt-0.5">नेपाल कर नियमावली अनुसारको विवरण</p>
                    </div>
                    <div class="flex space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button onclick="setTaxMode('PAN')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${taxMode==='PAN'?'bg-cyan-600 text-white shadow-md':'text-slate-500 dark:text-slate-400'}">PAN</button>
                        <button onclick="setTaxMode('VAT')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${taxMode==='VAT'?'bg-cyan-600 text-white shadow-md':'text-slate-500 dark:text-slate-400'}">VAT (13%)</button>
                    </div>
                </div>

                <!-- Summary Cards Grid -->
                <div class="grid grid-cols-2 gap-2.5">
                    <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 font-medium">कुल कारोबार (Total Sales)</p>
                        <p class="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">रू ${totalSales.toLocaleString()}</p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 font-medium">खुद नाफा (Net Profit)</p>
                        <p class="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">रू ${netProfit.toLocaleString()}</p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">${taxLabel}</p>
                                <p class="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-1">रू ${taxLiability.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                            </div>
                            <div class="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <i data-lucide="percent" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-2 border-t border-slate-200 dark:border-slate-800/60 pt-2">${taxDescription}</p>
                    </div>
                </div>

                <!-- Export / Print Button -->
                <button onclick="window.print()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                    <i data-lucide="printer" class="w-4 h-4 text-cyan-500"></i> कर रिपोर्ट प्रिन्ट गर्नुहोस्
                </button>
            </div>
        </div>
    `;
}

function setTaxMode(mode) {
    window.currentTaxMode = mode;
    if (typeof renderApp === 'function') {
        renderApp();
    }
}
