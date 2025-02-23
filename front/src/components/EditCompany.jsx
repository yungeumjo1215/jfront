import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

const EditCompany = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const [name, setName] = useState(company?.name || "");
  const [exerciseTypes, setExerciseTypes] = useState({
    health: company?.exerciseTypes?.health || false,
    golf: company?.exerciseTypes?.golf || false
  });
  const [limits, setLimits] = useState({
    health: {
      daily: company?.limits?.health?.daily || 0,
      allowExceed: company?.limits?.health?.allowExceed || false
    },
    golf: {
      daily: company?.limits?.golf?.daily || 0,
      allowExceed: company?.limits?.golf?.allowExceed || false
    }
  });
  const [logo, setLogo] = useState(company?.logo || "");
  const [previewImage, setPreviewImage] = useState(company?.logo || null);
  const [logoType, setLogoType] = useState('url');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch({
      type: 'companies/updateCompany',
      payload: {
        id: parseInt(companyId),
        name,
        exerciseTypes,
        limits
      }
    });

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
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <label className="block text-gray-700 mb-2">운동 종류 선택</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exerciseTypes.health}
                  onChange={(e) => setExerciseTypes({
                    ...exerciseTypes,
                    health: e.target.checked
                  })}
                  className="mr-2"
                />
                헬스
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exerciseTypes.golf}
                  onChange={(e) => setExerciseTypes({
                    ...exerciseTypes,
                    golf: e.target.checked
                  })}
                  className="mr-2"
                />
                골프
              </label>
            </div>
          </div>

          {exerciseTypes.health && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">헬스 설정</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-2">일일 출석 제한 수</label>
                  <input
                    type="number"
                    value={limits.health.daily}
                    onChange={(e) => setLimits({
                      ...limits,
                      health: {
                        ...limits.health,
                        daily: parseInt(e.target.value)
                      }
                    })}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={limits.health.allowExceed}
                    onChange={(e) => setLimits({
                      ...limits,
                      health: {
                        ...limits.health,
                        allowExceed: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  <label className="text-gray-700">
                    일일 제한 초과 허용
                  </label>
                </div>
              </div>
            </div>
          )}

          {exerciseTypes.golf && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">골프 설정</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-2">일일 출석 제한 수</label>
                  <input
                    type="number"
                    value={limits.golf.daily}
                    onChange={(e) => setLimits({
                      ...limits,
                      golf: {
                        ...limits.golf,
                        daily: parseInt(e.target.value)
                      }
                    })}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={limits.golf.allowExceed}
                    onChange={(e) => setLimits({
                      ...limits,
                      golf: {
                        ...limits.golf,
                        allowExceed: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  <label className="text-gray-700">
                    일일 제한 초과 허용
                  </label>
                </div>
              </div>
            </div>
          )}

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

          <div className="flex justify-center space-x-4 pt-4">
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