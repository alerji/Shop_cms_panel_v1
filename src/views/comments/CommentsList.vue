<template>
    <div>


        <CCardBody>
            <CTabs>
                <CTab title="منتشر شده" active>
                    <CDataTableFixed
                        :items="items_active"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #row="{item}">

                            <td>
                                <p class="text-muted">{{item.comment_id}}</p>

                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>

                        <template #خبر="{item}">

                            <td>
                                <p class="text-muted">{{item.post}}</p>

                            </td>

                        </template>
                        <template #دیدگاه="{item}">

                            <td>
                                <p class="text-muted">{{item.summary}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>

                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="warning"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="change_status(item,'0')"
                                >عدم انتشار
                                </CButton>
                                <CButton
                                    color="danger"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="change_status(item,'2')"
                                ><CIcon name="cil-trash" size="sm"/>
                                </CButton>
                            </td>
                        </template>



                    </CDataTableFixed>

                </CTab>

                <CTab title="منتشر نشده" >
                    <CDataTableFixed
                        :items="items_deactive"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #row="{item}">

                            <td>
                                <p class="text-muted">{{item.comment_id}}</p>

                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>

                        <template #خبر="{item}">

                            <td>
                                <p class="text-muted">{{item.post}}</p>

                            </td>

                        </template>
                        <template #دیدگاه="{item}">

                            <td>
                                <p class="text-muted">{{item.summary}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>


                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="change_status(item,'1')"
                                >انتشار
                                </CButton>
                                <CButton
                                    color="danger"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="change_status(item,'2')"
                                ><CIcon name="cil-trash" size="sm"/>
                                </CButton>


                            </td>
                        </template>



                    </CDataTableFixed>

                </CTab>
                <CTab title="حذف شده" >
                    <CDataTableFixed
                        :items="items_deleted"
                        :fields="fields"

                        :items-per-page="20"
                        hover
                        sorter
                        pagination
                    >
                        <template #row="{item}">

                            <td>
                                <p class="text-muted">{{item.comment_id}}</p>

                            </td>

                        </template>
                        <template #کاربر="{item}">

                            <td>
                                <p class="text-muted">{{item.user}}</p>

                            </td>

                        </template>

                        <template #خبر="{item}">

                            <td>
                                <p class="text-muted">{{item.post}}</p>

                            </td>

                        </template>
                        <template #دیدگاه="{item}">

                            <td>
                                <p class="text-muted">{{item.summary}}</p>

                            </td>

                        </template>
                        <template #تاریخ="{item}">

                            <td>
                                <p class="text-muted">{{item.date}}</p>

                            </td>

                        </template>


                        <template #عملیات="{item,index}">
                            <td class="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    square
                                    size="sm"
                                    @click="change_status(item,'1')"
                                >انتشار
                                </CButton>

                            </td>
                        </template>



                    </CDataTableFixed>

                </CTab>
            </CTabs>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";

    var items_active = [

    ];
    var items_deactive = [

    ]; var items_deleted = [

    ];


    const fields = [
      {key: 'row',label: '#', _style: 'width:5%'},
        {key: 'کاربر', _style: 'width:10%'},
        {key: 'خبر', _style: 'width:10%'},
        {key: 'دیدگاه', _style: 'width:10%;'},
        {key: 'تاریخ', _style: 'width:10%;'},
        {key: 'عملیات', _style: 'width:30%;'},

    ];


    export default {
        name: 'Login',
        components: {
            // Use the <ckeditor> component in this view.
        },
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                items_active: items_active.map((item, id) => {
                    return {...item, id}
                }),
                fields,
                items_deactive: items_deactive.map((item, id) => {
                    return {...item, id}
                }),
                fields,
                items_deleted: items_deleted.map((item, id) => {
                    return {...item, id}
                }),
                fields,

                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_comments();
        }, watch: {
            '$route.params.cat_id': function (id) {
                this.get_comments();
            }
        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            }, get_comments() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);

                axios.get('/api/admin/comments', {}).then(function (response) {

                    var contents = response.data;

                    // items = content_cats.orders;

                    self.items_active = contents.comments_active.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;
                    self.items_deactive = contents.comments_deactive.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;
                    self.items_deleted = contents.comments_deleted.map((item, id) => {
                        return {...item, id}
                    }),
                        fields;

                    console.log("cats is " + self.items_active);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },change_status(item,status) {
                let self = this;
                const formData = new FormData();
                let url;
                    url = "/api/admin/comments/status";

                formData.append('comment_id', item.comment_id);
                formData.append('comment_status', status);

                axios.post(url, formData, {
                }).then((res) => {

                        self.get_comments();

                })

                    .catch(function (error) {

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
        }
    }


</script>
