<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>روش های ارسال</strong>

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

              <template #title="{item}">

                <td>
                  <p class="text-muted">{{ item.title }}</p>

                </td>

              </template>

              <template #image="{item}">


                <td>
                  <CImg width="50px" height="50px" v-bind:src="item.image"/>
                </td>

              </template>

              <template #price="{item}">
                <td>
                  <p class="text-muted">{{ get_currency(item.price) }}</p>
                </td>
              </template>
              <template #status="{item}">
                <td>
                  <p v-if="item.status==1" class="text-muted">فعال</p>
                  <p v-if="item.status==0" class="text-muted">غیر فعال</p>
                </td>
              </template>
              <template #summary="{item}">
                <td>
                  <p class="text-muted">{{ item.description }}</p>
                </td>
              </template>

              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
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
            <strong>ثبت روش ارسال</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"
                    class="required"

                    label="عنوان"
                />
              </CCol>
              <CCol col="12">
                <CTextarea
                    v-model="description"
                    label="توضیحات"
                    class="required"

                    rows="2"
                />
              </CCol>
              <CCol col="12">
                <CInputCurrency
                    v-model="price"
                    label="قیمت"
                    description="قیمت 0 رایگان می باشد"
                />
              </CCol>
              <CCol>
                <CSelect
                    :options="[{label:'فعال',value:1},{label:'غیرفعال',value:0}]"

                    :value.sync="selected_status"
                    label="انتخاب وضعیت"
                />
              </CCol>
              <CCol col="12">

                <ImageSelector label="تصویر"
                               class="required"

                               :media_id.sync="file"
                               default_archive="order_shipping"
                               :preview-image="previewImage"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0"
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              ثبت
            </CButton>
            <CButton  v-if="status_form!=0"
                @click="login()"
                type="submit" ref="submit_form" size="sm" class="mx-1" color="primary">
              ویرایش
            </CButton>
            <CButton  v-if="status_form!=0"
                @click="cancel_form()"
                type="submit" ref="submit_form" size="sm" class="mx-1" color="primary">
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
      file: [],
      price: '',
      selected_status: 1,
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {label: 'تصویر',key: 'image', _style: 'width:10%;'},
        {label: 'نام',key: 'title', _style: 'width:20%'},
        {label: 'قیمت',key: 'price', _style: 'width:10%'},
        {label: 'وضعیت',key: 'status', _style: 'width:10%'},
        {label: 'توضیحات',key: 'summary', _style: 'width:20%'},
        {label: 'عملیات',key: 'operation', _style: 'width:15%;'},

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
      this.selected_status = item.status;
      this.previewImage = item.image;
      this.file = [item.image_id];

      this.status_form = item.id;

    },
    cancel_form() {
      this.name = '';
      this.description = '';
      this.previewImage = null;
      this.price = 0;

      this.file = [];
      this.status_form = 0;

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

      formData.append('image', this.file[0]);

      formData.append('name', this.name);
      formData.append('price', this.price);
      formData.append('status', this.selected_status);
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
