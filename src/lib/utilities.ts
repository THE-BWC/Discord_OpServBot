import { OperationModel } from '../database/models/bot/index.js';
import { XenOpservOperationModel } from '../database/models/xen/index.js';
import { BWC_Client } from "../lib/index.js";

/**
 * Takes a dynamic size and splits it into n size groupings.
 * @name chunkNumber
 * @function
 * @param {Number} number
 * @param {Number} n
 *
 * @example
 * chunkNumber(18,12)
 * returns [12,6]
 *
 * @returns {Array} - Array with the sizes
 */
export function chunkNumber(number: number, n: number): any[] {
    const array = new Array(Math.floor(number / n)).fill(n).concat(number % n);
    if (array[array.length-1] === 0) {
        array.pop()
    }
    return array
}

/**
 * Takes an Array and splits it into chunks(Arrays) based on the size(Length) specified.
 * @name chunkArray
 * @function
 *
 * @param {Array} array
 * @param {Number} size
 *
 * @returns {Array} - Returns an Array with the chunked arrays inside.
 */
export function chunkArray(array: { length: number; slice: (arg0: number, arg1: any) => any; }, size: number) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}

/**
 * Takes a unix timestamp and translates to the appropriate Date Time format.
 * @name unixFormat
 * @function
 *
 * @param {Number} unix
 *
 * @returns {String} - Returns a string with the correct Date Time format.
 */
export function unixFormat(unix: number) {
    const options = {
        year: 'numeric' as const,
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: false,
        timeZone: 'America/New_York'
    }
    return new Intl.DateTimeFormat('en-US', options).format(unix * 1000)
}

/**
 * Takes bot uptime in ms and converts to human-readable time.
 * @name duration
 * @function
 *
 * @param {Number} ms
 *
 * @returns {String} - days, hours, minutes, seconds
 */
export function duration(ms: number) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    return `${days.padStart(1, '0')} days, ${hrs.padStart(2, '0')} hours, ${min.padStart(2, '0')} minutes, ${sec.padStart(2, '0')} seconds, `;
}

/**
 * Converts Miliseconds to Minutes
 * @name notifyTime
 * @function
 *
 * @param {Number} ms
 *
 * @returns {String}
 */
export function notifyTime(ms: number) {
    return Math.ceil((ms / (1000 * 60)) % 60).toString();
}

/**
 * Converts XenOpservOperationModel to OperationModel
 *
 * @param {BWC_Client} client
 * @param {XenOpservOperationModel} op
 *
 * @returns {OperationModel}
 */
export const convertXenOpToOp = async (client: BWC_Client, op: XenOpservOperationModel): Promise<OperationModel | null> => {
    return await client.xenDatabaseProvider.xenUserService.getUserByUserId(String(op.leader_user_id)).then(
        user => {
            if (user) {
                return OperationModel.build({
                    operation_id: op.operation_id,
                    game_id: op.game_id,
                    notified: false
                })
            } else {
                return null;
            }
        }
    )
}
