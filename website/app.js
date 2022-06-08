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
let currentDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Submit button trigger
generate.addEventListener('click', submit);

function submit(event) {
  event.preventDefault();
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  // validate user input
  if (zip === '' || feelings === '')
    return alert('Please enter a zip code or feelings');

  convertZipCode(weatherApiBaseUrl, zip, apiKey)
    // get {lat, lon} values
    .then((data) =>
      fetchWeather(weatherApiBaseUrl, data[0].lon, data[0].lat, apiKey)
    )

    // select values to send to API {date, temp, feelings}
    .then((data) => {
      try {
        if (data) {
          const { temp } = data.main;
          const selectedData = {
            date: currentDate,
            temp,
            feelings
          };
          return selectedData;
        }
      } catch (error) {
        console.error(error);
      }
    })

    // use selectedData to query postData()
    .then((selectedData) => {
      // post to postData endpoint
      postData('/addData', selectedData);
    });
}

// Functions

/**
 *
 * @param {*} weatherApiBaseUrl
 * @param {*} zip
 * @param {*} apiKey
 * @returns
 */
const convertZipCode = async (weatherApiBaseUrl, zip, apiKey) => {
  const res = await fetch(
    `${weatherApiBaseUrl}/geo/1.0/direct?q=${zip}&appid=${apiKey}`
  );
  try {
    const fetchedData = await res.json();
    return fetchedData;
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param {*} weatherApiBaseUrl
 * @param {*} lon
 * @param {*} lat
 * @param {*} apiKey
 * @returns
 */
const fetchWeather = async (weatherApiBaseUrl, lon, lat, apiKey) => {
  const res = await fetch(
    `${weatherApiBaseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  try {
    const fetchedData = await res.json();
    return fetchedData;
  } catch (error) {
    console.error(error);
  }
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
      // Update UI dynamically
      updateUiDynamically('/all');
    }
    return fetchedData;
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
};
