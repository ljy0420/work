import createAxios from '/@/utils/axios'

/**
 * 获取小类
 * @returns 
 */
export function getXiaoLei() {
    return createAxios({
        url: '/api/v1/xtsjwh/cjxxwh/getxl',
        method: 'get',
    })
}
