<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow>
      <CCol>
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm v-on:keyup.enter="login()">
                <img  width="120px" height="auto" src="/img/panel_icon.png"/>
                <h4 class="mt-3">{{ $t('login') }}</h4>
                <CInput
                    :placeholder="$t('userName')"
                    v-model="user"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user"/>
                  </template>
                </CInput>
                <CInput
                    :placeholder="$t('password')"
                    type="password"
                    v-model="pass"
                >
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked"/>
                  </template>
                </CInput>
                <CRow>
                  <CCol col="12" class="text-center">


                    <CButton color="primary" v-on:click="login()" class="px-4">
                      <CSpinner v-if="loading" size="sm"/>
                      {{ $t('login') }}
                    </CButton>
                    <CRow class="mt-3">

                      <label @click="forgot_password_modal=true">{{ $t('forgotPassword') }}</label>
                    </CRow>
                  </CCol>
                  <CCol col="6" class="text-right">
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
    <Modals ref="modal"/>
    <CModal
        :title="$t('forgotPassword')"
        color="danger"
        :show.sync="forgot_password_modal"
    >
      <CRow>
        <CCol>
          <CInput
              :placeholder="$t('mobileNoOrEmail')"
              v-model="forgot_password_number"
          />
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="forgot_password_modal = false,forgot_password()" color="dark">{{$t('ok')}}</CButton>
        <CButton @click="forgot_password_modal = false" color="dark">{{$t('cancel')}}</CButton>
      </template>
    </CModal>

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
      pass: '',
      forgot_password_modal:false,
      forgot_password_number: '',
      loading: false,
    }
  },
  components: {
    Modals
  },
  mounted() {

  },
  methods: {

    goRegister() {
      this.$router.push({path: '/register'});
    },
    login() {


      let self = this;
      const formData = new FormData()
      let url = "/api/admin/user/login";
      // delete axios.defaults.headers.post['Authorization'];
      axios.defaults.headers.post['Authorization'] = "";


      formData.append('user', this.user)
      formData.append('pass', this.pass)

      axios.post(url, formData).then((res) => {

        if(res.data.error==1){
          this.$refs.modal.show_danger_modal('خطا',res.data.msg);

        }else{

          localStorage.setItem('token',res.data.token);
          localStorage.setItem('site_url',res.data.site);
          localStorage.setItem('user_name',res.data.user_name);
          axios.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('token');

          self.$router.push({ path: '/dashboard'});

        }



      })

          .catch(function (error) {

            console.log(error);
          });

    },
    forgot_password() {
      if (this.user == "") {
        this.$refs.modal.show_danger_modal(this.$t("error"), this.$t('insertMobile'));
        return;
      }
      let self = this;
      self.loading = true;
      const formData = new FormData();
      if(this.forgot_password_number.includes("@")){
        formData.append('mobileNo', "");
        formData.append('eMail', this.forgot_password_number);
      }else{
        formData.append('mobileNo', this.forgot_password_number);
        formData.append('eMail', "");
      }
      delete axios.defaults.headers.post["Authorization"];
      axios.post("ForgotPassword", formData, {}).then((res) => {
        self.loading = false;

        // console.log(res.headers.value('token'));
// res.headers.value('token');
        if (res.data.statusCode != 0) {
          this.$refs.modal.show_danger_modal(this.$t("dialogs.error"), res.data.message);
        } else {
          this.$refs.modal.show_api_response_modals(this.$t("dialogs.error"), res);
        }

        // Modals.show_danger_modal('sss',"sdsddd",[]);


      }).catch(function (error) {
        self.loading = false;

      });

    }
  }
}


</script>
