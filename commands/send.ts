import { TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Configuration',
    description: 'Enviaun mensaje a cierto canal',

    permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: ({ message, interaction, args }) => {
        const channel = ( message ? message.mentions.channels.first() : interaction.options.getChannel('channel')) as TextChannel 
        if(!channel || channel.type !== 'GUILD_TEXT') {
            return 'Por favor taguea un canal de texto'
        }

        args.shift()
        const text = args.join(' ')

        channel.send(text)

        if (interaction) {
            interaction.reply({
                content: 'Mensaje enviado correctamente.',
                ephemeral: true,
            })
        }
    }
} as ICommand
