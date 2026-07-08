const cityTimezones = [
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

const cardMap = new Map();
let timerId;

const formatters = new Map();

function getFormatter(timezone, options) {
    const key = `${timezone}-${JSON.stringify(options)}`;

    if (!formatters.has(key)) {
        formatters.set(
            key,
            new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                ...options,
            })
        );
    }

    return formatters.get(key);
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

function createCityCard(city) {
    const article = document.createElement('article');
    article.className = 'clock-card';
    article.setAttribute('aria-label', `Current time in ${city.name}`);
    article.innerHTML = `
        <div class="city-row">
            <h3></h3>
            <span class="timezone"></span>
        </div>
        <p class="time-value"></p>
        <div class="date-row">
            <span class="weekday"></span>
            <span class="date"></span>
        </div>
    `;

    const cityName = article.querySelector('h3');
    const timezone = article.querySelector('.timezone');
    const time = article.querySelector('.time-value');
    const weekday = article.querySelector('.weekday');
    const date = article.querySelector('.date');

    cityName.textContent = city.name;
    timezone.textContent = city.timezone.replaceAll('_', ' ');

    cardMap.set(city.name, {
        timezone,
        time,
        weekday,
        date,
    });

    return article;
}

function renderInitialCards() {
    const grid = document.getElementById('cityClockGrid');
    const fragment = document.createDocumentFragment();

    cityTimezones.forEach((city) => {
        fragment.appendChild(createCityCard(city));
    });

    grid.replaceChildren(fragment);
}

function updateCityDateTime() {
    cityTimezones.forEach((city) => {
        const card = cardMap.get(city.name);
        const { date, month, weekday, time, zone } = getDateTime(city.timezone);

        card.time.textContent = time;
        card.weekday.textContent = `${weekday}, ${month}`;
        card.date.textContent = date;
        card.timezone.textContent = `${city.timezone.replaceAll('_', ' ')} · ${zone}`;
    });

    const lastUpdated = document.getElementById('lastUpdated');
    lastUpdated.textContent = `Last updated ${getFormatter(Intl.DateTimeFormat().resolvedOptions().timeZone, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date())}`;
}

function showError(message) {
    const grid = document.getElementById('cityClockGrid');
    grid.innerHTML = `<p class="error-message">${message}</p>`;
}

function main() {
    try {
        renderInitialCards();
        updateCityDateTime();
        timerId = window.setInterval(updateCityDateTime, 1000);
    } catch (error) {
        if (timerId) {
            window.clearInterval(timerId);
        }
        showError('Unable to display times in this browser.');
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', main);
