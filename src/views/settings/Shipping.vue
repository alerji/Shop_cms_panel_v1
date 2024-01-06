<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>روش های ارسال</strong>

          </CCardHeader>
          <CCardBody>

            <CDataTable
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >

              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.title }}</p>

                </td>

              </template>

              <template #تصویر="{item}">


                <td>
                  <CImg width="50px" height="50px" v-bind:src="item.image"/>
                </td>

              </template>

              <template #قیمت="{item}">
                <td>
                  <p class="text-muted">{{ get_currency(item.price) }}</p>
                </td>
              </template>
              <template #توضیحات="{item}">
                <td>
                  <p class="text-muted">{{ item.description }}</p>
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
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="delete_item_dialog(item)"
                  >حذف
                  </CButton>
                </td>
              </template>


            </CDataTable>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>ثبت روش ارسال</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="عنوان"
                />
              </CCol>
              <CCol col="12">
                <CTextarea
                    v-model="description"
                    label="توضیحات"
                    rows="2"
                />
              </CCol>
              <CCol col="12">
                <CInputCurrency
                    v-model="price"
                    label="قیمت"
                />
              </CCol>
              <CCol col="12">
                <ImageSelector label="تصویر"
                               :file.sync="file"
                               :preview-image="previewImage"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              ثبت
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
      price: '',
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {key: 'تصویر', _style: 'width:10%;'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'قیمت', _style: 'width:10%'},
        {key: 'توضیحات', _style: 'width:20%'},
        {key: 'عملیات', _style: 'width:15%;'},

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

    editDetails(item) {
      this.name = item.title;
      this.description = item.description;
      this.price = item.price;
      this.previewImage = item.image;

      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
var formData = new FormData();
formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/order/get_shipping',formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;
        self.items = content_cats.orders
        // console.log("cats is "+items);
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
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
        url = "/api/admin/order/insert_shipping";
      } else {
        url = "/api/admin/order/update_shipping";
        formData.append('id', this.status_form)

      }

      formData.append('image', this.file);

      formData.append('name', this.name);
      formData.append('price', this.price);
      formData.append('description', this.description);
      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

        if (res.data.error == 0) {
          self.name = '';
          self.price = '';
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
      url = "/api/admin/order/delete_shipping";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {
            console.log(error);
          });
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    },
  }
}


</script>
