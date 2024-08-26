import createAxios from '/@/utils/axios'

/**
 *
 * 查询列表
 * @returns
 */
export function getTkdList(data: any) {
    return createAxios({
        url: '/api/v1/ykzx/tkd/index',
        method: 'post',
        data,
    })
}

/**
 * 新增
 * @returns
 */
export function ykTkdCreate(data: any) {
    return createAxios({
        url: '/api/v1/ykzx/tkd/add',
        method: 'post',
        data,
    })
}

/**
 * 修改
 * @returns
 */
export function ykTkdEdit(data: any) {
    return createAxios({
        url: '/api/v1/ykzx/tkd/edit',
        method: 'post',
        data,
    })
}

/**
 * 明细
 * @returns
 */
export const ykTkdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tkd/cxtkdmx',
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
 * 退库单---调用出库单明细
 * @returns
 */
export const dyCkdmx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tkd/dyckdmx',
        method: 'POST',
        data,
    })
}
