import createAxios from '/@/utils/axios'

/**
 * 获取频率字典
 * @param params 
 * @returns 
 */
export function getPlzd(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/plxxwh/index',
        method: 'post',
        data: params
    })
}

/**
 * 获取频率时间方案
 * @param params 
 * @returns 
 */
export function getPlsjfa(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/plxxwh/Plsjfa',
        method: 'post',
        data: params
    })
}