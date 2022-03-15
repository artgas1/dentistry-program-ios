<template>
  <div class="sidebar" data-color="primary">
    <div class="logo">
      <span class="w-100 text-center m-0 d-block text-white h5 py-4">D-Lab</span>
    </div>
    <div class="sidebar-wrapper" id="sidebar-wrapper">
      <ul class="nav">
        <li :class="currentMenuItem === 'home' ? 'active' : ''">
          <router-link to="#">
            <i class="jam jam-user"></i>
            <p>{{firstName}}</p>
          </router-link>
        </li>
        <!--<li :class="currentMenuItem === 'settings' ? 'active' : ''">
          <router-link to="/settings">
            <i class="jam jam-cog"></i>
            <p>Настройки</p>
          </router-link>
        </li>-->
        <li class="bottom-line mb-4">
          <a href="#" @click="doLogout">
            <i class="jam jam-log-out"></i>
            <p>Выход</p>
          </a>
        </li>
        <li :class="currentMenuItem === 'orders' ? 'active' : ''">
          <router-link to="/orders">
            <i class="jam jam-document"></i>
            <p>Наряды</p>
          </router-link>
        </li>
        <li :class="currentMenuItem === 'stock' ? 'active' : ''">
          <router-link to="/stock">
            <i class="jam jam-box"></i>
            <p>Склад</p>
          </router-link>
        </li>
        <li :class="currentMenuItem === 'finance' ? 'active' : ''">
          <router-link to="/finance">
            <i class="jam jam-credit-card"></i>
            <p>Финансы</p>
          </router-link>
        </li>
        <li :class="currentMenuItem === 'books' ? 'active' : ''">
          <router-link to="/books">
            <i class="jam jam-book"></i>
            <p>Справочники</p>
          </router-link>
        </li>
        <!--<li :class="currentMenuItem === 'reports' ? 'active' : ''">
          <router-link to="/reports">
            <i class="jam jam-pie-chart"></i>
            <p>Отчеты</p>
          </router-link>
        </li>-->
      </ul>
    </div>
  </div>
</template>

<script>
import Auth from "../../api/auth";
export default {
  name: "LNav",
  props: {
    currentMenuItem: {
      type: String
    }
  },
  computed: {
    firstName() {
      return localStorage.first_name;
    }
  },
  methods: {
    doLogout() {
      Auth.logout().finally(() => {
        delete localStorage.token;
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style>
.bottom-line > ::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 15px;
  height: 1px;
  width: calc(100% - 30px);
  background-color: rgba(255, 255, 255, 0.5);
  display: inline-block;
}
</style>