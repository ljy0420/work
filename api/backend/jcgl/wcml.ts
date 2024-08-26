import createAxios from '/@/utils/axios'

/**
 * 获取单位字典
 * @returns
 */
export function getdwzd(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/dwzd/index',
        method: 'post',
        data: data,
    })
}
