<template>

    <div class="product-list">
        <CCard>
            <CCardHeader>
                <CRow>
                    <CCol>
                        <strong>
                            اطلاعات سفارش
                        </strong>
                    </CCol>
                    <CCol class="text-left">
                        <strong>
                            {{order_info.status_title}}
                        </strong>
                    </CCol>
                </CRow>


            </CCardHeader>

            <CCardBody class="">
                <CRow>
                    <CCol><label>شماره سفارش : {{order_info.id}}</label></CCol>
                    <CCol><label>مشتری : {{order_info.user}}</label></CCol>
                    <CCol><label>موبایل : {{order_info.user_mobile}}</label></CCol>
                    <CCol><label>تاریخ ثبت : {{order_info.date}}</label></CCol>
                </CRow>
            </CCardBody>
            <hr>
            <CCardBody class="">
<!--                <CRow>-->
<!--                    <CCol><label>تاریخ رزرو : {{order_info.reserve_date}}</label></CCol>-->
<!--                    <CCol><label>ساعت رزرو : {{order_info.reserve_time}}</label></CCol>-->
<!--                    <CCol><label v-if="order_info.national_code !=null">کد ملی : {{order_info.national_code}}</label></CCol>-->
<!--                </CRow>-->
<!--                <CRow>-->
<!--                    <CCol><label>آدرس : {{order_info.address}}</label></CCol>-->
<!--                </CRow>-->
<!--                <CRow>-->
<!--                    <CCol><label>توضیحات : {{order_info.description}}</label></CCol>-->
<!--                </CRow>-->
                <hr>
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
                <hr>

            </CCardBody>
            <CDataTable
                    :items="order_info.products"
                    :fields="fields"

                    :items-per-page="20"
                    hover
                    sorter
                    pagination
            >
                <template #row="{item,index}">
                    <td>
                        <p class="text-muted">{{index+1}}</p>
                    </td>
                </template>
                <template #pre_definds="{item}">

                    <td>
                        <CBadge class="m-1" v-for=" pre in item.pre_definds" color="success"> {{pre}}</CBadge>
                    </td>

                </template>


            </CDataTable>

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
                delete_tag: new Date() + "_delete_confirm",
                edit_row: null,
                edit_flag: false,
                edit_product_weight: '',
                name: '',
                fields: [
                    {key: 'row', label: 'ردیف', _style: 'width:10%'},
                    {key: 'product', label: 'کالا', _style: 'width:10%;'},

                    {key: 'price', label: 'مبلغ', _style: 'width:10%'},
                    {key: 'off', label: 'تخفیف', _style: 'width:10%;'},
                    {key: 'total_price', label: 'مبلغ کل', _style: 'width:10%;'},
                    {key: 'pre_definds', label: 'اضافات', _style: 'width:10%;'},

                ],

                product_weight: null,
                items_tags: [],
                items_tags_title: null,
                items_tags_id: 1,
                edit_items_tags_id: 0,
                product_weight_id: 1,
                edit_product_weight_id: 0,
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

                selected_refer_car: 0,
                car_items: [],


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
            this.get_news();
            this.get_car_list();
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
        watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            },
            'items_tags_id': function (val) {
                console.log("val ", val)
                this.product_weight_id = val;
            },
            'selected_refer_car': function () {
                var car_item = this.car_items.filter(x=>x.id = this.selected_refer_car)[0];
                console.log("car changed",car_item)

                this.car_refer_description = "قصاب"+": "+car_item.butcher +"  راننده:  "+ car_item.driver;

            }
        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item, index) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.$router.push({path: "/dashboard/products/edit/" + item.post_id});

            },
            go_show_product(item) {
                window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");
            },
            get_news() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                var formData = new FormData();
                formData.append("id", this.$route.params.order_id);
                formData.append("token", localStorage.getItem("token"));
                axios.post('/api/admin/get_order', formData, {}).then(function (response) {

                    var contents = response.data;

                    self.order_info = contents.data;
                    self.order_info.products = contents.products;
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            change_status() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                var formData = new FormData();
                formData.append("id", this.$route.params.order_id);
                formData.append("status", this.selected_status);
                formData.append("token", localStorage.getItem("token"));
                axios.post('/api/admin/change_order_status', formData, {}).then(function (response) {

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
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            add_order_car_relation() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                var formData = new FormData();
                formData.append("car_id", this.selected_refer_car);
                formData.append("order_id", this.$route.params.order_id);
                formData.append("token", localStorage.getItem("token"));
                axios.post('/api/admin/add_order_car_relation', formData, {}).then(function (response) {

                    if (response.data.error == 1) {
                        self.$root.modal_component.show_danger_modal('خطا', response.data.msg);

                    } else {
                        self.$root.modal_component.show_success_modal('تایید', response.data.msg);

                    }
                    self.get_news();

                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            get_car_list() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                // var formData = new FormData();

                axios.get('/api/admin/get_cars', {}).then(function (response) {

                    var contents = response.data;

                    contents.data.forEach((val) => {
                        // var obj = {label: val.car_name, value: val.id}
                        val.value = val.id;
                        val.label = val.car_name;
                        self.car_items.push(val);
                    });

                    self.selected_refer_car = self.car_items[0].value;

                })
                    .catch(function (error) {
                        console.log(error);
                    });

            },

            get_status_list() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                var formData = new FormData();

                axios.post('/api/admin/get_order_status', formData, {}).then(function (response) {

                    var contents = response.data;

                    self.status_items = contents.data;
                    self.selected_status = self.status_items[0].value;
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            goRegister() {
                this.$router.push({path: 'register'});
            }, goAddNews() {

                this.$router.push({path: '/dashboard/products/create'});
            },
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.delete_tag);
                this.status_form = item.post_id;
            },
            delete_item() {
                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/product/delete";
                formData.append('id', this.status_form);
                axios.post(url, formData, {}).then((res) => {
                    console.log(res);
                    if (res.data.error == 1) {
                        this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

                    } else {
                        this.$root.modal_component.show_success_modal('تایید', res.data.msg);

                    }
                    self.status_form = 0;

                    self.get_news();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
            },
        }
    }


</script>
