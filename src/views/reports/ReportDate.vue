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
            no-sorting
        >

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
      start_date: '',
      end_date: '',
      fields: [
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'name', label: 'نام و نام خانودگی'},
        {key: 'created_at', label: 'تاریخ ثبت نام', _classes: 'text-center'},
        {key: 'phone', label: 'شماره همراه', _classes: 'text-center'},
        {key: 'orders_count', label: 'تعداد سفارش', _classes: 'text-center'},
        {key: 'credit', label: 'کیف پول', _classes: 'text-center'},
        {key: 'operation', label: 'عملیات'},
      ],
      items: [],

    }
  },
  mounted() {
    this.start_date = this.get_today()
    this.end_date = this.get_day_before_today_in_day(10)
    this.get_data();

  },
  watch: {},
  methods: {

    get_data() {
      var self = this;
      var form_data = new FormData();
      form_data.append("start_date", this.start_date);
      form_data.append("end_date", this.end_date);
      axios.post('/api/admin/report/date_report', {}).then(function (response) {

        self.items = response.data;

      })
          .catch(function (error) {

            console.log(error);
          });

    },

  }
}


</script>
