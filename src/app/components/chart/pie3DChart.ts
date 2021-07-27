import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
// import highcharts3D from 'highcharts/highcharts-3d.src';
// highcharts3D(Highcharts);
import * as Highcharts from 'highcharts';
// import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
const HC_exporting = HC_exporting_;



// import highcharts3D from 'highcharts/highcharts-3d.src';
// highcharts3D(Highcharts);

declare var require: any;

let highcharts3D = require('highcharts/highcharts-3d');
highcharts3D(Highcharts);


@Component({
	selector: 'app-Pie3D-chart',
	template: `
   
<div #divPie3DChart ></div>

    `,
	//styleUrls: ['./chart.css']
})


export class Pie3DChartComponent implements OnInit, OnChanges {
	@ViewChild('divPie3DChart') chartContainer: ElementRef;

	ngOnInit() {

		
		this.CreateHighChart();

		// create chart and render
		// this.createChart();
		// this.Donut3D.draw(this.svg, this.generateData(), (this.chart_r + this.margin.left / 2), (this.chart_r + this.margin.top), this.chart_r - (this.margin.left / 2), (this.chart_r - this.margin.left / 2) * 0.9, (this.chart_r - this.margin.left / 2) * 0.12, 0.4);
	}

	ngOnChanges() {
		// update chart on data input value change
		//if (this.svg) this.updateChart(false);

	}


	@Input() catField: string;
	@Input() valField: string;
	@Input() unit: string;
	get data(): any[] {
		return this.dataClone;
	}

	@Input()
	set data(data: any[]) {
		let local = this;
		if (data != undefined) {
			this.dataClone = JSON.parse(JSON.stringify(data));
			this.dataClone = this.filterZeroValues(this.dataClone);
		}
	}

	filterZeroValues(data: any) {
		if (data != undefined) {
			let local = this;
			let result = data.filter(function (ele: any) {
				return ele[local.valField] != 0;
			})
			return result;
		}
		return data;
	}



	dataClone: any[];
	color: any[];
	colorhex: any[];
	hostElement: any;
	Donut3D: any = {};
	svg: any;
	divTooltip: any;
	chart_m: any;
	chart_r: any;
	margin: any = { top: 20, right: 100, bottom: 70, left: 20 };

	changeData() {
		//this.Donut3D.transition(this.svg, this.randomData(), 130, 100, 30, 0.4);
		this.Donut3D.transition(this.svg, this.generateData(), 130, 100, 20, 0.4);
	}

