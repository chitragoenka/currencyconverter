// fetching currencies from API
// api key m2n7khoSb6LCevxQbVulzeejjwhnNEi8

let myHeaders = new Headers();
myHeaders.append("apikey", "m2n7khoSb6LCevxQbVulzeejjwhnNEi8");

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
const resultOutput = document.getElementById('converted-amount');
fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then(response => response.json())
  .then(result => {
    if (result.success !== true) {
      resultOutput.textContent = 'API request Failed.';
    }
    const symbols = result.symbols;
    const baseDropdown = document.getElementById('base-currency');
    const targetDropdown = document.getElementById('target-currency');

    const amountInput = document.getElementById('amount');
    

    baseDropdown.innerHTML = '';
    targetDropdown.innerHTML = '';
    for (const symbol in symbols) {
      const option = document.createElement('option');
      option.value = symbol;
      option.text = `${symbol} - ${symbols[symbol]}`;
      baseDropdown.add(option);

      const targetOption = option.cloneNode(true);
      targetDropdown.add(targetOption);
    }

    // Add event listeners for convert button

    const element = document.getElementById("convert-button");

    element.addEventListener('click', () => {
      const baseCurrency = baseDropdown.value;
      const targetCurrency = targetDropdown.value;
      const amount = parseFloat(amountInput.value);
//Error handling

      if (isNaN(amount)) {
        alert('Invalid amount');
      } else if (amount <= 0) {
        alert('Amount should be greater than 0');
      } else if (baseCurrency == targetCurrency) {
        alert('Currencies cannot be same.');
      } else {
        convertCurrency(baseCurrency, targetCurrency, amount)
          .then(result => {
            resultOutput.textContent = result.toFixed(2);
          })
          .catch(error => {
            resultOutput.textContent = error.message;
          });
      }
    });


    // Currency conversion function
    async function convertCurrency(baseCurrency, targetCurrency, amount) {
      const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${baseCurrency}&to=${targetCurrency}&amount=${amount}&apikey=m2n7khoSb6LCevxQbVulzeejjwhnNEi8`);
      const result = await response.json();

      if (result.success) {
        return result.result;
      } else {
        throw new Error(result.error.info);
      }
    }

  })
  .catch(error => alert(error));

// View historical rates
// event listener for historical rates

const element = document.getElementById("historical-rates");
element.addEventListener('click', () => {

  let historicalRatesContainer = document.getElementById("historical-rates-container");
  
  let baseCurrency = document.getElementById('base-currency').value;
  let targetCurrency = document.getElementById('target-currency').value;

  let currentDate = new Date(); // Get the current date
  let lastWeekDate = new Date(); // Create a new date object for last week
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  let currentDateString = currentDate.toISOString().slice(0, 10);
  let lastWeekDateString = lastWeekDate.toISOString().slice(0, 10);

  // Fetching
  fetch(`https://api.apilayer.com/exchangerates_data/timeseries?start_date=${lastWeekDateString}&end_date=${currentDateString}&base=${baseCurrency}&symbols=${targetCurrency}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Display each result in a new <p> tag
      historicalRatesContainer.innerHTML = '';
      for (const date in result.rates) {
        const p = document.createElement('p');
        p.innerHTML = "Historical Exchange rate on " + date + ": 1 " + baseCurrency + " = " + targetCurrency + " " + result.rates[date][targetCurrency].toFixed(2);
        historicalRatesContainer.appendChild(p);
      }
      
    })
    .catch(error => console.log('error', error));
})
// Favorites
const addFavoriteButton = document.getElementById('save-favorite');
const favoritesList = document.getElementById('favorite-currency-pairs');
let baseCurrencyElement = document.getElementById('base-currency');
let targetCurrencyElement = document.getElementById('target-currency');
// Function to add a favorite currency pair
function addFavorite() {
  const favorite = `${baseCurrencyElement.value}/${targetCurrencyElement.value}`;
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(favorite)) {
    favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
  }
}

// Function to display favorite currency pairs
function displayFavorites() {
  favoritesList.innerHTML = '';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.forEach(favorite => {
    const listItem = document.createElement('span');
    const button = document.createElement('button');
    button.textContent = favorite;
    button.addEventListener('click', () => {
      const currencies = favorite.split('/');
      baseCurrencyElement.value = currencies[0];
      targetCurrencyElement.value = currencies[1];
    });
    listItem.appendChild(button);
    favoritesList.appendChild(listItem);
  });
}

// Event listener for add to favorites button
addFavoriteButton.addEventListener('click', event => {
  event.preventDefault();
  addFavorite();
});

// Initialize favorite currency pairs on page load
displayFavorites();



