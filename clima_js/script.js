document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Geolocalización no soportada en este navegador.');
    }
});

document.getElementById('search-city').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
    }
});

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(null, lat, lon);
}

function error() {
    alert('No se pudo obtener la ubicación.');
}

function fetchWeather(city, lat = null, lon = null) {
    const apiKey = '6798d92ccdffd2e4456da81c0b768de7';
    const url = city ? 
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric` : 
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                saveToHistory(data);
            } else {
                alert('Error al obtener los datos del clima.');
            }
        })
        .catch(() => alert('Error al conectar con la API del clima.'));
}

function displayWeather(data) {
    previousTemp = data.main.temp;
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>Clima en ${data.name}</h2>
        <p>Temperatura: ${data.main.temp} °C</p>
        <p>Descripción: ${data.weather[0].description}</p>
        <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Ícono del clima"></p>
    `;
    checkSignificantChange(data);
}

function saveToHistory(data) {
    const tableBody = document.querySelector('#history-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.main.temp} °C</td>
        <td>${data.weather[0].description}</td>
        <td>${new Date().toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
}

function checkSignificantChange(data) {
    const tempThreshold = 10; // Ejemplo de umbral
    if (previousTemp !== null && Math.abs(data.main.temp - previousTemp) > tempThreshold) {
        notifyUser(`Cambio significativo en el clima: ${data.weather[0].description}`);
    }
}

function notifyUser(message) {
    if (Notification.permission === 'granted') {
        new Notification('Alerta de Clima', {
            body: message,
            icon: 'http://openweathermap.org/img/wn/04d.png'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Alerta de Clima', {
                    body: message,
                    icon: 'http://openweathermap.org/img/wn/04d.png'
                });
            }
        });
    }
}

let previousTemp = null;

document.getElementById('filter-history').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#history-table tbody tr');
    rows.forEach(row => {
        const city = row.cells[0].textContent.toLowerCase();
        row.style.display = city.includes(filter) ? '' : 'none';
    });
});
