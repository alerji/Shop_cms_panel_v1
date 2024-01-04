<template>
    <div>
        <CRow>
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>ثبت کاربر</strong>
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

                                    label="نام و نام خانوادگی"
                                    placeholder="نام"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="mobile"

                                    label="تلفن همراه"
                                    placeholder="تلفن همراه"
                                    horizontal
                                />

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="email"

                                    label="ایمیل"
                                    placeholder="ایمیل"
                                    horizontal
                                />

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <CInput
                                    v-model="password"

                                    label="رمز عبور"
                                    placeholder="رمز عبور"
                                    horizontal
                                />

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <label>گروه دسترسی</label>

                                <select v-model="selected_group">
                                    <option  v-bind:value="0">
                                        انتخاب کنید
                                    </option>
                                    <option v-for="option in group_items" v-bind:value="option.group_id">
                                        {{ option.name }}
                                    </option>
                                </select>

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">
                                <label>تصویر کاربر</label>

                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

                                <CImg height="250px"
                                      width="250px"
                                      v-model="previewImage"
                                      v-if="previewImage" :src="previewImage"
                                />
                            </CCol>


                        </CRow>
                        <CRow>
                            <CCol col="12">

                                <label>سطوح دسترسی</label>
                                <CDataTable
                                    :items="role_items"
                                    :fields="fields_role"

                                    hover
                                    sorter
                                >
                                    <template #نام="{item}">

                                        <td>
                                            <p class="text-muted">{{item.name}}</p>

                                        </td>

                                    </template>
                                    <template #دسترسی="{item}">

                                        <td>
                                            <input type="checkbox" ref="permissions[]" v-model="role_checkbox_items"  :value="item.role_id"/>
                                        </td>

                                    </template>

                                </CDataTable>
                            </CCol>

                        </CRow>
                    </CCardBody>
                    <CCardFooter>
                        <CButton
                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            ثبت کاربر
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

    export default {
        name: 'Login',
        data() {
            return {
                name: '',
                file: '',
                email: '',
                mobile: '',
                password: '',
                selected_group: '0',
                previewImage: '',
                description: '',
                role_checkbox_items: [],

                group_items: items_group.map((item, id) => {
                    return {...item, id}
                }),
                fields_group,
                role_items: items_role.map((item, id) => {
                    return {...item, id}
                }),
                fields_role,
                details: [],
                collapseDuration: 0,
                status_form: 0,
                options: [
                    {text: 'One', value: 'A'},
                    {text: 'Two', value: 'B'},
                    {text: 'Three', value: 'C'}
                ]
            }
        }, mounted() {
            this.get_groups();
            this.get_roles();
        }, watch: {
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
            }, get_groups() {
                var self = this;
            var formData = new FormData();

            axios.post('/api/admin/get_role-groups',formData, {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.group_items = content_cats.groups.map((item, id) => {
                        return {...item, id}
                    }),
                        fields_group;
                    // console.log("cats is "+items);
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
            }, goSubCategories(item, index) {

                this.$router.push({path: '/categories/' + this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            }, get_roles() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);
            var formData = new FormData();

                axios.post('/api/admin/roles',formData, {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.role_items = content_cats.permissions.map((item, id) => {
                        return {...item, id}
                    }),
                        fields_role;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            }

            , handleFileUpload() {
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
                if (this.status_form == 0) {
                    url = "/api/admin/admins";
                } else {
                    url = "/api/admin/category/update";
                    formData.append('cat_id', this.status_form)

                }

                formData.append('image', this.file);
                formData.append('name', this.name);
                formData.append('mobile', this.mobile);
                formData.append('email', this.email);
                formData.append('password', this.password);
                formData.append('is_admin', 1);
                formData.append('role_group', this.selected_group);
                formData.append('roles', self.role_checkbox_items);

                    axios.post(url, formData, {}).then((res) => {
                    console.log(res)


                    if(res.data.error==1){
                        this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

                    }else{
                        this.$root.modal_component.show_success_modal('تایید',res.data.msg);

                    }
                    self.name = '';
                    self.mobile = '';
                    self.email = '';
                    self.description = '';
                    self.password = '';
                    self.selected_group = '0';
                    self.role_checkbox_items = [];
                        self.previewImage = '';
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
