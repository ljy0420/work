import createAxios from '/@/utils/axios'

/**
 * 查询报损报溢单
 * @returns
 */
export const getSydList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/syd/index',
        method: 'POST',
        data,
    })
}

/**
 * 新增报损报溢单
 * @returns
 */
export const yfSydCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/syd/add',
        method: 'POST',
        data,
    })
}

/**
 * 编辑报损报溢单
 * @returns
 */
export const yfSydEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/syd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 查询报损报溢单明细
 * @returns
 */
export const getSydDetail = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/syd/cxsydmx',
        method: 'POST',
        data,
    })
}
