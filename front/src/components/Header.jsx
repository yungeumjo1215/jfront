import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_box_w.png';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo}
              alt="로고" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-800">
              헬스보이짐 여의도역점
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
