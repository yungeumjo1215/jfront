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

  const [name, setName] = useState(company?.name || "");
  const [dailyLimit, setDailyLimit] = useState(company?.dailyLimit || 0);
  const [allowExceed, setAllowExceed] = useState(company?.allowExceed || false);
  const [logo, setLogo] = useState(company?.logo || "");
  const [previewImage, setPreviewImage] = useState(company?.logo || null);
  const [logoType, setLogoType] = useState('url');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(updateCompany({
      id: parseInt(companyId),
      name,
      dailyLimit: parseInt(dailyLimit),
      allowExceed,
      logo
    }));

    alert('기업 정보가 수정되었습니다.');
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setLogo(url);
    setPreviewImage(url);
  };

  if (!company) {
    return <div>기업을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">기업 정보 수정</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">기업명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">일일 출석 제한 수</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              0으로 설정하면 제한이 없습니다
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allowExceed}
              onChange={(e) => setAllowExceed(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-700">
              일일 제한 초과 허용
            </label>
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
                value={logo}
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

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompany;