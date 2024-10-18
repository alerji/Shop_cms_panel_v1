<template>
  <div>
    <CRow>
      <CCol col="12 col-sm-8">
        <CCard>
          <CCardHeader>
            <strong>لیست دسته بندی</strong>

          </CCardHeader>
          <CCardBody>

            <CDataTableFixed
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">

                <td>
                  <p class="text-muted">{{ item.row_id + 1 }}</p>

                </td>

              </template>
              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.name }}</p>

                </td>

              </template>

              <template #تصویر="{item}">


                <td>
                  <CImg width="50px" height="50px" v-bind:src="item.image"/>
                </td>

              </template>

              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      class="mr-1"
                      @click="$router.push({path:'/dashboard/products/list/'+item.id})"
                  >محصولات
                  </CButton>
                  <CButton
                      color="primary"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="primary"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="goSubCategories(item)"
                  >زیر دسته ها
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="delete_item_dialog(item)"
                  ><CIcon name="cil-trash" size="sm"/>
                  </CButton>
                  <CButton class="m-1"
                           color="info"
                           square
                           title="ترجمه"
                           size="sm"
                           @click="bus.$emit('open_translate_dialog', [[{key:'title',value:'عنوان'},{key:'seo_title',value:'سئو عنوان'}], 'product_category_titles', item.id]);"
                  >
                    <CIcon class="text-white" size="sm" name="cil-translate"/>
                  </CButton>
                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol  col="12 col-sm-4">
        <CCard>
          <CCardHeader>
            <strong>ثبت دسته بندی</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"
class="required"
                    label="نام دسته"
                    placeholder="نام دسته"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="seo_title"
class="required"
                    label="عنوان سئو"
                    placeholder="عنوان سئو"
                />
              </CCol>
              <CCol col="12">
                <CTextarea
                    v-model="description"

                    label="توضیحات دسته"
                    placeholder="توضیحات"

                    rows="4"
                />

              </CCol>
              <CCol col="12">
                <ImageSelector label="تصویر"
                               class="required"

                               :media_id.sync="file"
                               default_archive="product_category"
                               :preview-image="previewImage"
                />

              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>

            <CButton v-if="status_form==0"
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="primary">
              ثبت دسته
            </CButton>

            <CButton v-if="status_form!=0"
                     @click="login()"
                     class="mr-1"
                     size="sm" color="warning">
              ویرایش دسته
            </CButton>
            <CButton v-if="status_form!=0"
                     @click="cancel_form()"
                     class="mr-1"

                     size="sm" color="danger">
              انصراف
            </CButton>
          </CCardFooter>
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
  computed: {
    bus() {
      return bus
    }
  },
  data() {
    return {
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,
      name: '',
      file: [],
      color: '',
      seo_title: '',
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {key: 'row',label: '#', _style: 'width:7%'},
        {key: 'تصویر', _style: 'width:10%;'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'عملیات', _style: 'width:20%;'},
      ],

      status_form: 0,

    }
  }, mounted() {
    this.get_categories();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == "true") {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {
    '$route.params.cat_id': function () {
      this.get_categories();
    }
  },
  methods: {

    cancel_form() {
      this.name = '';
      this.description = '';
      this.previewImage = null;
      this.file = [];

      this.status_form = 0;

    },
    editDetails(item) {
      this.name = item.name;
      this.description = item.description;
      this.seo_title = item.seo_title;
      this.previewImage = item.image;
      this.file = [item.image_id];

      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/product/get_categories',formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.orders.map((item, row_id) => {
          return {...item, row_id}
        })

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goSubCategories(item) {

      this.$router.push({path: '/dashboard/products/category/' + item.id});
    },

    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/insert_category";
      } else {
        url = "/api/admin/product/update_category";
        formData.append('id', this.status_form)

      }

      formData.append('image', this.file[0]);

      formData.append('name', this.name);
      formData.append('seo_title', this.seo_title);
      formData.append('cat', this.$route.params.cat_id);
      formData.append('description', this.description);
      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

        if (res.data.error == 0) {
          self.name = '';
          self.color = '';
          self.description = '';
          self.previewImage = '';
          self.previewImage_header = '';
          self.status_form = 0;
          self.get_categories();
        }

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal(this.$t("warning"), this.$t("deleteMessage"), [this.$t("ok")], this.confirm_delete_name);

      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_category";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {
            console.log(error);
          });
    },
  }
}


</script>
