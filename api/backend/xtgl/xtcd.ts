import createAxios from '/@/utils/axios'

/**
 * 获取上级菜单树
 * @returns 
 */
export function getParentMenus() {
    return createAxios({
        url: '/api/v1/xtsjwh/xtcdwh/ParentMenus',
        method: 'get'
    })
}