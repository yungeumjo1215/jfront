import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateCompany } from '../redux/slices/companySlice';

const EditCompany = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const [companyData, setCompanyData] = useState({
    name: company?.name || "",
    logo: company?.logo || ""
  });
  const [previewImage, setPreviewImage] = useState(company?.logo || null);
  const [logoType, setLogoType] = useState('url');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCompany({
      id: parseInt(companyId),
      data: companyData
    }));
    alert('기업 정보가 수정되었습니다.');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setCompanyData({ ...companyData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setCompanyData({ ...companyData, logo: url });
    setPreviewImage(url);
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

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
      }}>기업 정보 수정</h1>
      
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
          }}>기업명</label>
          <input
            type="text"
            name="name"
            value={companyData.name}
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
          }}>로고 입력 방식</label>
          <div style={{
            display: "flex",
            gap: "16px",
            marginBottom: "8px"
          }}>
            <label style={{
              display: "flex",
              alignItems: "center"
            }}>
              <input
                type="radio"
                value="url"
                checked={logoType === 'url'}
                onChange={(e) => setLogoType(e.target.value)}
                style={{
                  marginRight: "8px"
                }}
              />
              URL 입력
            </label>
            <label style={{
              display: "flex",
              alignItems: "center"
            }}>
              <input
                type="radio"
                value="file"
                checked={logoType === 'file'}
                onChange={(e) => setLogoType(e.target.value)}
                style={{
                  marginRight: "8px"
                }}
              />
              파일 업로드
            </label>
          </div>

          {logoType === 'url' ? (
            <input
              type="text"
              placeholder="로고 이미지 URL 입력"
              value={companyData.logo}
              onChange={handleLogoUrlChange}
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          )}

          {previewImage && (
            <div style={{ marginTop: "10px" }}>
              <div style={{
                width: '100%',
                height: '96px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={previewImage}
                  alt="로고 미리보기"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '8px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    setPreviewImage(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>

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
            수정하기
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

export default EditCompany;