export default function App() {
    let dataFetch;
    fetch('https://restcountries.com/v2/all')
        .then(res => res.json())
        .then(data => dataFetch = data);

    const countriesList = document.getElementById('list'),
        loadMore = document.getElementById("load"),
        aside = document.getElementById("aside"),
        asideBack = document.getElementById('back');

    const overlay = document.getElementById('overlay'),
        notfound = document.getElementById('notfound'),
        ok = document.getElementById('ok'),
        loaderror = document.getElementById('loaderror'),
        refresh = document.getElementById('refresh');

    function load() {
        let itensDisplayed = countriesList.childElementCount;
        if (itensDisplayed < 250) {
            fetching(itensDisplayed, itensDisplayed + 50, dataFetch);
        } else {
            loadMore.style.display = 'none';
            fetching(itensDisplayed, 250, dataFetch);
        }
    };

    function openTab(target) {
        aside.classList.add('ativo');
        document.body.style.overflowY = 'hidden';

        asideBack.addEventListener('click', () => {
            aside.classList.remove('ativo');
            document.body.style.overflowY = 'visible';
        });

        const infoImage = document.getElementById('info-image'),
            countryAbout = document.getElementById('country-about');

        let image = `<img src="${dataFetch[target].flags.svg}"></img>`;

        let languagesArray = [];
        for (let i = 0; i < dataFetch[target].languages.length; i++) {
            languagesArray.push(` ${dataFetch[target].languages[i].name}`)
        }

        let currenciesArray = [];
        for (let i = 0; i < dataFetch[target].currencies.length; i++) {
            currenciesArray.push(` ${dataFetch[target].currencies[i].name}`)
        }

        let about = `
                <h2>${dataFetch[target].name}</h2>
                <div class="divP">
                    <div class="first">
                        <p><span class="spaninfo">Native Name:</span> ${dataFetch[target].nativeName}</p>
                        <p><span class="spaninfo">Population:</span> ${dataFetch[target].population}</p>
                        <p><span class="spaninfo">Region:</span> ${dataFetch[target].region}</p>
                        <p><span class="spaninfo">Sub Region:</span> ${dataFetch[target].subregion}</p>
                        <p><span class="spaninfo">Capital:</span> ${dataFetch[target].capital}</p>
                    </div>

                    <div class="second">
                        <p><span class="spaninfo">Top Level Domain:</span> ${dataFetch[target].topLevelDomain}</p>
                        <p><span class="spaninfo">Currencies:</span> ${currenciesArray.toString()}</p>
                        <p><span class="spaninfo">Languages:</span> ${languagesArray.toString()}</p>
                    </div>
                </div>
            `;

        let borders = document.createElement('div'),
            borderTitle = document.createElement('h3'),
            borderlist = document.createElement('ul');
        borders.classList.add('borders');
        borderTitle.innerText = 'Border Countries';

        if (dataFetch[target].borders !== undefined) {
            for (let i = 0; i < dataFetch[target].borders.length; i++) {
                fetch(`https://restcountries.com/v2/alpha/${dataFetch[target].borders[i].toLowerCase()}`)
                    .then(r => r.json()).then(r => {
                        let item = document.createElement('li');
                        item.innerText = r.name;
                        borderlist.appendChild(item);
                    })
            }
            borders.appendChild(borderTitle);
            borders.appendChild(borderlist);
        }
        countryAbout.innerHTML = about;
        countryAbout.appendChild(borders);
        infoImage.innerHTML = image;
    };

    function ListEventListener() {
        let index,
            countriesArray = Array.from(countriesList.children);

        let items = countriesList.querySelectorAll('li');
        items.forEach(item => {
            item.addEventListener('click', event => {
                index = countriesArray.indexOf(event.currentTarget)
                openTab(index)
            })
        })
    };

    function fetching(start, end, array) {
        for (let i = start; i < end; i++) {
            let countryItem = document.createElement("li");
            const countryInfo = `
                    <img src="${array[i].flags.svg}">
                    <div class="info">
                        <h2>${array[i].name}</h2>

                        <div>
                            <p><span class="spaninfo" class="spaninfo">Population:</span> ${array[i].population}</p>
                            <p><span class="spaninfo">Region:</span> ${array[i].region}</p>
                            <p><span class="spaninfo">Capital:</span> ${array[i].capital}</p>
                        </div>
                    </div>
            `;
            countryItem.innerHTML = countryInfo;
            countriesList.appendChild(countryItem);
        }
        loadMore.addEventListener('click', load);
        setTimeout(() => ListEventListener(), 1000);
    }
    setTimeout(() => fetching(0, 50, dataFetch), 1200);

    const input = document.getElementById('input'),
        btnSearch = document.getElementById('search');

    function Search() {
        let valor = input.value.toLowerCase().replace(/\s/g, '');

        fetch(`https://restcountries.com/v2/name/${valor}`)
            .then(r => r.json())
            .then(r => {
                if (r.message == 'Not Found') {
                    [overlay, notfound].forEach(e => e.classList.add('ativo'));

                    ok.addEventListener('click', () => {
                        [overlay, notfound].forEach(e => e.classList.remove('ativo'));
                    })
                } else {
                    let nome = r[0].name;
                    console.log(r[0].name)
                    const index = dataFetch.map(e => e.name).indexOf(nome);
                    openTab(index)
                }
            })
    }

    btnSearch.addEventListener('click', Search);
    window.addEventListener('keyup', e => {
        if (e.keyCode == 13) Search();
    });

    const regionfilter = document.getElementById('region');
    regionfilter.addEventListener('input', () => {
        if (regionfilter.value !== 'All') {
            const filtered = dataFetch.filter(e => {
                return e.region == regionfilter.value
            })
            countriesList.querySelectorAll('li').forEach(n => n.remove())
            setTimeout(() => fetching(0, 50, filtered), 1200);
        } else {
            countriesList.querySelectorAll('li').forEach(n => n.remove())
            setTimeout(() => fetching(0, 50, dataFetch), 1200);
        }
    })


    setTimeout(() => {
        if (countriesList.childElementCount == 0) {
            [overlay, loaderror].forEach(e => e.classList.add('ativo'));

            refresh.addEventListener('click', () => {
                [overlay, loaderror].forEach(e => e.classList.remove('ativo'));
                window.location.reload();
            })
        }
    }, 2000);
}