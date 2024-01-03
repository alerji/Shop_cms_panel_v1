<template>
    <div>
        <main class="profile-page">
            <section class="relative block" style="height: 500px;">
                <div
                    class="absolute top-0 w-full h-full bg-center bg-cover"
                    style='background-image: url("/images/profile_banner.jpg")'
                >
          <span
              id="blackOverlay"
              class="w-full h-full absolute opacity-50 bg-black"
          ></span>
                </div>
                <div
                    class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                    style="height: 70px; transform: translateZ(0px);"
                >
                    <svg
                        class="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            class="text-gray-300 fill-current"
                            points="2560 0 2560 100 0 100"
                        ></polygon>
                    </svg>
                </div>
            </section>
            <section class="relative py-16 bg-gray-300">
                <div class="container mx-auto px-4">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
                    >
                        <div class="px-6">
                            <div class="flex flex-wrap justify-center">
                                <div
                                    class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"
                                >
                                    <div class="relative">
                                        <img
                                            alt="..."
                                            :src="previewImage"
                                            class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                            style="max-width: 150px;"
                                        />
                                    </div>
                                </div>
                                <div
                                    class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"
                                >
                                    <div class="py-6 px-3 mt-32 sm:mt-0">
<!--                                        <button-->
<!--                                            class="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"-->
<!--                                            type="button"-->
<!--                                            style="transition: all 0.15s ease 0s;"-->
<!--                                        >-->
<!--                                            Connect-->
<!--                                        </button>-->
                                    </div>
                                </div>
                                <div class="w-full lg:w-4/12 px-4 lg:order-1">
                                    <div class="flex justify-center py-4 lg:pt-4 pt-8">
                                        <div class="mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-gray-700"
                      >{{following_count}}</span
                      ><span class="text-sm text-gray-500">دنبال شوندگان</span>
                                        </div>
                                        <div class="mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-gray-700"
                      >{{post_count}}</span
                      ><span class="text-sm text-gray-500">اخبار</span>
                                        </div>
                                        <div class="lg:mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-gray-700"
                      >{{comment_count}}</span
                      ><span class="text-sm text-gray-500">دیدگاه</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center mt-12">
                                <h3
                                    class="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2"
                                >
                                    {{name}}
                                </h3>
                                <div
                                    class="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase"
                                >
                                    <i
                                        class="fas fa-map-marker-alt mr-2 text-lg text-gray-500"
                                    ></i>
                                    {{email}}
                                </div>
                                <div class="mb-2 text-gray-700 mt-10">
                                    <i class="fas fa-briefcase mr-2 text-lg text-gray-500"></i
                                    >{{role_name}}
                                </div>

                            </div>
                            <div class="mt-10 py-10 border-t border-gray-300 text-center">
                                <div class="flex flex-wrap justify-center">
                                    <div class="w-full lg:w-9/12 px-4">
                                        <p class="mb-4 text-lg leading-relaxed text-gray-800">
                                            {{about_me}}
                                        </p>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <CCard>
            <CCardHeader>
                <strong>ویرایش اطلاعات</strong>
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

                            label="نام و نام خانوادگی"
                            placeholder="نام و نام خانوادگی"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol col="12">
                        <CTextarea
                            v-model="about_me"

                            label="درباره من"
                            placeholder="درباره من"
                            horizontal
                            rows="4"
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
                <CRow>
                    <CCol col="4">
                        <CInput
                            label="ویرایش رمز عبور"
                            v-model="password"/>

                    </CCol>
                    <CCol col="4">
                        <CInput
                            label="تکرار رمز عبور"
                            v-model="repeat_password"/>

                    </CCol>
                </CRow>
            </CCardBody>
            <CCardFooter>
                <CButton
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="primary">
                    <CIcon name="cil-check-circle"/>
                    ویرایش پروفایل
                </CButton>
            </CCardFooter>
        </CCard>

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
                about_me: '',
                role_name: '',
                post_count: '',
                comment_count: '',
                following_count: '0',
                password: '',
                repeat_password: '',
                selected_group: '0',
                previewImage: '',
                description: '',


            }
        }, mounted() {
            this.get_userinfo();
            this.goUserInfo();
        }, watch: {
            '$route.params.user_id': function (id) {
                this.goUserInfo();
            }
        },
        methods: {


            get_userinfo() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/userinfo', {
                    params: {},
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;
                    if (content_cats.error == 0) {
                        self.name = content_cats.user.name;
                        self.previewImage = content_cats.user.image;
                        self.post_count = content_cats.user.posts;
                        self.comment_count = content_cats.user.comments;
                        self.email = content_cats.user.email;
                        self.role_name = content_cats.user.role_group;
                        self.about_me = content_cats.user.about_me;
                    } else {
                        self.$root.modal_component.show_api_response_modals(response);
                    }
                    // items = content_cats.orders;

                    // self.previewImage = content_cats.image;
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

            goUserInfo() {
                var self = this;

                axios.get('/api/admin/user/' + this.$route.params.user_id, {}).then(function (response) {

                    var content = response.data;

                    self.name = content.user.name;
                    self.mobile = content.user.phone;
                    self.email = content.user.email;
                    self.password = content.user.password;
                    self.selected_group = content.user.role_group;
                    self.role_checkbox_items = content.user.permissions;
                    self.previewImage = content.user.image;
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            get_roles() {
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
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            }

            ,
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
                if (self.password != '' && self.password.length < 5) {
                    self.$root.modal_component.show_danger_modal("خطا", "رمز عبور باید حداقل 6 کارکتر باشد");
                    return false;
                }
                if (self.password.length != self.repeat_password) {
                    self.$root.modal_component.show_danger_modal("خطا", "رمز عبور با تکرار ان مطابقت ندارد");
                    return false;

                }
                const formData = new FormData();
                let url;
                url = "/api/admin/users/edit_my_profile";


                formData.append('user_id', this.$route.params.user_id);
                formData.append('image', this.file);
                formData.append('name', this.name);
                formData.append('mobile', this.mobile);
                formData.append('email', this.email);
                formData.append('password', this.password);
                formData.append('about_me', this.about_me);
                formData.append('role_group', this.selected_group);
                formData.append('roles', self.role_checkbox_items);

                axios.post(url, formData, {}).then((res) => {
                    console.log(res)


                    if (res.data.error == 1) {
                        this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

                    } else {
                        this.$root.modal_component.show_success_modal('تایید', res.data.msg);

                    }
                    this.goUserInfo();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            }
        }
    }


</script>
