import createAxios from '/@/utils/axios'

/**
 * 获取大类列表
 * @param params 
 * @returns 
 */
export function GetDaLeiLB(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/xtsjwh/xlzdwh/GetDaLeiLB',
        method: 'post',
        data:params
    })
}
