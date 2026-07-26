// المتغيرات
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
let scientificMode = false;
let currentTheme = 0;
const themes = ['light', 'dark', 'blue', 'purple'];

// العناصر
const currentDisplay = document.getElementById('currentDisplay');
const historyDisplay = document.getElementById('historyDisplay');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const buttonsGrid = document.getElementById('buttonsGrid');
const scientificButtons = document.getElementById('scientificButtons');

// تحديث الشاشة
function updateDisplay() {
    currentDisplay.innerText = currentOperand;
    historyDisplay.innerText = previousOperand;
    
    // Animation
    currentDisplay.style.animation = 'none';
    setTimeout(() => {
        currentDisplay.style.animation = 'pulse 0.3s ease';
    }, 10);
}

// إضافة رقم
function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

// إضافة عملية
function appendOperator(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand + ' ' + op;
    currentOperand = '';
    
    updateDisplay();
}

// الحساب
function calculate() {
    if (operation === undefined || currentOperand === '') return;
    
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': 
            if (current === 0) { 
                alert('⚠️ لا يمكن القسمة على صفر!'); 
                return; 
            }
            computation = prev / current; 
            break;
        case '%': computation = prev % current; break;
        case '^': computation = Math.pow(prev, current); break;
        default: return;
    }
    
    // إضافة للسجل
    addToHistory(`${prev} ${operation} ${current}`, computation);
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    
    updateDisplay();
}

// العمليات العلمية
function scientificCalc(func) {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    let result;
    let expression = '';
    
    switch(func) {
        case 'sin':
            result = Math.sin(current);
            expression = `sin(${current})`;
            break;
        case 'cos':
            result = Math.cos(current);
            expression = `cos(${current})`;
            break;
        case 'tan':
            result = Math.tan(current);
            expression = `tan(${current})`;
            break;
        case 'log':
            result = Math.log10(current);
            expression = `log(${current})`;
            break;
        case 'ln':
            result = Math.log(current);
            expression = `ln(${current})`;
            break;
        case 'sqrt':
            if (current < 0) {
                alert('⚠️ لا يمكن حساب الجذر التربيعي لعدد سالب!');
                return;
            }
            result = Math.sqrt(current);
            expression = `√(${current})`;
            break;
        case 'pow':
            result = Math.pow(current, 2);
            expression = `${current}²`;
            break;
        case 'pi':
            result = Math.PI;
            expression = 'π';
            break;
        case 'e':
            result = Math.E;
            expression = 'e';
            break;
        case 'fact':
            result = factorial(current);
            expression = `${current}!`;
            break;
    }
    
    if (result !== undefined) {
        addToHistory(expression, result);
        currentOperand = result.toString();
        updateDisplay();
    }
}

// حساب المضروب
function factorial(n) {
    if (n < 0) return -1;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// إضافة للسجل
function addToHistory(expression, result) {
    history.unshift({ expression, result, time: new Date().toLocaleTimeString('ar-EG') });
    if (history.length > 20) history.pop();
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    renderHistory();
}

// عرض السجل
function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 20px;">لا يوجد سجل</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="useHistoryResult(${index})">
            <div class="history-expression">${item.expression} =</div>
            <div class="history-result">${item.result}</div>
        </div>
    `).join('');
}

// استخدام نتيجة من السجل
function useHistoryResult(index) {
    currentOperand = history[index].result.toString();
    updateDisplay();
}

// مسح السجل
function clearHistory() {
    history = [];
    localStorage.removeItem('calculatorHistory');
    renderHistory();
}

// مسح الكل
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// حذف آخر رقم
function deleteLast() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// تبديل الوضع العلمي
function toggleMode() {
    scientificMode = !scientificMode;
    
    if (scientificMode) {
        buttonsGrid.style.display = 'none';
        scientificButtons.style.display = 'grid';
        document.querySelector('.mode-btn').innerHTML = '<i class="fas fa-calculator"></i> عادي';
    } else {
        buttonsGrid.style.display = 'grid';
        scientificButtons.style.display = 'none';
        document.querySelector('.mode-btn').innerHTML = '<i class="fas fa-flask"></i> علمي';
    }
}

// تبديل الثيم
function toggleTheme() {
    currentTheme = (currentTheme + 1) % themes.length;
    const theme = themes[currentTheme];
    document.documentElement.setAttribute('data-theme', theme);
    
    const icons = ['fa-moon', 'fa-sun', 'fa-palette', 'fa-fill-drip'];
    document.querySelector('.theme-btn i').className = `fas ${icons[currentTheme]}`;
}

// إظهار/إخفاء السجل
function toggleHistory() {
    historyPanel.classList.toggle('show');
    if (historyPanel.classList.contains('show')) {
        renderHistory();
    }
}

// دعم لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendOperator(e.key);
    if (e.key === '%') appendOperator('%');
    if (e.key === '^') appendOperator('^');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'h' || e.key === 'H') toggleHistory();
});

// تهيئة
updateDisplay();
renderHistory();

console.log('%c🧮 الآلة الحاسبة الاحترافية جاهزة!', 'color: #667eea; font-size: 16px; font-weight: bold;');
