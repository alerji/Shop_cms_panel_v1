<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong v-if="status_form==0">ثبت محصول</strong>
            <strong v-if="status_form!=0">ویرایش محصول</strong>
            <CButton color="info" @click="digikala_modal=true">افزودن از سایت دیگر</CButton>
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
                <SeoProgress :min_perfect="50" :max_perfect="60" :string="seo_title"/>

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

                <editorjs v-if="loaded_page"
                          editor_id="add_new_editor"
                          key="add_new_editor"
                          :first_content.sync="content_json"
                          :content_json.sync="content_json"
                          :content_text.sync="content_text"
                          :content_html.sync="content_html"
                />

              </CCol>
              <CCol col="12">
                توضیحات کامل
                <editorjs v-if="loaded_page"
                          editor_id="add_new_editor_full"
                          key="add_new_editor_full"

                          :first_content.sync="content_json_full"
                          :content_json.sync="content_json_full"
                          :content_text.sync="content_text_full"
                          :content_html.sync="content_html_full"
                />


              </CCol>

            </CRow>
            <hr>

            <CCol col="12">
              <CTextarea
                  v-model="seo_summary"
                  rows="8"
                  label="سئو توضیحات"

              />
              <SeoProgress :min_perfect="120" :max_perfect="150" :string="seo_summary"/>

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

                    description="برای گزینه تماس بگیرید قیمت را صفر وارد کنید"
                    label="قیمت محصول"

                />

              </CCol>
              <CCol col="4">
                <CInputCurrency
                    v-model="product_stock"

                    label="موجودی محصول"

                />

              </CCol>
              <CCol col="4">
                <CSelect
                    label="ارز"

                    :options="currency_items"
                    :value.sync="selected_currency"/>

              </CCol>
              <CCol col="4">
                <CInput
                    v-model="order_point"
                    label="نقطه سفارش"

                />
              </CCol>
              <CCol col="4">
                <CInputCurrency
                    v-model="product_off_price"
                    label="قیمت ویژه(تخفیف)"

                />

              </CCol>
              <CCol col="4">
                <div>محدودیت زمان تخفیف</div>
                <date-picker
                    v-model="product_off_price_date"
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
                      :flat="true"
                      :normalizer="normalizer_category"
                      :options="options_category"
                      placeholder="دسته بندی محصول را انتخاب کنید"
                  />

                </div>

              </CCol>
              <CCol col="4">
                <div class="control_wrapper">
                  <treeselect
                      v-model="value_brand"
                      :multiple="false"
                      :normalizer="normalizer_brand"

                      :options="options_brand"
                      placeholder="برند محصول را انتخاب کنید"
                  />

                </div>

              </CCol>
              <CCol col="4">
                <div class="control_wrapper">
                  <treeselect
                      v-model="value_label"
                      :multiple="false"
                      :normalizer="normalizer_category"
                      :options="options_label"
                      placeholder="لیبل محصول را انتخاب کنید"
                  />

                </div>

              </CCol>
              <CCol col="4">

                <ImageSelector label="گالری تصویر"
                               v-if="show_gallery"
                               :media_id.sync="gallery"
                               :multiple="true"
                               default_archive="products"
                               :preview-image="previewImage"
                />
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
                <CDataTableFixed
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
                    <CDataTableFixed
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

                    </CDataTableFixed>


                  </template>

                </CDataTableFixed>

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

    <CModal
        :show.sync="digikala_modal"
        :no-close-on-backdrop="false"
        color="transparent"
        border-color="primary"
    >

      <CRow>
        <CCol col="12">
          <CSelect :value.sync="digikala_modal_selected_type"
                   :options="digikala_modal_types"
                   label="سایت مبدا"
          />
        </CCol>
        <CCol col="12">
          <CInput v-model="digikala_link"
                  label="لینک محصول"
          />
        </CCol>
        <CCol col="12" style="display: inline-flex;align-self: center; gap: 10px;">
          <CSwitch
              color="success"
              shape="pill"
              :checked.sync="digikala_modal_download_image"
          />
          <label>دانلود تصاویر</label>

        </CCol>
      </CRow>

      <template #footer>
        <CButton @click="digikala_modal = false,get_digikala_data()" color="dark">انتخاب</CButton>
        <CButton @click="digikala_modal = false" color="dark">انصراف</CButton>

      </template>
    </CModal>
  </div>

