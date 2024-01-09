import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDebounce from '../../hooks/useDebounce';

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let abortController = new AbortController();

  const fetchResults = async (value) => {
    setIsLoading(true);
    setResults([]);
    setError(null);

    try {
      abortController.abort(); // Cancel previous request
      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get(`https://demo.dataverse.org/api/search?q=${value}`, { signal });
      setResults(response?.data?.data?.items || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
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
  }, [inputValue, debouncedFetchResults]);

  const handleResultClick = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {selectedRepo && (
        <div className="selected-repo-details">
          <h3>Selected Repository:</h3>
          <p>Name: {selectedRepo.name}</p>
          <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer">View at: {selectedRepo.url}</a>
        </div>
      )}
      {isLoading && <div className="message">Loading...</div>}
      {error && <div className="message error-message">{error}</div>}
      {results.length === 0 && !isLoading && <div className="message">No results found</div>}
      <div className="autocomplete-results">
        {results.map((repo, index) => (
          <div key={index} className="autocomplete-result-item" onClick={() => handleResultClick(repo)}>
            {repo.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autocomplete;
