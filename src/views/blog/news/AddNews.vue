<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong>ثبت نوشته</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                <CInput
                    v-model="title"

                    label="عنوان نوشته"
                    placeholder="عنوان"
                    vertical
                />
              </CCol>
              <CCol col="4">
                <CInput
                    v-model="seo_title"
                    label="سئو عنوان"
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
                    v-model="favorite_url"
                    label="لینک نوشته"

                    placeholder="لینک"
                />

              </CCol>
            </CRow>
            <CRow>

            </CRow>
            <CRow>

              <CCol col="12">
<editorjs v-if="loaded_page"
          editor_id="add_new_editor"
    :first_content.sync="content_json"
    :content_json.sync="content_json"
    :content_text.sync="content_text"
    :content_html.sync="content_html"
/>

              </CCol>

            </CRow>
            <CRow>

            </CRow>
            <CRow>
              <CCol col="12">
                <CTextarea
                    v-model="seo_summary"

                    label="سئو توضیحات"

                />

              </CCol>
            </CRow>
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
                <treeselect
                    v-model="value_category"
                    :multiple="true"
                    :normalizer="normalizer_category"
                    :append-to-body="true"
                    :options="options_category"
                    placeholder="دسته بندی نوشته را انتخاب کنید"
                />


              </CCol>
            </CRow>
            <br>

            <CRow>
              <CCol col="6">
                <ImageSelector label="تصویر"
                               :file.sync="file"
                               :preview-image="previewImage"
                />
              </CCol>


            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ثبت نوشته
            </CButton>
            <CButton v-if="status_form!=0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ویرایش نوشته
            </CButton>
          </CCardFooter>
        </CCard>
        <CCard>
          <CCardHeader>
            <CButton color="secondary" @click="reload_data_content()">
              <CIcon name="cil-reload"/>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CRow >
              <CCol>
                <ReadabilitySeoRate
                    :content.sync="content_text"
                    :html-content="content_html"
                    :meta-description="seo_summary"
                    :meta-title="seo_title"
                    :keyword="keyword"/>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CCardBody>

    </CCardBody>


  </div>

</template>

<script>
import editorjs from "@/views/includes/editorjs.vue";
import axios from "axios";

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {ASYNC_SEARCH} from '@riophae/vue-treeselect'
import ReadabilitySeoRate from "@/views/includes/ReadabilitySeoRate";

const simulateAsyncOperation = fn => {
  setTimeout(fn, 2000)
}


export default {
  name: 'Login',
  components: {
    ReadabilitySeoRate,
    Treeselect,
    editorjs
    // ckeditor: CKEditor.component
  },
  data() {

    return {
      editor: null,
      loaded_page:false,
      content_json: {},
      content_text: '',
      content_html: '',
      value_category: [],
      value_tags: [],
      value_keywords: [],
      // define options
      image_upload: '',
      options_category: [],
      normalizer_category(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },

      load_tags({action, searchQuery, callback}) {

        if (action === ASYNC_SEARCH) {
          simulateAsyncOperation(() => {
            let options;
            axios.post('/api/admin/blog/search_blog_tags', {
              search: searchQuery,

            }).then(function (response) {
              options = response.data;
              callback(null, options);
            })
                .catch(function (error) {
                  console.log(error);
                });

          })
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
      title: '',
      favorite_url: '',
      seo_title: '',
      keyword: '',
      summary: '',
      seo_summary: '',
      tags: '',
      file: null,

      previewImage: null,
      image: '',

      details: [],
      status_form: 0,

    }
  },
  mounted() {

    this.get_categories();
    if (this.$route.params.post_id != null) {
      this.status_form = this.$route.params.post_id;
      this.get_post_info();
    }else{
      this.loaded_page= true
    }
  },
  watch: {
    '$route.params.post_id': function () {
      this.get_categories();
    },
    // 'editorData': function () {
    //   let tmp = document.createElement("DIV");
    //   tmp.innerHTML = this.editorData;
    //   this.content_text = tmp.textContent || tmp.innerText || "";
    //
    //   this.content_html = this.editorData;
    // },

  },
  methods: {

    editDetails(item) {
      // this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.name = this.items[item.id].name
      this.color = this.items[item.id].color
      this.description = this.items[item.id].description
      this.previewImage = this.items[item.id].image
      this.status_form = this.items[item.id].cat_id;
      // this.$nextTick(() => {
      //     this.collapseDuration = 0
      // })
    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/blog/get_categories_with_children', formData, {}).then(function (response) {
        // console.log("cats is "+response.data.groups);
        // console.log("cats is "+items);

        var content_cats = response.data;

        // items = content_cats.orders;
        self.options_category = content_cats.orders;
        // console.log("cats is "+items);
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_post_info() {
      var self = this;
      var formData = new FormData();
      formData.append('post_id', self.status_form);
      axios.post('/api/admin/blog/post_info', formData, {}).then(function (response) {
        var post_data = response.data;

        self.previewImage = post_data.post.image;
        post_data.post.categories.forEach((val) => {
          self.value_category.push(val.category_id);
        });
        post_data.post.tags.forEach((val) => {
          self.value_tags.push(val.tag.title.title);
        });

        // self.value_category = post_data.post.categories;
        //  self.options_=post_data.post.tags;
        // self.value_keywords=post_data.post.keywords;
        self.title = post_data.post.title.title;
        self.favorite_url = post_data.post.favorite_url;
        self.content_json = JSON.parse(post_data.post.title.description);

        self.seo_summary = post_data.post.title.short_description;
        self.seo_title = post_data.post.title.seo_title;
        self.keyword = post_data.post.title.keyword;
        self.loaded_page= true

        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      }).catch(function (error) {

        console.log(error);
      });


    },


    login() {
      let self = this;
      const formData = new FormData()
      let url;
      if (self.status_form == 0) {
        url = "/api/admin/blog/insert_post";
      } else {
        url = "/api/admin/blog/update_post";
        formData.append('post_id', this.status_form)

      }

      formData.append('post_image', this.file)
      formData.append('cat_list', this.value_category)
      formData.append('tags', this.value_tags)
      formData.append('name', this.title)
      formData.append('url', this.favorite_url)
      formData.append('text', JSON.stringify(this.content_json))
      formData.append('meta_desc', this.seo_summary)
      formData.append('meta_title', this.seo_title)
      formData.append('keyword', this.keyword)

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);
        if (self.status_form == 0) {
          self.name = '';
          self.mobile = '';
          self.email = '';
          self.description = '';
          self.password = '';
          self.selected_group = '0';
          self.permissions = [];
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
