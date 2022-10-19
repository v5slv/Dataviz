//Récupération des données du json
fetch('moviedata.json')
  .then((response) => response.json())
  .then(function (moviedata) {

    //Collecte des données à utiliser
    let annees = [...new Set(moviedata.map(movie => movie.nominationYear))];
    console.log(annees);

    //------Fonction de couleur random à attribuer à chaque studio
    // function RandomColor() {
    //   var letters = '0123456789ABCDEF';
    //   var color = '#';
    //   for (var i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // }

    //------Collecte des studios et attribution de leurs couleurs
    let studios = [...new Set(moviedata.map(movie => movie.studio))];
    let datastudios = [];

    let colorSet = d3.scaleOrdinal().domain(studios).range(d3.schemeSet3);
    let colorpush = new Object(studios.map(c => datastudios.push({
      'name': c,
      'color': colorSet(c)
    })));
    console.log(datastudios);

    //------Collecte des films et leurs données
    let data = [];
    let filmpush = new Object(moviedata.map(movie => data.push({
      'title': movie.title,
      'year': movie.nominationYear,
      'rating': movie.rating,
      'oscar': movie.oscar,
      'studio' : datastudios.filter(studio => studio.name == movie.studio)[0]
    })));
    console.log(data);

    //------Collecte des films oscarisés
    let oscarGroup = data.filter(o =>
      o.oscar == 1
    );
    console.log(oscarGroup);

    // let yearGroup = [];
    // let yearpush = new Object(annees.map(a => yearGroup.push({
    //   'year': a,
    //   'film': oscarGroup.filter(o => o.year == a)
    // })));
    // console.log(yearGroup);


  //Ajout barres de données
  // grp
  // .append("rect")
  // .attr("transform",`translate(${margin.left},0)`)
  // .datum(data)
  // .style("fill", "lightblue")
  // .attr("width", d.rating - 5.5)
  // .attr("height", )
    //Création du chart à vue générale
    //------Création du svg dans la div, viewbox pour responsive
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", "0 -10 600 310");

    //------Paramètres des margin
    const strokeWidth = 1;
    const margin = {
      top: 0,
      bottom: 20,
      left: 30,
      right: 20
    };

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
      .domain([6, 9]);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(annees)
      .padding(0.2);

    //Ajout d'une sous-échelle pour mettre plusieurs barres par année
    // const xSubScale = d3
    //   .scaleBand()
    //   .domain(subgroups)
    //   .range([0, x.bandwidth()])
    //   .padding([0.05])

    //Ajout de l'axe x
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(annees.length).tickFormat(d3.format("d")));

    //Ajout de l'axe y
    chart
      .append("g")
      .call(d3.axisLeft(yScale));



    //Ajout barres de données
    // grp
    //   .selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("transform",`translate(${margin.left},0)`)
    //   .style("fill", "lightblue")
    //   .attr("x", d => xScale(d.year))
    //   .attr("width", xScale.bandwidth())
    //   .attr("y", d => yScale(d.rating))
    //   .attr("height", d => height - yScale(d.rating));

    const div = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("opacity", 0);

    grp.selectAll(".bar")
      .data(oscarGroup)
      .enter()
      .append("rect")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("fill", d => d.studio.color)
      .attr("class", "bar")
      .attr("x", d => xScale(d.year))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d.rating))
      .attr("height", d => height - yScale(d.rating))
      .on("mouseover", function (e, d) {
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html(`Film : ${d.title}<br> Rating : ${d.rating}`)
          .style("left", (e.pageX + 10) + "px")
          .style("top", (e.pageY - 50) + "px");
      })
      .on("mouseout", function (e, d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(e, d){

      });

    console.log(yScale(7))

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