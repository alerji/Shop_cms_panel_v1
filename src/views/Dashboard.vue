<template>
  <div v-if="dashboard_data.total_sales!=null">
    <WidgetsDropdown :info="dashboard_data"/>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol col="5">
            <h4 id="traffic" class="card-title mb-0">نمودار فروش</h4>
          </CCol>
          <CCol col="7" class="d-none d-md-block">

            <CButtonGroup class="float-right mr-3">
              <CButton
                  color="outline-secondary"
                  v-for="(value, key) in ['روزانه', 'ماهانه', 'سالانه']"
                  :key="key"
                  class="mx-0"
                  :pressed="value === selected_sale_time ? true : false"
                  @click="selected_sale_time = value"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <NewChartJs
            v-if="dashboard_data.dashboard_daily_report"
            type="bar"
            label="فروش"
            :info="dashboard_data.dashboard_daily_report"
            style="height:300px;margin-top:40px;"/>


        <h4 id="traffic" class="card-title mb-0">نمایش کالا ها</h4>

        <NewChartJs
            v-if="dashboard_data.dashboard_daily_view_report"
            type="bar"
            label="بازدید"

            :info="dashboard_data.dashboard_daily_view_report"
            style="height:300px;margin-top:40px;"/>
      </CCardBody>
      <CCardFooter>
        <CRow class="text-center">
          <CCol md col="12" class="mb-sm-2 mb-0">
            <div class="text-muted">فروش امروز</div>
            <strong>{{ get_currency(dashboard_data.today_sales) }}</strong>
            <CProgress
                class="progress-xs mt-2"
                :precision="1"
                color="success"
                :value="100"
            />
          </CCol>
          <CCol md col="12" class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">فروش این ماه</div>
            <strong>{{ get_currency(dashboard_data.month_sales) }}</strong>
            <CProgress
                class="progress-xs mt-2"
                :precision="1"
                color="info"
                :value="100"
            />
          </CCol>
          <CCol md col="12" class="mb-sm-2 mb-0">
            <div class="text-muted">فروش ماه قبل</div>
            <strong>{{ get_currency(dashboard_data.last_month_sales) }}</strong>
            <CProgress
                class="progress-xs mt-2"
                :precision="1"
                color="warning"
                :value="100"
            />
          </CCol>
          <CCol md col="12" class="mb-sm-2 mb-0">
            <div class="text-muted">فروش سال</div>
            <strong>{{ get_currency(dashboard_data.total_sales) }}</strong>
            <CProgress
                class="progress-xs mt-2"
                :precision="1"
                color="danger"
                :value="100"
            />
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
    <!--    <WidgetsBrand/>-->
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            نگاه کلی
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12" lg="6">
                فروش بر اساس درگاه پرداخت
                <hr class="mt-0">
                <ul class="horizontal-bars type-2">
                  <div class="progress-group" v-for="gateway in dashboard_data.gateways">
                    <div class="progress-group-header">
                      <CIcon name="cil-user" class="progress-group-icon"/>
                      <span class="title">{{ gateway.title }}</span>
                      <span class="ml-auto font-weight-bold" v-if="gateway.payments_sum_pay_price!=null"> {{ get_currency(gateway.payments_sum_pay_price) }} </span>
                      <span class="ml-auto font-weight-bold" v-else>0 </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="calculate_items_percent(dashboard_data.gateways,'payments_sum_pay_price',gateway.payments_sum_pay_price)"
                          color="warning"
                      />
                    </div>
                  </div>
                </ul>
              </CCol>
              <CCol col="12" lg="6">
                کالاهای کم موجود انبار
                <hr class="mt-0">
                <ul class="horizontal-bars type-2">
                  <div class="progress-group" v-for="product in dashboard_data.order_point_products.slice(0,5)">
                    <div class="progress-group-header">
                      <CIcon name="cil-user" class="progress-group-icon"/>
                      <span class="title">{{ product.product.title.title }}</span>
                      <span class="ml-auto font-weight-bold">({{ product.stock }} عدد)</span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="100"
                          color="danger"
                      />
                    </div>
                  </div>
                </ul>
              </CCol>
            </CRow>
            <br/>
            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="dashboard_data.last_orders"
                :fields="orderFields"
                head-color="light"
                no-sorting
            >


              <template #status="{item}">
                <td>
                  <div class="clearfix">
                    <div class="float-left">
                      <strong>{{ item.statuses[0].status.title.title }}</strong>
                    </div>
                    <div class="float-right">
                      <small class="text-muted">{{ item.statuses[0].status.title.proccess }}</small>
                    </div>
                  </div>

                  <CProgress class="mb-3 progress-xs" >
                    <CProgressBar :value="item.statuses[0].status.proccess" :style="`background:${item.statuses[0].status.color}`"/>
                  </CProgress>
                </td>

              </template>

              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>
              <template #name="{item}">
                <td>
                  <p>{{ item.user.name }}</p>
                </td>
              </template>
              <template #total_price="{item}">
                <td>
                  <p>{{ get_currency(item.total_price) }}</p>
                </td>
              </template>

              <template #operation="{item}">
                <td>
                  <CButton
                      color="info"
                      @click="$router.push('/dashboard/orders/info/'+item.id)"
                  >
                    <CIcon name="eye"/>
                  </CButton>
                </td>

              </template>

            </CDataTableFixed>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CCol col="5">
              <p id="traffic" class="card-title mb-0">محصولات برتر</p>
            </CCol>
            <CCol col="7" class="d-none d-md-block">

              <CButtonGroup class="float-right mr-3">
                <CButton
                    color="outline-secondary"
                    v-for="(value, key) in ['روزانه', 'ماهانه', 'سالانه']"
                    :key="key"
                    class="mx-0"
                    :pressed="value === selected_products_time ? true : false"
                    @click="selected_products_time = value"
                >
                  {{ value }}
                </CButton>
              </CButtonGroup>
            </CCol>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12" lg="6">
