/**
 * Created by rHermes on 13.11.2014.
 */
/*global d3, crossfilter */

// Creatre local function
(function () {
  "use strict";

  function getAttr(attr) {
    return function (d) {
      return d[attr];
    };
  }

  function drawFrequencyChart(iScores, cScores) {
    // Will be a grouped bar chart

    // variables
    var margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      max = Math.max(d3.max(iScores, getAttr('value')), d3.max(cScores, getAttr('value')));

    // reformatting the data

    // Scales
    var x0 = d3.scale.ordinal()
      .domain(d3.range(0, 10.1, 0.1))
      .rangeBands([0, width]);

    var x1 = d3.scale.ordinal()
      .domain(["c", "i"])
      .rangeBands([0, x0.rangeBand()]);

    var y = d3.scale.linear()
      .domain([0, max])
      .range([height, 0]);

    var color = d3.scale.ordinal()
      .domain(['IGN', 'Community'])
      .range(["#ff7f0e", "#1f77b4"]);

    var xAxis = d3.svg.axis()
      .scale(x0)
      .tickValues(d3.range(0, 10.5, 0.5))
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    var svg = d3.select("svg#frequencyComparison")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // adding x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // adding y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text") // adding legend
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

    // community
    svg.selectAll("rect.comm")
      .data(cScores)
      .enter().append("rect")
      .attr("class", "comm")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1('c') + x0(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", color("Community"));

    // ign
    svg.selectAll("rect.ign")
      .data(iScores)
      .enter().append("rect")
      .attr("class", "ign")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1('i') + x0(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function (d) { return height - y(d.value); })
      .attr("fill", color("IGN"));


    // Legenmd
    var legend = svg.selectAll(".legend")
      .data(["IGN", "Community"])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  }


  function main(error, rows) {
    // Create the crossfilter rows
    var reviews = crossfilter(rows),
      dims = {},
      groups = {};

    dims.iScore  = reviews.dimension(getAttr('iScore'));
    dims.cScore  = reviews.dimension(getAttr('cScore'));
    dims.cRaters = reviews.dimension(getAttr('cRaters'));

    // Create groups
    groups.iScore = dims.iScore.group();
    groups.cScore = dims.cScore.group();

    // Create filter
    dims.cRaters.filter(function (raters) { return raters !== -1; });

    // Draw frequency chart
    drawFrequencyChart(groups.iScore.top(Infinity).filter(function (d) { return d.key !== -1; }),
      groups.cScore.top(Infinity).filter(function (d) { return d.key !== -1; }));

  }

  d3.csv("/static/data/ignreviews-latest.csv", function (d) {
    return {
      title: d.title,
      platform: d.platform,
      iScore: +d.IGNScore,
      cScore: +d.CommScore,
      cRaters: +d.CommRaters,
      genre: d.genre,
      publisher: d.publisher,
      releaseDate: d.releaseDate,
      reviewDate: d.reviewDate
    };
  }, main);
}());
