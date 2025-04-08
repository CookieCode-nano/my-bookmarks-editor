
import React, { useState, useEffect } from "react";
import { Search, Minus } from "lucide-react";
import { Section, Bookmark } from "@/types/bookmarks";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BookmarkSectionProps {
  section: Section;
  onSelectBookmark: (bookmark: Bookmark) => void;
  onRemove: () => void;
}

const BookmarkSection: React.FC<BookmarkSectionProps> = ({
  section,
  onSelectBookmark,
  onRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>(section.bookmarks);

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

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-700">{section.title}</h3>
        <button
          onClick={onRemove}
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          title="移除此窗口"
        >
          <Minus size={16} />
        </button>
      </div>
      
      <div className="p-2 border-b border-gray-200 relative">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8 pr-4 py-2 w-full text-sm bg-gray-50 focus:bg-white"
            placeholder="搜索書籤..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            沒有找到匹配的書籤
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredBookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <button
                  className={cn(
                    "w-full text-left p-3 hover:bg-blue-50 transition-colors",
                    "flex items-start gap-3"
                  )}
                  onClick={() => onSelectBookmark(bookmark)}
                >
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                    {bookmark.favicon ? (
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center text-xs text-gray-500">
                        {bookmark.title.charAt(0)}
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
                        className="mt-1 text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded inline-block"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(bookmark.folder, searchTerm)
                        }}
                      />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookmarkSection;
