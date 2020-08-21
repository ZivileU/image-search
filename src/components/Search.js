import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import debounce from 'lodash/debounce'
import Loader from 'react-loader-spinner'
import { mapImageUrls } from './search.helper'
import './Search.scss'

const Search = ({label, placeholder}) => {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [results, setResults] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const inputReference = useRef()

  let cancelRequest
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=63f731d229d83176a34ad0ebacc961b4&tags=${searchValue}&content_type=1&per_page=50&page=${pageNumber}&format=json&nojsoncallback=1`

  const fetchSearchResults = async () => {
    const CancelToken = axios.CancelToken
    cancelRequest = CancelToken.source()

    await axios.get(url, {
      cancelToken: cancelRequest.token
    }).then((result) => {
      if (result) {
        const data = result.data.photos
        const images = mapImageUrls(data.photo)
        (data.pages > data.page)
          ? setHasMore(true)
          : setHasMore(false)

        if ((data.pages === 0)) {
          setErrorMessage('No search results found')
        }
        if (!hasMore && (data.pages === data.page)) {
          setErrorMessage('There are no more search results')
        }
        setResults([...results, ...images])
        setLoading(false)
        console.log(data)
      }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled')
      } else {
        setErrorMessage('Failed to fetch search results')
        setLoading(false)
      }
    })
  }

  // Checks if the page has scrolled to the bottom and increases the page number to trigger data fetching
  window.onscroll = debounce(() => {
    const {scrollTop, offsetHeight} = document.documentElement

    if (errorMessage || loading || !hasMore) return
    if (window.innerHeight + scrollTop === offsetHeight) {
      hasMore && setPageNumber(pageNumber + 1)
      setLoading(true)
    }
  }, 500)

  // A bit ugly, but reliable
  const handleChange = value => {
    cancelRequest && cancelRequest.cancel()

    if (value && results.length > 0) {
      setPageNumber(1)
      setResults([])
      setErrorMessage(null)
      setSearchValue(value)
      setLoading(true)
    }
    if (!value) {
      setSearchValue('')
      setResults([])
      setPageNumber(1)
      setErrorMessage(null)
      setLoading(false)
    }
    if (value) {
      setSearchValue(value)
      setLoading(true)
    }
  }

  //Clears the input value on escape key press
  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.keyCode === 27) && (inputReference && inputReference.current.matches(':focus-within'))) {
        setSearchValue('')
        setResults([])
        setPageNumber(1)
        setErrorMessage(null)
        setLoading(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  //Fetches the results only if searchValue or pageNumber changes
  useEffect(() => {
    searchValue && fetchSearchResults(searchValue, pageNumber)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pageNumber])

  return (
    <div className='searchWrapper'>
      <div className='search'>
        <label htmlFor='search-input'>{label}</label>
        <input
          type='text'
          name='query'
          id='search-input'
          autoComplete='off'
          data-testid='searchInput'
          placeholder={placeholder}
          value={searchValue}
          ref={inputReference}
          onChange={({target: {value}}) => {
            handleChange(value)
          }}
        />
      </div>
      <div className='results'>
        {results && (
          results.map(result => (
            <figure key={result.id}>
              <img src={result.url} alt={searchValue} />
            </figure>
          ))
        )}
      </div>
      {errorMessage &&
        <div className='errorMessage'>{errorMessage}</div>
      }
      <div className='loaderWrapper'>
        {loading && (
          <Loader
            type='ThreeDots'
            color='rgb(98,188,133)'
            height={60}
            width={60}
          />
        )}
      </div>
    </div>
  )
}

export default Search
