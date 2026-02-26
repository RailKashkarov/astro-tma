// ВАЖНО: Замени на свои реальные данные из Supabase Settings -> API
const S_URL = "https://nimnuqzvdgxadisjtapp.supabase.co"; 
const S_KEY = "sb_publishable_1vKg8mcLku8wGriVT_GeCg_fy8u84o-";

const supabaseClient = supabase.createClient(S_URL, S_KEY);
const tg = window.Telegram.WebApp;

async function initApp() {
    try {
        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe?.user;

        if (user) {
            // Запрашиваем данные из таблицы users
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('telegram_id', user.id)
                .single();

            if (data) {
                document.getElementById('user-name').innerText = data.name || user.first_name;
                document.getElementById('user-info').innerText = `${data.birth_date} • ${data.city}`;
            } else {
                document.getElementById('user-name').innerText = user.first_name;
                document.getElementById('user-info').innerText = "Профиль не найден в БД";
            }
        } else {
            document.getElementById('user-name').innerText = "Вход вне Telegram";
        }
    } catch (err) {
        console.error("Ошибка инициализации:", err);
    } finally {
        // Убираем загрузку в любом случае через 1 секунду
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
        }, 800);
    }
}

function openModule(type) {
    tg.showConfirm(`Открыть модуль ${type}? Разбор от ИИ будет готов через мгновение.`);
}

initApp();
