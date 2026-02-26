const URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbW51cXp2ZGd4YWRpc2p0YXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTMyMjcsImV4cCI6MjA4NzU4OTIyN30.3iHv_nhBdPZB_sT4TSDSynsu9jEHVDjihV3bLvehcJQ";

const tg = window.Telegram.WebApp;
const log = (msg) => { document.getElementById('debug-log').innerHTML += msg + "<br>"; };

async function start() {
    log("Запуск скрипта...");
    tg.ready();
    tg.expand();

    // Аварийный таймер на 4 секунды
    setTimeout(() => {
        if (document.getElementById('loader').style.display !== 'none') {
            log("Таймер: Принудительный вход...");
            showUI();
        }
    }, 4000);

    try {
        log("Подключение к базе...");
        const sb = supabase.createClient(URL, KEY);
        const user = tg.initDataUnsafe?.user;

        if (user) {
            log("Пользователь: " + user.id);
            const { data, error } = await sb.from('users').select('*').eq('telegram_id', user.id).single();
            
            if (data) {
                document.getElementById('user-name').innerText = data.name || user.first_name;
                document.getElementById('user-info').innerText = `${data.birth_date || ''} • ${data.city || ''}`;
            } else {
                log("Запись в БД не найдена");
                document.getElementById('user-name').innerText = user.first_name;
            }
        } else {
            log("Запуск вне TG");
            document.getElementById('user-name').innerText = "Демо-режим";
        }
    } catch (e) {
        log("ОШИБКА: " + e.message);
    } finally {
        showUI();
    }
}

function showUI() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

start();
