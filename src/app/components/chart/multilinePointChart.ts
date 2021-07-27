import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from "../../services/miscellaneous.service";
const HC_exporting = HC_exporting_;
declare var $: any;
@Component({
  selector: "app-multiline-point-chart",
  template: `
    <div class="chart-wrapper" #divLineChart id="divmultilinePointChart"></div>
  `,
  //styleUrls: ['./chart.css']
})
export class multilinePointChartComponent implements OnInit, OnChanges {
  @ViewChild("divLineChart") chartContainer: ElementRef;

  @Input() data: any[];
  @Input() colours: Array<string>;
  @Input() xColumn: string;
  @Input() yObjects: any;
  @Input() axisLabels: any;

  constructor(
    private elRef: ElementRef,
    private miscService: MiscellaneousService
  ) {}

  ngOnInit() {
    // create chart and render
    //this.createChart();

    //var chart = this.makeLineChart(this.data, this.xColumn, this.yObjects, this.axisLabels,this);
    this.createHightChart();
    // chart.bind("#divmultilinePointChart");
    // chart.render();
  }
  ngOnChanges() {
    // update chart on data input value change
    //if (this.svg) this.updateChart(false);
  }

  createHightChart() {
    let local = this;
    let arrCategories: any[] = [];
    let arrSeries: any[] = [];
    if (this.data === undefined) this.data = [];
    this.data.forEach(function (val, i) {
      var date = new Date(val[local.xColumn]);
      let quater =
        "Q" +
        Math.floor(local.miscService.getQuarter(date)) +
        " " +
        date.getFullYear();
      arrCategories.push(quater);
    });
if(this.yObjects===undefined) this.yObjects={};
    let keys: any[] = Object.keys(this.yObjects);
    let arrMax: any[] = [];
    let arrMin: any[] = [];

    for (let index = 0; index < keys.length; index++) {
      let data: any[] = [];
      this.data.forEach(function (val, i) {
        data.push(val[keys[index]]);
      });

      arrMax.push(Math.max(...data));
      arrMin.push(Math.min(...data));

      var colorArray = [
        "#003264",
        "#F58C3C",
        "#D20F46",
        "#9CC7B7",
        "#E696BC",
        "#00B58C",
        "#878C9B",
        "#D70087",
        "#46BEF5",
        "#A59632",
      ];
      arrSeries.push({
        name: keys[index],
        type: "spline",
        yAxis: index == 0 ? 1 : 0,
        data: data,
        color: colorArray[index],
        tooltip: {
          valueSuffix: keys[index] == "Gross IRR" ? " %" : " x",
        },
      });
    }

    //Calculating Min and Max Value
    let dMax = Math.max(...arrMax); //arrMax[1];//
    let dMin = Math.min(...arrMin); //arrMin[1];//

    //let dMax2 =arrMax[0];// Math.max(...arrMax);
    //let dMin2 =arrMin[0];// Math.min(...arrMin);

    let cht = Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        zoomType: "xy",
        //height: (height + margin.top + margin.bottom) + 30,
        height: 296,
        // marginTop: 50
        // width:width + margin.left + margin.right
        // events: {
        // 	load: addChartCrosshairs
        // }
      },
      title: {
        text: "",
      },
      xAxis: [
        {
          categories: arrCategories,
          // crosshair: true,
          crosshair: { width: 2, color: "steelblue", dashStyle: "Dot" },
          // title: {
          //     text: this.xField,
          // }
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: keys[1],
          },
          //max: dMax,
          //min: dMin,
          // tickInterval: 5
          // crosshair:true
        },
        {
          // Secondary yAxis
          title: {
            text: keys[0],
            rotation: 270,
          },
          //max: dMax,
          //min: dMin,
          // tickInterval: 5,

          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        // followPointer: true,
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        x: 0,
        y: 0,
        // y: 0
      },
      series: arrSeries,
      credits: {
        enabled: false,
      },
    });

    function addChartCrosshairs() {
      var chart = this;
      //initialize the X and Y component of the crosshairs (you can adjust the color and size of the crosshair lines here)
      var crosshairX = chart.renderer
        .path([
          "M",
          chart.plotLeft,
          0,
          "L",
          chart.plotLeft + chart.plotWidth,
          0,
        ])
        .attr({
          stroke: "black",
          "stroke-width": 1,
          zIndex: 0,
        })
        .add()
        .toFront()
        .hide();

      var crosshairY = chart.renderer
        .path(["M", 0, chart.plotTop, "L", 0, chart.plotTop + chart.plotHeight])
        .attr({
          stroke: "black",
          "stroke-width": 1,
          zIndex: 0,
        })
        .add()
        .toFront()
        .hide();

      $(chart.container).mousemove(function (event) {
        //onmousemove move our crosshair lines to the current mouse postion
        crosshairX.translate(0, event.offsetY);
        crosshairY.translate(event.offsetX, 0);

        //only show the crosshairs if we are inside of the plot area (the area within the x and y axis)
        if (
          event.offsetX > chart.plotLeft &&
          event.offsetX < chart.plotLeft + chart.plotWidth &&
          event.offsetY > chart.plotTop &&
          event.offsetY < chart.plotTop + chart.plotHeight
        ) {
          //crosshairX.show();
          crosshairY.show();
        } else {
          //if we are here then we are inside of the container, but outside of the plot area
          crosshairX.hide();
          crosshairY.hide();
        }
      });
    }
  }

  makeLineChart(
    dataset: any[],
    xName: any,
    yObjs: any,
    axisLables: any,
    local: any
  ) {
    var chartObj: any = {};
    var colorArray = ["rgb(0,50,100)", "rgb(245,140,60)", "rgb(210,15,70)"]; //d3.schemeCategory10;
    var color = d3.scaleOrdinal(colorArray);
    chartObj.xAxisLable = axisLables.xAxis;
    chartObj.yAxisLable = axisLables.yAxis;
    chartObj.yAxisRightLable = axisLables.yAxisRight;
    /*
		 yObjsects format:
		 {y1:{column:'',name:'name',color:'color'},y2}
		 */

    chartObj.data = dataset;
    chartObj.margin = { top: 15, right: 60, bottom: 30, left: 50 };
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 300 - chartObj.margin.top - chartObj.margin.bottom;

    // So we can pass the x and y as strings when creating the function
    chartObj.xFunct = function (d: any) {
      return new Date(d[xName]);
    };

    // For each yObjs argument, create a yFunction
    function getYFn(column: any) {
      return function (d: any) {
        return d[column];
      };
    }

    // Object instead of array
    chartObj.yFuncts = [];
    for (var y in yObjs) {
      yObjs[y].name = y;
      yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
      chartObj.yFuncts.push(yObjs[y].yFunct);
    }

    //Formatter functions for the axes
    chartObj.formatAsDate = d3.timeFormat("%b %Y");
    chartObj.formatAsNumber = d3.format(".0f");
    chartObj.formatAsDecimal = d3.format(".2f");
    chartObj.formatAsCurrency = d3.format("$.2f");
    chartObj.formatAsYear = d3.format("");
    chartObj.formatAsFloat = function (d: any) {
      if (d % 1 !== 0) {
        return d3.format(".2f")(d);
      } else {
        return d3.format(".0f")(d);
      }
    };
    chartObj.formatAsQuarter = function (d: any) {
      var date = new Date(d);
      return (
        "Q" +
        Math.floor(local.miscService.getQuarter(date)) +
        " " +
        date.getFullYear()
      );
    };

    chartObj.xFormatter = chartObj.formatAsQuarter;
    chartObj.yFormatter = chartObj.formatAsDecimal;
    chartObj.yRightFormatter = chartObj.formatAsNumber;

    chartObj.bisectYear = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

    var extent: any = d3.extent(chartObj.data, chartObj.xFunct);

    var scaleValues: any[] = [];
    chartObj.data.forEach(function (d: any) {
      scaleValues.push(chartObj.xFunct(d));
    });

    //chartObj.xScale = d3.scaleTime().range([0, chartObj.width]).domain(extent);

    chartObj.xScale = d3
      .scaleLinear()
      .domain(extent)
      .range([0, chartObj.width]);

    // Get the max of every yFunct
    chartObj.max = function (fn: any) {
      return d3.max(chartObj.data, fn);
    };
    chartObj.min = function (fn: any) {
      return d3.min(chartObj.data, fn);
    };
    var max: any = d3.max(chartObj.yFuncts.map(chartObj.max));
    var min: any = d3.min(chartObj.yFuncts.map(chartObj.min));
    chartObj.yScale = d3
      .scaleLinear()
      .range([chartObj.height, 0])
      .domain([0, max]);
    chartObj.yScaleLeft = d3
      .scaleLinear()
      .range([chartObj.height, 0])
      .domain([0, min]);

    //Create axis
    chartObj.xAxis = d3
      .axisBottom(chartObj.xScale)
      .tickFormat(chartObj.xFormatter)
      .tickValues(scaleValues)
      .ticks(scaleValues.length); //< Can be overridden in definition

    chartObj.yAxis = d3
      .axisLeft(chartObj.yScale)
      .tickFormat(chartObj.yFormatter); //< Can be overridden in definition
    chartObj.yRightAxis = d3
      .axisRight(chartObj.yScale)
      .tickFormat(chartObj.yFormatter);
    // Build line building functions
    function getYScaleFn(yObj: any) {
      return function (d: any) {
        return chartObj.yScale(yObjs[yObj].yFunct(d));
      };
    }
    for (var yObj in yObjs) {
      yObjs[yObj].line = d3
        .line()
        .x(function (d: any) {
          return chartObj.xScale(chartObj.xFunct(d));
        })
        .y(getYScaleFn(yObj))
        .curve(d3.curveCatmullRom.alpha(0.5));
    }

    chartObj.svg;

    // Change chart size according to window size
    chartObj.update_svg_size = function () {
      chartObj.width =
        parseInt(chartObj.chartDiv.style("width"), 10) -
        (chartObj.margin.left + chartObj.margin.right);

      chartObj.height =
        parseInt(chartObj.chartDiv.style("height"), 10) -
        (chartObj.margin.top + chartObj.margin.bottom);
      //chartObj.height = parseInt("400", 10) - (chartObj.margin.top + chartObj.margin.bottom);

      /* Update the range of the scale with new width/height */
      chartObj.xScale.range([0, chartObj.width]);

      chartObj.yScale.range([chartObj.height, 0]);

      if (!chartObj.svg) {
        return false;
      }

      /* Else Update the axis with the new scale */
      chartObj.svg
        .select(".x.axis")
        .attr("transform", "translate(0," + chartObj.height + ")")
        .call(chartObj.xAxis);
      chartObj.svg.select(".x.axis .label").attr("x", chartObj.width / 2);

      chartObj.svg.select(".y.axis").call(chartObj.yAxis);
      chartObj.svg.select(".y.axis .label").attr("x", -chartObj.height / 2);

      chartObj.svg
        .select("g.grid")
        .call(chartObj.make_y_gridlines().tickSize(-chartObj.width))
        .selectAll("text")
        .remove();

      /* Force D3 to recalculate and update the line */
      for (var y in yObjs) {
        yObjs[y].path.attr("d", yObjs[y].line);
      }

      d3.selectAll(".focus.line").attr("y2", chartObj.height);

      chartObj.chartDiv
        .select("svg")
        .attr(
          "width",
          chartObj.width + (chartObj.margin.left + chartObj.margin.right)
        )
        .attr(
          "height",
          chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)
        );

      chartObj.svg
        .select(".overlay")
        .attr("width", chartObj.width)
        .attr("height", chartObj.height);
      return chartObj;
    };

    chartObj.bind = function (selector: any) {
      chartObj.mainDiv = d3.select(selector);
      // Add all the divs to make it centered and responsive
      chartObj.mainDiv
        .append("div")
        .attr("class", "inner-wrapper")
        .append("div")
        .attr("class", "outer-box")
        .append("div")
        .attr("class", "inner-box");
      var chartSelector = selector + " .inner-box";
      chartObj.chartDiv = d3.select(chartSelector);
      d3.select(window).on("resize." + chartSelector, chartObj.update_svg_size);
      chartObj.update_svg_size();
      return chartObj;
    };

    chartObj.make_y_gridlines = function () {
      return d3.axisLeft(chartObj.yScale);
    };

    // Render the chart
    chartObj.render = function () {
      //Create SVG element
      //chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");
      chartObj.svg = chartObj.chartDiv
        .append("svg")
        .attr("class", "chart-area")
        .attr(
          "width",
          chartObj.width + (chartObj.margin.left + chartObj.margin.right)
        )
        .attr(
          "height",
          chartObj.height + 10 + (chartObj.margin.top + chartObj.margin.bottom)
        )
        .append("g")
        .attr(
          "transform",
          "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")"
        );
      // gridlines in y axis function

      // add the Y gridlines
      chartObj.svg
        .append("g")
        .attr("class", "grid")
        .call(chartObj.make_y_gridlines().tickSize(-chartObj.width))
        .selectAll("text")
        .remove();

      // Draw Lines
      for (var y in yObjs) {
        yObjs[y].path = chartObj.svg
          .append("path")
          .datum(chartObj.data)
          .attr("class", "line")
          .attr("d", yObjs[y].line)
          .style("stroke", color(y))
          .attr("data-series", y)
          .on("mouseover", function () {
            focus.style("display", null);
          })
          .on("mouseout", function () {
            focus.transition().delay(700).style("display", "none");
          })
          .on("mousemove", mousemove);
      }

      // Draw Axis
      chartObj.svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartObj.height + ")")
        .call(chartObj.xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", chartObj.width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(chartObj.xAxisLable);

      chartObj.svg
        .append("g")
        .attr("class", "y axis")
        .call(chartObj.yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -42)
        .attr("x", -chartObj.height / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(chartObj.yAxisLable);

      chartObj.svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + chartObj.width + ",0)")
        .call(chartObj.yRightAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -chartObj.height / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(chartObj.yAxisRightLable);

      //Draw tooltips
      var focus = chartObj.svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");

      for (var y in yObjs) {
        yObjs[y].tooltip = focus.append("g");
        yObjs[y].tooltip.append("circle").attr("r", 5);
        //yObjs[y].tooltip.append("rect").attr("x", 8).attr("y", "-5").attr("width", 22).attr("height", '0.75em');
        yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
      }

      // Year label
      focus
        .append("text")
        .attr("class", "focus year")
        .style("fill", "#1e28a0")
        .style("font-size", "1em")
        .attr("x", 9)
        .attr("y", 0);
      // Focus line
      focus
        .append("line")
        .attr("class", "focus line")
        .attr("y1", 0)
        .attr("y2", chartObj.height);

      //Draw legend
      var legend = chartObj.mainDiv.append("div").attr("class", "legend");
      for (var y in yObjs) {
        var series = legend.append("div");
        series
          .append("div")
          .attr("class", "series-marker")
          .style("background-color", color(y));
        series.append("p").text(y);
        yObjs[y].legend = series;
      }

      // Overlay to capture hover
      chartObj.svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", chartObj.width)
        .attr("height", chartObj.height)
        .on("mouseover", function () {
          focus.style("display", null);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
        })
        .on("mousemove", mousemove);

      return chartObj;
      function mousemove() {
        var x0 = chartObj.xScale.invert(d3.mouse(d3.event.target)[0]),
          i = chartObj.bisectYear(dataset, x0, 1),
          d0 = chartObj.data[i - 1],
          d1 = chartObj.data[i];
        try {
          var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
        } catch (e) {
          return;
        }
        var minY = chartObj.height;
        for (var y in yObjs) {
          yObjs[y].tooltip.attr(
            "transform",
            "translate(" +
              chartObj.xScale(chartObj.xFunct(d)) +
              "," +
              chartObj.yScale(yObjs[y].yFunct(d)) +
              ")"
          );
          let tooltipText = chartObj.yFormatter(yObjs[y].yFunct(d));
          yObjs[y].tooltip.select("text").text(tooltipText);
          minY = Math.min(minY, chartObj.yScale(yObjs[y].yFunct(d)));
        }

        focus
          .select(".focus.line")
          .attr(
            "transform",
            "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")"
          )
          .attr("y1", minY);
        focus
          .select(".focus.year")
          .text("Quarter: " + chartObj.xFormatter(chartObj.xFunct(d)));
      }
    };
    return chartObj;
  }
}
