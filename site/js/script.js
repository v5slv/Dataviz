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

  
    let colorSet = d3.scaleOrdinal().domain(studios).range(d3.schemeRdGy[9]);
    let colorpush = new Object(studios.map((c,i) => datastudios.push({
      'name': c,
      'color': colorSet(c),
      'id': i
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

    //------Collecte des films oscarisés
    let oscarGroup = data.filter(o =>
      o.oscar == 1
    );
    console.log(oscarGroup);

    let oscarStudios = [...new Set(oscarGroup.map(o => o.studio))];
    console.log(oscarStudios);




    //Création du chart à vue générale----------------------------------------------------------------------------------------

    //------Création du svg dans la div, viewbox pour responsive
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", "0 -10 600 320");

    //------Paramètres des margin
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
      .domain(annees)
      .padding(0.2);

    //------Ajout de l'axe x
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(annees.length).tickFormat(d3.format("d")))
      .style("stroke-width", 2)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    //------Ajout de l'axe y
    chart
      .append("g")
      .call(d3.axisLeft(yScale).ticks(6))
      .style("stroke-width", 2);

    //------Ajout d'un encadré détails du film au survol d'une barre
    const div = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("opacity", 0);

      
    //------Ajout des sous-groupes du chart contenant les barres et leurs icônes
    
    grp.selectAll(".subgroup")
      .data(oscarGroup)
      .enter()
      .append("g")
      .attr("class", d => `subgroup studio${d.studio.id}`)
      .append("rect")
      .attr("class", "barre")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("fill", d => d.studio.color)
      .attr("x", d => xScale(d.year))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d.rating))
      .attr("height", d => height - yScale(d.rating));

    //------Ajout des icônes de films au-dessus de leurs barres (cercle svg avec image en motif)
    grp.selectAll(".subgroup")
      .append("circle")
      .attr("class", "circle")
      .attr("transform", `translate(${margin.left+10},0)`)
      .attr("cx",  d => xScale(d.year))
      .attr("cy", d => yScale(d.rating))
      .attr("r", 13)
      .style("fill", d => `url(#${d.year})`)
      .attr("stroke", d => d.studio.color);

    svg.append("defs").selectAll("pattern")
      .data(oscarGroup)
      .enter()
      .append("pattern")
      .attr("id", d => d.year)
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("viewBox", "0 0 1 1")
      .attr("height", "100%")
      .attr("width", "100%")
      .append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", "1")
      .attr("width", "1")
      .attr("xlink:href",  d => `img/${d.year}.png`)

    //Création de la légende couleur = studio
    let legende = d3.select("#leg")
    .append("svg")
    .attr("viewBox", "0 0 250 195");

    //------Ajout des groupes contenant un point de couleur et le studio associé
    legende.selectAll("g")
      .data(oscarStudios)
      .enter()
      .append("g")
      .attr("class", d => "studio"+d.id)
      .append("circle")
      .attr("cx", 8)
      .attr("cy", (d, i) => 8 + i * 25) // 8 is where the first dot appears. 25 is the distance between dots
      .attr("r", 8)
      .style("fill", d => d.color);

    legende.selectAll("g")
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => 8 + i * 25) // 8 is where the first dot appears. 25 is the distance between dots
      .text(d => d.name)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("fill", "#eeeeee");


    //------Ajout des events au survol et clic (opacité, détails, scroll sur le deuxième chart, musique)
    grp.selectAll(".subgroup")
      .on("mouseover", function (e, d) {
        d3.selectAll(".subgroup")
          .transition()
          .duration(200)
          .style("opacity", 0.2);

        legende.selectAll("g")
          .transition()
          .duration(200)
          .style("opacity", 0.2);

        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", null)
          .style("cursor", "pointer");

        legende.select(`.${this.classList[1]}`)
          .transition()
          .duration(200)
          .style("opacity", null);
  
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html(`<span class="tooltip-film">${d.title}</span><br>Studio : ${d.studio.name}<br>Rating : ${d.rating}`)
          .style("position", "absolute")
          .style("left", (e.pageX + 10) + "px")
          .style("top", (e.pageY - 50) + "px");
      })
      .on("mouseout", function (e, d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);

          d3.selectAll(".subgroup").transition()
          .duration(200)
          .style("opacity", null);

          legende.selectAll("g")
          .transition()
          .duration(200)
          .style("opacity", null);
      })
      .on("click", function (e, d) {
        document.getElementById("podium").scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        d3.select("audio")
          .attr("src", `ost/${d.year}.mp3`);

        d3.select(".audio-title")
        .html(d.title)
      });


    legende.selectAll("g")
      .on("mouseover", function (e, d) {
        legende.selectAll("g")
          .transition()
          .duration(200)
          .style("opacity", 0.2)
          .style("cursor", "default");

        d3.selectAll(".subgroup")
          .transition()
          .duration(200)
          .style("opacity", 0.2);

        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", null);

        d3.selectAll(`.${this.classList}`)
          .transition()
          .duration(200)
          .style("opacity", null);
        console.log(`.${this.classList}`)
      })
      .on("mouseout", function (e, d) {
          d3.selectAll(".subgroup")
          .transition()
          .duration(200)
          .style("opacity", null);
          legende.selectAll("g")
          .transition()
          .duration(200)
          .style("opacity", null);
      })

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

    //Ajout d'une sous-échelle pour mettre plusieurs barres par année
    // const xSubScale = d3
    //   .scaleBand()
    //   .domain(subgroups)
    //   .range([0, x.bandwidth()])
    //   .padding([0.05])

    // let yearGroup = [];
    // let yearpush = new Object(annees.map(a => yearGroup.push({
    //   'year': a,
    //   'film': oscarGroup.filter(o => o.year == a)
    // })));
    // console.log(yearGroup);


    //------Fonction de couleur random à attribuer à chaque studio
    // function RandomColor() {
    //   var letters = '0123456789ABCDEF';
    //   var color = '#';
    //   for (var i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // }
  })
