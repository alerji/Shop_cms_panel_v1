<template>
    <div>
        <CRow  v-if="status_form !=0 ">
            <CCol col="6">
                <CCard>
                    <CCardHeader>
                        <strong>ویرایش عنوان</strong>
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

                                    label="عنوان"
                                    placeholder="عنوان"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol col="12">



                            </CCol>
                        </CRow>

                    </CCardBody>
                    <CCardFooter>

                        <CButton
                            @click="edit()"
                            type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش
                        </CButton>

                        <CButton
                            @click="status_form = 0"
                            type="submit" ref="submit_form" size="sm" color="danger"><CIcon name="cil-check-circle"/>انصراف </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

        <CCardBody>

                    <CDataTableFixed
                        :items="items_tags"
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
                        <template #عنوان="{item}">

                            <td>
                                <p class="text-muted">{{item.name}}</p>

                            </td>

                        </template>

                        <template #تعداد="{item}">

                            <td>
                                <p class="text-muted">{{item.count}}</p>

                            </td>

                        </template>


                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="editDetails(item)"
                                ><CIcon name="cil-pencil" size="sm"/>
                                </CButton>


                            </td>
                        </template>



                    </CDataTableFixed>


        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";

    var items_tags = [

    ];


    const fields = [
      {key: 'row',label: '#', _style: 'width:10%'},
        {key: 'عنوان', _style: 'width:10%'},
        {key: 'تعداد', _style: 'width:10%'},

        {key: 'عملیات', _style: 'width:30%;'},

    ];


    export default {
        name: 'Tags',
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                items_tags: items_tags.map((item, id) => {
                    return {...item, id}
                }),
                fields,

                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_data();
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
                    this.name = this.items_tags[item.row_id].name;
                    this.selected_item = item;

                    this.status_form = this.items_tags[item.row_id].id;
                    // this.$nextTick(() => {
                    //     this.collapseDuration = 0
                    // })

            }, get_data() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);

                axios.get('/api/admin/tags', {}).then(function (response) {

                    var contents = response.data;

                    // items = content_cats.orders;

                    self.items_tags = contents.tags.map((item, row_id) => {
                        return {...item, row_id}
                    }),
                        fields;

                    // console.log("cats is " + self.items_active);
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
            }, edit() {


                let self = this;
                // const formData = new FormData()
                let url;
                url = "/api/admin/tags";


                axios.post(  url, {
                    name: self.name,
                    // roles: self.$refs.permissions,
                    id: self.status_form,
                }).then(function (response) {

                    self.items_tags[self.selected_item.row_id].name=self.name;
                    self.selected_item = '';

                    self.name = '';
                    self.status_form=0;
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
        }
    }


</script>
