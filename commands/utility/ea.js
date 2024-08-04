const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('')
            .setDescription(``)
            .setColor(`#48E946`)
            .setFooter({
                text: 'Centreville',
                iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.png?size=4096'
            });

        const button = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Success)
            .setCustomId('ea');

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ 
            content: '<@&1257404105102590233>, <@&1242332685255311423>', 
            embeds: [embed], 
            components: [row] 
        });

        await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

        const filter = i => i.customId === 'ea';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

        collector.on('collect', async i => {
            const logChannel = interaction.guild.channels.cache.get('1269668812878385213');
            if (logChannel) {
                await logChannel.send(`Interaction collected from ${i.user.tag} at ${new Date().toISOString()}`);
            }

            if (i.member.roles.cache.has('1242332685255311423') ||
                i.member.roles.cache.has('1249888919089188895') ||  
                i.member.roles.cache.has('1257404105102590233') || 
                i.member.roles.cache.has('1267840971941613691') || 
                i.member.roles.cache.has('1255231498051780725') || 
                i.member.roles.cache.has('1249888920888414312') || 
                i.member.roles.cache.has('1249888920251138071')) {
                await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
            } else {
                await i.reply({ 
                    content: 'You do not have this special role, given early access to some perks and content previews. If you wish to get this role, go to support ticket and follow the instructions. Start to enjoy all the benefits of being a holder of one of the special roles once you get the role!', 
                    ephemeral: true 
                });
            }
        });

        collector.on('end', async collected => {
            const logChannel = interaction.guild.channels.cache.get('1269668812878385213');
            if (logChannel) {
                await logChannel.send(`Collected ${collected.size} interactions.`);
            }
        });

        collector.on('error', async error => {
            const logChannel = interaction.guild.channels.cache.get('1269668812878385213');
            if (logChannel) {
                await logChannel.send(`Collector encountered an error: ${error}`);
            }
            console.error('Collector encountered an error:', error);
        });
    },
};
