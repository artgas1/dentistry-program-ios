import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"

import StockPage from "./components/StockPage"
import OrdersPage from "./components/OrdersPage"
import BooksPage from "./components/BooksPage"
import AddMaterialPage from "./components/AddMaterialPage"
import WorksBookPage from "./components/WorksBookPage"
import DoctorsBookPage from "./components/DoctorsBookPage"
import OperationsBookPage from "./components/OperationsBookPage"
import TechniciansBookPage from "./components/TechniciansBookPage"
import ClinicsBookPage from "./components/ClinicsBookPage"
import MaterialsBookPage from "./components/MaterialsBookPage"
import AddClinicPage from "./components/AddClinicPage"
import AddDoctorPage from "./components/AddDoctorPage"
import AddTechnicianPage from "./components/AddTechnicianPage"
import AddOperationPage from "./components/AddOperationPage"
import AddWorkPage from "./components/AddWorkPage"
import LoginPage from "./components/LoginPage";
import PricelistsBookPage from "./components/PricelistsBookPage";
import AddPricelistPage from "./components/AddPricelistPage"
import AddOrderPage from "./components/AddOrderPage"
import RegisterPage from "./components/RegisterPage"
import FinancePage from "./components/FinancePage"
import CustomersFinancePage from "./components/CustomersFinancePage"
import CustomerFinancePage from "./components/CustomerFinancePage"
import AddPaymentPage from "./components/AddPaymentPage"

import "./assets/css/lab.css";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    routes: [{
        name: "stock",
        path: "/stock/",
        title: "Склад",
        component: StockPage
    },
    {
        name: "orders",
        path: "/orders/",
        title: "Наряды",
        component: OrdersPage
    },
    {
        name: "books",
        path: "/books/",
        title: "Справочники",
        component: BooksPage
    },
    {
        name: "add-material",
        path: "/materials/add/",
        title: "Добавить материал",
        component: AddMaterialPage
    },
    {
        name: "book-works",
        path: "/books/works/",
        title: "Справочиники - Работы",
        component: WorksBookPage
    },
    {
        name: "book-operations",
        path: "/books/operations/",
        title: "Справочиники - Операции",
        component: OperationsBookPage
    },
    {
        name: "book-doctors",
        path: "/books/doctors/",
        title: "Справочиники - Врачи",
        component: DoctorsBookPage
    },
    {
        name: "book-technicians",
        path: "/books/technicians/",
        title: "Справочиники - Техники",
        component: TechniciansBookPage
    },
    {
        name: "book-clinics",
        path: "/books/clinics/",
        title: "Справочиники - Клиники",
        component: ClinicsBookPage
    },
    {
        name: "book-materials",
        path: "/books/materials/",
        title: "Справочиники - Материалы",
        component: MaterialsBookPage
    },
    {
        name: "add-clinic",
        path: "/clinics/add/",
        title: "Добавить клинику",
        component: AddClinicPage
    },
    {
        name: "add-doctor",
        path: "/doctors/add/",
        title: "Добавить врача",
        component: AddDoctorPage
    },
    {
        name: "add-operation",
        path: "/operations/add/",
        title: "Добавить операцию",
        component: AddOperationPage
    },
    {
        name: "add-techncian",
        path: "/technicians/add/",
        title: "Добавить техника",
        component: AddTechnicianPage
    },
    {
        name: "add-work",
        path: "/works/add/",
        title: "Добавить работу",
        component: AddWorkPage
    }, {
        name: "login",
        path: "/login",
        title: "Вход",
        component: LoginPage,
    }, {
        name: "book-pricelists-works",
        path: "/books/pricelists/:type/",
        title: "Справочники - Прайс-листы",
        component: PricelistsBookPage,
    },
    {
        name: "add-pricelist",
        path: "/pricelists/:type/add/",
        title: "Добавить прайс-лист",
        component: AddPricelistPage,
    }, {
        name: "add-order",
        path: "/orders/add/",
        title: "Добавить наряд",
        component: AddOrderPage,
    }, {
        name: "register",
        path: "/register",
        title: "Регистрация",
        component: RegisterPage,
    },
    {
        name: "finance",
        path: "/finance",
        title: "Финансы",
        component: FinancePage
    },
    {
        name: "finance-customers",
        path: "/finance/:type",
        title: "Финансы",
        component: CustomersFinancePage
    },
    {
        name: "finance-customer",
        path: "/finance/:type/:id",
        title: "Финансы заказчика",
        component: CustomerFinancePage
    },
    {
        name: "add-payment",
        path: "/payments/add",
        title: "Добавить платеж",
        component: AddPaymentPage
    },
    {
        name: "edit-material",
        path: "/materials/:id/edit/",
        title: "Редактировать материал",
        component: AddMaterialPage
    },
    {
        name: "edit-operation",
        path: "/operations/:id/edit/",
        title: "Редактировать операцию",
        component: AddOperationPage
    },
    {
        name: "edit-work",
        path: "/works/:id/edit/",
        title: "Редактировать работу",
        component: AddWorkPage
    },
    {
        name: "edit-clinic",
        path: "/clinics/:id/edit/",
        title: "Редактировать клинику",
        component: AddClinicPage
    },
    {
        name: "edit-doctor",
        path: "/doctors/:id/edit/",
        title: "Редактировать врача",
        component: AddDoctorPage
    },
    {
        name: "edit-technicians",
        path: "/technicians/:id/edit/",
        title: "Редактировать техника",
        component: AddTechnicianPage
    },
    {
        name: "edit-pricelists",
        path: "/pricelists/:type/:id/edit/",
        title: "Редактировать прайс-лист",
        component: AddPricelistPage
    },
    {
        name: "edit-order",
        path: "/orders/:id/edit/",
        title: "Редактировать наряд",
        component: AddOrderPage
    }
    ]
});

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')