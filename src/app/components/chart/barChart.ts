import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from '../../services/miscellaneous.service';
const HC_exporting = HC_exporting_;

@Component({
	selector: 'app-bar-chart',
	template: `
    
<div #divBarChart ></div>
    `,
	//styleUrls: ['./chart.css']
})

export class BarChartComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
	@ViewChild('divBarChart') chartContainer: ElementRef;
	//@Input() data: any[];
	@Input() xField: string;
	@Input() yField: string;
	@Input() barColors: string[];
	@Input() barHoverColors: string[];
	@Input() isMultiColorBars: boolean = false;
	@Input() unit: string = "";
	@Input() valueSuffix: string = "";
	@Input() colours: Array<string>;
	@Output() barClicked = new EventEmitter<any>();
	hostElement: any;
	@Input() shrinkSize: boolean = false;
	@Input() restoreWidth: number;
	width: number = 1000;
	height: number = 300;
	svg: any;


	dataClone: any[];

	get data(): any[] {
		// transform value for display
		return this.dataClone;
	}

	@Input()
	set data(data: any[]) {
		
		let local = this;
		if (data !== undefined) {
			this.dataClone = JSON.parse(JSON.stringify(data));
			if(this.dataClone!==undefined)
			this.dataClone.forEach(function (val: any) {
				val[local.yField] = local.convertToNumber(val[local.yField]);
			})

		}
	}

	constructor(
		private elRef: ElementRef, private miscService: MiscellaneousService
	) { }

	ngOnInit() {

	}
	colorRange = [
		"#46BEF5",
		"#197ec3",
		"#addb62",
		"#686662",
		"#ff99cc",
		"#c8e796",
		"#65b5eb",
		"#e4f3cb",
		"#ffcccc",
		"#9b9995",
		"#a1f7ec",
		"#f08e7f",
		"#a2befa",
		"#f5a905",
		"#ff7878",
		"#fffd94",
		"#2533f7",
		"#a1edf7",
		"#de4949",
		"#f5befa"
	];
	
	ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
		this.hostElement = this.chartContainer.nativeElement;
		var heightRatio = .4;

		if (this.hostElement.clientWidth > 0) {

			if (this.shrinkSize) {
				this.width = this.hostElement.clientWidth / 3;
				this.height = this.width * heightRatio;

			}
			else {
				// to handle different layouts
				if (this.hostElement.clientWidth < 800) {
					heightRatio = 0.25;
				}
				if (this.restoreWidth != undefined && this.restoreWidth != null) {
					this.width = this.restoreWidth;
				}
				else if (this.hostElement) {
					this.width = this.hostElement.clientWidth;
				}
				else {
					this.width = 1000;//this.hostElement.clientWidth;
				}
				this.height = this.width * heightRatio;
			}
			if (this.height < 180) {
				this.height = 180;
			}
			this.chartCreated = true;
			setTimeout(function (local: any) {
				local.createHightChart(local.xField, local.yField, local.data);
			}, 0, this)


		}
	}

	ngAfterViewInit() {
		// viewChild is set after the view has been initialized
		// create chart and render		

	}

	createHightChart(xField: any, yField: any, data: any[]) {
		let local = this;
		let arrCategories: any[] = [];
		let arrSeries: any[] = [];
		let arrData: any[] = [];

		data.forEach(function (val, i) {
			arrCategories.push(val[xField]);
			let colorIndex = 0;
			if (local.isMultiColorBars == true) {
				colorIndex = i;
			}
			arrData.push(
				{
					y: val[yField],
					color: local.colorRange[colorIndex],
				});
		});

		arrSeries.push({
			name: yField,
			data: arrData,
		});

		var margin = { top: 20, right: 20, bottom: 70, left: 105 },
			width = this.width - margin.left - margin.right,
			height = this.height - margin.top - margin.bottom;
		var ChartColors = this.colorRange
		Highcharts.chart(this.chartContainer.nativeElement, {
			chart: {
				type: 'column',
				height: 350, //(height + margin.top + margin.bottom) 
				style: {
					color: 'black', fontSize: '11px', FontFamily: 'Arial',
				}
			},
			colors: ['#46BEF5'],
			title: {
				text: '',
			},
			xAxis: {
				categories: arrCategories,
				crosshair: true,
				title: {
					text: xField
				},
				labels: {
					style:
					{
						textAlign: 'center', whiteSpace: 'normal', fontSize: '9px'
					},
					useHTML: true,
					overflow: 'allow',
					rotation: 0
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: yField + (local.unit != "" ? " (" + local.unit + ")" : "")
				},
				labels: {
					// format: '{value:,.0f}',
					formatter: function () {
						let DecimalPoint: number = 0;
						if (String(this.value).indexOf(".") >= 0)
							DecimalPoint = 2;
						return Highcharts.numberFormat(this.value, DecimalPoint, ".", ",");
					},
					style: {
						textAlign: 'center', whiteSpace: 'normal', fontSize: '9px'
					},
				},
				tickAmount: 5
			},
			tooltip: {
				formatter: function () {
					let DecimalPoint: number = 0;
					if (String(this.point.y).indexOf(".") >= 0)
						DecimalPoint = 2;


					let unit: string = "";
					if (local.unit != "")
						unit = " (" + local.unit + ")";

					let toolTip: string = "<span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>" + this.x + unit + "</span>: " + Highcharts.numberFormat(this.point.y, DecimalPoint, ".", ",") + " " + local.valueSuffix
					return toolTip;
				},
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0,

				},
				series: {
					dataLabels: {
						enabled: true,
						formatter: function (event) {
							let DecimalPoint: number = 0;
							if (String(this.point.y).indexOf(".") >= 0)
								DecimalPoint = 2;

							return Highcharts.numberFormat(this.point.options.y, DecimalPoint, ".", ",") + (local.valueSuffix != "" ? " " + local.valueSuffix : "");
						},
						style: {
							fontWeight: 'normal'
						},
						overflow: 'allow',
						crop: false
					}
				}
			},
			series: arrSeries,
			credits: {
				enabled: false
			},

		});
	}

	chartCreated: boolean = false;

	ngAfterViewChecked() {
		// viewChild is set after the view has been initialized
		// create chart and render	

		this.hostElement = this.chartContainer.nativeElement;
		if (this.hostElement.clientWidth > 0 && this.chartCreated == false) {
			if (this.shrinkSize) {
				this.width = this.hostElement.clientWidth / 3;
				this.height = this.width * 0.5;
			}
			else {
				if (this.hostElement) {
					this.width = this.hostElement.clientWidth;
				}
				else {
					this.width = 1000;//this.hostElement.clientWidth;
				}
				this.height = this.width * 0.5;
			}
			this.chartCreated = true;
			if(this.data===undefined) this.data=[];
			this.createHightChart(this.xField, this.yField, this.data);

		}

	}

	convertToNumber(num: string) {
		if (num != null) {
			if (String(num).match(/^-{0,1}\d+$/)) {
				return parseInt(num);
			} else if (!isNaN(parseFloat(num))) {
				return parseFloat(num);
			}
		}
		return null;
	}


	divTooltip: any;
	createChart(xField: any, yField: any, data: any[]) {
		//this.data = this.jsonData;

		d3.select(this.hostElement).html('');
		if (this.divTooltip) {
			this.divTooltip.remove();
		}
		var margin = { top: 20, right: 20, bottom: 70, left: 105 },
			width = this.width - margin.left - margin.right,
			height = this.height - margin.top - margin.bottom;

		if (!this.barColors || this.barColors.length == 0) {
			this.barColors = ["#80cdf0", "#878c9b", "#f58c3c"]
		}
		if (!this.barHoverColors || this.barHoverColors.length == 0) {
			this.barHoverColors = ["#f58c3c", "#80cdf0", "#878c9b"]
		}
		var color = d3.scaleOrdinal().range(this.barColors);
		var hoverColor = d3.scaleOrdinal().range(this.barHoverColors);
		// set the ranges
		var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05);
		var y = d3.scaleLinear().range([height, 0]);

		let timestamp = new Date().toString()

		this.divTooltip = d3.select("body").append("div").attr('id', 'divtoolTip' + timestamp).attr("class", "toolTip");


		//this.svg = d3.select(this.hostElement).append("svg")
		//	.attr("width", '100%')
		//	.attr("height", '100%')
		//	.attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
		//	.attr('preserveAspectRatio', 'xMinYMin')
		//	.append("g")
		//	.attr("transform", "translate(" + Math.min(width, height) / 2 + "," + Math.min(width, height) / 2 + ")");

		this.svg = d3.select(this.hostElement).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var local = this;


		//data.forEach(function (d: any) {
		//	
		//	d[xField] = d[xField];
		//	d[yField] = +d[yField];
		//});

		var maxVal = d3.max(data, function (d: any) {
			let val: any = local.convertToNumber(d[yField]);
			//return val > 10 ? val : 10;
			return val;
		});

		var fractionValues = data.filter(function (val: any) {
			return !Number.isInteger(val[yField]);
		})

		// scale the range of the data

		//x.domain(data.map(function (d: any) { if (d[xField].length > 23) { return d[xField].substr(0, 22).concat("...") } else { return d[xField] }; }))
		x.domain(data.map(function (d: any) { return d[xField]; }))
		y.domain([0, maxVal]);

		var ticks = y.ticks(4);

		var lastTick = ticks[ticks.length - 1],
			newLastTick = lastTick + (ticks[1] - ticks[0]);

		if (fractionValues.length == 0) {
			ticks = ticks.filter(function (val: number) { return Number.isInteger(val) });
			lastTick = ticks[ticks.length - 1],
				newLastTick = lastTick + (ticks[1] - ticks[0]);
		}

		if (lastTick < y.domain()[1]) {
			ticks.push(newLastTick);
			y.domain([y.domain()[0], newLastTick]);
		}
		else {
			y.domain([y.domain()[0], lastTick]);
		}


		//ticks = y.ticks();
		//if (fractionValues.length == 0) {
		//	ticks = ticks.filter(function (val: number) { return Number.isInteger(val) });
		//}

		var formatPercent = d3.format(".0%");
		var xAxis = d3.axisBottom(x);
		var yAxis = d3.axisLeft(y).tickPadding(10).tickFormat(function (d) {
			return local.miscService.formatNumber(d.toString());
		}).tickValues(ticks);

		//yAxis.tickFormat(d3.format("d")).ticks
		//	.tickSubdivide(0);

		//if (fractionValues.length == 0) {
		//	if (maxVal <= 5) {
		//		yAxis.ticks(maxVal);
		//	}
		//	else {
		//		yAxis.ticks(6);
		//	}
		//}
		//else {
		//	yAxis.ticks(6);
		//}

		// gridlines in x axis function
		function make_x_gridlines() {
			return d3.axisBottom(x)
		}

		// gridlines in y axis function
		function make_y_gridlines() {
			return d3.axisLeft(y).tickValues(ticks);

		}

		// add the X gridlines
		//this.svg.append("g")
		//    .attr("class", "grid")
		//    .attr("transform", "translate(0," + height + ")")
		//    .call(make_x_gridlines()
		//        .tickSize(-height)
		//        //.tickFormat("")
		//    )

		// add the Y gridlines
		this.svg.append("g")
			.attr("class", "grid")
			.call(make_y_gridlines()
				.tickSize(-width)
			).selectAll("text").remove();




		// add axis
		this.svg.append("g")
			.attr("class", "x-axis sweta")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "middle")
			.attr("dx", "-.8em")
			.attr("dy", ".8em")
			.attr("transform-origin", "3px 40px")
			.attr("transform", "rotate(-15)");
		//.call(wrap, x.bandwidth());
		//.attr("word-wrap","break-word");

		this.svg.select("g.x-axis")
			.call(xAxis)
			.append("text")
			.attr("transform", "translate(" + width / 2 + "," + 40 + ")")
			//.attr("y", -60).attr("x", (height / -2) + (local.yField.length / 2) + margin.top)
			.attr("dy", ".71em")
			.attr("class", "axis-label")
			.style("text-anchor", "end")
			.text(local.xField);

		let svgYAxis = this.svg.append("g")
			.attr("class", "y-axis")
			.call(yAxis);

		let tickNodes = svgYAxis.selectAll("g.tick").nodes();
		let maxTickWidth = 0;
		if (tickNodes.length > 0) {
			maxTickWidth = Math.max.apply(Math, tickNodes.map(function (val: any) {
				var text: any = d3.select(val).select("text");
				return text.node().getBoundingClientRect().width;
			}));
		}

		svgYAxis
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", 0 - (height / 2))
			.attr("y", 0 - 30 - maxTickWidth)
			//.attr("x", (height / -2) + (local.yField.length / 2) + margin.top)
			.attr("dy", ".71em")
			.attr("class", "axis-label")
			.style("text-anchor", "middle")
			.text(local.yField + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : ""));

		let barWidth = Math.min(x.bandwidth(), 50);

		//this.svg.select("text.axis-label").attr("y", -maxTickWidth)

		// Add bar chart
		var bar = this.svg.selectAll("bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function (d: any) {
				let res = x(d[xField]);
				return res != undefined ? (res + x.bandwidth() / 2) - barWidth / 2 : 0;
			})
			.attr("width", barWidth)
			.attr("y", function (d: any) {
				return y(d[yField]);
			})
			.attr('pointer-events', 'none');

		if (this.isMultiColorBars) {
			bar.style("fill", function (d: any, i: any) {
				return color(i);
			})
		}

		bar.transition()
			.ease(d3.easeBounce)
			.duration(1000).attr("height", function (d: any) { return height - y(d[yField]); })
			.transition().attr('pointer-events', '');

		let barText = this.svg.selectAll("text.bar")
			.data(data).enter()
			.append("text")
			.attr("id", function (d: any) { return d.Index; })
			.attr("class", "bar")
			.attr("text-anchor", "middle")
			.attr("x", function (d: any) {
				let res = x(d[xField]);
				//if (d[xField].length > 15)
				//{
				//    res = x(d[xField].substr(0, 15).concat("..."));
				//}
				//else
				//{ res = x(d[xField]); } 

				return res != undefined ? (res + x.bandwidth() / 2) : 0;
			})
			.attr("y", function (d: any) { return y(d[yField]) - 5; })
			.text(function (d: any) {
				return local.miscService.formatNumber(d[yField]) + (local.valueSuffix != "" ? (" " + local.valueSuffix) : "");
			});

		this.svg.selectAll("g.x-axis > g.tick").nodes().forEach(function (ele: any, k: any) {
			let element = ele.getElementsByTagName("text")[0].innerHTML;
			if (element.length > 15) {
				ele.getElementsByTagName("text")[0].innerHTML = element.substr(0, 15).concat("...");
			}
		});

		barText.on("mousemove", function (d: any) {
			if (!local.shrinkSize) {
				local.divTooltip.style("left", d3.event.pageX + 10 + "px");
				local.divTooltip.style("top", d3.event.pageY - 25 + "px");
				local.divTooltip.style("display", "inline-block");
				local.divTooltip.html(d[xField] + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : "") + " : " + local.miscService.formatNumber(d[yField]) + (local.valueSuffix != "" ? (" " + local.valueSuffix) : ""));
			}
		});

		barText.on("mouseout", function (d: any) {
			if (!local.shrinkSize) {
				local.divTooltip.style("display", "none");
				if (local.isMultiColorBars) {
					d3.select(d3.event.target).style("fill", function (d: any, i: any, n) {
						var index = d3.select(n[0].parentNode).selectAll('text.bar').nodes().indexOf(n[0])
						return "" + color(index.toString()) + "";
					});
				}
			}
		});
		barText.on("mouseover", function (d: any) {
			if (!local.shrinkSize && local.isMultiColorBars) {
				d3.select(d3.event.target).style("fill", function (d: any, i: any, n) {
					var index = d3.select(n[0].parentNode).selectAll('text.bar').nodes().indexOf(n[0])
					return "" + hoverColor(index.toString()) + "";
				});
			}
		});


		// add tool tip
		bar.on("mousemove", function (d: any) {
			if (!local.shrinkSize) {
				local.divTooltip.style("left", d3.event.pageX + 10 + "px");
				local.divTooltip.style("top", d3.event.pageY - 25 + "px");
				local.divTooltip.style("display", "inline-block");
				local.divTooltip.html(d[xField] + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : "") + " : " + local.miscService.formatNumber(d[yField]) + (local.valueSuffix != "" ? (" " + local.valueSuffix) : ""));
			}
		});

		bar.on("mouseover", function (d: any) {
			if (!local.shrinkSize && local.isMultiColorBars) {
				d3.select(d3.event.target).style("fill", function (d: any, i: any, n: any) {

					var index = d3.select(n[0].parentNode).selectAll('rect.bar').nodes().indexOf(n[0])
					return "" + hoverColor(index.toString()) + "";
				});
			}

		});
		bar.on("mouseout", function (d: any) {

			if (!local.shrinkSize) {
				local.divTooltip.style("display", "none");
				if (local.isMultiColorBars) {
					d3.select(d3.event.target).style("fill", function (d: any, i: any, n) {
						var index = d3.select(n[0].parentNode).selectAll('rect.bar').nodes().indexOf(n[0])
						return "" + color(index.toString()) + "";
					});
				}
			}
		});

		bar.on("click", function (d: any) {
			if (!local.shrinkSize) {
				//local.chartCreated = false;
				local.barClicked.emit({ xValue: d[xField], currentWidth: local.width })
			}
		});



	}



}