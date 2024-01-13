module.exports = {
  weatherKeyboard: {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      keyboard: [
        [
          { text: "Погода в Бресте" },
          { text: "Погода в геолокации", request_location: true },
        ],
      ],
    }),
  },

  inlineKeyboardPanel: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "погода", callback_data: "weather_show" },
          { text: "2", callback_data: "2" },
          { text: "3", callback_data: "3" },
        ],
      ],
    }),
  },

  removeKeyboard: {
    reply_markup: JSON.stringify({
      remove_keyboard: true,
    }),
  },
};
