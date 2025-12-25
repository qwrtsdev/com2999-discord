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
            "🧡 KMITL",
            "🧡 KMUTNB",
            "🧡 KMUTT",
            "🩷 CHULA",
            "💚 KASETSART",
            "❤️ THAMMASAT",
            "Type /repo for source",
            "vtwi;t",
            "67 Mango Mustard",
            "Hello World! 🤓",
            "I <3 YOU 3000"
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
