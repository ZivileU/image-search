import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner'
import './Search.scss'

const Search = ({label, placeholder}) => {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [results, setResults] = useState([])

  let cancelRequest
  const pageNumber = 1

  const fetchSearchResults = async (searchValue, pageNumber) => {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=63f731d229d83176a34ad0ebacc961b4&tags=${searchValue}&content_type=1&per_page=50&page=${pageNumber}&format=json&nojsoncallback=1`

    const CancelToken = axios.CancelToken;
    cancelRequest = CancelToken.source();

    await axios.get(url, {
      cancelToken: cancelRequest.token
    }).then((result) => {
      if (result) {
        const dataImages = result.data.photos.photo
        !dataImages.length && setErrorMessage('There are no more search results')
        const images = mapImageUrls(dataImages)
        setResults(images)
        setLoading(false)
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
  console.log(loading, searchValue, results)

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
      setLoading(false)
    } else {
      setSearchValue(value.trim())
      setLoading(true)
    }
  }

  useEffect(() => {
    searchValue && fetchSearchResults(searchValue, pageNumber)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pageNumber])

  return (
    <div className = 'searchWrapper'>
      <div className='search'>
        <label htmlFor='search-input'>{label}</label>
        <input
          type='search'
          name='query'
          id='search-input'
          autoComplete='off'
          data-testid='searchInput'
          placeholder={placeholder}
          value={searchValue}
          onChange={({target: {value}}) => {
            handleChange(value)
          }}
        />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
      {loading
        ? (
            <Loader
              type='ThreeDots'
              color='rgb(98,188,133)'
              height={60}
              width={60}
              // timeout={3000} //3 secs
            />
        ) : (
          <div className='results'>
            {results && (
              results.map(result => (
                <figure key={result.id}>
                  <img src={result.url} alt={searchValue} />
                </figure>
              ))
            )}
          </div>
        )
      }
    </div>
  )
}

export default Search;
