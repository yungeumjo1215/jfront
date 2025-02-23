import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMembers } from "../redux/slices/memberSlice";

const MemberList = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const allMembers = useSelector(selectMembers);
  const members = Array.isArray(allMembers) 
    ? allMembers.filter(member => member.companyId === parseInt(companyId))
    : [];
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  return (
    <div style={{
      marginTop: "64px",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#333"
        }}>{company?.name} 회원 목록</h1>
        
        <button
          onClick={() => navigate(`/register/${companyId}`)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          회원 등록
        </button>
      </div>

      <div style={{
        overflowX: "auto"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}>
          <thead>
            <tr style={{
              backgroundColor: "#f5f5f5"
            }}>
              <th style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left"
              }}>기업명</th>
              <th style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left"
              }}>이름</th>
              <th style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left"
              }}>핸드폰 번호</th>
              <th style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left"
              }}>등록일</th>
            </tr>
          </thead>
          <tbody>
            {members && members.map((member) => (
              <tr key={member.id}>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>{member.companyName}</td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>{member.name}</td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>{member.phoneNumber}</td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>{new Date(member.registrationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!members || members.length === 0) && (
          <p style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#666"
          }}>등록된 회원이 없습니다.</p>
        )}
      </div>
      
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
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
  );
};

export default MemberList; 