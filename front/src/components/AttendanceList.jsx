import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteAttendance } from "../redux/slices/attendanceSlice";
import * as XLSX from 'xlsx';

const AttendanceList = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 모든 출석 날짜 목록 가져오기
  const allDates = useSelector(state => {
    const dates = state.attendance.attendanceList
      .filter(a => a.companyId === Number(companyId))
      .map(a => a.date)
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));
    return dates;
  });

  // 현재 선택된 날짜 (기본값: 가장 최근 날짜)
  const [selectedDate, setSelectedDate] = useState(allDates[0] || new Date().toLocaleDateString());
  const [currentPage, setCurrentPage] = useState(1);
  const datesPerPage = 1; // 페이지당 날짜 수

  // 페이지네이션 계산
  const totalPages = Math.ceil(allDates.length / datesPerPage);
  const indexOfLastDate = currentPage * datesPerPage;
  const indexOfFirstDate = indexOfLastDate - datesPerPage;
  const currentDates = allDates.slice(indexOfFirstDate, indexOfLastDate);

  // 페이지 변경 처리
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedDate(allDates[pageNumber - 1]);
  };

  // 엑셀 다운로드 기간 state
  const [excelDateRange, setExcelDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === Number(companyId))
  );
  
  const attendanceByDate = useSelector(state => {
    const list = state.attendance.attendanceList.filter(a => 
      a.companyId === Number(companyId) &&
      a.date === selectedDate
    );

    const grouped = list.reduce((acc, record) => {
      const key = record.exerciseType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {});

    return list.map(record => {
      const exerciseType = record.exerciseType.toLowerCase();
      const limit = company?.limits?.[exerciseType]?.daily || 0;
      const groupCount = grouped[record.exerciseType].length;
      const isExceeded = limit > 0 && groupCount > limit;

      return {
        ...record,
        isExceeded,
        totalCount: groupCount,
        limit
      };
    }).sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`);
      const timeB = new Date(`${b.date} ${b.time}`);
      return timeB - timeA;
    });
  });

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
      dispatch(deleteAttendance({
        id: recordId,
        companyId: Number(companyId)
      }));
    }
  };

  const handleExcelDownload = () => {
    const start = new Date(excelDateRange.startDate);
    const end = new Date(excelDateRange.endDate);
    end.setHours(23, 59, 59);

    const filteredRecords = attendanceByDate.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });

    const excelData = filteredRecords.map(record => ({
      날짜: record.date,
      시간: record.time,
      이름: record.memberName,
      전화번호: record.phoneNumber,
      운동종류: record.exerciseType,
      상태: record.isExceeded 
        ? `초과 (${record.limit}명/${record.totalCount}명)`
        : `${record.limit}명/${record.totalCount}명`
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [
      { wch: 15 }, { wch: 10 }, { wch: 15 }, 
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "출석기록");
    XLSX.writeFile(wb, `${company.name}_출석기록_${excelDateRange.startDate}_${excelDateRange.endDate}.xlsx`);
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {company?.name} 출석 목록
          </h1>
          
          {/* 컨트롤 패널 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 페이지 네비게이션 */}
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 col-span-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    {'<<'}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    {'<'}
                  </button>
                  <span className="mx-4">
                    {selectedDate} (페이지 {currentPage} / {totalPages})
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    {'>'}
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    {'>>'}
                  </button>
                </div>
              </div>

              {/* 엑셀 다운로드 */}
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 col-span-2">
                <span className="text-sm text-gray-600 mr-2">엑셀 다운로드:</span>
                <input
                  type="date"
                  value={excelDateRange.startDate}
                  onChange={(e) => setExcelDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  className="px-2 py-1 border rounded-lg mr-2"
                />
                <span className="mx-2">~</span>
                <input
                  type="date"
                  value={excelDateRange.endDate}
                  onChange={(e) => setExcelDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="px-2 py-1 border rounded-lg mr-2"
                />
                <button
                  onClick={handleExcelDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  다운로드
                </button>
              </div>

              {/* 네비게이션 버튼 */}
              <div className="flex items-center justify-center space-x-2 col-span-2">
                <button
                  onClick={() => navigate(`/company/${companyId}/attendance/check`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1"
                >
                  출석체크
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex-1"
                >
                  홈으로
                </button>
              </div>
            </div>
          </div>

          {/* 출석 테이블 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      상태
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceByDate.map((record) => (
                    <tr key={record.id} className={`hover:bg-gray-50 ${
                      record.isExceeded ? 'bg-red-50' : ''
                    }`}>
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
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                        record.isExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {record.isExceeded 
                          ? `초과 (${record.limit}명/${record.totalCount}명)`
                          : `${record.limit}명/${record.totalCount}명`
                        }
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

          {attendanceByDate.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              출석 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList; 