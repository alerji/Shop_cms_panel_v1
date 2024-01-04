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
                            <CCol col="4" >
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
                                        label="آدرس جایگزین"
                                        v-model="favorite_url"/>
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

                        <CRow>
                            <CCol col="6">
                                <CInput
                                        v-model="product_price"
                                        type="number"
                                        description="برای گزینه تماس بگیرید قیمت را صفر وارد کنید"
                                        label="قیمت محصول (پرداختی مشتری)"

                                />

                            </CCol>
                            <CCol col="6">
                                <CInput
                                        v-model="old_price"
                                        type="number"
                                        label="قیمت قدیم محصول(بدون تخفیف)"

                                />

                            </CCol>
                            <CCol col="6">
                                <CSelect
                                    :options="[{label:'محصول فیزیکی',value:1},{label:'محصول دانلودی',value:2}]"
                                        :value.sync="product_type"

                                        label="نوع محصول"

                                />

                            </CCol>
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
                                        v-model="value_keywords"
                                        :multiple="true"
                                        :async="true"
                                        :load-options="load_keywords"
                                        placeholder="انتخاب کلمات کلیدی"
                                        :normalizer="normalizer_keywords"
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

                        </CRow>

                        <CRow>

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
                                        sorter
                                        pagination
                                >

                                    <template #group="{item}">

                                        <td>
                                            <p class="text-muted">{{item.name}}</p>

                                        </td>

                                    </template>

                                    <template #property="{item}">
                                        <CDataTable
                                                :items="item.items"
                                                :fields="fields_properties_items"
                                                :items-per-page="20"
                                                hover
                                                sorter
                                                pagination
                                        >

                                            <template #title="{item}">

                                                <td>
                                                    <p class="text-muted">{{item.name}}</p>

                                                </td>

                                            </template>

                                            <template #value="{item}">

                                                <td>
                                                    <CInput
                                                            v-model="item.value"
                                                            placeholder="مقدار ویژگی"

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
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    var items_role = [];

    const fields_role = [
        {key: 'نام', _style: 'width:20%'},
        {key: 'دسترسی', _style: 'width:20%'},
    ];

    var items_group = [];


    const fields_group = [
        {key: 'نام', _style: 'width:20%'},
        {key: 'دسترسی', _style: 'width:20%'},


    ];
    import {ASYNC_SEARCH} from '@riophae/vue-treeselect'

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
                value_keywords: [],
                product_images: [],
                related_products: [],
                // define options
                selected_property: 0,
                property_items: [],
                selected_color: [],
                colors_items: [],
                property_group_items: [],
                property_group_items_product: [],
                fields_properties: [
                    {key: 'group',label: 'گروه', _style: 'width:20%'},
                    {key: 'property',label: 'ویژگی', _style: 'width:80%'},
                ],
                fields_properties_items: [
                    {key: 'title',label: 'عنوان', _style: 'width:20%;display:none'},
                    {key: 'value',label: 'مقدار', _style: 'width:80%;display:none'},
                ],
                image_upload: '',
                options_category: [],
                normalizer_category(node) {
                    return {
                        id: node.cat_id,
                        label: node.name,
                        children: node.subcategories,
                    }
                },
              normalizer_color(node) {
                    return {
                        id: node.value,
                        label: node.label,
                    }
                },
                load_keywords({action, searchQuery, callback}) {

                    if (action === ASYNC_SEARCH) {
                        simulateAsyncOperation(() => {
                            let options;
                            var formData = new FormData();
                            formData.append('search',searchQuery);
                            axios.post('/api/admin/product_search-keywords', formData,{}).then(function (response) {
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
                normalizer_keywords(node) {
                    return {
                        id: node.keyword_title,
                        label: node.keyword_title,
                    }
                },
                load_tags({action, searchQuery, callback}) {

                    if (action === ASYNC_SEARCH) {
                        simulateAsyncOperation(() => {
                            let options;
                            var formData = new FormData();
                            formData.append('search',searchQuery);
                            axios.post('/api/admin/product_search-tags', formData,{}).then(function (response) {
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
                        id: node.tag_title,
                        label: node.tag_title,
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
                seo_title: '',
                summary: '',
                seo_summary: '',
                product_price: '',
                old_price: '',
                tags: '',
                keywords: '',
                file: '',
                video: '',
                pattern_image_file: '',

                previewImage: '',
                image: '',
                group_items: items_group.map((item, id) => {
                    return {...item, id}
                }),
                fields_group,
                              details: [],
                collapseDuration: 0,
                status_form: 0,
                options: [
                    {text: 'One', value: 'A'},
                    {text: 'Two', value: 'B'},
                    {text: 'Three', value: 'C'}
                ]
            }
        },
        mounted() {

            this.get_categories();
            this.get_properties();
            this.get_colors();

        }, watch: {
            'selected_property': function () {
                this.get_property_groups();
            }
        },
        methods: {
            uploadImageSuccess(formData, index, fileList) {
                console.log('formData', formData)
                console.log('index', index)
                console.log('fileList', fileList)

                this.product_images = fileList;// Upload image api
                // axios.post('http://your-url-upload', formData).then(response => {
                //   console.log(response)
                // })
            },
            beforeRemove(index, done, fileList) {
                console.log('index', index, fileList);
                var r = confirm("remove image");
                // var new_products = [];
                // for (var i = 0; i < this.product_images.length; i++) {
                //     if (i != index) {
                //         new_products.push(this.product_images[i]);
                //     }
                // }
                this.product_images = fileList;
                if (r == true) {
                    done()
                } else {
                }
            },
            editImage(formData, index, fileList) {
                console.log('edit data', formData, index, fileList)
            },
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = this.items[item.id].name;
                this.color = this.items[item.id].color;
                this.description = this.items[item.id].description;
                this.previewImage = this.items[item.id].image;
                this.status_form = this.items[item.id].cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            get_categories() {
                var self = this;
                var formData = new FormData();
                axios.post('/api/product_all-categories',formData, {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.options_category = content_cats.data;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            get_properties() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);
              var formData = new FormData();

                axios.post('/api/admin/get_product_property-templates',formData, {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.property_items = [];
                    // console.log("cats is "+items);
                    // self.description = '';
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
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            get_property_groups() {
                var self = this;
              var formData = new FormData();
              formData.append('property_id',self.selected_property)
                axios.post('/api/admin/get_product_property-groups-items',formData, {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    if (content_cats.error == 0) {
                        self.property_group_items = content_cats.tags;
                        console.log("sadsd " + " " + self.property_group_items)

                        self.property_group_items.forEach((val) => {
                            console.log("sadsd " + " " + val.items)

                            val.items.forEach((val_items) => {
                                console.log("sadsd " + " " + val_items.id)

                                self.property_group_items_product.forEach((val_product) => {
                                    console.log("sadsd " + val_product.property_key_id + " " + val_items.id)
                                    if (val_product.property_key_id == val_items.id) {
                                        val_items.value = val_product.property_value
                                    }
                                });
                            });
                        });
                    } else {
                        self.property_group_items = [];

                    }
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        self.property_group_items = [];

                        console.log(error);
                    });

            },

            get_keywords(search) {
                var self = this;
                axios.post('/api/admin/product_search-keywords', {
                    search: search,

                }).then(function (response) {
                    return response.data
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
                formData.append("product_id",self.status_form)
                axios.post('/api/admin/get_product_info' ,formData, {}).then(function (response) {
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
                    self.selected_property = post_data.post.properties_group;
                    self.title = post_data.post.title;
                    self.code = post_data.post.code;
                    self.product_type = post_data.post.product_type;
                    self.favorite_url = post_data.post.favorite_url;
                    self.editorData = post_data.post.summary;
                    self.editorData_full = post_data.post.full_summary;
                    self.seo_summary = post_data.post.meta_description;
                  post_data.post.color.forEach(function (val){
                    self.selected_color.push( parseInt(val.color_id));

                  })

                    self.seo_title = post_data.post.seo_title;
                    self.property_group_items_product = post_data.post.properties;
                    if (post_data.post.price != null) {
                        self.product_price = post_data.post.price.price;
                        self.old_price = post_data.post.price.old_price;
                    }
                    post_data.post.gallery.forEach((val2) => {
                        var item_obj = {path: val2.product_image, name: val2.image}
                        self.gallery.push(item_obj);
                        self.product_images.push({path: val2.product_image,default:1})
                    });
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                }).catch(function (error) {
                    console.log(error);
                });


            },


            goRegister() {
                this.$router.push({path: 'register'});
            },
            goSubCategories(item, index) {

                this.$router.push({path: '/categories/' + this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            get_colors() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);
                var formData = new FormData();
                axios.post('/api/get_product_colors', formData, {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.colors_items = [];

                    content_cats.forEach(function (val) {
                        self.colors_items.push({label: val.name, value: val.id})
                    })
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            handleFileUpload() {
                this.file = this.$refs.file.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.previewImage = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
            },
            handlePatternImageUpload() {
                this.pattern_image_file = this.$refs.pattern_image.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        // this.previewImage = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
            },
            handleVideoUpload() {
                this.video = this.$refs.video.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                // if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                // var reader = new FileReader();
                // // Define a callback function to run, when FileReader finishes its job
                // reader.onload = (e) => {
                //     // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                //     // Read image as base64 and set to imageData
                //     this.previewImage = e.target.result;
                // }
                // Start the reader job - read file as a data url (base64 format)
                // reader.readAsDataURL(input.files[0]);
                // }
            },
            login() {


                let self = this;
                const formData = new FormData()
                let url;
                if (self.status_form == 0) {
                    url = "/api/admin/product";
                } else {
                    url = "/api/admin/product/update";
                    formData.append('post_id', this.status_form)

                }
                console.log("product images",this.product_images)
                for (var i = 0; i < this.product_images.length; i++) {
                    formData.append('post_images[]', this.product_images[i].path)
                }
                formData.append('related_products', JSON.stringify(this.related_products));
                formData.append('property_group_items', JSON.stringify(this.property_group_items));
                formData.append('post_image', this.file);
                formData.append('product_type', this.product_type);
                formData.append('form_post_cat_list', this.value_category);
                formData.append('form_post_tags', this.value_tags);
                formData.append('form_post_keywords', this.value_keywords);
                formData.append('form_post_name', this.title);
                formData.append('form_post_url', this.favorite_url);
                formData.append('code', this.code);
                formData.append('form_post_text', this.editorData);
                formData.append('form_post_full_text', this.editorData_full);
                formData.append('form_post_meta_desc', this.seo_summary);
                formData.append('form_post_meta_title', this.seo_title);
                formData.append('form_post_meta_price', this.product_price);
                formData.append('old_price', this.old_price);
                formData.append('product_video', this.video);
                formData.append('pattern_image_file', this.pattern_image_file);
                formData.append('product_color', JSON.stringify(this.selected_color));
                formData.append('token', localStorage.getItem("token"));

                // formData.append('is_admin', 1)
                // formData.append('role_group', this.selected_group)
                // formData.append('roles', self.$refs.permissions)
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
                        self.old_price = '';
                        self.selected_property = '0';
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
