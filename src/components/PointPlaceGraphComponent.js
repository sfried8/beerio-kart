import { Scatter, mixins } from "vue-chartjs";
import Chart from "chart.js";
import * as ChartAnnotation from "chartjs-plugin-annotation";

const { reactiveProp } = mixins;
export default {
    extends: Scatter,
    mixins: [reactiveProp],
    plugins: [ChartAnnotation],
    mounted() {
        // let caPlugin = ChartAnnotation;
        // caPlugin["id"] = "annotation";
        // Chart.plugins.register(caPlugin);
        Chart.plugins.register(ChartAnnotation);
        this.renderChart(this.chartData, this.options);
    },
    data() {
        return {
            options: {
                plugins: [ChartAnnotation],
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
                        filter: item => !item.text.includes("remove")
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        };
    }
};
