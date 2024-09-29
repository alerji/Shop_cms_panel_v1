<template>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <strong>
          لیست مشتریان
        </strong>

      </CCardHeader>

      <CCardBody class="">
        <CRow v-if="checkbox_items.length>0">
          <CCol>
            {{ checkbox_items.length }} مشتری انتخاب شده
          </CCol>
          <CCol>
            <CInput horizontal
                    label="مبلغ" v-model="credit_price"/>

          </CCol>
          <CCol>

            <CButton color="info" class="mx-1"
                     @click="increase_credit()">افزایش اعتبار
            </CButton>
            <CButton color="warning"
                     @click="decrease_credit()">کاهش اعتبار
            </CButton>
          </CCol>
          <CCol>

          </CCol>
        </CRow>

        <CDataTableFixed
            class="mb-0 table-outline"
            hover
            striped
            column-filter
            :checkbox="true"
            :pagination="true"
            :items-per-page="100"
            :checkbox_ids.sync="checkbox_items"
            checkbox_key="id"
            :items="items"
            :fields="fields"
            head-color="light"
            no-sorting
        >
          <template #created_at="{item}">
            <td>
              <p>{{ get_date_time(item.created_at) }}</p>
            </td>
          </template>
          <template #credit="{item}">
            <td>
              <p>{{ get_currency(item.credit) }} تومان</p>
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
      </CCardBody>
    </CCard>


  </div>

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
      credit_price: "0",
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
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'name', label: 'نام و نام خانودگی'},
        {key: 'created_at', label: 'تاریخ ثبت نام', _classes: 'text-center'},
        {key: 'phone', label: 'شماره همراه', _classes: 'text-center'},
        {key: 'orders_count', label: 'تعداد سفارش', _classes: 'text-center'},
        {key: 'credit', label: 'کیف پول', _classes: 'text-center'},
        {key: 'operation', label: 'عملیات'},
      ],
      items_status: [],
      items: [],
      checkbox_items: [],

      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {

    this.get_news();

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
      formData.append("user_id", JSON.stringify(this.checkbox_items));

      axios.post('/api/admin/user/update_credit_bulk', formData, {}).then(function (response) {
        self.checkbox_items = []
        self.get_news();
      }).catch(function (error) {
        console.log(error);
      });

    },
    decrease_credit() {
      var self = this;
      var formData = new FormData();
      formData.append("price", this.credit_price * -1);
      formData.append("user_id", JSON.stringify(this.checkbox_items));

      axios.post('/api/admin/user/update_credit_bulk', formData, {}).then(function (response) {
        self.checkbox_items = []
        self.get_news();
      }).catch(function (error) {
        console.log(error);
      });

    },

    editDetails(item, index) {
      this.$router.push({path: "/dashboard/products/edit/" + item.post_id});

    },
    go_show_product(item) {
      window.open(localStorage.getItem("web_address") + "products/" + item.slug, "_blank");

    },
    get_news() {
      var self = this;

      axios.post('/api/admin/user/get_customers', {}).then(function (response) {

        var contents = response.data;

        contents.forEach(function (val) {
          if (val.credit == null) {
            val.credit = '0 '
          } else {
            val.credit = val.credit.balance
          }
        })
        self.items = contents;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister(item) {
      console.log("item clicked", item)
      this.$router.push({path: '/dashboard/orders/list/' + item.id});
    },
    goAddNews() {

      this.$router.push({path: '/dashboard/products/create'});
    },

  }
}


</script>
