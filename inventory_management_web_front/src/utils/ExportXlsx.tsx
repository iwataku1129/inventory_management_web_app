import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

type Input = {
    data: {}[],
    header?: string[],
    fileName: string,
    sheetName: string,
}

export const handleDownloadExcelClick = async (props: Input) => {
    const { data, header, fileName, sheetName } = props;

    const worksheet = XLSX.utils.json_to_sheet(data, header ? { header: header } : {});
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelUnit8Array = XLSX.write(workbook, { type: 'array' });
    const excelBlob = new Blob([excelUnit8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(excelBlob, fileName);
};