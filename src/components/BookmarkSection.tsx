
import React, { useState, useEffect } from "react";
import { Search, Minus, ArrowDown, ArrowUp, Move } from "lucide-react";
import { Section, Bookmark, DragItem } from "@/types/bookmarks";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BookmarkSectionProps {
  section: Section;
  onSelectBookmark: (bookmark: Bookmark) => void;
  onRemove: () => void;
  onDragStart: (item: DragItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const BookmarkSection: React.FC<BookmarkSectionProps> = ({
  section,
  onSelectBookmark,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>(section.bookmarks);
  const [sortBy, setSortBy] = useState<"title" | "date">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter bookmarks based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBookmarks(section.bookmarks);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = section.bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(term) ||
          bookmark.url.toLowerCase().includes(term) ||
          bookmark.folder?.toLowerCase().includes(term) ||
          bookmark.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
      setFilteredBookmarks(filtered);
    }
  }, [searchTerm, section.bookmarks]);

  // Sort bookmarks
  useEffect(() => {
    const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc" 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else {
        // Assuming each bookmark has an id that's somewhat related to creation date
        // In a real app, you'd use an actual date field
        return sortDirection === "asc" 
          ? a.id.localeCompare(b.id) 
          : b.id.localeCompare(a.id);
      }
    });
    
    setFilteredBookmarks(sortedBookmarks);
  }, [sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full border-r",
        isDragging ? "bg-blue-50" : "bg-white"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="p-3 border-b border-blue-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={toggleSortDirection}
          className="flex items-center text-slate-600 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-100/50 transition-colors"
          title={sortDirection === "asc" ? "升序排列" : "降序排列"}
        >
          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
        
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "title" | "date")}
        >
          <SelectTrigger className="w-32 h-8 text-xs border-blue-100 bg-white/80 focus:ring-blue-200">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">名稱</SelectItem>
            <SelectItem value="date">新增日期</SelectItem>
          </SelectContent>
        </Select>
        
        <button
          onClick={onRemove}
          className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          title="移除此窗口"
        >
          <Minus size={16} />
        </button>
      </div>
      
      <div className="p-2 border-b border-blue-100 relative">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9 pr-4 py-2 w-full text-sm bg-white border-blue-100 focus:border-blue-200 focus:ring-blue-200"
            placeholder="搜索書籤..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="inline-block p-3 bg-slate-50 rounded-full mb-2">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <div>沒有找到匹配的書籤</div>
          </div>
        ) : (
          <ul className="space-y-1 p-1">
            {filteredBookmarks.map((bookmark, index) => (
              <li key={bookmark.id}>
                <div
                  className={cn(
                    "w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-all duration-200",
                    "flex items-start gap-3 cursor-move group"
                  )}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    onDragStart({
                      type: 'bookmark',
                      bookmark,
                      sectionId: section.id,
                      index
                    });
                  }}
                  onDragEnd={onDragEnd}
                  onClick={() => onSelectBookmark(bookmark)}
                >
                  <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-md overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    {bookmark.favicon ? (
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {bookmark.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div 
                      className="font-medium text-gray-900 truncate" 
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(bookmark.title, searchTerm)
                      }}
                    />
                    <div 
                      className="text-sm text-gray-500 truncate" 
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(bookmark.url, searchTerm)
                      }}
                    />
                    {bookmark.folder && (
                      <div 
                        className="mt-1 text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full inline-block"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(bookmark.folder, searchTerm)
                        }}
                      />
                    )}
                  </div>
                  <Move size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookmarkSection;
