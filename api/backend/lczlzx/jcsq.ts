import createAxios from '/@/utils/axios'

/**
 * 检查申请
 * @returns
 */

export const getJckdxm = (data: any) => {
    return createAxios({
        url: '/api/v1/mzgl/mzys/cxjckdxm',
        method: 'POST',
        data,
    })
}
