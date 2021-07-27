import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";

@Component({
  selector: "app-pieBar-chart",
  template: ` <div class="row">
    <div class="col-md-6"><div id="pieChart" #divpieChart></div></div>
    <div class="col-md-6">
      <div id="lineChart" #divlineChart></div>
      <div class="m-3"></div>
      <div id="barChart" #divbarChart></div>
    </div>
  </div>`,
})
export class pieBarChartComponent implements OnInit, OnChanges {
  @ViewChild("divpieChart") pieChartContainer: ElementRef;
  @ViewChild("divbarChart") barChartContainer: ElementRef;
  @ViewChild("divlineChart") lineChartContainer: ElementRef;

  pieHostElement: any;
  barHostElement: any;
  lineHostElement: any;
  unit: string = "M";

  constructor(private miscService: MiscellaneousService) {}

  ngOnInit() {
    try {
      this.dsPieChart();
      this.dsBarChart();
      this.dsLineChart();
    } catch {}
  }

  ngOnChanges() {}

  pieChartDataClone: any[];
  barChartDataClone: any[];
  lineChartDataClone: any[];

  get pieChartData(): any[] {
    return this.pieChartDataClone;
  }

  @Input()
  set pieChartData(data: any[]) {
    if (data != undefined) {
      this.pieChartDataClone = JSON.parse(JSON.stringify(data));
    }
  }

  get barChartData(): any[] {
    return this.barChartDataClone;
  }

  @Input()
  set barChartData(data: any[]) {
    if (data != undefined) {
      this.barChartDataClone = JSON.parse(JSON.stringify(data));
    }
  }

  get lineChartData(): any[] {
    return this.lineChartDataClone;
  }

  @Input()
  set lineChartData(data: any[]) {
    if (data != undefined) {
      this.lineChartDataClone = JSON.parse(JSON.stringify(data));
    }
  }

  get defaultGroup(): any {
    return this.group;
  }

  @Input()
  set defaultGroup(data: any) {
    if (data != undefined) {
      this.group = JSON.parse(JSON.stringify(data));
    }
  }

  colors = d3.schemeCategory10;

  formatAsPercentage = d3.format("%");
  formatAsPercentage1Dec = d3.format(".1%");
  formatAsPercentage2Dec = d3.format(".2%");
  formatAsInteger = d3.format(",");
  formatAsDecimal2Dec = d3.format(",.2f");
  fsec = d3.timeFormat("%S s");
  fmin = d3.timeFormat("%M m");
  fhou = d3.timeFormat("%H h");
  fwee = d3.timeFormat("%a");
  fdat = d3.timeFormat("%d d");
  fmon = d3.timeFormat("%b");

  dsPieChart() {
    let local = this;
    this.pieHostElement = this.pieChartContainer.nativeElement;
    var dataset: any[] = this.pieChartData;

    var width = 400,
      height = 400,
      outerRadius = Math.min(width, height) / 2,
      innerRadius = outerRadius * 0.999,
      innerRadiusFinal = outerRadius * 0.5,
      innerRadiusFinal3 = outerRadius * 0.45,
      color = this.colors;
    var vis = d3
      .select(this.pieHostElement)
      .append("svg:svg")
      .data([dataset])
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
    var arc: any = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

    var arcFinal: any = d3
      .arc()
      .innerRadius(innerRadiusFinal)
      .outerRadius(outerRadius);
    var arcFinal3: any = d3
      .arc()
      .innerRadius(innerRadiusFinal3)
      .outerRadius(outerRadius);

    var pie = d3.pie().value(function (d: any) {
      return d.measure;
    });

    var arcs = vis
      .selectAll("g.slice")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "slice")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", up);
    arcs
      .append("svg:path")
      .attr("fill", function (d, i) {
        return color[i];
      })
      .attr("d", arc)
      .append("svg:title")
      .text(function (d: any) {
        return (
          d.data.category + ": " + local.formatAsPercentage2Dec(d.data.measure)
        );
      });

    d3.selectAll("g.slice")
      .selectAll("path")
      .transition()
      .duration(750)
      .delay(10)
      .attr("d", arcFinal);

