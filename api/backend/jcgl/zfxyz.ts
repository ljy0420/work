import createAxios from '/@/utils/axios'

/**
 * 获取小类
 * @returns 
 */
export function getZfxyzXl() {
    return createAxios({
        url: '/api/v1/xtsjwh/zfxyzwh/getxl',
        method: 'get',
    })
}