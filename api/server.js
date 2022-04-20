const bot = require('../bot')
const express = require('express')
const app = express()
const port = 3000

app.get('/', async (req,res) => {
    const messages = await bot.guilds.fetch('565959084990267393')
        .then(guild => guild.channels.fetch('893031594728779787')
        .then(async channel => {
            const collectionMessages = await channel.messages.fetch({ limit: 5 })
            const lastMessage = collectionMessages.last()
            console.log(await lastMessage.edit({ embeds: [{
                title: '**Roles:**', 
                description: `@Admin - Our Discord Administrators.

                @BWC Actual - Community Leader.
                @BWC Executive Officer - BWC Actuals right hand.
                @BWC Command SgtMajor - BWC NCO leader and Actuals right hands left hand.
                
                @S-1 - Our Administrative Team.
                @S-1 Adjutant - The Administrative Teams Adjutants/Moderators.
                @S-1 IT - The IT Team of the community.
                @S-9 - Our Social Media Team.
                
                @Company Command - Our Games Company Command Teams.
                @Company Staff - Our Games Company Staff.
                @NBR NCO - Our Devoted NBR NCOs who help uphold our standards and rules.
                
                @BWC - Our BWC Members Role
                @Ambassador - Ambassadors from other communities or game representatives
                @Guest - Non-Members/Guests Role. Is given upon accepting our 📖│rules 
                
                @Duncecap - The mute/You broke the rules role.`, 
                color: bot.config.embedColor
            }]}))
            res.send('200')
        }))
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})