document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт формы загружен');
    
    // Инициализация JSONBin API (если еще не инициализирован)
    if (!window.jsonBinApi && window.JSONBinAPI) {
        window.jsonBinApi = new JSONBinAPI(
            "67d39e6a8561e97a50eb9aab", // Bin ID
            "2a$10 U.spgA59NgzW9tOTIHK/QekIr4DVVruFGSAw2vXAx1Uuxz5zPnnSe" // Master Key
        );
    }
    
    // Находим кнопку отправки по классу и типу
    const submitButton = document.querySelector('button[type="submit"].btn-primary');
    console.log('Найдена кнопка отправки:', submitButton);
    
    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
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
            
            try {
                // Создаем объект с данными контактной формы
                const contactData = {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    date: new Date().toISOString(),
                    status: 'new'
                };
                
                // Проверяем наличие API и используем его для отправки
                if (window.jsonBinApi) {
                    // Отправляем данные через JSONBin API
                    await window.jsonBinApi.addContact(contactData);
                } else {
                    // Запасной вариант - прямой запрос к JSONBin
                    const response = await fetch('https://api.jsonbin.io/v3/b/67d39e6a8561e97a50eb9aab', {
                        method: 'GET',
                        headers: {
                            'X-Master-Key': '2a$10 U.spgA59NgzW9tOTIHK/QekIr4DVVruFGSAw2vXAx1Uuxz5zPnnSe'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    const data = result.record || { contacts: [] };
                    
                    // Если массива контактов нет, создаем его
                    if (!data.contacts) {
                        data.contacts = [];
                    }
                    
                    // Добавляем сообщение в массив
                    data.contacts.push(contactData);
                    
                    // Сохраняем обновленные данные
                    const updateResponse = await fetch('https://api.jsonbin.io/v3/b/67d39e6a8561e97a50eb9aab', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Master-Key': '2a$10 U.spgA59NgzW9tOTIHK/QekIr4DVVruFGSAw2vXAx1Uuxz5zPnnSe'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!updateResponse.ok) {
                        throw new Error(`Ошибка HTTP при обновлении: ${updateResponse.status}`);
                    }
                }
                
                console.log('Успешно отправлено');
                alert('Спасибо за обратную связь! Ваше сообщение отправлено.');
                
                // Очищаем поля формы
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (phoneInput) phoneInput.value = '';
                if (messageInput) messageInput.value = '';
                
                // Создаем сообщение для WhatsApp
                const whatsappMessage = `Сообщение с сайта:\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone || 'Не указан'}\n\nСообщение: ${message}`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://wa.me/79066322571?text=${encodedMessage}`;
                
                // Открываем ссылку в новом окне
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 500);
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
            } finally {
                // Восстанавливаем кнопку
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    } else {
        console.error('Кнопка отправки не найдена!');
    }
});