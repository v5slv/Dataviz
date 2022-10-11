


fetch('moviedata.json')
  .then(response => response.json())
  .then(moviedata => {
    const annee = moviedata.Year.map(
      index => index.Position
    );
    console.log(annee);
  });

  // -------------Tuto de Chart.js-------------

// async function fetchData() {
//   const moviedata = await (await fetch('moviedata.json')).json();
//   return moviedata;
// }

// fetchData().then(moviedata => {
//   const annee = moviedata.Year.map();
// })

const chart = new Chart(
    document.getElementById('chart'),
    config
);

const config = {
    type: 'line',
    data: data,
    options: {}
}

const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

