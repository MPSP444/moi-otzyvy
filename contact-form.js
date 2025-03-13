document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт формы загружен');
    
    // Находим все формы на странице
    const forms = document.querySelectorAll('form');
    console.log('Найдено форм:', forms.length);
    
    // Добавляем обработчик ко всем формам
    forms.forEach(function(form) {
        console.log('Добавлен обработчик к форме:', form);
        
        form.addEventListener('submit', function(event) {
            // Предотвращаем стандартную отправку формы
            event.preventDefault();
            console.log('Форма отправлена!');
            
            // Показываем уведомление
            alert('Спасибо за обратную связь! Ваше сообщение отправлено.');
            
            // Очищаем форму
            form.reset();
        });
    });
    
    // Также находим все кнопки отправки
    const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
    console.log('Найдено кнопок отправки:', submitButtons.length);
    
    // Добавляем обработчик на случай, если форма не перехватывает событие
    submitButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            console.log('Нажата кнопка отправки:', button);
        });
    });
});
