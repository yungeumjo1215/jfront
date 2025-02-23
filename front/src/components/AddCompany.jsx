import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { createCompany } from '../redux/slices/companySlice';

const AddCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyData, setCompanyData] = useState({
    name: "",
    logo: ""
  });

  const styles = {
    container: {
      marginTop: "64px",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto"
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
      color: "#333"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#444"
    },
    input: {
      padding: "12px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "20px"
    },
    cancelButton: {
      padding: "12px 24px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCompany(companyData));
    alert('기업이 등록되었습니다.');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>기업 등록</h1>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>기업명</label>
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleChange}
            style={styles.input}
            placeholder="기업명을 입력하세요"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>로고 URL</label>
          <input
            type="text"
            name="logo"
            value={companyData.logo}
            onChange={handleChange}
            style={styles.input}
            placeholder="로고 이미지 URL을 입력하세요"
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button type="submit" style={styles.button}>
            등록하기
          </button>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate('/')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompany; 