<template>
    <div>
        <CRow>
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>ویرایش چیدمان</strong>
                        <div class="card-header-actions">
                            <a
                                href="https://coreui.io/vue/docs/components/form-components"
                                class="card-header-action"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="name"

                                    label="عنوان"
                                    placeholder="عنوان"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">

                                <select v-model="selected_type" class="form-control" v-on:change="type_changed()">
                                    <option value="0">
                                        نوع ابزار را انتخاب کنید
                                    </option>
                                    <option v-for="option in type_items" v-bind:value="option.type_id">
                                        {{ option.name }}
                                    </option>
                                </select>

                            </CCol>
                        </CRow>
                        <br>

                        <CRow>
                            <CCol col="12" v-if="selected_type === 2">

                                <select v-model="selected_category" class="form-control" v-on:change="type_changed()">
                                    <option value="0">
                                        دسته بندی را انتخاب کنید
                                    </option>
                                    <option v-for="option in category_items" v-bind:value="option.cat_id">
                                        {{ option.name }}
                                    </option>
                                </select>

                            </CCol>
                        </CRow>
<br>
                        <CRow>
                            <CCol col="12" v-if="selected_type === 1 || selected_type === 2">

                                <select v-model="selected_template" class="form-control"
                                >
                                    <option value="0">
                                        نوع قالب را انتخاب کنید
                                    </option>
                                    <option v-for="option in templates_items" v-bind:value="option.template_id">
                                        {{ option.name }}
                                    </option>
                                </select>

                            </CCol>
                        </CRow>
                        <br>
                        <CRow>
                            <CCol col="12" v-if="selected_type === 1 || selected_type === 2">
                                <CInput
                                    v-model="post_count"
                                    type="number"
                                    label="تعداد پست"
                                    placeholder="تعداد پست"

                                />
                            </CCol>
                        </CRow>

                        <br>
                        <CRow v-if="selected_type === 3 || selected_type === 5">
                            <CCol col="12">
                                <CTextarea
                                    v-model="text"

                                    label="متن"
                                    placeholder="متن"
                                    horizontal
                                    rows="4"
                                />

                            </CCol>
                        </CRow>
                        <CRow v-if="selected_type === 4">
                            <CCol col="12">
                                <CCard>
                                    <CCardHeader>بارگذاری تصویر</CCardHeader>
                                    <CCardBody>
                                        <CCol col="6">

                                            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

                                        </CCol>
                                        <CCol col="6">

                                            <CImg height="250px"
                                                  width="250px"
                                                  v-model="previewImage"
                                                  v-if="previewImage" :src="previewImage"
                                            />

                                        </CCol>

                                    </CCardBody>
                                </CCard>

                            </CCol>


                        </CRow>
                        <CRow v-if="selected_type === 4">
                            <CCol col="12">
                                <CInput
                                    v-model="link"

                                    label="لینک"
                                    placeholder="لینک را وارد کنید"
                                />
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="row_no"
                                    type="number"
                                    label="ردیف چیدمان"
                                    placeholder="ردیف چیدمان را وارد کنید"
                                />
                            </CCol>
                        </CRow>
                    </CCardBody>
                    <CCardFooter>

                        <CButton v-if="status_form !=0 "
                                 @click="login()"
                                 type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش گروه
                        </CButton>

                        <CButton v-if="status_form !=0 "
                                 @click="clear_edit()"
                                 type="submit" ref="submit_form" size="sm" color="danger"><CIcon name="cil-check-circle"/>انصراف </CButton>


                        <CButton
                            v-if="status_form == 0"

                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            افزودن سطر
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

        <CCardBody>

            <CDataTableFixed
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
                <template #row="{item}">

                    <td>
                        <p class="text-muted">{{item.row_id+1}}</p>

                    </td>

                </template>
                <template #نام="{item}">

                    <td>
                        <p class="text-muted">{{item.name}}</p>

                    </td>

                </template>

                <template #نوع="{item}">

                    <td>
                        <p class="text-muted">{{item.type_name}}</p>

                    </td>

                </template>

                <template #چیدمان="{item}">

                    <td>
                        <p class="text-muted">{{item.row_no}}</p>

                    </td>

                </template>


                <template #عملیات="{item,index}">
                    <td class="py-2">
                        <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="editDetails(item)"
                        >ویرایش
                        </CButton>
                        <CButton
                            color="danger"
                            variant="outline"
                            square
                            size="sm"
                            @click="delete_item_dialog(item)"
                        ><CIcon name="cil-trash" size="sm"/>
                        </CButton>
                    </td>
                </template>


            </CDataTableFixed>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";
    import  { bus } from '../../../main';

    var items = [

    ];

    var type_items = [

    ];

    var type_items = [
        {type_id: 'One', name: 'A'},
        {type_id: 'Two', name: 'B'},
        {type_id: 'Three', name: 'C'}
    ];
    const fields = [
      {key: 'row',label: '#', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},
        {key: 'نوع', _style: 'width:10%'},
        {key: 'چیدمان', _style: 'width:10%;'},
        {key: 'عملیات', _style: 'width:20%;'},


    ];


    export default {
        name: 'Login',
        data() {
            return {
              confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

                name: '',
                post_count: '',
                file: '',
                previewImage: '',
                text: '',
                link: '',
                selected_type: 0,
                row_no: 0,
                selected_category: 0,
                selected_template: 0,
                items: items.map((item, row_id) => {
                    return {...item, row_id}
                }),
                fields,
                type_items: [
                    {type_id: 'One', name: 'A'},
                    {type_id: 'Two', name: 'B'},
                    {type_id: 'Three', name: 'C'}
                ],
                templates_items: [
                    {template_id: 'One', name: 'A'},
                    {template_id: 'Two', name: 'B'},
                    {template_id: 'Three', name: 'C'}
                ],
                category_items: [
                    {cat_id: 'One', name: 'A'},
                    {cat_id: 'Two', name: 'B'},
                    {cat_id: 'Three', name: 'C'}
                ],
                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_categories();
            this.get_rows();
            this.get_types();
            this.get_templates();
            bus.$on(this.confirm_delete_name, (data) => {
                // alert(data);
                if (data == 'true') {
                    this.delete_item();

                } else {
                    this.status_form = 0;
                }
            });

        }, watch: {
            '$route.params.cat_id': function (id) {
                this.get_rows();
            }
        },
        methods: {

            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                console.log(this.items[item.row_id]);

                this.name = this.items[item.row_id].name;
                this.link = this.items[item.row_id].link;
                this.selected_category = this.items[item.row_id].cat_id;
                this.row_no = this.items[item.row_id].row_no;
                this.previewImage = this.items[item.row_id].image;
                this.post_count = this.items[item.row_id].post_count;
                this.text = this.items[item.row_id].text;
                this.selected_type = this.items[item.row_id].type_id;


                for(var i=0;i<this.templates_items.length;i++){
                    if(this.templates_items[i].file == this.items[item.row_id].template_file){
                        this.selected_template = this.templates_items[i].template_id;
                    }
                }

                this.status_form = this.items[item.row_id].section_id;


                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            }, clear_edit() {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = '';
                this.link = '';
                this.selected_category = 0;
                this.row_no = 0;
                this.previewImage = '';
                this.post_count = 0;
                this.text = '';
                this.selected_template=0;


                this.file = '';



                this.status_form = 0;



                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },

            get_rows() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/section-rows/' + this.$route.params.section_id, {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items = content_cats.rows.map((item, row_id) => {
                        return {...item, row_id}
                    }),
                        fields;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            delete_item_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],this.confirm_delete_name);
                // this.$refs.modal2.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');
                // console.log(this.$el.modal2.title2);
                // console.log(this.modals2.title2);
                // console.log(this.$root.modal2.title2);
                // console.log(this.$root.modal_component.title2);
                // console.log(this.modal2.title2);

                // this.$set(this.items[item.id], '_toggled', !item._toggled)

                this.status_form = this.items[item.row_id].section_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },delete_item(){


            let self = this;
            const formData = new FormData()
            let url;
                url = "/api/admin/add_section_content/delete";


            formData.append('row_id', this.status_form);

            axios.post(url, formData, {
            }).then((res) => {
                console.log(res);
                if(res.data.error==1){
                    this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

                }else{
                    this.$root.modal_component.show_success_modal('تایید',res.data.msg);

                }
                self.status_form=0;

                self.get_rows();


            })
                .catch(function (error) {

                    console.log(error);
                });
// this.get_categories();
            // this.$router.push({ path: '/posts/'});
        },
            get_categories() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/all-of-categories', {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.category_items = content_cats.data;

                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },

            get_types() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/section-rows-types', {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.type_items = content_cats.types;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            get_templates() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/section-rows-templates', {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.templates_items = content_cats.templates;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            type_changed() {
                //  alert('type changed to '+this.selected_type)
            },
            goSubCategories(item, index) {

                this.$router.push({path: '/categories/' + this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
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
            login() {


                let self = this;
                const formData = new FormData();
                let url;
                if(this.status_form==0){
                    url = "/api/admin/add_section_content";

                }else{
                    url = "/api/admin/add_section_content/update";
                    formData.append('row_id', self.status_form);

                }


                formData.append('image', self.file);
                formData.append('name', self.name);
                formData.append('post_count', self.post_count);
                formData.append('text', self.text);
                formData.append('selected_type', self.selected_type);
                formData.append('selected_template', self.selected_template);
                formData.append('link', self.link);
                formData.append('row_no', self.row_no);
                formData.append('section_id', self.$route.params.section_id);
                formData.append('cat_id', self.selected_category);


                axios.post(url, formData, {}).then((res) => {
                    console.log(res);
                    self.status_form=0;
                    this.$root.modal_component.show_api_response_modals(res);

                    self.name = '';
                    self.color = '';
                    self.description = '';
                    self.previewImage = '';
                    self.post_count = '';
                    self.file = '';
                    self.previewImage = '';
                    self.text = '';
                    self.link = '';
                    self.selected_type = 0;
                    self.row_no = 0;
                    self.selected_category = 0;
                    self.selected_template = 0;
                    self.get_rows();


                }).catch(function (error) {

                    console.log(error);
                });

            }
        }
    }


</script>
