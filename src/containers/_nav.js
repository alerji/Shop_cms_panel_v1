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
                role: 'Dashboards',
            },

            // **************************
            {

                _name: 'CSidebarNavDropdown',
                name: 'بلاگ',
                route: '/dashboard/sale-orders',
                icon: 'cil-chart-line',

                items: [
                    {
                        name:"دسته بندی",
                        to: '/dashboard/news/categories/0',
                    },
                    {
                        name: "افزودن نوشته",
                        to: '/dashboard/news/add-news',
                        role: 'insert_post'
                    },
                    {
                        name: 'لیست نوشته ها',
                        to: '/dashboard/news/all-news',
                        role: 'insert_post',
                    },

                    {
                        name: 'برچسب ها',
                        to: '/dashboard/news/tags'
                        , role: 'edit_tags'
                    },
                    {
                        name: "دیدگاه ها",
                        to: '/dashboard/news/comments'
                        , role: 'verify_comments',
                    },
                ]
            },

            //**************************8
            {
                _name: 'CSidebarNavDropdown',
                name: "کاربران پنل",
                route: '/dashboard/users',
                icon: 'cil-truck',
                role: 'Delivery',

                items: [

                    {
                        name: 'گروه های دسترسی',
                        to: '/dashboard/users/permission-groups',
                        role: 'edit_admins'
                    }, {
                        name: 'مدیران',
                        to: '/dashboard/users/admins',
                        role: 'edit_admins'
                    },
                ]
            },
            //**************************8 //**************************8
            {
                name: 'سفارشات',

                _name: 'CSidebarNavDropdown',
                route: '/dashboard/orders',
                icon: 'cil-cart',
                role: 'Purchase',

                items: [

                    {
                        name: 'کل سفارشات',
                        to: '/dashboard/orders/list',
                        role: 'all_orders',

                    },
                    {
                        name: 'افزودن سفارش',
                        to: '/dashboard/orders/add-order'
                        , role: 'all_orders'

                    },

                ]
            },
            //**************************8 //**************************8
            {
                name: "محصولات",

                _name: 'CSidebarNavDropdown',
                route: '/dashboard/products',
                icon: 'cil-calculator',
                role: 'insert_product',

                items: [
                    {
                        name: "افزودن محصول",
                        to: '/dashboard/products/create',
                        role: 'insert_product'
                    }, {
                        name: "لیست محصولات",
                        to: '/dashboard/products/list',
                        role: 'insert_product'
                    }, {
                        name: "دسته بندی",
                        to: '/dashboard/products/category/0',
                        role: 'insert_product_category'
                    }, {
                        name: "الگو مشخصات",
                        to: '/dashboard/products/property-templates',
                        role: 'product_property'
                    }, {
                        name: "برچسب محصولات",
                        to: '/dashboard/products/tags',
                        role: 'edit_product_tags'
                    }, {
                        name: "دیدگاه محصولات",
                        to: '/dashboard/products/comments',
                        role: 'verify_product_comments'
                    }, {
                        name: "خصوصیات",
                        to: '/dashboard/products/product-bundles',
                        role: 'product_property'
                    }, {
                        name: "برند ها",
                        to: '/dashboard/products/brands',
                        role: 'product_property'
                    }, {
                        name: "لیبل ها",
                        to: '/dashboard/products/labels',
                        role: 'product_property'
                    },


                ]
            },

            //**************************8 //**************************8

            {

                _name: 'CSidebarNavDropdown',
                name: 'تنظیمات نمایش',
                route: '/dashboard/display',
                icon: 'cil-barcode',
                role: 'ui_settings',

                items: [
                    {
                        name: 'اسلایدر',
                        to: '/dashboard/display/sliders',
                        role: 'ui_settings'
                    },
                    {
                        name: 'منو صفحه اصلی',
                        to: "/dashboard/display/menus/0",
                        role: 'ui_settings'
                    },




                ]
            },
            //**************************8 //**************************8

            //**************************8 //**************************8
            {

                _name: 'CSidebarNavDropdown',
                name: 'صفحات',
                route: '/dashboard/pages',
                icon: 'cil-barcode',
                role: 'ui_settings',

                items: [
                    {
                        name: 'افزودن صفحه',
                        to: '/dashboard/pages/add',
                        role: 'ui_settings'
                    },
                    {
                        name: "لیست صفحات",
                        to: '/dashboard/pages/list',
                        role: 'ui_settings'
                    },
                ]
            },
            {

                _name: 'CSidebarNavDropdown',
                name: 'تنظیمات',
                route: '/dashboard/settings',
                icon: 'cil-barcode',
                role: 'ui_settings',

                items: [
                    {
                        name: 'روش های ارسال',
                        to: '/dashboard/settings/shipping',
                        role: 'ui_settings'
                    },
                    {
                        name: "ریدایرکت",
                        to: '/dashboard/settings/redirect',
                        role: 'ui_settings'
                    },
                    {
                        name: "وضعیت های سفارش",
                        to: '/dashboard/settings/order_status',
                        role: 'ui_settings'
                    },
                    {
                        name: "درگاه های پرداخت",
                        to: '/dashboard/settings/gateways',
                        role: 'ui_settings'
                    },
                    {
                        name: "تنظیمات کلی",
                        to: '/dashboard/settings/main-setting',
                        role: 'ui_settings'
                    },

                ]
            },

            {

                _name: 'CSidebarNavItem',
                name: "گزارشات کالا",
                route: '/dashboard/reports',
                to: '/dashboard/reports/all',
                icon: 'cil-book',
                role: 'edit_settings',
            },
            //**************************8


            //**************************8

            //**************************8 //**************************8 //**************************8 //**************************8
            //**************************8 //**************************8


        ]
    }
]
