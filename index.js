require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Users = require("./models/users");

const bot = new TelegramBot(process.env.TG_API_KEY, {polling: true});

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    bot.onText(/\/start/, async function (msg, match) {

        bot.sendMessage(msg.from.id, 'Я создан что бы унижать. Давай, попробуй вылить на меня свои токсины, посмотрим кто на кого их выльет! Впрочем даже если не станешь - я сам буду время от времени о себе напоминать. \n ' +
            'Для регуляции частоты сообщений введи команду /m {seconds} . Пример - /m 3600 будет отправлять сообщения 1 раз в час');
        let period = await getPeriod(msg.from.id);

        sleepAndSend(msg.chat.id, 0, period);
    });

    bot.onText(/\/m (.+)/, async function (msg, match) {
        await setPeriod(msg.from.id, match[1] * 1000)
        sleepAndSend(msg.chat.id, 0, match[1] * 1000);
    });
});

function sleepAndSend(chatId, index, timeout) {
    setTimeout(async function () {
        let response = getRandomHate(index)
        let sentSuccess = true;
        bot.sendMessage(chatId, response['item']).catch((error) => {
            sentSuccess = false;
        });
        if (sentSuccess) {
            let period = await getPeriod(chatId);
            console.log(period, timeout, period == timeout);
            if(period == timeout) {
                sleepAndSend(chatId, response['index'], period);
            }
        }
    }, timeout);
}

function getRandomHate(index) {
    let items = [
        'Кто-нибудь ампутируйте дурь из её башки и пересадите мне — хоть отдохну немного.',
        'Розовощекий мой поросеночек, слой косметики на твоем лице настолько толстый, что в нижних слоях, теоретически, можно найти останки какого-нибудь динозавра! А если взять в руки шпатель и соскоблить с тебя всю эту гадость, то получившейся массой можно накрасить всех путан Нью-Йоркского шоссе на протяжении 50 километров от Лос Анджелеса.',
        'Правильно говорят, человек есть то, что он ест, судя по всему, вы съели кого-то маленького, но очень толстого!',
        'Я сейчас выпишу тебе рецепт на два яичка, постарайся не тянуть с пересадкой!',
        'Поздравляю! Твой рекорд по произнесенным никому не интересным глупостям стал длиннее еще на одну фразу.',
        'Ну ладно, ты победила, можешь совершить свою ритуальную пляску, или принести в жертву черного козла, или что ты там делаешь, когда рада.',
        'Я разнесу тебя на столько маленьких кусочков, что даже моя бабушка, которая может собрать картинку чистого голубого неба из тысячи фрагментов за один час, не сможет тебя возродить никогда! Даже если вернётся в то время, когда еще видела.',
        'Вам, кажется, пора идти туда, где вы не были с самого рождения',
        'Я не говорю, что ты девушка с низкой социальной ответственностью. Но пароль на твоей киске: «12345».',
        'А по гороскопу ты не убогий и жалкий никто? А то так похоже',
        'Cражаться в интеллектуальной беседе с безоружным противником бессмысленно.',
        'Даже до уровня обезьян тебе нужно еще эволюционировать.',
        'Сходство между тобой и человеком не обнаружено.',
        'У меня тебе совет. Не размножайся. Ты тупиковая ветвь эволюции.',
        'Лучше бы ты остался в презервативе.',
        'Кажется, я в говно вляпался. Упс, это был ты?',
        'Медузы тоже живут без мозгов, и ты сможешь.',
        'У тебя голова похожа на декоративное приложение для задницы. Ты, судя по всему, ей думаешь.',
        'Санитары в курсе, что ты здесь?',
        'Вот сидит в человеке дерьмо, а он его гордо называет характером.',
        'Я не хочу сказать что ты неприятен в общении, но если бы я оказался на необитаемом острове с тобой и банкой тушенки, то съел бы тебя и разговаривал с тушенкой.',
        'Природа щедро обделила тебя всем.',
        'С такой самооценкой ты выйдешь замуж только за вибратор.',
        'Ты — единственные грабли, на которые я хочу ещё раз наступить. Точнее, не ты, а твоё лицо. Точнее я хочу наступить тебе на лицо.',
        'Давай согласимся на том, что ты обиженный жизнью убогий мудак.',
        'Любое сходство между вами и человеком является чисто случайным!',
        'Обратите внимание — плинтус. И запомните: это — именно ваш уровень.',
        'Толк-то из тебя вышел, да только вот беда — бестолочь осталась.'
    ];
    index = items[index] === undefined ? 0 : index;
    return {
        'item': items[index],
        'index': index + 1
    };
}

async function setPeriod(user_id, period) {
    if (await checkIssetPeriod(user_id)) {
        await Users.findOneAndUpdate({user_id: user_id}, { $set: { period: period } });
    } else {
        let small = new Users({user_id: user_id, period: period});
        await small.save();
    }
}

async function checkIssetPeriod(user_id) {
    let doc = await Users.findOne({user_id: user_id});
    return doc !== null;
}

async function getPeriod(user_id) {
    let user = await Users.findOne({user_id: user_id});
    if (user != null) {
        return user.period;
    } else {
        return 3600000;
    }
}
