import createAxios from '/@/utils/axios'

/**
 * 查询报损报溢单
 * @returns
 */

export const getBsbydList = (data:any) => {
    return createAxios({
        url: '/api/v1/ykzx/syd/index',
        method: 'POST',
        data
    })
}



/**
 * 查询报损报溢单明细
 * @returns
 */
export const ykBsbydMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/syd/cxsydmx',
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
 * 新增
 * @returns
 */
export const ykBsbydCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/syd/add',
        method: 'POST',
        data,
    })
}


/**
 * 审核  即修改
 * @returns
 */
export const ykBsbydEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/syd/edit',
        method: 'POST',
        data,
    })
}
