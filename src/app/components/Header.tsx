import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full fixed top-0 left-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div>
            <p className="text-2xl font-medium relative inline-block">
              GoodChat
              <span
                className="text-sky-600 text-6xl absolute top-0"
                style={{ lineHeight: '0.1' }}
              >
                .
              </span>
            </p>
          </div>
          <div></div> {/* Placeholder for future right-aligned content */}
        </div>
      </div>
    </header>
  );
};

export default Header;