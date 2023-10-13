import { OperationModel } from '../models/bot/index.js';

/**
 * Get all operations from database.
 *
 * @returns {Promise<OperationModel[]>} Promise with all operations.
 */
export const getAllOperations = async (): Promise<OperationModel[]> => {
    return await OperationModel.findAll({
        order: [
            ['start_time', 'ASC']
        ]
    });
}

/**
 * Get all operations from database by gameId.
 *
 * @param {number} gameId Game ID to get operations for.
 *
 * @returns {Promise<OperationModel[]>} Promise with all operations for the game.
 */
export const getOperationsByGameId = async (gameId: number): Promise<OperationModel[]> => {
    return await OperationModel.findAll({
        where: {
            game_id: gameId
        },
        order: [
            ['start_time', 'ASC']
        ]
    });
}

/**
 * Insert new operations into database.
 *
 * @param {OperationModel[]} operations Operations to insert.
 *
 * @returns {Promise<OperationModel[]>} Promise with inserted operations.
 */
export const insertOperations = async (operations: OperationModel[]): Promise<OperationModel[]> => {
    return await OperationModel.bulkCreate(operations, {
        updateOnDuplicate: ["operation_name", "is_completed", "type_name", "date_start", "date_end", "leader_username", "game_id", "tag", "game_name", "edited_date", "is_opsec"]
    });
}

/**
 * Delete operations from database.
 *
 * @param {number[]} operationIds Operation IDs to delete.
 *
 * @returns {Promise<number>} Promise with number of deleted operations.
 */
export const deleteOperations = async (operationIds: number[]): Promise<number> => {
    return await OperationModel.destroy({
        where: {
            operation_id: operationIds
        }
    });
}

/**
 * Set operation notification status.
 *
 * @param {number} operationId Operation ID to set notification status for.
 * @param {boolean} isNotified Notification status to set.
 *
 * @returns {Promise<OperationModel>} Promise with updated operation.
 */
export const setOperationNotificationStatus = async (operationId: number, isNotified: boolean): Promise<[affectedCount: number]> => {
    return await OperationModel.update({
        notified: isNotified
    }, {
        where: {
            operation_id: operationId
        }
    });
}