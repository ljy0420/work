import createAxios from '/@/utils/axios'

/**
 * 简易挂号
 * @returns
 */

export const saveJygh = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/mzysjygh',
        method: 'POST',
        data,
    })
}

export const getGhlx = (data: any) => {
    return createAxios({
        url: '/api/v1/xtsjwh/ghlxwh/index',
        method: 'POST',
        data,
    })
}