	CreateHighChart() {
		this.colorhex = ["#F58C3C", "#8B94CA", "#76A305", "#003264", "#FFC832", "#965096", "#CCC18C", "#D20F46", "#FCC294", "#9CC7B7", "#E696BC", "#00B58C", "#878C9B", "#D70087", "#46BEF5", "#A59632"];// d3.schemeCategory10;
		var colorset = this.colorhex
		let chartSeriesData: any[] = [];
		let arrdata: any[] = [];
		let local = this;
		let unit = [' ' + this.unit];
if(this.data===undefined) this.data=[];

		this.data.forEach(function (val, i) {
			arrdata.push([val[local.catField], parseFloat(val[local.valField]),
			]);
		});

		chartSeriesData.push({
			name: local.valField,
			data: arrdata
		})

		this.chart_m = (this.chartContainer.nativeElement.clientWidth) / arrdata.length / 2 * 0.14;
		this.chart_r = (this.chartContainer.nativeElement.clientWidth) / arrdata.length / 2 * 0.85;

		let ratio = 1;

		Highcharts.chart(this.chartContainer.nativeElement, {
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 25
				},
				width: 408,
				height: 408
			},
			colors: colorset,
			title: {
				text: null
			},			
			tooltip: {
				enabled: true,
				useHTML: true,
				formatter: function () {
					let DecimalPoint: number = 2;

					let toolTip: string = "<span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>"
					 + this.key+ "</span> (" + local.unit + "): " +  Highcharts.numberFormat(this.y, DecimalPoint, ".", ","); 				
					return toolTip;
				}
			},
			plotOptions: {
				pie: {
					innerSize: 100,
					depth: 45,
					
					showInLegend: true,
					dataLabels: {
						enabled: false,					
					},

				},


			},

			series: chartSeriesData,
			credits: {
				enabled: false
			},
			responsive: {
				rules: [{
					condition: {
						// maxWidth: 500
					},
					chartOptions: {
						legend: {
							align: 'right',
							verticalAlign: 'middle',
							layout: 'vertical'
						},
						yAxis: {
							labels: {
								align: 'left',
								x: 0,
								y: -5
							},
							title: {
								text: null
							}
						},
						subtitle: {
							text: null
						},
						credits: {
							enabled: false
						}
					}
				}]
			},
			lang: {
				noData: "No records found"
			}
		});


	}

	generateData() {
		var local = this;
		return this.data.map(function (d: any) {
			return { label: d[local.catField], value: d[local.valField] };
		});
	}

	pieTop(d: any, rx: any, ry: any, ir: any) {
		if (d.endAngle - d.startAngle == 0) return "M 0 0";
		var sx = rx * Math.cos(d.startAngle),
			sy = ry * Math.sin(d.startAngle),
			ex = rx * Math.cos(d.endAngle),
			ey = ry * Math.sin(d.endAngle);

		var ret = [];
		ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
		ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
		return ret.join(" ");
	}

	pieOuter(d: any, rx: any, ry: any, h: any) {
		var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

		var sx = rx * Math.cos(startAngle),
			sy = ry * Math.sin(startAngle),
			ex = rx * Math.cos(endAngle),
			ey = ry * Math.sin(endAngle);

		var ret = [];
		ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
		return ret.join(" ");
	}

	sideRight(d: any, rx: any, ry: any, ir: any, h: any) {
		if (d.endAngle - d.startAngle == 0) return "M 0 0";
		var sx = rx * Math.cos(d.startAngle),
			sy = ry * Math.sin(d.startAngle),
			ex = rx * Math.cos(d.endAngle),
			ey = ry * Math.sin(d.endAngle);

		var ret = [];
		ret.push("M", sx, h + sy, "L", ir * sx, h + ir * sy, ir * sx, ir * sy, sx, sy, "Z");
		return ret.join(" ");
	}

	sideLeft(d: any, rx: any, ry: any, ir: any, h: any) {
		if (d.endAngle - d.startAngle == 0) return "M 0 0";
		var sx = rx * Math.cos(d.startAngle),
			sy = ry * Math.sin(d.startAngle),
			ex = rx * Math.cos(d.endAngle),
			ey = ry * Math.sin(d.endAngle);

		var ret = [];
		ret.push("M", ex, h + ey, "L", ir * ex, h + ir * ey, ir * ex, ir * ey, ex, ey, "Z");
		return ret.join(" ");
	}

	pieInner(d: any, rx: any, ry: any, h: any, ir: any) {
		var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

		var sx = ir * rx * Math.cos(startAngle),
			sy = ir * ry * Math.sin(startAngle),
			ex = ir * rx * Math.cos(endAngle),
			ey = ir * ry * Math.sin(endAngle);

		var ret = [];
		ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
		return ret.join(" ");
	}

	getPercent(d: any) {
		return (d.endAngle - d.startAngle > 0.2 ?
			Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' : '');
	}

	createChart() {
		this.color = ["rgb(245, 140, 60)", "rgb(139, 148, 202)", "rgb(118, 163, 5)", "rgb(0, 50, 100)", "rgb(255, 200, 50)", "rgb(150, 80, 150)", "rgb(204, 193, 140)", "rgb(210, 15, 70)", "rgb(252, 194, 148)", "rgb(156, 199, 183)", "rgb(230, 150, 188)", "rgb(0, 181, 140)", "rgb(135, 140, 155)", "rgb(215, 0, 135)", "rgb(70, 190, 245)", "rgb(165, 150, 50)"];// d3.schemeCategory10;
		this.colorhex = ["#F58C3C", "#8B94CA", "#76A305", "#003264", "#FFC832", "#965096", "#CCC18C", "#D20F46", "#FCC294", "#9CC7B7", "#E696BC", "#00B58C", "#878C9B", "#D70087", "#46BEF5", "#A59632"];// d3.schemeCategory10;


		if (this.divTooltip) {
			this.divTooltip.remove();
		}
		let timestamp = new Date().toString();
		this.divTooltip = d3.select("body").append("div").attr('id', 'divtoolTip' + timestamp).attr("class", "toolTip");

		this.hostElement = this.chartContainer.nativeElement;


		var local = this;
		var width = this.chartContainer.nativeElement.clientWidth;
		//local.chart_m = width  / 2 * 0.30;
		local.chart_r = ((width - this.margin.left - this.margin.right) / 2);


		this.svg = d3.select(this.hostElement).append("svg").attr("width", width).attr("height", width);

		this.Donut3D.animate = function (index: number, rx: any, ry: any, h: any, ir: any, dir: any) {


			function calcMid(d: any) {

				var angle = d.startAngle + ((d.endAngle - d.startAngle) / 2);

				var r = 10;
				var x = 0, y = 0;
				if (dir != 0) {
					if (d.startAngle > 0 && d.startAngle < (Math.PI / 2)) {
						x = r * Math.cos(angle);
						if (x < 0) {
							x = x + x * 0.6;
						}
						else {
							x = x - x * 0.6;
						}
						y = r * Math.sin(angle);
					}
					else if (d.endAngle > (Math.PI / 2) && d.endAngle < (Math.PI)) {
						x = r * Math.cos(angle);
						if (x < 0) {
							x = x - x * 0.7;
						}
						else {
							x = x + x * 0.7;
						}
						y = r * Math.sin(angle);
					}
					else {
						x = r * Math.cos(angle);
						y = r * Math.sin(angle);
					}
				}
				
				return {
					x: x,
					y: y,

				};

			};

			local.svg.selectAll(".i" + index).transition().duration(750).ease(d3.easeBounce).attr("transform", function (d: any) {
				let midPoint = calcMid(d);
				return "translate(" + midPoint.x + "," + midPoint.y + ")";
			});


		}


		this.Donut3D.transition = function (svg: any, data: any, rx: any, ry: any, h: any, ir: any) {
			function arcTweenInner(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return local.pieInner(i(t), rx + 0.5, ry + 0.5, h, ir); };
			}
			function arcTweenTop(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return local.pieTop(i(t), rx, ry, ir); };
			}
			function arcTweenOuter(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return local.pieOuter(i(t), rx - .5, ry - .5, h); };
			}
			function sideTweenLeft(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return local.sideLeft(i(t), rx - .5, ry - .5, ir, h); };
			}
			function sideTweenRight(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return local.sideRight(i(t), rx - .5, ry - .5, ir, h); };
			}
			function textTweenX(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return (0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle))).toString(); };
			}
			function textTweenY(a: any, index: any, val: any) {
				var i = d3.interpolate(val[index]._current, a);
				val[index]._current = i(0);
				return function (t: any) { return (0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle))).toString(); };
			}

			var _data = d3.pie().sort(null).value(function (d: any) { return d.value; })(data);

			svg.selectAll(".innerSlice").data(_data)
				.transition().duration(750).attrTween("d", arcTweenInner);

			svg.selectAll(".topSlice").data(_data)
				.transition().duration(750).attrTween("d", arcTweenTop);

			svg.selectAll(".outerSlice").data(_data)
				.transition().duration(750).attrTween("d", arcTweenOuter);

			svg.selectAll(".leftSide").data(_data)
				.transition().duration(750).attrTween("d", sideTweenLeft);

			svg.selectAll(".rightSide").data(_data)
				.transition().duration(750).attrTween("d", sideTweenRight);

			svg.selectAll(".percent").data(_data).transition().duration(750)
				.attrTween("x", textTweenX).attrTween("y", textTweenY).text(local.getPercent);
		}

		this.Donut3D.draw = function (svg: any, data: any, x: any /*center x*/, y: any/*center y*/,
			rx: any/*radius x*/, ry: any/*radius y*/, h: any/*height*/, ir: any/*inner radius*/) {

			var _data = d3.pie().sort(null).value(function (d: any) { return d.value; })(data);

			var slices = svg.append("g").attr("transform", "translate(" + x + "," + y + ")")
				.attr("class", "slices");

			slices.selectAll(".leftSide").data(_data).enter().append("path").attr("class", "leftSide")
				.style("fill", function (d: any, i: any) { return d3.hsl(local.color[i]).darker(0.7).toString(); })
				//.style("stroke", function (d: any, i: any) { return local.color[i]; })
				.attr("d", function (d: any) { return local.sideLeft(d, rx, ry, ir, h); })
				.each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "leftSide i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {
				})
				.on('mouseout', function (d: any, i: any, j: any) {
				});

			slices.selectAll(".rightSide").data(_data).enter().append("path").attr("class", "rightSide")
				.style("fill", function (d: any, i: any) { return d3.hsl(local.color[i]).darker(0.7).toString(); })
				//.style("stroke", function (d: any, i: any) { return local.color[i]; })
				.attr("d", function (d: any) { return local.sideRight(d, rx, ry, ir, h); })
				.each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "rightSide i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {
				})
				.on('mouseout', function (d: any, i: any, j: any) {
				});

			slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
				.style("fill", function (d: any, i: any) { return d3.hsl(local.color[i]).darker(0.7).toString(); })
				.attr("d", function (d: any) { return local.pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
				.each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "innerSlice i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {
					local.Donut3D.animate(i, rx, ry, h, ir, 1);
				})
				.on('mouseout', function (d: any, i: any, j: any) {
					local.divTooltip.style("display", "none");
					local.Donut3D.animate(i, rx, ry, h, ir, 0);
				}).on("mousemove", function (d: any) {
					showTooltip(d);
				});


			slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
				.style("fill", function (d: any, i: any) { return local.color[i]; })
				.style("stroke", function (d: any, i: any) { return local.color[i]; })
				.attr("d", function (d: any) { return local.pieTop(d, rx, ry, ir); })
				.each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "topSlice i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {

					local.Donut3D.animate(i, rx, ry, h, ir, 1);
				})
				.on('mouseout', function (d: any, i: any, j: any) {
					local.divTooltip.style("display", "none");
					local.Donut3D.animate(i, rx, ry, h, ir, 0);
				}).on("mousemove", function (d: any) {
					showTooltip(d);
				});

			slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
				.style("fill", function (d: any, i: any) { return d3.hsl(local.color[i]).darker(0.7).toString(); })
				.attr("d", function (d: any) { return local.pieOuter(d, rx - .5, ry - .5, h); })
				.each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "outerSlice i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {
					local.Donut3D.animate(i, rx, ry, h, ir, 1);

				})
				.on('mouseout', function (d: any, i: any, j: any) {
					local.divTooltip.style("display", "none");
					local.Donut3D.animate(i, rx, ry, h, ir, 0);

				}).on("mousemove", function (d: any) {
					showTooltip(d);
				});

			slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
				.attr("x", function (d: any) { return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)); })
				.attr("y", function (d: any) { return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)); })
				.text(local.getPercent).each(function (d: any, index: any, val: any) {
					val[index]._current = d;
					d3.select(val[index]).attr("class", "percent i" + index);
				}).on('mouseover', function (d: any, i: any, j: any) {
					local.Donut3D.animate(i, rx, ry, h, ir, 1);
				})
				.on('mouseout', function (d: any, i: any, j: any) {
					local.divTooltip.style("display", "none");
					local.Donut3D.animate(i, rx, ry, h, ir, 0);
				}).on("mousemove", function (d: any) {
					showTooltip(d);
				});

			//svg.append('g')
			//	.attr('class', 'legend')
			//	.selectAll('text')
			//	.data(_data)
			//	.enter()
			//	.append('text')
			//	.text(function (d: any) { return '• ' + d.data.label; })
			//	.attr('fill', function (d:any,i:any) { return local.color[i]; })
			//	.attr('y', function (d:any, i:any) { return 20 * (i + 1); })


			var legendRectSize = 25;
			var legendSpacing = 6;
			// define legend
			var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
				.data(_data) // refers to an array of labels from our dataset
				.enter() // creates placeholder
				.append('g') // replace placeholders with g elements
				.attr('class', 'legend') // each g is given a legend class
				.attr('transform', function (d: any, i: any) {
					var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
					var offset = height * local.data.length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
					var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
					var vert = y + i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
					return 'translate(' + (width - local.margin.right) + ',' + vert + ')'; //return translation       
				});

			// adding colored squares to legend
			legend.append('rect') // append rectangle squares to legend                                   
				.attr('width', legendRectSize) // width of rect size is defined above                        
				.attr('height', legendRectSize) // height of rect size is defined above                      
				.style('fill', function (d: any, i: any) { return local.color[i]; }) // each fill is passed a color
				.style('stroke', function (d: any, i: any) { return local.color[i]; }) // each stroke is passed a color


			// adding text to legend
			legend.append('text')
				.attr('x', legendRectSize + legendSpacing)
				.attr('y', legendRectSize - legendSpacing)
				.text(function (d: any) { return d.data.label; }); // return label

		}

		function showTooltip(d: any) {
			local.divTooltip.style("left", d3.event.pageX + 10 + "px");
			local.divTooltip.style("top", d3.event.pageY - 25 + "px");
			local.divTooltip.style("display", "inline-block");
			local.divTooltip.html(d.data.label + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : "") + ":" + d.data.value);
		}
	}
}
