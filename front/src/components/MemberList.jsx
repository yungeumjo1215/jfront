import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectMembers, deleteMember, updateMember } from "../redux/slices/memberSlice";

const MemberList = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const allMembers = useSelector(selectMembers);
  const members = Array.isArray(allMembers) 
    ? allMembers.filter(member => member.companyId === parseInt(companyId))
    : [];
  
  const company = useSelector(state => 
    state.companies.companies.find(c => c.id === parseInt(companyId))
  );

  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const handleDelete = (memberId) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      dispatch(deleteMember({
        id: memberId,
        companyId: Number(companyId)
      }));
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditName(member.name);
    setEditPhone(member.phoneNumber);
  };

  const handleUpdate = () => {
    if (!editName || !editPhone) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    dispatch(updateMember({
      id: editingMember,
      name: editName,
      phoneNumber: editPhone
    }));

    setEditingMember(null);
    setEditName('');
    setEditPhone('');
  };

  const handleCancel = () => {
    setEditingMember(null);
    setEditName('');
    setEditPhone('');
  };

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
              <th style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left"
              }}>관리</th>
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
                }}>
                  {editingMember === member.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    member.name
                  )}
                </td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>
                  {editingMember === member.id ? (
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    member.phoneNumber
                  )}
                </td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>{new Date(member.registrationDate).toLocaleDateString()}</td>
                <td style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd"
                }}>
                  {editingMember === member.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </td>
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