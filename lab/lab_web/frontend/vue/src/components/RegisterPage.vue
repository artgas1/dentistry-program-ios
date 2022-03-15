<template>
  <div>
    <div class="wrapper wrapper-full-page">
      <div
        class="full-page login-page section-image"
        filter-color="black"
        style="background: url(https://s3.amazonaws.com/uploads.bssskillmission/Jan122018160616.jpg) center / cover"
      >
        <div class="content">
          <div class="container">
            <div class="col-md-4 ml-auto mr-auto">
              <form @submit="doRegister">
                <div class="card card-login card-plain">
                  <div class="card-header">
                    <h2 class="text-white text-center">Регистрация</h2>
                  </div>
                  <div class="card-body">
                    <!--<div class="input-group no-border form-control-lg mt-4">
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.first_name"
                        placeholder="Имя"
                      />
                    </div>
                    <div class="input-group no-border form-control-lg">
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.last_name"
                        placeholder="Фамилия"
                      />
                    </div>-->
                    <div class="input-group no-border form-control-lg">
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.first_name"
                        placeholder="Название лаборатории"
                      />
                    </div>
                    <div class="input-group no-border form-control-lg mt-4">
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.username"
                        placeholder="Логин"
                      />
                    </div>
                    <div class="input-group no-border form-control-lg">
                      <input
                        type="email"
                        class="form-control"
                        v-model="form.email"
                        placeholder="Email"
                      />
                    </div>
                    <div class="input-group no-border form-control-lg mt-4">
                      <input
                        type="password"
                        v-model="form.password"
                        placeholder="Пароль"
                        class="form-control"
                      />
                    </div>
                    <div class="input-group no-border form-control-lg">
                      <input
                        type="password"
                        v-model="form.password_confirm"
                        placeholder="Повторите пароль"
                        class="form-control"
                      />
                    </div>
                    <button
                      type="submit"
                      class="mt-4 btn btn-primary btn-round btn-lg btn-block"
                    >Зарегистрироваться</button>
                  </div>
                  <div class="card-footer">
                    <div class="pull-left">
                      <h6>
                        <router-link to="/login" class="link footer-link">Вход</router-link>
                      </h6>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../api/auth";
export default {
  name: "RegisterPage",
  data() {
    return {
      form: {
        first_name: null,
        username: null,
        email: null,
        password: null,
        password_confirm: null
      }
    };
  },
  methods: {
    doRegister(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.form.password !== this.form.password_confirm) {
        window.alert("Пароль и подтверждение не совпадают");
      }
      Auth.register(this.form)
        .then(() => this.$router.push("/login/"))
        .catch(error => {
          if (error && error.response && error.response.status === 400) {
            for (let key in error.response.data) {
              error.response.data[key].forEach(x => window.alert(x));
            }
          }
        });
    }
  }
};
</script>

<style>
.full-page > .content {
  padding: 0 !important;
}
</style>