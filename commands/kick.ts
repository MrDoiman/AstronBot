import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Kickea a un usuario',

    permissions: ['KICK_MEMBERS'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: ({ message, interaction, args }) => {
        const target = message ? message.mentions.members?.first() : interaction.options.getMember('user') as GuildMember
        if (!target) {
            return 'Por favor taggea a alguien para kickearlo.'
        }

        if (!target.kickable) {
            return {
                custom: true,
                content: 'No puedes kickear a ese usuario',
                ephemeral: true,
            }
        }

        args.shift()
        const reason = args.join(' ')

        target.kick(reason)

        return {
            custom: true,
            content: `Has kickeado a <@${target.id}>`,
            ephemeral: true,
        }
    }

} as ICommand