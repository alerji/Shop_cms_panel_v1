import i18n from "../i18n";

var selected_language = localStorage.getItem("language");
if (selected_language == '') {
    selected_language = 'en'
    i18n.locale = "en"
}
if (selected_language == "fa") {
    i18n.locale = "fa"
}
export default [
    {
        _name: 'CSidebarNav',
        redirect:'/dashboard/',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: 'داشبورد',
                to: '/dashboard',
                icon: 'cil-speedometer',
            },

            // **************************
            {

                _name: 'CSidebarNavDropdown',
                name: 'بلاگ',
                route: '/dashboard/news',
                icon: 'cil-address-book',

                items: [
                    {
                        name:"دسته بندی",
                        to: '/dashboard/news/categories/0',
                        role: 'blog_category'

                    },
                    {
                        name: "افزودن نوشته",
                        to: '/dashboard/news/add-news',
                        role: 'blog_post'
                    },
                    {
                        name: 'لیست نوشته ها',
                        to: '/dashboard/news/all-news',
                        role: 'blog_post',
                    },

                    {
                        name: 'برچسب ها',
                        to: '/dashboard/news/tags',
                        role: 'blog_tags'
                    },
                    {
                        name: "دیدگاه ها",
                        to: '/dashboard/news/comments'
                        , role: 'blog_comments',
                    },
                ]
            },

            //**************************8
            {
                _name: 'CSidebarNavDropdown',
                name: "کاربران پنل",
                route: '/dashboard/users',
                icon: 'cil-user',

                items: [

                    {
                        name: 'گروه های دسترسی',
                        to: '/dashboard/users/permission-groups',
                        role: 'permission_groups'
                    }, {
                        name: 'مدیران',
                        to: '/dashboard/users/admins',
                        role: 'admins'
                    },
                ]
            },
            //**************************8 //**************************8
            {
                name: 'سفارشات',

                _name: 'CSidebarNavDropdown',
                route: '/dashboard/orders',
                icon: 'cil-cart',

                items: [

                    {
                        name: 'کل سفارشات',
                        to: '/dashboard/orders/list',
                        role: 'order_list',

                    },
                    {
                        name: 'افزودن سفارش',
                        to: '/dashboard/orders/add-order'
                        , role: 'add_order'

                    },

                ]
            },
            //**************************8 //**************************8
            {
                name: "محصولات",

                _name: 'CSidebarNavDropdown',
                route: '/dashboard/products',
                icon: 'cil-calculator',

                items: [
                    {
                        name: "افزودن محصول",
                        to: '/dashboard/products/create',
                        role: 'add_product'
                    }, {
                        name: "لیست محصولات",
                        to: '/dashboard/products/list',
                        role: 'add_product'
                    }, {
                        name: "دسته بندی",
                        to: '/dashboard/products/category/0',
                        role: 'product_category'
                    }, {
                        name: "الگو مشخصات",
                        to: '/dashboard/products/property-templates',
                        role: 'template_property'
                    }, {
                        name: "برچسب محصولات",
                        to: '/dashboard/products/tags',
                        role: 'product_tags'
                    }, {
                        name: "دیدگاه محصولات",
                        to: '/dashboard/products/comments',
                        role: 'product_comments'
                    }, {
                        name: "خصوصیات",
                        to: '/dashboard/products/product-bundles',
                        role: 'product_bundles'
                    }, {
                        name: "برند ها",
                        to: '/dashboard/products/brands',
                        role: 'product_brands'
                    }, {
                        name: "لیبل ها",
                        to: '/dashboard/products/labels',
                        role: 'product_labels'
                    },


                ]
            },

            //**************************8 //**************************8

            {

                _name: 'CSidebarNavDropdown',
                name: 'تنظیمات نمایش',
                route: '/dashboard/display',
                icon: 'cil-monitor',

                items: [
                    {
                        name: 'تنظیمات قالب',
                        to: '/dashboard/display/template_settings',
                        role: 'template_settings'
                    }, {
                        name: 'اسلایدر',
                        to: '/dashboard/display/sliders',
                        role: 'ui_slider'
                    },
                    {
                        name: 'منو صفحه اصلی',
                        to: "/dashboard/display/menus/0",
                        role: 'ui_menu'
                    },




                ]
            },
            //**************************8 //**************************8

            //**************************8 //**************************8
            {

                _name: 'CSidebarNavDropdown',
                name: 'صفحات',
                route: '/dashboard/pages',
                icon: 'page',

                items: [
                    {
                        name: 'افزودن صفحه',
                        to: '/dashboard/pages/add',
                        role: 'add_page'
                    },
                    {
                        name: "لیست صفحات",
                        to: '/dashboard/pages/list',
                        role: 'add_page'
                    },
                ]
            },
            {

                _name: 'CSidebarNavDropdown',
                name: 'تنظیمات',
                route: '/dashboard/settings',
                icon: 'cil-settings',

                items: [
                    {
                        name: 'روش های ارسال',
                        to: '/dashboard/settings/shipping',
                        role: 'shipping'
                    },
                    {
                        name: "ریدایرکت",
                        to: '/dashboard/settings/redirect',
                        role: 'redirect'
                    },
                    {
                        name: "وضعیت های سفارش",
                        to: '/dashboard/settings/order_status',
                        role: 'add_order_status'
                    },
                    {
                        name: "کد های تخفیف",
                        to: '/dashboard/settings/off_coupons',
                        role: 'off_coupons'
                    },
                    {
                        name: "درگاه های پرداخت",
                        to: '/dashboard/settings/gateways',
                        role: 'gateways'
                    },
                    {
                        name: "تنظیمات کلی",
                        to: '/dashboard/settings/main-setting',
                        role: 'basic_settings'
                    },

                ]
            },

            // {
            //
            //     _name: 'CSidebarNavItem',
            //     name: "گزارشات کالا",
            //     route: '/dashboard/reports',
            //     to: '/dashboard/reports/all',
            //     icon: 'cil-book',
            //     role: 'edit_settings',
            // },
            //**************************8


            //**************************8

            //**************************8 //**************************8 //**************************8 //**************************8
            //**************************8 //**************************8


        ]
    }
]
