const apiKey = '71304b8599d5a2eaddc6ecd67b4ffb51';

document.addEventListener('DOMContentLoaded', () => {

    function getWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
            .then(response => response.json())
            .then(data => {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                getLongTermWeather(lat, lon, city);
            })
            .catch(err => console.log('Error:', err));
    }

    function getLongTermWeather(lat, lon, city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                console.log('Forecast API:\n', data); // Log the entire response data
                const daily = data.list;

                if (daily && daily.length > 0) {
                    document.getElementById('cityName').textContent = `Miasto: ${city}`;
                    document.getElementById('temperature').textContent = `Temperatura: ${daily[0].main.temp}°C`;
                    document.getElementById('humidity').textContent = `Wilgotność: ${daily[0].main.humidity}%`;
                    document.getElementById('pressure').textContent = `Ciśnienie: ${daily[0].main.pressure} hPa`;
                    document.getElementById('wind').textContent = `Wiatr: ${daily[0].wind.speed} m/s`;
                    document.getElementById('icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${daily[0].weather[0].icon}.png" alt="Weather icon">`;

                    let forecastHTML = '';
                    for (let i = 1; i < daily.length; i++) {
                        forecastHTML += `
                            <div class="forecast-day">
                                <div>${new Date(daily[i].dt * 1000).toLocaleDateString()}</div>
                                <div>${daily[i].main.temp}°C</div>
                                <div>${daily[i].weather[0].description}</div>
                                <div><img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png" alt="Weather icon"></div>
                            </div>
                        `;
                    }
                    document.getElementById('forecast').innerHTML = forecastHTML;
                } else {
                    console.log('No daily forecast data available');
                }
            })
            .catch(err => console.log('Error:', err));
    }

    function getWeatherXML(city) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log('XMLHttpRequest:\n', data); // //console.log dla xmlhttprequest
                const weather = data.weather[0].description;
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                const pressure = data.main.pressure;
                const wind = data.wind.speed;
                const icon = data.weather[0].icon;

                document.getElementById('cityName').textContent = `Miasto: ${city}`;
                document.getElementById('temperature').textContent = `Temperatura: ${temp}°C`;
                document.getElementById('humidity').textContent = `Wilgotność: ${humidity}%`;
                document.getElementById('pressure').textContent = `Ciśnienie: ${pressure} hPa`;
                document.getElementById('wind').textContent = `Wiatr: ${wind} m/s`;
                document.getElementById('icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">`;
            } else if (xhr.readyState === 4) {
                console.log('Error:', xhr.statusText);
            }
        };
        xhr.send();
    }

    document.getElementById('city').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const city = document.getElementById('city').value;
            getWeather(city);
            getWeatherXML(city);
        }
    });

    document.getElementById('getWeather').addEventListener('click', () => {
        const city = document.getElementById('city').value;
        getWeather(city);
        getWeatherXML(city);
    });
});