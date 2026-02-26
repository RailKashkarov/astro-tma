// ПРОВЕРЬ ЭТИ ЗНАЧЕНИЯ!
const URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const KEY = "sb_publishable_1vKg8mcLku8wGriVT_GeCg_fy8u84o-";

// Используем другое имя переменной, чтобы не путать с библиотекой
const sbClient = supabase.createClient(URL, KEY);
const tg = window.Telegram.WebApp;

async function startApp() {
    console.log("Приложение запускается...");
    try {
        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe?.user;

        if (user) {
            console.log("ID пользователя из TG:", user.id);
            
            // Пробуем получить данные
            const { data, error } = await sbClient
                .from('users')
                .select('*')
                .eq('telegram_id', user.id)
                .single();

            if (error) {
                console.warn("Данные в БД не найдены или ошибка:", error.message);
                document.getElementById('user-name').innerText = user.first_name || "Странник";
                document.getElementById('user-info').innerText = "Профиль еще не создан в боте";
            } else if (data) {
                console.log("Данные из БД получены:", data);
                document.getElementById('user-name').innerText = data.name || user.first_name;
                document.getElementById('user-info').innerText = `${data.birth_date} • ${data.city}`;
            }
        } else {
            document.getElementById('user-name').innerText = "Тестовый режим";
            document.getElementById('user-info').innerText = "Зайдите через Telegram бота";
        }

    } catch (e) {
        console.error("Критическая ошибка фронтенда:", e);
        document.getElementById('loader-text').innerText = "Ошибка связи: " + e.message;
    } finally {
        // Убираем анимацию загрузки В ЛЮБОМ СЛУЧАЕ через 1.5 секунды
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('app-content').classList.add('show');
            }, 500);
        }, 1500);
    }
}

function openModule(m) {
    tg.showAlert(`Модуль ${m} настраивается. ИИ готовит ваш разбор!`);
}

// Запуск
startApp();
