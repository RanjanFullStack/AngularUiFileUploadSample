import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from '../../services/miscellaneous.service';

const HC_exporting = HC_exporting_;

@Component({
    selector: 'app-lineBar-chart',
    template: `
   
<div #divLineBarChart ></div>
    `,
    //styleUrls: ['./chart.css']
})


export class lineBarChartComponent implements OnInit, OnChanges {

    @ViewChild('divLineBarChart') chartContainer: ElementRef;

    //@Input() data: any[];
    @Input() colours: Array<string>;
    @Input() xField: string;
    @Input() height: any;
    @Input() yBarFields: string[];
    @Input() yLineFields: string[];
    @Input() barColors: string[];
    @Input() barHoverColors: string[];
    @Input() lineColors: string[];
    @Input() unit: string = "";
    @Input() valueSuffix: string = "";
    dataClone: any[];
    get data(): any[] {
        // transform value for display
        return this.dataClone;
    }

    @Input()
    set data(data: any[]) {
        if (data != undefined && data.length > 0) {
            this.dataClone = JSON.parse(JSON.stringify(data));
            //this.dataClone = this.generateData();
        }
        else {
            this.dataClone = [];
        }

    }

    get ifLineChartDataAvailable(): boolean {
        // transform value for display
        return this.yLineFields && this.yLineFields.length > 0;
    }

    svg: any;
    opacity: any;
    chart: any;
    hostElement: any;
    divTooltip: any;
    divLineTooltip: any;
    create: any; update: any;

    //data :any[]= [
    //	{
    //		Date: "65",
    //		Categories: [{
    //			Name: "Category1", Value: 368
    //		}, {
    //				Name: "Category2", Value: 321
    //			}],
    //		LineCategory: [{ Name: "Line1", Value: 69 }, { Name: "Line2", Value: 169 }]
    //	},
    //	{ Date: "125", Categories: [{ Name: "Category1", Value: 521 }, { Name: "Category2", Value: 123 }], LineCategory: [{ Name: "Line1", Value: 89 }, { Name: "Line2", Value: 189 }] },
    //	{ Date: "185", Categories: [{ Name: "Category1", Value: 368 }, { Name: "Category2", Value: 236 }], LineCategory: [{ Name: "Line1", Value: 63 }, { Name: "Line2", Value: 163 }] },
    //	{ Date: "245", Categories: [{ Name: "Category1", Value: 423 }, { Name: "Category2", Value: 330 }], LineCategory: [{ Name: "Line1", Value: 86 }, { Name: "Line2", Value: 186 }] },
    //	{ Date: "305", Categories: [{ Name: "Category1", Value: 601 }, { Name: "Category2", Value: 423 }], LineCategory: [{ Name: "Line1", Value: 65 }, { Name: "Line2", Value: 165 }] },
    //	{ Date: "365", Categories: [{ Name: "Category1", Value: 412 }, { Name: "Category2", Value: 461 }], LineCategory: [{ Name: "Line1", Value: 75 }, { Name: "Line2", Value: 175 }] }
    //]

    constructor(
        private elRef: ElementRef, private miscService: MiscellaneousService
    ) { }

    ngOnInit() {

        // create chart and render
        //this.createChart();


    }

