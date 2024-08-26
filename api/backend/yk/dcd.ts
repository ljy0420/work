import createAxios from '/@/utils/axios'

/**
 * 查询调出单
 * @returns
 */
export const getDcdList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/dcd/index',
        method: 'POST',
        data,
    })
}

/**
 * 创建调出单
 * @returns
 */
export const ykDcdCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/dcd/add',
        method: 'POST',
        data,
    })
}

/**
 * 修改调出单
 * @returns
 */
export const ykDcdEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/dcd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 查询调出单明细
 * @returns
 */
export const getDcdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/dcd/cxdcdmx',
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
