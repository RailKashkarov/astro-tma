// Вставь свои данные из Supabase
const SUPABASE_URL = "https://nimnuqzvdgxadisjtapp.supabase.co";
const SUPABASE_KEY = "sb_publishable_1vKg8mcLku8wGriVT_GeCg_fy8u84o-";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

async function loadUserData() {
    const user = tg.initDataUnsafe?.user;
    
    if (!user) {
        document.getElementById('user-name').innerText = "Ошибка доступа";
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', user.id)
        .single();

    if (data) {
        document.getElementById('user-name').innerText = data.name || user.first_name;
        document.getElementById('user-info').innerText = `${data.birth_date} • ${data.city}`;
    } else {
        document.getElementById('user-name').innerText = "Профиль не найден";
    }
    
    document.getElementById('loader').style.display = 'none';
}

function openModule(type) {
    // ЗАГЛУШКА ДЛЯ ИИ
    tg.showAlert(`Модуль "${type}" находится в разработке. Скоро ИИ проведет ваш персональный разбор!`);
}

loadUserData();
