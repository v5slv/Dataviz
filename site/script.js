fetch('moviedata.json')
  .then((response) => response.json())
  .then(function (moviedata) {
      let labels = [...new Set(moviedata.map(movie => movie.year))];
      console.log(labels);

      let filmObjects = [];
      let filmObject = new Object(moviedata.map(movie => filmObjects.push({
        'titre':movie.title,
        'x':movie.year,
        'y':movie.rating,
        'studio': movie.studio
      })));
      console.log(filmObjects)

      let courbesStudio = [];
      let studios = [...new Set(moviedata.map(movie => movie.studio))];
      console.log(studios)
      
      let studioPush = new Set((studios.map(studio => 
        courbesStudio.push({
        'label': studio,
      }))));
      console.log(courbesStudio);
      
      //FAIRE AUTANT DE COURBES QUE DE STUDIOS
      //DU COUP UN FOREACH DE STUDIO DANS UN TABLEAU STUDIOS
      // un studio a plusieurs films, note des films = y, années des films = x

      // une courbe a plusieurs films :
      // dans son data il y aura [{film:"", x:2001, y:0},{film:"Shrek", x:2002, y:7,4}]

      // const data = {
      //   labels: labels,
      //   let datasets = [];
      //
      // {
      //       label: 'Pixar',
      //       data: [0, 7.7, 7.4, 8.2, 7],
      //       backgroundColor: 'rgb(255, 99, 132)',
      //       borderColor: 'rgb(255, 99, 132)',
      //     }
      //   

      const data = {
        labels: labels,
        datasets: [{
            label: 'Pixar',
            data: [{
                x: 2001,
                y: 0
              },
              {
                x: 2002,
                y: 5
              },
              {
                x: 2003,
                y: 8
              },
              {
                x: 2004,
                y: 7
              },
              {
                x: 2005,
                y: 7.5
              }
            ],
            
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'Disney',
            data: [0, 7, 8, 8.7, 6.8],
            backgroundColor: 'rgb(55, 132, 99)',
            borderColor: 'rgb(55, 132, 99)',
          },
          {
            label: 'Dreamworks',
            data: [0, 6.8, 7, 7.2, 7.6],
            backgroundColor: 'rgb(25, 99, 132)',
            borderColor: 'rgb(25, 99, 132)',
          },

        ]
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          },
          scales: {
            y: {
              max: 10,
              min: 0,
              ticks: {
                stepSize: 1
              }
            }
          },
          elements: {
            point: {
              pointStyle: 'circle'
            }
          }
        },
      };


      
  

      const chart = new Chart(
        document.getElementById('chart'),
        config
      );

    }

  )