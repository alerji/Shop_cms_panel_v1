<template>
    <div>
        <CRow>
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>ثبت اسلایدر</strong>
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

                                    label="نام اسلایدر"
                                    placeholder="نام اسلایدر"
                                />
                            </CCol>
                        </CRow>


                    </CCardBody>
                    <CCardFooter>
                        <CButton
                            @click="login()"
                            type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/>افزودن اسلایدر</CButton>
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

                <template #تعداد="{item}">

                    <td>
                        <p class="text-muted">{{item.slider_count}}</p>

                    </td>

                </template>


                <template #عملیات="{item,index}">
                    <td class="py-2">
                        <CButton
                            color="danger"
                            variant="outline"
                            square
                            size="sm"
                            @click="editDetails(item)"
                        >حذف
                        </CButton>
                        <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="goSliderImages(item,index)"
                        >تصاویر اسلایدر
                        </CButton>
                    </td>
                </template>



            </CDataTable>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";

    var items = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:20%' },
        { key: 'نام', _style:'width:20%' },
        { key: 'تعداد', _style:'width:20%;' },
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
                items: items.map((item, id) => { return {...item, id}}),
                fields,
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
            this.get_categories();
        },watch: {
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
                this.name = this.items[item.id].name
                this.color = this.items[item.id].color
                this.description = this.items[item.id].description
                this.previewImage = this.items[item.id].image
                this.status_form = this.items[item.id].cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_categories(){
                var self = this;
                console.log("route id "+this.$route.params.cat_id);

                axios.get(  '/api/admin/sliders', {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.orders.map((item, row_id) => { return {...item, row_id}}),
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
            goRegister(){
                this.$router.push({ path: 'register' });
            },goSliderImages(item,index){

               this.$router.push({ path: '/dashboard/display/slider-images/'+this.items[index].id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            }, handleFileUpload(){
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
                    url = "/api/admin/sliders";


                // formData.append('image', this.file)
                formData.append('name', this.name)
                // formData.append('color', this.color)
                // formData.append('cat', this.$route.params.cat_id )
                // formData.append('description', this.description)
                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res)


                    // if(this.status_form==0){
                    //     url = "/api/admin/category";
                        self.name = '';
                        self.color = '';
                        self.description = '';
                        self.previewImage = '';
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
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            }
        }
    }


</script>
