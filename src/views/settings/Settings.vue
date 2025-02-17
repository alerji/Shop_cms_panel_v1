<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong>اطلاعات سایت</strong>
          </CCardHeader>
          <CCardBody>
            <CTabs>
              <CTab title="اطلاعات سایت">
                <CRow>
                  <CCol col="4" v-for="lang in languages">
                    <CInput
                        v-model="site_config.titles.filter(x=>x.lng==lang.id)[0].title"

                        :label="lang.name"
                        placeholder="عنوان سایت"
                        vertical
                    />
                    <CInput
                        v-model="site_config.titles.filter(x=>x.lng==lang.id)[0].description"

                        :label="lang.description"
                        placeholder="توضیحات سایت"
                        vertical
                    />
                    <CSelect
                        v-model="site_config.titles.filter(x=>x.lng==lang.id)[0].currency_id"

                        :options="currencies"
                        placeholder="ارز"
                        vertical
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol col="6">

                    <ImageSelector label="لوگو"
                                   :media_id.sync="logo_file"
                                   default_archive="site"
                                   :preview-image="site_config.logo"
                    />
                  </CCol>
                  <CCol col="6">

                    <ImageSelector label="ایکون مرورگر (favicon)"
                                   :media_id.sync="favicon_file"
                                   default_archive="site"
                                   :preview-image="site_config.favicon"
                    />
                  </CCol>
                </CRow>
                <hr>
                <CRow>
                  <CCol col="3">
                    <CInput label="درصد ارزش افزوده"
                            v-model="vat"
                    />

                  </CCol>
                  <CCol col="3">
                    <CInput
                        style="direction: ltr"
                        label="کد گوگل انالیتیکس"
                        v-model="google_analytics"
                    />

                  </CCol>
                  <CCol col="3">
                    <CSelect
                        label="زمان کش سایت"
                        :options="[{label:'1 ساعت',value:'1'},
        {label:'2 ساعت',value:'2'},
        {label:'4 ساعت',value:'4'},
        {label:'8 ساعت',value:'8'},
        {label:'12 ساعت',value:'12'},
        {label:'24 ساعت',value:'24'},
        {label:'48 ساعت',value:'48'}]"
                        :value.sync="cache_time"
                    />

                  </CCol>
                </CRow>

                <CButton @click="update_settings()" size="sm"
                         color="primary">
                  <CIcon name="cil-check-circle"/>
                  بروزرسانی اطلاعات
                </CButton>
              </CTab>
              <CTab title="تنظیمات پیامک">
                <CRow>
                  <CCol col="4" v-for="temp in sms_templates">
                    <CInput
                        v-model="temp.value"
                        :label="temp.name"
                        :description="temp.description"
                    />
                  </CCol>

                </CRow>
                <CButton @click="update_template()" size="sm"
                         color="primary">
                  <CIcon name="cil-check-circle"/>
                  بروزرسانی اطلاعات
                </CButton>
              </CTab>
              <CTab title="تنظیمات پرداخت">
                <CRow>
                  <CCol col="4">
                    <CSelect
                        label="روش پرداخت"
                        :options="[{label:'درگاه پرداخت',value:'1'},
        {label:'واریز به حساب',value:'2'},
        ]"
                        :value.sync="payment_type"
                    />
                  </CCol>
                  <CCol col="4">
                    <CSelect
                        label="مهلت پرداخت"
                        :options="[{label:'1 ساعت',value:'1'},
        {label:'2 ساعت',value:'2'},
        {label:'4 ساعت',value:'4'},
        {label:'8 ساعت',value:'8'},
        {label:'12 ساعت',value:'12'},
        {label:'24 ساعت',value:'24'},
        {label:'48 ساعت',value:'48'},
        ]"
                        :value.sync="payment_time"
                    />
                  </CCol>

                  <CCol col="12">
                    <CTextarea
                        label="اطلاعات واریزی"

                        v-model="payment_deposit_info"
                    />
                  </CCol>

                </CRow>
                <CButton @click="update_settings()" size="sm"
                         color="primary">
                  <CIcon name="cil-check-circle"/>
                  بروزرسانی اطلاعات
                </CButton>
              </CTab>
              <CTab title="تنظیمات ترب">
                <CRow>
                  <CCol col="12">
                    <div>
                      لینک api ترب
                    </div>
                    <div>
                      {{ db_url }}api/market/torob/products
                    </div>
                  </CCol>

                </CRow>
              </CTab>
            </CTabs>


          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CCardBody>

    </CCardBody>


  </div>

</template>

<script>
import axios from "axios";


// import the styles

export default {
  name: 'Login',
  components: {},
  data() {

    return {
      payment_type:'',
      payment_time:'',
      payment_deposit_info:'',
      db_url: localStorage.getItem("api_address"),
      site_config: {},
      languages: [],
      vat: "0",
      google_analytics: "",
      cache_time: "",
      currencies: [],
      sms_templates: [],
      logo_file: null,
      logo_previewImage: null,
      favicon_file: null,
      favicon_previewImage: null,
    }
  },
  mounted() {

    this.get_data();

  }, watch: {},
  methods: {

    get_data() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/site/get_config', formData, {}).then(function (response) {
        // console.log("cats is "+response.data.groups);
        // console.log("cats is "+items);

        var content_cats = response.data;
        content_cats.languages.forEach(function (lang) {
          if (content_cats.configs.titles.filter(x => x.lng == lang.id).length == 0) {
            var obj = {}
            Object.assign(obj, content_cats.configs.title)
            obj.lng = lang.id;
            content_cats.configs.titles.push(obj)
          }

        })
        self.site_config = content_cats.configs
        self.currencies = self.sort_array([], content_cats.currencies, "id", "title")
        self.languages = content_cats.languages
        self.sms_templates = content_cats.sms_templates
        self.vat = content_cats.vat
        self.google_analytics = content_cats.google_analytics
        self.cache_time = content_cats.cache_time
        self.payment_type = content_cats.payment_type
        self.payment_time = content_cats.payment_time
        self.payment_deposit_info = content_cats.payment_deposit_info


      })
          .catch(function (error) {

            console.log(error);
          });

    },

    update_settings() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/site/update_config";


      formData.append('site_config', JSON.stringify(this.site_config));
      formData.append('logo_file', this.logo_file);
      formData.append('favicon_file', this.favicon_file);
      formData.append('vat', this.vat);
      formData.append('google_analytics', this.google_analytics);
      formData.append('cache_time', this.cache_time);
      formData.append('payment_type', this.payment_type);
      formData.append('payment_time', this.payment_time);
      formData.append('payment_deposit_info', this.payment_deposit_info);



      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);


      }).catch(function (error) {

        console.log(error);
      });

    },
    update_template() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/site/update_config_sms";


      formData.append('templates', JSON.stringify(this.sms_templates));

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);


      }).catch(function (error) {

        console.log(error);
      });

    }
  }
}


</script>
<style>

</style>
