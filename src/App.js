import React from 'react';
import Search from './components/Search'
import './App.scss';

function App() {
  return (
    <div className="App">
      <Search
        label='Flickr image search'
        placeholder='Search for image tags'
      />
    </div>
  );
}

export default App;
