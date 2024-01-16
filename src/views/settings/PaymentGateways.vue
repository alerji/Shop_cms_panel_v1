<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>درگاه های پرداخت</strong>

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

              <template #وضعیت="{item}">
                <td>
                  <p class="text-muted">{{item.status==0 ? 'غیرفعال' : 'فعال'}}</p>
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
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>
<!--                  <CButton-->
<!--                      color="danger"-->
<!--                      variant="outline"-->
<!--                      square-->
<!--                      size="sm"-->
<!--                      @click="delete_item_dialog(item)"-->
<!--                  >حذف-->
<!--                  </CButton>-->
                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol col="4" v-if="status_form!=0">
        <CCard>
          <CCardHeader>
            <strong>درگاه پرداخت</strong>
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
                <CInput
                    v-model="merchant"
                    label="مرچنت یا شناسه درگاه"

                />
              </CCol>
              <CCol col="12">
                <CSelect
                    :value.sync="status"
                    label="وضعیت درگاه"

                    :options="[{label:'فعال',value:1},{label:'غیر فعال',value:0}]"
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
              ویرایش
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
      merchant:'',
      multipy:1,
      status:1,
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {key: 'تصویر', _style: 'width:10%;'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'وضعیت', _style: 'width:10%'},
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
      this.merchant = item.merchant_id;
      this.multipy = item.multipy;
      this.status = item.status;
      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
var formData = new FormData();
formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/site/get_gateway',formData, {}).then(function (response) {

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
        url = "/api/admin/site/insert_gateway";
      } else {
        url = "/api/admin/site/update_gateway";
        formData.append('id', this.status_form)

      }

      formData.append('image', this.file);

      formData.append('name', this.name);
      formData.append('merchant', this.merchant);
      formData.append('multipy', this.multipy);
      formData.append('status', this.status);
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
      url = "/api/admin/site/delete_gateway";


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
