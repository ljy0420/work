import createAxios from '/@/utils/axios'

/**
 * 查询请领单
 * @returns
 */
export const getQldList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/qld/index',
        method: 'POST',
        data,
    })
}

/**
 * 新增请领单
 * @returns
 */
export const yfQldCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/qld/add',
        method: 'POST',
        data,
    })
}

/**
 * 编辑请领单
 * @returns
 */
export const yfQldEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/qld/edit',
        method: 'POST',
        data,
    })
}

/**
 * 查询请领单明细
 * @returns
 */
export const getQldMx = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/qld/cxqldmx',
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
