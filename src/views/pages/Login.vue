<template>
    <CContainer class="d-flex content-center min-vh-100">
        <CRow>
            <CCol>
                <CCardGroup>
                    <CCard class="p-4">
                        <CCardBody>
                            <CForm>
                                <h1>ورود</h1>
                                <p class="text-muted">ورود به پنل کاربری</p>
                                <CInput
                                    placeholder="شماره موبایل"
                                    autocomplete="username email"
                                    v-model="user"

                                >
                                    <template #prepend-content>
                                        <CIcon name="cil-user"/>
                                    </template>
                                </CInput>
                                <CInput
                                    placeholder="رمز عبور"
                                    type="password"
                                    v-model="pass"
                                    autocomplete="curent-password"
                                >
                                    <template #prepend-content>
                                        <CIcon name="cil-lock-locked"/>
                                    </template>
                                </CInput>
                                <CRow>
                                    <CCol col="6" class="text-left">
                                        <CButton color="primary" v-on:click="login()" class="px-4">ورود</CButton>
                                    </CCol>
                                    <CCol col="6" class="text-right">
                                        <CButton color="link" class="px-0">رمز عبور خود را فراموش کرده اید؟</CButton>
                                        <CButton color="link" class="d-md-none">ثبت نام کنید</CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                    <CCard
                        color="primary"
                        text-color="white"
                        class="text-center py-5 d-sm-down-none"
                        body-wrapper
                    >
                        <h2>ثبت نام</h2>
                        <p>برای استفاده از تمامی امکانات سایت ثبت نام کنید</p>
                        <CButton
                            color="primary"
                            class="active mt-3"
                            v-on:click="goRegister()"
                        >
                            همین حالا ثبت نام کنید
                        </CButton>
                    </CCard>
                </CCardGroup>
            </CCol>
        </CRow>
        <Modals ref="modal"/>

    </CContainer>

</template>


<script>
    import axios from "axios";
    import Modals from "../includes/Modals";

    export default {
        name: 'Login',
        data() {
            return {
                user: '',
                pass: ''
            }
        },
        components: {
             Modals
        },mounted() {
          // this.custom_data()
        },
        methods: {

            goRegister() {

                // this.$root.loading_component.loading = true;
                // this.$router.push({path: '/register'});
            },
            login() {


                let self = this;
                const formData = new FormData()
                let url = "/api/admin/user/login";
              axios.defaults.headers.post['Authorization'] = "";

// axios.defaults.headers= {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': '*',
//     'Accept': 'application/json, text/plain'
//
// };

                formData.append('user', this.user)
                formData.append('pass', this.pass)

                axios.post(url, formData).then((res) => {
                    console.log(res)
                    // console.log(res.headers.value('token'));
// res.headers.value('token');
                  if(res.data.error==1){
                      this.$refs.modal.show_danger_modal('خطا',res.data.msg);

                  }else{

                      localStorage.setItem('token',res.data.token);
                    axios.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('token');

                    this.$router.push({ path: '/dashboard'});

                  }

                    // Modals.show_danger_modal('sss',"sdsddd",[]);


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

            },
            // custom_data() {
            //
            //
            //     let self = this;
            //     const formData = new FormData()
            //     let url;
            //     url = "https://bilbordz.com/api/admin/category";
            //
            //
            //     formData.append('pic_1', this.file);
            //
            //     formData.append('name', 'salam');
            //     formData.append('color', '#ffffff');
            //     formData.append('cat', 0);
            //
            //     axios.post(url, formData, {}).then((res) => {
            //         console.log(res)
            //
            //
            //         if (this.status_form == 0) {
            //             self.name = '';
            //             self.color = '';
            //             self.description = '';
            //             self.previewImage = '';
            //             self.previewImage_header = '';
            //
            //             // self.language_id = 1;
            //             // self.language_rel_id = 0;
            //             self.get_categories();
            //         } else {
            //             self.status_form = 0;
            //             self.name = '';
            //             self.color = '';
            //             self.description = '';
            //             self.previewImage = '';
            //             self.previewImage_header = '';
            //
            //             // self.language_id = 1;
            //             // self.language_rel_id = 0;
            //             self.get_categories();
            //         }
            //
            //     })
            //
            //         // axios.post(  '/admin/category', {
            //         //     name: self.name,
            //         //     description: self.description,
            //         //     image: self.image,
            //         //     cat: 0,
            //         // }).then(function (response) {
            //         //     self.name = '';
            //         //     self.description = '';
            //         //     // localStorage.setItem("api_token", response.data.access_token);
            //         //     // self.$router.push({ path: 'notes' });
            //         // })
            //         .catch(function (error) {
            //             console.log(error);
            //         });
            //
            // }

        }
    }


</script>
