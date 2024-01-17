<template>
  <div style="height: 300px">
    <canvas  width="400" height="100"  :id="random_id"></canvas>

  </div>

</template>

<script>

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
import 'chartjs-top-round-bar';


export default {
  name: 'NewChartJ',
  components: {

  },
  props:{
    info:Array,
    type:String,
  },
  data(){
    return{
      random_id:new Date().getTime()+"_"+this.$vnode.tag,
      labels:[],
    }
  },
  mounted() {
    const ctx = document.getElementById(this.random_id);
var self = this

    // new Chart('barChart',
    //     {
    //       type: 'roundedBar', data: { labels: ['label 1'], datasets: [{label: 'Label 1', data}]}, options: { barRoundness: 0.3}
    //
    // });
    new Chart(ctx, {
      type: 'roundedBar',

      data: {
        labels: self.defaultLabels,
        datasets: self.defaultDatasets
      },
      options: {
        responsive: true,
        barRoundness:0.8,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: true,
              display: false

            },
          }],
          yAxes: [{
            ticks: {
              beginAtZero: false,
            },
            gridLines: {
              borderDash: [2, 4],
              color: 'rgba(105,105,105,0.34)',
              drawOnChartArea: true,

              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 5,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    });

  },
  computed: {
    defaultLabels(){
      var self = this
    return   this.info.map(function (obj) {
      return self.get_date(obj.date)
    })
    },
    defaultDatasets () {
      const brandInfo = '#3399ff'
      const data1 = []

      this.info.forEach(function (val){
        data1.push(val.daily)
      })

      return [
        {
          label: 'فروش ',
          backgroundColor: brandInfo,
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          borderRadius: 6,
          data: data1,
          borderSkipped: false,
          barPercentage: 0.6,

          categoryPercentage: 0.5
        },
        // {
        //   label: 'My Second dataset',
        //   backgroundColor: 'transparent',
        //   borderColor: brandSuccess,
        //   pointHoverBackgroundColor: brandSuccess,
        //   borderWidth: 2,
        //   data: data2
        // },
        // {
        //   label: 'My Third dataset',
        //   backgroundColor: 'transparent',
        //   borderColor: brandDanger,
        //   pointHoverBackgroundColor: brandDanger,
        //   borderWidth: 1,
        //   borderDash: [8, 5],
        //   data: data3
        // }
      ]
    },


  }
}
</script>
