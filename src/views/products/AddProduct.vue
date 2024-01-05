<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong v-if="status_form==0">ثبت محصول</strong>
            <strong v-if="status_form!=0">ویرایش محصول</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                <CInput
                    v-model="title"

                    label="عنوان محصول"
                    placeholder="عنوان"
                    vertical
                />
              </CCol>
              <CCol col="4">
                <CInput
                    v-model="code"
                    label="کد محصول"
                    placeholder="کد"
                />
              </CCol>
              <CCol col="4">
                <CInput
                    v-model="seo_title"
                    label="متا عنوان"
                />
              </CCol>
              <CCol col="4">
                <CInput
                    v-model="keyword"
                    label="کلید واژه"
                />
              </CCol>
              <CCol col="4">
                <CInput
                    label="آدرس جایگزین"
                    v-model="favorite_url"/>
              </CCol>
              <CCol col="4">
                <CSelect
                    :options="[{label:'محصول فیزیکی',value:1},{label:'محصول دانلودی',value:2}]"
                    :value.sync="product_type"

                    label="نوع محصول"

                />

              </CCol>
            </CRow>
            <CRow>

            </CRow>
            <CRow>
              توضیحات کوتاه

              <CCol col="12">
                <ckeditor
                    v-model="editorData"
                    :editor-url="editorUrl"
                ></ckeditor>


              </CCol>
            </CRow>
            <CRow>
              توضیحات کامل
              <CCol col="12">
                <ckeditor
                    v-model="editorData_full"
                    :editor-url="editorUrl"
                ></ckeditor>


              </CCol>
            </CRow>
            <CCol col="12">
              <CTextarea
                  v-model="seo_summary"

                  label="سئو توضیحات"

              />
            </CCol>

          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            قیمت گذاری
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                <CInputCurrency
                    v-model="product_price"
                    :horizontal="{label: 'col-sm-4', input: 'col-sm-8'}"

                    description="برای گزینه تماس بگیرید قیمت را صفر وارد کنید"
                    label="قیمت محصول"

                />

              </CCol>
              <CCol col="4">
                <CInputCurrency
                    v-model="product_stock"
                    :horizontal="{label: 'col-sm-4', input: 'col-sm-8'}"

                    label="موجودی محصول"

                />

              </CCol>
              <CCol col="4">
                <CSelect
                    label="ارز"
                    :horizontal="{label: 'col-sm-4', input: 'col-sm-8'}"

                    :options="currency_items"
                    :value.sync="selected_currency"/>

              </CCol>
              <CCol col="6">
                <CInputCurrency
                    v-model="product_off_price"
                    label="قیمت ویژه(تخفیف)"
                    horizontal

                />

              </CCol>
              <CCol col="6">
                <date-picker
                    v-model="product_off_price_date"
                    label="محدودیت زمان تخفیف"
                    type="datetime"
                    display-format="jYYYY/jMM/jDD HH:mm"
                    format="YYYY-MM-DD HH:mm"
                inputFormat="YYYY-MM-DD HH:mm"
                    description="برای تخفیف همیشگی خالی بگذارید"

                />

              </CCol>

            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">

                <treeselect
                    v-model="value_tags"
                    :multiple="true"
                    :async="true"
                    :load-options="load_tags"
                    placeholder="انتخاب برچسب ها"
                    :normalizer="normalizer_tags"
                />


              </CCol>

              <CCol col="4">
                <div class="control_wrapper">
                  <treeselect
                      v-model="value_category"
                      :multiple="true"
                      :normalizer="normalizer_category"

                      :options="options_category"
                      placeholder="دسته بندی محصول را انتخاب کنید"
                  />

                </div>

              </CCol>
              <CCol col="4">

                <label>گالری تصویر</label>

                <vue-upload-multiple-image
                    @upload-success="uploadImageSuccess"
                    @before-remove="beforeRemove"
                    @edit-image="editImage"
                    :maxImage="10"
                    :data-images="gallery"

                ></vue-upload-multiple-image>

              </CCol>
            </CRow>

          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
الگو ویژگی
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                <CSelect
                    label="الگو ویژگی"
                    :options="property_items"
                    :value.sync="selected_property"/>

              </CCol>

            </CRow>
            <CRow>
              <CCol col="12">
                <CDataTable
                    :items="property_group_items"
                    :fields="fields_properties"

                    :items-per-page="20"
                    hover

                >

                  <template #group="{item}">

                    <td>
                      <p class="text-muted">{{ item.name }}</p>

                    </td>

                  </template>

                  <template #property="{item}">
                    <CDataTable
                        :items="item.items"
                        :fields="fields_properties_items"
                        hover
                    >

                      <template #title="{item}">

                        <td>
                          <p style="width: 100px" class="text-muted">{{ item.name }}</p>

                        </td>

                      </template>

                      <template #value="{item}">

                        <td style="display: flex">
                          <CInput v-for=" lng in item.lang_values" :key="lng.lng.id"
                              v-model="lng.value"
                                  style="width: 150px"
                              :placeholder="lng.lng.name"

                          />
                        </td>

                      </template>

                    </CDataTable>


                  </template>

                </CDataTable>

              </CCol>

            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0" @click="login()" type="submit" ref="submit_form" size="sm"
                     color="primary">
              <CIcon name="cil-check-circle"/>
              ثبت محصول
            </CButton>
            <CButton v-if="status_form!=0" @click="login()" type="submit" ref="submit_form" size="sm"
                     color="primary">
              <CIcon name="cil-check-circle"/>
              ویرایش محصول
            </CButton>
          </CCardFooter>

        </CCard>


      </CCol>
    </CRow>

    <CCardBody>

    </CCardBody>


  </div>

