import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';


@Component({
	selector: 'app-bubble-chart',
	template: `
      <h2>Bubble Chart</h2>
<div #divBubbleChart ></div>
    `,
	//styleUrls: ['./chart.css']
})

export class BubbleChartComponent implements OnInit, OnChanges {
	@ViewChild('divBubbleChart') chartContainer: ElementRef;

	@Input() data: any[];
	@Input() colours: Array<string>;

	svg: any;
	opacity: any;

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
		var height = 400;
		var width = 600;
		var margin = 40;
		var data = [];
		for (var i = 0; i < 42; i++) {
			data.push({
				x: Math.random() * 4000,
				y: Math.random() * 1000,
				c: Math.round(Math.random() * 50),
				size: Math.random() * 2000,
			});
		}

		var labelX = 'X';
		var labelY = 'Y';
		this.svg = d3.select(this.chartContainer.nativeElement)
			.append('svg')
			.attr('class', 'chart')
			.attr("width", width + margin + margin)
			.attr("height", height + margin + margin)
			.append("g")
			.attr("transform", "translate(" + margin + "," + margin + ")");

		var dxMin = d3.min(data, function (d) { return d.x; });
		var dyMax = d3.max(data, function (d) { return d.y; });
		var dxMax = d3.max(data, function (d) { return d.x; });
		var dyMin = d3.min(data, function (d) { return d.y; });
		var dSizeMin = d3.min(data, function (d) { return d.size; });
		var dSizeMax = d3.max(data, function (d) { return d.size; });

		var x = d3.scaleLinear()
			.domain([dxMin != undefined ? dxMin : 0, dxMax != undefined ? dxMax:0])
			.range([0, width]);

		var y = d3.scaleLinear()
			.domain([dyMin != undefined ? dyMin : 0, dyMax != undefined ? dyMax:0])
			.range([height, 0]);

		var scale = d3.scaleSqrt()
			.domain([dSizeMin != undefined ? dSizeMin : 0, dSizeMax != undefined ? dSizeMax:0])
			.range([1, 20]);

		this.opacity = d3.scaleSqrt()
			.domain([dSizeMin != undefined ? dSizeMin : 0, dSizeMax != undefined ? dSizeMax : 0])
			.range([1, .5]);

		var color = d3.schemeCategory10.concat(d3.schemeSet1.concat(d3.schemeSet2).concat(d3.schemeSet3).concat(d3.schemeAccent));

		var xAxis = d3.axisBottom(x);
		var yAxis = d3.axisLeft(y);//.svg.axis().scale(y).orient("left");

		this.svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", 20)
			.attr("y", -margin)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(labelY);
		// x axis and label
		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("x", width + 20)
			.attr("y", margin - 10)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(labelX);

		var local = this;

		this.svg.selectAll("circle")
			.data(data)
			.enter()
			.insert("circle")
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.attr("opacity", function (d: any) { return local.opacity(d.size); })
			.attr("r", function (d: any) { return scale(d.size); })
			.style("fill", function (d: any) { return color[d.c]; })
			.on('mouseover', function (d: any, i: any) {
				local.fade(d.c, .1);
			})
			.on('mouseout', function (d: any, i: any) {
				local.fadeOut();
			})
			.transition()
			.delay(function (d: any, i: any) { return x(d.x) - y(d.y); })
			.duration(500)
			.attr("cx", function (d: any) { return x(d.x); })
			.attr("cy", function (d: any) { return y(d.y); })
			.ease(d3.easeBounce);


		
	}

	fade(c:any, opacity:any) {
		this.svg.selectAll("circle")
			.filter(function (d: any) {
			return d.c != c;
		})
		.transition()
		.style("opacity", opacity);
}

	fadeOut() {
		var local = this;
	this.svg.selectAll("circle")
		.transition()
		.style("opacity", function (d: any) { local.opacity(d.size); });
}
}