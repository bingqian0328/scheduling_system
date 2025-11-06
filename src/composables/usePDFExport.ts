import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { roles, getRoleColor, getRoleDisplayName } from '@/utils/scheduling';
import type { WeekDay, ShiftAssignment } from '@/types/scheduling';

export function usePDFExport() {
  const isExporting = ref(false);

  const exportToPDF = async (
    weekRange: string,
    weekDays: WeekDay[],
    getShiftAssignments: (date: string) => ShiftAssignment[]
  ) => {
    isExporting.value = true;
    
    try {
      // Create a clean version of the schedule for PDF
      const exportContent = document.createElement('div');
      exportContent.className = 'pdf-export-content';
      exportContent.innerHTML = generatePDFContent(weekRange, weekDays, getShiftAssignments);
      
      // Temporarily add to document to render
      document.body.appendChild(exportContent);
      
      // Convert to canvas
      const canvas = await html2canvas(exportContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary element
      document.body.removeChild(exportContent);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Generate filename with current week
      const filename = `周程安排表_${weekRange.replace(/ - /g, '_至_')}.pdf`;
      
      // Save PDF
      pdf.save(filename);
      
      ElMessage.success('PDF导出成功！');
      
    } catch (error: any) {
      console.error('PDF export error:', error);
      ElMessage.error(`PDF导出失败: ${error.message}`);
    } finally {
      isExporting.value = false;
    }
  };

  const generatePDFContent = (
    weekRange: string,
    weekDays: WeekDay[],
    getShiftAssignments: (date: string) => ShiftAssignment[]
  ): string => {
    return `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">📊 周程安排表</h1>
          <h2 style="color: #666; font-weight: normal;">${weekRange}</h2>
        </div>
        
        <!-- Legend -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">职位说明：</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${roles.map(role => `
              <span style="padding: 8px 16px; border-radius: 20px; font-size: 14px; background-color: ${getRoleColor(role)}; border: 1px solid #e0e0e0;">
                ${getRoleDisplayName(role)}
              </span>
            `).join('')}
          </div>
        </div>
        
        <!-- Schedule Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              ${weekDays.map(day => `
                <th style="border: 1px solid #e0e0e0; padding: 15px; text-align: center;">
                  <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${day.name}</div>
                  <div style="font-size: 14px; color: #666;">${day.date}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${weekDays.map(day => {
                const assignments = getShiftAssignments(day.date ?? '');
                return `
                  <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top; min-height: 120px;">
                    ${assignments.map(assignment => `
                      <div style="padding: 6px 8px; margin-bottom: 4px; border-radius: 6px; font-size: 12px; background-color: ${getRoleColor(assignment.role)}; border: 1px solid #d0d0d0;">
                        <div style="font-weight: 600; margin-bottom: 2px;">${assignment.name}</div>
                        <div style="font-size: 10px; opacity: 0.8;">${getRoleDisplayName(assignment.role)}</div>
                      </div>
                    `).join('')}
                  </td>
                `;
              }).join('')}
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: right; font-size: 12px; color: #999;">
          生成时间: ${new Date().toLocaleString('zh-CN')}
        </div>
      </div>
    `;
  };

  return {
    isExporting,
    exportToPDF,
  };
}
