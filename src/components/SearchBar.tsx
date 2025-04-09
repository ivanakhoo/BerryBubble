import React from 'react';

type Props = {
  query: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchCategory: string;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SearchBar({ query, onSearch, searchCategory, onCategoryChange }: Props) {
  const placeholderMap: Record<string, string> = {
    DisplayName: "Search by name...",
    GradYear: "Search by grad year...",
    JobTitle: "Search by job title..."
  };

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      <select value={searchCategory} onChange={onCategoryChange} className="p-2 rounded border border-gray-300">
        <option value="DisplayName">Name</option>
        <option value="GradYear">Graduation Year</option>
        <option value="JobTitle">Job Title</option>
      </select>

      <input
        type="text"
        placeholder={placeholderMap[searchCategory] || "Search by name..."}
        value={query}
        onChange={onSearch}
        className="p-2 w-72 rounded border border-gray-300"
      />
    </div>
  );
}
