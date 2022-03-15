<template>
  <div class="wrapper">
    <l-nav current-menu-item="finance"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header :title="title" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <div v-if="items.length">
                  <l-table :columns="columns">
                    <tr v-for="item in items" v-bind:key="item.id">
                      <td>{{item.id}}</td>
                      <td>{{financeType === 'clinics'?item.clinic_name:item.doctor_name}}</td>
                      <td>{{item.contacts}}</td>
                      <td>{{item.comment}}</td>
                      <td>
                        <h5 class="m-0">
                          <router-link
                            :to="`/finance/${financeType}/${item.id}`"
                            title="Подробная информация"
                          >
                            <span class="jam jam-eye"></span>
                          </router-link>
                        </h5>
                      </td>
                    </tr>
                  </l-table>
                </div>
                <div class="text-center p-4" v-else>{{noItemsText}}</div>
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
import Clinics from "../api/clinics";
import Doctors from "../api/doctors";
export default {
  name: "CustomersFinancePage",
  components: {
    LNav,
    LHeader,
    LTable,
    LFooter
  },
  computed: {
    financeType() {
      return this.$route.params.type;
    },
    title() {
      let title = "Финансы - ";
      if (this.financeType === "clinics") {
        title += "Клиники";
      } else {
        title += "Врачи";
      }
      return title;
    },
    noItemsText() {
      return this.financeType === "clinics" ? "Нет клиник" : "Нет врачей";
    },
    columns() {
      if (this.financeType === "clinics") {
        return [
          "ID",
          "Название клиники",
          "Контакты",
          "Комментарий",
          "Действия"
        ];
      }
      return ["ID", "ФИО", "Контакты", "Комментарий", "Действия"];
    }
  },
  data() {
    return {
      items: [],
      buttons: []
    };
  },
  created() {
    (this.financeType === "clinics" ? Clinics : Doctors)
      .get({})
      .then(response => (this.items = response.data));
  }
};
</script>

<style>
</style>