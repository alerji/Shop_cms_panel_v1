<template>
    <div>
        <div>
            <div style="display: flex">
              <div class="seo-progress-back">
                <div class="seo-progress-bar" :style="`width:${bar_width}%;background:${bar_color};`"></div>
              </div>
              <label style="width: 35px">{{string.length}}</label>
              <label style="width: fit-content">({{min_perfect}} - {{ max_perfect }})</label>
            </div>

        </div>


    </div>
</template>

<script>

    export default {
        name: 'SeoProgress',
       components: {},
        props: {
          string: String,
          min_perfect: Number,
          max_perfect: Number,
        },
        data() {
            return {
              model: '',

            }
        },
      watch:{
        'model':function (){
        }
      },
        computed: {
          bar_width(){
            const value = (this.string.length *100) / this.max_perfect;
            if(value>100){
              return 100;
            }
            return value;
          },
          bar_color(){
            if(this.string.length< this.min_perfect){
              return "#ffcc00"
            }
            if(this.string.length>= this.min_perfect && this.string.length<= this.max_perfect){
              return "#10b981"
            }
            if(this.string.length> this.max_perfect ){
              return "#ef376e"
            }
            return "#c7c50b"

          }
        },
        mounted() {

        },
        methods: {

        },


    }
</script>
<style>
.seo-progress-back{
  height: 5px;
  border-radius: 5px;
  background: white;
  width: 70%;

}
.seo-progress-bar{
  height: 5px;
  border-radius: 5px;
}
</style>