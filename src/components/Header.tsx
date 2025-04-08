
import React from "react";
import { Bookmark } from "lucide-react";

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
          <a href="#" className="text-gray-600 hover:text-gray-900">Topic 1</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Topic 2</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Topic 3</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Topic 4</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
