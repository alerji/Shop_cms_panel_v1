<template>
    <div>

        <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="goAddNews()"
        >افزودن خبر
        </CButton>
        <CCardBody>
            <CTabs>
                <CTab title="منتشر شده" active>
                    <CDataTable
                        :items="items_active"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #ردیف="{item}">

                            <td>
                                <p class="text-muted">{{item.post_id}}</p>

                            </td>

                        </template>
                        <template #عنوان="{item}">

                            <td>
                                <p class="text-muted">{{item.title}}</p>

                            </td>

                        </template>

                        <template #توضیحات="{item}">

                            <td>
                                <p class="text-muted">{{item.summary.substring(0,20)+"..."}}</p>

                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>
                        <template #نمایش="{item}">

                            <td>
                                <p class="text-muted">{{item.view_count}}</p>

                            </td>

                        </template>


                        <template #تصویر="{item}">


                            <td>
                                <CImg width="50px" height="50px" v-bind:src="item.image"  />
                            </td>

                        </template>

                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="editDetails(item,index)"
                                >ویرایش
                                </CButton>

                                <CButton
                                        color="danger"
                                        variant="outline"
                                        square
                                        size="sm"
                                        @click="delete_dialog(item,index)"
                                >حذف
                                </CButton>
                            </td>
                        </template>



                    </CDataTable>

                </CTab>

                <CTab title="منتشر نشده" >
                    <CDataTable
                        :items="items_deactive"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #ردیف="{item}">

                            <td>
                                <p class="text-muted">{{item.post_id}}</p>

                            </td>

                        </template>
                        <template #عنوان="{item}">

                            <td>
                                <p class="text-muted">{{item.title}}</p>

                            </td>

                        </template>

                        <template #توضیحات="{item}">

                            <td>
                                <p class="text-muted">{{item.summary.substring(0,20)+"..."}}</p>

                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>
                        <template #نمایش="{item}">

                            <td>
                                <p class="text-muted">{{item.view_count}}</p>

                            </td>

                        </template>


                        <template #تصویر="{item}">


                            <td>
                                <CImg width="50px" height="50px" v-bind:src="item.image"  />
                            </td>

                        </template>

                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="editDetails(item,index)"
                                >ویرایش
                                </CButton>
                                <CButton
                                        color="danger"
                                        variant="outline"
                                        square
                                        size="sm"
                                        @click="delete_dialog(item,index)"
                                >حذف
                                </CButton>
                            </td>
                        </template>



                    </CDataTable>

                </CTab>
                <CTab title="حذف شده" >
                    <CDataTable
                        :items="items_deleted"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #ردیف="{item}">

                            <td>
                                <p class="text-muted">{{item.post_id}}</p>

                            </td>

                        </template>
                        <template #عنوان="{item}">

                            <td>
                                <p class="text-muted">{{item.title}}</p>

                            </td>

                        </template>

                        <template #توضیحات="{item}">

                            <td>
                                <p class="text-muted">{{item.summary.substring(0,20)+"..."}}</p>
                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>
                        <template #نمایش="{item}">

                            <td>
                                <p class="text-muted">{{item.view_count}}</p>

                            </td>

                        </template>


                        <template #تصویر="{item}">


                            <td>
                                <CImg width="50px" height="50px" v-bind:src="item.image"  />
                            </td>

                        </template>

                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="editDetails(item,index)"
                                >ویرایش
                                </CButton>

                            </td>
                        </template>



                    </CDataTable>

                </CTab>
            </CTabs>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../../main";

    var items_active = [

    ];
    var items_deactive = [

    ];
    var items_deleted = [

    ];

    const fields = [
        {key: 'ردیف', _style: 'width:10%'},
        {key: 'عنوان', _style: 'width:10%'},
        {key: 'توضیحات', _style: 'width:10%'},
        {key: 'کاربر', _style: 'width:10%;'},
        {key: 'تاریخ', _style: 'width:10%;'},
        {key: 'نمایش', _style: 'width:10%;'},
        {key: 'تصویر', _style: 'width:10%;'},
        {key: 'عملیات', _style: 'width:30%;'},

    ];


    export default {
        name: 'Login',
        components: {
            // Use the <ckeditor> component in this view.
           // ckeditor: CKEditor.component
        },
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                test_sub:'ssssssssssss',
                items_active: items_active.map((item, id) => {
                    return {...item, id}
                }),
                fields,
                items_deactive: items_deactive.map((item, id) => {
                    return {...item, id}
                }),
                items_deleted: items_deleted.map((item, id) => {
                    return {...item, id}
                }),
                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_news();
            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data=='true'){
                    this.delete_item();

                }else{
                    this.status_form = 0;
                }
            });
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
            editDetails(item,index) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
              this.$router.push({path:"/dashboard/news/edit-news/"+item.post_id});
                // this.name = this.items[item.id].name
                // this.color = this.items[item.id].color
                // this.description = this.items[item.id].description
                // this.previewImage = this.items[item.id].image
                // this.status_form = this.items[item.id].cat_id;
                // // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            }, get_news() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);

                axios.get('/api/admin/posts', {}).then(function (response) {

                    var contents = response.data;

                    // items = content_cats.orders;

                    self.items_active = contents.posts_active.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;
                    self.items_deactive = contents.posts_deactive.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;
                    self.items_deleted = contents.posts_deleted.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;
                    console.log("cats is " + self.items_active);
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
            goRegister() {
                this.$router.push({path: 'register'});
            }, goAddNews() {

                this.$router.push({path: '/add-news'});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],'delete_confirm');


                this.status_form = item.post_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/post/delete";


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

                    self.get_news();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
        }
    }


</script>
