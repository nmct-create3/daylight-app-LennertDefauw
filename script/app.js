let domSun;
// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();
	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function(percentage)
{

}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (timeStampSunrise, timeStampSunset) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	domSun = document.querySelectorAll('.js-sun');

	// Bepaal het aantal minuten dat de zon al op is
	let now = new Date();

	let sunrise = new Date(timeStampSunrise * 1000);
	let sunset = new Date(timeStampSunset * 1000);

	let timeDifference = new Date(sunset.getTime() - now.getTime());
	let timeDifferenceMinutes = Math.round(timeDifference / 60000);


	let totalSunTime = new Date(sunset.getTime() - sunrise.getTime());
	let totalSunMinutes = Math.round(totalSunTime / 60000);

	
	let percentage = 100 - (timeDifferenceMinutes / totalSunMinutes) * 100;

	let y = -0.04 * Math.pow(percentage, 2) + 4 * percentage - 2e-13;
	let x = percentage;

	domSun[0].setAttribute('data-time', _parseMillisecondsIntoReadableTime(now / 1000));
	domSun[0].setAttribute('style', `bottom:${y}%; left:${x}%`)

	if(percentage < 0 || percentage > 100)
	{
		document.querySelector('html').classList.remove('is-day');
		document.querySelector('html').classList.add('is-night');
		document.querySelector('.js-time-left').innerHTML = 0;
		if (percentage > 100) {
			domSun.style.opacity = '0';
			clearInterval(timer);
			}
	}
	else
	{
		document.querySelector('html').classList.add('is-day');
		document.querySelector('html').classList.remove('is-night');
		document.querySelector('.js-time-left').innerHTML = timeDifferenceMinutes;

	}



	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.

	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten

	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.


};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = queryResponse.city.name
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	placeSunAndStartMoving(queryResponse.city.sunrise, queryResponse.city.sunset);
	timer = setInterval(() => placeSunAndStartMoving(queryResponse.city.sunrise, queryResponse.city.sunset), 60*100); //60 * 1000
	document.documentElement.classList.add('is-loaded');
	console.log(queryResponse);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.

	fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a5756a175be08ad6a2a6c08b9a18cec3&units=metric&lang=nl&cnt=1`).then(function(response)
	{
		return response.json();
	}).then(function(data)
	{
		showResult(data);
	})
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
