let calcDisplay = '0', calcPrev = '', calcOpSign = '', resetNext = false;

function renderCalculatorHTML() {
    return `
        <div id="calculator-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 hidden">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-4 pb-8 shadow-2xl relative">
                <div class="flex items-center justify-between mb-3.5">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <i data-lucide="calculator" class="w-4 h-4 text-cyan-600 dark:text-cyan-400"></i>
                        </div>
                        <h3 class="text-slate-900 dark:text-white font-bold text-sm">क्याल्कुलेटर</h3>
                    </div>
                    <button onclick="toggleCalculator(false)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-950/60 transition-colors">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <!-- Display -->
                <div class="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 mb-4 text-right shadow-inner min-h-[80px] flex flex-col justify-end overflow-hidden">
                    <div id="calc-prev" class="text-slate-400 dark:text-slate-500 text-xs font-mono tracking-wide mb-1 truncate"></div>
                    <div id="calc-display" class="text-slate-900 dark:text-white font-mono font-bold text-3xl tracking-wider truncate">0</div>
                </div>
                <!-- Keypad -->
                <div class="grid grid-cols-4 gap-2">
                    <button class="h-12 rounded-2xl font-bold text-lg bg-rose-500/20 text-rose-600 border border-rose-500/30 active:scale-95 transition-transform" onclick="calcClear()">AC</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-transform" onclick="calcSign()">+/-</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-200 dark:bg-slate-800 text-cyan-600 active:scale-95 transition-transform" onclick="calcOp('%')">%</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-cyan-500/20 text-cyan-600 border border-cyan-500/40 active:scale-95 transition-transform" onclick="calcOp('÷')">÷</button>
                    
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('7')">7</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('8')">8</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('9')">9</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-cyan-500/20 text-cyan-600 border border-cyan-500/40 active:scale-95 transition-transform" onclick="calcOp('×')">×</button>
                    
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('4')">4</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('5')">5</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('6')">6</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-cyan-500/20 text-cyan-600 border border-cyan-500/40 active:scale-95 transition-transform" onclick="calcOp('-')">-</button>
                    
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('1')">1</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('2')">2</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('3')">3</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-cyan-500/20 text-cyan-600 border border-cyan-500/40 active:scale-95 transition-transform" onclick="calcOp('+')">+</button>
                    
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('0')">0</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform dark:text-white" onclick="calcDigit('.')">.</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform dark:text-white" onclick="calcBack()">⌫</button>
                    <button class="h-12 rounded-2xl font-bold text-lg bg-cyan-600 text-white font-extrabold active:scale-95 transition-transform" onclick="calcEquals()">=</button>
                </div>
            </div>
        </div>
    `;
}

function toggleCalculator(show) {
    const container = document.getElementById('calculator-container');
    if (!container.innerHTML.trim()) {
        container.innerHTML = renderCalculatorHTML();
        if(window.lucide) lucide.createIcons();
        initCalcKeyboard(); // कीबोर्ड इभेन्ट जोड्ने
    }
    document.getElementById('calculator-modal').classList.toggle('hidden', !show);
}

function calcDigit(d) {
    if (resetNext) { calcDisplay = d === '.' ? '0.' : d; resetNext = false; }
    else { calcDisplay = calcDisplay === '0' && d !== '.' ? d : calcDisplay + d; }
    updateCalcUI();
}

function calcOp(op) { 
    if (calcPrev && !resetNext) {
        calcEquals();
    }
    calcPrev = calcDisplay; 
    calcOpSign = op; 
    resetNext = true; 
    updateCalcUI(); 
}

function calcEquals() {
    if (!calcOpSign || !calcPrev) return;
    let a = parseFloat(calcPrev), b = parseFloat(calcDisplay), res = 0;
    if (calcOpSign === '+') res = a + b;
    else if (calcOpSign === '-') res = a - b;
    else if (calcOpSign === '×' || calcOpSign === '*') res = a * b;
    else if (calcOpSign === '÷' || calcOpSign === '/') res = b !== 0 ? a / b : 0;
    else if (calcOpSign === '%') res = (a * b) / 100;
    
    // दशमलव पछिको अंकहरूलाई व्यवस्थित गर्न
    calcDisplay = String(Math.round(res * 100000000) / 100000000); 
    calcPrev = ''; 
    calcOpSign = ''; 
    resetNext = true; 
    updateCalcUI();
}

function calcClear() { calcDisplay = '0'; calcPrev = ''; calcOpSign = ''; resetNext = false; updateCalcUI(); }
function calcBack() { calcDisplay = calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0'; updateCalcUI(); }
function calcSign() { calcDisplay = String(-parseFloat(calcDisplay)); updateCalcUI(); }

function updateCalcUI() {
    const disp = document.getElementById('calc-display');
    const prev = document.getElementById('calc-prev');
    if(disp) disp.innerText = calcDisplay;
    if(prev) prev.innerText = calcPrev && calcOpSign ? `${calcPrev} ${calcOpSign}` : '';
}

// किबोर्डबाट चलाउन मिल्ने बनाउने फंक्सन
function initCalcKeyboard() {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('calculator-modal');
        if (!modal || modal.classList.contains('hidden')) return;

        if (e.key >= '0' && e.key <= '9' || e.key === '.') calcDigit(e.key);
        else if (e.key === '+') calcOp('+');
        else if (e.key === '-') calcOp('-');
        else if (e.key === '*') calcOp('×');
        else if (e.key === '/') calcOp('÷');
        else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calcEquals(); }
        else if (e.key === 'Backspace') calcBack();
        else if (e.key === 'Escape') toggleCalculator(false);
    });
}
