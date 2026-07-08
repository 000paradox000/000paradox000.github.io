const cities = [
    { name: 'New Delhi', timezone: 'Asia/Kolkata' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    { name: 'Madrid', timezone: 'Europe/Madrid' },
    { name: 'Berlin', timezone: 'Europe/Berlin' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Bogota', timezone: 'America/Bogota' },
];

const cardMap = new Map();
let timerId;

function assertMomentTimezoneLoaded() {
    if (!window.moment || !moment.tz) {
        throw new Error('Moment Timezone failed to load. Check the CDN script URLs.');
    }
}

function getDateTime(timezone) {
    assertMomentTimezoneLoaded();

    const currentTime = moment().tz(timezone);

    return {
        date: currentTime.format('YYYY-MM-DD'),
        month: currentTime.format('MMMM'),
        weekday: currentTime.format('dddd'),
        time: currentTime.format('HH:mm:ss'),
        zone: currentTime.format('z'),
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
    timezone.textContent = city.timezone.replace('_', ' ');

    cardMap.set(city.name, {
        article,
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

    cities.forEach((city) => {
        fragment.appendChild(createCityCard(city));
    });

    grid.replaceChildren(fragment);
}

function updateCityDateTime() {
    cities.forEach((city) => {
        const card = cardMap.get(city.name);
        const { date, month, weekday, time, zone } = getDateTime(city.timezone);

        card.time.textContent = time;
        card.weekday.textContent = `${weekday}, ${month}`;
        card.date.textContent = date;
        card.timezone.textContent = `${city.timezone.replace('_', ' ')} · ${zone}`;
    });

    const lastUpdated = document.getElementById('lastUpdated');
    lastUpdated.textContent = `Last updated ${moment().format('HH:mm:ss')}`;
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
        showError(error.message);
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', main);
