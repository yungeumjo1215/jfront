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
  
  const members = useSelector(selectMembers).filter(
    member => member.companyId === parseInt(companyId)
  );
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const attendanceList = useSelector(state => state.attendance.attendanceList);

  const handleSubmit = (e) => {
    e.preventDefault();
    
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

      dispatch(addAttendance({
        companyId: parseInt(companyId),
        companyName: company?.name,
        memberId: member.id,
        memberName: member.name,
        phoneNumber: member.phoneNumber,
        date: today,
        time: new Date().toLocaleTimeString()
      }));
      
      setMessage(`${member.name}님 출석이 완료되었습니다!`);
      setPhoneLastDigits("");
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setMessage("등록되지 않은 회원입니다.");
    }
  };

  return (
    <div style={{
      marginTop: "64px",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h1 style={{
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "30px",
        color: "#333"
      }}>{company?.name} 출석체크</h1>
      
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <label style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#444"
          }}>핸드폰 번호 뒤 4자리</label>
          <input
            type="text"
            value={phoneLastDigits}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value.length <= 4) {
                setPhoneLastDigits(value);
              }
            }}
            placeholder="0000"
            maxLength="4"
            style={{
              padding: "12px",
              fontSize: "24px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              textAlign: "center",
              letterSpacing: "8px"
            }}
            required
          />
        </div>

        {message && (
          <div style={{
            padding: "12px",
            borderRadius: "5px",
            backgroundColor: message.includes("완료") ? "#4CAF50" : "#f44336",
            color: "white",
            textAlign: "center"
          }}>
            {message}
          </div>
        )}

        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center"
        }}>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            출석체크
          </button>
          <button
            type="button"
            onClick={() => navigate(`/company/${companyId}/attendance`)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            출석 목록
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: "12px 24px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            홈으로
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceCheck; 