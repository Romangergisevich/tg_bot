const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, newGameOptions} = require('./options')
const tgToken = '6564322584:AAHwufY6Tf_wloJhpa3ctdkkaWxI0vDtYaE';

const chats = {};

const bot = new TelegramApi(tgToken, {polling: true});

// bot.setMyCommands([
//     {command: '/start', description: 'Начало работы'},
//     {command: '/info', description: 'Информация'},
// ])

// bot.on('message', async msg => {
//     const text = msg.text;
//     const chatId = msg.chat.id;

//     if(text == '/start') {
//         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/3.webp')
//         await bot.sendMessage(chatId, `Hail And Kill Brother!`);
//     }
//     if(text == '/info') {
//         await bot.sendMessage(chatId, `Hail to the ${msg.from.first_name}`)
//     }
// })

const newGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты попытайся отгадать.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'игра в "отгадай цифру"'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text == '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/3.webp')
            return bot.sendMessage(chatId, `Hail And Kill, Brother!`);
        }
        if(text == '/info') {
            return bot.sendMessage(chatId, `Hail to the ${msg.from.first_name}`)
        }
        if( text == '/game') {
            return newGame(chatId);
        }else {
            return bot.sendMessage(chatId, 'Не понял тебя')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data == '/newGame') {
            return newGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал. Загаданной цифрой была ${chats[chatId]}`, newGameOptions);
        } else {
            return await bot.sendMessage(chatId, `Не угадал. Была загадана цифра ${chats[chatId]}`, newGameOptions);
        }
    })
}

start();