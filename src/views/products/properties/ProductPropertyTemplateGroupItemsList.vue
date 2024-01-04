<template>
  <div>
    <CRow>
      <CCol col="6">
        <CCard>
          <CCardHeader>
            <strong>ثبت ایتم ویژگی محصولات</strong>
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

                    label="نام ایتم"
                />
              </CCol>
            </CRow>


          </CCardBody>
            <CCardFooter>
                <CButton v-if="status_form==0"
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/> ثبت ایتم</CButton>
           <CButton  v-if="status_form!=0"
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش ایتم</CButton>
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
                      <p class="text-muted">{{item.row_id+1}}</p>

                  </td>

              </template>
              <template #نام="{item}">

                  <td>
                      <p class="text-muted">{{item.key_title}}</p>

                  </td>

              </template>


              <template #عملیات="{item}">
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
                          @click="delete_dialog(item)"
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
    import {bus} from "../../../main";

    var items = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:10%' },
        { key: 'نام', _style:'width:10%' },

        { key: 'عملیات', _style:'width:40%;' },


    ];


    export default {
        name: 'Login',
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                items: items.map((item, row_id) => { return {...item, row_id}}),
                fields,
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data=='true'){
                    this.delete_item();

                }else{
                    this.status_form = 0;
                }
            });
this.get_categories();
        },watch: {
            '$route.params.temp_id': function () {
                this.get_categories();
            }
        },
        methods: {

            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = item.key_title;

                this.status_form = item.id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_categories(){
               var self = this;
                // console.log("route id "+this.$route.params.cat_id);
var formData = new FormData();
            formData.append("id",+this.$route.params.group_id)
                axios.post(  '/api/admin/get_product_property-items',formData, {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.tags.map((item, row_id) => { return {...item, row_id}}),
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

            login() {


                let self = this;
                const formData = new FormData()
                let url;
                if(this.status_form==0){
                    url = "/api/admin/product_property-item";
                }else{
                    url = "/api/admin/product_property-item/update";
                    formData.append('id', this.status_form)

                }

                formData.append('name', this.name);
                formData.append('group_id', this.$route.params.group_id);

                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res)


                    if(this.status_form==0){
                        self.name = '';

                        self.get_categories();
                    }else{
                        self.status_form=0;
                        self.name = '';

self.get_categories();
                    }

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
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],'delete_confirm');


                this.status_form = item.id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/product_property-item/delete";


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

                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },


        }
    }


</script>
