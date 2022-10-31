exports.sync = async (req, res) => {
    const client = req.app.get('client')

    await client.discordEventsController.sync(client)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.createEvent = async (req, res) => {
    const client = req.app.get('client')

    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            ERROR_EmptyReqBody: "Request body cannot be empty"
        })
    }

    const {operationId} = req.body
    if (!operationId) {
        return res.status(400).json({
            ERROR_NoOperationId: "Ensure you sent the operationId"
        })
    }

    await client.discordEventsController.createEvent(client, operationId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.updateEvent = async (req, res) => {
    const client = req.app.get('client')

    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            ERROR_EmptyReqBody: "Request body cannot be empty"
        })
    }

    const {operationId} = req.body
    if (!operationId) {
        return res.status(400).json({
            ERROR_NoOperationId: "Ensure you sent the operationId"
        })
    }

    await client.discordEventsController.updateDiscordEvent(client, operationId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.updateEvents = async (req, res) => {
    const client = req.app.get('client')

    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            ERROR_EmptyReqBody: "Request body cannot be empty"
        })
    }

    let {operationIds} = req.body
    operationIds = JSON.parse(operationIds)
    if (operationIds.length <= 1) {
        return res.status(400).json({
            ERROR_NoOperationIds: "Ensure you sent an array of operationIds"
        })
    }

    await client.discordEventsController.updateDiscordEvents(client, operationIds)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.delete = async (req, res) => {
    const client = req.app.get('client')

    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            ERROR_EmptyReqBody: "Request body cannot be empty"
        })
    }

    const {operationId} = req.body
    if (!operationId) {
        return res.status(400).json({
            ERROR_NoOperationId: "Ensure you sent the operationId"
        })
    }

    await client.discordEventsController.deleteDiscordEvent(client, operationId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}
