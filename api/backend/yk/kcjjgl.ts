import createAxios from '/@/utils/axios'

/**
 * 查询
 * @returns
 */
export const getKcjjList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxypcbxl',
        method: 'POST',
        data,
    })
}

/**
 * 修改
 * @returns
 */
export const kcjjdetails = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/xgypcbxl',
        method: 'POST',
        data,
    })
}

/**
 * 获取药房药库
 * @returns
 */
export const getykList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxyfyk',
        method: 'POST',
        data,
    })
}

/**
 * 获取药品分类
 * @returns
 */
export const getypflList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxypfl',
        method: 'POST',
        data,
    })
}
