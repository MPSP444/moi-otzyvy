document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт формы загружен');
    
    // Находим кнопку отправки по классу и типу
    const submitButton = document.querySelector('button[type="submit"].btn-primary');
    console.log('Найдена кнопка отправки:', submitButton);
    
    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            // Предотвращаем стандартное поведение кнопки
            event.preventDefault();
            console.log('Кнопка отправки нажата!');
            
            // Получаем значения из полей формы
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            
            if (!nameInput || !emailInput || !messageInput) {
                alert('Ошибка: не найдены все необходимые поля формы');
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput.value.trim();
            
            // Проверяем заполнение обязательных полей
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните все обязательные поля (имя, email, сообщение)');
                return;
            }
            
            // Отображаем индикатор загрузки
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Отправка...';
            submitButton.disabled = true;
            
            // Отправляем данные в Firebase
            fetch('https://ordermanagerreviews-default-rtdb.europe-west1.firebasedatabase.app/contacts.json', {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    date: new Date().toISOString(),
                    status: 'new'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Успешно отправлено:', data);
                alert('Спасибо за обратную связь! Ваше сообщение отправлено.');
                
                // Очищаем поля формы
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (phoneInput) phoneInput.value = '';
                if (messageInput) messageInput.value = '';
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
            })
            .finally(() => {
                // Восстанавливаем кнопку
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    } else {
        console.error('Кнопка отправки не найдена!');
    }
});
