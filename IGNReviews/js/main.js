/**
 * Created by rHermes on 04.11.2014.
 */
/*global _, fallback, crossfilter, d3, cfu */
fallback.ready(["crossfilter", "d3", "_", "cfu"], function () {
  "use strict";

  // Expects two arrays with objects in them with Object with key and value
  // This will be reworked as soon as I have time.
  function CVIScoresBarChart(iscores, cscores) {
    // Settings for the chart
    var margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = 1000 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    // BLACK MAGIC AHEAD!

    var svg = d3.select("#CommVsIGNScoresSVG")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var xScale = d3.scale.ordinal()
      .domain(d3.range(0, 10.1, 0.1))// This is to get the right amount of values :)
      .rangeRoundBands([0, width], 0.1);

    var yScaleU = d3.scale.linear()
      .domain([0, _.max(iscores, 'value').value + 100])
      .range([height/2, 0]); // This makes it so that the values are swapped :D

    var yScaleD = d3.scale.linear()
      .domain([0, _.max(iscores, 'value').value + 100])
      .range([0, height/2]); // This makes it so that the values are swapped :D

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickValues(d3.range(0, 10.5, 0.5))
      .orient("bottom");

    var yAxisU = d3.svg.axis()
      .scale(yScaleU)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    var yAxisD = d3.svg.axis()
      .scale(yScaleD)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    // Draw Y-axis grid lines
    svg.append("g")
      .attr("class", "ylines")
      .selectAll("line.y")
      .data(yScaleU.ticks(10))
      .enter().append("line")
      .attr("class", "y")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScaleU)
      .attr("y2", yScaleU);

    svg.append("g")
      .attr("class",  "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxisU);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0, " + height/2 + ")")
      .call(yAxisD);

    // draw the actual chart
    // IGN scores up
    var barU = svg.selectAll('g.barU')
      .data(iscores)
      .enter().append("g")
      .attr("class", "barU ign")
      .attr("transform", function (d) { return "translate(" + xScale(d.key) + "," + yScaleU(d.value) + ")"; });

    barU.append("rect")
      .attr("width", xScale.rangeBand())
      .attr("height", function (d) { return height/2 - yScaleU(d.value); });

    // Community scores down scores up
    var barD = svg.selectAll('g.barD')
      .data(cscores)
      .enter().append("g")
      .attr("class", "barD comm")
      .attr("transform", function (d) { return "translate(" + xScale(d.key) + "," + (height/2) + ")"; });

    barD.append("rect")
      .attr("width", xScale.rangeBand())
      .attr("height", function (d) { return yScaleD(d.value); });
  }

  // Parses the incoming rows from d3.csv
  function parseRow(d) {
    return {
      title: d.title,
      IGNScore: +d.IGNScore,
      CommScore: +d.CommScore,
      CommRaters: +d.CommRaters,
      genre: d.genre,
      publisher: d.publisher,
      developer: d.developer,
      releaseDate: d.releaseDate,
      reviewDate: d.reviewDate
    };
  }

  // This part of the application handles the data
  function handleData(error, rows) {
    if (error) {
      alert("Failed with error: " + error.statusText);
      throw new Error("Could not load csv file!");
    }

    var reviews = crossfilter(rows),
      dims = {},
      groups = {};

    // Create all dimensions
    dims.iScores = reviews.dimension(cfu.getKey('IGNScore'));
    dims.cScores = reviews.dimension(cfu.getKey('CommScore'));
    dims.cRaters = reviews.dimension(cfu.getKey('CommRaters'));

    // Create all groups
    groups.iScoresByScore = dims.iScores.group();
    groups.cScoresByScore = dims.cScores.group();

    // For this we filter out the games without raters, to get a fair comparison
    dims.cRaters.filter(function (raters) {
      return raters !== -1;
    });

    // Create two arrays of objects with key and value. Filter on value, to exclude 0 values.
    var iScoresArr = _.filter(groups.iScoresByScore.top(Infinity), 'value'),
      cScoresArr = _.filter(groups.cScoresByScore.top(Infinity), 'value');

    CVIScoresBarChart(iScoresArr, cScoresArr);
  }


  // Now we call these glorious functions with our glorius data!
  d3.csv("../data/ignreviews-latest.csv", parseRow, handleData);
});
