export default function App() {
    const countriesList = document.getElementById('list'),
        loadMore = document.getElementById("load");

    function load() {
        let itensDisplayed = countriesList.childElementCount;
        if (itensDisplayed < 250) {
            fetching(itensDisplayed, itensDisplayed + 50);
        } else {
            loadMore.style.display = 'none';
            fetching(itensDisplayed, 250);
        }
    }

    function fetching(start, end) {
        fetch('https://restcountries.com/v2/all').then(r => r.json())
            .then(r => {
                for (let i = start; i < end; i++) {
                    let countryItem = document.createElement("li");
                    const countryInfo = `
                    <img src="${r[i].flags.svg}">
                    <div class="info">
                        <h2>${r[i].name}</h2>
    
                        <div>
                            <p><span>Population:</span> ${r[i].population}</p>
                            <p><span>Region:</span> ${r[i].region}</p>
                            <p><span>Capital:</span> ${r[i].capital}</p>
                        </div>
                    </div>
            `;
                    countryItem.innerHTML = countryInfo;
                    countriesList.appendChild(countryItem)
                }
                loadMore.addEventListener('click', load);
            });
    }
    fetching(0, 50);
}