// Récupération des données du json
fetch('moviedata.json')
  .then((response) => response.json())
  .then(function (moviedata) {

    // Collecte des données à utiliser
    let annees = [...new Set(moviedata.map(movie => movie.nominationYear))];
    console.log(annees);

    //------Collecte des studios
    let studios = [...new Set(moviedata.map(movie => movie.studio))];
    let datastudios = [];
    let spush = new Object(studios.map((c,i) => datastudios.push({
      'name': c,
      'id': i
    })))

    //------Collecte des films et leurs données
    let data = [];
    let filmpush = new Object(moviedata.map((movie, i) => data.push({
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

    //------Attribution des couleurs voulues aux studios ayant produit des films oscarisés
    let colors = ["8A0B12", "F7DCCA", "E8A888", "878787", "CB7A00", "9FAE42", "F2F2F2", "00604E"];
    oscarStudios.forEach((s,i) => {
      s.color = "#" + colors[i];
    });
  

    // Création du chart

    //------Création du svg dans la div, viewbox pour responsive
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", "0 -20 590 330");

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

    //------Ajout de l'axe y et sa légende
    chart
      .append("g")
      .call(d3.axisLeft(yScale).ticks(6))
      .style("stroke-width", 2)
      .append("text")
      .text("IMDb rating (out of 10)")
      .attr("font-family","Mukta, sans-serif")
      .attr("x", -20)
      .attr("y", -10)
      .style("fill", "#eeeeee")
      .style("text-anchor", "start");

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
      .attr("tabindex", 0)
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

    // Création de la légende couleur = studio
    let legende = d3.select("#leg")
    .append("svg")
    .attr("viewBox", "0 0 250 195")
    .attr("aria-label", "Studios legend");

    //------Ajout des groupes de la légende : un point de couleur et le studio associé
    legende.selectAll("g")
      .data(oscarStudios)
      .enter()
      .append("g")
      .attr("class", d => "studio"+d.id)
      .append("circle")
      .attr("cx", 8)
      .attr("cy", (d, i) => 8 + i * 25)
      .attr("r", 8)
      .style("fill", d => d.color);

    legende.selectAll("g")
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => 8 + i * 25)
      .text(d => d.name)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("fill", "#eeeeee");


    // Ajout des events au survol et clic (opacité : films/studios, scroll sur les détails, image, musique)
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
      });

      function addDetails(e,d) {
        document.getElementById("suite").style.display = "flex";
        document.getElementById("suite").scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        let sameNom = data.filter(movie =>
          movie.year == d.year
        );

        d3.selectAll(".o1, .o0").remove();

        d3.select(".winner-text")
        .selectAll(".o1")
        .data(sameNom)
        .enter()
        .filter(d => d.oscar ==1)
        .append("p")
        .attr("class", "o1")
        .html(d => `<span class="wintitle">${d.title}</span><br>${d.year} winning film <span class="rating">(rating : ${d.rating})</span>`);
        
        d3.select(".nom-container")
        .selectAll(".o")
        .data(sameNom)
        .enter()
        .filter(d => d.oscar == 0)
        .append("p")
        .attr("class", "o0")
        .html(d => `${d.title} <span class="rating">(Rating : ${d.rating})</span>`);
        
        d3.select(".icone-film")
        .attr("src", `img/${d.year}.png` )

        d3.select("audio")
          .attr("src", `ost/${d.year}.mp3`);
      }

      grp.selectAll(".subgroup").on("click", addDetails);
      // Ajout d'event focus pour que les éléments détaillés puissent être accessibles via la navigation au clavier
      grp.selectAll(".subgroup").on("focus", addDetails); 

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
  });
