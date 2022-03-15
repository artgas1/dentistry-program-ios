import callAPI from "./api"
export default {
    get: () => callAPI("/api/orders/", "GET"),
    create: data => callAPI("/api/orders/", "POST", data),
    deleteById: id => callAPI(`/api/orders/${id}/`, 'DELETE'),
    getById: id => callAPI(`/api/orders/${id}/`, 'GET'),
    updateById: (id, data) => callAPI(`/api/orders/${id}/`, 'PATCH', data)
}