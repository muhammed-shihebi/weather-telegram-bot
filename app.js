const Telegraf = require('telegraf');
const express = require("express");
const app = express();
const https = require("https");
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	ctx.reply(`Hello ${ctx.from.first_name}, would you like to know the Weather? Please send the name of the city in which you want to know the weather`)
})
bot.help((ctx) => ctx.reply('Send me the name of the city you want to know its weather condition today.'))

bot.on('text', (ctx) => {
	const cityName = ctx.message.text;

	var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.OPEN_WEAThER_TOKEN}`;

	https.get(url, (response) => {
		if (response.statusCode === 200) {
			response.on("data", (data) => {
				// console.log(JSON.parse(data));
				var result = JSON.parse(data);
				const cityName = result.name;
				const temp = result.main.temp;
				const des = result.weather[0].description;
				const conditionIcon = result.weather[0].icon;
				const imageUrl = "https://openweathermap.org/img/wn/" + conditionIcon + "@4x.png";
				ctx.replyWithPhoto({
					url: imageUrl
				}, {
					caption: `City: <b>${cityName}</b>\nTemperature: <b>${temp} c</b> \nDescription: <b>${des}</b>`,
					parse_mode: 'html'
				}
				);
			});
		} else {
			ctx.reply(`${cityName} is not a city name.`);
		}
	});
});
bot.launch();