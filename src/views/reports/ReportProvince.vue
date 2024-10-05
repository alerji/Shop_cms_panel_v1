<template>

  <div class="product-list">
    <CCard>
      <CCardHeader>
        <strong>
          گزارش فروش بر اساس استان ها
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
            <CWidgetDropdown color="primary" :header="get_currency(calculate_items(items,'province_count'))"
                             text="جمع کل سفارشات">
            </CWidgetDropdown>

          </CCol>

        </CRow>
        <CDataTableFixed
            class="mb-0 table-outline"
            hover
            striped
            sorter

            sorter-value="province_count"
            column-filter
            :pagination="true"
            :items-per-page="100"
            :items="items"
            :fields="fields"
            head-color="light"
        >
          <template #row_id="{item,index}">
            <td>
              <p>{{ index+1 }}</p>
            </td>
          </template>
          <template #created_at="{item}">
            <td>
              <p>{{ get_date_time(item.created_at) }}</p>
            </td>
          </template>
          <template #title="{item}">
            <td>
              <p>{{ item.title }}</p>
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
        {key: 'row_id', label: '#', _classes: 'text-center'},
        {key: 'title', label: 'استان'},
        {key: 'province_count', label: 'تعداد', _classes: 'text-center'},
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
      this.$router.push({path: '/dashboard/reports/cities/' + item.province_id});
    },
    get_data() {
      var self = this;
      var form_data = new FormData();
      form_data.append("start_date", this.start_date);
      form_data.append("end_date", this.end_date);
      axios.post('/api/admin/report/date_province_report', form_data, {}).then(function (response) {
let data = []
        response.data.forEach(function (val){
            data.push(val)

        })
        self.items = data;

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
