import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';


@Component({
	selector: 'app-multiline-chart',
	template: `
     
<div #divLineChart ></div>
    `,
	//styleUrls: ['./chart.css']
})


export class multilineChartComponent implements OnInit, OnChanges {

	@ViewChild('divLineChart') chartContainer: ElementRef;

	//@Input() data: any[];
	@Input() colours: Array<string>;

	svg: any;
	opacity: any;
	chart: any;
	hostElement: any;

	create: any; update: any;

	data: any[] = [
		{
			"date": 20111001,
			"New York": 63.4,
			"San Francisco": 62.7,
			"Austin": 72.2
		},
		{
			"date": 20111002,
			"New York": 58,
			"San Francisco": 59.9,
			"Austin": 67.7
		},
		{
			"date": 20111003,
			"New York": 53.3,
			"San Francisco": 59.1,
			"Austin": 69.4
		},
		{
			"date": 20111004,
			"New York": 55.7,
			"San Francisco": 58.8,
			"Austin": 68
		},
		{
			"date": 20111005,
			"New York": 64.2,
			"San Francisco": 58.7,
			"Austin": 72.4
		},
		{
			"date": 20111006,
			"New York": 58.8,
			"San Francisco": 57,
			"Austin": 77
		},
		{
			"date": 20111007,
			"New York": 57.9,
			"San Francisco": 56.7,
			"Austin": 82.3
		},
		{
			"date": 20111008,
			"New York": 61.8,
			"San Francisco": 56.8,
			"Austin": 78.9
		},
		{
			"date": 20111009,
			"New York": 69.3,
			"San Francisco": 56.7,
			"Austin": 68.8
		},
		{
			"date": 20111010,
			"New York": 71.2,
			"San Francisco": 60.1,
			"Austin": 68.7
		},
		{
			"date": 20111011,
			"New York": 68.7,
			"San Francisco": 61.1,
			"Austin": 70.3
		},
		{
			"date": 20111012,
			"New York": 61.8,
			"San Francisco": 61.5,
			"Austin": 75.3
		},
		{
			"date": 20111013,
			"New York": 63,
			"San Francisco": 64.3,
			"Austin": 76.6
		},
		{
			"date": 20111014,
			"New York": 66.9,
			"San Francisco": 67.1,
			"Austin": 66.6
		},
		{
			"date": 20111015,
			"New York": 61.7,
			"San Francisco": 64.6,
			"Austin": 68
		},
		{
			"date": 20111016,
			"New York": 61.8,
			"San Francisco": 61.6,
			"Austin": 70.6
		},
		{
			"date": 20111017,
			"New York": 62.8,
			"San Francisco": 61.1,
			"Austin": 71.1
		},
		{
			"date": 20111018,
			"New York": 60.8,
			"San Francisco": 59.2,
			"Austin": 70
		},
		{
			"date": 20111019,
			"New York": 62.1,
			"San Francisco": 58.9,
			"Austin": 61.6
		},
		{
			"date": 20111020,
			"New York": 65.1,
			"San Francisco": 57.2,
			"Austin": 57.4
		},
		{
			"date": 20111021,
			"New York": 55.6,
			"San Francisco": 56.4,
			"Austin": 64.3
		},
		{
			"date": 20111022,
			"New York": 54.4,
			"San Francisco": 60.7,
			"Austin": 72.4
		}
	]

	constructor(
		private elRef: ElementRef
	) { }

	ngOnInit() {
		// create chart and render
		this.createChart();

		// Initial update
		//this.updateChart(true);

		// For animation purpose we load the real value after a second
		//setTimeout(() => this.updateChart(false), 50);
	}

	ngOnChanges() {
		// update chart on data input value change
		//if (this.svg) this.updateChart(false);
	}

