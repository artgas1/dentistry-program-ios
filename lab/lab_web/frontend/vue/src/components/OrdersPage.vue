<template>
  <div class="wrapper">
    <l-nav current-menu-item="orders"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Наряды" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <l-table
                  v-if="items.length"
                  :columns="['ID','Клиника', 'Врач', 'Пациент', /*'Статус',*/ 'Срок выполнения', 'Общая стоимость', 'Закрыт', 'Оплачен', 'Действия']"
                >
                  <tr v-for="(item, index) in items" v-bind:key="index">
                    <td>{{item.id}}</td>
                    <td>{{item.clinic?item.clinic.clinic_name:'-'}}</td>
                    <td>{{item.doctor?item.doctor.doctor_name:'-'}}</td>
                    <td>{{item.patient}}</td>
                    <!--<td>{{item.progress}}</td>-->
                    <td>{{item.deadline}}</td>
                    <td>{{item.total_price}} &#x20bd;</td>
                    <td>
                      <p v-if="item.is_closed" class="text-success m-0">Да</p>
                      <p v-else class="text-danger m-0">Нет</p>
                    </td>
                    <td>
                      <p v-if="item.balance === item.total_price" class="text-success m-0">Да</p>
                      <p v-else class="text-danger m-0">Нет</p>
                    </td>
                    <td>
                      <h5 class="m-0">
                        <router-link :to="`/orders/${item.id}/edit/`" v-if="!item.is_closed">
                          <i class="jam jam-pencil"></i>
                        </router-link>
                        <a href="#" @click="closeOrder(item)" title="Закрыть наряд" v-if="!item.is_closed">
                          <i class="jam jam-close-rectangle"></i>
                        </a>
                        <a href="#" @click="deleteOrder(item, index)" title="Удалить">
                          <i class="jam jam-trash text-danger"></i>
                        </a>
                      </h5>
                    </td>
                  </tr>
                </l-table>
                <div class="text-center text-muted p-4" v-if="!items.length">
                  Нет нарядов
                  <br />
                  <br />Добавьте наряд, используя кнопку "Добавить"
                </div>
              </div>
            </div>
          </div>
          <l-footer />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LNav from "./blocks/LNav";
import LHeader from "./blocks/LHeader";
import LFooter from "./blocks/LFooter";
import LTable from "./blocks/LTable";
import Orders from "../api/orders";
export default {
  name: "OrdersPage",
  components: {
    LNav,
    LHeader,
    LFooter,
    LTable
  },
  data() {
    return {
      buttons: [
        {
          text: "Добавить",
          click: event => {
            event.preventDefault();
            this.$router.push("/orders/add/");
            return false;
          }
        }
      ],
      items: []
    };
  },
  created() {
    Orders.get().then(response => (this.items = response.data));
  },
  methods: {
    deleteOrder(order, index) {
      if (window.confirm("Вы уверены?")) {
        Orders.deleteById(order.id).then(() => {
          this.$delete(this.items, index);
        });
      }
    },
    closeOrder(order) {
      if (window.confirm("Вы уверены?")) {
        Orders.updateById(order.id, { is_closed: true }).then(() =>
          this.$set(order, "is_closed", true)
        );
      }
    }
  }
};
</script>

<style>
</style>