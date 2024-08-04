const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('<:heart:1268338760714686546>Centreville Session Startup!<:heart:1268338760714686546>')
            .setDescription(`<:dot:1268338380417007696>${user} is now commencing a Session Startup please get us to 7+ reactions to start/setup this session.
                
                **__Session Information__**
<:dot:1268338380417007696>Before joining Centreville sessions you must be notified of the civilian regulations/banned vehicle policy. You must drive the following vehicles listed in the restricted vehicles list. If you fail to follow the commands being provided you will be removed.
<:dot:1268338380417007696>Leaking any of Centreville Sessions it will be a Unappealable Ban. This means you cannot appeal the ban when getting banned from Centreville .
<:dot:1268338380417007696>Impersonating Staff, impersonating other moderation and law enforcement you will get a double infraction for this action. We suggest don't break any rules!`)
            .setColor(`#48E946`)
            .setFooter({
                text: 'Centreville',
                iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
            });

        const message = await interaction.channel.send({
            content: '@everyone, @here',
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has started up a session in <#${channel.id}>`)
            .setFooter({
                text: 'Centreville',
                iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
            });

        const targetChannel = await interaction.client.channels.fetch('1269668812878385213');
        await targetChannel.send({ embeds: [newEmbed] });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up')
                    .setFooter({
                        text: 'Centreville',
                        iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                    });

                interaction.channel.send({ embeds: [settingUpEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `Message has been sent below.`, ephemeral: true });
    },
};
