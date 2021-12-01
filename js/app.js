export default function App() {
    const loader = document.getElementById("loader");
    loader.classList.add('ativo');

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

    function load(array) {
        let chosenArray = array;
        let itensDisplayed = countriesList.childElementCount;
        if (itensDisplayed < 250) {
            fetching(itensDisplayed, itensDisplayed + 50, chosenArray, 'no');
        } else {
            loadMore.style.display = 'none';
            fetching(itensDisplayed, 250, chosenArray, 'no');
        }
    };

    function Search(valor) {
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
                        item.innerHTML = `<button class="border-btn">${r.name}</button>`;
                        borderlist.appendChild(item);
                    })
            }
            borders.appendChild(borderTitle);
            borders.appendChild(borderlist);
        }
        countryAbout.innerHTML = about;
        countryAbout.appendChild(borders);
        infoImage.innerHTML = image;

        setTimeout(() => {
            let borderButtons = document.querySelectorAll('.border-btn');
            borderButtons.forEach(each => each.addEventListener('click', event => {
                console.log(event.currentTarget.innerText)
                Search(event.currentTarget.innerText)
            }))
        }, 700);
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

    function fetching(start, end, array, sort) {
        let chosenArray = array,
            filtering = sort;

        for (let i = start; i < end; i++) {
            let countryItem = document.createElement("li");
            const countryInfo = `
                    <img src="${chosenArray[i].flags.svg}">
                    <div class="info">
                        <h2>${chosenArray[i].name}</h2>

                        <div>
                            <p><span class="spaninfo" class="spaninfo">Population:</span> ${chosenArray[i].population}</p>
                            <p><span class="spaninfo">Region:</span> ${chosenArray[i].region}</p>
                            <p><span class="spaninfo">Capital:</span> ${chosenArray[i].capital}</p>
                        </div>
                    </div>
            `;
            countryItem.innerHTML = countryInfo;
            countriesList.appendChild(countryItem);
        }
        if(filtering == 'no') {
            loadMore.addEventListener('click', () => {
                load(chosenArray)
            });
        } else {
            loadMore.style.display = 'none';
        }
        setTimeout(() => ListEventListener(), 1000);
        loader.classList.remove('ativo');
    }
    setTimeout(() => fetching(0, 50, dataFetch, 'no'), 1200);

    const input = document.getElementById('input'),
        btnSearch = document.getElementById('search');

    btnSearch.addEventListener('click', () => {
        let valor = input.value.toLowerCase().replace(/\s/g, '');
        Search(valor);
    });
    window.addEventListener('keyup', e => {
        let valor = input.value.toLowerCase().replace(/\s/g, '');
        if (e.keyCode == 13) Search(valor);
    });

    const regionfilter = document.getElementById('region');
    regionfilter.addEventListener('input', () => {
        loader.classList.add('ativo');
        if (regionfilter.value !== 'All') {
            const filtered = dataFetch.filter(e => {
                return e.region == regionfilter.value
            })
            countriesList.querySelectorAll('li').forEach(n => n.remove())
            setTimeout(() => fetching(0, filtered.length, filtered, 'yes'), 1200);
            loadMore.addEventListener('click', () => {
                load(filtered)
            });
            setTimeout(() => loader.classList.remove('ativo'), 1200);

        } else {
            countriesList.querySelectorAll('li').forEach(n => n.remove())
            setTimeout(() => fetching(0, 50, dataFetch, 'no'), 1200);
            setTimeout(() => loader.classList.remove('ativo'), 1200);
        }
    })

    setTimeout(() => {
        if (countriesList.childElementCount == 0) {
            [overlay, loaderror].forEach(e => e.classList.add('ativo'));
            loader.classList.remove('ativo');

            refresh.addEventListener('click', () => {
                [overlay, loaderror].forEach(e => e.classList.remove('ativo'));
                window.location.reload();
            })
        }
    }, 2000);
}