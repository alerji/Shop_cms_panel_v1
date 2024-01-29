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
        </strong>
      </CCardHeader>

      <CCardBody class="">
        <CRow>
          <CCol><label>شماره سفارش : {{ order_info.id }}</label></CCol>
          <CCol><label>مشتری : {{ order_info.user.name }}</label></CCol>
          <CCol><label>موبایل : {{ order_info.user.phone }}</label></CCol>
          <CCol><label>تاریخ ثبت : {{ get_date_time(order_info.created_at) }}</label></CCol>
        </CRow>
      </CCardBody>
      <hr>
      <CCardBody class="">
        <CRow>
          <CCol><label>نوع ارسال : {{ order_info.shipping_title }}</label></CCol>
          <CCol><label>هزینه ارسال : {{ order_info.shipping_price }}</label></CCol>
        </CRow>
        <CRow>
          <CCol>
            <div>آدرس :</div>
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
      edit_row: null,
      edit_flag: false,
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
    this.get_status_list();
    bus.$on(this.delete_tag, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();
      } else {
        this.status_form = 0;
      }
    });
  },
  watch: {},
  methods: {

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
