import loader from '../assets/loader.svg';
import './Loader.css';

import React from 'react'
export default function Loader() {
  
  return (
    <div className='LoaderModal'>
      <img src={ loader } alt={'loader'}/>
    </div>
  )
}