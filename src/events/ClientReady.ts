const { Events, ActivityType } = require("discord.js");

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: any) {
        console.log(`✅ Logged in : ${client.user.tag} (${client.user.id})`);

        client.user?.setPresence({
          activities: [
            {
              type: ActivityType.Custom,
              name: "custom",
              state: "Hello World! 🤓",
            },
          ],
        });

        const statuses = [
            "CTRL + C",
            "CTRL + V",
            "type /repo for github",
            "vtwi;t",
            "67 Mango Mustard",
            "Hello World! 🤓"
        ];

        let currentStatus = 0;

        setInterval(() => {
          currentStatus = (currentStatus + 1) % statuses.length;
          
          client.user?.setPresence({
            activities: [
              {
                type: ActivityType.Custom,
                name: "custom",
                state: statuses[currentStatus],
              },
            ],
          });
        }, 15000);
    },
};
