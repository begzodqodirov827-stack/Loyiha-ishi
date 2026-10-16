import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SearchContext } from './SearchContext';

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const searchInputRef = useRef(null);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const focusSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select?.();
    }
  }, []);

  // Keyboard shortcut: Ctrl + K or '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      // Ctrl + K or Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        focusSearch();
      }

      // Single '/' when not already typing in an input
      if (event.key === '/' && !isInputFocused) {
        event.preventDefault();
        focusSearch();
      }

      // Escape key clears search if search input is focused
      if (event.key === 'Escape' && isInputFocused && searchQuery) {
        clearSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusSearch, clearSearch, searchQuery]);

  const value = {
    searchQuery,
    setSearchQuery,
    clearSearch,
    isSearching: searchQuery.trim().length > 0,
    activeFilter,
    setActiveFilter,
    activeSort,
    setActiveSort,
    priorityFilter,
    setPriorityFilter,
    searchInputRef,
    focusSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchProvider;
