import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.scss'

const Search = ({label, placeholder}) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setErrorMessage] = useState(null)
  const [results, setResults] = useState([])

  let cancelRequest
  const pageNumber = 1

  const fetchSearchResults = async (value, pageNumber) => {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=63f731d229d83176a34ad0ebacc961b4&tags=${value}&content_type=1&per_page=50&page=${pageNumber}&format=json&nojsoncallback=1`

    const CancelToken = axios.CancelToken;
    cancelRequest = CancelToken.source();

    await axios.get(url, {
      cancelToken: cancelRequest.token
    }).then((result) => {
      if (result) {
        const images = mapImageUrls(result.data.photos.photo)
        setResults(images)
        console.log(result.data.photos)
      }
      !result.data.photos && setErrorMessage('There are no more search results')
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled');
      } else {
        console.log(thrown.message)
      }
    })
  }
  console.log(results)

  const mapImageUrls = images => (
    images.map(image => ({
      url: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`,
      id: image.id
    }))
  )

  const handleChange = value => {
    cancelRequest && cancelRequest.cancel();
    setValue(value.trim())
  }

  useEffect(() => {
    value && fetchSearchResults(value, pageNumber)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pageNumber])

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
          value={value}
          onChange={({target: {value}}) => {
            handleChange(value)
          }}
        />
      </div>
      <div className='results'>
        {results && (
          results.map(result => (
            <figure>
              <img src={result.url} alt={value} key={result.id} />
            </figure>
          ))
        )}
      </div>
    </div>
  )
}

export default Search;
