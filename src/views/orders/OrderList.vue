<template>
  <keep-alive>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <strong>
          لیست سفارشات
        </strong>

      </CCardHeader>

      <CCardBody class="">
        <CRow v-if="user_data!=null">
          <CCol col="6 col-sm-3">
            نام:
            {{ user_data.name }}
          </CCol>
          <CCol col="6 col-sm-3">
            موبایل:
            {{ user_data.phone }}

          </CCol>
          <CCol col="6 col-sm-3">
            کیف پول:
            {{ user_data.credit ? get_currency(user_data.credit.balance) : '0' }}
            تومان
          </CCol>

          <CCol  col="6 col-sm-3">
            <CInput v-model="credit_price"/>
            <CButton color="info"
                     @click="increase_credit()">افزایش اعتبار</CButton>
            <CButton color="info"
                     @click="decrease_credit()">کاهش اعتبار</CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <date-picker v-model="start_date" label="از تاریخ"/>
          </CCol>
          <CCol>
            <date-picker v-model="end_date" label="تا تاریخ"/>
          </CCol>
          <CCol>
            <CButton color="primary" @click="get_news()">
              <CIcon size="sm" name="cil-zoom"/>
            </CButton>
          </CCol>
        </CRow>
        <br>
        <CTabs>

          <CTab :title="status.title.title+ ' ('+items.filter(x=>x.statuses[0].id==status.id).length+')'"
                v-for="(status,index) in items_status" :key="'title-'+index">
            <CDataTableFixed
                :items="items.filter(x=>x.statuses[0].id==status.id)"
                :fields="fields"
                column-filter
                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item,index}">
                <td>
                  <p class="text-muted">{{ index + 1 }}</p>
                </td>
              </template>

              <template #date="{item}">
                <td>
                  <p class="text-muted">{{ get_date_time(item.date) }}</p>
                </td>
              </template>
              <template #user="{item}">
                <td>
                  <p class="text-muted">{{ (item.user) }}</p>
                </td>
              </template>

              <template #user_mobile="{item}">
                <td>
                  <p class="text-muted">{{ (item.user_mobile) }}</p>
                </td>
              </template>

              <template #total_price="{item}">
                <td>
                  <p class="text-muted">{{ get_currency(item.total_price) }}</p>
                </td>
              </template>


              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goRegister(item)"
                  >
                    <CIcon name="eye" size="sm"/>
                  </CButton>

                </td>
              </template>


            </CDataTableFixed>
          </CTab>

        </CTabs>
      </CCardBody>
    </CCard>


  </div>
  </keep-alive>
</template>

<script>
import axios from "axios";
import {bus} from "../../main";


export default {
  name: 'Login',
  components: {
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      start_date: '',
      end_date: '',
      credit_price: 0,

      delete_tag: new Date() + "_delete_confirm",
      edit_row: null,
      edit_flag: false,
      edit_product_weight: '',
      name: '',
      product_weight: null,
      items_tags: [],
      items_tags_title: null,
      items_tags_id: 1,
      edit_items_tags_id: 0,
      product_weight_id: 1,
      edit_product_weight_id: 0,
      productId: null,
      file: '',
      color: '',
      weightModal: false,
      previewImage: '',
      description: '',
      weights: null,
      fields: [
        {key: 'row', label: '#', _style: 'width:3%'},
        {key: 'date', label: 'تاریخ ثبت', _style: 'width:10%;'},

        {key: 'id', label: 'شماره سفارش', _style: 'width:10%'},
        {key: 'user', label: 'مشتری', _style: 'width:10%'},
        {key: 'user_mobile', label: 'موبایل', _style: 'width:10%'},
        {key: 'total_price', label: 'مبلغ', _style: 'width:10%;'},
        {key: 'operation', label: 'عملیات', _style: 'width:10%;'},

      ],
      items_status: [],
      items: [],
      user_data: null,
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {
    this.start_date = this.get_day_before_today_in_day(7)
    this.end_date = this.get_today()
    this.get_statuses();

  },
  watch: {
    '$route.params.cat_id': function (id) {
      this.get_categories();
    },


  },
  methods: {
    increase_credit() {
      var self = this;
      var formData = new FormData();
      formData.append("price", this.credit_price);
      formData.append("user_id", this.$route.params.customer_id);

      axios.post('/api/admin/user/update_credit',formData, {}).then(function (response) {
        self.get_news();
      }).catch(function (error) {
        console.log(error);
      });

    },
    decrease_credit() {
      var self = this;
      var formData = new FormData();
      formData.append("price", this.credit_price*-1);
      formData.append("user_id", this.$route.params.customer_id);

      axios.post('/api/admin/user/update_credit',formData, {}).then(function (response) {
        self.get_news();
      }).catch(function (error) {
        console.log(error);
      });

    },
    editDetails(item, index) {
      this.$router.push({path: "/dashboard/products/edit/" + item.post_id});

    },
    go_show_product(item) {
      window.open(localStorage.getItem("api_address") + "products/" + item.slug, "_blank");

    },
    get_statuses() {
      var self = this;
      axios.post('/api/admin/order/get_order_status', {}).then(function (response) {
        self.items_status = response.data.orders
        self.get_news();
      }).catch(function (error) {
        console.log(error);
      });

    },
    get_news() {
      var self = this;
      var formData = new FormData();
      if (this.$route.params.customer_id) {
        formData.append("user_id", this.$route.params.customer_id);

      }
      formData.append("start_date", this.start_date);
      formData.append("end_date", this.end_date);

      axios.post('/api/admin/order/get_all_orders', formData, {}).then(function (response) {

        var contents = response.data;

        contents.data.forEach(function (val) {
          val.user_mobile = val.user.phone
          val.user = val.user.name
        })

        self.items = contents.data;
        self.user_data = contents.user;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister(item) {
      this.$router.push({path: '/dashboard/orders/info/' + item.id});
    },
    goAddNews() {

      this.$router.push({path: '/dashboard/products/create'});
    },

  }
}


</script>
