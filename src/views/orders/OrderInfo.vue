<template>

  <div class="product-list" v-if="order_info.user!=null">
    <CCard>
      <CCardHeader>
        <strong>
          اطلاعات سفارش
        </strong>
        <strong>
          مبلغ کل: {{ get_currency(order_info.total_price) }}
        </strong>
        <strong>
          {{ status_items.filter(x => x.value == order_info.statuses[0].id)[0].label }}
        </strong>
        <strong>
          <CButton
              @click="tracking_post_modal=true"
              color="info">
            کد مرسوله
          </CButton>
          <CButton
              @click="print()"
              color="success"
              class="mx-1">
            پرینت اطلاعات
          </CButton>
        </strong>
      </CCardHeader>

      <CCardBody class="">
        <div id="print_order_area" style="display:none;">
          <div  style="">
            <CRow>
              <CCol col="6"><label style="font-size:14px">گیرنده : {{ order_info.user.name }}</label></CCol>
              <CCol col="6"><label style="font-size:14px">ت. فاکتور : {{ get_date_time(order_info.created_at) }}</label></CCol>
              <CCol col="6"><label style="font-size:14px">تلفن خریدار : {{ order_info.user.phone }}</label></CCol>
              <CCol col="6"><label style="font-size:14px">ش فاکتور : {{ order_info.id }}</label></CCol>
              <CCol col="12"  style="font-size:14px">
                <div  style="font-size:14px">نشانی و کد پستی :</div>
                <div  style="font-size:14px">
                  <label style="font-size:14px">{{ order_info.address.province }},{{ order_info.address.city }},{{ order_info.address.address }}</label>

                  <div class="mx-3" style="font-size:14px">{{ order_info.address.post_code }}</div>
                </div>
              </CCol>
              <CCol col="12">
                <table
                    style="width: 100%"
                >
                  <thead>
                  <tr>
                    <td>نام کالا</td>
                    <td>مشخصات</td>
                    <td>تعداد</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in order_info.products">
                    <td>{{ item.title }}</td>
                    <td v-if="item.price_rel!=null">
                      <p v-for="bundle in item.price_rel.bundles">
                        {{ bundle.bundle_item.title.title }}
                      </p>
                    </td>
                    <td v-else></td>
                    <td>{{ item.count }}</td>
                  </tr>
                  </tbody>

                </table>

              </CCol>
            </CRow>
          </div>

        </div>
        <CRow>
          <CCol col="6 col-sm-3"><label>شماره سفارش : {{ order_info.id }}</label></CCol>
          <CCol col="6 col-sm-3"><label>مشتری : {{ order_info.user.name }}</label></CCol>
          <CCol col="6 col-sm-3"><label>موبایل : {{ order_info.user.phone }}</label></CCol>
          <CCol col="6 col-sm-3"><label>تاریخ ثبت : {{ get_date_time(order_info.created_at) }}</label></CCol>
        </CRow>
      </CCardBody>
      <hr>
      <CCardBody class="">
        <CRow>
          <CCol><label>نوع ارسال : {{ order_info.shipping_title }}</label></CCol>
          <CCol><label>هزینه ارسال : {{ get_currency(order_info.shipping_price) }}</label></CCol>
        </CRow>
        <hr>
        <CRow>
          <CCol col="6">
            <div>آدرس :</div>

          </CCol>
          <CCol col="6">
            <CButton
                @click="edit_address_modal=true"
                color="success"
                class="mx-1">
              ویرایش آدرس
            </CButton>
          </CCol>
          <CCol>
            <div>
              <label class="mx-3">استان: {{ order_info.address.province }}</label>
              <label class="mx-3">شهر: {{ order_info.address.city }}</label>
              <p>{{ order_info.address.address }}</p>
              <label class="mx-3"> کد پستی: {{ order_info.address.post_code }}</label>
              <label class="mx-3"> نام گیرنده: {{ order_info.address.receiver }}</label>
              <label class="mx-3"> موبایل گیرنده: {{ order_info.address.mobile }}</label>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol><label>توضیحات : {{ order_info.description }}</label></CCol>
        </CRow>

      </CCardBody>

    </CCard>
    <CCard>
      <CCardHeader>
        <strong>
          محصولات سفارش
        </strong>

      </CCardHeader>
      <CCardBody class="">
        <CDataTableFixed
            :items="order_info.products"
            :fields="fields_products"

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

          <template #image="{item,index}">
            <td>
              <img :src="item.image.image" style="width: 75px;height: 75px" class="text-muted"/>
            </td>
          </template>
          <template #bundles="{item,index}">
            <td v-if="item.price_rel!=null">
              <p>{{item.price_rel.code}}</p>
              <p v-for="bundle in item.price_rel.bundles">
                {{ bundle.bundle_item.title.title }}
              </p>
            </td>
            <td v-else></td>
          </template>

          <template #price="{item,index}">
            <td>
              <p class="text-muted">{{ get_currency(item.price) }}</p>
            </td>
          </template>
          <template #off="{item,index}">
            <td>
              <p class="text-muted">{{ get_currency(item.off) }}</p>
            </td>
          </template>
          <template #tax="{item,index}">
            <td>
              <p class="text-muted">{{ get_currency(item.tax) }}</p>
            </td>
          </template>
          <template #total_price="{item,index}">
            <td>
              <p class="text-muted">{{ get_currency(item.total_price) }}</p>
            </td>
          </template>


        </CDataTableFixed>

      </CCardBody>

    </CCard>
