<template>
    <div>
        <CRow>
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>افزودن آدرس ریدایرکت</strong>
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

                                    label="آدرس مبدا"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="link"

                                    label="لینک مقصد"
                                />
                            </CCol>
                        </CRow>


                    </CCardBody>
                    <CCardFooter>
                        <CButton v-if="status_form ==0 "
                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/>افزودن منو</CButton>


                        <CButton v-if="status_form !=0 "
                                 @click="login()"
                                 type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش گروه
                        </CButton>

                        <CButton v-if="status_form !=0 "
                                 @click="clear_edit()"
                                 type="submit" ref="submit_form" size="sm" color="danger"><CIcon name="cil-check-circle"/>انصراف </CButton>



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


                <template #عملیات="{item,index}">
                    <td class="py-2">

                        <CButton
                            color="warning"
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
    import  { bus } from '../../main';

    var items = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:20%' },
        { key: 'from_address',label:"مبدا", _style:'width:20%' },
        { key: 'to_address',label:"مقصد", _style:'width:20%;' },
        { key: 'عملیات', _style:'width:40%;' },


    ];


    export default {
        name: 'Login',
        data() {
            return {
                name: '',
                file: '',
                link: '',
                previewImage: '',
                description: '',
                items: items.map((item, row_id) => { return {...item, row_id}}),
                fields,
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
            this.get_categories();
            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data == 'true') {
                    this.delete_item();

                } else {
                    this.status_form = 0;
                }
            });
        },watch: {

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
                this.name = item.from_address;
                this.link = item.to_address;

                this.status_form =item.id;

                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            }, clear_edit() {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = '';
                this.link = '';
                this.status_form = 0;
            },
            delete_item_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟\n در صورت حذف زیر منو ها هم حذف میشوند",['تایید'],'delete_confirm');

                this.status_form = this.items[item.row_id].id;

            },delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/redirect/delete";


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

                    self.get_categories();


                })
                    .catch(function (error) {

                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            }

            ,get_categories(){
                var self = this;
                console.log("route id "+this.$route.params.menu_id);

                axios.get(  '/api/admin/redirect', {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.date.map((item, row_id) => { return {...item, row_id}}),
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
            goRegister(){
                this.$router.push({ path: 'register' });
            },
            handleFileUpload(){
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
                 if(this.status_form==0){
                     url = "/api/admin/redirect";

                 }else{
                     url = "/api/admin/redirect/update";
                     formData.append('id', this.status_form);

                 }


                // formData.append('image', this.file)
                formData.append('name', this.name);
                formData.append('link', this.link);
                // formData.append('description', this.description)
                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res);


                    // if(this.status_form==0){
                    //     url = "/api/admin/category";
                    this.$root.modal_component.show_api_response_modals(res);

                    self.name = '';
                        self.link = '';
                        self.description = '';
                        self.previewImage = '';
                        self.status_form = 0;
                        self.get_categories();
                    // }else{
                    //     self.status_form=0;
                    //     self.name = '';
                    //     self.color = '';
                    //     self.description = '';
                    //     self.previewImage = '';
                    //     self.get_categories();
                    // }

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

                        console.log(error);
                    });

            }
        }
    }


</script>
