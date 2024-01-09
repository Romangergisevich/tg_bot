const TelegramApi = require("node-telegram-bot-api");
const tgToken = "6564322584:AAHwufY6Tf_wloJhpa3ctdkkaWxI0vDtYaE";
const axios = require("axios");

const bot = new TelegramApi(tgToken, { polling: true });

// const gameOptions = {
//   reply_markup: JSON.stringify({
//     inline_keyboard: [
//       [
//         { text: "1", callback_data: "1" },
//         { text: "2", callback_data: "2" },
//         { text: "3", callback_data: "3" },
//       ],
//       [
//         { text: "4", callback_data: "4" },
//         { text: "5", callback_data: "5" },
//         { text: "6", callback_data: "6" },
//       ],
//       [
//         { text: "7", callback_data: "7" },
//         { text: "8", callback_data: "8" },
//         { text: "9", callback_data: "9" },
//       ],
//       [{ text: "0", callback_data: "0" }],
//     ],
//   }),
// };

bot.setMyCommands([
  { command: "/start", description: "Начало работы" },
  { command: "/info", description: "Информация о моих возможностях" },
  { command: "/weather", description: "Вывести погоду" },
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
    return bot.sendMessage(chatId, `Hail And Kill, Brother!`);
  }
  if (text == "/info") {
    return bot.sendMessage(
      chatId,
      `Hail to you, ${msg.from.first_name}. Что бы узнать погоду в своём местоположении, вышли свою геолокацию, либо введи команду /weather, тогда я выведу погоду в Бресте.`
    );
  }
  if (text == "/weather") {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${52.0975}&lon=${23.6877}&appid=b14e69a74786d8e6191dd31323bd1cc0`;
    const response = await axios.get(url);
    return bot.sendMessage(
      chatId,
      `На данный момент погода в Бресте выглядит так. температура воздуха: ${Math.floor(
        response.data.main.temp - 273.15
      )} ℃. Ощущается как ${Math.floor(
        response.data.main.feels_like - 273.15
      )} ℃. Скорость ветра: ${response.data.wind.speed} м/с. Влажность: ${
        response.data.main.humidity
      }%.`
    );
  } else {
    return bot.sendMessage(
      chatId,
      "Я не понимаю тебя. Попробуй ввести команду /info, она поможет ознакомиться с моими возможностями.");
  }
});
