import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../../hooks/useDebounce';

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const response = await fetch(`https://demo.dataverse.org/api/search?q=${value}`....
};

export default Autocomplete;
