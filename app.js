const URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbW51cXp2ZGd4YWRpc2p0YXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTMyMjcsImV4cCI6MjA4NzU4OTIyN30.3iHv_nhBdPZB_sT4TSDSynsu9jEHVDjihV3bLvehcJQ";

const tg = window.Telegram.WebApp;
const sbClient = supabase.createClient(URL, KEY);

async function startApp() {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    const infoElement = document.getElementById('user-info');
    const nameElement = document.getElementById('user-name');

    if (!user) {
        nameElement.innerText = "Вне Telegram";
        infoElement.innerText = "Запустите через бота";
        hideLoader();
        return;
    }

    try {
        // Пробуем найти пользователя. 
        // Number(user.id) гарантирует, что мы отправляем число, а не строку.
        const { data, error } = await sbClient
            .from('users')
            .select('*')
            .eq('telegram_id', Number(user.id)) 
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            nameElement.innerText = user.first_name;
            infoElement.innerText = "Данные не найдены в БД (Ошибка: " + error.code + ")";
        } else if (data) {
            nameElement.innerText = data.name || user.first_name;
            infoElement.innerText = `${data.birth_date} • ${data.city}`;
        }
    } catch (e) {
        infoElement.innerText = "Критическая ошибка: " + e.message;
    } finally {
        hideLoader();
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('app-content');
    loader.style.display = 'none';
    content.style.display = 'block';
    setTimeout(() => content.style.opacity = "1", 50);
}

startApp();
