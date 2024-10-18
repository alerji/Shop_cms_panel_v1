<template>
    <div class="wrapper">







        <CModal
                :show.sync="spinnerModal"
                :no-close-on-backdrop="false"
                color="transparent"
                border-color="primary"
        >

            <div align="center">

                لطفا صبر کنید

            </div>
            <div align="center">

                <CSpinner
                        color="primary"
                        style="width:4rem;height:4rem;"
                />
            </div>

            <template #footer>
            </template>
        </CModal>
        <!-- Modal Component -->

        <!-- Modal Component -->

        <CModal
                :title="title"
                color="danger"
                :show.sync="dangerModal"
        >
            {{message_api}}
            <template #footer>
                <CButton @click="dangerModal = false" color="danger">تایید</CButton>
            </template>
        </CModal>
        <!-- Modal Component -->

        <CModal
                :title="title"
                color="success"
                :show.sync="successModal"
        >
            {{message_api}}
            <template #footer>
                <CButton @click="successModal = false" color="primary">بستن</CButton>
            </template>
        </CModal>


        <CModal
                :show.sync="confirmModal"
                :no-close-on-backdrop="true"
                :centered="true"
                :title="title"
                size="lg"
                color="dark"
        >
            {{message_confirm}}
            <template #header>
                <h6 class="modal-title">{{title}}</h6>
                <CButtonClose @click="confirmModal = false" class="text-white"/>
            </template>
            <template #footer>
                <CButton @click="confirmed_request(true)"
                         color="danger"
                >{{buttons[0]}}
                </CButton>
                <CButton
                        @click="confirmed_request(false)"
                        color="success"
                >انصراف
                </CButton>
            </template>
        </CModal>


    </div>

</template>

<script>
    import {bus} from '../../main';
    import Vue from 'vue';
    import VueToast from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    Vue.use(VueToast);
    export default {
        name: 'Modals',
        data() {
            return {

                dangerModal: false,
                successModal: false,
                confirmModal: false,
                spinnerModal: false,

                confirmed_request_tag: '',
                title: '',
                title2: 'salam hamid',
                message_api: '',
                message: '',
                message_confirm: '',

                buttons: [],
                buttons_onclick: [],
            }
        },mounted() {
            bus.$on('show_spinner', (data) => {
                // alert(data);
                if(data== "true"){
                    // this.spinnerModal = true;
                    this.$root.loading_component.loading = true;
                }else{
                    // this.spinnerModal = false;
                    this.$root.loading_component.loading = false;
                }
            });
        }, methods: {
            show_danger_modal(title, text) {
                this.title = title;
                this.message_api = text;
                // this.buttons = buttons;
                this.dangerModal = true;
            },
            show_loading_modal() {

                this.spinnerModal = true;
            },
            show_success_modal(title, text) {
                this.title = title;
                this.message_api = text;
                this.successModal = true;
            },
            show_api_response_modals(res_data){
              if(res_data.data.error!=0){
                this.alert_color="danger"
                // this.show_danger_modal(this.$t("dialogs.error"),res_data.data.message);
                this.message_api = res_data.data.msg;
                this.title = this.$t('error');
                Vue.$toast.open({
                  message: res_data.data.msg,
                  type: 'error',
                  // all of other options may go here
                });

              }else{
                this.alert_color="success"
                this.message_api = res_data.data.msg;
                this.title = this.$t('ok');
                Vue.$toast.open({
                  message: res_data.data.msg,
                  type: 'success',
                  // all of other options may go here
                });

                // this.show_success_modal(this.$t("dialogs.ok"),res_data.data.message);

              }
            },
        show_danger_toast(msg){

                Vue.$toast.open({
                  message: msg,
                  type: 'error',
                  // all of other options may go here
                });


            },
            show_confirm_modal(title, text, buttons,bus_tag) {
                this.title = title;
                this.message_confirm = text;
                this.buttons = buttons;
                this.confirmed_request_tag = bus_tag;
// this.buttons_onclick = onclicks;
                this.confirmModal = true;
            },
            confirmed_request(status) {
                this.confirmModal = false;
                if (status) {
                    // bus.$emit(this.confirmed_request_tag, 'changed header');
                    bus.$emit(this.confirmed_request_tag, 'true');
                    this.confirmed_request_tag = "";

                }else{
                    bus.$emit(this.confirmed_request_tag, 'false');
                    this.confirmed_request_tag = "";

                }
            }
        }

    }
</script>