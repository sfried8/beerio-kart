import { Scatter, mixins } from "vue-chartjs";
import Vue from "vue";
import { addNumberEnding } from "@/Util";
const { reactiveProp } = mixins;
const newLegendClickHandler = function(e: any, legendItem: any) {
    var index = legendItem.datasetIndex;
    // @ts-ignore
    let ci = this.chart;

    [
        ci.getDatasetMeta(index),
        ci.getDatasetMeta(index + ci.data.datasets.length / 2)
    ].forEach(function(meta) {
        meta.hidden =
            meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    });
    ci.update();
};

export default Vue.extend({
    props: { courseNames: { type: Array as () => String[][] } },
    extends: Scatter,
    mixins: [reactiveProp],
    mounted() {
        // @ts-ignore
        this.renderChart(this.chartData, this.options);
    },
    data() {
        return {
            options: {
                //Chart.js options
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                min: 12,
                                max: 1,
                                reverse: true,
                                stepSize: 1,
                                suggestedMin: 1,
                                suggestedMax: 12
                            },
                            gridLines: {
                                display: true
                            }
                        }
                    ],
                    xAxes: [
                        {
                            ticks: {
                                suggestedMin: 1
                            },
                            gridLines: {
                                display: true
                            }
                        }
                    ]
                },
                legend: {
                    display: true,
                    labels: {
                        filter: (item: { text: string }) =>
                            !item.text.includes("remove")
                    },
                    onClick: newLegendClickHandler
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    filter: (
                        item: { datasetIndex: number },
                        data: { datasets: any }
                    ) => {
                        return (
                            data.datasets[item.datasetIndex].label !== "remove"
                        );
                    },
                    callbacks: {
                        label: (tooltipItem: any, data: any) => {
                            return `${
                                this.courseNames[tooltipItem.datasetIndex][
                                    tooltipItem.index
                                ]
                            } ${addNumberEnding(tooltipItem.yLabel)} place (${
                                tooltipItem.xLabel
                            } points)`;
                        }
                    }
                }
            }
        };
    }
});
