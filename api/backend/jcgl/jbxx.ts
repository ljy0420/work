import createAxios from '/@/utils/axios'

/**
 * 获取疾病信息分类
 * @returns 
 */
export function getJbxxFl() {
    return createAxios({
        url: '/api/v1/xtsjwh/jbxxwh/cxjbfllb',
        method: 'post',
        data: { agrs: '0' }
    })
}