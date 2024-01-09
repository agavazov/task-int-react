import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../../hooks/useDebounce';

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(new AbortController());

  const fetchResults = async (value) => {
    setIsLoading(true);
    setResults([]);
    setError(null);

    // Cancel the previous request
    abortControllerRef.current.abort();
    // Create a new instance for the new request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`https://demo.dataverse.org/api/search?q=${value}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data?.data?.items || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError('An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchResults = useDebounce(fetchResults, 300);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchResults(inputValue);
    }
    // Cleanup function to abort any ongoing requests when the component unmounts
    return () => abortControllerRef.current.abort();
  }, [inputValue, debouncedFetchResults]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {selectedItem && (
        <div className="selected-item-details">
          <h3>Selected Item:</h3>
          <p>Name: {selectedItem.name}</p>
          <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">View at: {selectedItem.url}</a>
        </div>
      )}
      {isLoading && <div className="message">Loading...</div>}
      {error && <div className="message error-message">{error}</div>}
      {results.length === 0 && !isLoading && <div className="message">No results found</div>}
      <div className="autocomplete-results">
        {results.map((item, index) => (
          <div key={index} className="autocomplete-result-item" onClick={() => handleItemClick(item)}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autocomplete;
