
// Function to get the start of the week based on the current week number
function getStartOfWeek() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.ceil((currentDate - startOfYear) / millisecondsPerWeek);

    const startOfWeek = new Date(startOfYear.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
    return startOfWeek;
}

// Function to get the end of the week based on the current week number
function getEndOfWeek() {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    return endOfWeek;
}

module.exports = {
    getStartOfWeek,
    getEndOfWeek
};