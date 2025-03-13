document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт формы загружен');
    
    // Находим форму по селектору
    const form = document.querySelector('.contact-form');
    console.log('Найдена форма:', form);
    
    if (form) {
        // Назначаем обработчик отправки формы
        form.addEventListener('submit', function(event) {
            // Предотвращаем стандартную отправку формы
            event.preventDefault();
            console.log('Форма отправлена');
            
            // Получаем данные из формы
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            console.log('Данные формы:', { name, email, phone, message });
            
            // Отправляем данные в Firebase
            const url = 'https://ordermanagerreviews-default-rtdb.europe-west1.firebasedatabase.app/contacts.json';
            
            fetch(url, {
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
                alert('Сообщение успешно отправлено!');
                form.reset();
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке сообщения');
            });
        });
    } else {
        console.error('Форма не найдена на странице');
    }
});
