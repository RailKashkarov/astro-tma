const URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbW51cXp2ZGd4YWRpc2p0YXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTMyMjcsImV4cCI6MjA4NzU4OTIyN30.3iHv_nhBdPZB_sT4TSDSynsu9jEHVDjihV3bLvehcJQ"; 

const tg = window.Telegram.WebApp;
const sbClient = supabase.createClient(URL, KEY);

async function startApp() {
    // Сообщаем Telegram, что приложение готово к отрисовке
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    const nameElement = document.getElementById('user-name');
    const infoElement = document.getElementById('user-info');

    try {
        if (user) {
            // Запрос данных пользователя по его Telegram ID
            const { data, error } = await sbClient
                .from('users')
                .select('*')
                .eq('telegram_id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                // Если данные найдены, выводим имя и инфо из БД
                nameElement.innerText = data.name || user.first_name;
                infoElement.innerText = `${data.birth_date} • ${data.city}`;
            } else {
                // Если записи нет, показываем данные из Telegram
                nameElement.innerText = user.first_name;
                infoElement.innerText = "Профиль не заполнен. Вернитесь в бота.";
            }
        } else {
            // Для открытия в обычном браузере (тест)
            nameElement.innerText = "Звездный Странник";
            infoElement.innerText = "Демо-режим (вне Telegram)";
        }
    } catch (e) {
        console.error("Ошибка Supabase:", e);
        if (user) nameElement.innerText = user.first_name;
        infoElement.innerText = "Синхронизация временно недоступна";
    } finally {
        // Убираем лоадер с задержкой для плавности
        setTimeout(hideLoader, 1000);
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('app-content');
    
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
        setTimeout(() => content.style.opacity = "1", 50);
    }, 500);
}

function openModule(m) {
    tg.showAlert(`Модуль "${m}" настраивается. ИИ готовит ваш персональный разбор!`);
}

// Запуск приложения
startApp();