    ngOnChanges() {
        // update chart on data input value change
        //if (this.svg) this.updateChart(false);
        this.createHightChart();
        //this.createChart();
    }
    colorRange = [
        "rgb(70, 190, 245)",
        "rgb(245, 140, 60)",
        "rgb(210, 15, 70)",
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


    createHightChart() {
        let local = this;
        let arrCategories: any[] = [];
        let arrSeries: any[] = [];

        if (this.data != null || this.data != undefined) {

            if (this.data.length > 0) {

                this.data.forEach(function (val, i) {
                    arrCategories.push(val[local.xField]);
                });

                for (let index = 0; index < this.yBarFields.length; index++) {
                    let data: any[] = [];
                    this.data.forEach(function (val, i) {
                        data.push(local.convertToNumber(val[local.yBarFields[index]]));
                    });

                    arrSeries.push({
                        name: this.yBarFields[index],
                        type: 'column',
                        yAxis: 1,
                        data: data,
                    });
                }

                for (let index = 0; index < this.yLineFields.length; index++) {
                    let data: any[] = [];
                    this.data.forEach(function (val, i) {
                        data.push(local.convertToNumber(val[local.yLineFields[index]]));
                    });
                    arrSeries.push({
                        name: this.yLineFields[index],
                        type: 'spline',
                        data: data,
                        color: 'rgb(210, 15, 70)',
                        marker: {
                            lineWidth: 2,
                            lineColor: '#1f89ce',
                            fillColor: 'white',
                        },
                    });
                }
            }
            else {
                arrCategories = [];
                arrSeries = [];

            }
        }

        let parentWidth = 960;
        let dHeight: any, dWdith: any;
        this.hostElement = this.chartContainer.nativeElement;
        if (this.hostElement && this.hostElement.clientWidth > 0) {
            parentWidth = this.hostElement.clientWidth - 10;
        }

        let h = parentWidth * 0.5;
        if (this.height != null && this.height != undefined) {
            if (this.height < 180) {
                this.height = 180;
            }
            h = this.height;
        }

        /******To handle different div layouts*************[Start]***/
        var classNames = ["col-sm-6", "col-md-6"];
        var flag = 0;
        var containerClass = this.chartContainer.nativeElement.offsetParent.className;
        classNames.forEach(function (val: any, key: any) {
            if (containerClass.indexOf(val) >= 0) {
                flag++;
            }
        });


        if (flag > 0) {
            var margin = { top: 50, right: 80, bottom: 70, left: 115 },
                width = parentWidth - margin.left - margin.right,
                height = h - margin.top - margin.bottom;
        } else {
            var margin = { top: 35, right: 60, bottom: 30, left: 100 },
                width = 750 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;
        }

        // var margin = { top: 80, right: 20, bottom: 30, left: 100 },
        // width = screen.availWidth - 220 - margin.left - margin.right,
        // height = 500 - margin.top - margin.bottom;
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)


        var ChartColors = this.colorRange


        Highcharts.chart(this.chartContainer.nativeElement, {
            chart: {
                zoomType: 'xy',
                height: (height + margin.top + margin.bottom) + 30,
                style: {
                    color: 'black', fontSize: '11px', FontFamily: 'Arial',
                }
            },
            colors: ChartColors,
            title: {
                text: ''
            },
            xAxis: [{
                categories: arrCategories,
                crosshair: true,
                labels: {
                    style:
                    {
                        textAlign: 'center', whiteSpace: 'normal', fontSize: '9px'
                    },
                    useHTML: true,
                    overflow: 'allow',
                   // rotation: 0
                },
                title: {
                    text: this.xField,
                }
            }],
            yAxis: [
                { // Secondary yAxis
                    title: {
                        text: local.yLineFields[0],
                        rotation: 270,
                        x: 7,
                    },
                    labels: {
                        format: '{value:,.0f} ',
                        style:
                        {
                            fontSize: '9px'
                        },
                        formatter: function () {
                            let DecimalPoint: number = 0;
                            if (String(this.value).indexOf(".") >= 0)
                                DecimalPoint = 2;
                            return Highcharts.numberFormat(this.value, DecimalPoint, ".", ",");
                        }
                    },
                    tickAmount: 5,
                    opposite: true
                },
                { // Primary yAxis                
                    title: {
                        text: (local.yBarFields.join("/")) + (local.unit != "" ? " (" + local.unit + ")" : ""),
                    },
                    labels: {
                        format: '{value:,.0f} ',
                        style:
                        {
                            fontSize: '9px'
                        },
                        formatter: function () {
                            let DecimalPoint: number = 0;
                            if (String(this.value).indexOf(".") >= 0)
                                DecimalPoint = 2;
                            return Highcharts.numberFormat(this.value, DecimalPoint, ".", ",");
                        }

                    },
                    tickAmount: 5,
                }],
            lang: {
                noData: "No records found"
            },
            tooltip: {
                // shared: true
                formatter: function () {
                    let DecimalPoint: number = 0;
                    if (String(this.point.y).indexOf(".") >= 0)
                        DecimalPoint = 2;

                    let unit: string = "";
                    if (local.yBarFields.filter(x => x.indexOf(this.point.series.name) >= 0).length > 0)
                        unit = (local.unit != "" ? " (" + local.unit + ")" : "");

                    let toolTip: string = "<span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>" + this.point.series.name + unit + "</span><br/>" + this.key + ": " + Highcharts.numberFormat(this.point.y, DecimalPoint, ".", ",")
                    return toolTip;
                },
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 0,
                y: 0
            },
            series: arrSeries,
            credits: {
                enabled: false
            },
        });
    }

