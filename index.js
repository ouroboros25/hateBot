const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1935058890:AAFVrgut97OhviqnmimT6kfFjG3p0GNI-D4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    sleepAndSend(chatId, 0);
});

function sleepAndSend(chatId, index) {
    setTimeout(function () {
        let response = getRandomHate(index)
        let sentSuccess = true;
        bot.sendMessage(chatId, response['item']).catch((error) => {
            sentSuccess = false;
        });
        if(sentSuccess){
            sleepAndSend(chatId, response['index']);
        }
    }, 1000);
}

function getRandomHate(index) {
    let items = [
        'Deins is jopa',
        'Deins is jopa2',
        'Deins is jopa3',
        'Deins is jopa4'
    ];
    index = items[index] === undefined ? 0 : index;
    return {
        'item': items[index],
        'index': index + 1
    };
}