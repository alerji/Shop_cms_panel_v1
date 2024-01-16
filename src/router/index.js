import Vue from 'vue'
import Router from 'vue-router'
import axios from "axios";
import OrderList from "../views/orders/OrderList";
import OrderInfo from "../views/orders/OrderInfo";
import Redirect from "../views/redirect/Redirect";
import AddOrder from "@/views/orders/AddOrder";
import CategoryList from "../views/blog/category/CategoryList";
import BrandList from "@/views/products/BrandList";
import ProductBundles from "@/views/products/bundles/ProductBundles";
import ProductBundleItems from "@/views/products/bundles/ProductBundleItems";
import Shipping from "@/views/settings/Shipping";
import OrderStatuses from "@/views/settings/OrderStatuses";
import ProductLabelList from "@/views/products/ProductLabelList.vue";
import PageList from "@/views/pageList/PageList";
import AddPage from "@/views/pageList/AddPage";
import PaymentGateways from "@/views/settings/PaymentGateways";
import OffCoupons from "@/views/settings/OffCoupons";
// axios.defaults.headers.post['Authorization'] = localStorage.getItem('token');
axios.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('token');

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard');
const PermissionGroup = () => import('@/views/permissions/PermissionGroups');
const AdminList = () => import('@/views/users/AdminList');
const UserList = () => import('@/views/users/UserList');
const AddUser = () => import('@/views/users/AddUser');
const EditUser = () => import('@/views/users/EditUser');
const UserProfile = () => import('@/views/users/UserProfile');

const Sliders = () => import('@/views/slider/Sliders');
const SliderImages = () => import('@/views/slider/SliderImages');

const Menus = () => import('@/views/menus/Menus');
const SectionList = () => import('@/views/display/home/SectionList');
const SectionRows = () => import('@/views/display/home/SectionRows');


const AddNews = () => import('@/views/blog/news/AddNews');


const TagsList = () => import('@/views/tags/TagsList');
const KeywordsList = () => import('@/views/keywords/KeywordsList');

const CommentsList = () => import('@/views/comments/CommentsList');

//Products
const AddProduct = () => import('@/views/products/AddProduct');
const ProductTagsList = () => import('@/views/products/ProductTagsList');

const ProductCommentsList = () => import('@/views/products/ProductCommentsList');
const ProductList = () => import('@/views/products/ProductList');
const ProductCategoryList = () => import('@/views/products/ProductCategoryList');

const ProductPropertyTemplateList = () => import('@/views/products/properties/ProductPropertyTemplateList');
const ProductPropertyTemplateGroupList = () => import('@/views/products/properties/ProductPropertyTemplateGroupList');
const ProductPropertyTemplateGroupItemList = () => import('@/views/products/properties/ProductPropertyTemplateGroupItemsList');



// Views - Notifications
const Settings = () => import('@/views/pages/Settings');

// Views - Pages
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');
const Login = () => import('@/views/pages/Login');
const Register = () => import('@/views/pages/Register');

// Users
const EditNews = () => import('@/views/blog/news/AddNews');
const NewsList = () => import('@/views/blog/news/NewsList');

Vue.use(Router);

let router = new Router({
    mode: 'history', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'active',
    scrollBehavior: () => ({y: 0}),
    routes: configRoutes(),

});
export default router

