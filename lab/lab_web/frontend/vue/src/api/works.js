import callAPI from "./api";

const Works = {
    get: data => callAPI('/api/works/', 'GET', data),
    create: data => callAPI("/api/works/", 'POST', data),
    Prices: {
        create: data => callAPI('/api/works_prices/', 'POST', data), 
        updateById: (id, data) => callAPI(`/api/works_prices/${id}/`, 'PATCH', data), 
        deleteById: id => callAPI(`/api/works_prices/${id}/`, 'DELETE'),
    },
    InOrders: {
        create: data => callAPI('/api/work_in_orders/', 'POST', data), 
        updateById: (id, data) => callAPI(`/api/work_in_orders/${id}/`, 'PATCH', data),
        deleteById: id => callAPI(`/api/work_in_orders/${id}/`, 'DELETE'),
    },
    deleteById: id => callAPI(`/api/works/${id}/`, 'DELETE'),
    getById: id => callAPI(`/api/works/${id}/`, 'GET'),
    updateById: (id, data) => callAPI(`/api/works/${id}/`, 'PATCH', data)
}

export default Works;