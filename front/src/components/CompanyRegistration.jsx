import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCompany } from "../redux/slices/companySlice";

const CompanyRegistration = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    logo: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCompany(companyData));
    alert('기업이 등록되었습니다.');
    navigate('/');
  };

  // ... rest of the code remains the same ...
};

export default CompanyRegistration; 