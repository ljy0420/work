import createAxios from '/@/utils/axios'

/**
 * 病人病历诊断信息
 * @returns
 */

export const cxblzdxx = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/cxblzdxx',
        method: 'POST',
        data,
    })
}

export const bcblzdxx = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/bcblzdxx',
        method: 'POST',
        data,
    })
}
