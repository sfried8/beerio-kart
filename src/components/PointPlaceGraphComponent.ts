import { Scatter, mixins } from "vue-chartjs";
import Vue from "vue";
const { reactiveProp } = mixins;
export default Vue.extend({
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
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        };
    }
});
