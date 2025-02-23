import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../redux/slices/memberSlice";

const MemberRegistration = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const [memberData, setMemberData] = useState({
    name: "",
    phoneNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMember({
      companyId: parseInt(companyId),
      companyName: company.name,
      ...memberData,
      registrationDate: new Date().toISOString()
    }));
    alert('회원이 등록되었습니다.');
    navigate(`/company/${companyId}/members`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData(prev => ({
      ...prev,
      [name]: value
    }));
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
      }}>{company?.name} 회원 등록</h1>
      
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
          }}>이름</label>
          <input
            type="text"
            name="name"
            value={memberData.name}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            required
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <label style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#444"
          }}>핸드폰 번호</label>
          <input
            type="tel"
            name="phoneNumber"
            value={memberData.phoneNumber}
            onChange={handleChange}
            placeholder="010-0000-0000"
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            required
          />
        </div>

        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px"
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
            등록하기
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
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberRegistration; 