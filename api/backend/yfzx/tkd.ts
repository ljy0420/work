import createAxios from '/@/utils/axios'

/**
 * 查询退库单
 * @returns
 */
export const getTkdList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/tkd/index',
        method: 'POST',
        data,
    })
}

/**
 * 查询退库单明细
 * @returns
 */
export const getTkdDetail = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/tkd/cxtkdmx',
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
