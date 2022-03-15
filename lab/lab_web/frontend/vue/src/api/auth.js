import callAPI from './api'

const Auth = {
    login: data => callAPI("/api/accounts/login/", "POST", data),
    logout: data => callAPI("/api/accounts/logout/", "POST", data),
    register: data => callAPI("/api/accounts/register/", "POST", data),
    profile: () => callAPI("/api/accounts/profile/", "GET"),
};

export default Auth;