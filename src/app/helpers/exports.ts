import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Col {
    [key: string]: string,
}

export function exportTable(type: string = 'xlsx', data: any[], cols: Col[], nameFile: string = 'export') {

    const info = data.map((d: any) => {
        const obj: any = {};
        cols.forEach(c => {
            obj[c.header] = (d)[c.field];
        });
        return obj;
    });

    if (type === 'xlsx') {
        exportExcel();
    }

    if (type === 'pdf') {
        exportPdf();
    }

    function exportPdf() {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(nameFile.toUpperCase(), 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);

        (doc as any).autoTable({
            head: [cols.map(c => c['header'])],
            body: info.map(i => Object.values(i)),
            theme: 'plain',
        })

        doc.output('dataurlnewwindow')
        doc.save(`${nameFile}.pdf`);
    }

    function exportExcel() {
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
}

function saveAsExcelFile(buffer: any, fileName: string): void {
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