<template>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <strong>
          گزارش فروش بازه زمانی
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
            <CWidgetDropdown color="primary" :header="get_currency(calculate_items(items,'total_price'))"
                             text="مبلغ کل">
            </CWidgetDropdown>

          </CCol>
          <CCol col="6 col-sm-3">
            <CWidgetDropdown color="primary" :header="get_currency(items.length)" text="تعداد فاکتور">
            </CWidgetDropdown>

          </CCol>
          <CCol col="6 col-sm-3">
            <CWidgetDropdown color="primary" :header="get_currency(calculate_items(items,'products_count'))"
                             text="تعداد کالا ها">

            </CWidgetDropdown>

          </CCol>
          <CCol col="6 col-sm-3"></CCol>
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
          <template #total_price="{item}">
            <td>
              <p>{{ get_currency(item.total_price) }}</p>
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
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'total_price', label: 'مبلغ'},
        {key: 'created_at', label: 'تاریخ', _classes: 'text-center'},
        {key: 'products_count', label: 'تعداد کالا', _classes: 'text-center'},
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
      this.$router.push({path: '/dashboard/orders/info/' + item.id});
    },
    get_data() {
      var self = this;
      var form_data = new FormData();
      form_data.append("start_date", this.start_date);
      form_data.append("end_date", this.end_date);
      axios.post('/api/admin/report/date_report', form_data, {}).then(function (response) {

        self.items = response.data;

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
