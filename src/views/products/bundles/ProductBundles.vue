<template>
  <div>
    <CRow>
      <CCol  col="12 col-sm-8">
        <CCard>
          <CCardHeader>
            لیست خصوصیات
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
                  <p class="text-muted">{{ item.title.title }}</p>

                </td>

              </template>
              <template #code="{item}">

                <td>
                  <p class="text-muted">{{ item.code }}</p>

                </td>

              </template>


              <template #عملیات="{item}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="goSubCategories(item)"
                  >مقادیر خصوصیات
                  </CButton>
                  <CButton
                      color="warning"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      class="mr-1"
                      square
                      size="sm"
                      @click="delete_dialog(item)"
                  ><CIcon name="cil-trash" size="sm"/>
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
            <strong>ثبت خصوصیت</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"
class="required"
                    label="نام خصوصیت"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="code"
                    class="required"

                    label="کد خصوصیت"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="priority"

                    label="اولویت"
                />
              </CCol>
              <CCol col="12">
                <div class="control_wrapper">
                  <div class="required">
                    <label>دسته بندی</label>
                  </div>
                  <treeselect
                      v-model="value_category"
                      :multiple="true"
                      :normalizer="normalizer_category"
:append-to-body="true"
                      :options="options_category"
                      placeholder="دسته بندی محصول را انتخاب کنید"
                  />

                </div>

              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0"
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ویرایش خصوصیت
            </CButton>
            <CButton v-if="status_form!=0"
                     @click="login()"
                     class="mr-1"
                     size="sm" color="warning">
              ویرایش خصوصیت
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
import {bus} from "../../../main";

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {ASYNC_SEARCH} from '@riophae/vue-treeselect'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 200)
}


export default {
  name: 'Login',
  components:{
    Treeselect,

  },
  data() {
    return {
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,
      priority: '1',

      name: '',
      file: '',
      code: '',
      previewImage: '',
      description: '',
      items: [],
      fields: [
        {key: 'row',label: '#', _style: 'width:3%'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'code',label:'کد', _style: 'width:10%'},
        {key: 'priority',label: 'اولویت', _style: 'width:20%'},

        {key: 'عملیات', _style: 'width:30%;'},
      ],
      options_category: [],
      value_category: [],

      normalizer_category(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },

      status_form: 0
    }
  }, mounted() {
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
    this.get_data();
    this.get_categories();

  }, watch: {},
  methods: {

    editDetails(item) {
      var self = this;
      this.name = item.title.title;
      this.code = item.code;
      this.priority = item.priority;
      this.value_category = []
      item.categories.forEach(function (val){
        self.value_category.push(val.category_id)
      })
      this.status_form = item.id;

    },
    cancel_form() {
      var self = this;
      this.name = ''
      this.code =''
      this.priority ='1'
      this.value_category = []

      this.status_form = 0

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_categories_with_children',formData, {}).then(function (response) {

        var content_cats = response.data;

        self.options_category = content_cats.orders;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_data() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_bundles', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.tags.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },

    goSubCategories(item) {
      this.$router.push({path: '/dashboard/products/bundle-items/' + item.id});
    },
    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/add_bundle";
      } else {
        url = "/api/admin/product/update_bundle";
        formData.append('id', this.status_form)

      }

      formData.append('name', this.name);
      formData.append('code', this.code);
      formData.append('priority', this.priority);
      formData.append('cat_list', this.value_category);

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);

        self.status_form = 0;
        self.name = '';
        self.code = '';
        self.priority = '1';
        self.value_category = [];
        self.get_data();

      })

          .catch(function (error) {

            console.log(error);
          });

    },
    delete_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);
      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_bundle";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);

        self.status_form = 0;
        self.get_data();

      })
          .catch(function (error) {

            console.log(error);
          });
    },


  }
}


</script>
