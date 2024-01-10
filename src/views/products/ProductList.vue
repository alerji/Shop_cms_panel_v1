<template>
  <div>


    <CCard>
      <CCardHeader>
        لیست محصولات
        <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="goAddNews()"
        >افزودن محصول
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTabs>
          <CTab v-for="filter in filters" :title="filter.label">
            <CDataTable
                :items="items.filter(x=>x.status==filter.value)"
                :fields="fields"
                column-filter
                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item,index}">

                <td>
                  <p class="text-muted">{{ index+1 }}</p>

                </td>

              </template>
              <template #title="{item}">

                <td>
                  <p class="text-muted">{{ item.title.title }}</p>

                </td>

              </template>

              <template #code="{item}">

                <td>
                  <p class="text-muted">{{ item.code}}</p>

                </td>

              </template>
              <template #type="{item}">

                <td>
                  <p class="text-muted" v-if="item.type==1">فیزیکی</p>
                  <p class="text-muted" v-if="item.type==2">دانلودی</p>
                  <p class="text-muted" v-if="item.type==3">ویدئویی</p>

                </td>

              </template>
              <template #price="{item}">

                <td>
                  <div style="display: inline-flex;" v-if="item.prices.length>0">
                    <CInputCurrency class="pb-0" v-model="item.prices[0].price" />
                    <CButton size="sm" ourlined color="success" @click="update_product_price(item)">
                      <CIcon name="cil-check"/>
                    </CButton>
                  </div>

                </td>

              </template>

              <template #stock="{item}">

                <td>
                  <div style="display: inline-flex;" v-if="item.prices.length>0">
                    <CInputCurrency class="pb-0" v-model="item.prices[0].stock" />
                    <CButton size="sm" ourlined color="success" @click="update_product_stock(item)">
                      <CIcon name="cil-check"/>
                    </CButton>
                  </div>

                </td>

              </template>


              <template #image="{item}">


                <td>
                  <CImg v-if="item.gallery.length>0" width="50px" height="50px" v-bind:src="item.gallery[0].image"/>
                </td>

              </template>

              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="warning"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="editDetails(item,index)"
                  >ویرایش
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="delete_item_dialog(item)"
                  >حذف
                  </CButton>
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="go_show_product(item)"
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
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items:[],
      fields:[
        {key: 'row',label: 'ردیف', _style: 'width:3%'},
        {key: 'image', label: 'تصویر', _style: 'width:10%'},
        {key: 'title', label: 'عنوان', _style: 'width:10%'},
        {key: 'code', label: 'کد', _style: 'width:10%'},
        {key: 'type',label: 'نوع', _style: 'width:10%;'},
        {key: 'price', label: "قیمت", _style: 'width:15%;'},
        {key: 'stock', label: "موجودی", _style: 'width:10%;'},
        {key: 'operation',label: 'عملیات', _style: 'width:10%;'},

      ],
      filters:[
        {label:'منتشر شده',value:1},
        {label:'منتشر نشده',value:2},
        {label:'حذف شده',value:3}
      ],
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {
    this.get_data();
    bus.$on(this.confirm_delete_name, (data) => {
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
      this.get_data();
    }
  },
  methods: {

    editDetails(item, index) {
      this.$router.push({path: "/dashboard/products/edit/" + item.id});

    },
    go_show_product(item) {
      window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");
    },
    update_product_price(item) {
      var url = '/api/admin/product/update_product_price';
      var self = this

      var formData = new FormData();
      formData.append("product_id", item.id)
      formData.append("price", item.prices[0].price.replace(/,/g, ''))
      axios.post(url, formData, {}).then(function (response) {
        self.$root.modal_component.show_api_response_modals(response);


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    update_product_stock(item) {
      var url = '/api/admin/product/update_product_stock';
var self = this
      var formData = new FormData();
      formData.append("product_id", item.id)
      formData.append("stock", item.prices[0].stock.replace(/,/g, ''))
      axios.post(url, formData, {}).then(function (response) {
        self.$root.modal_component.show_api_response_modals(response);


      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_data() {
      var self = this;

      var formData = new FormData();
      var url = '/api/admin/product/get_products';
      if (this.$route.params.cat_id) {
        url = '/api/admin/product/get_products_by_cat'
        formData.append("cat_id", this.$route.params.cat_id)
      }
      axios.post(url, formData, {}).then(function (response) {

        var contents = response.data;

        self.items = contents.items;


      })
          .catch(function (error) {

            console.log(error);
          });

    },

   goAddNews() {

      this.$router.push({path: '/dashboard/products/create'});
    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);

      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_product";


      formData.append('post_id', this.status_form);

      axios.post(url, formData, {}).then((response) => {
        self.$root.modal_component.show_api_response_modals(response);

        self.status_form = 0;

        self.get_data();


      })
          .catch(function (error) {

            console.log(error);
          });
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    }
  }
}


</script>
