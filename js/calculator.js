'use strict';

// Ожидаем полной загрузки DOM перед инициализацией
document.addEventListener('DOMContentLoaded', initCalculator);

/**
 * Инициализация калькулятора: навешивает обработчик на форму.
 */
function initCalculator() {
    const form = document.getElementById('calculator');
    if (form) {
        form.addEventListener('submit', performCalculation);
    } else {
        console.warn('Форма калькулятора не найдена!');
    }
}

/**
 * Основная функция вычисления. Вызывается при отправке формы.
 * @param {Event} event - объект события submit
 */
function performCalculation(event) {
    // Отменяем стандартную отправку формы (перезагрузку страницы)
    event.preventDefault();

    // Получаем ссылки на все необходимые элементы
    const firstInput = document.querySelector('input[name="input_one"]');
    const secondInput = document.querySelector('input[name="input_two"]');
    const operationSelect = document.querySelector('select[name="input_block"]');
    const resultContainer = document.getElementById('resultPanel'); // используем новый id

    // Сбрасываем класс ошибки со всех полей перед новой операцией
    clearErrors();

    // Проверяем, что все поля существуют (на всякий случай)
    if (!firstInput || !secondInput || !operationSelect || !resultContainer) {
        alert('Ошибка: не удалось найти некоторые элементы формы.');
        return;
    }

    // Получаем значения и убираем лишние пробелы
    const firstVal = firstInput.value.trim();
    const secondVal = secondInput.value.trim();

    // Валидация: поля не должны быть пустыми
    if (firstVal === '') {
        highlightError(firstInput, 'Введите первое число!');
        return;
    }
    if (secondVal === '') {
        highlightError(secondInput, 'Введите второе число!');
        return;
    }

    // Преобразуем в числа
    const a = Number(firstVal);
    const b = Number(secondVal);

    // Проверка, что получены именно числа (если введено не число, Number вернёт NaN)
    if (isNaN(a) || isNaN(b)) {
        alert('Ошибка: введите корректные числа.');
        return;
    }

    const op = operationSelect.value;
    let result;

    // Выполняем операцию в зависимости от выбранного знака
    switch (op) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) {
                highlightError(secondInput, 'Делить на ноль нельзя!');
                return;
            }
            result = a / b;
            break;
        default:
            alert('Неизвестная операция. Используйте +, -, * или /.');
            return;
    }

    // Если результат успешно вычислен, добавляем запись в историю
    addHistoryEntry(resultContainer, a, op, b, result);
}

/**
 * Удаляет класс 'error' со всех элементов, где он есть.
 */
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

/**
 * Подсвечивает указанный элемент как ошибочный и показывает сообщение.
 * @param {HTMLElement} element - элемент, который нужно подсветить
 * @param {string} message - текст сообщения об ошибке
 */
function highlightError(element, message) {
    element.classList.add('error');
    alert(`Ошибка: ${message}`);
    element.focus(); // устанавливаем фокус на проблемное поле
}

/**
 * Добавляет новую запись в историю вычислений.
 * @param {HTMLElement} container - блок, в который добавляется запись
 * @param {number} a - первое число
 * @param {string} op - операция
 * @param {number} b - второе число
 * @param {number} res - результат
 */
function addHistoryEntry(container, a, op, b, res) {
    const entry = document.createElement('div');
    entry.textContent = `${a} ${op} ${b} = ${res}`;
    container.prepend(entry); // новая запись появляется сверху
}