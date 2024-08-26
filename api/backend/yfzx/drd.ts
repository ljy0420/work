import createAxios from '/@/utils/axios'

/**
 * 查询调入单
 * @returns
 */
export const getDrdList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/drd/index',
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

/**
 * 查询调入单明细
 * @returns
 */
export const getDrdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/drd/cxdrdmx',
        method: 'POST',
        data,
    })
}