</template>

<script>
import axios from "axios";

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)
import VueUploadMultipleImage from 'vue-upload-multiple-image'


import Vue from "vue";

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


import {ASYNC_SEARCH} from '@riophae/vue-treeselect'
import editorjs from "@/views/includes/editorjs.vue";
// import  Readability from "@/plugins/readability";

const simulateAsyncOperation = fn => {
  setTimeout(fn, 200)
}

export default {
  name: 'Login',
  components: {
    editorjs,
    Treeselect,
    VueUploadMultipleImage,
  },
  data() {

    return {
      loaded_page: false,
      content_json: {},
      content_text: '',
      content_html: '',

      content_json_full: {},
      content_text_full: '',
      content_html_full: '',

      previewImage: null,
      gallery: [],
      product_type: 1,
      value_label: null,
      options_label: [],
      value_brand: null,
      options_brand: [],
      value_category: [],
      value_tags: [],
      related_products: [],
      selected_property: 0,
      property_items: [],
      language_items: [],
      currency_items: [],
      selected_currency: 0,
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
      normalizer_brand(node) {
        return {
          id: node.id,
          label: node.title.title,
        }
      },

      normalizer_tags(node) {
        return {
          id: node.title,
          label: node.title,
        }
      },

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
      order_point: 0,
      product_stock: '',
      product_off_price: '',
      product_off_price_date: '',
      tags: '',
      digikala_modal: false,
      digikala_modal_types: [{label: 'دیجیکالا', value: 1}, {label: 'وردپرس', value: 2}],
      digikala_modal_selected_type: 1,
      digikala_modal_download_image: true,
      show_gallery: true,
      digikala_link: '',
      status_form: 0,

    }
  },
  mounted() {

    this.get_categories();
    this.get_brands();
    this.get_product_labels();
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
    get_digikala_data() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();
      formData.append("url", this.digikala_link)
      formData.append("download_image", this.digikala_modal_download_image)
      let url = '/api/admin/product/import_digikala'
      if (this.digikala_modal_selected_type == 2) {
        url = '/api/admin/product/import_wordpress'
      }
      axios.post(url, formData, {}).then(function (response) {
        self.show_gallery = false
        self.loaded_page = false
        var contents = response.data;
        if(self.digikala_modal_selected_type==1){
          self.title = contents.data.product.title_fa
          self.seo_title = contents.data.seo.title
          self.content_json_full = {time: 1708248359501,
            blocks: [{
              id: "DSM8JadA6h",
              type: "paragraph",
              data: {text: contents.data.product.expert_reviews.description, alignment: "right"}
            }],
            version: "2.28.2"
          }
          console.log("json", self.content_json_full)
          self.content_json = {time: 1708248359501,
            blocks: [{
              id: "DSM8JadA6h",
              type: "paragraph",
              data: {text: contents.data.product.expert_reviews.description, alignment: "right"}
            }],
            version: "2.28.2"
          }
          self.seo_summary = contents.data.seo.description
          self.product_price = parseInt(contents.data.product.default_variant.price.rrp_price) / 10
          setTimeout(function () {
            self.show_gallery = true

          }, 1000)


          try{
            setTimeout(function () {
              self.loaded_page = true
              contents.data.product.images.list.forEach(function (val) {
                self.gallery.push(val.image_id)
              })
            }, 700)
          }catch (e) {

          }
        }
        if(self.digikala_modal_selected_type==2){
          var txt = document.createElement("textarea");
          txt.innerHTML = contents.name;
          self.title = txt.value
          self.seo_title = txt.value

          txt.innerHTML = contents.description;
          self.content_json_full = {time: 1708248359501,
            blocks: [{
              id: "DSM8JadA6h",
              type: "paragraph",
              data: {text: txt.value, alignment: "right"}
            }],
            version: "2.28.2"
          }
          self.seo_summary = txt.value.replace(/<[^>]*>?/gm, '');


          txt.innerHTML = contents.short_description;
          self.content_json = {time: 1708248359501,
            blocks: [{
              id: "DSM8JadA6h",
              type: "paragraph",
              data: {text: txt.value, alignment: "right"}
            }],
            version: "2.28.2"
          }
          setTimeout(function () {
            self.show_gallery = true

          }, 1000)
try{
  setTimeout(function () {
    self.loaded_page = true
    contents.images.forEach(function (val) {
      self.gallery.push(val.image_id)
    })
  }, 700)
}catch (e) {

}

        }




      })
          .catch(function (error) {
            console.log(error);
          });

    },

    load_tags({action, searchQuery, callback}) {

      if (action === ASYNC_SEARCH) {
        simulateAsyncOperation(() => {
          let options;
          var formData = new FormData();
          formData.append('search', searchQuery);
          axios.post('/api/admin/product/search_product_tags', formData, {show_pros:false}).then(function (response) {
            options = response.data;
            callback(null, options);
          })
              .catch(function (error) {
                console.log(error);
              });

        })
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
    get_brands() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_brands', formData, {}).then(function (response) {
        var content_cats = response.data;
        self.options_brand = content_cats.orders;
      })
          .catch(function (error) {
            console.log(error);
          });

    },
    get_product_labels() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_label', formData, {}).then(function (response) {
        var content_cats = response.data;
        self.options_label = content_cats.orders;
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
        self.currency_items = self.sort_array([], content_cats.data, "id", "title");
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
        } else if (self.$route.params.clone_product_id != null) {
          self.status_form = self.$route.params.clone_product_id;
          self.get_post_info();
        } else {
          self.loaded_page = true
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
            val.items_lang = []

            val.items.forEach((val_items) => {
              val_items.lang_values = []
              self.language_items.forEach(function (lng) {
                val_items.lang_values.push({value: '', lng: lng})
              })
            });
          });
          self.property_group_items.forEach((val) => {

            val.items.forEach((val_items) => {
              val_items.lang_values.forEach(function (lang_item) {

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
        self.favorite_url = post_data.post.title.slug;

        self.title = post_data.post.title.title;
        self.content_json = post_data.post.title.short_description;
        self.content_json_full = post_data.post.title.description;
        self.seo_summary = post_data.post.title.meta_description;
        self.seo_title = post_data.post.title.seo_title;
        self.keyword = post_data.post.title.keyword;
        if (post_data.post.brand) {
          self.value_brand = post_data.post.brand.brand_id;
        }
        if (post_data.post.label) {
          self.value_label = post_data.post.label.label_id;
        }
        if (post_data.post.price_no != null) {
          self.product_price = post_data.post.price_no.price;
          self.product_stock = post_data.post.price_no.stock;
          self.product_off_price = post_data.post.price_no.off_price;
          self.order_point = post_data.post.price_no.order_point;
          self.selected_currency = post_data.post.price_no.currency_id;
          self.product_off_price_date = post_data.post.price_no.off_expire;
        }
        post_data.post.gallery.forEach((val2) => {
          self.gallery.push(val2.image_id);
        });
        self.loaded_page = true
        if (self.$route.params.clone_product_id != null) {
          self.status_form = 0
        }
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
      for (var i = 0; i < this.gallery.length; i++) {

          formData.append('post_images[]', this.gallery[i])

      }
      formData.append('property_group_items', JSON.stringify(this.property_group_items));
      formData.append('product_type', this.product_type);
      formData.append('cat_list', this.value_category);
      formData.append('tags', this.value_tags);
      formData.append('brand_id', this.value_brand);
      formData.append('label_id', this.value_label);
      formData.append('name', this.title);
      formData.append('url', this.favorite_url);
      formData.append('code', this.code);
      formData.append('text', JSON.stringify(this.content_json));
      formData.append('full_text', JSON.stringify(this.content_json_full));
      formData.append('meta_desc', this.seo_summary);
      formData.append('meta_title', this.seo_title);
      formData.append('keyword', this.keyword);
      formData.append('price', this.product_price);
      formData.append('product_stock', this.product_stock);
      formData.append('order_point', this.order_point);
      formData.append('product_off_price', this.product_off_price);
      formData.append('product_off_price_date', this.product_off_price_date);
      formData.append('selected_currency', this.selected_currency);

      axios.post(url, formData, {}).then((res) => {
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
          self.order_point = 0;
          self.product_off_price_date = '';
          self.selected_property = '0';
          if(res.data.error==0){
            self.$router.push({path:"/dashboard/products/edit/" + res.data.id})
          }
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
