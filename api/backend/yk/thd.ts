import createAxios from '/@/utils/axios'

/**
 * 查询退货单
 * @returns
 */
export const getThdList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/thd/index',
        method: 'POST',
        data,
    })
}

/**
 * 查询药品
 * @returns
 */
export const getYpInfo = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/Index',
        method: 'POST',
        data,
    })
}

/**
 * 修改
 * @returns
 */
export const ykThdEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/thd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 新增
 * @returns
 */
export const ykThdCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/thd/add',
        method: 'POST',
        data,
    })
}

/**
 * 新增
 * @returns
 */
export const ykThdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/thd/cxthdmx',
        method: 'POST',
        data,
    })
}

/**
 * 退货单---调用进货单明细
 * @returns
 */
export const dyJhdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/thd/dyjhdmx',
        method: 'POST',
        data,
    })
}
