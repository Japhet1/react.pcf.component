const MINUTE = 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    MONTH = DAY * 30,
    YEAR = DAY * 365;


/**
 * 
 * @param date Current system date
 * @returns 
 */
const humanReadableDate = (date: Date) => {
    const now = new Date();
    const text = date > now ? "from now" : "ago";
    const secondsAgo = Math.abs(Math.round((+now - (+date)) / 1000));

    if (secondsAgo < MINUTE) {
        return secondsAgo + "s";
    }
    else if (secondsAgo < HOUR) {
        const value = Math.floor(secondsAgo / MINUTE)
        return  value > 1 ? `${value} minutes ${text}` : `A minute ${text}`;
    }
    else if (secondsAgo < DAY) {
        const value = Math.floor(secondsAgo / HOUR)
        return  value > 1 ? `${value} hours ${text}` : `An hour ${text}`;
    }
    else if (secondsAgo < YEAR) {
        const value = Math.floor(secondsAgo / MONTH)
        return  value > 1 ? `${value} months ${text}` : `A month ${text}`;
    }
    else {
        const value = Math.floor(secondsAgo / YEAR)
        return  value > 1 ? `${value} year ${text}` : `A year ${text}`;
    }
}
export default humanReadableDate;