<template>
    <div>
        <CRow>
          <CCol col="8">
            <CCard>
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
                  <template #نام="{item}">

                    <td>
                      <p class="text-muted">{{item.title.name}}</p>

                    </td>

                  </template>
                  <template #توضیحات="{item}">

                    <td>
                      <p class="text-muted">{{item.title.summary}}</p>

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
                      <CImg width="50px" height="50px" v-bind:src="item.title.image"/>
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
                        <strong>افزودن تصویر</strong>

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
                                <CInput
                                    v-model="link"

                                    label="لینک"
                                    placeholder="http://example.com"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="4">
                              <ImageSelector label="تصویر"
                                             default_archive="sliders"
                                             :media_id.sync="file"

                                             :preview-image="previewImage"
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



    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../main";

    var items = [

    ];

    const fields = [
      {key: 'row',label: '#', _style: 'width:10%'},
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
              confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

                link: '',
                name: '',
                file: null,
                summary: '',
                order_no: '',
                previewImage: null,
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
            bus.$on(this.confirm_delete_name, (data) => {
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
         get_categories() {
                var self = this;
           var formData = new FormData()
formData.append("slider_id", this.$route.params.slider_id)
                axios.post('/api/admin/site/get_slider_images', formData,{}).then(function (response) {

                    var content_cats = response.data;

                    self.items = content_cats.orders.map((item, row_id) => {
                        return {...item, row_id}
                    });

                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            login() {


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/site/add_slider_images";

                formData.append('name', this.name);
                formData.append('summary', this.summary);
                formData.append('image', this.file);
                formData.append('link', this.link);
                formData.append('order_no', this.order_no);
                formData.append('slider_id', this.$route.params.slider_id);
                formData.append('text_position', this.selectedPosition);
                // formData.append('description', this.description)
                axios.post(url, formData, {}).then((res) => {


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

                        console.log(error);
                    });

            },
          delete_item_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],this.confirm_delete_name);

                this.status_form = item.id;

            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/site/delete_slider_images";


                formData.append('id', this.status_form);

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
        }
    }


</script>
