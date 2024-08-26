import createAxios from '/@/utils/axios'

/**
 * 检验申请
 * @returns
 */

export const getJykdxm = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/cxjykdxm',
        method: 'POST',
        data,
    })
}
