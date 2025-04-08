import React, { useState } from "react";
import { Bookmark, FileText, Import, Share2, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookmarkExport, BookmarkTitleChange, Section } from "@/types/bookmarks";
import TitleCleaner from "./TitleCleaner";

interface HeaderProps {
  title: string;
  sections?: Section[];
  onImport?: (sections: Section[]) => void;
  onUpdateBookmarkTitles?: (changes: BookmarkTitleChange[]) => void;
  onUndoTitleChanges?: () => void;
  canUndoTitleChanges?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  sections = [], 
  onImport,
  onUpdateBookmarkTitles,
  onUndoTitleChanges,
  canUndoTitleChanges = false
}) => {
  const { toast } = useToast();
  const [titleCleanerOpen, setTitleCleanerOpen] = useState(false);

  const handleExportBookmarks = () => {
    if (!sections.length) {
      toast({
        title: "無內容可匯出",
        description: "目前沒有書籤資料可以匯出",
        variant: "destructive",
      });
      return;
    }

    const exportData: BookmarkExport = {
      sections,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `bookmark-export-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "匯出成功",
      description: `已匯出 ${sections.reduce((total, section) => total + section.bookmarks.length, 0)} 個書籤`,
    });
  };

  const handleImportBookmarks = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string) as BookmarkExport;
          
          // Validate imported data
          if (!importData.sections || !Array.isArray(importData.sections)) {
            throw new Error('無效的書籤資料格式');
          }
          
          // Call the import handler
          if (onImport) {
            onImport(importData.sections);
            toast({
              title: "匯入成功",
              description: `已匯入 ${importData.sections.reduce((total, section) => 
                total + section.bookmarks.length, 0)} 個書籤`,
            });
          }
        } catch (error) {
          toast({
            title: "匯入失敗",
            description: "書籤資料格式不正確",
            variant: "destructive",
          });
          console.error('Import error:', error);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">
      <Bookmark className="h-6 w-6 text-blue-600 mr-2" />
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      
      <div className="ml-auto">
        <nav className="flex gap-4">
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              handleImportBookmarks();
            }}
          >
            <Import className="h-4 w-4" />
            <span>匯入書籤</span>
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              handleExportBookmarks();
            }}
          >
            <Share2 className="h-4 w-4" />
            <span>匯出書籤</span>
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              setTitleCleanerOpen(true);
            }}
          >
            <FileX className="h-4 w-4" />
            <span>移除贅詞</span>
          </a>
        </nav>
      </div>

      <TitleCleaner
        open={titleCleanerOpen}
        onOpenChange={setTitleCleanerOpen}
        sections={sections}
        onApplyChanges={onUpdateBookmarkTitles || (() => {})}
        onUndoLastChange={onUndoTitleChanges || (() => {})}
        canUndo={canUndoTitleChanges}
      />
    </header>
  );
};

export default Header;
