<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong>ثبت خبر</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                <CInput
                    v-model="title"

                    label="عنوان خبر"
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
                    v-model="favorite_url"
                    label="لینک خبر"

                    placeholder="لینک"
                />

              </CCol>
            </CRow>
            <CRow>

            </CRow>
            <CRow>
              <CCol col="12">
                <Vueditor style="height: 400px" ref="editor1"></Vueditor>


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
                    placeholder="دسته بندی خبر را انتخاب کنید"
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
            <CRow>


            </CRow>

            <CRow>
              <CCol col="12">


              </CCol>

            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form==0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ثبت خبر
            </CButton>
            <CButton v-if="status_form!=0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ویرایش خبر
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

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


import {ASYNC_SEARCH} from '@riophae/vue-treeselect'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 2000)
}

export default {
  name: 'Login',
  components: {
    Treeselect,
    // ckeditor: CKEditor.component
  },
  data() {

    return {
      editor: null,
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
            axios.post('/api/admin/blog/search-tags', {
              search: searchQuery,

            }).then(function (response) {
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
      normalizer_tags(node) {
        return {
          id: node.title,
          label: node.title,
        }
      },
      // editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        extraPlugins: [],

        language: 'fa'
        // The configuration of the editor.
      },
      title: '',
      favorite_url: '',
      seo_title: '',
      summary: '',
      seo_summary: '',
      tags: '',
      file: '',

      previewImage: null,
      image: '',

      details: [],
      status_form: 0,

    }
  },
  mounted() {

    this.editor = this.$refs['editor1'];
    this.editor.setContent('');
    this.editor.getContent();
    this.editor.upload = function (obj, callback) {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('upload', obj.files[0]);
      xhr.open('POST', axios.defaults.baseURL + 'api/admin/html_uploader');
      // xhr.setRequestHeader('Content-type', 'application/json')

      xhr.send(formData);
      xhr.onload = function () {
        callback(xhr.responseText);
      };
      xhr.onerror = function (err) {
        console.log(err);
      }
    }
    this.get_categories();
    if (this.$route.params.post_id != null) {
      this.status_form = this.$route.params.post_id;
      this.get_post_info();
    }
  }, watch: {
    '$route.params.post_id': function (id) {
      this.get_categories();
    }
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
      axios.post('/api/admin/post_info', formData, {}).then(function (response) {
        var post_data = response.data;

        self.previewImage = post_data.post.image;
        post_data.post.categories.forEach((val) => {
          self.value_category.push(val.cat_id);
        });
        post_data.post.tags.forEach((val) => {
          self.value_tags.push(val.name);
        });
        post_data.post.keywords.forEach((val) => {
          self.value_keywords.push(val.name);
        });
        // self.value_category = post_data.post.categories;
        //  self.options_=post_data.post.tags;
        // self.value_keywords=post_data.post.keywords;
        self.title = post_data.post.title;
        self.favorite_url = post_data.post.favorite_url;
        self.editorData = post_data.post.summary;
        self.editor.setContent(post_data.post.summary)
        self.seo_summary = post_data.post.meta_description;
        self.seo_title = post_data.post.seo_title;

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
      formData.append('text', this.editor.getContent())
      formData.append('meta_desc', this.seo_summary)
      formData.append('meta_title', this.seo_title)

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
