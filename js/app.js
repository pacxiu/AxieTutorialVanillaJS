const API_KEY = 'your api key for infura';
let address = null;

window.addEventListener("load", async function() {

  if (window.ethereum) {
    // new privacy mode
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
    } catch (error) {
      console.log(error);
    }
  } else if (window.web3) {
    // old way of asking for web3
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // connect to custom provider, like Infura if there is no wallet detected
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/' + API_KEY)); 
  }
  
  setInterval(requestAccount, 1000);
});

function requestAccount() {
  web3.eth.getAccounts(function(error, result) {
    // only update if address changed or on init
    if (address === null || address !== result[0]) {
      address = result[0];
      if (address === undefined) {
        document.getElementById('eth-address').innerHTML = "No account";
      } else {
        requestAxies();
        document.getElementById('eth-address').innerHTML = result[0];
      }
    }
  });
}

function requestAxies() {
  const BASE_URL = 'https://axieinfinity.com/api/';
  const URL = BASE_URL + 'addresses/' + address + '/axies?offset=0&stage=4';
  document.getElementById('loader').classList.add('visible');

  axios.get(URL)
    .then(function(response) {
      document.getElementById('loader').classList.remove('visible');
      paintAxies(response.data);
    })
    .catch(function(error) {
      console.log(error);
    })
}

async function paintAxies(axiesData) {
  const BASE_URL = 'https://api.axieinfinity.com/v1/';
  const axiesContainer = document.getElementById('axies');
  const axies = axiesData.axies;
  axiesContainer.innerHTML = '';

  for (let i = 0; i < axies.length; i += 1) {
    const axie = axies[i];

    await axios.get(BASE_URL + 'figure/' + axie.id)
      .then(function(response) {
        const staticImage = response.data.images.static.idle;
        const HTML = '<img id="' + axie.id + '" class="axie" src="' + staticImage + '" alt="" />';
        axiesContainer.insertAdjacentHTML('beforeend', HTML);
      })
      .catch(function(error) {
        console.log(error);
      })
  }
}