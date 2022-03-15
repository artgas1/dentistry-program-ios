import callAPI from "./api";

const Clinics = {
    get: data => callAPI('/api/clinics/', 'GET', data),
    create: data => callAPI("/api/clinics/", 'POST', data),
    getById: id => callAPI(`/api/clinics/${id}`, 'GET'),
    deleteById: id => callAPI(`/api/clinics/${id}/`, 'DELETE'),
    updateById: (id, data) => callAPI(`/api/clinics/${id}/`, 'PATCH', data)
}

export default Clinics;