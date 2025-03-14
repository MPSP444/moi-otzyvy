/**
 * JSONBin API Utility
 * Класс для работы с JSONBin API, заменяющий функциональность Firebase
 */
class JSONBinAPI {
    constructor(binID, masterKey) {
        this.binID = binID;
        this.masterKey = masterKey;
        this.apiUrl = `https://api.jsonbin.io/v3/b/${binID}`;
        this.initialStructure = {
            reviews: [],
            contacts: []
        };
    }

    /**
     * Получение данных из JSONBin
     * @returns {Promise<Object>} Данные из бина
     */
    async getData() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.masterKey
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const result = await response.json();

            // JSONBin возвращает данные в формате { record: { ... } }
            if (result && result.record) {
                return result.record;
            }

            // Если данных нет, возвращаем начальную структуру
            return this.initialStructure;
        } catch (error) {
            console.error('Ошибка при получении данных из JSONBin:', error);
            
            // В случае ошибки, пробуем использовать кэшированные данные
            const cachedData = localStorage.getItem('cachedData');
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            
            // Если и кэша нет, возвращаем пустую структуру
            return this.initialStructure;
        }
    }

    /**
     * Сохранение данных в JSONBin
     * @param {Object} data - Данные для сохранения
     * @returns {Promise<Object>} Результат операции
     */
    async saveData(data) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.masterKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            // Обновляем локальный кэш
            localStorage.setItem('cachedData', JSON.stringify(data));
            localStorage.setItem('cachedDataTimestamp', new Date().getTime().toString());

            return await response.json();
        } catch (error) {
            console.error('Ошибка при сохранении данных в JSONBin:', error);
            throw error;
        }
    }

    /**
     * Добавление нового отзыва
     * @param {Object} review - Объект отзыва
     * @returns {Promise<string>} ID нового отзыва
     */
    async addReview(review) {
        try {
            // Получаем текущие данные
            const data = await this.getData();
            
            // Создаем ID для нового отзыва
            const newId = this.generateUniqueId();
            
            // Добавляем ID к отзыву
            const reviewWithId = {
                ...review,
                id: newId,
                timestamp: new Date().toISOString()
            };
            
            // Если массива отзывов нет, создаем его
            if (!data.reviews) {
                data.reviews = [];
            }
            
            // Добавляем отзыв в массив
            data.reviews.push(reviewWithId);
            
            // Сохраняем обновленные данные
            await this.saveData(data);
            
            return newId;
        } catch (error) {
            console.error('Ошибка при добавлении отзыва:', error);
            throw error;
        }
    }

    /**
     * Обновление отзыва
     * @param {string} reviewId - ID отзыва
     * @param {Object} updateData - Данные для обновления
     * @returns {Promise<boolean>} Результат операции
     */
    async updateReview(reviewId, updateData) {
        try {
            // Получаем текущие данные
            const data = await this.getData();
            
            // Если массива отзывов нет, возвращаем ошибку
            if (!data.reviews) {
                throw new Error('Отзывы не найдены');
            }
            
            // Находим индекс отзыва по ID
            const reviewIndex = data.reviews.findIndex(review => review.id === reviewId);
            
            // Если отзыв не найден, возвращаем ошибку
            if (reviewIndex === -1) {
                throw new Error(`Отзыв с ID ${reviewId} не найден`);
            }
            
            // Обновляем отзыв
            data.reviews[reviewIndex] = {
                ...data.reviews[reviewIndex],
                ...updateData
            };
            
            // Сохраняем обновленные данные
            await this.saveData(data);
            
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            throw error;
        }
    }

    /**
     * Добавление контактного сообщения
     * @param {Object} contact - Объект контактного сообщения
     * @returns {Promise<string>} ID нового сообщения
     */
    async addContact(contact) {
        try {
            // Получаем текущие данные
            const data = await this.getData();
            
            // Создаем ID для нового сообщения
            const newId = this.generateUniqueId();
            
            // Добавляем ID к сообщению
            const contactWithId = {
                ...contact,
                id: newId,
                timestamp: new Date().toISOString()
            };
            
            // Если массива контактов нет, создаем его
            if (!data.contacts) {
                data.contacts = [];
            }
            
            // Добавляем сообщение в массив
            data.contacts.push(contactWithId);
            
            // Сохраняем обновленные данные
            await this.saveData(data);
            
            return newId;
        } catch (error) {
            console.error('Ошибка при добавлении контактного сообщения:', error);
            throw error;
        }
    }

    /**
     * Обновление реакций (лайки/дизлайки)
     * @param {string} reviewId - ID отзыва
     * @param {string} reactionType - Тип реакции ('likes' или 'dislikes')
     * @returns {Promise<number>} Новое количество реакций
     */
    async updateReaction(reviewId, reactionType) {
        try {
            // Получаем текущие данные
            const data = await this.getData();
            
            // Находим отзыв по ID
            const reviewIndex = data.reviews.findIndex(review => review.id === reviewId);
            
            if (reviewIndex === -1) {
                throw new Error(`Отзыв с ID ${reviewId} не найден`);
            }
            
            // Увеличиваем счетчик реакции
            const currentValue = data.reviews[reviewIndex][reactionType] || 0;
            data.reviews[reviewIndex][reactionType] = currentValue + 1;
            
            // Сохраняем обновленные данные
            await this.saveData(data);
            
            return data.reviews[reviewIndex][reactionType];
        } catch (error) {
            console.error(`Ошибка при обновлении ${reactionType}:`, error);
            throw error;
        }
    }

    /**
     * Генерация уникального ID
     * @returns {string} Уникальный ID
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

// Экспорт для использования в других файлах
window.JSONBinAPI = JSONBinAPI;