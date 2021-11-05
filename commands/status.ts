import { ICommand } from "wokcommands";

export default {
    category: 'Configuration',
    description: 'Establece el estado del bot',

    permissions: ["ADMINISTRATOR"],

    minArgs: 1,
    expectedArgs: '<status>',

    slash: "both",
    testOnly: true,
    
    callback: ({ client, text }) => {
        client.user?.setPresence({
            status: 'dnd',
            activities: [
                {
                    name: text
                },
            ],
        })

        return "Estado actualizado"
    },
} as ICommand