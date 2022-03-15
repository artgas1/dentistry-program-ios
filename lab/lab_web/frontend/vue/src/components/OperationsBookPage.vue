<template>
  <div class="wrapper">
    <l-nav current-menu-item="books"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Справочники - Операции" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <l-table
                  v-if="items.length"
                  :columns="['ID','Наименование', 'Материалы', 'Действия']"
                >
                  <tr v-for="(item, index) in items" v-bind:key="index">
                    <td>{{item.id}}</td>
                    <td>{{item.operation_name}}</td>
                    <td>
                      <p
                        v-for="material in item.materials"
                        v-bind:key="material.material.id"
                      >{{material.material.material_name}} - {{material.amount}} {{material.material.unit}}</p>
                    </td>
                    <td>
                      <h5 class="m-0">
                        <router-link :to="`/operations/${item.id}/edit/`">
                          <i class="jam jam-pencil"></i>
                        </router-link>
                        <a href="#" @click="deleteOperation(item, index)" title="Удалить">
                          <i class="jam jam-trash text-danger"></i>
                        </a>
                      </h5>
                    </td>
                  </tr>
                </l-table>
                <div class="text-center text-muted p-4" v-if="!items.length">
                  Нет операций
                  <br />
                  <br />Добавьте операцию, используя кнопку "Добавить"
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
import LTable from "./blocks/LTable";
import LFooter from "./blocks/LFooter";
import Operations from "../api/operations";
export default {
  name: "OperationsBookPage",
  components: {
    LNav,
    LHeader,
    LTable,
    LFooter
  },
  data() {
    return {
      items: [],
      buttons: [
        {
          text: "Добавить операцию",
          click: () => this.$router.push("/operations/add/")
        }
      ]
    };
  },
  created() {
    Operations.get({}).then(response => (this.items = response.data));
  },
  methods: {
    deleteOperation(operation, index) {
      if (window.confirm("Вы уверены?")) {
        Operations.deleteById(operation.id).then(() => {
          this.$delete(this.items, index);
        });
      }
    }
  }
};
</script>

<style>
</style>