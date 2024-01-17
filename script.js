const cityTimezones = {
    'New Delhi': 'Asia/Kolkata',
    'Tokyo': 'Asia/Tokyo',
    'Buenos Aires': 'America/Argentina/Buenos_Aires',
    'Madrid': 'Europe/Madrid',
    'Berlin': 'Europe/Berlin',
    'London': 'Europe/London',
    'Bogota': 'America/Bogota',
};

function getDateTime(cityName) {
    if (!(cityName in cityTimezones)) {
        throw new Error("Invalid city name");
    }

    const cityTimezone = cityTimezones[cityName];
    const currentTime = moment().tz(cityTimezone);
    const dateTimeFmt = "YYYY-MM-DD HH:mm:ss";
    const monthWeekdayFmt = "MMMM, dddd";
    const [dateStr, timeStr] = currentTime.format(dateTimeFmt).split(" ");
    const monthWeekdayStr = currentTime.format(monthWeekdayFmt);

    return [dateStr, monthWeekdayStr, timeStr];
}

function displayCityDateTime(cityName) {
    const [dateStr, monthWeekdayStr, timeStr] = getDateTime(cityName);
    const tableBody = document.getElementById("cityDateTimeBody");

    const row = tableBody.insertRow();
    const cellCity = row.insertCell(0);
    const cellDate = row.insertCell(1);
    const monthWeekday = row.insertCell(2);
    const cellTime = row.insertCell(3);

    cellCity.textContent = cityName;
    cellDate.textContent = dateStr;
    monthWeekday.textContent = monthWeekdayStr;
    cellTime.textContent = timeStr;
}

function refreshCityDateTime() {
    const tableBody = document.getElementById("cityDateTimeBody");
    tableBody.innerHTML = ''; // Clear existing rows

    for (const cityName in cityTimezones) {
        displayCityDateTime(cityName);
    }
}

function main() {
    // Initial display
    refreshCityDateTime();

    // Auto-refresh every second
    setInterval(refreshCityDateTime, 1000);
}

main();
