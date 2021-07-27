import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';


@Component({
	selector: 'app-line-chart',
	template: `
     
<div #divLineChart ></div>
    `,
	//styleUrls: ['./chart.css']
})


export class lineChartComponent implements OnInit, OnChanges {

	@ViewChild('divLineChart') chartContainer: ElementRef;

	//@Input() data: any[];
	@Input() colours: Array<string>;

	svg: any;
	opacity: any;
	chart: any;
	hostElement: any;

	create: any; update: any;

	data: any[] = [
		{ "year": "2005", "value": 771900 },
		{ "year": "2006", "value": 771500 },
		{ "year": "2007", "value": 770500 },
		{ "year": "2008", "value": 770400 },
		{ "year": "2009", "value": 771000 },
		{ "year": "2010", "value": 772400 },
		{ "year": "2011", "value": 774100 },
		{ "year": "2012", "value": 776700 },
		{ "year": "2013", "value": 777100 },
		{ "year": "2014", "value": 779200 },
		{ "year": "2015", "value": 782300 }
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
		this.hostElement = this.chartContainer.nativeElement;

		this.chart = d3.select(this.hostElement);

		var svg = this.chart.append("svg");

		var margin = { top: 20, right: 20, bottom: 30, left: 40 };
		var width = 900 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;




		var parseTime = d3.timeParse("%Y")
		var bisectDate = d3.bisector(function (d: any) { return d.year; }).left;

		var x = d3.scaleTime().range([0, width]);
		var y = d3.scaleLinear().range([height, 0]);


		var line = d3.line()
			.x(function (d: any) {
				return x(d.year);
			})
			.y(function (d: any) {
				return y(d.value);
			});

		var g = svg.attr("width", width + 100 + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom).append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



		this.data.forEach(function (d: any) {
			d.year = parseTime(d.year);
			d.value = +d.value;
		});

		var extent = d3.extent(this.data, function (d) { return d.year; });

		x.domain(extent != [undefined, undefined] ? extent : [0, 0]);
		var min = d3.min(this.data, function (d) { return d.value; });
		var max = d3.max(this.data, function (d) { return d.value; });



		y.domain([(min != undefined ? min : 0) / 1.005, (max != undefined ? max : 0) * 1.005]);

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks(6).tickFormat(function (d: any) { return parseInt((d / 1000) + "") + "k"; }))
			.append("text")
			.attr("class", "axis-title")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.attr("fill", "#5D6971")
			.text("Population)");

		g.append("path")
			.datum(this.data)
			.attr("class", "line")
			.attr("d", line);

		var focus = g.append("g")
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

		var local = this;

		svg.append("rect")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mouseover", function () { focus.style("display", null); })
			.on("mouseout", function () { focus.style("display", "none"); })
			.on("mousemove", function () {
				const x0: any = x.invert(d3.mouse(d3.event.target)[0]);
				const i = bisectDate(local.data, x0, 1);
				const d0 = local.data[i - 1];
				const d1 = local.data[i];
				const d = (x0 - d0.year) > (d1.year - x0) ? d1 : d0;
				focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
				focus.select("text").text(function () { return d.value; });
				focus.select(".x-hover-line").attr("y2", height - y(d.value));
				focus.select(".y-hover-line").attr("x2", width + width);
			});



	}
}

