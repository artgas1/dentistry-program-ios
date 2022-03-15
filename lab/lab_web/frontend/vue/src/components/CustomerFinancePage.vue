<template>
  <div class="wrapper">
    <l-nav current-menu-item="finance"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Финансы" :buttons="buttons">
        <div class="row">
          <div class="col-12">
            <h5 class="text-white my-3">{{subtitle}}</h5>
          </div>
          <div class="col-12 col-lg-auto d-flex text-right">
            <div class="bg-success card shadow w-auto">
              <div class="card-body mx-2 text-white">
                <h6 class="my-0 font-weight-normal w-100 text-right">Аванс</h6>
                <h1
                  class="font-weight-normal my-2 font-size-150"
                >{{customer.paid?customer.paid:0}} ₽</h1>
              </div>
            </div>
            <div class="bg-danger card ml-3 shadow w-auto">
              <div class="card-body text-white mx-2">
                <h6 class="my-0 font-weight-normal text-right">Долг</h6>
                <h1 class="font-weight-normal my-2">{{customer.debt?customer.debt:0}} ₽</h1>
              </div>
            </div>
          </div>
        </div>
      </l-header>
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <l-table v-if="payments.length" :columns="columns">
                  <tr v-for="(item, index) in payments" v-bind:key="index">
                    <td>{{item.id}}</td>
                    <td>{{item.date}}</td>
                    <td>{{item.amount}}&nbsp;&#x20bd;</td>
                    <td>{{item.balance}}&nbsp;&#x20bd;</td>
                    <td>{{item.payment_form}}</td>
                    <td>{{item.comment}}</td>
                    <td>
                      <h5 class="m-0">
                        <!--<router-link :to="`/payment/${item.id}`" title="Подробная информация">
                          <span class="jam jam-eye"></span>
                        </router-link>-->
                        <a
                          href="#"
                          @click="closePaymentRequested(item)"
                          v-if="item.balance && showCloseButtons"
                          title="Оплатить наряды"
                        >
                          <span class="jam jam-credit-card"></span>
                        </a>
                        <a href="#" @click="deletePayment(item, index)" title="Удалить">
                          <i class="jam jam-trash text-danger"></i>
                        </a>
                      </h5>
                    </td>
                  </tr>
                </l-table>
                <div class="text-center p-4" v-else>Нет данных</div>
              </div>
            </div>
          </div>
          <l-footer />
        </div>
      </div>
    </div>
    <modal :show.sync="showModal" v-if="showModal" modal-classes="modal-lg">
      <template slot="header">
        <div class="d-flex justify-content-between align-items-center w-100">
          <h5 class="m-0">Оплатить наряды</h5>
          <a
            href="#"
            @click="showModal = false; paymentToClose = null; return false;"
            data-dismiss="modal"
          >
            <h5 class="text-danger text-decoration-none font-weight-bold m-0">
              <i class="jam jam-close"></i>
            </h5>
          </a>
        </div>
      </template>
      <template slot="close-button"></template>
      <h6>Остаток платежа: {{getPaymentRest()}}&nbsp;&#x20bd;</h6>
      <l-chooser
        :multiple="true"
        :all-items-loader="loadOrders"
        title="Выбрать наряды"
        search-input-placeholder="ID наряда"
        :search-filter="(item, query) => item.id.toString().indexOf(query) + 1"
        :filter="orderFilter"
        @choose="orders => addOrders(orders)"
      >
        <template v-slot:addItemRow="{ item }">
          <div class="d-flex align-items-center w-100">
            <p class="my-0">Наряд №{{item.id}}</p>
            <p class="my-0 ml-auto">{{item.total_price-item.balance}}&nbsp;&#x20bd;</p>
          </div>
        </template>
      </l-chooser>
      <div v-if="paymentToClose.orders.length">
        <l-table :columns="['ID наряда', 'Сумма платежа', 'Максимальная сумма', 'Действия']">
          <tr v-for="(order, index) in paymentToClose.orders" v-bind:key="order.id">
            <td>{{order.id}}</td>
            <td>
              <div class="input-group">
                <input
                  class="form-control"
                  type="number"
                  :min="1"
                  :max="Math.min(getPaymentRest(order), order.total_price - order.balance)"
                  v-model="order.amount"
                  @input="$event => onOrderAmountInput(order, $event)"
                />
                <div class="input-group-append">
                  <span class="input-group-text">&#x20bd;</span>
                </div>
              </div>
            </td>
            <td>{{order.total_price - order.balance}}&nbsp;&#x20bd;</td>
            <td>
              <h5 class="m-0">
                <a
                  href="#"
                  @click="e => {e.preventDefault(); $delete(paymentToClose.orders, index); $forceUpdate(); return false;}"
                >
                  <span class="jam jam-trash text-danger"></span>
                </a>
              </h5>
            </td>
          </tr>
        </l-table>
      </div>
      <div v-else class="text-muted p-4 text-center">Нет нарядов</div>
      <template slot="footer">
        <button
          class="btn btn-primary w-100 d-block"
          @click="doPaymentClose()"
          v-if="paymentToClose.orders.length"
        >Оплатить</button>
      </template>
    </modal>
  </div>
