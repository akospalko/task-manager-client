import React from 'react';
import './CharacterCount.css';

export default function CharacterCount({ current, max }) {
  return (
    <div className="CharacterCount"> 
      <p> {`(${ current } / ${ max || 0 })`} </p>
    </div>
  )
}