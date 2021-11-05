import { Client, GuildMember, Interaction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Role, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Configuration',
    description: 'Añadir role a un mensaje de autorol',

    permissions: ['ADMINISTRATOR'],

    minArgs: 3,
    maxArgs: 3,
    expectedArgs: '<channel> <messageId> <role>',
    expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE'],

    slash: 'both',
    testOnly: true,
    guildOnly: true, 

    init: (client: Client) => {
        client.on('interactionCreate', interaction => {
            if (!interaction.isSelectMenu()) {
                return
            }

            const { customId, values, member } = interaction

            if (customId === 'auto_role' && member instanceof GuildMember) {
                const component = interaction.component as MessageSelectMenu
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for (const id of removed) {
                    member.roles.remove(id.value)
                }

                for (const id of values) {
                    member.roles.add(id)
                }

                interaction.reply({
                    content: 'Roles actualizados',
                    ephemeral: true
                })
            }
        })
    },
    
    callback: async ({ message, interaction, args, client }) => {
        const channel = ( message ? message.mentions.channels.first() : interaction.options.getChannel('channel')) as TextChannel
        if(!channel || channel.type !== 'GUILD_TEXT') {
            return 'Por favor taguea un canal de texto'
        }

        const messageId = args[1]

        const role = ( message 
            ? message.mentions.roles.first() 
            : interaction.options.getRole('role')
        ) as Role
        if (!role) {
            return 'Rol desconocido'
        }

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true,
        })

        if (!targetMessage) {
            return 'ID de mensaje desconocida'
        }

        if (targetMessage.author.id !== client.user?.id) {
            return `Proporciona la ID del mensaje que fué enviada desde <@${client.user?.id}>`
        }

        let row = targetMessage.components[0] as MessageActionRow
        if (!row) {
            row = new MessageActionRow()
        }

        const option: MessageSelectOptionData[] = [
            {
            label: role.name,
            value: role.id
            }
        ]

        let menu = row.components[0] as MessageSelectMenu
        if (menu) {
            for (const o of menu.options) {
                if (o.value === option[0].value) {
                    return {
                        custom: true,
                        content: `<@&${o.value}> ya forma parte de este menu.`,
                        allowedMentions: {
                            roles: [],
                        },
                        ephemeral: true,
                    }
                }
            }
            
            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                    .setCustomId('auto_roles')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .setPlaceholder('Selecciona tus roles...')
                    .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row]
        })

        return {
            custom: true,
            content: `Añadir <@&${role.id}> al menú de autoroles.`,
            allowedMentions: {
                roles: [],
            },
            ephemeral: true
        }
    },
} as ICommand