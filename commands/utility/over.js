const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding the first 2 messages.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); 
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            for (const msg of messagesToDelete.values()) {
                await msg.delete();
            }

            const embed = new EmbedBuilder()
                .setTitle('<:heart:1268338760714686546>Centreville Session Over!<:heart:1268338760714686546>')
                .setDescription(`<:dot:1268338380417007696>Thanks to <@${interaction.user.id}> for hosting that wonderful session. We hope we can see you members in our next sessions.
                    
                    <:dot:1268338380417007696>A 15-minute Cooldown has been permitted for this session. If other people request a session, please give them a mark.
                    
                    **__Session Information__**
                    <:dot:1268338380417007696> Start Time:${startTime}
                    <:dot:1268338380417007696> End Time:${endTime}`)
                .setColor(`#48E946`)
                .setFooter({
                    text: 'Centreville',
                    iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                });

                const newEmbed = new EmbedBuilder()
                .setTitle("Session Over")
                .setDescription(`<@${interaction.user.id}> has ended their session in `)
                .setFooter({
                    text: 'Centreville',
                    iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                });
    
            const targetChannel = await interaction.client.channels.fetch(`1269668812878385213`);
            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Command sent below.', ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({ content: 'Failed to delete messages. Please try again later.', ephemeral: true });
        }
    },
};
