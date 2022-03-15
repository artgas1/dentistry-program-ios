import callAPI from "./api";
export default {
    Works: {
        get: () => callAPI('/api/works_price_lists/', 'GET'),
        create: data => callAPI('/api/works_price_lists/', 'POST', data),
        getById: id => callAPI(`/api/works_price_lists/${id}/`, 'GET'),
        deleteById: id => callAPI(`/api/works_price_lists/${id}/`, 'DELETE'),
        updateById: (id, data) => callAPI(`/api/works_price_lists/${id}/`, 'PATCH', data),
    },
    Operations: {
        get: () => callAPI('/api/operations_price_lists/', 'GET'),
        create: data => callAPI('/api/operations_price_lists/', 'POST', data),
        deleteById: id => callAPI(`/api/operations_price_lists/${id}/`, 'DELETE'),
        updateById: (id, data) => callAPI(`/api/operations_price_lists/${id}/`, 'PATCH', data),
        getById: id => callAPI(`/api/operations_price_lists/${id}/`, 'GET'),
    },

}