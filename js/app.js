const API_KEY = 'your api key for infura';
let address = null;
let axiesRequested = false;

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
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/' + API_KEY)); 
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
        axiesRequested = false;
        document.getElementById('eth-address').innerHTML = result[0];
      }

      if (!axiesRequested) {
        requestAxies();
      }
    }
  });
}

function requestAxies() {
  document.getElementById('loader').classList.add('visible');
  axiesRequested = true;

  axios.get('https://axieinfinity.com/api/addresses/' + address + '/axies?offset=0&stage=4')
    .then(function(response) {
      document.getElementById('loader').classList.remove('visible');
      paintAxies(response.data);
    })
    .catch(function(error) {
      console.log(error);
    })
}

function paintAxies(axiesData) {
  const axiesContainer = document.getElementById('axies');
  const axies = axiesData.axies;

  axies.forEach(function(axie) {
    axiesContainer.insertAdjacentHTML('beforeend', '<img id="' + axie.id + '" class="axie" src="" alt="" />')

    axios.get('https://api.axieinfinity.com/v1/figure/' + axie.id)
      .then(function(response) {
        const images = response.data;
        const image = document.getElementById(axie.id);
        image.setAttribute('src', images.static.idle);
      })
      .catch(function(error) {
        console.log(error);
      })
  })
}