import createAxios from '/@/utils/axios'

/**
 * 获取电子签名图片
 * @param params 
 * @returns 
 */
export function getDzqmUrl(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ryzlwh/getdzqm',
        method: 'post',
        data: params
    })
}

/**
 * 保存医生权限
 * @param data 
 * @returns 
 */
export function saveYsqx(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ryzlwh/xgysqx',
        method: 'post',
        data: data
    })
}

/**
 * 获取医生权限
 * @param data 
 * @returns 
 */
export function getYsqx(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ryzlwh/ysqx',
        method: 'post',
        data: data
    })
}