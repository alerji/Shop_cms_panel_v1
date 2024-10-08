<template>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <strong>
          گزارش پرداختی ها
        </strong>

      </CCardHeader>

      <CCardBody class="">
        <CRow>
          <CCol>
            <date-picker v-model="start_date" label="از تاریخ"/>
          </CCol>
          <CCol>
            <date-picker v-model="end_date" label="تا تاریخ"/>
          </CCol>
          <CCol>
            <CButton color="primary" @click="get_data()">
              <CIcon size="sm" name="cil-zoom"/>
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol col="6 col-sm-3">
            <CWidgetDropdown color="primary" :header="get_currency(calculate_items(items,'pay_price'))"
                             text="مبلغ کل">
            </CWidgetDropdown>

          </CCol>
          <CCol col="6 col-sm-3">
            <CWidgetDropdown color="primary" :header="get_currency(items.length)" text="تعداد پرداختی">
            </CWidgetDropdown>

          </CCol>
        </CRow>
        <CDataTableFixed
            class="mb-0 table-outline"
            hover
            striped
            column-filter
            :pagination="true"
            :items-per-page="100"
            :items="items"
            :fields="fields"
            head-color="light"
        >
          <template #created_at="{item}">
            <td>
              <p>{{ get_date_time(item.created_at) }}</p>
            </td>
          </template>
          <template #pay_price="{item}">
            <td>
              <p>{{ get_currency(item.pay_price) }}</p>
            </td>
          </template>
          <template #gateway="{item}">
            <td>
              <p>{{ (item.gateway.title) }}</p>
            </td>
          </template>
          <template #operation="{item,index}">
            <td class="py-2">
              <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="goOrderInfo(item)"
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
import {CChartLineSimple} from "@/views/charts";


export default {
  name: 'Login',
  components: {
    CChartLineSimple
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      start_date: '',
      end_date: '',
      fields: [
        {key: 'order_id', label: '#', _classes: 'text-center'},
        {key: 'pay_price', label: 'مبلغ'},
        {key: 'created_at', label: 'تاریخ', _classes: 'text-center'},
        {key: 'gateway', label: 'درگاه پرداخت', _classes: 'text-center'},
        {key: 'operation', label: 'عملیات'},
      ],
      items: [],

    }
  },
  mounted() {
    this.start_date = this.get_day_before_today_in_day(10)
    this.end_date = this.get_today()
    this.get_data();

  },
  watch: {},
  methods: {
    goOrderInfo(item) {
      this.$router.push({path: '/dashboard/orders/info/' + item.order_id});
    },
    get_data() {
      var self = this;
      var form_data = new FormData();
      form_data.append("start_date", this.start_date);
      form_data.append("end_date", this.end_date);
      axios.post('/api/admin/report/date_report_payment', form_data, {}).then(function (response) {

        self.items = response.data;

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
