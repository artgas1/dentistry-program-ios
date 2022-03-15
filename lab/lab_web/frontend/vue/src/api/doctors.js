import callAPI from "./api";

const Doctors = {
    get: data => callAPI('/api/doctors/', 'GET', data),
    create: data => callAPI("/api/doctors/", 'POST', data),
    getById: id => callAPI(`/api/doctors/${id}`, 'GET'),
    deleteById: id => callAPI(`/api/doctors/${id}/`, 'DELETE'),
    updateById: (id, data) => callAPI(`/api/doctors/${id}/`, 'PATCH', data),
}

export default Doctors;