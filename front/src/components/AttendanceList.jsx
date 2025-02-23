import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteAttendance } from "../redux/slices/attendanceSlice";
import * as XLSX from 'xlsx';

const AttendanceList = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === Number(companyId))
  );
  
  const attendanceList = useSelector(state => 
    state.attendance.attendanceList
      .filter(a => a.companyId === Number(companyId))
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
      })
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

  const handleDelete = (recordId) => {
    if (window.confirm('이 출석 기록을 삭제하시겠습니까?')) {
      dispatch(deleteAttendance(recordId));
    }
  };

  const handleExcelDownload = () => {
    const excelData = attendanceList.map(record => ({
      날짜: record.date,
      시간: record.time,
      이름: record.memberName,
      전화번호: record.phoneNumber,
      운동종류: record.exerciseType
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [
      { wch: 15 }, { wch: 10 }, { wch: 10 }, 
      { wch: 15 }, { wch: 10 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "출석기록");
    XLSX.writeFile(wb, `${company.name}_출석기록.xlsx`);
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {company.name} 출석 목록
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleExcelDownload}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              엑셀 다운로드
            </button>
            <button
              onClick={() => navigate(`/company/${companyId}/attendance/check`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              출석체크
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    운동종류
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceList.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.exerciseType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {attendanceList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            출석 기록이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList; 