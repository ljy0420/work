import createAxios from '/@/utils/axios'

/**
 * 获取样式登记详情
 * @returns 
 */
export function getYsdjDetail(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ysdjwh/Detail',
        method: 'get',
        params: params
    })
}

/**
 * 保存样式登记内容
 * @param data 
 * @returns 
 */
export function saveYsdjnr(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ysdjwh/SaveYsdjnr',
        method: 'post',
        data:{ agrs: data }
    },
    {
        showSuccessMessage: true,
    })
}