</template>

<script>
import axios from "axios";
import CKEditor from 'ckeditor4-vue';
import VueLazyload from 'vue-lazyload'

Vue.use(CKEditor);
Vue.use(VueLazyload)
import VueUploadMultipleImage from 'vue-upload-multiple-image'


import Vue from "vue";

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


import {ASYNC_SEARCH} from '@riophae/vue-treeselect'
// import  Readability from "@/plugins/readability";

const simulateAsyncOperation = fn => {
  setTimeout(fn, 200)
}

export default {
  name: 'Login',
  components: {
    Treeselect,
    VueUploadMultipleImage,
    ckeditor: CKEditor.component
  },
  data() {

    return {
      editorUrl: "https://furnishium.com/ckeditor/ckeditor.js",
      gallery: [],
      product_type: 1,
      value_category: [],
      value_tags: [],
      product_images: [],
      related_products: [],
      selected_property: 0,
      property_items: [],
      language_items: [],
      currency_items: [],
      selected_currency:0,
      property_group_items: [],
      product_property_values: [],
      fields_properties: [
        {key: 'group', label: 'گروه', _style: 'width:10%'},
        {key: 'property', label: 'ویژگی', _style: 'width:90%'},
      ],
      fields_properties_items: [
        {key: 'title', label: 'عنوان', _style: 'width:20%;display:none'},
        {key: 'value', label: 'مقدار', _style: 'width:80%;display:none'},
      ],
      options_category: [],
      normalizer_category(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },

      normalizer_tags(node) {
        return {
          id: node.title,
          label: node.title,
        }
      },
      // editor: ClassicEditor,
      editorData: '',
      editorData_full: '',
      editorConfig: {
        extraPlugins: [],
        language: 'fa'
        // The configuration of the editor.
      },
      title: '',
      code: '',
      favorite_url: '',
      keyword: '',
      seo_title: '',
      summary: '',
      seo_summary: '',
      product_price: '',
      product_stock: '',
      product_off_price: '',
      product_off_price_date: '',
      tags: '',
      status_form: 0,

    }
  },
  mounted() {

    this.get_categories();
    this.get_properties();
    this.get_currencies();
    this.get_languages();

  }, watch: {
    'selected_property': function () {
      this.get_property_groups();
    },
    'seo_summary': function () {
      // console.log("seo changed",Readability.getScore(this.seo_summary))
    }
  },
  methods: {
    load_tags({action, searchQuery, callback}) {

      if (action === ASYNC_SEARCH) {
        simulateAsyncOperation(() => {
          let options;
          var formData = new FormData();
          formData.append('search', searchQuery);
          axios.post('/api/admin/product/search_product_tags', formData, {}).then(function (response) {
            options = response.data;
            callback(null, options);
          })
              .catch(function (error) {
                console.log(error);
              });

        })
      }
    },

    uploadImageSuccess(formData, index, fileList) {

      this.product_images = fileList;// Upload image api

    },
    beforeRemove(index, done, fileList) {
      var r = confirm("remove image");

      this.product_images = fileList;
      if (r == true) {
        done()
      } else {
      }
    },
    editImage(formData, index, fileList) {
      console.log('edit data', formData, index, fileList)
    },

    get_categories() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_categories_with_children', formData, {}).then(function (response) {
        var content_cats = response.data;
        self.options_category = content_cats.orders;
      })
          .catch(function (error) {
            console.log(error);
          });

    },
    get_currencies() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/site/get_currencies', formData, {}).then(function (response) {
        var content_cats = response.data;
        self.currency_items = self.sort_array([],content_cats.data,"id","title");
        self.selected_currency = content_cats.default_unit;
      })
          .catch(function (error) {
            console.log(error);
          });

    },
    get_languages() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/site/get_languages', formData, {}).then(function (response) {
        var content_cats = response.data;
        self.language_items = content_cats.data;
      })
          .catch(function (error) {
            console.log(error);
          });

    },
    get_properties() {
      var self = this;
      var formData = new FormData();

      axios.post('/api/admin/product/get_properties', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.property_items = [];
        var obj = {label: "الگو را انتخاب کنید", value: 0}
        self.property_items.push(obj);
        content_cats.tags.forEach((val) => {
          var obj = {label: val.title, value: val.id}
          self.property_items.push(obj);
        });


        if (self.$route.params.product_id != null) {
          self.status_form = self.$route.params.product_id;
          self.get_post_info();
        }
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_property_groups() {
      var self = this;
      var formData = new FormData();
      formData.append('property_id', self.selected_property)
      axios.post('/api/admin/product/get_property_groups_with_items', formData, {}).then(function (response) {

        var content_cats = response.data;

        if (content_cats.error == 0) {
          self.property_group_items = content_cats.tags;

          self.property_group_items.forEach((val) => {
            val.items_lang  = []

            val.items.forEach((val_items) => {
              val_items.lang_values = []
self.language_items.forEach(function (lng){
  val_items.lang_values.push({value:'', lng: lng})
})
            });
          });
          self.property_group_items.forEach((val) => {

            val.items.forEach((val_items) => {
                val_items.lang_values.forEach(function (lang_item){

                  self.product_property_values.forEach((val_product) => {
                    if (
                        val_product.property_key_id == val_items.id &&
                        val_product.lng == lang_item.lng.id
                    ) {
                      lang_item.value = val_product.title
                    }
                  });

              })

            });
          });
        } else {
          self.property_group_items = [];

        }
      })
          .catch(function (error) {

            self.property_group_items = [];

            console.log(error);
          });

    },

    get_post_info() {
      var self = this;
      var formData = new FormData();
      formData.append("product_id", self.status_form)
      axios.post('/api/admin/product/get_product_info', formData, {}).then(function (response) {
        var post_data = response.data;

        post_data.post.categories.forEach((val) => {
          self.value_category.push(val.category_id);
        });
        post_data.post.tags.forEach((val) => {
          self.value_tags.push(val.tag.title.title);
        });
        self.product_property_values = post_data.post.properties;
        self.selected_property = post_data.property_id;

        self.code = post_data.post.code;
        self.product_type = post_data.post.type;
        self.favorite_url = post_data.post.favorite_url;

        self.title = post_data.post.title.title;
        self.editorData = post_data.post.title.short_description;
        self.editorData_full = post_data.post.title.description;
        self.seo_summary = post_data.post.title.meta_description;
        self.seo_title = post_data.post.title.seo_title;
        self.keyword = post_data.post.title.keyword;

        if (post_data.post.price.length>0) {
          self.product_price = post_data.post.price[0].price;
          self.product_stock = post_data.post.price[0].stock;
          self.product_off_price = post_data.post.price[0].off_price;
          self.selected_currency = post_data.post.price[0].currency_id;
          self.product_off_price_date = post_data.post.price[0].off_expire;
        }
        post_data.post.gallery.forEach((val2) => {
          var item_obj = {path: val2.image, name: val2.image_id}
          self.gallery.push(item_obj);
          self.product_images.push({path: val2.image_id, default: 1})
        });
      }).catch(function (error) {
        console.log(error);
      });


    },


    login() {

      let self = this;
      const formData = new FormData()
      let url;
      if (self.status_form == 0) {
        url = "/api/admin/product/insert_product";
      } else {
        url = "/api/admin/product/update_product";
        formData.append('product_id', this.status_form)

      }
      for (var i = 0; i < this.product_images.length; i++) {
        if( typeof this.product_images[i].name === "number"){
          console.log("typeof this.product_images[i].name number",typeof this.product_images[i].name)

          formData.append('post_images[]', this.product_images[i].name)
        }else{
          console.log("typeof this.product_images[i].name string",typeof this.product_images[i].name)

          formData.append('post_images[]', this.product_images[i].path)

        }
      }
      formData.append('property_group_items', JSON.stringify(this.property_group_items));
      formData.append('product_type', this.product_type);
      formData.append('cat_list', this.value_category);
      formData.append('tags', this.value_tags);
      formData.append('name', this.title);
      formData.append('url', this.favorite_url);
      formData.append('code', this.code);
      formData.append('text', this.editorData);
      formData.append('full_text', this.editorData_full);
      formData.append('meta_desc', this.seo_summary);
      formData.append('meta_title', this.seo_title);
      formData.append('keyword', this.keyword);
      formData.append('price', this.product_price);
      formData.append('product_stock', this.product_stock);
      formData.append('product_off_price', this.product_off_price);
      formData.append('product_off_price_date', this.product_off_price_date);
      formData.append('selected_currency', this.selected_currency);

      axios.post(url, formData, {}).then((res) => {
        console.log(res)
        self.$root.modal_component.show_api_response_modals(res);
        if (self.status_form == 0) {
          self.name = '';
          self.mobile = '';
          self.email = '';
          self.description = '';
          self.password = '';
          self.product_price = '';
          self.product_stock = '';
          self.product_off_price = '';
          self.product_off_price_date = '';
          self.selected_property = '0';
        }

      }).catch(function (error) {

        console.log(error);
      });

    }
  }
}


</script>
<style>

</style>
