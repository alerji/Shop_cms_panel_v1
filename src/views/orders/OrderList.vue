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
                    <CTab :title="status.label" v-for="status in items_status">
                        <CDataTable
                                :items="items.filter(x=>x.status==status.value)"
                                :fields="fields"

                                :items-per-page="20"
                                hover
                                sorter
                                pagination
                        >
                            <template #ردیف="{item}">

                                <td>
                                    <p class="text-muted">{{item.row_id}}</p>

                                </td>

                            </template>

                            <template #payment="{item}">
                                <td>
                                    <p v-if="item.payment==null" class="text-danger">پرداخت نشده</p>
                                    <p v-else class="text-success">پرداخت شده</p>
                                </td>
                            </template>
                            <template #عملیات="{item,index}">
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
                    {key: 'ردیف',label: 'ردیف', _style: 'width:10%'},
                    {key: 'date',label: 'تاریخ ثبت', _style: 'width:10%;'},

                    {key: 'user',label: 'مشتری', _style: 'width:10%'},
                    {key: 'price',label: 'مبلغ', _style: 'width:10%;'},
                    {key: 'payment',label: 'وضعیت پرداخت', _style: 'width:10%;'},
                    // {key: 'national_code',label: 'کد ملی', _style: 'width:10%;'},
                    // {key: 'reserve_time',label: 'ساعت رزرو', _style: 'width:10%;'},
                    {key: 'عملیات',label: 'عملیات', _style: 'width:30%;'},

                ],
items_status:[{label:'ثبت شده',value:1},{label:'پرداخت شده',value:2}],
                items: [],

                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        },
        mounted() {
            console.log("process is "+process.env.VUE_APP_BASE_URL);
            this.get_news();
            bus.$on(this.delete_tag, (data) => {
                // alert(data);
                if (data=='true'){
                    this.delete_item();

                }else{
                    this.status_form = 0;
                }
            });
        },
        watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            },


        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item,index) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.$router.push({path:"/dashboard/products/edit/"+item.post_id});
                // this.name = this.items[item.id].name
                // this.color = this.items[item.id].color
                // this.description = this.items[item.id].description
                // this.previewImage = this.items[item.id].image
                // this.status_form = this.items[item.id].cat_id;
                // // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            go_show_product(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                window.open(process.env.VUE_APP_BASE_URL+"products/"+item.slug,"_blank");
                // this.$router.push({path:"/dashboard/products/edit/"+item.post_id});
                // this.name = this.items[item.id].name
                // this.color = this.items[item.id].color
                // this.description = this.items[item.id].description
                // this.previewImage = this.items[item.id].image
                // this.status_form = this.items[item.id].cat_id;
                // // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            get_news() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);

                axios.post('/api/admin/get_all_orders', {}).then(function (response) {

                    var contents = response.data;

                    var data_filter = contents.data.map((item, row_id) => {
                        return {...item, row_id}
                    });

                    self.items = data_filter;

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
            goRegister(item) {
                console.log("item clicked",item)
                this.$router.push({path: '/dashboard/orders/info/'+item.id});
            },
            goAddNews() {

                this.$router.push({path: '/dashboard/products/create'});
            },
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],this.delete_tag);

                this.status_form = item.post_id;
                console.log(this.status_form)

                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/product/delete";


                formData.append('id', this.status_form);

                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res);
                    if(res.data.error==1){
                        this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

                    }else{
                        this.$root.modal_component.show_success_modal('تایید',res.data.msg);

                    }
                    self.status_form=0;

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
