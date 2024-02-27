<template>
  <div>


    <CCard>
      <CCardHeader>
        لیست محصولات
        <div>
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="goAddNews()"
          >افزودن محصول
          </CButton>
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="goToDownload()"
          >دانلود اکسل
          </CButton>
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="open_file_selector()"
          >آپلود اکسل
          </CButton>
        </div>

      </CCardHeader>
      <CCardBody>
        <CTabs>
          <CTab v-for="filter in filters" :title="filter.label">
            <CDataTableFixed
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
                  <p class="text-muted">{{ index + 1 }}</p>

                </td>

              </template>
              <template #code="{item}">

                <td>
                  <p class="text-muted">{{ item.code }}</p>

                </td>

              </template>
              <template #is_featured="{item}">

                <td>
                  <CIcon name="cil-star" size="xl" v-if="item.is_featured==0"
                         @click.v.native="update_featured_item(item,1),item.is_featured=1"/>
                  <svg v-else @click="update_featured_item(item,0),item.is_featured=0" height="24px" width="24px"
                       version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 47.94 47.94" xml:space="preserve">
<path style="fill:limegreen;" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	C22.602,0.567,25.338,0.567,26.285,2.486z"/>
</svg>
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
                    <CInputCurrency class="pb-0" v-model="item.prices[0].price"/>
                    <CButton size="sm" ourlined color="success" @click="update_product_price(item)">
                      <CIcon name="cil-check"/>
                    </CButton>
                  </div>

                </td>

              </template>

              <template #stock="{item}">

                <td>
                  <div style="display: inline-flex;" v-if="item.prices.length>0">
                    <CInputCurrency class="pb-0" v-model="item.prices[0].stock"/>
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
                  >
                    <CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="editDetailsClone(item,index)"
                  >
                    <CIcon name="cil-clone" size="sm"/>
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="delete_item_dialog(item)"
                  >
                    <CIcon name="cil-trash" size="sm"/>
                  </CButton>
                  <CButton
                      color="info"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="go_bundle_price(item)"
                  >
                    <CIcon name="cil-dollar" size="sm"/>
                  </CButton>
                  <CButton
                      color="info"
                      variant="outline"
                      square
                      class="m-1"
                      size="sm"
                      @click="go_comments(item)"
                  >
                    <CIcon name="cil-comment-bubble" size="sm"/>
                  </CButton>
                  <!--                  <CButton-->
                  <!--                      color="primary"-->
                  <!--                      variant="outline"-->
                  <!--                      square-->
                  <!--                      class="m-1"-->
                  <!--                      size="sm"-->
                  <!--                      @click="go_show_product(item)"-->
                  <!--                  ><CIcon name="eye" size="sm"/>-->
                  <!--                  </CButton>-->

                </td>
              </template>


            </CDataTableFixed>

          </CTab>

        </CTabs>
      </CCardBody>

    </CCard>

    <CInputFile
        custom
        horizontal
        id="excel_uploader_file"
        v-show="false"

        v-on:change="handleFileUpload"
    />
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
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,

      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      excel_file: null,
      items: [],
      fields: [
        {key: 'row', label: '#', _style: 'width:3%', sorter: false, filter: false},
        {key: 'image', label: 'تصویر', _style: 'width:7%'},
        {key: 'name', label: 'عنوان', _style: 'width:25%'},
        {key: 'code', label: 'کد', _style: 'width:7%'},
        {key: 'type', label: 'نوع', _style: 'width:7%;'},
        {key: 'price', label: "قیمت", _style: 'width:13%;'},
        {key: 'stock', label: "موجودی", _style: 'width:7%;'},
        {key: 'is_featured', label: "★", _style: 'width:5%;'},
        {key: 'operation', label: 'عملیات', _style: 'width:12%;'},

      ],
      filters: [
        {label: 'منتشر شده', value: 1},
        {label: 'منتشر نشده', value: 2},
        {label: 'حذف شده', value: 3}
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
    },
    'excel_file': function () {
      this.upload_excel();
    }
  },
  methods: {
    goToDownload() {
      window.open(axios.defaults.baseURL + "export_products_excel")
    },
    goToUpload() {
      document.getElementById("excel_selector").click()
    },
    editDetails(item, index) {
      this.$router.push({path: "/dashboard/products/edit/" + item.id});

    },
    editDetailsClone(item, index) {
      this.$router.push({path: "/dashboard/products/clone/" + item.id});

    },
    go_bundle_price(item, index) {
      this.$router.push({path: "/dashboard/products/bundle_price/" + item.id});
    },
    go_comments(item, index) {
      this.$router.push({path: "/dashboard/products/comments/" + item.id});
    },
    go_show_product(item) {
      window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");
    },
    upload_excel() {
      var url = '/api/admin/product/update_product_excel';
      var self = this

      var formData = new FormData();
      formData.append("file", this.excel_file)
      axios.post(url, formData, {}).then(function (response) {
        self.$root.modal_component.show_api_response_modals(response);
        self.get_data()

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    update_product_price(item) {
      var url = '/api/admin/product/update_product_price';
      var self = this

      var formData = new FormData();
      formData.append("product_id", item.id)
      formData.append("price", item.prices[0].price.replace(/,/g, ''))
      axios.post(url, formData, {}).then(function (response) {
        // self.$root.modal_component.show_api_response_modals(response);


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
        // self.$root.modal_component.show_api_response_modals(response);


      })
          .catch(function (error) {

            console.log(error);
          });

    },

    update_featured_item(item, status) {
      var url = '/api/admin/product/update_product_featured';
      var self = this
      var formData = new FormData();
      formData.append("product_id", item.id)
      formData.append("status", status)
      axios.post(url, formData, {}).then(function (response) {
        // self.$root.modal_component.show_api_response_modals(response);
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
        self.items.forEach(function (val) {
          val.name = val.title.title
        })

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
    },
    handleFileUpload(files, e) {
      console.log("handle upload")
      var myfile = e.target.files[0];
      if (myfile == null) {
        return
      }

      // e.target.value = '';
      // e.target.files = '';
      this.excel_file = myfile
      e.target = null
    },
    open_file_selector() {
      document.getElementById("excel_uploader_file").click()
    },
  }
}


</script>
