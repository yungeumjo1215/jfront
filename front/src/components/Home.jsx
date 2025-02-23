import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import "./ImageSlider.css";
import { addCompany, deleteCompany } from '../redux/slices/companySlice';

const Home = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", logo: "" });
  const [previewImage, setPreviewImage] = useState(null);
  const [logoType, setLogoType] = useState('url');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const handleCompanyClick = (companyId) => {
    setSelectedCompany(selectedCompany === companyId ? null : companyId);
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    const companyToAdd = {
      ...newCompany,
      id: Date.now() // 고유 ID 생성
    };
    dispatch(addCompany(companyToAdd));
    setNewCompany({ name: "", logo: "" });
    setShowAddModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewCompany({ ...newCompany, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setNewCompany({ ...newCompany, logo: url });
    setPreviewImage(url);
  };

  const handleMemberRegistration = () => {
    navigate(`/register/${selectedCompany}`);
    setSelectedCompany(null);
  };

  const handleAttendanceCheck = () => {
    navigate(`/company/${selectedCompany}/attendance/check`);
    setSelectedCompany(null);
  };

  const handleViewMembers = () => {
    navigate(`/company/${selectedCompany}/members`);
    setSelectedCompany(null);
  };

  const handleEditCompany = () => {
    navigate(`/edit-company/${selectedCompany}`);
    setSelectedCompany(null);
  };

  const handleAttendanceClick = (companyId) => {
    navigate(`/company/${companyId}/attendance/check`);
  };

  const handleDeleteClick = (e, companyId) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 기업을 삭제하시겠습니까?')) {
      dispatch(deleteCompany(companyId));
      setSelectedCompany(null);
    }
  };

  const handleEditClick = (company) => {
    navigate(`/edit-company/${company.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            헬스보이짐 여의도역점
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            기업 추가
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedCompany === company.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="p-4">
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} 로고`}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {company.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-center">{company.name}</h2>
              </div>
              
              {selectedCompany === company.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/company/${company.id}/attendance/check`);
                      }}
                      className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      출석체크
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/company/${company.id}/members`);
                      }}
                      className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      회원 목록
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/register/${company.id}`);
                      }}
                      className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    >
                      회원 등록
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-company/${company.id}`);
                      }}
                      className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, company.id)}
                      className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 기업 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">새 기업 추가</h2>
              <form onSubmit={handleAddCompany}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">기업명</label>
                  <input
                    type="text"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">로고 입력 방식</label>
                  <div className="flex gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="url"
                        checked={logoType === 'url'}
                        onChange={(e) => setLogoType(e.target.value)}
                        className="mr-2"
                      />
                      URL 입력
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="file"
                        checked={logoType === 'file'}
                        onChange={(e) => setLogoType(e.target.value)}
                        className="mr-2"
                      />
                      파일 업로드
                    </label>
                  </div>
                  
                  {logoType === 'url' ? (
                    <input
                      type="text"
                      placeholder="로고 이미지 URL 입력"
                      value={newCompany.logo}
                      onChange={handleLogoUrlChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  )}

                  {previewImage && (
                    <div className="mt-2">
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={previewImage}
                          alt="로고 미리보기"
                          className="w-full h-full object-contain"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
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
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setPreviewImage(null);
                      setNewCompany({ name: "", logo: "" });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
