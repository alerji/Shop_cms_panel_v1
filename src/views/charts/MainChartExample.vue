<template>
  <CChartBar
    :datasets="defaultDatasets"
    :options="defaultOptions"
    :labels="info.map(function (obj) { return get_date(obj.date) })"
  />
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  name: 'MainChartExample',
  components: {
    CChartBar
  },
  props:{
    info:Array,
  },
  data(){
    return{
      labels:[],
    }
  },mounted() {

    },
  computed: {
    defaultDatasets () {
      const brandInfo = getStyle('info') || '#3399ff'

      let elements = 27
      const data1 = []
      const data2 = []
      const data3 = []

      this.info.forEach(function (val){
        data1.push(val.daily)
        data2.push(random(80, 100))
        data3.push(65)

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
    defaultOptions () {
      return {

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
              beginAtZero: true,
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
    }
  }
}
</script>
