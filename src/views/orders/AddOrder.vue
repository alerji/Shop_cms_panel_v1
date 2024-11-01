<template>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol col="6">
            <strong v-if="order_id==0">
              افزودن سفارش
            </strong>
            <strong v-if="order_id!=0">
              ویرایش سفارش
            </strong>
          </CCol>
          <CCol col="6" class="text-left">
            <strong>
            </strong>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody class="">

        <CRow>

          <CCol>
            <CInput
                label="نام مشتری"
                :disabled="order_id!=0"
                v-model="user_name"
            />
          </CCol>
          <CCol>
            <CInput
                label="موبایل مشتری"
                :disabled="order_id!=0"

                v-model="user_mobile"
            />
          </CCol>
          <CCol>
            <CSelect
                :options="status_items"
                v-if="order_id==0"

                :value.sync="selected_status"
                label="انتخاب وضعیت"
            />
          </CCol>

        </CRow>
        <hr>
        <CRow
            v-if="order_id==0"
        >
          <CCol col="12">
            آدرس سفارش
          </CCol>
          <CCol col="3">
            <CSelect
                :options="provinces"
                :value.sync="selected_province"
                label="استان"
            />
          </CCol>
          <CCol col="3">
            <CSelect
                :options="cities"
                :value.sync="selected_city"
                label="شهر"
            />
          </CCol>
          <CCol col="3">
            <CInput
                label="کد پستی"
                v-model="post_code"/>
          </CCol>
          <CCol col="12">
            <CTextarea
                label="آدرس"
                v-model="address"/>
          </CCol>
        </CRow>
        <hr>
        <CDataTableFixed
            :items="product_items"
            :fields="product_fields"
            striped
            height="300px"
            hover
            sorter

        >
          <template #row="{item,index}">
            <td>
              <p class="text-muted">{{ index + 1 }}</p>
            </td>
          </template>

          <template #product_name="{item,index}">
            <td v-if="index==0">
              <treeselect
                  :multiple="false"
                  :async="true"
                  @select="select_product"
                  append-to-body
                  :load-options="load_products"
                  placeholder="جستجو محصول"
                  :normalizer="normalizer_products"
              />
            </td>
            <td v-else>
              <p class="text-muted">{{ item.product_name }}</p>
            </td>
          </template>


          <template #product_qty="{item,index}">
            <td v-if="index==0">
              <CInputCurrency
                  v-model="item.product_qty"/>
            </td>
            <td v-else>
              <p class="text-muted">{{ item.product_qty }}</p>
            </td>
          </template>
          <template #product_price="{item,index}">

            <td>
              <p class="text-muted">{{ item.product_price }}</p>
            </td>
          </template>
          <template #product_off_price="{item,index}">

            <td>
              <p class="text-muted">{{ item.product_off_price }}</p>
            </td>
          </template>
          <template #total_price="{item}">
            <td>
              <p class="text-muted" v-if="item.product_qty!=null">
                {{ get_currency(parseInt(item.product_off_price) * parseInt(item.product_qty)) }}</p>
            </td>
          </template>


          <template #operation="{item,index}">
            <td class="py-2">

              <CButton v-if="index==0"
                       color="primary"
                       variant="outline"
                       square
                       class="mr-1"

                       size="sm"
                       @click="add_product()"
              >
                <CIcon name="cil-plus" size="sm"/>
              </CButton>
              <CButton v-else
                       color="danger"
                       variant="outline"
                       square
                       class="mr-1"

                       size="sm"
                       @click="product_items.splice(index,1)"
              >
                <CIcon name="cil-trash" size="sm"/>
              </CButton>
            </td>
          </template>


        </CDataTableFixed>
        <CButton @click="add_order()" v-if="order_id==0" outlined color="primary">افزودن سفارش</CButton>
        <CButton @click="add_order()" v-if="order_id!=0" outlined color="primary">ویرایش سفارش</CButton>
      </CCardBody>

    </CCard>

  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../main";
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {ASYNC_SEARCH} from "@riophae/vue-treeselect";

const simulateAsyncOperation = fn => {
  setTimeout(fn, 200)
}


