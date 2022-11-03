//Récupération des données du json
fetch('moviedata.json')
  .then((response) => response.json())
  .then(function (moviedata) {

    //Collecte des données à utiliser
    let annees = [...new Set(moviedata.map(movie => movie.nominationYear))];
    console.log(annees);

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
      'studio': datastudios.filter(studio => studio.name == movie.studio)[0]
    })));
    console.log(data);


    let obj1 = Object.assign({}, annees);
    console.log(obj1)
    let films = [];
    let zoompush = new Object(annees.map(a => films.push({
        'year' : a,
        'films': data.filter(movie => movie.nominationYear == a)[0]
    })))
    console.log(films)

    


    //Création du chart à vue générale----------------------------------------------------------------------------------------

    //------Création du svg dans la div, viewbox pour responsive
    const svg = d3
      .select("#podium")
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

    //------Ajout des échelles des axes
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([6, 9]);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.2);

    //------Ajout de l'axe x
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    //------Ajout de l'axe y
    chart
      .append("g")
      .call(d3.axisLeft(yScale));

    //------Ajout d'un encadré détails du film au survol d'une barre
    const div = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("opacity", 0);

    // //------Ajout des barres (films oscarisés)
    // grp.selectAll(".barre")
    //   .data(oscarGroup)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "barre")
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .attr("fill", d => d.studio.color)
    //   .attr("x", d => xScale(d.year))
    //   .attr("width", xScale.bandwidth())
    //   .attr("y", d => yScale(d.rating))
    //   .attr("height", d => height - yScale(d.rating))

//       //------Ajout des events au survol et clic
//       .on("mouseover", function (e, d) {
//         d3.selectAll(".barre")
//           .style("opacity", 0.6);
//         d3.select(this)
//           .style("opacity", null)
//           .style("cursor", "pointer");

//         div.transition()
//           .duration(200)
//           .style("opacity", 0.9);
//         div.html(`<span class="tooltip-film">${d.title}</span><br>Studio : ${d.studio.name}<br>Rating : ${d.rating}`)
//           .style("position", "absolute")
//           .style("left", (e.pageX + 10) + "px")
//           .style("top", (e.pageY - 50) + "px");
//       })
//       .on("mouseout", function (e, d) {
//         div.transition()
//           .duration(500)
//           .style("opacity", 0);
//       })
//       .on("click", function () {
//         console.log("coucou");
//         document.getElementById("podium").scrollIntoView({
//           behavior: "smooth",
//           block: "center"
//         });
//       });

//     d3.select("#podium")
//       .append("h1")
//       .attr("class", "titlechart")
//       .html(annees[0]);

})