<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>کد های تخفیف</strong>

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



              <template #amount="{item,index}">
                <td>
                  <p>{{get_currency(item.amount)}}</p>
                </td>
              </template>
              <template #expire_date="{item,index}">
                <td>
                  <p>{{get_date(item.expire_date)}}</p>
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
            <strong>ثبت کد تخفیف</strong>
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
                    v-model="code"

                    label="کد تخفیف"
                />
              </CCol>
              <CCol col="12">
                <CInputCurrency
                    v-model="amount"

                    label="مقدار تخفیف"
                >
                  <template #prepend>
                    <CSelect
                        :options="[{label:'مبلغ',value:0},{label:'درصد',value:1}]"
                        :value.sync="is_percent"
                    />
                  </template>
                </CInputCurrency>

              </CCol>
              <CCol col="12" >
                <CInput v-if="is_percent==1"
                    v-model="max_amount"
description="0 به معنی عدم محدودیت است"
                    label="سقف تخفیف"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="max_usage"
                    description="0 به معنی عدم محدودیت است"
                    label="سقف تعداد استفاده"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="description"

                    label="توضیحات"
                />
              </CCol>
              <CCol col="12">
                <date-picker
                    v-model="expire_date"

                    label="زمان انقضا"
                />
              </CCol>

              <CCol col="12" style="display: inline-flex;align-self: center; gap: 10px;">
                <CSwitch
                    color="success"
                    shape="pill"
                    :checked.sync="first_buy"
                />
                <label>فقط خرید اول</label>

              </CCol>
              <CCol col="12" style="display: inline-flex;align-self: center;gap: 10px;">
                <CSwitch
                    shape="pill"
                    color="success"
                    :checked.sync="user_limit"

                />
                <label>محدود به شخص</label>

              </CCol>

              <CCol col="12">

                <treeselect
                    v-if="user_limit"
                    v-model="sms_to_admins"
                    :multiple="true"
                    :async="async_search_admin"
                    :options="admins_options"
                    :load-options="load_users"
                    placeholder="انتخاب مشتری"
                    :normalizer="normalizer_admins"
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
            <CButton v-if="status_form!=0"
                @click="login()"
                     class="mx-1"
                type="submit" ref="submit_form" size="sm" color="warning">
              ویرایش
            </CButton>
            <CButton v-if="status_form!=0"
                @click="reset_form()"
                type="submit" ref="submit_form" size="sm" color="warning">
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
      code: '',
      amount: '',
      is_percent: 0,
      max_amount: '0',
      max_usage: '0',
      expire_date: '',
      first_buy: false,
      user_limit: false,
      description: '',

      async_search_admin: true,

      items: [],
      sms_to_admins: [],
      admins_options: [],
      fields: [
        {key: 'title', label: 'عنوان', _style: 'width:20%'},
        {key: 'code', label: 'کد', _style: 'width:10%'},
        {key: 'amount', label: 'مقدار', _style: 'width:20%'},
        {key: 'expire_date', label: 'انقضا', _style: 'width:20%'},
        {key: 'عملیات', _style: 'width:15%;'},
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
    load_users({action, searchQuery, callback}) {

      if (action === ASYNC_SEARCH) {
        simulateAsyncOperation(() => {
          let options;
          var formData = new FormData();
          formData.append('search', searchQuery);
          axios.post('/api/admin/user/search-user', formData, {}).then(function (response) {
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

      this.name = item.title;
      this.code = item.code;
      this.amount = item.amount;
      this.max_amount = item.max_amount;
      this.max_usage = item.max_usage;
      this.expire_date = item.expire_date;
      this.description = item.description;
      this.is_percent = parseInt(item.is_percent);
      var first_buy =false;
      if(item.first_buy==1){
        first_buy =true;
      }
      var user_limit =false;
      if(item.limit_user==1){
        user_limit = true;
      }
      this.user_limit = user_limit
      this.first_buy = first_buy
      this.sms_to_admins = []

      item.users.forEach(function (val){
        self.async_search_admin = false
        self.sms_to_admins.push(val.user_id);
        self.admins_options.push({id:val.user.id,name:val.user.name,phone:val.user.phone})
        setTimeout(function (){
          self.async_search_admin = true

        },200)
      })
      this.status_form = item.id;

    },
    reset_form() {
      var self = this;

      this.name = "";
      this.code = "";
      this.amount = "";
      this.max_amount = "0";
      this.max_usage = "0";

      this.description = "";



      this.status_form = 0;

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append('cat_id', this.$route.params.cat_id)
      axios.post('/api/admin/order/get_off_coupon', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.orders

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
        url = "/api/admin/order/insert_off_coupon";
      } else {
        url = "/api/admin/order/update_off_coupon";
        formData.append('id', this.status_form)

      }
      var first_buy =0;
      if(this.first_buy){
        first_buy =1;
      }
      var user_limit =0;
      if(this.user_limit){
        user_limit =1;
      }

      formData.append('name', this.name);
      formData.append('code', this.code);
      formData.append('amount', this.amount);
      formData.append('is_percent', this.is_percent);
      formData.append('max_amount', this.max_amount);
      formData.append('max_usage', this.max_usage);
      formData.append('description', this.description);
      formData.append('expire_date', this.expire_date);
      formData.append('first_buy', first_buy);
      formData.append('user_limit', user_limit);
      formData.append('users', JSON.stringify(this.sms_to_admins));
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
      url = "/api/admin/order/delete_off_coupon";


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
