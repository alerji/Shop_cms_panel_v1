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

import CDataTableFixed from "./views/DataTableFixed/CDataTableFixed";
Vue.component('CDataTableFixed', CDataTableFixed);

import CInputCurrency from "./views/CInputCurrency/CInputCurrency";
Vue.component('CInputCurrency', CInputCurrency);

import CInputText from "./views/CInputText/CInputText";
Vue.component('CInputText', CInputText);

import CLinkSelector from "./views/CLinkSelector/CLinkSelector";
Vue.component('CLinkSelector', CLinkSelector);

import CIconSelector from "./views/CIconSelector/CIconSelector";
Vue.component('CIconSelector', CIconSelector);

import VuePersianDatetimePicker from  'vue-persian-datetime-picker';
Vue.component('date-picker', VuePersianDatetimePicker);

import SeoProgress from "@/views/includes/SeoProgress.vue";
Vue.component('SeoProgress', SeoProgress);
import moment from 'moment-jalaali'

import 'vueditor/dist/style/vueditor.min.css'


import VueHtmlToPaper from './CustomElements/html_paper_print_index';
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes',
  ],
  styles: [
    '/css/bootstrap.min.css',
    '/css/print.css?ver=' + process.env.VUE_APP_VERSION,
  ]
}

Vue.use(VueHtmlToPaper, options);
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.interceptors.request.use((config) => {
  // trigger 'loading=true' event here
if(config.show_pros==null){
  bus.$emit("show_spinner", 'true');

}

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
i18n.locale = 'fa';
var display_time = "";
var start_date = 0;
if (i18n.locale == 'fa') {
  display_time = 'jYYYY/jMM/jDD';
  start_date = 6;
}
if (i18n.locale == 'en') {
  display_time = 'YYYY/MM/DD'

  start_date = 1
}
Vue.use(VuePersianDatetimePicker, {
  props: {
    // min:min_date,
    // max:max_date,
    format: "YYYY-MM-DD",
    inputFormat: 'YYYY-MM-DD',
    displayFormat: display_time,
    editable: true,
    locale: i18n.locale,
    startDate: start_date,
    color: "dimgray",
    altFormat: 'YYYY-MM-DD HH:mm',
    autoSubmit: true,

  }
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

          var fixed = parseInt(0);
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
        },
        calculate_items_percent(list, item,amount) {
          var total = 0;
          // try{
          list.forEach(function (val) {
            if (val[item] != null) {
              val[item] = val[item].toString().replace(/,/g, '');
              total += parseFloat(val[item]);
            }
          })
         return (amount*100)/total;

        },
        print_element(element, title) {
          this.$htmlToPaper(element, title);
        },
        get_date(date) {
          var date_format = "YYYY-MM-DD";
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
          var date_format = "YYYY/MM/DD";
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
          var fixed = parseInt(2);
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

var self = this;
fetch('/x_config.json?ver=' + process.env.VUE_APP_VERSION).then(res => res.json()).then(config => {

  localStorage.setItem("web_address", config.web_address);
  localStorage.setItem("api_address", config.api_address);
  axios.defaults.baseURL = config.api_address;

  // axios.defaults.withCredentials = true;
  create_vue()

})


export const bus = new Vue();


function create_vue() {

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
}
