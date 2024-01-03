<template>
    <div>
        <CRow>
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>افزودن تصویر</strong>
                        <div class="card-header-actions">
                            <a
                                href="https://coreui.io/vue/docs/components/form-components"
                                class="card-header-action"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <small class="text-muted"></small>
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="name"

                                    label="نام"
                                    placeholder="نام"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="summary"

                                    label="توضیحات اسلایدر"
                                    placeholder="توضیحات را وارد کنید"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="order_no"

                                    label="ترتیب"
                                    placeholder="ترتیب"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CSelect
                                        label="محل قرارگیری توضیحات"
                                        horizontal
                                        :value.sync="selectedPosition"
                                        :options="selectPositions"
                                        placeholder="Please select"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="link"

                                    label="لینک"
                                    placeholder="http://example.com"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="4">

                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

                                <CImg height="250px"
                                      width="250px"
                                      v-model="previewImage"
                                      v-if="previewImage" :src="previewImage"
                                />
                            </CCol>


                        </CRow>

                    </CCardBody>
                    <CCardFooter>
                        <CButton
                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            افزودن تصویر
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

        <CCardBody>

            <CDataTable
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >

                <template #ردیف="{item}">

                    <td>
                        <p class="text-muted">{{item.id}}</p>

                    </td>

                </template>
                <template #نام="{item}">

                    <td>
                        <p class="text-muted">{{item.name}}</p>

                    </td>

                </template>
                <template #توضیحات="{item}">

                    <td>
                        <p class="text-muted">{{item.summary}}</p>

                    </td>

                </template>
                <template #لینک="{item}">

                    <td>
                        <p class="text-muted">{{item.link}}</p>

                    </td>

                </template>
                <template #ترتیب="{item}">

                    <td>
                        <p class="text-muted">{{item.order_no}}</p>

                    </td>

                </template>

                <template #تصویر="{item}">


                    <td>
                        <CImg width="50px" height="50px" v-bind:src="item.image"/>
                    </td>

                </template>

                <template #عملیات="{item}">
                    <td class="py-2">
                        <CButton
                            color="danger"
                            variant="outline"
                            square
                            size="sm"
                            @click="delete_item_dialog(item)"
                        >حذف
                        </CButton>

                    </td>
                </template>


            </CDataTable>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../main";

    var items = [

    ];

    const fields = [
        {key: 'ردیف', _style: 'width:20%'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'توضیحات', _style: 'width:20%'},
        {key: 'لینک', _style: 'width:20%'},
        {key: 'تصویر', _style: 'width:40%'},
        {key: 'ترتیب', _style: 'width:20%'},

        {key: 'عملیات', _style: 'width:40%;'},


    ];


    export default {
        name: 'Login',
        data() {
            return {
                link: '',
                name: '',
                file: '',
                summary: '',
                order_no: '',
                previewImage: '',
                description: '',
                selectedPosition: 1,
                selectPositions: [
                    {
                        value: 1,
                        label: 'چپ بالا'
                    },{
                        value: 2,
                        label: 'چپ وسط'
                    },{
                        value: 3,
                        label: 'چپ پایین'
                    },{
                        value: 4,
                        label: 'مرکز بالا'
                    },{
                        value: 5,
                        label: 'مرکز وسط'
                    },{
                        value: 6,
                        label: 'مرکز پایین'
                    },{
                        value: 7,
                        label: 'راست بالا'
                    },{
                        value: 8,
                        label: 'راست وسط'
                    },{
                        value: 9,
                        label: 'راست پایین'
                    },
                ],
                items: items.map((item, row_id) => {
                    return {...item, row_id}
                }),
                fields,
                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_categories();
            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data == 'true') {
                    this.delete_item();

                } else {
                    this.status_form = 0;
                }
            });
        }, watch: {
            '$route.params.slider_id': function (id) {
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
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = this.items[item.id].name;
                this.color = this.items[item.id].color;
                this.summary = this.items[item.id].summary;
                this.previewImage = this.items[item.id].image;
                this.status_form = this.items[item.id].cat_id;
                this.selectedPosition = this.items[item.id].text_position;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            }, get_categories() {
                var self = this;
                console.log("route id " + this.$route.params.slider_id);

                axios.get('/api/admin/slider-images/' + this.$route.params.slider_id, {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items = content_cats.orders.map((item, row_id) => {
                        return {...item, row_id}
                    }),
                        fields;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            goRegister() {
                this.$router.push({path: 'register'});
            }, goSubCategories(item, index) {

                this.$router.push({path: '/categories/' + this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            }, handleFileUpload() {
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
                const formData = new FormData()
                let url;
                url = "/api/admin/slider-images";

                formData.append('name', this.name);
                formData.append('summary', this.summary);
                formData.append('image', this.file);
                formData.append('link', this.link);
                formData.append('order_no', this.order_no);
                formData.append('slider_id', this.$route.params.slider_id);
                formData.append('text_position', this.selectedPosition);
                // formData.append('description', this.description)
                axios.post(url, formData, {}).then((res) => {
                    console.log(res)


                    self.link = '';
                    self.name = '';
                    self.summary = '';
                    self.order_no = '';
                    self.previewImage = '';
                    self.get_categories();


                })

                    // axios.post(  '/admin/category', {
                    //     name: self.name,
                    //     description: self.description,
                    //     image: self.image,
                    //     cat: 0,
                    // }).then(function (response) {
                    //     self.name = '';
                    //     self.description = '';
                    //     // localStorage.setItem("api_token", response.data.access_token);
                    //     // self.$router.push({ path: 'notes' });
                    // })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            }, delete_item_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],'delete_confirm');

                this.status_form = item.id;

            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/slider-images/delete";


                formData.append('id', this.status_form);

                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res);
                    if(res.data.error==1){
                        this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

                    }else{
                        this.$root.modal_component.show_success_modal('تایید',res.data.msg);

                    }
                    self.status_form=0;

                    self.get_categories();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            }
        }
    }


</script>