router.beforeEach((to, from, next) => {
    console.log("before each" + " token is " + localStorage.getItem('token'));
    // console.log("before each"+next);
    if (to.path == '/') {
        //  window.location.href = '/home';
    }


    if (to.matched.some(record => record.meta.requiresAuth)) {
        console.log("validate requiresAuth");

        if (localStorage.getItem('token') == null || localStorage.getItem('token') == '') {
            console.log("validate is null");

            next({
                path: 'dashboard/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
             validate_user(next, to);


            // let user = JSON.parse(localStorage.getItem('user'))
            // if(to.matched.some(record => record.meta.is_admin)) {
            //     if(user.is_admin == 1){
            //         next()
            //     }
            //     else{
            //         next({ name: 'userboard'})
            //     }
            // }else {
            //     next()
            // }
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        // if(localStorage.getItem('jwt') == null){
        next()
        // }
        // else{
        //     next({ name: 'userboard'})
        // }
    } else {
        next()
    }
});

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',

            name: 'پنل مدیریت',
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard',
            // redirect: '/dashboard',
            name: 'خانه',
            meta: {
                requiresAuth: true
            },
            component: TheContainer,
            children: [
                {
                    path: '/',
                    name: 'پنل مدیریت',
                    component: Dashboard,
                    meta: {
                        requiresAuth: true,
                    }
                },

                {
                    path: 'users',
                    name: 'کاربران',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                    },
                    children:[
                        {
                            path: 'permission-groups',
                            name: 'گروه های دسترسی',
                            props: true,
                            component: PermissionGroup,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "permission_groups"
                            }
                        },
                        {
                            path: 'admins',
                            name: 'مدیران',
                            props: true,
                            component: AdminList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "admins"
                            }
                        }, {
                            path: 'admins',
                            name: 'کاربران',
                            props: true,
                            component: UserList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "admins"
                            }
                        }, {
                            path: 'add-user',
                            name: 'افزودن کاربر',
                            props: true,
                            component: AddUser,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "admins"
                            }
                        }, {
                            path: 'edit-user/:user_id',
                            name: 'ویرایش کاربر',
                            props: true,
                            component: EditUser,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "admins"
                            }
                        },
                        {
                            path: 'profile',
                            name: 'پروفایل',
                            props: true,
                            component: UserProfile,
                            meta: {
                                requiresAuth: true,

                            }
                        },
                    ]
                },

                //*************************************************
                {
                    path: 'products',
                    name: 'محصولات',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                    },
                    children:[
                        {
                            path: 'list',
                            name: 'لیست محصولات',
                            props: true,
                            component: ProductList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_product"
                            }
                        },{
                            path: 'list/:cat_id',
                            name: 'لیست محصولات',
                            props: true,
                            component: ProductList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_product"
                            }
                        },

                        {
                            path: 'create',
                            name: 'افزودن محصول',
                            props: true,
                            component: AddProduct,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_product"
                            }
                        }, {
                            path: 'edit/:product_id',
                            name: 'ویرایش محصول',
                            props: true,
                            component: AddProduct,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_product"
                            }
                        }, {
                            path: 'category/:cat_id',
                            name: 'دسته بندی کالا ها',
                            props: true,
                            component: ProductCategoryList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_category"
                            }
                        }, {
                            path: 'tags',
                            name: 'برچسب محصولات',
                            props: true,
                            component: ProductTagsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_tags"
                            }
                        },{
                            path: 'comments',
                            name: 'دیدگاه محصولات',
                            props: true,
                            component: ProductCommentsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_comments"
                            }
                        },{
                            path: 'property-templates',
                            name: 'الگو ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "template_property"
                            }
                        },{
                            path: 'property-groups/:temp_id',
                            name: 'گروه ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateGroupList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "template_property"
                            }
                        },{
                            path: 'property-items/:group_id',
                            name: 'ایتم ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateGroupItemList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "template_property"
                            }
                        },{
                            path: 'product-bundles',
                            name: 'خصوصیات محصولات',
                            props: true,
                            component: ProductBundles,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_bundles"
                            }
                        },{
                            path: 'bundle-items/:bundle_id',
                            name: 'مقادیر خصوصیت',
                            props: true,
                            component: ProductBundleItems,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_bundles"
                            }
                        },{
                            path: 'brands',
                            name: 'برند',
                            props: true,
                            component: BrandList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_brands"
                            }
                        },{
                            path: 'labels',
                            name: 'لیبل ها',
                            props: true,
                            component: ProductLabelList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_labels"
                            }
                        },
                    ]
                },

                //*************************************************
                //*************************************************
                //*************************************************
                //*************************************************

                {
                    path: 'news',
                    name: 'نوشته',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                    },
                    children:[
                        {
                            path: 'categories/:cat_id',
                            name: 'دسته بندی',
                            props: true,
                            component: CategoryList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_category"

                            }
                        },
                        {
                            path: 'add-news',
                            name: 'افزودن نوشته',
                            props: true,
                            component: AddNews,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_post"
                            }
                        },{
                            path: 'edit-news/:post_id',
                            name: 'ویرایش نوشته',
                            props: true,
                            component: EditNews,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_post"
                            }
                        }, {
                            path: 'all-news',
                            name: 'همه نوشته ها',
                            props: true,
                            component: NewsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_post"
                            }
                        }, {
                            path: 'tags',
                            name: 'برچسب ها',
                            props: true,
                            component: TagsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_tags"
                            }
                        }, {
                            path: 'comments',
                            name: 'دیدگاه ها',
                            props: true,
                            component: CommentsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "blog_comments"
                            }
                        },
                    ]
                },
                //****************************************
                {
                    path: '/dashboard/display',
                    name: 'نمایش',
                    props: true,
                    component: {render (c){return c('router-view')}},

                    meta: {
                        requiresAuth: true,
                    },
                    children:[

                        {
                            path: 'slider-images/:slider_id',
                            name: 'تصاویر اسلایدر',
                            props: true,
                            component: SliderImages,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_slider"
                            }
                        },
                         {
                            path: 'menus/:menu_id',
                            name: 'منو',
                            props: true,
                            component: Menus,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_menu"
                            }
                        },
                    ]
                },
                //****************************************
                {
                    path: '/dashboard/settings',
                    name: 'تنظیمات',
                    props: true,
                    component: {render (c){return c('router-view')}},

                    meta: {
                        requiresAuth: true,
                        requiresRole: "ui_settings"
                    },
                    children:[

                        {
                            path: 'redirect',
                            name: 'ریدایرکت',
                            props: true,
                            component: Redirect,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "redirect"
                            }
                        },
                        {
                            path: 'shipping',
                            name: 'روش های ارسال',
                            props: true,
                            component: Shipping,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "shipping"
                            }
                        },
                        {
                            path: 'order_status',
                            name: 'وضعیت های سفارش',
                            props: true,
                            component: OrderStatuses,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_order_status"
                            }
                        },
                        {
                            path: 'gateways',
                            name: 'درگاه های پرداخت',
                            props: true,
                            component: PaymentGateways,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "gateways"
                            }
                        },
                        {
                            path: 'off_coupons',
                            name: 'کدهای تخفیف',
                            props: true,
                            component: OffCoupons,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "off_coupons"
                            }
                        },
                        {
                            path: 'main-setting',
                            name: 'تنظیمات کلی',
                            props: true,
                            component: Settings,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "basic_settings"
                            }
                        },
                    ]
                },
                //******************************************
                //*************************************************
                {
                    path: 'orders',
                    name: 'سفارشات',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                    },
                    children:[
                        {
                            path: 'list',
                            name: 'لیست سفارشات',
                            props: true,
                            component: OrderList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "order_list"
                            }
                        }, {
                            path: 'info/:order_id',
                            name: 'اطلاعات سفارش',
                            props: true,
                            component: OrderInfo,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "order_list"
                            }
                        }, {
                            path: 'add-order',
                            name: 'افزودن سفارش',
                            props: true,
                            component: AddOrder,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_order"
                            }
                        },

                    ]
                },

                //*************************************************
                {
                    path: 'pages',
                    name: 'صفحات',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                    },
                    children:[
                        {
                            path: 'list',
                            name: 'لیست صفحات',
                            props: true,
                            component: PageList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_page"
                            }
                        },{
                            path: 'add',
                            name: 'افزودن صفحه',
                            props: true,
                            component: AddPage,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "add_page"
                            }
                        },

                    ]
                },


            ]
        },
        {
            path: 'dashboard/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) {
                    return c('router-view')
                }
            },
            children: [
                {
                    path: '/dashboard/404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: '/dashboard/login',
                    name: 'Login',
                    component: Login
                },

                {
                    path: '/register',
                    name: 'Register',
                    component: Register
                }
            ]
        }
    ]
}

function validate_user(next, to) {
    let self = this;
    const formData = new FormData()
    let url;
    url = "/api/admin/user/validate-token";

    formData.append('token', localStorage.getItem('token'))

    axios.post(url, formData,{}).then((res) => {
        console.log("validate token is " + res.data);


        if (res.data.validate) {
            localStorage.setItem("permissions",JSON.stringify(res.data.permissions))
            console.log("validate is true");
            let meta_role = to.meta.requiresRole;
            // console.log("user name is "+ this.user_permissions.includes("edit_settings"));
            if (meta_role == null) {
                console.log("requiresRole is null");
                next();

            } else {
                console.log("requiresRole is " + meta_role);
                let permissions = res.data.permissions;
                if (permissions.includes(meta_role)) {
                    console.log("user has permissions ");
                    next();

                } else {
                    next({
                        path: '/dashboard/404',
                        params: {nextUrl: to.fullPath}
                    });
                }

            }

        } else {
            console.log("validate is false");

            next({
                path: '/dashboard/login',
            })
        }
        // return res.data;
    }).catch(function (error) {
            next({
                path: '/dashboard/login',
            })
            console.log(error);
        });

}

