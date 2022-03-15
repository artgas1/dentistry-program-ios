import callAPI from "./api"
export default {
    get: () => callAPI('/api/payments/', 'GET'),
    create: data => callAPI('/api/payments/', 'POST', data),
    deleteById: id => callAPI(`/api/payments/${id}/`, 'DELETE'),
    ForOrder: {
        create: data => callAPI('/api/payments_for_order/', 'POST', data),
    }
}