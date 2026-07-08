const cities = [
    { name: 'Mexico City', timezone: 'America/Mexico_City' },
    { name: 'Bogota', timezone: 'America/Bogota' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Madrid', timezone: 'Europe/Madrid' },
    { name: 'Paris', timezone: 'Europe/Paris' },
    { name: 'Berlin', timezone: 'Europe/Berlin' },
    { name: 'Warsaw', timezone: 'Europe/Warsaw' },
    { name: 'New Delhi', timezone: 'Asia/Kolkata' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
];

const formatters = new Map();

function getFormatter(timezone, options) {
    const key = `${timezone}-${JSON.stringify(options)}`;
    const cachedFormatter = formatters.get(key);

    if (cachedFormatter) {
        return cachedFormatter;
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        ...options,
    });

    formatters.set(key, formatter);
    return formatter;
}

function getDateTime(timezone) {
    const now = new Date();

    return {
        date: getFormatter(timezone, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(now),
        month: getFormatter(timezone, { month: 'long' }).format(now),
        weekday: getFormatter(timezone, { weekday: 'long' }).format(now),
        time: getFormatter(timezone, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(now),
        zone: getFormatter(timezone, { timeZoneName: 'short' })
            .formatToParts(now)
            .find((part) => part.type === 'timeZoneName')?.value || timezone,
    };
}

function formatTimezone(timezone) {
    return timezone.replaceAll('_', ' ');
}

function createCityCard(city) {
    const article = document.createElement('article');
    article.className = 'clock-card';
    article.setAttribute('aria-label', `Current time in ${city.name}`);
    article.innerHTML = `
        <div class="city-row">
            <h2></h2>
            <span class="timezone"></span>
        </div>
        <p class="time-value"></p>
        <div class="date-row">
            <span class="weekday"></span>
            <span class="date"></span>
        </div>
    `;

    city.elements = {
        timezone: article.querySelector('.timezone'),
        time: article.querySelector('.time-value'),
        weekday: article.querySelector('.weekday'),
        date: article.querySelector('.date'),
    };

    article.querySelector('h2').textContent = city.name;
    city.elements.timezone.textContent = formatTimezone(city.timezone);

    return article;
}

function renderCards() {
    const grid = document.getElementById('cityClockGrid');
    const fragment = document.createDocumentFragment();

    cities.forEach((city) => {
        fragment.appendChild(createCityCard(city));
    });

    grid.replaceChildren(fragment);
}

function updateCityTimes() {
    cities.forEach((city) => {
        const { date, month, weekday, time, zone } = getDateTime(city.timezone);

        city.elements.time.textContent = time;
        city.elements.weekday.textContent = `${weekday}, ${month}`;
        city.elements.date.textContent = date;
        city.elements.timezone.textContent = `${formatTimezone(city.timezone)} · ${zone}`;
    });
}

function main() {
    renderCards();
    updateCityTimes();
    window.setInterval(updateCityTimes, 1000);
}

window.addEventListener('DOMContentLoaded', main);
