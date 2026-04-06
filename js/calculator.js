'use strict';

document.addEventListener('DOMContentLoaded', initCalculator);

function initCalculator() {
    const form = document.getElementById('calculator');
    if (form) {
        form.addEventListener('submit', performCalculation);
    } else {
        console.warn('Форма калькулятора не найдена!');
    }
}

function performCalculation(event) {
    event.preventDefault();

    const firstInput = document.querySelector('input[name="input_one"]');
    const secondInput = document.querySelector('input[name="input_two"]');
    const operationSelect = document.querySelector('.calculator__select');
    const resultContainer = document.querySelector('.calculator__result');
    clearErrors();

    if (!firstInput || !secondInput || !operationSelect || !resultContainer) {
        alert('Ошибка: не удалось найти некоторые элементы формы.');
        return;
    }

    const firstVal = firstInput.value.trim();
    const secondVal = secondInput.value.trim();

    if (firstVal === '') {
        highlightError(firstInput, 'Введите первое число!');
        return;
    }
    if (secondVal === '') {
        highlightError(secondInput, 'Введите второе число!');
        return;
    }

    const a = Number(firstVal);
    const b = Number(secondVal);
    if (isNaN(a) || isNaN(b)) {
        alert('Ошибка: введите корректные числа.');
        return;
    }

    const op = operationSelect.value;
    let result;

    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b === 0) {
                highlightError(secondInput, 'Делить на ноль нельзя!');
                return;
            }
            result = a / b;
            break;
        default:
            highlightError(operationSelect, 'Неизвестная операция. Используйте +, -, * или /.');
            return;
    }

    addHistoryEntry(resultContainer, a, op, b, result);
}

function clearErrors() {
    document.querySelectorAll('.calculator__input--error, .calculator__select--error')
        .forEach(el => {
            if (el.classList.contains('calculator__input--error')) {
                el.classList.remove('calculator__input--error');
            } else if (el.classList.contains('calculator__select--error')) {
                el.classList.remove('calculator__select--error');
            }
        });
}

function highlightError(element, message) {
    if (element.tagName === 'INPUT') {
        element.classList.add('calculator__input--error');
    } else if (element.tagName === 'SELECT') {
        element.classList.add('calculator__select--error');
    }
    alert(`Ошибка: ${message}`);
    element.focus();
}

function addHistoryEntry(container, a, op, b, res) {
    const entry = document.createElement('div');
    entry.textContent = `${a} ${op} ${b} = ${res}`;
    container.prepend(entry);
}