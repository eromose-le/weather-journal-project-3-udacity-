/* Global Variables */
const apiKey = 'db48cf4ae7fb0621085f3a43896247aa&units=imperial';
const weatherApiBaseUrl = `https://api.openweathermap.org`;
const baseUrl = 'http://localhost:5000';
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const content = document.getElementById('content');
const generate = document.getElementById('generate');

// Date instance
let d = new Date();
let currentDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

// Submit button trigger
generate.addEventListener('click', submit);

function submit(event) {
  event.preventDefault();
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  // validate user input
  if (zip === '' || feelings === '')
    return displayError('Please enter a zip code or feelings');

  fetchWeather(weatherApiBaseUrl, zip, apiKey)
    // select values to send to API {date, temp, feelings}
    .then((data) => {
      displayError('');
      validateData(data)
        // use selectedData to query postData()
        .then((selectedData) => {
          // post to postData endpoint
          postData('/addData', selectedData);
        });
    })
    .catch(() => {
      displayError('loading..');
      setTimeout(() => {
        displayError("Can't fetch weather");
      }, 4000);
    });
}

// Functions

/**
 *
 * @param {*} weatherApiBaseUrl
 * @param {*} lon
 * @param {*} lat
 * @param {*} apiKey
 * @returns
 */
const fetchWeather = async (weatherApiBaseUrl, zip = '2643743', apiKey) => {
  const res = await fetch(
    `${weatherApiBaseUrl}/data/2.5/forecast?id=${zip}&appid=${apiKey}`
  );
  try {
    const fetchedData = await res.json();
    return fetchedData;
  } catch (error) {
    return console.error(error);
  }
};

const validateData = async (data) => {
  try {
    if (data) {
      const { temp } = data.list[0].main;
      const selectedData = {
        date: currentDate,
        temp,
        feelings: feelings.value
      };
      return selectedData;
    }
  } catch (error) {
    return console.error(error);
  }
};

const displayError = (message) => {
  const error = document.getElementById('error');
  error.innerHTML = message;
};

/**
 *
 * @param {*} url
 * @param {*} selectedData
 * @returns
 */
const postData = async (url = '', selectedData = {}) => {
  const res = await fetch(`${baseUrl}${url}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedData)
  });

  try {
    const fetchedData = await res.json();
    if (fetchedData) {
      updateUiDynamically('/all');
    }
    return fetchedData;
  } catch (error) {
    displayError('Error getting transmitting weather data');
    return console.error(error);
  }
};

/**
 *
 * @param {*} url
 */
const updateUiDynamically = async (url = '') => {
  const res = await fetch(`${baseUrl}${url}`);
  try {
    const fetchedData = await res.json();
    date.innerHTML = `${fetchedData?.date}`;
    temp.innerHTML = `${Math.round(fetchedData?.temp) + 'degrees'}`;
    content.innerHTML = `${fetchedData?.feelings}`;
  } catch (error) {
    return console.error(error);
  }
};
