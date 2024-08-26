import createAxios from '/@/utils/axios'

/**
 * 查询出库单
 * @returns
 */
export const getChdList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/ckd/index',
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
export const ykChdEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/ckd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 新增
 * @returns
 */
export const ykChdCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/ckd/add',
        method: 'POST',
        data,
    })
}

/**
 * 明细
 * @returns
 */
export const ykChdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/ckd/cxckdmx',
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
        url: '/api/v1/ykzx/ckd/dyjhdmx',
        method: 'POST',
        data,
    })
}

/**
 * 查询药房
 * @returns
 */
export const cxYfYk = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxyfyk',
        method: 'POST',
        data,
    })
}
