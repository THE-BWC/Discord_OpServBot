exports.getAllVoiceChannels = async (req, res) => {
    const client = req.app.get('client')

    await client.discordChannelsController.getAllVoiceChannels(client)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}
