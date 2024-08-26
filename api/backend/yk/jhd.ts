import createAxios from '/@/utils/axios'

/**
 * 查询进货单
 * @returns
 */
export const getJhdList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/jhd/index',
        method: 'POST',
        data,
    })
}

/**
 * 创建进货单
 * @returns
 */
export const ykJhdCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/jhd/add',
        method: 'POST',
        data,
    })
}

/**
 * 修改进货单
 * @returns
 */
export const ykJhdEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/jhd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 修改进货单
 * @returns
 */
export const getJhdInfo = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/jhd/jhdmx',
        method: 'POST',
        data,
    })
}

/**
 * 修改进货单
 * @returns
 */
export const dyDhdDetail = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/jhd/scjhmx',
        method: 'POST',
        data,
    })
}
