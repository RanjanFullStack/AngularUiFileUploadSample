import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare let d3: any;

@Component({
    selector: 'chart',
    //template:'<div width="100%"><nvd3 [options]="options" [data]="data"></nvd3></div>',
    //// include original styles
    ////styleUrls: [
    ////    'node_modules/nvd3/build/nv.d3.css'
    ////],
    templateUrl: './chart.html',
    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit {
    options: any;
    data: any;
    dataLine: any;
    optionsLine: any;
    ngOnInit() {
        /******** Bar chart************/
        this.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d :any) { return d.label; },
                y: function (d: any) { return d.value; },
                showValues: true,
                valueFormat: function (d: any) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        }
        this.data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label": "A",
                        "value": 29.765957771107
                    },
                    {
                        "label": "B",
                        "value": 0
                    },
                    {
                        "label": "C",
                        "value": 32.807804682612
                    },
                    {
                        "label": "D",
                        "value": 196.45946739256
                    },
                    {
                        "label": "E",
                        "value": 0.19434030906893
                    },
                    {
                        "label": "F",
                        "value": 98.079782601442
                    },
                    {
                        "label": "G",
                        "value": 13.925743130903
                    },
                    {
                        "label": "H",
                        "value": 5.1387322875705
                    }
                ]
            }
        ];


         
 
        this.optionsLine = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function (d :any) {
                        return d.key;
                    },
                    y: function (d: any) {
                        return d.y;
                    },
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

        this.dataLine = [
                {
                    key: "P60-1",
                    y: 256
                },
                {
                    key: "P60-2",
                    y: 445
                },
                {
                    key: "P40",
                    y: 225
                },
                {
                    key: "P73",
                    y: 127
                },
                {
                    key: "P71",
                    y: 128
                }
            ];
    
    }

}