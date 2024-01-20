<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>تنظیمات قالب</strong>
<CButton
color="primary" size="sm" @click="login()">
  ذخیره
</CButton>
          </CCardHeader>
          <CCardBody v-if="full_load">
            <CTabs>
              <CTab v-for="(temp,index) in template_settings.config" :title="temp.title" :key="'ww'+index">
                <CRow>
                  <CCol v-for="item in temp.items" col="6">
                    <ImageSelector
                        v-if="item.type=='image'"
                        :label="item.title"
                        :base-url="settings.filter(x => x.setting_key == 'db_url')[0].setting_value"
                        :base64.sync="item.file"
                        :preview-image="item.value"
                    />
                    <CInput
                        v-if="item.type=='image'"
                        label="لینک"
                        v-model="item.url"
                    />
                    <CTextarea
                        v-if="item.type=='html'"
                        :label="item.title"
                        v-model="item.value"
                    />
                    <CInput
                        type="color"
                        v-if="item.type=='color'"
                        :label="item.title"
                        v-model="item.value"
                    />
                  </CCol>
                </CRow>
              </CTab>
            </CTabs>
          </CCardBody>

        </CCard>
      </CCol>
    </CRow>


  </div>

</template>

<script>
import axios from "axios";

import {bus} from '../../main';


export default {
  name: 'Login',
  data() {
    return {
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,
      settings: {},
      template_settings: {},
      file:null,
      full_load: false
    }
  }, mounted() {
    this.get_settings();

  }, watch: {},
  methods: {

    get_settings() {
      var self = this;
      var formData = new FormData();
      formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/site/get_settings', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.settings = content_cats.settings
        self.get_template()
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_template() {
      var self = this
      // this.posts = await axios.post('get_market_config').then(res => res.json())
      fetch(
          this.settings.filter(x => x.setting_key == "site_url")[0].setting_value + '/config/config.tmp.json',
          {
            method: "GET",
          }).then(res => res.json()).then(function (data) {

        self.template_settings = data
        try{
         let json_setting = JSON.parse(self.settings.filter(x => x.setting_key == "template_config")[0].setting_value)

          if(json_setting.version == self.template_settings.version &&
              json_setting.theme == self.template_settings.theme
          ){

            self.template_settings = json_setting
          }
        }catch (e) {
console.log("faild",e)
        }
        self.full_load = true
      })
          .catch(function (res) {
            console.log(res)
          })


    },
    login() {


      let self = this;
      const formData = new FormData()
      let url;
        url = "/api/admin/site/update_template_settings";


      formData.append('config', JSON.stringify(this.template_settings));

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);


          // self.get_template();

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
