<template>

    <div class="product-list">
        <CCard>
            <CCardHeader>
                <CRow>
                    <CCol>
                        <strong>
                            افزودن سفارش
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
                    <CCol>
                      محصولات
                      <treeselect
                          v-model="products"
                          :multiple="true"
                          :async="true"
                          :load-options="load_products"
                          placeholder="محصولات فاکتور"
                          :normalizer="normalizer_products"
                      />
                    </CCol>
                    <CCol>
                      <CInput
                        label="نام مشتری"
                        v-model="user_name"
                        />
                    </CCol>
                    <CCol>
                      <CInput
                        label="موبایل مشتری"
                        v-model="user_mobile"
                        />
                    </CCol>
                    <CCol>
                      <CSelect
                          :options="status_items"

                          :value.sync="selected_status"
                          label="انتخاب وضعیت"
                      />
                    </CCol>

                </CRow>
              <CButton @click="add_order()" outlined color="primary">افزودن سفارش</CButton>
            </CCardBody>

        </CCard>

    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../main";
    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import {ASYNC_SEARCH} from "@riophae/vue-treeselect";

    const simulateAsyncOperation = fn => {
      setTimeout(fn, 200)
    }


    export default {
        name: 'Login',
        components: {
          Treeselect
            // Use the <ckeditor> component in this view.
            // ckeditor: CKEditor.component
        },
        data() {
            return {
              user_name:'',
              user_mobile:'',
                delete_tag: new Date() + "_delete_confirm",
                edit_row: null,
                edit_flag: false,
                edit_product_weight: '',
                name: '',

              fields: [
                {key: 'row',label: '#', _style: 'width:10%'},
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
                status_form: 0,
              products: [],
              normalizer_products(node) {
                return {
                  id: node.id,
                  label: node.product_title,
                }
              },
              load_products({action, searchQuery, callback}) {

                if (action === ASYNC_SEARCH) {
                  simulateAsyncOperation(() => {
                    let options;
                    var formData = new FormData();
                    formData.append('search',searchQuery);
                    axios.post('/api/admin/search-products', formData,{}).then(function (response) {
                      options = response.data;
                      callback(null, options);
                      // localStorage.setItem("api_token", response.data.access_token);
                      // self.$router.push({ path: 'notes' });
                    })
                        .catch(function (error) {

                          console.log(error);
                        });


                    //  const options = this.get_keywords(searchQuery);
                    // const options = [1, 2, 3, 4, 5].map(i => ({
                    //     id: `${searchQuery}-${i}`,
                    //     name: `${searchQuery}-${i}`,
                    // }))

                  })
                }
              },
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
        watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            },
            'items_tags_id': function (val) {
                console.log("val ", val)
                this.product_weight_id = val;
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
            editDetails(item, index) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.$router.push({path: "/dashboard/products/edit/" + item.post_id});

            },
            go_show_product(item) {
                window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");
            },
            add_order() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);
                var formData = new FormData();
                formData.append("id", this.$route.params.order_id);
                formData.append("token", localStorage.getItem("token"));
                formData.append("user_name", this.user_name);
                formData.append("user_mobile", this.user_mobile);
                formData.append("status_id", this.selected_status);
                formData.append("products", JSON.stringify(this.products));


                axios.post('/api/admin/add_order', formData, {}).then(function (response) {

                    var contents = response.data;

                    self.order_info = contents.data;
                    self.order_info.products = contents.products;
                  if (response.data.error == 1) {
                    this.$root.modal_component.show_danger_modal('خطا', response.data.msg);

                  } else {
                    this.$root.modal_component.show_success_modal('تایید', response.data.msg);

                  }
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                      this.$root.modal_component.show_danger_modal('خطا', "خطا از سرور");

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
                    if (res.data.error == 1) {
                        this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

                    } else {
                        this.$root.modal_component.show_success_modal('تایید', res.data.msg);

                    }
                    self.status_form = 0;

                    self.get_news();


                })
                    .catch(function (error) {

                        console.log(error);
                    });
            },
        }
    }


</script>
