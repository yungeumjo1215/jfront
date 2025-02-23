import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CompanyMembers = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );
  
  const members = useSelector(state => 
    state.members.members[company?.name] || []
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
    backButton: {
      padding: "10px 20px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{company.name} 회원 목록</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          style={styles.button}
          onClick={() => navigate(`/member-registration/${companyId}`)}
        >
          새 회원 등록
        </button>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/')}
        >
          돌아가기
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>등록일</th>
            <th style={styles.th}>이름</th>
            <th style={styles.th}>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td style={styles.td}>
                {new Date(member.registrationDate).toLocaleDateString()}
              </td>
              <td style={styles.td}>{member.name}</td>
              <td style={styles.td}>{member.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {members.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          등록된 회원이 없습니다.
        </div>
      )}
    </div>
  );
};

export default CompanyMembers; 