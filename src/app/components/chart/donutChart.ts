import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from '../../services/miscellaneous.service';
const HC_exporting = HC_exporting_;


@Component({
	selector: 'app-donut-chart',
	template: `
     <div #divDonutChart style="text-align:center"></div>
    `,
	//styleUrls: ['./chart.css']
})

export class DonutChartComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
	@ViewChild('divDonutChart') chartContainer: ElementRef;
	//@Input() data: any[];
	@Input() catField: string;
	@Input() valField: string;
	@Input() unit: string;
	@Input() showLegends: boolean = false;
	@Input() title: string;
	@Input() colours: Array<string>;
	hostElement: any;
	svg: any;
	@Input() fullView: boolean = false;

	dataClone: any[];
	dataOriginal: any[];
	chart_m: any;
	chart_r: any;
	color: any;
	totalValue: number = 0;

	get data(): any[] {
		// transform value for display
		return this.dataClone;
	}

	@Input()
	set data(data: any[]) {
		//debugger;
		let local = this;
		if (data != undefined) {
			this.dataOriginal == JSON.parse(JSON.stringify(data));
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


	//create: any; update: any;
	charts: any;
	constructor(
		private elRef: ElementRef, private miscService: MiscellaneousService
	) { }

	ngOnInit() {
		// create chart and render
		//this.createChart();

	}
	ngOnDestroy() {
		// create chart and render
		this.chartCreated = false;

	}
	ngOnChanges() {
		this.hostElement = this.chartContainer.nativeElement;
		this.chartCreated = false;
		if (this.hostElement.clientWidth > 0) {
			this.chartCreated = true;
			this.createChart();

		}
	}
	ngAfterViewInit() {

	}
	chartCreated: boolean = false;

	ngAfterViewChecked() {
		// viewChild is set after the view has been initialized
		// create chart and render		
		this.hostElement = this.chartContainer.nativeElement;
		if (this.hostElement.clientWidth > 0 && this.chartCreated == false) {
			this.chartCreated = true;
			this.createChart();
		}

	}

	CreateHighChart() {
		let chartSeriesData: any[] = [];
		let local = this;
		let type = [this.title];
		let unit = [' ' + this.unit];
		this.color = ["rgb(245, 140, 60)", "rgb(139, 148, 202)", "rgb(118, 163, 5)", "rgb(0, 50, 100)", "rgb(255, 200, 50)", "rgb(150, 80, 150)", "rgb(204, 193, 140)", "rgb(210, 15, 70)", "rgb(252, 194, 148)", "rgb(156, 199, 183)", "rgb(230, 150, 188)", "rgb(0, 181, 140)", "rgb(135, 140, 155)", "rgb(215, 0, 135)", "rgb(70, 190, 245)", "rgb(165, 150, 50)"];// d3.schemeCategory10;
		this.data = this.filterZeroValues(this.dataOriginal);
		let total = 0;

		for (let i = 0; i < type.length; i++) {
			let tempdata: any[] = [];

if(this.data===undefined) this.data=[];
			this.data.forEach(function (val, i) {
				total += parseFloat(val[local.valField]);
				tempdata.push({
					name: val[local.catField],
					y: parseFloat(val[local.valField]),
					color: local.color[i]
				});
			});



			chartSeriesData.push({
				name: type[i],
				data: tempdata,
			});
		}

		this.totalValue = total;

		this.chart_m = (this.chartContainer.nativeElement.clientWidth) / chartSeriesData.length / 2 * 0.14;
		this.chart_r = (this.chartContainer.nativeElement.clientWidth) / chartSeriesData.length / 2 * 0.85;


		let ratio = 1;

		if (this.fullView) {

			let widthRatio = window.innerWidth / this.chartContainer.nativeElement.clientWidth;
			ratio = window.innerWidth / (window.innerHeight / widthRatio);

			this.chart_m = ((this.chartContainer.nativeElement.clientWidth) / chartSeriesData.length / 2) * 0.60 / ratio;
			this.chart_r = ((this.chartContainer.nativeElement.clientWidth) / chartSeriesData.length / 2) * 0.40 / ratio;
		}

		Highcharts.chart(this.chartContainer.nativeElement, {
			chart: {
				type: 'pie',
				// options3d: {
				// 	enabled: true,
				// 	alpha: 45
				// },
				// height: 290
				width: (local.chart_r + local.chart_m) * 2 * ratio,
				height: (local.chart_r + local.chart_m) * 2,
				events: {
					// load: createCenterCircle,
					redraw: createCenterCircle,
					//render: createCenterCircle
				}


			},
			credits: {
				enabled: false
			},
			title: {
				text: ''
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					//Here innerSize value in percentage because to make the inner size dymanic based on the size
					innerSize: "75%",
					// depth: local.chart_m,
					dataLabels: {
						enabled: local.fullView,
						formatter: function (event) {
							return this.key + ' (' + Highcharts.numberFormat(this.percentage, 2) + '%)'
						}
					},
					showInLegend: false,
					point: {
						events: {
							mouseOver: function () {

								let ele = local.chartContainer.nativeElement;
								let categoryele = ele.getElementsByClassName('category');
								let valueele = ele.getElementsByClassName('value');
								let percentageele = ele.getElementsByClassName('percentage');
								let circleele = ele.getElementsByClassName('centercircle');

								categoryele[categoryele.length - 1].textContent = this.name;
								let value = Highcharts.numberFormat(this.y, 2, ".", ",") + local.unit;
								let percentage = Highcharts.numberFormat(this.percentage, 2) + "%";
								valueele[valueele.length - 1].textContent = value;
								percentageele[percentageele.length - 1].textContent = percentage;
								circleele[circleele.length - 1].setAttribute("r", local.chart_r * (local.fullView == false ? 0.7 : 1.40)); //1.40
							},
							mouseOut: function (event) {



								let ele = local.chartContainer.nativeElement;
								let categoryele = ele.getElementsByClassName('category');
								let valueele = ele.getElementsByClassName('value');
								let percentageele = ele.getElementsByClassName('percentage');
								let circleele = ele.getElementsByClassName('centercircle');

								categoryele[categoryele.length - 1].textContent = local.title;
								let value = Highcharts.numberFormat(local.totalValue, 2, ".", ",") + local.unit
								valueele[valueele.length - 1].textContent = value;
								percentageele[percentageele.length - 1].textContent = "";
								circleele[circleele.length - 1].setAttribute("r", local.chart_r * (local.fullView == false ? 0.67 : 1.37)) //1.37
							}

						}
					}
				},
			},
			series: chartSeriesData,
			responsive: {
				rules: [{
					condition: {
						// maxWidth: 500
					},
					chartOptions: {
						legend: {
							align: 'center',
							verticalAlign: 'bottom',
							layout: 'horizontal'
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
			},
			tooltip: {
				enabled: false,
				useHTML: true,
				formatter: function () {
					let DecimalPoint: number = 2;
					
					// let toolTip: string = "<span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>"
					//  + this.key+ "</span><br/>" +  Highcharts.numberFormat(this.y, DecimalPoint, ".", ",") + local.unit
					//  +"<br/><span style='color:rgb(186, 12, 47)'>" + Highcharts.numberFormat(this.percentage, DecimalPoint) + "%</span>";
					let toolTip: string = "<table style='padding:0px;border:0px'><tr><td style='padding:0px;border:0px'><span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>"
						+ this.key + "</span></td></tr><tr><td style='padding:0px;border:0px;text-align:center'>" + Highcharts.numberFormat(this.y, DecimalPoint, ".", ",") + local.unit
						+ "</td></tr><tr><td style='padding:0px;border:0px;text-align:center'><span style='color:rgb(186, 12, 47)'>" + Highcharts.numberFormat(this.percentage, DecimalPoint) + "%</span></td></tr></table>";



					return toolTip;

				}
			}
		});

		function createCenterCircle() {

			// if (local.fullView == true)
			//  return;

			let x = this.series[0].center[0] + this.plotLeft;
			let y = this.series[0].center[1] + this.plotTop;

			this.renderer.circle(x, y, local.chart_r * (local.fullView == false ? 0.67 : 1.37)) //1.37
				.attr({
					fill: '#E7E7E7',
					class: 'centercircle',
				}).css({
					//'transform': 'translate(' + ((local.chart_r + local.chart_m) * local.gratio) + ',' + (local.chart_r + local.chart_m) + ')'
				}).add();

			//Category
			this.renderer.text(local.title, x, y - 15)
				.attr('class', 'center-txt category type')
				.attr('text-anchor', 'middle')
				.css({
					'font-weight': 'bold',
				}).show().add();

			let sum = this.series[0].data
			//Value
			this.renderer.text(Highcharts.numberFormat(local.totalValue, 2, ".", ",") + local.unit, x, y)
				.attr('class', 'center-txt value')
				.attr('text-anchor', 'middle')
				.show().add();

			//Percentage
			this.renderer.text("", x, y + 15)
				.attr('class', 'center-txt percentage')
				.attr('text-anchor', 'middle')
				.css({
					'font-weight': 'bold',
					'fill': '#ba0c2f'
				}).show().add();
		}


	}



	//onResized(event: ResizedEvent) {
	//}



	donutData: any;

	createChart() {
		// d3.select(this.chartContainer.nativeElement).html('');

		// this.charts = d3.select(this.chartContainer.nativeElement).attr("name", this.title.replace(' ', '_'));

		// this.color = ["rgb(245, 140, 60)", "rgb(139, 148, 202)", "rgb(118, 163, 5)", "rgb(0, 50, 100)", "rgb(255, 200, 50)", "rgb(150, 80, 150)", "rgb(204, 193, 140)", "rgb(210, 15, 70)", "rgb(252, 194, 148)", "rgb(156, 199, 183)", "rgb(230, 150, 188)", "rgb(0, 181, 140)", "rgb(135, 140, 155)", "rgb(215, 0, 135)", "rgb(70, 190, 245)", "rgb(165, 150, 50)"];// d3.schemeCategory10;


		// this.donutData = this.genData();


		// this.create(this.donutData);
		this.CreateHighChart();

		//$('#refresh-btn').on('click', function refresh() {
		//	donuts.update(local.genData);
		//});
	}

	getCatNames(dataset: any) {
		let catNames = new Array();

		for (let i = 0; i < dataset[0].data.length; i++) {
			catNames.push(dataset[0].data[i].cat);
		}

		return catNames;
	}

	createLegend(catNames: any) {
		let local = this;

		let legends = local.charts.select('.legend')
			.selectAll('div')
			.data(catNames).enter()
			.append('div')
			//.attr('class', 'col-6 col-sm-6')
			.append('svg').attr('height', 50).append('g')
			.attr('transform', function (d: any, i: any) {
				//return 'translate(' + (i * 150 + 50) + ', 20)';
				return 'translate(' + (20) + ', 20)';
			});

		//let legends = local.charts.select('.legend')
		//	.selectAll('g')
		//	.data(catNames)
		//	.enter().append('g')
		//	.attr('transform', function (d: any, i: any) {
		//		return 'translate(' + (i * 150 + 50) + ', 20)';
		//	});

		legends.append('circle')
			.attr('class', 'legend-icon')
			.attr('r', 6)
			.style('fill', function (d: any, i: any) {
				return local.color[i];
			});

		legends.append('text')
			.attr('dx', '1em')
			.attr('dy', '.3em')
			.text(function (d: any) {
				return d;
			});
	}

	createCenter() {
		let local = this;

		let donuts = local.charts.selectAll('.donut');

		// The circle displaying total data.
		donuts.append("svg:circle")
			.attr("r", local.chart_r * 0.7)
			.style("fill", "#E7E7E7")
			.on('mouseover', function (d: any, i: any) {
				d3.select(d3.event.target)
					.transition()
					.attr("r", local.chart_r * 0.75);
			})
			.on('mouseout', function (d: any, i: any) {
				d3.select(d3.event.target)
					.transition()
					.duration(500)
					.ease(d3.easeBounce)
					.attr("r", local.chart_r * 0.7);
			})
			.on('click', function (d: any, i: any) {
				d3.event.stopPropagation();
				let paths = local.charts.selectAll('.clicked');
				local.pathAnim(paths, 0);
				paths.classed('clicked', false);
				local.resetAllCenterText();
			})
		//.on(eventObj);

		donuts.append('text')
			.attr('class', 'center-txt category type')
			.attr('y', local.chart_r * -0.16)
			.attr('text-anchor', 'middle')
			.style('font-weight', 'bold')
			.text(function (d: any, i: any) {
				return d.type;
			});
		donuts.append('text')
			.attr('class', 'center-txt value')
			.attr('text-anchor', 'middle');
		donuts.append('text')
			.attr('class', 'center-txt percentage')
			.attr('y', local.chart_r * 0.16)
			.attr('text-anchor', 'middle')
			.style('fill', '#ba0c2f')
			.style('font-weight', 'bold')
		//.style('fill', '#A2A2A2');

	}

	setCenterText(thisDonut: any) {
		let local = this;
		let sum = d3.sum(thisDonut.selectAll('.clicked').data(), function (d: any) {
			return d.data.val;
		});

		let titleText = this.title;
		thisDonut.select('.category')
			.text(function (d: any) {
				return (sum) ? titleText
					: titleText;
			});

		thisDonut.select('.value')
			.text(function (d: any) {
				return (sum) ? local.miscService.formatNumber(sum.toFixed(2)) + d.unit
					: local.miscService.formatNumber(d.total.toFixed(2)) + d.unit;
			});
		thisDonut.select('.percentage')
			.text(function (d: any) {
				return (sum) ? local.miscService.formatNumber((sum / d.total * 100).toFixed(2)) + '%'
					: '';
			});
	}

	resetAllCenterText() {
		let local = this;
		this.charts.selectAll('.value')
			.text(function (d: any) {
				return local.miscService.formatNumber(d.total.toFixed(2)) + d.unit;
			});
		this.charts.selectAll('.percentage')
			.text('');
	}

	pathAnim(path: any, dir: any) {
		let local = this;
		switch (dir) {
			case 0:
				path.transition()
					.duration(500)
					.ease(d3.easeBounce)
					.attr('d', d3.arc()
						.innerRadius(local.chart_r * 0.8)
						.outerRadius(local.chart_r)
					);
				break;

			case 1:
				path.transition()
					.attr('d', d3.arc()
						.innerRadius(local.chart_r * 0.8)
						.outerRadius(local.chart_r * 1.08)
					);
				break;
		}
	}

	updateDonut() {
		let local = this;
		let pie = d3.pie()
			.sort(null)
			.value(function (d: any) {
				return d.val;
			});

		let data = this.genData();

		this.pieData = pie(data[0].data);

		let arc = d3.arc()
			.startAngle(function (d) {
				return d.startAngle;
			})
			.endAngle(function (d) {
				return d.endAngle;
			})
			.innerRadius(local.chart_r * 0.8)
			.outerRadius(function (d: any, i: any, n: any) {
				if (n) {
					return (d3.select(n[i]).classed('clicked')) ? local.chart_r * 1.08
						: local.chart_r;
				}
				else {
					try {
						return (d3.select(d).classed('clicked')) ? local.chart_r * 1.08
							: local.chart_r;
					}
					catch{
						return local.chart_r;
					}
				}
			});


		// Start joining data with paths
		let paths = local.charts.selectAll('.donut')
			.selectAll('path')
			.data(function (d: any, i: any) {
				return pie(d.data);
			});

		paths
			.transition()
			.duration(1000)
			.attr('d', arc);


		paths.enter()
			.append('svg:path')
			.attr('d', arc)
			.style('fill', function (d: any, i: any) {
				return local.color[i];
			})
			.style('stroke', '#FFFFFF')
			.on('mouseover', function (d: any, i: any, j: any) {

				local.pathAnim(d3.select(d3.event.target), 1);

				let thisDonut = d3.select(d3.select(d3.event.target).node().parentNode);// local.charts.select('.type' +j);
				if (!local.fullView) {
					thisDonut.select('.category').text(function (donut_d: any) {
						return d.data.cat;
					});
					thisDonut.select('.value').text(function (donut_d: any) {
						return local.miscService.formatNumber(d.data.val.toFixed(2)) + donut_d.unit;
					});
					thisDonut.select('.percentage').text(function (donut_d: any) {
						return local.miscService.formatNumber((d.data.val / donut_d.total * 100).toFixed(2)) + '%';
					});
				}
			})
			.on('mouseout', function (d: any, i: any, j: any) {
				let thisPath = d3.select(d3.event.target);
				if (!thisPath.classed('clicked')) {
					local.pathAnim(thisPath, 0);
				}
				if (!local.fullView) {

					let thisDonut = d3.select(d3.select(d3.event.target).node().parentNode);// local.charts.select('.type' + j);
					local.setCenterText(thisDonut);
				}
			})
			.on('click', function (d: any, i: any, j: any) {
				d3.event.stopPropagation();
				if (!local.fullView) {
					let thisDonut = d3.select(d3.select(d3.event.target).node().parentNode);// local.charts.select('.type' + j);

					if (0 === thisDonut.selectAll('.clicked').nodes().length) {
						thisDonut.select('circle').dispatch('click');
					}

					let thisPath = d3.select(d3.event.target);
					let clicked = thisPath.classed('clicked');
					local.pathAnim(thisPath, ~~(!clicked));
					thisPath.classed('clicked', !clicked);

					local.setCenterText(thisDonut);
				}
			})
		//.on(eventObj)


		if (this.fullView) {
			//To Prevent Overlap

			let labelArc = d3.arc()
				.outerRadius(local.chart_r * 1.08)
				.innerRadius(local.chart_r * 1.28);

			this.text = this.svg.select(".labels")
				.selectAll("text").data(this.pieData, function (d: any) {
					return d.data.cat;
				});

			let margin = {
				top: 80,
				bottom: 80,
				left: 120,
				right: 120,
			};

			let posList: any[] = [];

			this.text
				.enter()
				.append("text")
				.attr('class', 'label')
				.attr('id', function (d: any, j: any) {
					return 'l-' + j;
				}).attr("transform", function (d: any, i: any, n: any) {
					var pos = labelArc.centroid(d);
					pos[0] = local.chart_r * 1.28 * ((d.startAngle + (d.endAngle - d.startAngle) / 2) < Math.PI ? 1 : -1);
					posList.push(pos);
					return "translate(" + pos + ")";
				})
				.style("text-anchor", function (d: any) {
					return (d.startAngle + (d.endAngle - d.startAngle) / 2) < Math.PI ? "start" : "end";
				})
				.attr("dy", ".35em")
				.attr("dx", ".35em")
				.attr("fill", "#111")
				.text(function (d: any) {


					return d.data.cat + " (" + local.miscService.formatNumber(d.data.val.toFixed(2)) + " " + local.unit + ", " + local.miscService.formatNumber((d.data.val * 100 / data[0].total).toFixed(2)) + "%" + ")";
				})
				.call(local.wrap, margin.right + 80);

			this.arrangeLabels(this.svg, ".label");

			var polyline = this.svg.select(".lines")
				.selectAll("polyline")
				.data(this.pieData, function (d: any) {
					return d.data.cat;
				});

			polyline.enter()
				.append("polyline").style('stroke', function (d: any, i: any) {
					return local.color[i];
				})
				.attr("points", function (d: any, j: any, n: any) {
					var offset = (d.startAngle + (d.endAngle - d.startAngle) / 2) < Math.PI ? 0 : 10;
					var label = d3.select('#l-' + j);
					var transform = local.getTransformation(label.attr("transform"));
					var pos = labelArc.centroid(d);
					pos[0] = transform.translateX + offset;
					pos[1] = transform.translateY;
					var mid = labelArc.centroid(d);
					mid[1] = transform.translateY;
					return [arc.centroid(d), mid, pos];
				});
		}

		paths.exit().remove();

		local.resetAllCenterText();
	}

	label_group: any = {};
	pieData: any;
	r: any = 150;
	textOffset: any = 15;

	text: any;

	create(dataset: any) {
		let local = this;


		local.chart_m = (this.chartContainer.nativeElement.clientWidth) / dataset.length / 2 * 0.14;
		local.chart_r = (this.chartContainer.nativeElement.clientWidth) / dataset.length / 2 * 0.85;

		let ratio = 1;

		if (this.fullView) {

			let widthRatio = window.innerWidth / this.chartContainer.nativeElement.clientWidth;
			ratio = window.innerWidth / (window.innerHeight / widthRatio);

			local.chart_m = ((this.chartContainer.nativeElement.clientWidth) / dataset.length / 2) * 0.60 / ratio;
			local.chart_r = ((this.chartContainer.nativeElement.clientWidth) / dataset.length / 2) * 0.40 / ratio;
		}

		local.charts.append('div')
			.attr('class', 'legend row')
			.attr('width', '100%')
		//.attr('height', 50)
		//.attr('transform', 'translate(0, -50)');

		let svg = this.svg = local.charts.selectAll('.donut')
			.data(dataset)
			.enter().append('svg:svg')
			.attr('width', (local.chart_r + local.chart_m) * 2 * ratio)
			.attr('height', (local.chart_r + local.chart_m) * 2);

		let donut = svg
			.append('svg:g')
			.attr('class', function (d: any, i: any) {
				return 'donut type' + i;
			})
			.attr('transform', 'translate(' + ((local.chart_r + local.chart_m) * ratio) + ',' + (local.chart_r + local.chart_m) + ')');

		if (this.fullView) {
			//GROUP FOR LABELS
			//this.label_group = svg.append("svg:g")
			//	.attr("class", "label_group")
			//	.attr("transform", "translate(" + (local.chart_r + local.chart_m) + "," + (local.chart_r + local.chart_m) + ")");

			//To Prevent Overlap

			this.svg.append("g")
				.attr("class", "labels").attr('transform', 'translate(' + (local.chart_r + local.chart_m) * ratio + ',' + (local.chart_r + local.chart_m) + ')');;

			this.svg.append("g")
				.attr("class", "lines").attr('transform', 'translate(' + (local.chart_r + local.chart_m) * ratio + ',' + (local.chart_r + local.chart_m) + ')');;

		}


		if (this.showLegends) {
			local.createLegend(local.getCatNames(dataset));
		}
		local.createCenter();

		local.updateDonut();
	}

	textTween(d: any, i: any) {
		var a;
		let oldPieData = this.pieData;
		let local = this;
		if (this.pieData[i]) {
			a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI) / 2;
		} else if (!(oldPieData[i]) && oldPieData[i - 1]) {
			a = (oldPieData[i - 1].startAngle + oldPieData[i - 1].endAngle - Math.PI) / 2;
		} else if (!(oldPieData[i - 1]) && oldPieData.length > 0) {
			a = (oldPieData[oldPieData.length - 1].startAngle + oldPieData[oldPieData.length - 1].endAngle - Math.PI) / 2;
		} else {
			a = 0;
		}
		var b = (d.startAngle + d.endAngle - Math.PI) / 2;

		var fn = d3.interpolateNumber(a, b);
		return function (t: any) {
			var val = fn(t);
			return "translate(" + Math.cos(val) * (local.chart_r + local.textOffset) + "," + Math.sin(val) * (local.chart_r + local.textOffset) + ")";
		};
	}

	update(dataset: any) {
		let local = this;
		// Assume no new categ of data enter
		let donut = this.charts.selectAll(".donut").data(dataset);

		local.updateDonut();
	}
	//}
	genData() {
		let type = [this.title];
		let unit = [' ' + this.unit];

		this.data = this.filterZeroValues(this.dataOriginal);

		let dataset = new Array();
		let local = this;
		for (let i = 0; i < type.length; i++) {
			let data = new Array();
			let total = 0;

			this.data.forEach(function (val, i) {
				total += parseFloat(val[local.valField]);
				data.push({
					"cat": val[local.catField],
					"val": parseFloat(val[local.valField])
				});
			})

			dataset.push({
				"type": type[i],
				"unit": unit[i],
				"data": data,
				"total": total
			});

		}

		return dataset;
	}

	getTransformation(transform: any) {
		/*
		 * This code comes from a StackOverflow answer to a question looking
		 * to replace the d3.transform() functionality from v3.
		 * http://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
		 */
		var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

		g.setAttributeNS("", "transform", transform);
		var matrix = g.transform.baseVal.consolidate()
			.matrix;

		var {
			a,
			b,
			c,
			d,
			e,
			f
		} = matrix;
		var scaleX, scaleY, skewX;
		if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
		if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
		if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
		if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
		return {
			translateX: e,
			translateY: f,
			rotate: Math.atan2(b, a) * Math.PI / 180,
			skewX: Math.atan(skewX) * Math.PI / 180,
			scaleX: scaleX,
			scaleY: scaleY
		};
	}

	arrangeLabels(selection: any, label_class: string) {
		var move = 1;
		while (move > 0) {
			move = 0;


			let local = this;
			selection.selectAll(label_class)
				.each(function (d: any, i: any, n: any) {
					var that = n[i];
					var a = n[i].getBoundingClientRect();
					selection.selectAll(label_class)
						.each(function (d2: any, i2: any, n2: any) {
							let curr = n2[i2];
							if (curr != that) {
								var b = curr.getBoundingClientRect();
								if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) && (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
									var dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01;
									var dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.04;
									var tt: any = local.getTransformation(d3.select(curr)
										.attr("transform"));
									var to: any = local.getTransformation(d3.select(that)
										.attr("transform"));
									move += Math.abs(dx) + Math.abs(dy);

									to.translate = [to.translateX + dx, to.translateY + dy];
									tt.translate = [tt.translateX - dx, tt.translateY - dy];
									d3.select(curr)
										.attr("transform", "translate(" + tt.translate + ")");
									d3.select(that)
										.attr("transform", "translate(" + to.translate + ")");
									a = curr.getBoundingClientRect();
								}
							}
						});
				});
		}
	}

	wrap(text: any, width: number) {
		text.each(function (d: any, i: any, n: any) {
			var text = d3.select(n[i]);
			var words = text.text()
				.split(/\s+/)
				.reverse();
			var word;
			let line: any[] = [];
			var lineHeight = 1;
			var y = 0 //text.attr("y");
			var x = 0;
			var dy = parseFloat(text.attr("dy"));
			var dx = parseFloat(text.attr("dx"));
			var tspan: any = text.text(null)
				.append("tspan")
				.attr("x", x)
				.attr("y", y);
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node()
					.getComputedTextLength() > width - x) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan")
						.attr("x", x)
						.attr("dy", lineHeight + "em")
						.attr("dx", dx + "em")
						.text(word);
				}
			}
		});
	}
}