    generateData() {
        let local = this;
        let result: any[] = [];
        this.data.forEach(function (val: any) {
            let obj: any = {};
            obj.Date = val[local.xField];
            obj.Categories = [];
            local.yBarFields.forEach(function (yBarField: any) {
                let barCat: any = {};
                barCat.Name = yBarField;
                barCat.Value = local.convertToNumber(val[yBarField]);
                obj.Categories.push(barCat);
            })
            if (local.ifLineChartDataAvailable) {
                obj.LineCategory = [];
                local.yLineFields.forEach(function (yLineField: any) {
                    let lineCat: any = {};
                    lineCat.Name = yLineField;
                    lineCat.Value = local.convertToNumber(val[yLineField]);
                    obj.LineCategory.push(lineCat);
                })
            }
            result.push(obj);
        })

        return result;
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

    getTextWidth(text: string, fontSize: any, fontName: string) {
        let c = document.createElement("canvas");
        let ctx = c.getContext("2d");
        if (ctx != null) {
            ctx.font = fontSize + ' ' + fontName;
            return ctx.measureText(text).width * 1.25;
        }
        return 0;
    }

    DataSegregator(array: any[], on: any) {
        var SegData: any;
        let OrdinalPositionHolder: any = {
            valueOf: function () {
                let thisObject: any = this;
                let keys = Object.keys(thisObject);
                keys.splice(keys.indexOf("valueOf"), 1);
                keys.splice(keys.indexOf("keys"), 1);
                return keys.length == 0 ? -1 : d3.max(keys, function (d) { return thisObject[d] })
            }
            , keys: function () {
                let thisObject: any = this;
                let keys = Object.keys(thisObject);
                keys.splice(keys.indexOf("valueOf"), 1);
                keys.splice(keys.indexOf("keys"), 1);
                return keys;
            }
        }
        array[0].map(function (d: any) { return d[on] }).forEach(function (b: any) {
            let value = OrdinalPositionHolder.valueOf();
            OrdinalPositionHolder[b] = OrdinalPositionHolder > -1 ? ++value : 0;
        })

        SegData = OrdinalPositionHolder.keys().map(function () {
            return [];
        });

        array.forEach(function (d) {
            d.forEach(function (b: any) {
                SegData[OrdinalPositionHolder[b[on]]].push(b);
            })
        });

        return SegData;
    }


    createChart() {
        d3.select(this.hostElement).html("");
        let timestamp = new Date().toString();
        let local = this;
        let parentWidth = 960;
        this.hostElement = this.chartContainer.nativeElement;
        if (this.hostElement && this.hostElement.clientWidth > 0) {
            parentWidth = this.hostElement.clientWidth - 10;
        }

        let h = parentWidth * 0.5;
        if (this.height != null && this.height != undefined) {
            if (this.height < 180) {
                this.height = 180;
            }

            h = this.height;

        }

        /******To handle different div layouts*************[Start]***/
        var classNames = ["col-sm-6", "col-md-6"];
        var flag = 0;
        var containerClass = this.chartContainer.nativeElement.offsetParent.className;
        classNames.forEach(function (val: any, key: any) {
            if (containerClass.indexOf(val) >= 0) {
                flag++;
            }
        });

        if (flag > 0) {
            var margin = { top: 50, right: 80, bottom: 70, left: 115 },
                width = parentWidth - margin.left - margin.right,
                height = h - margin.top - margin.bottom;
        } else {
            var margin = { top: 35, right: 60, bottom: 30, left: 100 },
                width = 750 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;
        }
        /******To handle different div layouts************[End]*****/

        var textWidthHolder = 0;

        var Categories = new Array();
        // Extension method declaration

        var x0 = d3.scaleBand().rangeRound([0, width]);

        var XLine = d3.scaleBand().rangeRound([0, width]).padding(0.1);

        var x1 = d3.scaleBand();// d3.scaleOrdinal();

        var maxLeftVal = d3.max(this.data, function (d: any) {
            let maxCat: any = d3.max(d.Categories, function (b: any) {
                return b.Value;
            });
            return maxCat;
            //return maxCat < 10 ? 10 : maxCat;
        });

        var minLeftVal = d3.min(this.data, function (d: any) {

            let minCat: any = d3.min(d.Categories, function (b: any) {
                return b.Value;
            });
            return minCat < 0 ? minCat : 0;
        });

        var fractionValues = this.data.filter(function (d: any) {
            let res = d.Categories.filter(function (b: any) {
                return !Number.isInteger(b.Value);
            });
            return res.length > 0;
        });

        // var y = d3.scaleLinear().range([height, 0]);

        // y.domain([minLeftVal, maxLeftVal]);

        /* This scale produces negative output for negatve input */
        var yScale = d3.scaleLinear()
            .domain([0, maxLeftVal])
            .range([0, height]);

        if (maxLeftVal >= 0 && minLeftVal < 0) {
            yScale = d3.scaleLinear()
                .domain([minLeftVal, maxLeftVal])
                .range([0, height]);
        }

        /*
        * We need a different scale for drawing the y-axis. It needs
        * a reversed range, and a larger domain to accomodate negaive values.
        */
        var y = d3.scaleLinear()
            .domain([minLeftVal, maxLeftVal])
            .range([height - yScale(minLeftVal), 0]);
        if (maxLeftVal < 0 && minLeftVal < 0) {
            y = d3.scaleLinear()
                .domain([minLeftVal, maxLeftVal])
                .range([yScale(maxLeftVal), 0]);

        }

        if (maxLeftVal >= 0 && minLeftVal < 0) {
            y = d3.scaleLinear()
                .domain([minLeftVal, maxLeftVal])
                .range([yScale(maxLeftVal), yScale(minLeftVal)]);

        }


        var ticks = y.ticks(7);

        if (ticks[0] > minLeftVal) {
            var diff = (ticks[1] - ticks[0])
            minLeftVal = ticks[0] - diff;
            y = d3.scaleLinear().range([height, 0]);
            y.domain([minLeftVal, maxLeftVal]);
            ticks = y.ticks(7);
        }


        var lastTick = ticks[ticks.length - 1],
            newLastTick = lastTick + (ticks[1] - ticks[0]);

        if (fractionValues.length == 0) {
            ticks = ticks.filter(function (val: number) { return Number.isInteger(val); });
            (lastTick = ticks[ticks.length - 1]),
                (newLastTick = lastTick + (ticks[1] - ticks[0]));
        }

        if (lastTick < y.domain()[1]) {
            ticks.push(newLastTick);
            y.domain([y.domain()[0], newLastTick]);
        }
        else {
            y.domain([y.domain()[0], lastTick]);
        }

        //  var yAxis = d3.axisLeft(y).ticks(5);//.tickFormat(d3.format(".2s"));

        var yAxis = d3.axisLeft(y).tickPadding(10).tickFormat(function (d) {
            return local.miscService.formatNumber(d.toString());
        }).tickValues(ticks);

        var YRightAxis: any;
        if (local.ifLineChartDataAvailable) {

            if (local.ifLineChartDataAvailable) {
                /// Adding Date in LineCategory
                this.data.forEach(function (d) {
                    d.LineCategory.forEach(function (b: any) {
                        b.Date = d.Date;
                    });
                });
            }

            var lineFractionValues = this.data.filter(function (d: any) {
                let res = d.LineCategory.filter(function (b: any) {
                    return !Number.isInteger(b.Value);
                });
                return res.length > 0;
            });

            let rightMinVal = d3.min(this.data, function (d: any) {
                let minCat: any = d3.min(d.LineCategory, function (b: any) {
                    return b.Value;
                });
                return minCat < 0 ? minCat : 0;
            });

            var YLine = d3.scaleLinear().range([height, 0]).domain([rightMinVal, d3.max(this.data, function (d: any) {
                let maxCat: any = d3.max(d.LineCategory, function (b: any) {
                    return b.Value;
                });
                return maxCat;
                //return maxCat < 10 ? 10 : maxCat;
            })]);

            var lineTicks = YLine.ticks(4);

            var lastLineTick = lineTicks[lineTicks.length - 1],
                newLastLineTick = lastLineTick + (lineTicks[1] - lineTicks[0]);

            if (lineFractionValues.length == 0) {
                lineTicks = lineTicks.filter(function (val: number) { return Number.isInteger(val); });
                (lastLineTick = lineTicks[lineTicks.length - 1]),
                    (newLastLineTick = lastLineTick + (lineTicks[1] - lineTicks[0]));
            }

            if (lastLineTick < YLine.domain()[1]) {
                lineTicks.push(newLastLineTick);
                YLine.domain([YLine.domain()[0], newLastLineTick]);
            }
            else {
                YLine.domain([YLine.domain()[0], lastLineTick]);
            }

            this.divLineTooltip = d3.select("body").append("div").attr("id", "divLineTooltip" + timestamp).attr("class", "toolTip");

            YRightAxis = d3.axisRight(YLine).tickValues(lineTicks);//.tickFormat(d3.format(".2s"));

            if (lineFractionValues.length == 0) {
                YRightAxis.tickFormat(d3.format("d"));
            }
        }


        if (this.barColors && this.barColors.length > 0) {
            this.colorRange = this.barColors;
        }
        var hoverColorRange = [
            "#9b9995",
            "#686662",
            "#484744",
            "#6c9923",
            "#addb62",
            "#c8e796",
            "#e4f3cb"
        ];
        if (this.barHoverColors && this.barHoverColors.length > 0) {
            hoverColorRange = this.barHoverColors;
        }

        var color = d3.scaleOrdinal()
            .range(this.colorRange);

        var hoverColor = d3.scaleOrdinal()
            .range(hoverColorRange);

        var xAxis = d3.axisBottom(x0);//.scale(x0);



        this.divTooltip = d3.select("body").append("div").attr('id', 'divtoolTip' + timestamp).attr("class", "toolTip");

        let svgParent = d3.select(this.chartContainer.nativeElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        var LegendHolder = svgParent.append("g").attr("class", "legendHolder");

        this.svg = svgParent.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Bar Data categories
        this.data.forEach(function (d) {
            d.Categories.forEach(function (b: any) {
                if (Categories.findIndex(function (c) { return c.Name === b.Name; }) == -1) {
                    b.Type = "bar";

                    Categories.push(b);
                }
            })
        });

        var lineColorRange = [
            "#941868",
            "#6c9923",
            "#484744",
            "#addb62",
            "#65b5eb"
        ];
        if (this.lineColors && this.lineColors.length > 0) {
            lineColorRange = this.lineColors;
        }

        let LineColor = d3.scaleOrdinal().range(lineColorRange);
        let lineData: any;

        if (local.ifLineChartDataAvailable) {
            // Line Data categories
            this.data.forEach(function (d) {
                d.LineCategory.forEach(function (b: any) {
                    if (Categories.findIndex(function (c) { return c.Name === b.Name; }) == -1) {
                        b.Type = "line";

                        Categories.push(b);
                    }
                })
            });

            var line = d3.line().x(function (d: any) {
                let x0Date: any = x0(d.Date);
                return x0Date + x0.bandwidth() / 2;

            }).y(function (d: any) { return YLine(d.Value) }).curve(d3.curveCatmullRom.alpha(0.5));//.curve(d3.curveCardinal.tension(0.5));

            // Processing Line data
            lineData = this.DataSegregator(this.data.map(function (d) { return d.LineCategory; }), "Name");

            // Line Coloring
            LineColor.domain(Categories.filter(function (d) { return d.Type == "line"; }).map(function (d) { return d.Name; }));

            XLine.domain(this.data.map(function (d) { return d.Date; }));
        }

        x0.domain(this.data.map(function (d) { return d.Date; }));
        x1.domain(Categories.filter(function (d) { return d.Type == "bar"; }).map(function (d) { return d.Name; })).rangeRound([0, x0.bandwidth()]).paddingOuter(0.4);

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y).tickValues(ticks);
        }

        // add the Y gridlines
        this.svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
            ).selectAll("text").remove();

        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)");

        this.svg.select("g.x-axis")
            .append("text")
            .attr("transform", "translate(" + width / 2 + "," + 40 + ")")
            .attr("dy", "1.71em")
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
        let yAxisLabel;
        if (this.yBarFields.length > 1)
            yAxisLabel = "Value";
        else
            yAxisLabel = this.yBarFields[0];

        svgYAxis
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 15 - maxTickWidth)
            .attr("x", 0 - (height / 2))
            //.attr("y", -100)
            //.attr("x", (height / -2) + (local.yBarFields[0].length / 2) + margin.top)
            .attr("dy", "-1.71em")
            .attr("class", "axis-label")
            .style("text-anchor", "middle")
            .text(yAxisLabel + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : ""));

        var bar = this.svg.selectAll(".bar")
            .data(local.data)
            .enter().append("g")
            .attr("class", "rect")
            .attr("transform", function (d: any) { return "translate(" + x0(d.Date) + ",0)"; });

        let barWidth = Math.min(x1.bandwidth(), 50);

        bar.selectAll("rect")
            .data(function (d: any) { return d.Categories; })
            .enter().append("rect")
            .attr("class", "dbar")
            .attr("width", barWidth)
            .attr("x", function (d: any) { let res = x1(d.Name); return res != undefined ? (res + x1.bandwidth() / 2) - barWidth / 2 : 0; })
            //.attr("x", function (d: any) { return x1(d.Name); })
            // .attr("y", function (d: any) { if(d.Value!=null) 
            //  return y(d.Value) 
            //  else return height; })
            .attr("y", function (d: any) {
                if (d.Value != null) {
                    if (minLeftVal < 0 && maxLeftVal < 0) {
                        if (y(0) > y(d.Value))
                            return y(d.Value);
                        else
                            return 0;
                    }
                    //  else if(minLeftVal<0 && maxLeftVal>=0)
                    //   {
                    //     if(y(0) > y(d.Value))
                    //     return y(Math.min(0, d.Value));
                    //   else
                    //     return 0;
                    //   }
                    else {
                        if (y(0) > y(d.Value))
                            return y(d.Value);
                        else
                            return y(0);
                    }

                }//return y(d.Value) 
                else return height;
            })
            .attr("height", function (d: any) {
                if (minLeftVal < 0 && maxLeftVal < 0) {
                    if (d.Value != null)
                        return Math.abs(0 - y(d.Value));
                    else
                        return 0;
                }
                else if (minLeftVal < 0 && maxLeftVal >= 0) {
                    if (d.Value != null)
                        return Math.abs(y(d.Value) - y(0));
                    else
                        return 0;
                }
                else {
                    if (d.Value != null)
                        return Math.abs(y(0) - y(d.Value));
                    else
                        return 0;
                }
            })
            //.style("fill", function (d) { return color(d.Name); })
            .attr("fill", function (d: any, i: any) {
                return color(i);
            })
            .attr("id", function (d: any, i: any) {
                return i;
            })
            .on("mouseover", function (d: any, i: any) {
                d3.select(d3.event.target).style("opacity", 0.8);
            })
            .on("mouseout", function (d: any, i: any) {
                d3.select(d3.event.target).style("opacity", 1);
            })
        // .transition().ease(d3.easeBounce)
        // .duration(1000).attrTween("height", function (d: any) {
        //  var i = d3.interpolate(0, height - y(d.Value));
        //  return function (t: any) {
        //    return i(t);
        //  }
        // });


        bar.on("mousemove", function (d: any) {

            local.divTooltip.style("left", d3.event.pageX + 10 + "px");
            local.divTooltip.style("top", d3.event.pageY - 25 + "px");
            local.divTooltip.style("display", "inline-block");
            var elements: any = document.querySelectorAll(':hover');
            let l = elements.length;
            l = l - 1
            let elementData = elements[l].__data__;


            let formatValue: any;
            if (Number(elementData.Value) < 0) {
                //formatValue='<span class="red">'+ local.miscService.formatNumbertoString(elementData.Value).replace('-', '(') + ')' +'</span>';
                //formatValue=local.miscService.formatNumbertoString(elementData.Value).toString().replace('-', '(') + ')';
                formatValue = local.unit == '%' ? local.miscService.formatNumbertoString(elementData.Value).toString().replace('-', '(') + local.unit + ')' : local.miscService.formatNumbertoString(elementData.Value).toString().replace('-', '(' + local.unit) + ')';
                //formatValue=local.unit=='%'?formatValue+local.unit:((local.unit=='$')? (local.unit+(formatValue)):formatValue);
            }
            else
                formatValue = local.unit == '%' ? local.miscService.formatNumbertoString(elementData.Value) + local.unit : ((local.unit == '$') ? (local.unit + (local.miscService.formatNumbertoString(elementData.Value))) : local.miscService.formatNumbertoString(elementData.Value));
            // local.divTooltip.html(elementData.Name + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : "") + "<br>" + (d.Date) + " : " + local.miscService.formatNumbertoString(elementData.Value));
            local.divTooltip.html(elementData.Name + ((local.unit && local.unit.trim() != "") ? (" (" + local.unit) + ")" : "") + "<br>" + (d.Date) + " : " + formatValue);
        });

        bar.on("mouseout", function (d: any) {
            local.divTooltip.style("display", "none");
        });

        if (local.ifLineChartDataAvailable) {
            let svgRightYAxis = this.svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + (width) + ",0)")
                .call(YRightAxis);

            let rightTickNodes = svgRightYAxis.selectAll("g.tick").nodes();
            let maxRightTickWidth = 0;
            if (rightTickNodes.length > 0) {
                maxRightTickWidth = Math.max.apply(Math, rightTickNodes.map(function (val: any) {
                    var text: any = d3.select(val).select("text");
                    return text.node().getBoundingClientRect().width;
                }));
            }

            svgRightYAxis
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 30 + maxRightTickWidth)
                .attr("x", 0 - (height / 2))
                //.attr("x", (height / -2) + (local.yLineFields[0].length / 2) + margin.top)
                .attr("dy", ".71em")
                .attr("class", "axis-label")
                .style("text-anchor", "middle")
                .text(local.yLineFields[0]);

            lineData.forEach(function (data: any) {

                data = data.filter(function (ele: any) {
                    return ele.Value != null;
                });
                if (data[0] != null && data[0].length != 0) {
                    var gLine = local.svg.append("g").attr("name", data[0].Name);

                    gLine.append("path")
                        .attr("class", "line")
                        .attr("d", line(data))
                        .attr("style", "stroke-width: 2px; fill:none; stroke:" + LineColor(data[0].Name))
                        .transition().duration(1500);

                    gLine.selectAll("dot")
                        .data(data)
                        .enter().append("circle")
                        .attr("r", 5)
                        .attr("cx", function (d: any) {
                            let x0Date: any = x0(d.Date);
                            return x0Date + x0.bandwidth() / 2;
                            //return x0(d.Date);
                        })
                        .attr("cy", function (d: any) { return YLine(d.Value); })
                        .attr("style", "fill: #f8f9fa; stroke:#1f89ce;")
                        .on("mouseover", function (d: any) {
                            local.divLineTooltip.style("left", d3.event.pageX + 10 + "px");
                            local.divLineTooltip.style("top", d3.event.pageY - 25 + "px");
                            local.divLineTooltip.style("display", "inline-block");
                            let formatValue: any;
                            if (Number(d.Value) < 0) {
                                formatValue = local.miscService.formatNumbertoString(d.Value).toString().replace('-', '(') + '%)';
                            }
                            else
                                formatValue = local.miscService.formatNumbertoString(d.Value);

                            local.divLineTooltip.html(data[0].Name + "</br>" + (d.Date) + " : " + formatValue);
                            //local.divLineTooltip.html(data[0].Name + "</br>" + (d.Date) + " : " + local.miscService.formatNumbertoString(d.Value))
                        })
                        .on("mouseout", function (d: any) {
                            local.divLineTooltip.style("display", "none");
                        });
                }
            })
        }

        // Legends

        var legend: any = LegendHolder.selectAll(".legend")
            .data(
                Categories.map(function (d) {
                    return { Name: d.Name, Type: d.Type };
                })
            )
            .enter()
            .append("g")
            .attr("class", "legend")
            //.attr("transform", function (d: any, i: any) { return "translate(0," + (height + margin.top / 2) + ")"; })
            .each(function (d: any, i: any, n: any) {
                //  Legend Symbols

                d3.select(n[i])
                    .append("rect")
                    .attr("width", function () {
                        return 12;
                    })
                    .attr("x", function (b) {
                        if (i > 0) {
                            textWidthHolder = textWidthHolder + 50;
                        }
                        let left = (i + 1) * 15 + i * 18 + i * 5 + textWidthHolder;
                        return left;
                    })
                    .attr("y", function (b: any) {
                        return b.Type == "bar" ? 0 : 7;
                    })
                    .attr("height", function (b: any) {
                        return b.Type == "bar" ? 12 : 5;
                    })
                    .style("fill", function (b: any) {
                        let result: any = b.Type == "bar" ? color(i) : LineColor(d.Name);
                        return result;
                    })
                    .on("click", function (d: any) { });

                //  Legend Text
                d3.select(n[i])
                    .append("text")
                    .attr("x", function (b) {
                        let left =
                            (i + 1) * 15 + (i + 1) * 18 + (i + 1) * 5 + textWidthHolder;

                        return left;
                    })
                    .attr("y", 6)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .text(d.Name);

                textWidthHolder += local.getTextWidth(d.Name, "10px", "calibri");
            });
        // d3.selectAll(legend._groups[0]).each(function() {
        //  var el = this;
        //  d3.select(".legendHolder")
        //    .insert("g")
        //    .attr("class", "wrapped")
        //    .append(function() { return el; });
        // });

        // Legend Placing

        svgParent.select(".legendHolder").attr("transform", function (d: any, i: any, n: any) {
            let thisWidth = d3.select(n[i]).node().getBBox().width;
            return "translate(" + ((width / 2) - (thisWidth / 3)) + ",0)";
        });

    }



}