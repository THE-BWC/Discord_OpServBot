exports.set = async (req, res) => {
    const client = req.app.get('client')

    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            ERROR_EmptyReqBody: "Request body cannot be empty"
        })
    }

    const {userId} = req.body
    if (!userId) {
        return res.status(400).json({
            ERROR_NoUserId: "Ensure you sent the userId"
        })
    }

    await client.discordNicknameController.setNickname(client, userId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}
