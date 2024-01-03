import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import axios from 'axios'
import Vuex from 'vuex'
import i18n from './i18n'

import Vueditor from 'vueditor'
import ImageSelector from "./views/includes/ImageSelector";
Vue.component('ImageSelector', ImageSelector);

import 'vueditor/dist/style/vueditor.min.css'


// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.interceptors.request.use((config) => {
  // trigger 'loading=true' event here

  bus.$emit("show_spinner", 'true');

  return config;
}, (error) => {
  // trigger 'loading=false' event here
  console.log("axios false");
  bus.$emit("show_spinner", 'false');

  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  // trigger 'loading=false' event here
  bus.$emit("show_spinner", 'false');

  return response;
}, (error) => {
  // trigger 'loading=false' event here
  bus.$emit("show_spinner", 'false');

  return Promise.reject(error);
});
Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

Vue.use(Vuex);
Vue.use(Vueditor);
Vue.mixin({


      methods: {
        get_currency(number) {
          number = number.toString().replace(/,/g, '');

          var fixed = parseInt(localStorage.getItem('currency_digits'));
          var final_number = parseFloat(number);
          number = final_number.toFixed(fixed);
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        get_currency_no_fix(number) {
          var final_number = parseFloat(number);

          number = final_number;
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        get_currency_int(number) {
          var final_number = parseInt(number);

          number = final_number
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        currency_symbol() {
          if (localStorage.getItem('currency_symbol') == null || localStorage.getItem('currency_symbol') == 'null') {
            return "";
          } else {
            return " " + localStorage.getItem('currency_symbol') + " "
          }
        },
        calculate_items(list, item) {

          var total = 0;

          // try{
          list.forEach(function (val) {
            if (val[item] != null) {
              val[item] = val[item].toString().replace(/,/g, '');
              total += parseFloat(val[item]);
            }

          })
          return total;
          // }catch(e){
          //     return total;
          // }

        },
        get_date(date) {
          var date_format = localStorage.getItem('setting_date_format');
          var final_date = "";
          if (i18n.locale == "fa") {
            date_format = date_format.replace("YYYY", 'jYYYY')
            date_format = date_format.replace("MM", 'jMM')
            date_format = date_format.replace("DD", 'jDD')
            final_date = moment(date).locale('fa').format(date_format);
          } else {
            final_date = moment(date).locale('en').format(date_format);
          }
          if (final_date == "Invalid date") {
            final_date = date;
          }
          return final_date;

        },
        get_date_time(date) {
          var date_format = localStorage.getItem('setting_date_format');
          var final_date = "";
          if (i18n.locale == "fa") {
            date_format = date_format.replace("YYYY", 'jYYYY')
            date_format = date_format.replace("MM", 'jMM')
            date_format = date_format.replace("DD", 'jDD')
            final_date = moment(date).locale('fa').format(date_format);
          } else {
            final_date = moment(date).locale('en').format(date_format);
          }
          if (final_date == "Invalid date") {
            final_date = date;
          }
          return final_date + " " + moment(date).format('HH:mm');

        },
       get_logo() {
          return localStorage.getItem('app_logo');
        },

        my_branch_code() {
          return localStorage.getItem('branchCode');
        },
        get_user_name() {
          return localStorage.getItem("user_name");
        },

        get_today() {
          if (i18n.locale == "fa") {
            return moment().locale('fa').format('YYYY-MM-DD');
          } else {
            return moment().locale('en').format('YYYY-MM-DD');
          }
        },

        get_day_before_today(month) {
          if (i18n.locale == "fa") {
            return moment().subtract(month, 'month').locale('fa').format('YYYY-MM-01');
          } else {
            return moment().subtract(month, 'month').locale('en').format('YYYY-MM-01');
          }
        },
        get_day_before_today_in_day(day) {
          if (i18n.locale == "fa") {
            return moment().subtract(day, 'day').locale('fa').format('YYYY-MM-DD');
          } else {
            return moment().subtract(day, 'day').locale('en').format('YYYY-MM-DD');
          }
        },
        get_access(access) {
          return JSON.parse(localStorage.getItem("config_permissions"))[access];
        },
        has_permission(access) {
          let permissions = localStorage.getItem("permissions");
          return permissions.includes(access);

        },
        isEnglish(e) {
          let char = String.fromCharCode(e.keyCode); // Get the character
          if (/^[A-Za-z0-9 ]+$/.test(char)) return true; // Match with regex
          else e.preventDefault(); // If not match, don't add to input text
        },
        isNumber(e) {
          let char = String.fromCharCode(e.keyCode); // Get the character
          if (/^[0-9]+$/.test(char)) return true; // Match with regex
          else e.preventDefault(); // If not match, don't add to input text
        },
        isDecimal(e) {
          let char = String.fromCharCode(e.keyCode); // Get the character
          if (/^[0-9.]+$/.test(char)) return true; // Match with regex
          else e.preventDefault(); // If not match, don't add to input text
        },
        isDecimal2(e, price) {

          let char = String.fromCharCode(e.keyCode); // Get the character
          if (char == "." && price.toString().includes('.')) {
            e.preventDefault();
          }
          var fixed = parseInt(localStorage.getItem('currency_digits'));
          var price_array = price.toString().split(".");
          if (price_array[1] != null && fixed == price_array[1].length) {
            e.preventDefault();
          }
          if (/^[0-9.]+$/.test(char)) return true; // Match with regex
          else e.preventDefault(); // If not match, don't add to input text
        },
        isDecimal_no_fix(e, price) {
          try {
            let char = String.fromCharCode(e.keyCode); // Get the character
            if (char == "." && price.toString().includes('.')) {
              e.preventDefault();
            }
            var fixed = 7;
            var price_array = price.toString().split(".");
            if (price_array[1] != null && fixed == price_array[1].length) {
              e.preventDefault();
            }
            if (/^[0-9.]+$/.test(char)) return true; // Match with regex
            else e.preventDefault(); // If not match, don't add to input text
          } catch (e) {

          }

        },
        sort_array(fabric_array, unsorted, id_key, label_key) {
          var tmpAry = new Array();

          for (var i = 0; i < unsorted.length; i++) {
            // tmpAry[i] = {value:unsorted[i][id_key],label:unsorted[i][label_key]}
            tmpAry[i] = unsorted[i];
            tmpAry[i].value = unsorted[i][id_key];
            tmpAry[i].label = unsorted[i][label_key];

          }
          // console.log(tmpAry)
          tmpAry.sort((a, b) => a.label.localeCompare(b.label, undefined, {numeric: true, sensitivity: 'base'}));

          fabric_array.push(...tmpAry)
          return fabric_array;

        },

      }
    }
);

export const bus = new Vue();
new Vue({
  el: '#app',
  router,
  store,
  icons,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
