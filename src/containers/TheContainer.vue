
<template>

    <div class="c-app">

        <TheSidebar/>
    <CWrapper>

      <TheHeader/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>

              <Modals ref="modal2"/>
              <Loading ref="loading_component"/>

              <transition name="fade">
              <router-view ref="root_view">

              </router-view>

            </transition>

          </CContainer>
        </main>
        <TheFooter/>
      </div>
    </CWrapper>
  </div>

</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import Modals from "../views/includes/Modals";
import Loading from "../views/includes/LoadingPage";
import Vue from "vue";
import axios from "axios";
export const modal2 = null;
// Vue.use(Loading)
//
// // overwrite defaults
// Vue.use(Loading, {
//     dark: true, // default false
//     text: 'Ladataan', // default 'Loading'
//     loading: true, // default false
//     background: 'rgb(255,255,255)', // set custom background
//     classes: ['myclass'] // array, object or string
// })
export default {
  name: 'TheContainer',
    props: {

},
    data() {
        return {
             modals2: '',

        }
    },components: {
      Modals,
      Loading,
    TheSidebar,
    TheHeader,
    TheFooter,
  },methods:{

    }
  ,mounted() {
       this.$root.modal_component = this.$refs.modal2;
       this.$root.loading_component = this.$refs.loading_component;
       // this.modal2 = this.$refs.modal2;
       // this.loading = this.$refs.loading;
       // this.modals2 = this.$refs.modal2;
       //  this.$root.loading_component.loading = true;
       // this.$refs.modal2.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');
// this.get_categories();
//         console.log(this.modal2.title2);
//         console.log(this.modals2.title2+" export");

        //If i console log this.$refs.loading i got my component
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
