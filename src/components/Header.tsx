import React from "react";
import { Bookmark, FileText, Search } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">
      <Bookmark className="h-6 w-6 text-blue-600 mr-2" />
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      
      <div className="ml-auto">
        <nav className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>匯入書籤</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>匯出書籤</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>搜尋書籤</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>移除贅詞</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
