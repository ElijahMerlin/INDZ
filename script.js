document.getElementById('findButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Initialize the map
    const map = L.map('map').setView([lat, lon], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the user's location
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Ви тут')
        .openPopup();

    // Fetch nearby places
    fetch(`https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=1000&categories=13065,13032`, {
        headers: {
            'Authorization': 'fsq3ON6UTl4IlPCgsFG+R/FTQqnkqj8DpKzBM0gPZV5Kb3A='
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            data.results.forEach(place => {
                const placeLat = place.geocodes.main.latitude;
                const placeLon = place.geocodes.main.longitude;
                const placeName = place.name;
                const placeAddress = place.location.address || 'Адреса відсутня';

                // Add a marker for each place
                L.marker([placeLat, placeLon]).addTo(map)
                    .bindPopup(`<b>${placeName}</b><br>${placeAddress}`);
            });
        } else {
            alert("Нічого не знайдено.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Сталася помилка під час пошуку.");
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Користувач відхилив запит на геолокацію.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Інформація про місцезнаходження недоступна.");
            break;
        case error.TIMEOUT:
            alert("Час запиту на геолокацію вичерпано.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Сталася невідома помилка.");
            break;
    }
}

