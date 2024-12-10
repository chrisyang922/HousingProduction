var bronx = [
  { Year: 2014, Units: 1656 },
  { Year: 2015, Units: 2970 },
  { Year: 2016, Units: 2866 },
  { Year: 2017, Units: 3661 },
  { Year: 2018, Units: 2214 },
  { Year: 2019, Units: 2803 },
  { Year: 2020, Units: 1672 },
  { Year: 2021, Units: 1668 },
  { Year: 2022, Units: 843 },
  { Year: 2023, Units: 1126 },
  { Year: 2024, Units: 129 },
];

var brooklyn = [
  { Year: 2014, Units: 3019 },
  { Year: 2015, Units: 1755 },
  { Year: 2016, Units: 1637 },
  { Year: 2017, Units: 1578 },
  { Year: 2018, Units: 3770 },
  { Year: 2019, Units: 2541 },
  { Year: 2020, Units: 2237 },
  { Year: 2021, Units: 2483 },
  { Year: 2022, Units: 846 },
  { Year: 2023, Units: 351 },
  { Year: 2024, Units: 10 },
];

var manhattan = [
  { Year: 2014, Units: 1678 },
  { Year: 2015, Units: 1639 },
  { Year: 2016, Units: 916 },
  { Year: 2017, Units: 1040 },
  { Year: 2018, Units: 1411 },
  { Year: 2019, Units: 747 },
  { Year: 2020, Units: 615 },
  { Year: 2021, Units: 657 },
  { Year: 2022, Units: 136 },
  { Year: 2023, Units: 95 },
  { Year: 2024, Units: 0 },
];

var queens = [
  { Year: 2014, Units: 266 },
  { Year: 2015, Units: 556 },
  { Year: 2016, Units: 1546 },
  { Year: 2017, Units: 356 },
  { Year: 2018, Units: 1656 },
  { Year: 2019, Units: 2549 },
  { Year: 2020, Units: 529 },
  { Year: 2021, Units: 1192 },
  { Year: 2022, Units: 291 },
  { Year: 2023, Units: 151 },
  { Year: 2024, Units: 117 },
];

var statenIsland = [
  { Year: 2014, Units: 116 },
  { Year: 2015, Units: 67 },
  { Year: 2016, Units: 162 },
  { Year: 2017, Units: 0 },
  { Year: 2018, Units: 0 },
  { Year: 2019, Units: 48 },
  { Year: 2020, Units: 6 },
  { Year: 2021, Units: 0 },
  { Year: 2022, Units: 0 },
  { Year: 2023, Units: 0 },
  { Year: 2024, Units: 0 },
];

const datasets = {
  bronx,
  brooklyn,
  manhattan,
  queens,
  statenIsland,
};

const w = 800;
const h = 600;
const padding = 30;

let xmin = 2014;
let xmax = 2024;
let ymin = 0;
let ymax = 0;

let xScale = d3.scaleLinear().range([padding + 50, w - padding * 2 + 50]);
let yScale = d3.scaleLinear().range([h - padding, padding]);

const svg = d3.select("div#plot")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
const xAxisGroup = svg.append("g").attr("class", "x-axis");
const yAxisGroup = svg.append("g").attr("class", "y-axis");

const line = d3.line()
  .x(d => xScale(d.Year))
  .y(d => yScale(d.Units));

function renderGraph(data) {
  svg.selectAll(".line-path, .circle, .user-line, .real-data-circle, .real-data-line, .interactive-circle").remove();
  svg.on("click", null); 

  const initialData = data.slice(0, 6); 
  const remainingData = [...data.slice(6)]; 
  let userPoints = [...initialData];

  ymin = 0;
  ymax = d3.max(data, d => d.Units);
  xScale.domain([xmin, xmax]);
  yScale.domain([ymin, ymax]);

  const xAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(2014, 2025)) 
    .tickFormat(d => d); 

  const yAxis = d3.axisLeft(yScale).ticks(10);

  xAxisGroup
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  yAxisGroup
    .attr("transform", `translate(${padding + 50}, 0)`)
    .call(yAxis);

  svg.append("path")
    .datum(initialData)
    .attr("class", "line-path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", line);

  svg.selectAll(".circle")
    .data(initialData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Units))
    .attr("r", 5)
    .attr("fill", "black");

  svg.on("click", function (event) {
    if (remainingData.length === 0) return; 

    const nextPoint = remainingData.shift();
    const [clickX, clickY] = d3.pointer(event);

    if (clickY > yScale(0)) {
      remainingData.unshift(nextPoint); 
      return;
    }

    const point = { Year: nextPoint.Year, Units: yScale.invert(clickY) }; 
    userPoints.push(point);

    svg.append("circle")
      .attr("class", "interactive-circle")
      .attr("cx", xScale(nextPoint.Year))
      .attr("cy", clickY)
      .attr("r", 5)
      .attr("fill", "red");

    const guessedData = userPoints.slice(5); 
    svg.selectAll(".user-line").remove(); 
    svg.append("path")
      .datum(guessedData)
      .attr("class", "user-line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d", line);

    if (remainingData.length === 0) {
      document.getElementById("showRealData").disabled = false;
    }
  });

  document.getElementById("showRealData").onclick = function () {
    svg.selectAll(".real-data-circle, .real-data-line").remove();

    const realData = data.slice(5);

    svg.append("path")
      .datum(realData)
      .attr("class", "real-data-line")
      .attr("fill", "none")
      .attr("stroke", "black") 
      .attr("d", line);

    svg.selectAll(".real-data-circle")
      .data(realData)
      .enter()
      .append("circle")
      .attr("class", "real-data-circle")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Units))
      .attr("r", 5)
      .attr("fill", "black");
  };
  document.getElementById("showRealData").disabled = true;
}

document.getElementById("bronx").addEventListener("click", () => renderGraph(datasets.bronx));
document.getElementById("brooklyn").addEventListener("click", () => renderGraph(datasets.brooklyn));
document.getElementById("manhattan").addEventListener("click", () => renderGraph(datasets.manhattan));
document.getElementById("queens").addEventListener("click", () => renderGraph(datasets.queens));
document.getElementById("statenisland").addEventListener("click", () => renderGraph(datasets.statenIsland));

renderGraph(datasets.bronx);