<template>
  <div class="wrapper">


    <CModal
        :show.sync="translate_dialog"
        :no-close-on-backdrop="true"
        :centered="true"
        :title="$t('translate')"
        color="dark"
    >
      <template #header>
        <h6 class="modal-title">{{$t('translate')}}</h6>
      </template>
      <div v-for="(language,lang_index) in translate_values">
        <CRow>
          <CCol col="12">

            <label class="text-danger" style="text-align:center;font-size: 16px;">{{language.LngId}}</label>
          </CCol>
          <CCol v-for="(field,index) in  language" v-if="index!='LngId'" :key="index">
            <CInput @input="set_translate_value(lang_index,index,...arguments)"
                    v-model="language[index]"
                    :label="translate_fields.filter(x => x.translate_key==index)[0].label"/>
          </CCol>
        </CRow>
        <hr style="margin: 3px;">
      </div>
      <template #footer>
        <CButton @click="confirm_translate"
                 color="danger"
        >{{$t("save")}}
        </CButton>
        <CButton
            @click="translate_dialog = false"
            color="cancel"
        >{{$t("cancel")}}
        </CButton>
      </template>
    </CModal>


  </div>

</template>

<script>
import {bus} from '../../../main';
import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import axios from "axios";

Vue.use(VueToast);
//Vue.$toast.open({/* options */});

export default {
  name: 'Modals',
  data() {
    return {

      languages: [],
      translate_get_api: '',
      translate_add_api: '',
      translate_dialog: false,
      translate_values: [],
      translate_fields: '',
      translate_record_id: 0,
    }
  }, mounted() {
    this.languages = JSON.parse(localStorage.getItem('languages'))
    console.log(this.languages)
    bus.$on('open_translate_dialog', (data) => {
      // alert(data);
      var self = this;
      this.translate_fields = data[0]

      this.translate_get_api = data[1]
      this.translate_add_api = data[2]
      this.translate_record_id = data[3]
      self.translate_values = []
      console.log(this.translate_fields.filter(x => x.translate == true))

      this.languages.forEach(function (lang, index) {
        var obj = {"LngId": lang};
        self.translate_fields.filter(x => x.translate == true).forEach(function (field) {
          var field_key = field.translate_key;
          obj[field_key] = ""

        })
        self.translate_values[index] = obj
      })
      // console.log(self.translate_values)
      self.get_translate()

      // console.log(this.translate_values)
    });
  }, methods: {
    get_translate() {

      let self = this;
      const formData = new FormData();
      let url = '/Lang/' + this.translate_get_api;

      formData.append("id", this.translate_record_id)

      axios.post(url, formData, {}).then((res) => {
        if (res.data.statusCode == 0) {
          self.translate_values.forEach(function (val, lang_index) {
            if (res.data.data.filter(x => x.lngId == val.LngId).length > 0) {
              console.log(val, res.data.data.filter(x => x.lngId == val.LngId)[0])
              Object.keys(val).forEach(function (item) {
                if (item != 'LngId') {
                  var value = res.data.data.filter(x => x.lngId == val.LngId)[0][self.camelize(item.toString())]
                  console.log(item, value)
                  self.set_translate_value(lang_index, item, value)

                }
              })
            }
            console.log("translate not fund", val, lang_index)
          })
          // console.log(self.translate_values)

          self.translate_dialog = true

        }

      }).catch(function (error) {
        console.log(error);
      });

    },

    confirm_translate() {

      let self = this;
      const formData = new FormData();
      let url = '/Lang/' + this.translate_add_api;

      formData.append("recId", this.translate_record_id)
      var send_translate = [];
      this.translate_values.forEach(function (val) {
        var validate = false;
        Object.keys(val).forEach(function (item) {
          if (item != 'LngId') {
            if (val[item] != '') {
              validate = true
            }
          }
        })
        if (validate) {
          send_translate.push(val);
        }
      })
      formData.append("input", JSON.stringify(send_translate))
      // this.translate_fields.filter(x => x.translate == true).forEach(function (val) {
      //     formData.append(val.key, val.translate_value);
      // })
      axios.post(url, formData, {}).then((res) => {
        // self.$root.modal_component.show_api_response_modals(res);

        if (res.data.statusCode == 0) {
          self.translate_dialog = false
        }

      }).catch(function (error) {
        console.log(error);
      });

    },
    set_translate_value(lang_index, index, input) {
      // console.log("$e ",$e,ada,sss)
      var obj = this.translate_values[lang_index]
      obj[index.toString()] = input;
      Vue.set(this.translate_values, lang_index, obj)
      console.log(JSON.stringify(this.translate_values))
    },


    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }
  },


}
</script>