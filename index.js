require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const tgToken = process.env.TG_TOKEN;
const { defaultKeyboard, inlineKeyboardPanel } = require("./buttons");
const axios = require("axios");
const bot = new TelegramApi(tgToken, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Начало работы" },
  { command: "/info", description: "Информация о моих возможностях" },
]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (msg.location) {
    let latitude = msg.location.latitude;
    let longitude = msg.location.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b14e69a74786d8e6191dd31323bd1cc0`;
    const response = await axios.get(url);
    return bot.sendMessage(
      chatId,
      `На данный момент погода в ${
        response.data.name
      } выглядит так. Температура воздуха: ${Math.floor(
        response.data.main.temp - 273.15
      )} ℃. Ощущается как ${Math.floor(
        response.data.main.feels_like - 273.15
      )} ℃. Скорость ветра: ${response.data.wind.speed} м/с. Влажность: ${
        response.data.main.humidity
      }%.`
    );
  }
  if (text == "/start") {
    return bot.sendMessage(
      chatId,
      `Привет, ${msg.from.first_name}!`,
      inlineKeyboardPanel
    );
  }
  if (text == "/info") {
    return bot.sendMessage(
      chatId,
      `Hail to you, ${msg.from.first_name}. Что бы узнать погоду в своём местоположении, вышли свою геолокацию, либо введи команду /weather, тогда я выведу погоду в Бресте.`,
      inlineKeyboardPanel
    );
  }
  if (text == "Покажи погоду") {
    console.log(msg);
  } else {
    return bot.sendMessage(
      chatId,
      "Я не понимаю тебя. Попробуй ввести команду /info, она поможет ознакомиться с моими возможностями."
    );
  }
});

bot.on("callback_query", (msg) => {
  const chatId = msg.message.chat.id;
  console.log(msg);
  bot.sendMessage(
    chatId,
    "Что бы узнать погоду вышлите мне геолокацию или нажмите  на кнопку ниже",
    defaultKeyboard
  );
});
