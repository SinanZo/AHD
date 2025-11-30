'use client'
import React, { useState } from 'react'

export default function LiteMap(){
  const [load, setLoad] = useState(false)
  return (
    <div className="card p-4 min-h-[280px] flex items-center justify-center rounded-2xl">
      {!load ? (
        <button className="chip px-4 py-2 rounded-full focus-ring" onClick={() => setLoad(true)}>Load interactive map</button>
      ) : (
        <iframe
          title="Location map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387.573..."
          className="w-full h-[360px] rounded-xl border border-stroke"
          loading="lazy"
        />
      )}
    </div>
  )
}
