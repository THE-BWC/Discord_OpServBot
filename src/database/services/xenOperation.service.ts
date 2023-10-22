import { Op } from "sequelize";
import { XenOpservOperationModel, XenUserModel } from "../models/xen/index.js";

/**
 * Get all non OPSEC upcoming operations from the database whose start date is after the current date.
 *
 * @returns {Promise<XenOpservOperationModel>} The operation from the database.
 */
export async function getUpcomingOperations(): Promise<XenOpservOperationModel[]> {
    return await XenOpservOperationModel.findAll({
        where: {
            date_start: {
                [Op.gt]: new Date()
            },
            is_completed: false,
            is_opsec: false
        },
        order: [
            ['date_start', 'ASC']
        ]
    });
}

/**
 * Get all OPSEC operations from the database whose start date is after the current date.
 *
 * @returns {Promise<XenOpservOperationModel>} The operation from the database.
 */
export async function getUpcomingOpsecOperations(): Promise<XenOpservOperationModel[]> {
    return await XenOpservOperationModel.findAll({
        where: {
            date_start: {
                [Op.gt]: new Date()
            },
            is_completed: false,
            is_opsec: true
        },
        order: [
            ['date_start', 'ASC']
        ],
        include: [
            {
                model: XenUserModel,
                as: 'leader_username',
                attributes: ['username']
            }
        ]
    });
}

/**
 * Get an operation from the database by its operation ID.
 *
 * @param {number} opId The operation ID to get
 *
 * @returns {Promise<XenOpservOperationModel | null>} The operation from the database.
 */
export async function getOperationByOpId(opId: number): Promise<XenOpservOperationModel | null> {
    return await XenOpservOperationModel.findOne({
        where: {
            operation_id: opId
        }
    });
}