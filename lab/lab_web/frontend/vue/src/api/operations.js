import callAPI from "./api";

const Operations = {
    get: data => callAPI('/api/operations/', 'GET', data),
    create: data => callAPI("/api/operations/", 'POST', data),
    Prices: {
        create: data => callAPI('/api/operations_prices/', 'POST', data),
        updateById: (id, data) => callAPI(`/api/operations_prices/${id}/`, 'PATCH', data),
        deleteById: id => callAPI(`/api/operations_prices/${id}/`, 'DELETE'),
    },
    InOrders: {
        create: data => callAPI('/api/operations_in_orders/', 'POST', data), 
        updateById: (id, data) => callAPI(`/api/operations_in_orders/${id}/`, 'PATCH', data),
        deleteById: id => callAPI(`/api/operations_in_orders/${id}/`, 'DELETE'),
    },
    deleteById: id => callAPI(`/api/operations/${id}/`, 'DELETE'),
    getById: id => callAPI(`/api/operations/${id}/`, 'GET'),
    updateById: (id, data) => callAPI(`/api/operations/${id}/`, 'PATCH', data),
}

export default Operations;