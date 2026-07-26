let currentOperand = '0';
let previousOperand = '';
let operation = undefined;

function updateDisplay() {
    document.getElementById('currentOperand').innerText = currentOperand;
    document.getElementById('previousOperand').innerText = previousOperand;
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') calculate();
    operation = op;
    previousOperand = currentOperand + ' ' + op;
    currentOperand = '';
    updateDisplay();
}

function calculate() {
    if (operation === undefined || currentOperand === '') return;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    
    let computation;
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': 
            if (current === 0) { alert('لا يمكن القسمة على صفر!'); return; }
            computation = prev / current; 
            break;
        case '%': computation = prev % current; break;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteLast() {
    currentOperand = currentOperand.length === 1 ? '0' : currentOperand.slice(0, -1);
    updateDisplay();
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
    if (e.key === '%') appendOperator('%');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Backspace') deleteLast();
});

updateDisplay();
