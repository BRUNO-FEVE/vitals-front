import React from "react";

export default function Page() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 400">
      <defs>
        <filter id="xorFilter">
          <feComposite in="SourceGraphic" in2="SourceAlpha" operator="xor" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#0054FF" />
      <g filter="url(#xorFilter)" fill="#FFF" font-family="sans-serif">
        <text x="780" y="200" font-size="200" text-anchor="end">
          H96
        </text>
        <text x="780" y="300" font-size="40" text-anchor="end">
          A DE ESPERA...
        </text>
      </g>
    </svg>
  );
}
