var myearth;
var localNewsMarker;
var news = [];

window.addEventListener('earthjsload', function() {
    myearth = new Earth(document.getElementById('element'), {
        location: { lat: 18, lng: 50 },
        zoom: 1.05,
        light: 'none',

        transparent: true,
        mapSeaColor: 'RGBA(0,0,0,0.76)',
        mapLandColor: ' #1f4287',
        mapBorderColor: '#000000',
        mapBorderWidth: 0.25,
        mapHitTest: true,

        autoRotate: true,
        autoRotateSpeed: 2,
        autoRotateDelay: 1000,
    });

    myearth.addEventListener('ready', function() {
        this.startAutoRotate();
    });

    var startLocation, rotationAngle;

    myearth.addEventListener('dragstart', function() {
        startLocation = myearth.location;
    });

    myearth.addEventListener('dragend', function() {
        rotationAngle = Earth.getAngle(startLocation, myearth.location);
    });

    var selectedCountry;

    myearth.addEventListener('click', function(event) {
        if (rotationAngle > 5) return; // mouseup after drag

        if (event.id) {
            if (selectedCountry != event.id) {
                selectedCountry = event.id;
                console.log(selectedCountry);
                // console.log('Clicked');
                fetch('https://api.covid19api.com/summary')
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data.Countries);
                        for (let i = 0; i <= 248; i++) {
                            if (
                                data.Countries[i].CountryCode == selectedCountry
                            ) {
                                console.log(data.Countries[i]);
                                document.getElementById(
                                    'please-click'
                                ).innerHTML = '';
                                document.getElementById(
                                    'country-name'
                                ).innerHTML = data.Countries[i].Country;
                                document.getElementById(
                                    'total-recovered'
                                ).innerHTML = `Recovered cases: ${data.Countries[i].TotalRecovered}`;
                                document.getElementById(
                                    'total-active'
                                ).innerHTML = `Active cases: ${data.Countries[i]
                                    .TotalConfirmed -
                                    (data.Countries[i].TotalDeaths +
                                        data.Countries[i].TotalRecovered)}`;
                                document.getElementById(
                                    'total-dead'
                                ).innerHTML = `Deaths: ${data.Countries[i].TotalDeaths}`;

                                clearNews();
                                loadNewsByLocation(selectedCountry);

                                break;
                            }
                        }
                    });
                // document.getElementById('local-news').classList.add( 'has-news' );
                // document.getElementById('local-news').classList.toggle( 'toggle-news' );
            }

            // create news marker on first click

            if (!localNewsMarker) {
                localNewsMarker = this.addMarker({
                    mesh: 'Marker',
                    color: '#d5dde6',
                    location: event.location,
                    scale: 0.01,
                });

                localNewsMarker.animate('scale', 0.9, { easing: 'out-back' });
            } else {
                localNewsMarker.animate('location', event.location, {
                    duration: 200,
                    relativeDuration: 50,
                    easing: 'in-out-cubic',
                });
            }
        }
    });
});

function highlightBreakingNews(event) {
    var overlay = event.target.closest('.earth-overlay').overlay;
    var newsId = overlay.newsId;

    document
        .getElementById('breaking-news-' + newsId)
        .classList.add('news-highlight');
    setTimeout(function() {
        document
            .getElementById('breaking-news-' + newsId)
            .classList.remove('news-highlight');
    }, 500);

    myearth.goTo(overlay.location, { duration: 250, relativeDuration: 70 });

    event.stopPropagation();
}

function loadBreakingNews() {
    fetch(`/breaking`).then((response) => {
        response.json().then((data) => {
            const articles = data.articles;
            articles.forEach((article) => {
                renderNews(article.title, article.description, article.url);
            });
        });
    });
}

function loadNewsByLocation(country) {
    const countryID = country.toLowerCase();
    fetch(`/news?country=${countryID}`).then((response) => {
        response.json().then((data) => {
            const articles = data.articles;
            articles.forEach((article) => {
                renderNews(article.title, article.description, article.url);
            });
        });
    });
}

function renderNews(title, description, link) {
    const toInsert = `<div id="news-element" class="news">
				<a href="${link}"><h3>${title}</h3></a>
				<p>${description}</p>
            </div>`;

    const newsHeader = document.getElementById('breaking-news');

    newsHeader.insertAdjacentHTML('afterbegin', toInsert);
}

function clearNews() {
    document.getElementById('breaking-news').innerHTML = '';
    console.log('clearing');
}

loadBreakingNews();
