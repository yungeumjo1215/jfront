import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAttendance } from "../redux/slices/attendanceSlice";

const AttendanceCheck = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [phoneLastDigits, setPhoneLastDigits] = useState("");
  const [message, setMessage] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [matchingMembers, setMatchingMembers] = useState([]); // 일치하는 회원들
  const [selectedMemberId, setSelectedMemberId] = useState(null); // 선택된 회원
  
  const members = useSelector(state => 
    state.members.membersList.filter(
      member => member.companyId === parseInt(companyId)
    )
  );
  
  const company = useSelector(state =>
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  // 오늘 운동 종류별 출석 수 계산
  const todayAttendance = useSelector(state => {
    const today = new Date().toLocaleDateString();
    const attendanceList = state.attendance.attendanceList.filter(a => 
      a.companyId === parseInt(companyId) && a.date === today
    );

    return {
      health: attendanceList.filter(a => a.exerciseType === "헬스").length,
      golf: attendanceList.filter(a => a.exerciseType === "골프").length
    };
  });

  // 선택 가능한 운동 종류
  const availableExercises = company?.exerciseTypes || { health: true, golf: true };

  // 전화번호 입력 시 일치하는 회원들 찾기
  const handlePhoneChange = (value) => {
    setPhoneLastDigits(value);
    setSelectedMemberId(null);
    setMessage("");
    
    if (value.length === 4) {
      const matching = members.filter(m => m.phoneNumber.slice(-4) === value);
      setMatchingMembers(matching);
      
      if (matching.length === 0) {
        setMessage("등록되지 않은 회원입니다.");
      } else if (matching.length === 1) {
        setSelectedMemberId(matching[0].id);
      }
    } else {
      setMatchingMembers([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!exerciseType) {
      setMessage("운동 종류를 선택해주세요.");
      return;
    }

    if (!selectedMemberId) {
      setMessage("회원을 선택해주세요.");
      return;
    }

    // 운동 종류 체크
    const isHealth = exerciseType === "헬스";
    const isGolf = exerciseType === "골프";

    if ((isHealth && !availableExercises.health) || 
        (isGolf && !availableExercises.golf)) {
      setMessage("선택할 수 없는 운동 종류입니다.");
      return;
    }

    // 일일 제한 체크
    const limit = isHealth ? company.limits?.health : company.limits?.golf;
    const currentCount = isHealth ? todayAttendance.health : todayAttendance.golf;

    if (limit && limit.daily > 0 && currentCount >= limit.daily) {
      if (!limit.allowExceed) {
        setMessage(`${exerciseType} 일일 출석 제한(${limit.daily}명)을 초과했습니다.`);
        return;
      } else {
        if (!window.confirm(`${exerciseType} 일일 출석 제한(${limit.daily}명)을 초과했습니다. 계속하시겠습니까?`)) {
          return;
        }
      }
    }

    const member = members.find(m => m.id === selectedMemberId);
    
    if (member) {
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
      setMessage("출석이 완료되었습니다.");
      setPhoneLastDigits("");
      setExerciseType("");
      setMatchingMembers([]);
      setSelectedMemberId(null);
    }
  };

  const isAdmin = useSelector(state => state.auth.isAdmin);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">출석체크</h2>
        
        {/* 일일 출석 현황 표시 */}
        <div className="mb-4 space-y-2">
          {availableExercises.health && company?.limits?.health?.daily > 0 && (
            <p className={`text-sm ${
              todayAttendance.health >= company.limits.health.daily 
                ? 'text-red-600' 
                : 'text-gray-600'
            }`}>
              헬스 출석: {todayAttendance.health} / {company.limits.health.daily}명
              {company.limits.health.allowExceed && 
               todayAttendance.health >= company.limits.health.daily && 
               " (초과 허용)"}
            </p>
          )}
          {availableExercises.golf && company?.limits?.golf?.daily > 0 && (
            <p className={`text-sm ${
              todayAttendance.golf >= company.limits.golf.daily 
                ? 'text-red-600' 
                : 'text-gray-600'
            }`}>
              골프 출석: {todayAttendance.golf} / {company.limits.golf.daily}명
              {company.limits.golf.allowExceed && 
               todayAttendance.golf >= company.limits.golf.daily && 
               " (초과 허용)"}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">운동 종류</label>
            <div className="flex gap-4">
              {availableExercises.health && (
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
              )}
              {availableExercises.golf && (
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
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">전화번호 뒤 4자리</label>
            <input
              type="text"
              value={phoneLastDigits}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength="4"
              pattern="\d{4}"
              required
            />
          </div>

          {/* 일치하는 회원 목록 */}
          {matchingMembers.length > 1 && (
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">회원 선택</label>
              <div className="space-y-2">
                {matchingMembers.map((member) => (
                  <label key={member.id} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="member"
                      value={member.id}
                      checked={selectedMemberId === member.id}
                      onChange={() => setSelectedMemberId(member.id)}
                      className="mr-2"
                    />
                    <span>{member.name} ({member.phoneNumber})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate(`/company/${companyId}/attendance`)}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                출석목록
              </button>
            )}
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