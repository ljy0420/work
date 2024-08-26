import createAxios from '/@/utils/axios'

/**
 * 查询入库单
 * @returns
 */
export const getRkdList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/rkd/index',
        method: 'POST',
        data,
    })
}

/**
 * 查询入库单明细
 * @returns
 */
export const getRkdDetail = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/rkd/cxrkdmx',
        method: 'POST',
        data,
    })
}