<p>فروش محصولات</p>
                <hr class="mt-0">
                <div class="progress-group mb-4" v-for="item in products_time_list(1)">
                  <div class="progress-group-prepend" style="flex: 0 0 200px;" >
                    <span class="progress-group-text">
                      {{item.title.title}}


                    </span>

                  </div>
                  <strong>{{item.orders_count}}</strong>

                  <div class="progress-group-bars">

                    <CProgress
                        class="progress-xs"
                        color="info"
                        :value="item.orders_count"
                    />
                  </div>
                </div>
              </CCol>
              <CCol col="12" lg="6">
                <p>بازدید محصولات</p>

                <hr class="mt-0">
                <div class="progress-group mb-4" v-for="item in products_time_list(2)">
                  <div class="progress-group-prepend" style="flex: 0 0 200px;" >
                    <span class="progress-group-text">
                      {{item.title.title}}
                    </span>

                  </div>
                  <strong>{{item.views_count}}</strong>

                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        color="info"
                        :value="item.views_count"
                    />
                  </div>
                </div>
              </CCol>
            </CRow>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CCol col="5">
              <p id="traffic" class="card-title mb-0">اخرین مشتریان</p>
            </CCol>
            <CCol col="7" class="d-none d-md-block">

            </CCol>
          </CCardHeader>
          <CCardBody>

            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="dashboard_data.last_users"
                :fields="userFields"
                head-color="light"
                no-sorting
            >
              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>
              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goCustomerOrders(item)"
                  ><CIcon name="eye" size="sm"/>
                  </CButton>

                </td>
              </template>
            </CDataTableFixed>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'
import axios from "axios";
import NewChartJs from "@/views/charts/NewChartJs.vue";

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand,
    NewChartJs
  },
  data() {
    return {
      selected_sale_time: 'روزانه',
      selected_products_time: 'روزانه',

      userFields: [
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'name', label: 'نام و نام خانودگی'},
        {key: 'created_at', label: 'تاریخ ثبت نام', _classes: 'text-center'},
        {key: 'phone', label: 'شماره همراه', _classes: 'text-center'},
        {key: 'orders_count', label: 'تعداد سفارش', _classes: 'text-center'},
        {key: 'operation', label: 'عملیات'},
      ],
      orderFields: [
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'name', label: 'مشتری'},
        {key: 'created_at', label: 'تاریخ ثبت', _classes: 'text-center'},
        {key: 'status', label: 'وضعیت', _classes: 'text-center'},
        {key: 'total_price', label: 'مبلغ', _classes: 'text-center'},
        {key: 'operation', label: 'عملیات'},
      ],
      dashboard_data: {},
    }
  },
  mounted() {
    this.get_dashboard_data();
  },
  methods: {
    goCustomerOrders(item) {
      this.$router.push({path: '/dashboard/orders/list/'+item.id});
    },
    products_time_list(type){
      if(type==1){
        if(this.selected_products_time=='روزانه'){
          return this.dashboard_data.today_order_products
        }
        if(this.selected_products_time=='ماهانه'){
          return this.dashboard_data.month_order_products
        }
        if(this.selected_products_time=='سالانه'){
          return this.dashboard_data.all_order_products
        }
      }
      if(type==2){
        if(this.selected_products_time=='روزانه'){
          return this.dashboard_data.today_view_products
        }
        if(this.selected_products_time=='ماهانه'){
          return this.dashboard_data.month_view_products
        }
        if(this.selected_products_time=='سالانه'){
          return this.dashboard_data.all_view_products
        }
      }
    },
    get_dashboard_data() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();

      axios.post('/api/admin/dashboard_data', formData, {}).then(function (response) {

        var contents = response.data;

        self.dashboard_data = contents;

      })
          .catch(function (error) {
            console.log(error);
          });

    },
  }
}
</script>
