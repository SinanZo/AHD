import React from "react";

export default function MapEmbed({
  title = "Abdulhaq Dimensions — Google Map",
  // Paste your exact Google Maps embed URL here:
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8025798118147!2d35.840547576111994!3d31.966252124976677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca117cbe45f27%3A0x5e065023684733b0!2sAbdulhaq%20Dimensions!5e0!3m2!1sen!2sjo!4v1761476980743!5m2!1sen!2sjo",
  openText = "Open in Google Maps",
  className = "",
}) {
  return (
  <div className={`relative w-full overflow-hidden rounded-3xl border border-adh-stroke shadow-2xl bg-adh-surface/70 backdrop-blur-xl ${className}`}>
      {/* Aspect ratio box: 16:9 on md+, 4:3 on small screens */}
      <div className="aspect-[4/3] md:aspect-[16/9] w-full">
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          // Let CSS control size; these make the frame fill the wrapper
          className="w-full h-full border-0 rounded-t-3xl"
          style={{ display: 'block' }}
        />
      </div>

      {/* Fallback quick link (visible if the embed fails, also handy for users) */}
      <div className="flex items-center justify-between gap-3 p-4 text-sm bg-adh-surface/70 rounded-b-3xl">
        <span className="text-adh-brand font-medium">📍 {title}</span>
        <a
          href="https://maps.google.com/?q=Abdulhaq%20Dimensions&ll=31.966252,35.840548&z=16"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-adh-brand text-white hover:opacity-90 transition-opacity font-medium"
        >
          {openText}
        </a>
      </div>
    </div>
  );
}

