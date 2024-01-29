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
                  :pressed="value === selected ? true : false"
                  @click="selected = value"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <NewChartJs
            v-if="dashboard_data.dashboard_daily_report"
            type="bar"
            :info="dashboard_data.dashboard_daily_report"
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
                      <span class="ml-auto font-weight-bold"> {{ get_currency(gateway.payments_sum_pay_price) }} </span>
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
                  <div class="progress-group" v-for="product in dashboard_data.order_point_products">
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
            Traffic &amp; Sales
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12" lg="6">
                <CRow>
                  <CCol col="6">
                    <CCallout color="info">
                      <small class="text-muted">New Clients</small><br>
                      <strong class="h4">9,123</strong>
                    </CCallout>
                  </CCol>
                  <CCol col="6">
                    <CCallout color="danger">
                      <small class="text-muted">Recurring Clients</small><br>
                      <strong class="h4">22,643</strong>
                    </CCallout>
                  </CCol>
                </CRow>
                <hr class="mt-0">
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Monday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        color="info"
                        :value="34"
                    />
                    <CProgress
                        class="progress-xs"
                        color="danger"
                        :value="78"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Tuesday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="56"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="94"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Wednesday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="12"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="67"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Thursday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="43"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="91"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Friday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="22"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="73"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Saturday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="53"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="82"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      Sunday
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                        class="progress-xs"
                        :value="9"
                        color="info"
                    />
                    <CProgress
                        class="progress-xs"
                        :value="69"
                        color="danger"
                    />
                  </div>
                </div>
                <div class="legend text-center">
                  <small>
                    <sup>
                      <CBadge shape="pill" color="info">&nbsp;</CBadge>
                    </sup>
                    New clients
                    &nbsp;&nbsp;
                    <sup>
                      <CBadge shape="pill" color="danger">&nbsp;</CBadge>
                    </sup>
                    Recurring clients
                  </small>
                </div>
              </CCol>
              <CCol col="12" lg="6">
                <CRow>
                  <CCol col="6">
                    <CCallout color="warning">
                      <small class="text-muted">Pageviews</small><br>
                      <strong class="h4">78,623</strong>
                    </CCallout>
                  </CCol>
                  <CCol col="6">
                    <CCallout color="success">
                      <small class="text-muted">Organic</small><br>
                      <strong class="h4">49,123</strong>
                    </CCallout>
                  </CCol>
                </CRow>
                <hr class="mt-0">
                <ul class="horizontal-bars type-2">
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-user" class="progress-group-icon"/>
                      <span class="title">Male</span>
                      <span class="ml-auto font-weight-bold">43%</span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="43"
                          color="warning"
                      />
                    </div>
                  </div>
                  <div class="progress-group mb-5">
                    <div class="progress-group-header">
                      <CIcon name="cil-user-female" class="progress-group-icon"/>
                      <span class="title">Female</span>
                      <span class="ml-auto font-weight-bold">37%</span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="37"
                          color="warning"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-globe-alt" class="progress-group-icon"/>
                      <span class="title">Organic Search</span>
                      <span class="ml-auto font-weight-bold">
                        191,235 <span class="text-muted small">(56%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="56"
                          color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                          name="cib-facebook"
                          height="17"
                          class="progress-group-icon"
                      />
                      <span class="title">Facebook</span>
                      <span class="ml-auto font-weight-bold">
                        51,223 <span class="text-muted small">(15%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="15"
                          color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                          name="cib-twitter"
                          height="17"
                          class="progress-group-icon"
                      />
                      <span class="title">Twitter</span>
                      <span class="ml-auto font-weight-bold">
                        37,564 <span class="text-muted small">(11%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="11"
                          color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                          name="cib-linkedin"
                          height="17"
                          class="progress-group-icon"
                      />
                      <span class="title">LinkedIn</span>
                      <span class="ml-auto font-weight-bold">
                        27,319 <span class="text-muted small">&nbsp;(8%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                          class="progress-xs"
                          :value="8"
                          color="success"
                      />
                    </div>
                  </div>
                  <div class="divider text-center">
                    <CButton color="link" size="sm" class="text-muted">
                      <CIcon name="cil-options"/>
                    </CButton>
                  </div>
                </ul>
              </CCol>
            </CRow>
            <br/>
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
      selected: 'روزانه',
      tableItems: [
        {
          avatar: {url: 'img/avatars/1.jpg', status: 'success'},
          user: {name: 'Yiorgos Avraamu', new: true, registered: 'Jan 1, 2015'},
          country: {name: 'USA', flag: 'cif-us'},
          usage: {value: 50, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'Mastercard', icon: 'cib-cc-mastercard'},
          activity: '10 sec ago'
        },
        {
          avatar: {url: 'img/avatars/2.jpg', status: 'danger'},
          user: {name: 'Avram Tarasios', new: false, registered: 'Jan 1, 2015'},
          country: {name: 'Brazil', flag: 'cif-br'},
          usage: {value: 22, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'Visa', icon: 'cib-cc-visa'},
          activity: '5 minutes ago'
        },
        {
          avatar: {url: 'img/avatars/3.jpg', status: 'warning'},
          user: {name: 'Quintin Ed', new: true, registered: 'Jan 1, 2015'},
          country: {name: 'India', flag: 'cif-in'},
          usage: {value: 74, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'Stripe', icon: 'cib-stripe'},
          activity: '1 hour ago'
        },
        {
          avatar: {url: 'img/avatars/4.jpg', status: ''},
          user: {name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2015'},
          country: {name: 'France', flag: 'cif-fr'},
          usage: {value: 98, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'PayPal', icon: 'cib-paypal'},
          activity: 'Last month'
        },
        {
          avatar: {url: 'img/avatars/5.jpg', status: 'success'},
          user: {name: 'Agapetus Tadeáš', new: true, registered: 'Jan 1, 2015'},
          country: {name: 'Spain', flag: 'cif-es'},
          usage: {value: 22, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'Google Wallet', icon: 'cib-google-pay'},
          activity: 'Last week'
        },
        {
          avatar: {url: 'img/avatars/6.jpg', status: 'danger'},
          user: {name: 'Friderik Dávid', new: true, registered: 'Jan 1, 2015'},
          country: {name: 'Poland', flag: 'cif-pl'},
          usage: {value: 43, period: 'Jun 11, 2015 - Jul 10, 2015'},
          payment: {name: 'Amex', icon: 'cib-cc-amex'},
          activity: 'Last week'
        }
      ],
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

    }
  }
}
</script>
