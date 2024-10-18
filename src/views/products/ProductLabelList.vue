<template>
  <div>
    <CRow>
      <CCol col="8">
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
              <template #رنگ="{item}">
                <td  >
                  <div :style="`background:${item.color}`">
                    {{item.color}}
                  </div>
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

                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>

                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      class="mr-1"

                      size="sm"
                      @click="delete_item_dialog(item)"
                  ><CIcon name="cil-trash" size="sm"/>
                  </CButton>
                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>ثبت لیبل</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"
                    class="required"

                    label="نام"
                    placeholder="نام"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="color"
                    label="رنگ"
                    type="color"
                />

              </CCol>

            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0"
                @click="login()"
                     class="mr-1"
                type="submit" ref="submit_form" size="sm" color="primary">
              ثبت لیبل
            </CButton>
            <CButton v-if="status_form!=0"
                     @click="login()"
                     class="mr-1"
                     size="sm" color="warning">
              ویرایش لیبل
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
  data() {
    return {
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,
      name: '',
      file: null,
      color: '#000000',
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {key: 'row',label: '#', _style: 'width:5%'},
        {key: 'نام', _style: 'width:10%'},
        {key: 'رنگ', _style: 'width:10%;'},
        {key: 'عملیات', _style: 'width:10%;'},

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
      this.name = ''
      this.color = ''
      this.description = ''
      this.previewImage =  ''

      this.status_form = 0

    }, editDetails(item) {
      this.name = item.name;
      this.color = item.color;
      this.description = item.description;
      this.previewImage = item.image;

      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/product/get_label',formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;
        self.items = content_cats.orders.map((item, row_id) => {
          return {...item, row_id}
        })
      })
          .catch(function (error) {

            console.log(error);
          });

    },

    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/insert_label";
      } else {
        url = "/api/admin/product/update_label";
        formData.append('id', this.status_form)

      }

      formData.append('color', this.color);

      formData.append('name', this.name);
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
      url = "/api/admin/product/delete_label";


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
