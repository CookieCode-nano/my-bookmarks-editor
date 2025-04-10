
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Info, Globe } from "lucide-react";
import { Bookmark } from "@/types/bookmarks";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

interface BottomPreviewProps {
  bookmark: Bookmark | null;
  onToggle: () => void;
}

const BottomPreview: React.FC<BottomPreviewProps> = ({ bookmark, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const [showWebPreview, setShowWebPreview] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePreviewClick = () => {
    if (bookmark) {
      setShowWebPreview(true);
    }
  };

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizableHandle withHandle className="h-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100 transition-colors" />
      <ResizablePanel
        defaultSize={expanded ? 40 : 20}
        minSize={10}
        maxSize={50}
        className="bg-white border-t border-blue-100 shadow-sm"
      >
        <div className="flex flex-col h-full">
          <div className="p-2 border-b border-blue-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <button
                onClick={handleToggleExpand}
                className="p-1.5 mr-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-full transition-colors"
                title={expanded ? "縮小預覽" : "擴大預覽"}
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
              <h3 className="font-medium text-slate-700">預覽</h3>
            </div>
            <div className="flex items-center gap-2">
              {bookmark && (
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 rounded-full flex items-center gap-1 text-sm transition-colors"
                  title="在新視窗中打開"
                >
                  <ExternalLink size={16} />
                </a>
              )}
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-full transition-colors"
                title="隱藏預覽"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-auto p-4">
            {!bookmark ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Info className="h-8 w-8 mb-2 text-blue-200" />
                <div>選擇一個書籤查看預覽</div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {!showWebPreview ? (
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-blue-50 bg-gradient-to-br from-white to-blue-50 cursor-pointer hover:shadow-md transition-all duration-200" onClick={handlePreviewClick}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                      {bookmark.favicon ? (
                        <img
                          src={bookmark.favicon}
                          alt=""
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="text-xl font-bold text-blue-600">
                          {bookmark.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {bookmark.title}
                      </h2>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-3 w-3 inline flex-shrink-0" />
                        <span>{bookmark.url}</span>
                      </a>
                      
                      {bookmark.folder && (
                        <div className="mt-3">
                          <span className="text-sm text-slate-500">文件夾：</span>
                          <span className="ml-1 text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                            {bookmark.folder}
                          </span>
                        </div>
                      )}
                      
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-slate-500">標籤：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {bookmark.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 text-sm text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                        <span>點擊查看網站預覽</span>
                        <ChevronUp size={14} className="ml-1 rotate-90" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="mb-3 flex justify-between items-center">
                      <h3 className="font-medium text-slate-700 truncate">{bookmark.title}</h3>
                      <button 
                        onClick={() => setShowWebPreview(false)}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        返回詳情
                      </button>
                    </div>
                    <div className={`flex-grow border border-slate-200 rounded-lg overflow-hidden shadow-sm ${expanded ? 'h-full' : 'h-40'}`}>
                      <iframe
                        src={bookmark.url}
                        title={bookmark.title}
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default BottomPreview;
