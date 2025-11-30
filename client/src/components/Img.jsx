import React from 'react'

export default function Img(props){
  const { sizes='(min-width:1024px) 800px, 100vw', priority=false, alt='', ...rest } = props
  // Map `priority` to eager loading
  const loading = priority ? undefined : 'lazy'
  return (
    <img {...rest} alt={alt} loading={loading} decoding="async" sizes={sizes} />
  )
}
