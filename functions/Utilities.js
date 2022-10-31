/** Class representing Utilities. */
class Utilities {

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
    chunkNumber(number, n) {
        let array = new Array(Math.floor(number / n)).fill(n).concat(number % n);
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
    chunkArray(array, size) {
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
    unixFormat(unix) {
        let options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
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
    duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return `${days.padStart(1, '0')} days, ${hrs.padStart(2, '0')} hours, ${min.padStart(2, '0')} minutes, ${sec.padStart(2, '0')} seconds, `;
    }

    /**
     * Takes any amount of bytes and converts from Bytes to YotaBytes.
     * @name formatBytes
     * @function
     *
     * @param {Number} bytes
     *
     * @returns {String}
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
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
    notifyTime(ms) {
        return Math.ceil((ms / (1000 * 60)) % 60).toString();
    }
}

module.exports = Utilities;
