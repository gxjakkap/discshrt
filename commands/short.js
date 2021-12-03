const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')
const apiUrl = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key='
var settings = require('./../settings.json');

async function getShortened(userInput) {
    const promise = axios.post(apiUrl.concat(settings.firebaseApiKey), {"dynamicLinkInfo": {"domainUriPrefix": settings.domainUriPrefix, "link": userInput}, "suffix": {"option": "SHORT"}})
    const dataPromise = promise.then((response) => response.data.shortLink)
    return dataPromise
}

async function getUnguessable(userInput) {
    const promise = axios.post(apiUrl.concat(settings.firebaseApiKey), {"dynamicLinkInfo": {"domainUriPrefix": settings.domainUriPrefix, "link": userInput}, "suffix": {"option": "UNGUESSABLE"}})
    const dataPromise = promise.then((response) => response.data.shortLink)
    return dataPromise
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('Shorten link with Firebase dynamic link')
        .addStringOption(options => options.setName('input').setDescription('Url').setRequired(true))
        .addStringOption(options => options.setName('option').setDescription('Specifies if the link should be unguessable or short. Check README for details.')),
    async execute(interaction) {
        var userInput = interaction.options.getString('input')
        var userOption = interaction.options.getString('option')
        if (userOption === 'SHORT' || userOption === 'short'){
            getShortened(userInput)
            .then(data => {
                const embed = new MessageEmbed()
                    .setColor("#596869")
                    .setTitle("Results")
                    .addFields(
                        { name: 'Original', value: userInput},
                        { name: 'Shortened Link', value: data}
                    )
                interaction.reply({ embeds: [embed]})

            })
            .catch(err => console.log(err))
        }
        else if (userOption === 'UNGUESSABLE' || userOption === 'unguessable' || userOption === 'unguess' || userOption === 'random'){
            getUnguessable(userInput)
            .then(data => {
                const embed = new MessageEmbed()
                    .setColor("#596869")
                    .setTitle("Results")
                    .addFields(
                        { name: 'Original', value: userInput},
                        { name: 'Dynamic Link', value: data}
                    )
                interaction.reply({ embeds: [embed]})

            })
            .catch(err => console.log(err))
        }
        else {
            getShortened(userInput)
            .then(data => {
                const embed = new MessageEmbed()
                    .setColor("#596869")
                    .setTitle("Results")
                    .addFields(
                        { name: 'Original', value: userInput},
                        { name: 'Shortened Link', value: data}
                    )
                interaction.reply({ embeds: [embed]})

            })
            .catch(err => {console.log(err)})
        }
        
    }
}