import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce'
import Loader from 'react-loader-spinner'
import './Search.scss'

const Search = ({label, placeholder}) => {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [results, setResults] = useState([])
  const [pageNumber, setPageNumber] = useState(1)

  let cancelRequest

  const fetchSearchResults = async (searchValue, pageNumber) => {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=63f731d229d83176a34ad0ebacc961b4&tags=${searchValue}&content_type=1&per_page=50&page=${pageNumber}&format=json&nojsoncallback=1`

    const CancelToken = axios.CancelToken;
    cancelRequest = CancelToken.source();

    await axios.get(url, {
      cancelToken: cancelRequest.token
    }).then((result) => {
      if (result) {
        const data = result.data.photos
        const images = mapImageUrls(data.photo)
        if (data.pages === 0) {
          setErrorMessage('No search results found')
        }
        if (data.pages === data.page) {
          setErrorMessage('There are no more search results')
        }
        setResults([...results, ...images])
        setLoading(false)
        console.log(result.data.photos)
      }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled');
      } else {
        setErrorMessage('Failed to fetch search results')
        setLoading(false)
      }
    })
  }

  window.onscroll = debounce(() => {
    if (errorMessage || loading ) return;
    // Checks that the page has scrolled to the bottom
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      setLoading(true)
      setPageNumber(pageNumber + 1)
    }
  }, 1000)

  console.log(pageNumber, loading)

  const mapImageUrls = images => (
    images.map(image => ({
      url: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_z.jpg`,
      id: image.id
    }))
  )

  const handleChange = value => {
    cancelRequest && cancelRequest.cancel();
    if (!value) {
      setSearchValue('')
      setResults([])
      setPageNumber(1)
      setErrorMessage(null)
      setLoading(false)
    } else {
      setSearchValue(value.trim())
      setLoading(true)
    }
  }

  const useOnEscape = () => {
    const inputReference = useRef()

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

    return {
      inputReference
    }
  }

  const {inputReference} = useOnEscape()

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

export default Search;
