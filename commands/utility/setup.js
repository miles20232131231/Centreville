const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sends a setup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction) {
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('<:heart:1268338760714686546>Centreville Setting Up!<:heart:1268338760714686546>')
            .setDescription(`<:dot:1268338380417007696>{user} is now setting up their session. Please wait until Emergency Services, Nitro Boosters, and Server Staff. Is ready for release. Thanks! Make sure to register your vehicle located in <#1267626448248639602>.`)
            .setColor(`#48E946`)
            .setFooter({
                text: 'Centreville',
                iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
            });

        const message = await interaction.channel.send({
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("setting up")
            .setDescription(`<@${interaction.user.id}> setting up a session in <#${channel.id}>`)
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
