import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
};

export const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `${fileName}.xlsx`);
};

export const exportToPDF = (
    data: any[],
    fileName: string,
    title: string,
    stats?: { label: string, value: string }[],
    chartImage?: string
) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(22, 101, 52); // primary-dark
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(22);
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("TimeTrack Pro", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(title, 14, 30);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 196, 30, { align: 'right' });

    let currentY = 55;

    // Stats Section
    if (stats) {
        doc.setFontSize(12);
        doc.setTextColor(50);
        doc.setFont("helvetica", "bold");
        doc.text("Resumen del Periodo", 14, currentY);

        currentY += 10;
        stats.forEach((stat, i) => {
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(stat.label, 14 + (i * 50), currentY);
            doc.setFontSize(11);
            doc.setTextColor(22, 101, 52);
            doc.text(stat.value, 14 + (i * 50), currentY + 6);
        });
        currentY += 25;
    }

    // Chart Section
    if (chartImage) {
        doc.setFontSize(12);
        doc.setTextColor(50);
        doc.setFont("helvetica", "bold");
        doc.text("Carga de Trabajo", 14, currentY);

        try {
            doc.addImage(chartImage, 'PNG', 14, currentY + 5, 180, 80);
            currentY += 95;
        } catch (e) {
            console.error("Error adding image to PDF", e);
            currentY += 10;
        }
    }

    // Table Section
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.setFont("helvetica", "bold");
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.text("Desglose de Jornadas", 14, currentY);

    // Define table columns
    const columns = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));

    autoTable(doc, {
        head: [columns],
        body: rows as any[],
        startY: currentY + 5,
        theme: 'striped',
        headStyles: { fillColor: [22, 101, 52], fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        margin: { left: 14, right: 14 }
    });

    doc.save(`${fileName}.pdf`);
};
