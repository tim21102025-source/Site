import asyncio
from aiogram import Bot
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = "7514457087:AAHBwcuP39TrMQ1A4ey-X_bsPUgI8sj7IuE"
CHAT_ID = 8283677886

TEXT = """<b>Вікна та двері, що служать роками! 🛠️🏠</b>

Допомагаємо за програмою «єВідновлення»

Команда <b>UWS</b> (Ukrainian Window Systems) забезпечує затишок та безпеку у ваших домівках та офісах з 2015 року. Ми не лише встановлюємо та ремонтуємо вікна, а й активно працюємо з програмою «єВідновлення», допомагаючи відновити пошкоджені конструкції швидко та якісно.

<b>Чому обирають нас:</b>

✅ Офіційна гарантія на роботу до 5 років.
✅ Тільки перевірена фурнітура: MACO, ROTO, GU, Siegenia.
✅ Безкоштовний виїзд майстра для діагностики та розрахунку.

<b>Маєте питання або пошкоджені вікна?</b>
Надсилайте фото у месенджери для швидкого прорахунку!

🌐 <b>Наш сайт:</b> <a href="https://uws.com.ua/">uws.com.ua</a>
📧 <b>Пошта для зв'язку:</b> <a href="mailto:uws.kyiv@gmail.com">uws.kyiv@gmail.com</a>

📞 <b>Телефонуйте:</b>
<a href="tel:+380660575202">(066) 057-52-02</a>, <a href="tel:+380989478772">(098) 947-87-72</a>, <a href="tel:+380633664769">(063) 366-47-69</a>

💬 <b>Пишіть нам:</b> Viber | Telegram | WhatsApp

<i>UWS — Досвід. Якість. Гарантія.</i>"""


async def main():
    bot = Bot(token=BOT_TOKEN)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🌐 Сайт UWS", url="https://uws.com.ua/"),
            ],
            [
                InlineKeyboardButton(text="💜 Viber", url="https://vb.me/uws_com_ua"),
                InlineKeyboardButton(text="💬 Telegram", url="https://t.me/+380660575202"),
                InlineKeyboardButton(text="📲 WhatsApp", url="https://wa.me/380660575202"),
            ],
        ]
    )

    result = await bot.send_message(
        chat_id=CHAT_ID,
        text=TEXT,
        parse_mode="HTML",
        reply_markup=kb,
    )
    print(f"Message sent! message_id={result.message_id}")
    await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
