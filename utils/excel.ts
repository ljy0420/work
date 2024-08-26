import * as XLSX from 'xlsx'

function auto_width(ws: any, data: any) {
    /*设置工作表(worksheet)每列的最大宽度*/
    const colWidth = data.map((row: any) => row.map((val: any) => {
        /* 如果为null/undefined */
        if (val == null) {
            return { 'wch': 10 };
        }
        /* 如果是中文 */
        else if (val.toString().charCodeAt(0) > 255) {
            return { 'wch': val.toString().length * 2 };
        } else {
            return { 'wch': val.toString().length };
        }
    }))
    /*从第一行开始*/
    const result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
}

function json_to_array(key: any, jsonData: any) {
    return jsonData.map((v: any) => key.map((j: any) => { return v[j] }));
}

// 从excel文件中获取表头，返回数组
function get_header_row(sheet: any) {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let C
    const R = range.s.r /* 从第一行开始 */
    for (C = range.s.c; C <= range.e.c; ++C) { /* 遍历每一列 */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* 查找第一行中的单元格 */
        let hdr = 'UNKNOWN ' + C // 替换为所需的默认值
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
    }
    return headers
}

/**
* 文件流转换
*/
function s2ab(s: any) {
    if (typeof ArrayBuffer !== 'undefined') {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff
        }
        return buf
    } else {
        const buf = new Array(s.length)
        for (let i = 0; i != s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff
        }
        return buf
    }
}

export const export_table_to_excel = (id: any, filename: any, ignoreLastCol = true, ignoreCols: number[] = []) => {
    const copyTable = document.querySelector(id).cloneNode(true)
    let colCount = -1;
    if (copyTable.getElementsByClassName('el-table__header-wrapper').length > 0) {
        const header = copyTable.getElementsByClassName('el-table__header-wrapper')[0];
        const tbcells = header.getElementsByClassName('el-table__cell')
        colCount = tbcells.length;
    }
    // const wb = XLSX.utils.table_to_book(
    //     copyTable,
    //     { raw: true }
    // );
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(copyTable, { raw: true })
    XLSX.utils.book_append_sheet(wb, ws, filename);
    if (colCount > 0) {
        const firstSheetName = wb.SheetNames[0];
        if (ignoreLastCol) {
            wb.Sheets[firstSheetName]['!cols']![colCount - 1] = { hidden: true }
        }
        if (ignoreCols.length > 0) {
            ignoreCols.forEach((idx: number) => {
                wb.Sheets[firstSheetName]['!cols']![idx] = { hidden: true }
            })
        }
    }
    XLSX.writeFile(wb, filename + '.xlsx');
}

export const export_json_to_excel = (data: any, key: any, title: any, filename: string, autoWidth: boolean) => {
    const wb = XLSX.utils.book_new();
    data.unshift(title);
    const ws = XLSX.utils.json_to_sheet(data, { header: key, skipHeader: true });
    if (autoWidth) {
        const arr = json_to_array(key, data);
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

export const export_array_to_excel = (key: any, data: any, title: any, filename: string, autoWidth: boolean) => {
    const wb = XLSX.utils.book_new();
    const arr = json_to_array(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    if (autoWidth) {
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

export const read = (data: any, type: any) => {
    const workbook = XLSX.read(data, { type: type });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = get_header_row(worksheet);
    const results = XLSX.utils.sheet_to_json(worksheet);
    return { header, results };
}