//fetch block
function updatePie(){
    async function fetchMovie(){
        const url = 'moviedata.json'
        const response = await fetch(url)
        const datapoints = await response.json();
        console.log(datapoints)
        return datapoints;
    };

    fetchMovie().then(datapoints => {
        const studios = [...new Set(datapoints.map(movie => movie.studio))];
        (
            function(index){
                return index.studio;
        })
        console.log(studios)
        myChart.config.data.labels = studios;
        myChart.update();
    })
}

window.addEventListener("load", updatePie);

//setup block
//config block
//render block


const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});