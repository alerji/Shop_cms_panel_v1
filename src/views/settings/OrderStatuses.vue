<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>وضعیت های سفارش</strong>

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
                  <p class="text-muted">{{ item.title.title }}</p>
                </td>
              </template>

              <template #visible="{item}">
                <td>
                  <p class="text-muted" v-if="item.visible">بله</p>
                  <p class="text-muted" v-else>خیر</p>
                </td>
              </template>

              <template #sms_to_customer="{item}">
                <td>
                  <p class="text-muted" v-if="item.sms_to_customer">بله</p>
                  <p class="text-muted" v-else>خیر</p>
                </td>
              </template>

              <template #admins="{item}">
                <td>
                  <p class="text-muted" v-for="admin in item.admins">{{ admin.user.name }}</p>

                </td>
              </template>


              <template #عملیات="{item,index}">
                <td class="py-2">
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
                      v-if="item.is_default==0"
                      color="danger"
                      class="mr-1"
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
            <strong>ثبت وضعیت</strong>
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
                    type="number"
                    v-model="proccess"

                    label="درصد پیشرفت"
                    description="0 تا 100"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    type="color"
                    v-model="color"

                    label="رنگ"
                />
              </CCol>
              <CCol col="12" style="display: inline-flex;align-self: center; gap: 10px;">
                <CSwitch
                    color="success"
                    shape="pill"
                    :checked.sync="visible_to_customer"
                />
                <label>نمایش به مشتری</label>

              </CCol>
              <CCol col="12" style="display: inline-flex;align-self: center;gap: 10px;">
                <CSwitch
                    shape="pill"
                    color="success"
                    :checked.sync="sms_to_customer"

                />
                <label>ارسال پیامک به مشتری</label>

              </CCol>
              <CCol col="12">
                <CInput
                    v-model="sms_to_customer_code"

                    label="کد قالب پیامک به مشتری"
                />
              </CCol>

              <CCol col="12">

                <treeselect
                    v-model="sms_to_admins"
                    :multiple="true"
                    :async="async_search_admin"
                    :options="admins_options"
                    :load-options="load_admins"
                    placeholder="انتخاب مدیران"
                    :normalizer="normalizer_admins"
                />

              </CCol>
              <CCol col="12">
                <CInput
                    v-model="sms_to_admins_code"

                    label="کد قالب پیامک به مدیران"
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

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {ASYNC_SEARCH} from '@riophae/vue-treeselect'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 200)
}
export default {
  name: 'Login',
  components: {
    Treeselect,
  },
  data() {
    return {
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,
      name: '',
      file: null,
      price: '',
      proccess:'0',
      color:'#ffffff',
      previewImage: null,
      description: '',
      items: [],
      visible_to_customer: true,
      async_search_admin: true,
      sms_to_customer: true,
      sms_to_customer_code: '',
      sms_to_admins_code: '',
      sms_to_admins: [],
      admins_options: [],
      fields: [
        {key: 'title', label: 'عنوان', _style: 'width:7%'},
        {key: 'visible', label: 'نمایش به کاربر', _style: 'width:10%'},
        {key: 'sms_to_customer', label: 'پیامک به کاربر', _style: 'width:10%'},
        {key: 'admins', label: 'مدیران', _style: 'width:30%'},
        {key: 'عملیات', _style: 'width:7%;'},
      ],
      normalizer_admins(node) {
        return {
          id: node.id,
          label: node.name + " " + node.phone,
        }
      },
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
    load_admins({action, searchQuery, callback}) {

      if (action === ASYNC_SEARCH) {
        simulateAsyncOperation(() => {
          let options;
          var formData = new FormData();
          formData.append('search', searchQuery);
          axios.post('/api/admin/user/search-admin', formData, {}).then(function (response) {
            options = response.data;
            callback(null, options);
          })
              .catch(function (error) {
                console.log(error);
              });

        })
      }
    },

    editDetails(item) {
      var self = this;
      this.name = item.title.title;
      this.proccess = item.proccess;
      this.color = item.color;
      var visible =false;
      if(item.visible==1){
        visible =true;
      }
      var send_customer =false;
      if(item.send_sms_to_customer==1){
        send_customer = true;
      }
      this.visible_to_customer = visible
      this.sms_to_customer = send_customer
      this.sms_to_customer_code =item.customer_send_code
      this.sms_to_admins_code = item.admins_send_code
      this.sms_to_admins = []

      item.admins.forEach(function (val){
        self.async_search_admin = false
        self.sms_to_admins.push(val.user_id);
        self.admins_options.push({id:val.user.id,name:val.user.name,phone:val.user.phone})
        setTimeout(function (){
          self.async_search_admin = true

        },200)
      })
      this.status_form = 0;
      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/order/get_order_status', formData, {}).then(function (response) {

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
        url = "/api/admin/order/insert_order_status";
      } else {
        url = "/api/admin/order/update_order_status";
        formData.append('id', this.status_form)

      }
      var visible =0;
      if(this.visible_to_customer){
        visible =1;
      }
      var send_customer =0;
      if(this.sms_to_customer){
        send_customer =1;
      }
      formData.append('name', this.name);
      formData.append('proccess', this.proccess);
      formData.append('color', this.color);
      formData.append('visible_to_customer', visible);
      formData.append('sms_to_customer', send_customer);
      formData.append('sms_to_customer_code', this.sms_to_customer_code);
      formData.append('sms_to_admins_code', this.sms_to_admins_code);
      formData.append('sms_to_admins', JSON.stringify(this.sms_to_admins));
      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

        if (res.data.error == 0) {
          self.name = '';
          self.visible_to_customer = true
          self.sms_to_customer = true
          self.sms_to_customer_code = ''
          self.sms_to_admins_code = ''
          self.sms_to_admins = []
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
      url = "/api/admin/order/delete_order_status";


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
