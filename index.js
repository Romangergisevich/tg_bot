require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const tgToken = process.env.TG_TOKEN;
const {
  inlineWeatherButton,
  inlineKeyboardPanel,
  weatherKeyboard,
  removeKeyboard,
} = require("./buttons");
const axios = require("axios");
const bot = new TelegramApi(tgToken, { polling: true });

const weatherRequest = async (lat, long) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=b14e69a74786d8e6191dd31323bd1cc0`;
  const response = await axios.get(url);
  return response;
};

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
    const response = await weatherRequest(latitude, longitude);
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
      }%.`, removeKeyboard
    );
  }
  if (text == "/start") {
    return bot.sendMessage(
      chatId,
      `Привет, ${msg.from.first_name}! Чтобы ознакомиться с моими возможностями ты можешь ввести команду /info`
    );
  }
  if (text == "/info") {
    return bot.sendMessage(
      chatId,
      `Hail to you, ${msg.from.first_name}. На данный момент я могу вывести погоду в Бресте или в твоей геолокации, если твоё устройство позволяет передать геолокацию`,
      inlineKeyboardPanel
    );
  }
  if (text == "Погода в Бресте") {
    const response = await weatherRequest(52.0975, 23.6877);
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
      }%.`,
      removeKeyboard
    );
  } else {
    return bot.sendMessage(
      chatId,
      "Я не понимаю тебя. Попробуй ввести команду /info, она поможет ознакомиться с моими возможностями."
    );
  }
});

bot.on("callback_query", async (msg) => {
  const chatId = msg.message.chat.id;
  console.log(msg);
  if (msg.data == "weather_show") {
    return bot.sendMessage(
      chatId,
      "Что бы узнать погоду вышли мне геолокацию или нажми на одну из кнопок ниже",
      (reply_markup = weatherKeyboard)
    );
  }
});
