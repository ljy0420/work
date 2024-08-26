import createAxios from '/@/utils/axios'

/**
 * 获取疾病信息分类
 * @returns 
 */
export function getSsxxFl() {
    return createAxios({
        url: '/api/v1/xtsjwh/ssxxwh/cxssfl',
        method: 'post',
        data: { agrs: '0' }
    })
}

/**
 * 新增手术分类
 * @param data 
 * @returns 
 */
export function addFenLei(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ssxxwh/xzssfl',
        method: 'post',
        data:{ agrs: data }
    },
    {
        showSuccessMessage: true,
    })
}

/**
 * 修改手术分类
 * @param data 
 * @returns 
 */
export function editFenLei(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ssxxwh/xgssfl',
        method: 'post',
        data:{ agrs: data }
    },
    {
        showSuccessMessage: true,
    })
}