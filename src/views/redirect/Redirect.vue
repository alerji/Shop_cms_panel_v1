<template>
    <div>
        <CRow>
          <CCol col="8">
            <CCard>
              <CCardHeader>
                <strong>لیست ریدایرکت</strong>

              </CCardHeader>
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
                      ><CIcon name="cil-pencil" size="sm"/>
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
            </CCard>
          </CCol>
            <CCol col="4">
                <CCard>
                    <CCardHeader>
                        <strong>افزودن آدرس ریدایرکت</strong>

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
                          <CCol col="12">
                                <CSelect
                                    :value.sync="type"
                                    :options="types"
                                    label="نوع"
                                />
                            </CCol>
                        </CRow>


                    </CCardBody>
                    <CCardFooter>
                        <CButton v-if="status_form ==0 "
                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/>افزودن ریدایرکت</CButton>


                        <CButton v-if="status_form !=0 "
                                 @click="login()"
                                 type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش ریدایرکت
                        </CButton>

                        <CButton v-if="status_form !=0 "
                                 @click="clear_edit()"
                                 type="submit" ref="submit_form" size="sm" color="danger"><CIcon name="cil-check-circle"/>انصراف </CButton>



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
    import  { bus } from '../../main';

    export default {
        name: 'Login',
        data() {
            return {
              confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

              name: '',
                file: '',
                link: '',
                previewImage: '',
              types:[{label:'301',value:'301'},{label:'302',value:'302'}],
                type: '301',
                items: [],
                fields: [
                  {key: 'row',label: '#', _style: 'width:10%'},
                  { key: 'from_address',label:"مبدا", _style:'width:20%' },
                  { key: 'to_address',label:"مقصد", _style:'width:20%;' },
                  { key: 'type',label:"نوع", _style:'width:20%;' },
                  { key: 'عملیات', _style:'width:40%;' },


                ],
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
            this.get_categories();
            bus.$on(this.confirm_delete_name, (data) => {
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
                this.type = item.type;

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
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],this.confirm_delete_name);

                this.status_form = item.id;

            },delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/site/delete_redirect";


                formData.append('row_id', this.status_form);

                axios.post(url, formData, {
                }).then((res) => {
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
            const formData = new FormData()

                axios.post(  '/api/admin/site/get_redirect',formData, {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.date.map((item, row_id) => { return {...item, row_id}})
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },

            login() {


                let self = this;
                const formData = new FormData()
                let url;
                 if(this.status_form==0){
                     url = "/api/admin/site/add_redirect";

                 }else{
                     url = "/api/admin/site/update_redirect";
                     formData.append('id', this.status_form);

                 }


                // formData.append('image', this.file)
                formData.append('name', this.name);
                formData.append('link', this.link);
                formData.append('type', this.type);
                // formData.append('description', this.description)
                axios.post(url, formData, {
                }).then((res) => {
                    self.$root.modal_component.show_api_response_modals(res);

                    self.name = '';
                        self.link = '';
                        self.description = '';
                        self.previewImage = '';
                        self.status_form = 0;
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

                        console.log(error);
                    });

            }
        }
    }


</script>