export default {
  name: 'Login',
  components: {
    Treeselect
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      order_id: 0,
      order_info: {},

      user_name: '',
      user_mobile: '',
      delete_tag: new Date() + "_delete_confirm",
      name: '',
      product_items: [{}],
      product_fields: [
        {key: 'row', label: '#', _style: 'width:3%'},
        {key: 'product_name', label: 'کالا', _style: 'width:20%;'},

        {key: 'product_qty', label: 'تعداد', _style: 'width:5%'},
        {key: 'product_price', label: 'مبلغ', _style: 'width:7%'},
        {key: 'product_off_price', label: 'قیمت بعد تخفیف', _style: 'width:7%;'},
        {key: 'total_price', label: 'مبلغ کل', _style: 'width:7%;'},
        {key: 'operation', label: 'عملیات', _style: 'width:5%;'},


      ],

      product_id: null,
      product_name: null,
      product_price_id: null,
      product_price: null,
      product_qty: null,
      product_off_price: null,

      status_items: [],
      selected_status: 0,


      cities: [],
      selected_city: 0,
      provinces: [],
      selected_province: 8,
      address: '',
      post_code: '',
      normalizer_products(node) {
        return {
          id: node.price_id,
          label: node.name,
        }
      },
      load_products({action, searchQuery, callback}) {

        if (action === ASYNC_SEARCH) {
          simulateAsyncOperation(() => {
            let options;
            var formData = new FormData();
            formData.append('search', searchQuery);
            axios.post('/api/admin/product/search-products', formData, {show_pros: false}).then(function (response) {
              options = response.data;
              callback(null, options);
              // localStorage.setItem("api_token", response.data.access_token);
              // self.$router.push({ path: 'notes' });
            })
                .catch(function (error) {

                  console.log(error);
                });

          })
        }
      },
    }
  },
  mounted() {
    this.get_provinces();
    this.get_status_list();
    if (this.$route.params.order_id != null) {
      this.order_id = this.$route.params.order_id
      this.get_order_info();
    }
  },
  watch: {
    'selected_province': function () {
      this.get_cities()
    }
  },
  methods: {
    get_order_info() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();
      formData.append("id", this.$route.params.order_id);
      formData.append("token", localStorage.getItem("token"));
      axios.post('/api/admin/order/get_order', formData, {}).then(function (response) {

        var contents = response.data;

        self.order_info = contents.data;
        self.user_name = self.order_info.user.name
        self.user_mobile = self.order_info.user.phone
        self.order_info.products.forEach(function (val) {
          let obj = {
            product_name: val.title,
            product_qty: val.count,
            product_id: val.price_rel.product_id,
            product_price: val.price_rel.price,
            product_off_price: val.price,
            product_price_id : val.price_rel.id,

          }
          if (val.price_rel.bundles.length > 0) {
            val.price_rel.bundles.forEach(function (bundle) {
              obj.product_name += (" " + bundle.bundle_item.title.title)
            })
          }
          self.product_items.push(obj)

        })

      })
          .catch(function (error) {

            console.log(error);
          });

    },

    add_product() {
      if (this.product_items[0].product_off_price == null) {
        return false
      }
      if (this.product_items[0].product_qty == null || this.product_items[0].product_qty == 0 || this.product_items[0].product_qty == "") {
        return false
      }
      this.product_items.splice(0, 0, {})
    },
    select_product(node) {
      console.log("select product", node)
      this.product_items[0].product_id = node.id;
      this.product_items[0].product_name = node.name;
      this.product_items[0].product_price = node.price;
      let has_off = false;

      if (node.off_price != 0 && node.off_price != null) {
        has_off = true

        if (node.off_expire != null) {
          if (new Date() > new Date(node.off_expire)) {
            has_off = false
          }
        }
      }
      if (!has_off) {
        this.product_items[0].product_off_price = node.price;
      } else {
        this.product_items[0].product_off_price = node.off_price;
      }
      this.product_items[0].product_price_id = node.price_id;
    },
    add_order() {
      var self = this;
      if (this.product_items.length == 1) {
        self.$root.modal_component.show_danger_modal('خطا', "حداقل یک محصول اضافه کنید");
        return false
      }
      if (this.user_name == "" || this.user_mobile == "") {
        self.$root.modal_component.show_danger_modal('خطا', "نام و شماره مشتری را وارد کنید");
        return false
      }
      if(this.order_id==0){
        if (this.post_code == "" || this.address == "") {
          self.$root.modal_component.show_danger_modal('خطا', "کد پستی و آدرس را وارد کنید");
          return false
        }
      }

      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();
      formData.append("id", this.$route.params.order_id);
      formData.append("token", localStorage.getItem("token"));
      formData.append("user_name", this.user_name);
      formData.append("user_mobile", this.user_mobile);
      formData.append("status_id", this.selected_status);
      formData.append("products", JSON.stringify(this.product_items));
      formData.append("city", this.selected_city);
      formData.append("province", this.selected_province);
      formData.append("address", this.address);
      formData.append("post_code", this.post_code);

      var url = '/api/admin/order/add_order_from_admin'
      if (this.order_id != 0) {
        url = '/api/admin/order/edit_order_from_admin'
        formData.append("order_id", this.order_id);

      }
      axios.post(url, formData, {}).then(function (response) {

        var contents = response.data;

        if (response.data.error == 1) {
          self.$root.modal_component.show_danger_modal('خطا', response.data.msg);
        } else {
          self.$root.modal_component.show_success_modal('تایید', response.data.msg);
          self.$router.push({path: '/dashboard/orders/info/' + response.data.order_id})

        }
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {
            this.$root.modal_component.show_danger_modal('خطا', "خطا از سرور");

            console.log(error);
          });

    },

    get_status_list() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();

      axios.post('/api/admin/order/get_order_status', formData, {}).then(function (response) {

        var contents = response.data;

        contents.orders.forEach(function (val) {
          self.status_items.push(
              {label: val.title.title, value: val.id}
          )
        })

        self.selected_status = self.status_items[0].value;
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_cities() {
      var self = this;


      const formData = new FormData();
      var url = "/api/market/get_cities";

      formData.append('id', this.selected_province);

      axios.post(url, formData, {}).then(function (response) {
        self.cities = []
        response.data.data.forEach(function (val) {
          self.cities.push(
              {label: val.title, value: val.id}
          )
        })
        if (self.selected_province != 8) {
          self.selected_city = response.data.data[0].id
        } else {
          self.selected_city = 300
        }


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_provinces() {
      var self = this;


      const formData = new FormData();
      var url = "/api/market/get_shipping";

      formData.append('id', this.selected_province);

      axios.post(url, formData, {}).then(function (response) {

        response.data.provinces.forEach(function (val) {
          self.provinces.push(
              {label: val.title, value: val.id}
          )
        })
        self.selected_province = 8
        self.get_cities()


      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
