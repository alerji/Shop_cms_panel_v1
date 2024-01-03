<template>
  <div>
    <CRow>
      <CCol col="6">
        <CCard>
          <CCardHeader>
            <strong>ثبت دسته بندی محصولات</strong>
            <div class="card-header-actions">
              <a
                href="https://coreui.io/vue/docs/components/form-components"
                class="card-header-action"
                rel="noreferrer noopener"
                target="_blank"
              >
                <small class="text-muted">دسته اصلی</small>
              </a>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="نام دسته"
                  placeholder="نام دسته"
                />
              </CCol>
            </CRow>
              <CRow>
              <CCol col="12">
                <CInput
                    v-model="seo_title"

                    label="سئو عنوان"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12">
<!--                  <CTextarea-->
<!--                      v-model="description"-->

<!--                      label="توضیحات دسته"-->
<!--                      placeholder="توضیحات"-->
<!--                      horizontal-->
<!--                      rows="4"-->
<!--                  />-->
                  <label>توضیحات دسته</label>
                  <ckeditor
                          v-model="editorData"
                          :editor-url="editorUrl"
                  ></ckeditor>


              </CCol>
            </CRow>
           تصویر محصول
            <CRow>
              <CCol col="4">

                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

                  <CImg height="250px"
                        width="250px"
                        v-model="previewImage"
                        v-if="previewImage" :src="previewImage"
                        />
              </CCol>


            </CRow>
              بنر محصول
            <CRow>
              <CCol col="4">

                  <input type="file" id="file_header" ref="file_header" v-on:change="handleFileUpload_header()"/>

                  <CImg height="250px"
                        width="250px"
                        v-model="previewImage_header"
                        v-if="previewImage_header" :src="previewImage_header"
                        />
              </CCol>


            </CRow>
              <CRow>
                  <CCol col="4">
                      <CInput
                          label="رنگ دسته"
                          type="color" v-model="color" value="#000000"/>

                  </CCol>
              </CRow>
          </CCardBody>
            <CCardFooter>
                <CButton
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/> ثبت دسته</CButton>
            </CCardFooter>
        </CCard>
      </CCol>
    </CRow>

          <CCardBody>

          <CDataTable
              :items="items"
              :fields="fields"

              :items-per-page="20"
              hover
              sorter
              pagination
          >
              <template #ردیف="{item}">

                  <td>
                      <p class="text-muted">{{item.row_id+1}}</p>

                  </td>

              </template>
              <template #نام="{item}">

                  <td>
                      <p class="text-muted">{{item.name}}</p>

                  </td>

              </template>
              <template #سئو-عنوان="{item}">

                  <td>
                      <p class="text-muted">{{item.seo_title}}</p>

                  </td>

              </template>

              <template #توضیحات="{item}">

                  <td>
                      <p class="text-muted">{{item.description}}</p>

                  </td>

              </template>

              <template #رنگ="{item}">

                  <td>
                      <div :style="get_style(item.color)" :color="item.color">
                          {{item.color}}
                      </div>
                  </td>

              </template>

              <template #تصویر="{item}">


                  <td>
                    <CImg width="50px" height="50px" description="سایز 500x500 پیکسل" v-bind:src="item.image"  />
                  </td>

              </template>

              <template #عملیات="{item,index}">
                  <td class="py-2">
                      <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="editDetails(item)"
                      >ویرایش
                      </CButton>
                      <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="goSubCategories(item)"
                      >زیر دسته ها
                      </CButton>
                      <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="goProperties(item)"
                      >خصوصیت ها
                      </CButton>
                      <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="goProducts(item)"
                      >محصولات
                      </CButton>
                  </td>
              </template>



          </CDataTable>
          </CCardBody>


  </div>

</template>

