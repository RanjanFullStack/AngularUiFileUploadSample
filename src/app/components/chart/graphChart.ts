import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
// import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import * as topojson from 'topojson';
import { MiscellaneousService } from '../../services/miscellaneous.service';
const HC_exporting = HC_exporting_;
// const mapChart = require('highcharts/modules/map')
// mapChart(Highcharts)
var Highcharts = require('highcharts/highmaps.js'),
    map = require('@highcharts/map-collection/custom/world-continents.geo.json');
// var mapChart = require('highcharts/highmaps.js')
declare var require: any;
@Component({
    selector: 'app-map-chart',
    template: `
<div #divGraphChart ></div>
    `,
})
export class GraphChartComponent implements OnInit, AfterViewChecked {
    @ViewChild('divGraphChart') chartContainer: ElementRef;
    //@Input() data: any[];
    @Input() xField: string;
    @Input() yField: string;
    @Input() unit: string = "";
    @Input() valueSuffix: string = "";
    @Input() colours: Array<string>;
    @Output() mapClicked = new EventEmitter<any>();
    hostElement: any;
    @Input() shrinkSize: boolean = false;
    @Input() restoreWidth: number;
    width: number = 1000;
    height: number = 300;
    svg: any;
    population: any = [];
    countryData: any = [];
    dataClone: any[];
    get data(): any[] {
        // transform value for display
        return this.dataClone;
    }
    @Input()
    set data(data: any[]) {
        let local = this;
        if (data != undefined) {
            this.dataClone = JSON.parse(JSON.stringify(data));
            this.dataClone.forEach(function (val: any) {
                val[local.yField] = local.convertToNumber(val[local.yField]);
            })
        }
    }
    constructor(
        private miscService: MiscellaneousService
    ) { }
    ngOnInit() {
        var local = this;
        this.miscService.getJSON("assets/map-data/world_continent.json").subscribe(data => {
           
            //  local.countryData = data;
            let featureList: any = topojson.feature(data, data.objects.continent);
            local.countryData = featureList.features;
            // local.createChart();
            local.createHighMapChart();
        }, error => console.log(error));
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
            // this.createChart(this.xField, this.yField, this.data);
        }
    }
    createHighMapChart() {
        // mapChart.mapChart(this.chartContainer.nativeElement,)
        var colors_g = ["rgb(30, 80, 170)", "rgb(255, 200, 50)", "rgb(245, 140, 60)", "rgb(70, 190, 245)", "rgb(118, 163, 5)"];
        var geojson = map;
        this.countryData = [
            {
                "hc-key": "na",
                "name": "North America",
                "color": colors_g[0],
                "DBRegion": "Americas",
            },
            {
                "hc-key": "sa",
                "name": "South America",
                "color": colors_g[0],
                "DBRegion": "Americas",
            },
            {
                "hc-key": "oc",
                "name": "Oceania",
                "color": colors_g[1],
                "DBRegion": "Oceania",
            },
            {
                "hc-key": "eu",
                "name": "Europe",
                "color": colors_g[2],
                "DBRegion": "Europe",
            },
            {
                "hc-key": "as",
                "name": "Asia",
                "color": colors_g[3],
                "DBRegion": "Asia",
            },
            {
                "hc-key": "af",
                "name": "Africa",
                "color": colors_g[4],
                "DBRegion": "Africa",
            }
        ]
        var local = this;
        Highcharts.mapChart(this.chartContainer.nativeElement, {
            chart: {
                map: 'custom/world-continents'
            },
            title: {
                text: null
            },
            mapNavigation: {
                enabled: false,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            tooltip: {
                enabled: true,
                formatter: function () {                  
                    
                    let toolTip: string = "<span style='color:" + this.point.color + "'>\u25CF </span><span style='font-weight: 600;'>" + this.point.DBRegion + "</span>"
                    return toolTip;
                }
            },
            series: [{
                data: local.countryData,
                name: 'Region',
                mapData: geojson,
            }],
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                
                                local.mapClicked.emit(event.point.DBRegion);
                                
                            }
                        }
                    }
                }
            },
          
        });
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
    colors(n: any) {
        var colors_g = ["rgb(30, 80, 170)", "rgb(255, 200, 50)", "rgb(245, 140, 60)", "rgb(70, 190, 245)", "rgb(118, 163, 5)"];
        return colors_g[n % colors_g.length];
    }
    createChart() {
        this.hostElement = this.chartContainer.nativeElement;
        var local = this;
        let timestamp = new Date().toString()
        this.divTooltip = d3.select("body").append("div").attr('id', 'divtoolTip' + timestamp).attr("class", "toolTip");
        let dynamicWidth = this.hostElement.clientWidth;
        let dynamicHeight = dynamicWidth * .6;
        var margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = dynamicWidth - margin.left - margin.right,
            height = dynamicHeight - margin.top - margin.bottom;
        var graticule = d3.geoGraticule();
        let regionWiseData: any[] = this.countryData;
        var svg = d3.select(".world-map")
            .append("svg").attr("class", "graticule")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');
        var projection = d3.geoMercator()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 1.5]);
        var path = d3.geoPath().projection(projection);
        //var centroids = regionWiseData.map(function (feature) {
        //    return path.centroid(feature);
        //});
        svg.append("path")
            .datum(graticule)
            .attr("d", path);
        svg.selectAll(".continent")
            .data(regionWiseData)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("title", function (d: any, i: any) {
                return d.properties.continent;
            }).on('mouseover', function (d) {
                local.divTooltip.style("left", d3.event.pageX + 10 + "px");
                local.divTooltip.style("top", d3.event.pageY - 25 + "px");
                local.divTooltip.style("display", "inline-block");
                local.divTooltip.html("<strong>Region: </strong><span class='details'>" + d.properties.continent + "</span>");
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 1);
            })
            .on('mouseout', function (d: any) {
                local.divTooltip.style("display", "none");
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke", "white")
                    .style("stroke-width", 0.3);
            }).on('click', function (d: any) {
                local.mapClicked.emit(d.properties.continent);
                d3.select(".selected-region").text(d.properties.continent);
            }).style("opacity", 0.8).style("fill", function (d: any, i: any) { return local.colors(i); }).style("cursor", "pointer");
        //svg.selectAll(".name").data(centroids)
        //    .enter().append("text")
        //    .attr("x", function (d) { return d[0]; })
        //    .attr("y", function (d) { return d[1]; })
        //    .attr("dy", -7)
        //    .style("fill", "black")
        //    .attr("text-anchor", "middle")
        //    .text(function (d: any, i: any) { return regionWiseData[i].properties.continent; });
    }
}