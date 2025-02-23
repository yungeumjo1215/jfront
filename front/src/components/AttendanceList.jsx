import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as XLSX from 'xlsx';

const AttendanceList = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );
  
  const attendanceList = useSelector(state => 
    state.attendance.attendanceList.filter(a => a.companyId === parseInt(companyId))
  );

  const styles = {
    container: {
      marginTop: "64px",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
      color: "#333"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
    },
    th: {
      backgroundColor: "#f8f9fa",
      padding: "12px",
      borderBottom: "2px solid #dee2e6",
      textAlign: "left"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #dee2e6"
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px"
    },
    exportButton: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px"
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}:${seconds}`
    };
  };

  const handleExcelDownload = () => {
    // 엑셀 데이터 준비
    const excelData = attendanceList.map(record => ({
      날짜: record.date,
      시간: record.time,
      이름: record.memberName,
      전화번호: record.phoneNumber
    }));

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 열 너비 설정
    const columnWidths = [
      { wch: 15 },  // 날짜
      { wch: 10 },  // 시간
      { wch: 10 },  // 이름
      { wch: 15 }   // 전화번호
    ];
    ws['!cols'] = columnWidths;

    // 워크북에 시트 추가
    XLSX.utils.book_append_sheet(wb, ws, "출석기록");

    // 파일 저장
    const fileName = `${company?.name}_출석기록_${new Date().toLocaleDateString()}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {company.name} 출석 목록
        </h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    전화번호
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceList.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.memberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.phoneNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleExcelDownload}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            엑셀로 저장
          </button>
          <button
            onClick={() => navigate(`/company/${companyId}/attendance/check`)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            출석체크
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList; 