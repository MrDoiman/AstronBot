import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Banea a un usuario',

    permissions: ['BAN_MEMBERS'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: ({ message, interaction, args }) => {
        const target = message ? message.mentions.members?.first() : interaction.options.getMember('user') as GuildMember
        if (!target) {
            return 'Por favor taggea a alguien para banearlo.'
        }

        if (!target.bannable) {
            return {
                custom: true,
                content: 'No puedes banear a ese usuario',
                ephemeral: true,
            }
        }

        args.shift()
        const reason = args.join(' ')

        target.ban({
            reason,
            days: 7
        })

        return {
            custom: true,
            content: `Has baneado a <@${target.id}>`,
            ephemeral: true,
        }
    }

} as ICommand