</template>

<script>
import LNav from "./blocks/LNav";
import LHeader from "./blocks/LHeader";
import LFooter from "./blocks/LFooter";
import LTable from "./blocks/LTable";
import Clinics from "../api/clinics";
import Doctors from "../api/doctors";
import Payments from "../api/payments";
import Modal from "../now-ui/src/components/Modal";
import LChooser from "./blocks/LChooser";
import Orders from "../api/orders";
export default {
  name: "CustomersFinancePage",
  components: {
    LNav,
    LHeader,
    LTable,
    LFooter,
    Modal,
    LChooser
  },
  computed: {
    customerType() {
      return this.$route.params.type;
    },
    customerId() {
      return this.$route.params.id;
    },
    subtitle() {
      if (this.customerType === "clinics") {
        return `Клиника: ${this.customer.clinic_name}`;
      }
      return `Врач: ${this.customer.doctor_name}`;
    },
    columns() {
      return [
        "ID",
        "Дата платежа",
        "Сумма платежа",
        "Остаток платежа",
        "Способ оплаты",
        "Комментарий",
        "Действия"
      ];
    }
  },
  data() {
    return {
      buttons: [
        {
          text: "Добавить платеж",
          click: () => {
            this.$router.push({
              path: "/payments/add",
              query: { customer: `${this.customerType}-${this.customerId}` }
            });
          }
        }
      ],
      customer: {},
      payments: [],
      paymentToClose: null,
      showModal: false,
      showCloseButtons: true
    };
  },
  created() {
    this.initCustomer();
  },
  methods: {
    initCustomer() {
      // TODO return only this clinic/doctor owned payments as frontend cannot be trusted when we speak about deletions
      (this.customerType === "clinics" ? Clinics : Doctors)
        .getById(this.customerId)
        .then(response => {
          this.customer = response.data;
          Payments.get().then(response => {
            if (this.customerType === "clinics") {
              this.payments = response.data.filter(
                pt => pt.clinic && pt.clinic.id === this.customer.id
              );
            } else {
              this.payments = response.data.filter(
                pt => pt.doctor && pt.doctor.id === this.customer.id
              );
            }
            this.$set(
              this.customer,
              "paid",
              this.payments.reduce((a, b) => (a += b.balance), 0)
            );
          });
        });
      this.loadOrders();
    },
    deletePayment(payment, index) {
      if (window.confirm("Вы уверены?")) {
        Payments.deleteById(payment.id).then(() => {
          this.$delete(this.payments, index);
          this.loadOrders();
          this.$set(
            this.customer,
            "paid",
            this.payments.reduce((a, b) => (a += b.balance), 0)
          );
        });
      }
    },
    closePaymentRequested(item) {
      this.paymentToClose = Object.assign(item, { orders: [] });
      this.showModal = true;
    },
    loadOrders() {
      return new Promise((resolve, reject) => {
        Orders.get()
          .then(response => {
            let orders = response.data
              .filter(o => {
                if (this.customerType === "clinics") {
                  return o.clinic && this.customer.id === o.clinic.id;
                }
                return o.doctor && this.customer.id === o.doctor.id;
              })
              .filter(o => o.total_price - o.balance);
            this.showCloseButtons = !!orders.filter(o => o.is_closed).length;
            let debt = 0;
            orders.forEach(order => {
              debt += order.total_price;
              debt -= order.balance;
            });
            this.$set(this.customer, "debt", isNaN(debt) ? 0 : debt);
            this.$forceUpdate();
            resolve(orders.filter(o => o.is_closed));
          })
          .catch(reject);
      });
    },
    addOrders(orders) {
      orders.forEach(order => {
        this.paymentToClose.orders.push(Object.assign(order, { amount: 0 }));
      });
      this.$forceUpdate();
    },
    orderFilter(order) {
      let ret = true;
      this.paymentToClose.orders.forEach(o => {
        if (o.id === order.id) {
          ret = false;
        }
      });
      return ret;
    },
    getPaymentRest(ignoreOrder) {
      if (!this.paymentToClose) {
        return 0;
      }
      let ordersAmount = 0,
        balance = this.paymentToClose.balance;
      this.paymentToClose.orders.forEach(order => {
        if (ignoreOrder && ignoreOrder.id === order.id) {
          return;
        }
        ordersAmount += order.amount;
      });
      return balance - ordersAmount;
    },
    onOrderAmountInput(order, event) {
      let min = parseInt(event.target.min),
        max = parseInt(event.target.max),
        value = parseInt(event.target.value);
      if (isNaN(value)) {
        value = 0;
      }
      if (min > value) {
        value = min;
      } else if (max < value) {
        value = max;
      }
      this.$set(order, "amount", value);
      this.$forceUpdate();
    },
    doPaymentClose() {
      Payments.ForOrder.create(
        this.paymentToClose.orders.map(order => ({
          order_instance: order.id,
          payment_instance: this.paymentToClose.id,
          amount: order.amount
        }))
      ).then(() => {
        this.paymentToClose = null;
        this.showModal = false;
        this.initCustomer();
      });
    }
  }
};
</script>

<style>
</style>