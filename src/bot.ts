import { Bot, InlineKeyboard } from "grammy";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const bot = new Bot(process.env.BOT_TOKEN || "");
const TMA_URL = "https://railkashkarov.github.io/astro-tma/"; 

// Функции расчета
function getZodiacSign(day: number, month: number): string {
    const signs = ["Козерог", "Водолей", "Рыбы", "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец"];
    const lastDays = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
    const threshold = lastDays[month - 1] || 0;
    return day > threshold ? (signs[month % 12] || "Звезда") : (signs[month - 1] || "Звезда");
}

function getHDType(day: number, month: number, year: number): string {
    const types = ["Генератор", "Проектор", "Манифестор", "Рефлектор", "Манифестирующий Генератор"];
    const magicNumber = (day + month + year) % types.length;
    return types[magicNumber] || "Генератор";
}

bot.command("start", async (ctx) => {
    const tgUser = ctx.from;
    if (!tgUser) return;

    const { data: user } = await supabase.from("users").select("*").eq("telegram_id", tgUser.id).single();
    if (!user) {
        await supabase.from("users").insert([{ telegram_id: tgUser.id, username: tgUser.first_name }]);
    }

    const keyboard = new InlineKeyboard().webApp("🚀 Открыть Astro App", TMA_URL);
    await ctx.reply(`Привет, ${tgUser.first_name}! Напиши дату рождения (ДД.ММ.ГГГГ)`, { reply_markup: keyboard });
});

bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    const match = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    // Эта проверка убирает красные линии в VS Code
    if (match && match[1] && match[2] && match[3] && ctx.from) {
        const d = parseInt(match[1]);
        const m = parseInt(match[2]);
        const y = parseInt(match[3]);

        const sign = getZodiacSign(d, m);
        const hdType = getHDType(d, m, y);

        await supabase.from("users").update({ 
            birth_date: text, 
            zodiac_sign: sign, 
            hd_type: hdType 
        }).eq("telegram_id", ctx.from.id);

        await ctx.reply(`✅ Сохранено!\nЗнак: ${sign}\nТип: ${hdType}`);
    } else {
        await ctx.reply("Напиши дату правильно: ДД.ММ.ГГГГ");
    }
});

console.log("Бот запущен!");
bot.start();