import * as FileSaver from 'file-saver';

interface Col {
    [key: string]: string,
}

export function exportPdf() {
    console.log('pdf');
}

export function exportExcel(data: any[], cols: Col[], nameFile: string = 'export') {
    const info = data.map((d: any) => {
        const obj: any = {};
        cols.forEach(c => {
            obj[c.header] = (d)[c.field];
        });
        return obj;
    });

    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(info);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        saveAsExcelFile(excelBuffer, nameFile);
    });
}

export function saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
}