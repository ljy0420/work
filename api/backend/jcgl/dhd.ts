import createAxios from '/@/utils/axios'

/**
 * 获取
 * @returns
 */
export function getdhd(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/dhd/index',
        method: 'post',
        data: params,
    })
}

export function getywcl(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/dhd/ywcl',
        method: 'post',
        data: params,
    })
}

export function dhdmx(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/dhd/dhdmx',
        method: 'post',
        data: params,
    })
}

/**
 * 新增
 * @returns
 */
export function ykDhdCreate(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/dhd/add',
        method: 'post',
        data: params,
    })
}

/**
 * 修改
 * @returns
 */
export function ykDhdEdit(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/dhd/edit',
        method: 'post',
        data: params,
    })
}
