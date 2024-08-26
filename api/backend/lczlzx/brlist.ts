import createAxios from '/@/utils/axios'

/**
 * 接诊列表
 * @returns
 */

export const getJzlb = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/jzlbcx',
        method: 'POST',
        data,
    })
}

export const brjzztxg = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/brjzztxg',
        method: 'POST',
        data,
    })
}
