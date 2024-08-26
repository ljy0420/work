import createAxios from '/@/utils/axios'

/**
 * 病历模板
 * @returns
 */

export const getBlmb = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/cxblzdmb',
        method: 'POST',
        data,
    })
}

export const saveBlmb = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/bcblzdmb',
        method: 'POST',
        data,
    })
}