<CCard >
  <CCardHeader>
    وضعیت های پرداخت
  </CCardHeader>
  <CCardBody>

    <CDataTableFixed
        :items="order_info.payment_info"
        :fields="fields_payments"

        :items-per-page="20"
        hover
        sorter
        pagination
    >
      <template #gateway="{item}">
        <td>
          <p class="text-muted">{{ item.gateway.title }}</p>
        </td>
      </template>




      <template #updated_at="{item}">
        <td>
          <p class="text-muted">{{ get_date_time(item.updated_at) }}</p>
        </td>
      </template>
      <template #status="{item}">
        <td>
          <p class="text-muted" v-if="item.status==0">پرداخت نشده</p>
          <p class="text-muted" v-if="item.status==1">پرداخت شده</p>
        </td>
      </template>

      <template #pay_price="{item}">
        <td>
          <p class="text-muted">{{ get_currency(item.pay_price) }}</p>
        </td>
      </template>
    </CDataTableFixed>

  </CCardBody>
</CCard>
    <CCard>
      <CCardHeader>
        <strong>
          وضعیت های سفارش
        </strong>

      </CCardHeader>


      <CCardBody class="">

        <CRow>
          <CCol col="5">
            <CSelect
                :options="status_items"
                horizontal
                :value.sync="selected_status"
                label="انتخاب وضعیت"
            />
          </CCol>
          <CCol col="3">

            <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="change_status()"
            >تغییر وضعیت
            </CButton>
          </CCol>
        </CRow>
        <CDataTableFixed
            :items="order_info.statuses"
            :fields="fields_status"

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
          <template #date="{item,index}">
            <td>
              <p class="text-muted">{{ get_date_time(item.date) }}</p>
            </td>
          </template>

          <template #user="{item,index}">
            <td>
              <p class="text-muted">{{ (item.user.name) }}</p>
            </td>
          </template>


        </CDataTableFixed>

      </CCardBody>

    </CCard>
    <CModal
        title="ثبت کد رهیگیری"
        color="info"
        :show.sync="tracking_post_modal"
    >
      <CInput
          v-model="tracking_post"
          placeholder="کد رهگیری مرسوله"

      />
      <template #footer>
        <CButton @click="tracking_post_modal = false" color="danger">انصراف</CButton>
        <CButton @click="add_tracking_post()" color="success">تایید</CButton>
      </template>
    </CModal>
    <CModal
        title="ویرایش آدرس"
        color="info"
        :show.sync="edit_address_modal"
    >
      <CRow>
        <CCol col="6">
          <CSelect
              :options="provinces"
              :value.sync="order_info.address.province_id"
              label="استان"
          />
        </CCol>
        <CCol col="6">
          <CSelect
              :options="cities"
              :value.sync="order_info.address.city_id"
              label="شهر"
          />
        </CCol>
        <CCol col="6">
          <CInput
              label="کد پستی"
              v-model="order_info.address.post_code"/>
        </CCol>
        <CCol col="6">
          <CInput
              label="گیرنده"
              v-model="order_info.address.receiver"/>
        </CCol>
        <CCol col="6">
          <CInput
              label="موبایل"
              v-model="order_info.address.mobile"/>
        </CCol>
        <CCol col="12">
          <CTextarea
              label="آدرس"
              v-model="order_info.address.address"/>
        </CCol>


      </CRow>
      <template #footer>
        <CButton @click="edit_address_modal = false" color="danger">انصراف</CButton>
        <CButton @click="edit_address()" color="success">ویرایش آدرس</CButton>
      </template>
    </CModal>

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
      delete_tag: new Date() + "_delete_confirm",
      tracking_post_modal: false,
      tracking_post: '',

      edit_address_modal: false,
      provinces:[],
      cities:[],
      edit_product_weight: '',
      name: '',
      fields_products: [
        {key: 'row', label: '#', _style: 'width:3%'},
        {key: 'image', label: 'تصویر', _style: 'width:5%;'},
        {key: 'title', label: 'کالا', _style: 'width:15%;'},
        {key: 'bundles', label: 'مشخصات', _style: 'width:10%;'},
        {key: 'count', label: 'تعداد', _style: 'width:5%;'},

        {key: 'price', label: 'مبلغ', _style: 'width:10%'},
        {key: 'off', label: 'تخفیف', _style: 'width:10%;'},
        {key: 'tax', label: 'مالیات', _style: 'width:10%;'},
        {key: 'total_price', label: 'مبلغ نهایی', _style: 'width:10%;'},

      ],
      fields_status: [
        {key: 'title', label: 'وضعیت', _style: 'width:10%;'},

        {key: 'user', label: 'ثبت کننده', _style: 'width:10%'},
        {key: 'date', label: 'تاریخ ثبت', _style: 'width:10%;'},

      ],
      fields_payments: [
        {key: 'pay_code', label: 'شماره پرداخت', _style: 'width:10%;'},

        {key: 'gateway', label: 'درگاه', _style: 'width:10%'},
        {key: 'status', label: 'وضعیت', _style: 'width:10%'},
        {key: 'pay_price', label: 'مبلغ', _style: 'width:10%'},
        {key: 'reference_number', label: 'رفرنس', _style: 'width:10%'},
        {key: 'card_number', label: 'شماره کارت', _style: 'width:10%'},
        {key: 'updated_at', label: 'تاریخ ثبت', _style: 'width:10%;'},

      ],

      product_weight: null,
      items_tags: [],
      items_tags_title: null,
      items_tags_id: 1,
      edit_items_tags_id: 0,

      productId: null,
      file: '',
      car_refer_description: '',
      color: '',
      order_info: {},
      weightModal: false,
      previewImage: '',
      description: '',
      weights: null,

      status_items: [],
      selected_status: 0,

      refer_status_items: [],
      selected_refer_status: 0,


      items_active: [],
      items_process: [],
      items_in_way: [],
      items_sent: [],
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {
    this.get_provinces();

    bus.$on(this.delete_tag, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();
      } else {
        this.status_form = 0;
      }
    });
  },
  watch: {
    'order_info.address.province_id': function () {
      this.get_cities()
    }
  },
  methods: {
    print() {
    // const data = document.getElementById('print_order_area').innerHTML
      this.print_element("print_order_area","print")
      // var mywindow = window.open('', 'my div', 'height=400,width=600');
      // mywindow.document.write('<html dir="rtl"><head><title>print</title>');
      // /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
      // mywindow.document.write('</head><body >');
      // mywindow.document.write(data);
      // mywindow.document.write('</body></html>');
      //
      // mywindow.print();
      // mywindow.close();

    },
    get_news() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();
      formData.append("id", this.$route.params.order_id);
      formData.append("token", localStorage.getItem("token"));
      axios.post('/api/admin/order/get_order', formData, {}).then(function (response) {

        var contents = response.data;

        self.order_info = contents.data;


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    edit_address() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();
      formData.append("id", this.order_info.address.id);
      formData.append("address", this.order_info.address.address);
      formData.append("province", this.order_info.address.province_id);
      formData.append("city", this.order_info.address.city_id);
      formData.append("receiver", this.order_info.address.receiver);
      formData.append("mobile", this.order_info.address.mobile);
      formData.append("post_code", this.order_info.address.post_code);
      axios.post('/api/admin/user/edit_user_address', formData, {}).then(function (response) {
        self.edit_address_modal= false
        if (response.data.error == 1) {
          self.$root.modal_component.show_danger_modal('خطا', response.data.msg);

        } else {
          self.$root.modal_component.show_success_modal('تایید', response.data.msg);

        }
    self.get_news();


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    change_status() {
      var self = this;
      var formData = new FormData();
      formData.append("id", this.$route.params.order_id);
      formData.append("status", this.selected_status);
      formData.append("token", localStorage.getItem("token"));
      axios.post('/api/admin/order/change_order_status', formData, {}).then(function (response) {

        if (response.data.error == 1) {
          self.$root.modal_component.show_danger_modal('خطا', response.data.msg);

        } else {
          self.$root.modal_component.show_success_modal('تایید', response.data.msg);

        }
        self.get_news();

        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    add_tracking_post() {
      var self = this;
      var formData = new FormData();
      formData.append("id", this.$route.params.order_id);
      formData.append("tracking_code", this.tracking_post);
      formData.append("token", localStorage.getItem("token"));
      this.tracking_post_modal = false
      axios.post('/api/admin/order/add_order_tracking_post', formData, {}).then(function (response) {

        if (response.data.error == 1) {
          self.$root.modal_component.show_danger_modal('خطا', response.data.msg);

        } else {
          self.$root.modal_component.show_success_modal('تایید', response.data.msg);

        }
        self.get_news();

        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
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
        self.get_status_list();


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_cities() {
      var self = this;


      const formData = new FormData();
      var url = "/api/market/get_cities";

      formData.append('id', this.order_info.address.province_id);

      axios.post(url, formData, {}).then(function (response) {
        self.cities = [{label:'انتخاب کنید',value:0}]
        response.data.data.forEach(function (val) {
          self.cities.push(
              {label: val.title, value: val.id}
          )
        })

          // self.order_info.address.city_id = response.data.data[0].id



      })
          .catch(function (error) {

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
        self.get_news();

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
