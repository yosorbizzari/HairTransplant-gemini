
import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21 12.318 12.318 0 011.25 10.375A12.318 12.318 0 018.624 3.75c2.69 0 5.116 1.03 6.912 2.725M15 19.128a2.625 2.625 0 00-2.625-2.625M7.5 10.5a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
  </svg>
);

export default UsersIcon;