<template>
    <div>
        <CRow>
            <CCol col="12">
                <CCard >
                    <CCardHeader>
                        <strong>اطلاعات سایت</strong>

                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol col="4" v-for="lang in languages">
                                <CInput
                                        v-model="site_config.titles.filter(x=>x.lng==lang.id)[0].title"

                                        :label="lang.name"
                                        placeholder="عنوان سایت"
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
                                             :file.sync="logo_file"
                                             :preview-image="site_config.logo"
                              />

                            </CCol>
                          <CCol col="6">
                              <ImageSelector label="ایکون مرورگر (favicon)"
                                             :file.sync="favicon_file"
                                             :preview-image="site_config.favicon"
                              />

                            </CCol>
                        </CRow>



                    </CCardBody>
                    <CCardFooter>
                        <CButton @click="login()" type="submit" ref="submit_form" size="sm"
                                 color="primary">
                            <CIcon name="cil-check-circle"/>
                            بروزرسانی اطلاعات
                        </CButton>

                    </CCardFooter>
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

                site_config:{},
                languages:[],
                currencies:[],
              logo_file:null,
              logo_previewImage:null,
              favicon_file:null,
              favicon_previewImage:null,
            }
        },
        mounted() {

            this.get_data();

        }, watch: {},
        methods: {

            get_data() {
                var self = this;
var formData = new FormData();
                axios.post('/api/admin/site/get_config',formData, {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                  self.site_config =content_cats.configs
                  self.currencies=self.sort_array([],content_cats.currencies,"id","title")
                  self.languages = content_cats.languages

                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },

            login() {


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/site/update_config";


                formData.append('site_config', JSON.stringify(this.site_config));
                formData.append('logo_file',this.logo_file);
                formData.append('favicon_file',this.favicon_file);

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
