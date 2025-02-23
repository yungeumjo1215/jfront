import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAttendance } from "../redux/slices/attendanceSlice";
import { selectMembers } from "../redux/slices/memberSlice";

const AttendanceCheck = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [phoneLastDigits, setPhoneLastDigits] = useState("");
  const [message, setMessage] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  
  const members = useSelector(selectMembers).filter(
    member => member.companyId === parseInt(companyId)
  );
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const attendanceList = useSelector(state => state.attendance.attendanceList);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!exerciseType) {
      setMessage("운동 종류를 선택해주세요.");
      return;
    }

    const member = members.find(m => m.phoneNumber.slice(-4) === phoneLastDigits);
    
    if (member) {
      // 오늘 이미 출석했는지 확인
      const today = new Date().toLocaleDateString();
      const alreadyChecked = attendanceList.some(a => 
        a.memberId === member.id && 
        a.date === today
      );

      if (alreadyChecked) {
        setMessage("이미 오늘 출석하셨습니다.");
        return;
      }

      const now = new Date();
      const attendance = {
        memberId: member.id,
        memberName: member.name,
        phoneNumber: member.phoneNumber,
        companyId: parseInt(companyId),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        exerciseType: exerciseType
      };
      
      dispatch(addAttendance(attendance));
      setMessage(`${member.name}님 출석이 완료되었습니다!`);
      setPhoneLastDigits("");
      setExerciseType("");
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setMessage("등록되지 않은 회원입니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">출석체크</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 운동 종류 선택 */}
          <div>
            <label className="block text-gray-700 mb-2">운동 종류</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="헬스"
                  checked={exerciseType === "헬스"}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="mr-2"
                />
                헬스
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="골프"
                  checked={exerciseType === "골프"}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="mr-2"
                />
                골프
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">전화번호 뒤 4자리</label>
            <input
              type="text"
              value={phoneLastDigits}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 4) {
                  setPhoneLastDigits(value);
                }
              }}
              className="w-full p-2 border rounded"
              maxLength="4"
              pattern="\d{4}"
              required
            />
          </div>

          {message && (
            <div className={`text-center ${
              message.includes("완료") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              출석체크
            </button>
            <button
              type="button"
              onClick={() => navigate(`/company/${companyId}/attendance`)}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              출석목록
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              홈으로
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceCheck; 