<script>
    import axios from "axios";
    import CKEditor from 'ckeditor4-vue';
    import Vue from "vue";
    import Treeselect from "@riophae/vue-treeselect";
    import VueUploadMultipleImage from "vue-upload-multiple-image";
    Vue.use(CKEditor);

    var items = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:10%' },
        { key: 'نام', _style:'width:10%' },
        { key: 'سئو-عنوان',label: 'سئو عنوان', _style:'width:10%' },
        { key: 'توضیحات', _style:'width:20%' },
        { key: 'رنگ', _style:'width:10%;' },
        { key: 'تصویر', _style:'width:10%;' },
        { key: 'عملیات', _style:'width:40%;' },


    ];


    export default {
        name: 'Login',
        components: {

            ckeditor: CKEditor.component
        },
        data() {
            return {
                editorUrl: "https://furnishium.com/ckeditor/ckeditor.js",
                editorData: '',
                editorConfig: {
                    extraPlugins: [],
                    language: 'fa'
                    // The configuration of the editor.
                },
                name: '',
                seo_title: '',
                file: '',
                color: '',
                previewImage: '',
                file_header: '',

                previewImage_header: '',
                description: '',
                items: items.map((item, row_id) => { return {...item, row_id}}),
                fields,
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
this.get_categories();
        },watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            }
        },
        methods: {
            get_style(color) {
                return {
                        backgroundColor: color

                }
            },
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = item.name
                this.seo_title = item.seo_title
                this.color = item.color
                this.description = item.description
                this.editorData= item.description
                this.previewImage = item.image
                this.previewImage_header = item.header_image
                this.status_form = item.cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_categories(){
               var self = this;

            var formData = new FormData();
            formData.append("cat_id",this.$route.params.cat_id);
                axios.post(  '/api/admin/get_product_categories',formData, {

                }).then(function (response) {
                    console.log("cats is "+response.data.orders);
                    console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.orders.map((item, row_id) => { return {...item, row_id}}),
                        fields;
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
            goRegister(){
                this.$router.push({ path: 'register' });
            },goSubCategories(item){

                this.$router.push({ path: '/dashboard/products/category/'+item.cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            goProperties(item) {

                this.$router.push({path: '/dashboard/products/category-properties/' + item.cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            goProducts(item) {

                this.$router.push({path: '/dashboard/products/list/' + item.cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            handleFileUpload(){
                this.file = this.$refs.file.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.previewImage = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
                },
            handleFileUpload_header(){
                this.file_header = this.$refs.file_header.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.previewImage_header = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
                },
            login() {


                let self = this;
                const formData = new FormData()
                let url;
                if(this.status_form==0){
                    url = "/api/admin/product_category";
                }else{
                    url = "/api/admin/product_category/update";
                    formData.append('cat_id', this.status_form)

                }

                formData.append('image', this.file);
                formData.append('image_header', this.file_header);
                formData.append('name', this.name);
                formData.append('seo_title', this.seo_title);
                formData.append('color', this.color);
                formData.append('cat', this.$route.params.cat_id );
                // formData.append('description', this.description);
                formData.append('description',  this.editorData);

                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res);
self.$root.modal_component.show_api_response_modals(res);

                    if(this.status_form==0){
                        self.name = '';
                        self.seo_title = '';
                        self.color = '';
                        self.description = '';
                        self.previewImage = '';
                        self.previewImage_header = '';
                        self.get_categories();
                    }else{
                        self.status_form=0;
                        self.name = '';
                        self.seo_title = '';
                        self.color = '';
                        self.description = '';
                        self.previewImage = '';
                        self.previewImage_header = '';

                        self.get_categories();
                    }

                })

                // axios.post(  '/admin/category', {
                //     name: self.name,
                //     description: self.description,
                //     image: self.image,
                //     cat: 0,
                // }).then(function (response) {
                //     self.name = '';
                //     self.description = '';
                //     // localStorage.setItem("api_token", response.data.access_token);
                //     // self.$router.push({ path: 'notes' });
                // })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            }
        }
    }


</script>
