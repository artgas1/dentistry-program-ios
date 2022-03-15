import callAPI from "./api";

const Technicians = {
    get: data => callAPI('/api/technicians/', 'GET', data),
    create: data => callAPI("/api/technicians/", 'POST', data),
    deleteById: id => callAPI(`/api/technicians/${id}/`, 'DELETE'),
    getById: id => callAPI(`/api/technicians/${id}/`, 'GET'),
    updateById: (id, data) => callAPI(`/api/technicians/${id}/`, 'PATCH', data),

}

export default Technicians;