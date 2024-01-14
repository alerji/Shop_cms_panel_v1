<template>

    <div class="product-list">
        <CCard>
            <CCardHeader>
                <strong>
                    لیست  سفارشات
                </strong>

            </CCardHeader>

            <CCardBody class="">
                <CTabs>
                    <CTab :title="status.title" v-for="status in items_status">
                        <CDataTable
                                :items="items.filter(x=>x.statuses[0].id==status.id)"
                                :fields="fields"

                                :items-per-page="20"
                                hover
                                sorter
                                pagination
                        >
                            <template #row="{item}">
                                <td>
                                    <p class="text-muted">{{item.row_id}}</p>
                                </td>
                            </template>

                            <template #date="{item}">
                                <td>
                                    <p class="text-muted">{{get_date_time(item.date)}}</p>
                                </td>
                            </template>
                            <template #user="{item}">
                                <td>
                                    <p class="text-muted">{{(item.user.name)}}</p>
                                </td>
                            </template>

                            <template #user_mobile="{item}">
                                <td>
                                    <p class="text-muted">{{(item.user.phone)}}</p>
                                </td>
                            </template>

                            <template #total_price="{item}">
                                <td>
                                    <p class="text-muted">{{get_currency(item.total_price)}}</p>
                                </td>
                            </template>



                            <template #operation="{item,index}">
                                <td class="py-2">
                                    <CButton
                                            color="primary"
                                            variant="outline"
                                            square
                                            size="sm"
                                            @click="goRegister(item)"
                                    >نمایش
                                    </CButton>

                                </td>
                            </template>



                        </CDataTable>
                    </CTab>

                </CTabs>
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
                delete_tag:new Date()+"_delete_confirm",
                edit_row: null,
                edit_flag: false,
                edit_product_weight: '',
                name: '',
                product_weight: null,
                items_tags: [],
                items_tags_title: null,
                items_tags_id: 1,
                edit_items_tags_id: 0,
                product_weight_id: 1,
                edit_product_weight_id: 0,
                productId: null,
                file: '',
                color: '',
                weightModal: false,
                previewImage: '',
                description: '',
                weights: null,
                fields :[
                    {key: 'row',label: 'ردیف', _style: 'width:10%'},
                    {key: 'date',label: 'تاریخ ثبت', _style: 'width:10%;'},

                    {key: 'user',label: 'مشتری', _style: 'width:10%'},
                    {key: 'user_mobile',label: 'مشتری', _style: 'width:10%'},
                    {key: 'total_price',label: 'مبلغ', _style: 'width:10%;'},
                    {key: 'operation',label: 'عملیات', _style: 'width:30%;'},

                ],
items_status:[],
                items: [],

                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        },
        mounted() {
            console.log("process is "+process.env.VUE_APP_BASE_URL);
            this.get_statuses();

        },
        watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            },


        },
        methods: {

            editDetails(item,index) {
                this.$router.push({path:"/dashboard/products/edit/"+item.post_id});

            },
            go_show_product(item) {
                window.open(process.env.VUE_APP_BASE_URL+"products/"+item.slug,"_blank");

            },
            get_statuses() {
                var self = this;

                axios.post('/api/admin/order/get_order_status', {}).then(function (response) {


                    self.items_status = response.data.orders
                  self.get_news();

                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            get_news() {
                var self = this;

                axios.post('/api/admin/order/get_all_orders', {}).then(function (response) {

                    var contents = response.data;

                    var data_filter = contents.data.map((item, row_id) => {
                        return {...item, row_id}
                    });

                    self.items = data_filter;

                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            goRegister(item) {
                console.log("item clicked",item)
                this.$router.push({path: '/dashboard/orders/info/'+item.id});
            },
            goAddNews() {

                this.$router.push({path: '/dashboard/products/create'});
            },

        }
    }


</script>