    arcs
      .filter(function (d) {
        return d.endAngle - d.startAngle > 0.2;
      })
      .append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return (
          "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"
        );
      })

      .text(function (d: any) {
        return d.data.category.substr(0, 10) + "...";
      });

    function angle(d: any) {
      var a = ((d.startAngle + d.endAngle) * 90) / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }

    vis
      .append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text("Total Value Share")
      .attr("class", "title");

    function mouseover() {
      d3.select(d3.event.currentTarget)
        .select("path")
        .transition()
        .duration(750)

        .attr("d", arcFinal3);
    }

    function mouseout() {
      d3.select(d3.event.currentTarget)
        .select("path")
        .transition()
        .duration(750)

        .attr("d", arcFinal);
    }

    function up(d: any, i: any) {
      local.updateBarChart(d.data.categoryId, color[i]);
      local.updateLineChart(d.data.categoryId, color[i]);
    }
  }

  group: any = this.defaultGroup;

  datasetBarChosen(group: any) {
    var ds = [];
    for (let x in this.barChartData) {
      if (this.barChartData[x].group == group) {
        ds.push(this.barChartData[x]);
      }
    }
    return ds;
  }

  dsBarChartBasics() {
    var margin = { top: 35, right: 5, bottom: 20, left: 50 },
      width = 500 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom,
      colorBar = d3.schemeCategory10,
      barPadding = 1;
    return {
      margin: margin,
      width: width,
      height: height,
      colorBar: colorBar,
      barPadding: barPadding,
    };
  }

  dsBarChart() {
    let local = this;
    this.barHostElement = this.barChartContainer.nativeElement;
    var firstDatasetBarChart = this.datasetBarChosen(this.group);

    var yearlyData = this.datasetLineChartChosen(this.group);
    var maxYear = this.miscService.getMax(yearlyData, "Year");

    var basics = this.dsBarChartBasics();

    var margin = basics.margin,
      width = basics.width,
      height = basics.height,
      colorBar = basics.colorBar,
      barPadding = basics.barPadding;
    var xScale = d3
      .scaleLinear()
      .domain([0, firstDatasetBarChart.length])
      .range([0, width]);

    var yScale = d3
      .scaleLinear()

      .domain([
        0,
        d3.max(firstDatasetBarChart, function (d) {
          return d.measure;
        }),
      ])

      .range([height, 0]);

    var svg = d3
      .select(this.barHostElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "barChartPlot");
    var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let barWidth = Math.min(
      width / firstDatasetBarChart.length - barPadding,
      50
    );

    plot
      .selectAll("rect")
      .data(firstDatasetBarChart)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        let res = xScale(i);
        return res != undefined
          ? res +
              (width / firstDatasetBarChart.length - barPadding) / 2 -
              barWidth / 2
          : 0;
      })
      .attr("width", barWidth)
      .attr("y", function (d) {
        return yScale(d.measure);
      })
      .attr("height", function (d) {
        return height - yScale(d.measure);
      })
      .attr("fill", local.colors[0])
      .append("svg:title")
      .text(function (d: any) {
        return (
          d.category +
          ": " +
          local.formatAsDecimal2Dec(d.measure) +
          " " +
          local.unit
        );
      });

    plot
      .selectAll("text")
      .data(firstDatasetBarChart)
      .enter()
      .append("text")
      .text(function (d) {
        return local.formatAsDecimal2Dec(d.measure) + " " + local.unit;
      })
      .attr("text-anchor", "middle")

      .attr("x", function (d, i) {
        return (
          i * (width / firstDatasetBarChart.length) +
          (width / firstDatasetBarChart.length - barPadding) / 2
        );
      })
      .attr("y", function (d) {
        return yScale(d.measure) - 5;
      })
      .attr("class", "yAxis")
      .attr("fill", local.colors[0]);

    var xLabels = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (margin.top + height) + ")"
      )
      .attr("class", "xLabel");
    xLabels
      .selectAll("text.xAxis")
      .data(firstDatasetBarChart)
      .enter()
      .append("text")
      .text(function (d) {
        return d.category.substr(0, 10) + "...";
      })
      .attr("text-anchor", "middle")

      .attr("x", function (d, i) {
        return (
          i * (width / firstDatasetBarChart.length) +
          (width / firstDatasetBarChart.length - barPadding) / 2
        );
      })
      .attr("y", 15)
      .attr("class", "xAxis");

    let groupDetails = this.pieChartData.filter(function (val, i) {
      return val.categoryId == local.group;
    });

    svg
      .append("text")
      .attr("x", (width + margin.left + margin.right) / 2)
      .attr("y", 15)
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .text(
        groupDetails[0].category +
          "'s Companywise Breakdown " +
          maxYear.category
      );
  }

  updateBarChart(group: any, colorChosen: any) {
    let local = this;
    var currentDatasetBarChart = this.datasetBarChosen(group);
    var yearlyData = this.datasetLineChartChosen(this.group);
    var maxYear = this.miscService.getMax(yearlyData, "Year");
    var basics = this.dsBarChartBasics();

    var margin = basics.margin,
      width = basics.width,
      height = basics.height,
      colorBar = basics.colorBar,
      barPadding = basics.barPadding;
    var xScale = d3
      .scaleLinear()
      .domain([0, currentDatasetBarChart.length])
      .range([0, width]);
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(currentDatasetBarChart, function (d) {
          return d.measure;
        }),
      ])
      .range([height, 0]);
    let barWidth = Math.min(
      width / currentDatasetBarChart.length - barPadding,
      50
    );

    var svg = d3.select("#barChart svg");

    var plot = d3.select("#barChartPlot g");

    plot.selectAll("rect").remove();

    let rect = plot
      .selectAll("rect")
      .data(currentDatasetBarChart)
      .enter()
      .append("rect");

    rect
      .transition()
      .duration(750)
      .attr("x", function (d, i) {
        let res = xScale(i);
        return res != undefined
          ? res +
              (width / currentDatasetBarChart.length - barPadding) / 2 -
              barWidth / 2
          : 0;
      })
      .attr("width", barWidth)
      .attr("y", function (d) {
        return yScale(d.measure);
      })
      .attr("height", function (d) {
        return height - yScale(d.measure);
      })
      .attr("fill", colorChosen);

    rect.append("svg:title").text(function (d: any) {
      return (
        d.category +
        ": " +
        local.formatAsDecimal2Dec(d.measure) +
        " " +
        local.unit
      );
    });
    plot.selectAll("text.yAxis").remove();

    plot
      .selectAll("text.yAxis")
      .data(currentDatasetBarChart)
      .enter()
      .append("text")
      .transition()
      .duration(750)
      .attr("text-anchor", "middle")
      .attr("x", function (d, i) {
        return (
          i * (width / currentDatasetBarChart.length) +
          (width / currentDatasetBarChart.length - barPadding) / 2
        );
      })
      .attr("y", function (d) {
        return yScale(d.measure) - 5;
      })
      .text(function (d) {
        return local.formatAsDecimal2Dec(d.measure) + " " + local.unit;
      })
      .attr("class", "yAxis")
      .attr("fill", colorChosen);

    svg.selectAll("text.title").remove();

    let groupDetails = this.pieChartData.filter(function (val, i) {
      return val.categoryId == group;
    });

    svg
      .selectAll("text.title")
      .data(currentDatasetBarChart)
      .enter()
      .append("text")
      .attr("x", (width + margin.left + margin.right) / 2)
      .attr("y", 15)
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .text(
        groupDetails[0].category +
          "'s Companywise Breakdown " +
          maxYear.category
      );

    var xLabels = svg.select("g.xLabel");

    xLabels.selectAll("text.xAxis").remove();
    xLabels
      .selectAll("text.xAxis")
      .data(currentDatasetBarChart)
      .enter()
      .append("text")
      .text(function (d) {
        return d.category.substr(0, 10) + "...";
      })
      .attr("text-anchor", "middle")

      .attr("x", function (d, i) {
        return (
          i * (width / currentDatasetBarChart.length) +
          (width / currentDatasetBarChart.length - barPadding) / 2
        );
      })
      .attr("y", 15)
      .attr("class", "xAxis");
  }

  datasetLineChartChosen(group: any) {
    var ds = [];
    for (let x in this.lineChartData) {
      if (this.lineChartData[x].group == group) {
        ds.push(this.lineChartData[x]);
      }
    }
    return ds;
  }

  dsLineChartBasics() {
    var margin = { top: 20, right: 10, bottom: 5, left: 50 },
      width = 500 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;
    return {
      margin: margin,
      width: width,
      height: height,
    };
  }

  dsLineChart() {
    let local = this;
    this.lineHostElement = this.lineChartContainer.nativeElement;
    var firstDatasetLineChart = this.datasetLineChartChosen(this.group);

    var maxYear = this.miscService.getMax(firstDatasetLineChart, "Year");

    var basics = this.dsLineChartBasics();

    var margin = basics.margin,
      width = basics.width,
      height = basics.height;
    var xScale = d3
      .scaleLinear()
      .domain([0, firstDatasetLineChart.length - 1])
      .range([0, width]);
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(firstDatasetLineChart, function (d) {
          return d.measure;
        }),
      ])
      .range([height, 0]);
    var line = d3
      .line()

      .x(function (d, i) {
        return xScale(i);
      })
      .y(function (d: any) {
        return yScale(d.measure);
      });
    var svg = d3
      .select(this.lineHostElement)
      .append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "lineChartPlot");

    var dsLength = firstDatasetLineChart.length;

    plot
      .append("text")
      .text(
        local.formatAsDecimal2Dec(firstDatasetLineChart[dsLength - 1].measure) +
          " M"
      )
      .attr("id", "lineChartTitle2")
      .attr("x", width / 2)
      .attr("y", height / 2);

    plot
      .append("path")
      .attr("class", "line")
      .attr("d", line)

      .style("stroke", local.colors[0]);

    plot
      .selectAll(".dot")
      .data(firstDatasetLineChart)
      .enter()
      .append("circle")
      .attr("class", "dot")

      .attr("fill", function (d) {
        return d.measure ==
          d3.min(firstDatasetLineChart, function (d) {
            return d.measure;
          })
          ? "red"
          : d.measure ==
            d3.max(firstDatasetLineChart, function (d) {
              return d.measure;
            })
          ? "green"
          : "white";
      })

      .attr("cx", function (d: any, i: any) {
        let res: any = xScale(i);
        return res;
      })
      .attr("cy", function (d: any) {
        let res: any = yScale(d.measure);
        return res;
      })
      .attr("r", 3.5)
      .attr("stroke", "lightgrey")
      .append("title")
      .text(function (d: any) {
        return d.category + ": " + local.formatAsDecimal2Dec(d.measure) + " M";
      });

    svg
      .append("text")
      .text("Performance " + maxYear.category)
      .attr("id", "lineChartTitle1")
      .attr("x", margin.left + (width + margin.right) / 2)
      .attr("y", 10);
  }

  updateLineChart(group: any, colorChosen: any) {
    let local = this;
    var currentDatasetLineChart = this.datasetLineChartChosen(group);
    var maxYear = this.miscService.getMax(currentDatasetLineChart, "Year");
    var basics = this.dsLineChartBasics();

    var margin = basics.margin,
      width = basics.width,
      height = basics.height;
    var xScale = d3
      .scaleLinear()
      .domain([0, currentDatasetLineChart.length - 1])
      .range([0, width]);
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(currentDatasetLineChart, function (d) {
          return d.measure;
        }),
      ])
      .range([height, 0]);
    var line = d3
      .line()
      .x(function (d, i) {
        return xScale(i);
      })
      .y(function (d: any) {
        return yScale(d.measure);
      });
    var plot = d3.select("#lineChartPlot").datum(currentDatasetLineChart);

    var dsLength = currentDatasetLineChart.length;

    plot
      .select("text")
      .text(
        local.formatAsDecimal2Dec(
          currentDatasetLineChart[dsLength - 1].measure
        ) + " M"
      );

    plot
      .transition()
      .duration(750)
      .select("path")
      .attr("class", "line")
      .attr("d", line)

      .style("stroke", colorChosen);

    plot.selectAll(".dot").remove();

    var circles = plot
      .selectAll(".dot")
      .data(currentDatasetLineChart)
      .enter()
      .append("circle");

    var path = circles
      .transition()
      .duration(750)
      .attr("class", "dot")
      .attr("fill", function (d) {
        return d.measure ==
          d3.min(currentDatasetLineChart, function (d) {
            return d.measure;
          })
          ? "red"
          : d.measure ==
            d3.max(currentDatasetLineChart, function (d) {
              return d.measure;
            })
          ? "green"
          : "white";
      })
      .attr("cx", function (d: any, i: any) {
        let res: any = xScale(i);
        return res;
      })
      .attr("cy", function (d: any) {
        let res: any = yScale(d.measure);
        return res;
      })
      .attr("r", 3.5)

      .style("stroke", colorChosen);
    circles.append("title").text(function (d: any) {
      return d.category + ": " + local.formatAsDecimal2Dec(d.measure) + " M";
    });

    path.selectAll("title").text(function (d: any) {
      return d.category + ": " + local.formatAsDecimal2Dec(d.measure) + " M";
    });

    d3.select("text#lineChartTitle1").text("Performance " + maxYear.category);
  }
}
