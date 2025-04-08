
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Bookmark } from "@/types/bookmarks";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

interface BottomPreviewProps {
  bookmark: Bookmark | null;
  onToggle: () => void;
}

const BottomPreview: React.FC<BottomPreviewProps> = ({ bookmark, onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={expanded ? 40 : 20}
        minSize={10}
        maxSize={50}
        className="bg-white border-t border-gray-200"
      >
        <div className="flex flex-col h-full">
          <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center">
              <button
                onClick={handleToggleExpand}
                className="p-1 mr-2 text-gray-500 hover:bg-gray-200 rounded"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
              <h3 className="font-medium text-gray-700">預覽</h3>
            </div>
            <div className="flex items-center gap-2">
              {bookmark && (
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 text-sm"
                >
                  <ExternalLink size={14} />
                  <span>打開</span>
                </a>
              )}
              <button
                onClick={onToggle}
                className="p-1 text-gray-500 hover:bg-gray-200 rounded"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-auto p-4">
            {!bookmark ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                選擇一個書籤查看預覽
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    {bookmark.favicon ? (
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="text-xl font-bold text-gray-400">
                        {bookmark.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {bookmark.title}
                    </h2>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {bookmark.url}
                    </a>
                    
                    {bookmark.folder && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">文件夾：</span>
                        <span className="ml-1 text-sm px-2 py-1 bg-gray-100 rounded-md">
                          {bookmark.folder}
                        </span>
                      </div>
                    )}
                    
                    {bookmark.tags && bookmark.tags.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">標籤：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {bookmark.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {expanded && (
                  <div className="mt-6 flex-grow border border-gray-200 rounded-md overflow-hidden">
                    <iframe
                      src={bookmark.url}
                      title={bookmark.title}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin"
                    />
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
