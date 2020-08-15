import React, { useState } from 'react';
import './Search.scss'

const Search = ({label, placeholder}) => {
  const [value, setValue] = useState('')

  return (
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
          setValue(value)
          console.log(value)
        }}
      />
    </div>
  )
}

export default Search;
