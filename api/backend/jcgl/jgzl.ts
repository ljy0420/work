import createAxios from '/@/utils/axios'

/**
 * 获取机构信息
 * @returns 
 */
export function getJgxx(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/jgzlwh/index',
        method: 'post',
        data: params
    })
}

/**
 * 获取区划信息
 * @returns 
 */
export function getQhxx() {
    return createAxios({
        url: '/api/v1/xtsjwh/jgzlwh/cxqh',
        method: 'post',
        data: { agrs: '-1' }
    })
}

/**
 * 修改机构信息
 * @returns 
 */
export function editJgxx(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/jgzlwh/edit',
        method: 'post',
        data: params
    },
    {
        showSuccessMessage: true,
    })
}