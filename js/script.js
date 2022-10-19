
//Récupération des données du json
fetch('moviedata.json')
  .then((response) => response.json())
  .then(function (moviedata) {

    //Collecte des données à utiliser
    let annees = [...new Set(moviedata.map(movie => movie.year))];
    annees.push(2022, 2023);
    console.log(annees);
    
    //------Fonction de couleur random à attribuer à chaque studio
    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    //------Collecte des studios et ajout des couleurs dans objects
    let studios = [...new Set(moviedata.map(movie => movie.studio))];
    let datastudios = [];
    let colorpush = new Object(studios.map(c => datastudios.push({
      'studio': c,
      'color': getRandomColor()
    })));
    console.log(datastudios);

    //------Collecte des films et leurs données
    let data = [];
    let filmpush = new Object(moviedata.map(movie => data.push({
      'titre': movie.title,
      'year': movie.year,
      'popularity': movie.rating,
      'oscar': movie.oscar
    })));
    console.log(data);
  
  //Création du chart à vue générale
  //------Création du svg dans la div, viewbox pour responsive
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", "0 -10 600 310");
  
  //------Paramètres des margin
  const strokeWidth = 1;
  const margin = { top: 0, bottom: 20, left: 30, right: 20 };

  //------Création du groupe svg pour faire le chart
  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`);
  
  //------Dimensions à utiliser pour délimiter les axes dans le chart
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const grp = chart
    .append("g")
    .attr("transform", `translate(-${margin.left},-${margin.top})`);
  
  //Ajout des échelles des axes
  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([5.5, 10]);
    
  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(annees));

  //Ajout de l'axe x
  chart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(annees.length).tickFormat(d3.format("d")));
  
  //Ajout de l'axe y
  chart
    .append("g")
    .attr("transform", `translate(0, 0)`)
    .call(d3.axisLeft(yScale));
  
    

  //Ajout barres de données
  grp
  .append("rect")
  .attr("transform",`translate(${margin.left},0)`)
  .datum(data)
  .style("fill", "lightblue")
  .attr("width", d.rating - 5.5)
  .attr("height", )

    //PARTIE HS POUR UN CHART AREA
//   const area = d3
//     .area()
//     .x(d => xScale(d.year))
//     .y0(height)
//     .y1(d => yScale(d.popularity));

      // Add area
//   grp
//     .append("path")
//     .attr("transform", `translate(${margin.left},0)`)
//     .datum(data)
//     .style("fill", "lightblue")
//     .attr("stroke", "steelblue")
//     .attr("stroke-linejoin", "round")
//     .attr("stroke-linecap", "round")
//     .attr("stroke-width", strokeWidth)
//     .attr("d", area);
  

})