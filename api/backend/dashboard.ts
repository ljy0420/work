import createAxios from '/@/utils/axios'

export const url = '/api/v1/admin/'

export function dashboard() {
    return createAxios({
        url: url + 'dashboard',
        method: 'get',
    })
}

/**
 * 获取快捷菜单
 * @returns 
 */
export function GetShortcutMenus(data: any) {
    return createAxios({
        url: url + 'GetShortcutMenus',
        method: 'post',
        data: data
    })
}

/**
 * 保存快捷菜单
 * @param data 
 * @returns 
 */
export function SaveShortcutMenus(data: any) {
    return createAxios({
        url: url + 'SaveShortcutMenus',
        method: 'post',
        data: data
    })
}

/**
 * 获取待选菜单
 * @param data 
 * @returns 
 */
export function GetFlMenus(data: any) {
    return createAxios({
        url: url + 'GetFlMenus',
        method: 'post',
        data: data
    })
}
