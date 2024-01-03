<template>
    <div>
        <CRow>
            <CCol col="12">
                <CCard>
                    <CCardHeader>
                        <strong>تنظیمات وبسایت</strong>
                        <div class="card-header-actions">
                            <a
                                    href="https://coreui.io/vue/docs/components/form-components"
                                    class="card-header-action"
                                    rel="noreferrer noopener"
                                    target="_blank"
                            >
                                <small class="text-muted"></small>
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                        v-model="title"

                                        label="عنوان سایت"
                                        placeholder="عنوان"
                                        vertical
                                />
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol col="12">
                                <CTextarea
                                        v-model="about_us"

                                        label="درباره ما"

                                />

                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol col="12">
                                <CTextarea
                                        v-model="company_address"

                                        label="آدرس"

                                />

                            </CCol>
                        </CRow>
                        <CCol col="4">
                            <label>تصویر اول</label>


                            <input type="file" id="file1" ref="file1" v-on:change="handleFileUpload(1)"/>


                            <CImg height="150px"
                                  width="150px"
                                  v-model="previewImage1"
                                  v-if="previewImage1" :src="previewImage1"
                            />
                        </CCol>
                        <CCol col="4">
                            <label>تصویر دوم</label>


                            <input type="file" id="file2" ref="file2" v-on:change="handleFileUpload(2)"/>


                            <CImg height="150px"
                                  width="150px"
                                  v-model="previewImage2"
                                  v-if="previewImage2" :src="previewImage2"
                            />
                        </CCol>
                        <CCol col="4">
                            <label>تصویر سوم</label>


                            <input type="file" id="file3" ref="file3" v-on:change="handleFileUpload(3)"/>


                            <CImg height="150px"
                                  width="150px"
                                  v-model="previewImage3"
                                  v-if="previewImage3" :src="previewImage3"
                            />
                        </CCol>
                        <CCol col="4">
                            <label>تصویر چهارم</label>


                            <input type="file" id="file4" ref="file4" v-on:change="handleFileUpload(4)"/>


                            <CImg height="150px"
                                  width="150px"
                                  v-model="previewImage4"
                                  v-if="previewImage4" :src="previewImage4"
                            />
                        </CCol>

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

                title: '',
                about_us: '',
                company_address: '',
                file1: null,
                previewImage1: '',
                file2: null,
                previewImage2: '',
                file3: null,
                previewImage3: '',
                file4: null,
                previewImage4: '',

            }
        },
        mounted() {

            this.get_data();

        }, watch: {},
        methods: {
            handleFileUpload(type) {
                var input;
                var reader;
             if(type==1){
                 this.file1 = this.$refs.file1.files[0];
                  input = event.target;
                 // Ensure that you have a file before attempting to read it
                 if (input.files && input.files[0]) {
                     // create a new FileReader to read this image and convert to base64 format
                      reader = new FileReader();
                     // Define a callback function to run, when FileReader finishes its job
                     reader.onload = (e) => {
                         // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                         // Read image as base64 and set to imageData
                         this.previewImage1 = e.target.result;
                     }
                     // Start the reader job - read file as a data url (base64 format)
                     reader.readAsDataURL(input.files[0]);
                 }
             }if(type==2){
                    this.file2 = this.$refs.file2.files[0];
                     input = event.target;
                    // Ensure that you have a file before attempting to read it
                    if (input.files && input.files[0]) {
                        // create a new FileReader to read this image and convert to base64 format
                         reader = new FileReader();
                        // Define a callback function to run, when FileReader finishes its job
                        reader.onload = (e) => {
                            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                            // Read image as base64 and set to imageData
                            this.previewImage2 = e.target.result;
                        }
                        // Start the reader job - read file as a data url (base64 format)
                        reader.readAsDataURL(input.files[0]);
                    }
             }if(type==3){
                    this.file3 = this.$refs.file3.files[0];
                     input = event.target;
                    // Ensure that you have a file before attempting to read it
                    if (input.files && input.files[0]) {
                        // create a new FileReader to read this image and convert to base64 format
                         reader = new FileReader();
                        // Define a callback function to run, when FileReader finishes its job
                        reader.onload = (e) => {
                            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                            // Read image as base64 and set to imageData
                            this.previewImage3 = e.target.result;
                        }
                        // Start the reader job - read file as a data url (base64 format)
                        reader.readAsDataURL(input.files[0]);
                    }
             }
             if(type==4){
                    this.file4 = this.$refs.file4.files[0];
                     input = event.target;
                    // Ensure that you have a file before attempting to read it
                    if (input.files && input.files[0]) {
                        // create a new FileReader to read this image and convert to base64 format
                         reader = new FileReader();
                        // Define a callback function to run, when FileReader finishes its job
                        reader.onload = (e) => {
                            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                            // Read image as base64 and set to imageData
                            this.previewImage4 = e.target.result;
                        }
                        // Start the reader job - read file as a data url (base64 format)
                        reader.readAsDataURL(input.files[0]);
                    }
             }

            },

            get_data() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/get_settings', {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.title = content_cats.data.site_name;
                    self.company_address = content_cats.data.company_address;
                    self.about_us = content_cats.data.about_us;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },

            login() {


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/update_settings";


                formData.append('site_name', this.title);
                formData.append('company_address', this.company_address);
                formData.append('about_us', this.about_us);
                formData.append('file_1', this.file1);
                formData.append('file_2', this.file2);
                formData.append('file_3', this.file3);
                formData.append('file_4', this.file4);


                // formData.append('is_admin', 1)
                // formData.append('role_group', this.selected_group)
                // formData.append('roles', self.$refs.permissions)
                axios.post(url, formData, {}).then((res) => {
                    console.log(res)
                    self.$root.modal_component.show_api_response_modals(res);


                }).catch(function (error) {
                    self.message = 'Incorrect E-mail or password';
                    self.showMessage = true;
                    console.log(error);
                });

            }
        }
    }


</script>
<style>

</style>
