import callAPI from "./api";

const Materials = {
    get: data => callAPI('/api/materials/', 'GET', data),
    create: data => callAPI("/api/materials/", 'POST', data),
    UsedOnOperation: {
        create: data => callAPI('/api/materials_used_on_operation/', 'POST', data),
        deleteById: id =>  callAPI(`/api/materials_used_on_operation/${id}/`, 'DELETE'),
        updateById: (id, data) => callAPI(`/api/materials_used_on_operation/${id}/`, 'PATCH', data),
    },
    OnStock: {
        create: data => callAPI('/api/materials_on_stock/', 'POST', data),
        get: () => callAPI('/api/materials_on_stock/', 'GET'),
    },
    Adding: {
        create: data => callAPI('/api/materials_adding/', 'POST', data),
        get: () => callAPI('/api/materials_adding/', 'GET'),
    },
    deleteById: id => callAPI(`/api/materials/${id}/`, 'DELETE'),
    getById: id => callAPI(`/api/materials/${id}/`, 'GET'),
    updateById: (id, data) => callAPI(`/api/materials/${id}/`, 'PATCH', data),
}

export default Materials;