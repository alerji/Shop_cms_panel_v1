<template>
  <div>

    <CButton
        color="primary"
        variant="outline"
        square
        size="sm"
        @click="goAddNews()"
    >افزودن محصول
    </CButton>
    <CCardBody>
      <CTabs>
        <CTab title="منتشر شده" active>
          <CDataTable
              :items="items_active"
              :fields="fields"
              column-filter
              :items-per-page="20"
              hover
              sorter
              pagination
          >
            <template #ردیف="{item}">

              <td>
                <p class="text-muted">{{ item.post_id }}</p>

              </td>

            </template>
            <template #عنوان="{item}">

              <td>
                <p class="text-muted">{{ item.title }}</p>

              </td>

            </template>

            <template #توضیحات="{item}">

              <td>
                <p class="text-muted">{{ item.summary.substring(0, 20) + "..." }}</p>

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
                <div style="display: inline-flex;" v-if="item.price!=null">
                  <CInputCurrency v-model="item.price.price" class="text-muted">{{ item.view_count }}</CInputCurrency>
                  <CButton size="sm" ourlined color="success" @click="update_product_price(item)">
                    <CIcon name="cil-check"/>
                  </CButton>
                </div>

              </td>

            </template>


            <template #تصویر="{item}">


              <td>
                <CImg width="50px" height="50px" v-bind:src="item.image"/>
              </td>

            </template>

            <template #عملیات="{item,index}">
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
                >حدف
                </CButton>
                <CButton
                    v-if="item.type==3"
                    color="primary"
                    variant="outline"
                    square
                    class="m-1"
                    size="sm"
                    @click="go_to_sources(item)"
                >منابع
                </CButton>

              </td>
            </template>


          </CDataTable>

        </CTab>

        <CTab title="منتشر نشده">
          <CDataTable
              :items="items_deactive"
              :fields="fields"

              :items-per-page="20"
              hover
              sorter
              pagination
          >
            <template #ردیف="{item}">

              <td>
                <p class="text-muted">{{ item.post_id }}</p>

              </td>

            </template>
            <template #عنوان="{item}">

              <td>
                <p class="text-muted">{{ item.title }}</p>

              </td>

            </template>

            <template #توضیحات="{item}">

              <td>
                <p class="text-muted">{{ item.summary.substring(0, 20) + "..." }}</p>

              </td>

            </template>
            <template #type="{item}">

              <td>
                <p class="text-muted" v-if="item.type==1">فیزیکی</p>
                <p class="text-muted" v-if="item.type==2">دانلودی</p>
                <p class="text-muted" v-if="item.type==3">ویدئویی</p>

              </td>

            </template>
            <template #نمایش="{item}">

              <td>
                <p class="text-muted">{{ item.view_count }}</p>

              </td>

            </template>


            <template #تصویر="{item}">


              <td>
                <CImg width="50px" height="50px" v-bind:src="item.image"/>
              </td>

            </template>

            <template #عملیات="{item,index}">
              <td class="py-2">
                <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="editDetails(item,index)"
                >ویرایش
                </CButton>

              </td>
            </template>


          </CDataTable>

        </CTab>
        <CTab title="حذف شده">
          <CDataTable
              :items="items_deleted"
              :fields="fields"

              :items-per-page="20"
              hover
              sorter
              pagination
          >
            <template #ردیف="{item}">

              <td>
                <p class="text-muted">{{ item.post_id }}</p>

              </td>

            </template>
            <template #عنوان="{item}">

              <td>
                <p class="text-muted">{{ item.title }}</p>

              </td>

            </template>

            <template #توضیحات="{item}">

              <td>
                <p class="text-muted">{{ item.summary.substring(0, 20) + "..." }}</p>
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
                <div v-if="item.price!=null">
                  <CInput v-model="item.price.price" class="text-muted">{{ item.view_count }}</CInput>
                  <CButton @click="update_price(item)">
                    <CIcon name="cil-check"/>
                  </CButton>
                </div>

              </td>

            </template>


            <template #تصویر="{item}">


              <td>
                <CImg width="50px" height="50px" v-bind:src="item.image"/>
              </td>

            </template>

            <template #عملیات="{item,index}">
              <td class="py-2">
                <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="editDetails(item,index)"
                >ویرایش
                </CButton>

              </td>
            </template>


          </CDataTable>

        </CTab>
      </CTabs>
    </CCardBody>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../main";
import CInputCurrency from "../includes/CInputCurrency";

var items_active = [];
var items_deactive = [];
var items_deleted = [];

const fields = [
  {key: 'ردیف', _style: 'width:5%'},
  {key: 'تصویر', label: 'تصویر', _style: 'width:10%'},
  {key: 'title', label: 'عنوان', _style: 'width:10%'},
  // {key: 'توضیحات', _style: 'width:10%'},
  {key: 'type',label: 'نوع', _style: 'width:10%;'},
  // {key: 'دسته', _style: 'width:10%;'},
  {key: 'price', label: "قیمت", _style: 'width:20%;'},
  // {key: 'تصویر', _style: 'width:10%;'},
  {key: 'عملیات', _style: 'width:10%;'},

];


export default {
  name: 'Login',
  components: {
    CInputCurrency,
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items_active: items_active.map((item, id) => {
        return {...item, id}
      }),
      fields,
      items_deactive: items_deactive.map((item, id) => {
        return {...item, id}
      }),
      items_deleted: items_deleted.map((item, id) => {
        return {...item, id}
      }),
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {
    console.log("process is " + process.env.VUE_APP_BASE_URL);
    this.get_news();
    bus.$on('delete_confirm', (data) => {
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
      window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");

    },
    go_to_sources(item) {
      this.$router.push("/dashboard/products/sources/"+item.post_id)
    },
    update_product_price(item) {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var url = '/api/admin/update_product_price';

      var formData = new FormData();
      formData.append("product_id", item.post_id)
      formData.append("price", item.price.price.replace(/,/g, ''))
      axios.post(url, formData, {}).then(function (response) {

        var contents = response.data;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_news() {
      var self = this;

      var formData = new FormData();
      var url = '/api/admin/get_products';
      if (this.$route.params.cat_id) {
        url = '/api/admin/products/' + this.$route.params.cat_id;
      }
      axios.post(url, formData, {}).then(function (response) {

        var contents = response.data;

        var all_items = contents.posts_active;

        self.items_active = all_items.filter(x => x.status == 1).map((item, id) => {
          return {...item, id}
        }),
            fields;
        self.items_deactive = all_items.filter(x => x.status == 2).map((item, id) => {
          return {...item, id}
        }),
            fields;
        self.items_deleted = all_items.filter(x => x.status == 3).map((item, id) => {
          return {...item, id}
        }),
            fields;
        console.log("cats is " + self.items_active);
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
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], 'delete_confirm');

      this.status_form = item.post_id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete";


      formData.append('post_id', this.status_form);

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

            console.log(error);
          });
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    }
  }
}


</script>