	createChart() {

		var local = this;

		this.hostElement = this.chartContainer.nativeElement;

		this.chart = d3.select(this.hostElement);

        this.svg = this.chart.append("svg");

        let parentWidth = 960;
        if (this.hostElement && this.hostElement.clientWidth > 0) {
            parentWidth = this.hostElement.clientWidth;
        }

		var margin = {
			top: 20,
			right: 80,
			bottom: 30,
			left: 50
		},
            width = parentWidth - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		var parseDate = d3.timeParse("%Y%m%d");

		var x = d3.scaleTime()
			.range([0, width]);

		var y = d3.scaleLinear()
			.range([height, 0]);

		

		var color = d3.scaleOrdinal(d3.schemeCategory10);

		var xAxis = d3.axisBottom(x);

		var yAxis = d3.axisLeft(y);

		var line = d3.line()
			.x(function (d: any) {
				return x(d.date);
			})
			.y(function (d: any) {
				return y(d.temperature);
			}).curve(d3.curveBasis);

		this.svg = this.svg
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//var data = d3.tsv.parse(myData);

		color.domain(d3.keys(local.data[0]).filter(function (key) {
			return key !== "date";
		}));

		this.data.forEach(function (d: any) {
			d.date = parseDate(d.date);
		});

		var cities = color.domain().map(function (name) {
			return {
				name: name,
				values: local.data.map(function (d: any) {
					return {
						date: d.date,
						temperature: +d[name]
					};
				})
			};
		});


		var extent = d3.extent(local.data, function (d) {
			return d.date;
		})

		x.domain(extent != [undefined, undefined] ? extent : [0, 0]);

		var min = d3.min(cities, function (c) {
			return d3.min(c.values, function (v) {
				return v.temperature;
			});
		})
		var max = d3.max(cities, function (c) {
			return d3.max(c.values, function (v) {
				return v.temperature;
			});
		})

		y.domain([min != undefined ? min : 0, max != undefined ? max : 0]);

		var legend = this.svg.selectAll('g')
			.data(cities)
			.enter()
			.append('g')
			.attr('class', 'legend');

		legend.append('rect')
			.attr('x', width - 20)
			.attr('y', function (d: any, i: any) {
				return i * 20;
			})
			.attr('width', 10)
			.attr('height', 10)
			.style('fill', function (d: any) {
				return color(d.name);
			});

		legend.append('text')
			.attr('x', width - 8)
			.attr('y', function (d: any, i: any) {
				return (i * 20) + 9;
			})
			.text(function (d: any) {
				return d.name;
			});

		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		this.svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Temperature (ºF)");

		var city = this.svg.selectAll(".city")
			.data(cities)
			.enter().append("g")
			.attr("class", "city");

		city.append("path")
			.attr("class", "line")
			.attr("d", function (d: any) {
				return line(d.values);
			})
			.style("stroke", function (d: any) {
				return color(d.name);
			});

		city.append("text")
			.datum(function (d: any) {
				return {
					name: d.name,
					value: d.values[d.values.length - 1]
				};
			})
			.attr("transform", function (d: any) {
				return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
			})
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function (d: any) {
				return d.name;
			});

		var mouseG = this.svg.append("g")
			.attr("class", "mouse-over-effects");

		mouseG.append("path") // this is the black vertical line to follow mouse
			.attr("class", "mouse-line")
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", "0");



		var lines: any = document.getElementsByClassName('line');



		var mousePerLine = mouseG.selectAll('.mouse-per-line')
			.data(cities)
			.enter()
			.append("g")
			.attr("class", "mouse-per-line");

		mousePerLine.append("circle")
			.attr("r", 7)
			.style("stroke", function (d: any) {
				return color(d.name);
			})
			.style("fill", "none")
			.style("stroke-width", "1px")
			.style("opacity", "0");

		mousePerLine.append("text")
			.attr("transform", "translate(10,3)");


		var focus = mouseG.append("g")
			.attr("class", "focus")
			.style("display", "none");

		focus.append("line")
			.attr("class", "x-hover-line hover-line")
			.attr("y1", 0)
			.attr("y2", height);

		focus.append("line")
			.attr("class", "y-hover-line hover-line")
			.attr("x1", width)
			.attr("x2", width);

		focus.append("circle")
			.attr("r", 7.5);

		focus.append("text")
			.attr("x", 15)
			.attr("dy", ".31em");


		mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
			.attr('width', width) // can't catch mouse events on a g element
			.attr('height', height)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function () { // on mouse out hide line, circles and text
				d3.select(".mouse-line")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "0");
			})
			.on('mouseover', function () { // on mouse in show line, circles and text
				d3.select(".mouse-line")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "1");
			})
			.on('mousemove', function () { // mouse moving over canvas
				var mouse = d3.mouse(d3.event.target);
				d3.select(".mouse-line")
					.attr("d", function () {
						var d = "M" + mouse[0] + "," + height;
						d += " " + mouse[0] + "," + 0;
						return d;
					});

				d3.selectAll(".mouse-per-line")
					.attr("transform", function (d:any, i) {
						//console.log(width / mouse[0])
						var xDate = x.invert(mouse[0]),
							bisect = d3.bisector(function (d:any) { return d.date; }).right;
						var idx = bisect(d.values, xDate);

						var beginning = 0,
							end = lines[i].getTotalLength(),
							target = null;

						while (true) {
							target = Math.floor((beginning + end) / 2);
							var pos = lines[i].getPointAtLength(target);
							if ((target === end || target === beginning) && pos.x !== mouse[0]) {
								break;
							}
							if (pos.x > mouse[0]) end = target;
							else if (pos.x < mouse[0]) beginning = target;
							else break; //position found
						}

						d3.select(this).select('text')
							.text(y.invert(pos.y).toFixed(2));

						return "translate(" + mouse[0] + "," + pos.y + ")";
					});
			});
			//.on("mousemove", function () {
			//	const xDate :any = x.invert(d3.mouse(d3.event.target)[0]);
			//	const bisect = d3.bisector(function (d: any) { return d.date; }).right;
			//	var bisectDate = d3.bisector(function (d: any) { return d.date; }).left;

			//	const idx = bisect(d.values, xDate);

			//	const x0: any = x.invert(d3.mouse(d3.event.target)[0]);
			//	const i = bisectDate(local.data, x0, 1);
			//	const d0 = local.data[i - 1];
			//	const d1 = local.data[i];
			//	const d = (xDate - d0.date) > (d1.date - xDate) ? d1 : d0;
			//	focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
			//	focus.select("text").text(function () { return d.value; });
			//	focus.select(".x-hover-line").attr("y2", height - y(d.value));
			//	focus.select(".y-hover-line").attr("x2", width + width);
			//})
			//.on('mousemove', function () { // mouse moving over canvas
			//	var mouse = d3.mouse(d3.event.target);
			//	d3.select(".mouse-line")
			//		.attr("d", function () {
			//			var d = "M" + mouse[0] + "," + height;
			//			d += " " + mouse[0] + "," + 0;
			//			return d;
			//		});



			//	d3.selectAll(".mouse-per-line")
			//		.attr("transform", function (d: any, i) {
			//			console.log(width / mouse[0])
			//			const xDate: any = x.invert(mouse[0]);
			//			const bisect = d3.bisector(function (d: any) { return d.date; }).right;
			//			const idx = bisect(d.values, xDate);

			//			const d0 = local.data[i - 1];
			//			const d1 = local.data[i];
			//			const d2 = (xDate - d0.date) > (d1.date - xDate) ? d1 : d0;
			//			focus.attr("transform", "translate(" + x(d2.year) + "," + y(d2.value) + ")");
			//			focus.select("text").text(function () { return d2.value; });
			//			focus.select(".x-hover-line").attr("y2", height - y(d2.value));
			//			focus.select(".y-hover-line").attr("x2", width + width);



			//			let beginning = 0;
			//			let end = lines[i].getTotalLength();
			//			let target = null;

			//			while (true) {
			//				target = Math.floor((beginning + end) / 2);
			//				var pos = lines[i].getPointAtLength(target);
			//				if ((target === end || target === beginning) && pos.x !== mouse[0]) {
			//					break;
			//				}
			//				if (pos.x > mouse[0]) end = target;
			//				else if (pos.x < mouse[0]) beginning = target;
			//				else break; //position found
			//			}

			//			d3.select(this).select('text')
			//				.text(y.invert(pos.y).toFixed(2));

			//			return "translate(" + mouse[0] + "," + pos.y + ")";
			//		});
			//});

	}
}