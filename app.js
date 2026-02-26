const URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbW51cXp2ZGd4YWRpc2p0YXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTMyMjcsImV4cCI6MjA4NzU4OTIyN30.3iHv_nhBdPZB_sT4TSDSynsu9jEHVDjihV3bLvehcJQ";

const tg = window.Telegram.WebApp;
const sb = supabase.createClient(URL, KEY);

function log(msg) {
    console.log(msg);
    const d = document.getElementById('debug-log');
    if(d) d.innerHTML += msg + "<br>";
}

async function start() {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    
    try {
        if (!user) {
            document.getElementById('user-name').innerText = "Демо-режим";
            document.getElementById('user-info').innerText = "Откройте через Telegram";
        } else {
            log("Ищем пользователя: " + user.id);
            
            // Пытаемся найти пользователя (пробуем и как число, и как строку если надо)
            const { data, error } = await sb
                .from('users')
                .select('*')
                .eq('telegram_id', user.id)
                .single();

            if (data) {
                document.getElementById('user-name').innerText = data.name || user.first_name;
                document.getElementById('user-info').innerText = `${data.birth_date || ''} • ${data.city || ''}`;
            } else {
                log("В базе пусто. Проверьте ID или RLS.");
                document.getElementById('user-name').innerText = user.first_name;
                document.getElementById('user-info').innerText = "Данные не подтянулись";
            }
        }
    } catch (e) {
        log("Ошибка: " + e.message);
    } finally {
        setTimeout(showApp, 800);
    }
}

function showApp() {
    document.getElementById('loader').style.display = 'none';
    const content = document.getElementById('app-content');
    content.style.display = 'block';
    setTimeout(() => content.style.opacity = "1", 50);
}

// Функции модального окна
function openModule(type) {
    const m = document.getElementById('modal');
    const t = document.getElementById('modal-title');
    m.style.display = 'block';
    
    const titles = {
        'natal': '🪐 Натальный разбор',
        'hd': '🧬 Дизайн Человека',
        'finance': '💎 Финансовый код',
        'horo': '🔮 Прогноз на день'
    };
    t.innerText = titles[type] || 'Разбор';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Запуск
start();
