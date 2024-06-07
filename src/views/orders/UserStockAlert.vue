<template>

    <div class="product-list">
        <CCard>
            <CCardHeader>
                <strong>
                    اطلاع از موجودی محصول
                </strong>

            </CCardHeader>

            <CCardBody class="">
              <CDataTableFixed
                  class="mb-0 table-outline"
                  hover
                  striped

                  :items="items"
                  :fields="fields"
                  head-color="light"
                  no-sorting
              >
                <template #row="{item,index}">
                  <td>
                    <p>{{ index+1 }}</p>
                  </td>
                </template>
                <template #product="{item}">
                  <td>
                    <p>{{ (item.title.title) }}</p>
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
                  {key: 'row', label: '#', _classes: 'text-center'},
                  {key: 'product', label: 'محصول', _classes: 'text-center'},
                  {key: 'has_alerts_count', label: 'تعداد کاربران', _classes: 'text-center'},
                  // {key: 'operation', label: 'عملیات'},
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

          this.get_news();

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
            get_news() {
                var self = this;

                axios.post('/api/admin/product/user_product_alerts', {}).then(function (response) {

                    var contents = response.data;


                    self.items = contents;

                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            goRegister(item) {
                console.log("item clicked",item)
                this.$router.push({path: '/dashboard/orders/list/'+item.user_id});
            },
            goAddNews() {

                this.$router.push({path: '/dashboard/products/create'});
            },

        }
    }


</script>
