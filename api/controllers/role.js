exports.sync = async (req, res) => {
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

    await client.discordRolesController.syncRole(client, userId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

// exports.givebwc = async (req, res) => {
//     const client = req.app.get('client')
//
//     if (!Object.keys(req.body).length) {
//         return res.status(400).json({
//             ERROR_EmptyReqBody: "Request body cannot be empty"
//         })
//     }
//
//     const {userId} = req.body
//     if (!userId) {
//         return res.status(400).json({
//             ERROR_NoUserId: "Ensure you sent the userId"
//         })
//     }
//
//     await client.discordRolesController.giveBWCRole(client, userId)
//         .then(result => {
//             return res.status(200).json(result)
//         })
//         .catch(err => {
//             client.logger.error(err.stack)
//             return res.status(500).json(err)
//         })
// }
//
// exports.removebwc = async (req, res) => {
//     const client = req.app.get('client')
//
//     if (!Object.keys(req.body).length) {
//         return res.status(400).json({
//             ERROR_EmptyReqBody: "Request body cannot be empty"
//         })
//     }
//
//     const {userId} = req.body
//     if (!userId) {
//         return res.status(400).json({
//             ERROR_NoUserId: "Ensure you sent the userId"
//         })
//     }
//
//     await client.discordRolesController.removeBWCRole(client, userId)
//         .then(result => {
//             return res.status(200).json(result)
//         })
//         .catch(err => {
//             client.logger.error(err.stack)
//             return res.status(500).json(err)
//         })
// }

exports.give = async (req, res) => {
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

    const {roleId} = req.body
    if (!roleId) {
        return res.status(400).json({
            ERROR_NoRoleId: "Ensure you sent the roleId"
        })
    }

    await client.discordRolesController.giveRole(client, userId, roleId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.remove = async (req, res) => {
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

    const {roleId} = req.body
    if (!roleId) {
        return res.status(400).json({
            ERROR_NoRoleId: "Ensure you sent the roleId"
        })
    }

    await client.discordRolesController.removeRole(client, userId, roleId)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.forceSyncAllUsers = async (req, res) => {
    const client = req.app.get('client')

    await client.discordRolesController.forceSyncUsers(client)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}

exports.fetchAllRoles = async (req, res) => {
    const client = req.app.get('client')

    await client.discordRolesController.fetchAllRoles(client)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            client.logger.error(err.stack)
            return res.status(500).json(err)
        })
}
