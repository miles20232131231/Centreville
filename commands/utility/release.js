const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '75', value: '75' },
                    { name: '80', value: '80' },
                    { name: '85 (should not be used frequently)', value: '85' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('drifting-status')
                .setDescription('Current drifting status.')
                .addChoices(
                    { name: 'On', value: 'On' },
                    { name: 'Corners Only', value: 'Corners Only' },
                    { name: 'Off', value: 'Off' }
                )
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');
            const driftingStatus = interaction.options.getString('drifting-status');

            const embed = new EmbedBuilder()
                .setTitle('<:heart:1268338760714686546>Centreville Session Release!<:heart:1268338760714686546>')
                .setDescription(`<:dot:1268338380417007696>{user} has released their session please follow the following instructions listed down below.
                    
                    **__Session Information__**

<:dot:1268338380417007696>If you need to make a report or anything please head to the #support Channel.
<:dot:1268338380417007696>Leaking the link to people that's currently not in the server will receive an Unappealable Ban!
<:dot:1268338380417007696>Make sure to have the proper roles for the vehicle you are driving & check the Centreville Banned Vehicle List. All Information will be provided there located in #information.`)
                .setImage("https://cdn.discordapp.com/attachments/1268920932983111690/1269002160675229708/Server_Information_3.png?ex=66ae79dc&is=66ad285c&hm=db4c84fea176abd893b7dcf78371f6beb65d79c05fd965907240b505fb049564&")
                .setFooter({
                    text: 'Centreville',
                    iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                });

            const sessionButton = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Success)
                .setCustomId('ls');

            const roleplayButton = new ButtonBuilder()
                .setLabel('Roleplay Information')
                .setStyle(ButtonStyle.Success)
                .setCustomId('roleplay-info');

            const row = new ActionRowBuilder()
                .addComponents(sessionButton, roleplayButton);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session in <#${interaction.channel.id}>`)
                .setFooter({
                    text: 'Centreville',
                    iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                });

            const logChannel = await interaction.client.channels.fetch('1268920429746061393');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@everyone', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls' || i.customId === 'roleplay-info';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    if (i.customId === 'ls') {
                        await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });
                    } else if (i.customId === 'roleplay-info') {
                        const roleplayEmbed = new EmbedBuilder()
                            .setTitle('Roleplay Information')
                            .setDescription(`
                                **Host:** <@${interaction.user.id}>
                                **Peacetime Status:** ${peacetimeStatus}
                                **FRP Speed:** ${frpSpeed}
                                **Drifting Status:** ${driftingStatus}
                            `)
                            .setFooter({
                                text: 'Centreville',
                                iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                            });
                        await i.followUp({ embeds: [roleplayEmbed], ephemeral: true });
                    }

                    const logEmbed = new EmbedBuilder()
                        .setTitle(i.customId === 'ls' ? `Session Link Button` : `Roleplay Information Button`)
                        .setDescription(`Button clicked by <@${i.user.id}> in <#${interaction.channel.id}>`)
                        .setFooter({
                            text: 'Centreville',
                            iconURL: 'https://cdn.discordapp.com/icons/1124611369510109285/74bbdd8ff08c064760338e259429b30d.webp?size=512'
                        });

                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
