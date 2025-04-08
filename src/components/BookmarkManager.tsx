
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Bookmark, Section } from "@/types/bookmarks";
import BookmarkSection from "./BookmarkSection";
import BottomPreview from "./BottomPreview";
import Header from "./Header";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 模擬數據
const mockSections: Section[] = [
  {
    id: "1",
    title: "Section 1 第1部分",
    bookmarks: [
      { id: "1-1", title: "Google", url: "https://google.com", folder: "搜索引擎" },
      { id: "1-2", title: "GitHub", url: "https://github.com", folder: "開發工具" },
      { id: "1-3", title: "Stack Overflow", url: "https://stackoverflow.com", folder: "開發工具" },
    ],
  },
  {
    id: "2",
    title: "Section 2",
    bookmarks: [
      { id: "2-1", title: "YouTube", url: "https://youtube.com", folder: "娛樂" },
      { id: "2-2", title: "Netflix", url: "https://netflix.com", folder: "娛樂" },
      { id: "2-3", title: "Spotify", url: "https://spotify.com", folder: "音樂" },
    ],
  },
  {
    id: "3",
    title: "Section 3",
    bookmarks: [
      { id: "3-1", title: "Amazon", url: "https://amazon.com", folder: "購物" },
      { id: "3-2", title: "eBay", url: "https://ebay.com", folder: "購物" },
      { id: "3-3", title: "Etsy", url: "https://etsy.com", folder: "手工藝品" },
    ],
  },
];

const BookmarkManager = () => {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [panelCount, setPanelCount] = useState(2);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const { toast } = useToast();

  const handleAddPanel = () => {
    if (panelCount >= 4) {
      toast({
        title: "已達到最大分割窗口數",
        description: "您最多可以創建4個分割窗口",
        variant: "destructive",
      });
      return;
    }
    
    setPanelCount(panelCount + 1);
    // 添加新的空白部分
    setSections([...sections, {
      id: `${sections.length + 1}`,
      title: `Section ${sections.length + 1}`,
      bookmarks: []
    }]);

    toast({
      title: "已添加新窗口",
      description: "成功創建新的分割窗口",
    });
  };

  const handleRemovePanel = (index: number) => {
    if (panelCount <= 1) {
      toast({
        title: "無法移除窗口",
        description: "至少需要保留一個窗口",
        variant: "destructive",
      });
      return;
    }
    
    setPanelCount(panelCount - 1);
    // 移除指定部分
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);

    toast({
      title: "已移除窗口",
      description: "成功移除分割窗口",
    });
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="書籤管理" />
      
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          {sections.slice(0, panelCount).map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <ResizableHandle withHandle />}
              <ResizablePanel defaultSize={100 / panelCount} minSize={20}>
                <BookmarkSection 
                  section={section} 
                  onSelectBookmark={handleSelectBookmark}
                  onRemove={() => handleRemovePanel(index)}
                />
              </ResizablePanel>
            </React.Fragment>
          ))}
        </ResizablePanelGroup>

        {panelCount < 4 && (
          <div className="flex justify-center py-2 bg-white border-t border-gray-200">
            <button 
              onClick={handleAddPanel}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <PlusCircle size={16} className="mr-1" />
              <span>添加分割窗口</span>
            </button>
          </div>
        )}
        
        {previewVisible && (
          <BottomPreview 
            bookmark={selectedBookmark} 
            onToggle={togglePreview} 
          />
        )}
        
        {!previewVisible && (
          <div 
            className="h-10 bg-gray-100 border-t border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-200"
            onClick={togglePreview}
          >
            <span className="text-sm text-gray-500">顯示預覽窗口</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkManager;
