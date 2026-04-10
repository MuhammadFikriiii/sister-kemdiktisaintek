import React from 'react';

const SisterLogo = ({ style, className }) => (
  <img 
    src="/logo-sister.png" 
    alt="SISTER Logo" 
    style={{ ...style, objectFit: 'contain' }} 
    className={className} 
    onError={(e) => {
      e.target.src = "https://ui-avatars.com/api/?name=SISTER&background=005596&color=fff";
    }}
  />
);

export default SisterLogo;
