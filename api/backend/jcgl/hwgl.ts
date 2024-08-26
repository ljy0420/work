import createAxios from '/@/utils/axios'

/**
 * 获取
 * @returns 
 */
export function cxhwzd(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxhwzd',
        method: 'post',
        data: params
    })
}

export function xzhwzd(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/xzhwzd',
        method: 'post',
        data: params
    })
}

export function xghwzd(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/xghwzd',
        method: 'post',
        data: params
    })
}
