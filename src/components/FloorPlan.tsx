export default function FloorPlan({ large }: { large: boolean }) {
  const left = large ? 60 : 75;
  const top = large ? 65 : 100;
  const width = large ? 440 : 410;
  const height = large ? 280 : 210;
  const bottom = top + height;
  const bedroomWall = large ? 235 : 245;

  return (
    <svg className="floor-plan" viewBox="0 0 560 420" role="img" aria-labelledby="floor-plan-title floor-plan-description">
      <title id="floor-plan-title">{large ? 'Two-bedroom concept layout, 7m by 10m' : 'One-bedroom concept layout, 4m by 8m'}</title>
      <desc id="floor-plan-description">Illustrative arrangement of bedrooms, bathroom and an open kitchen and living area. This is not a final building plan.</desc>
      <defs>
        <pattern id="floor-lines" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 12h12" stroke="#e9e4db" strokeWidth="0.6" />
        </pattern>
      </defs>
      <g stroke="#a0a5ae" strokeWidth="1" fill="none">
        <path d={`M${left} ${top - 21}v-13m0 6h${width}m0-6v13`} />
        <path d={`M${left - 20} ${top}h-13m6 0v${height}m-6 0h13`} />
      </g>
      <g fill="#747679" fontSize="12" textAnchor="middle" fontFamily="inherit">
        <text x={left + width / 2} y={top - 40}>{large ? '10m' : '8m'}</text>
        <text transform={`translate(${left - 39} ${top + height / 2}) rotate(-90)`}>{large ? '7m' : '4m'}</text>
      </g>
      <rect x={left} y={top} width={width} height={height} fill="#f6f1e8" />
      <rect x={left} y={top} width={width} height={height} fill="url(#floor-lines)" />
      <rect x={left + 4} y={top + 4} width={bedroomWall - left - 6} height={height - 8} fill="#eae5f1" />
      <rect x={large ? 391 : 380} y={top + 4} width={large ? 105 : 101} height="101" fill="#dce8f1" />
      <g stroke="#4d5454" strokeWidth="5" fill="none" strokeLinejoin="miter">
        <rect x={left} y={top} width={width} height={height} />
        <path d={`M${bedroomWall} ${top}v${height}`} />
        <path d={`M${large ? 391 : 380} ${top}v105h${large ? 109 : 105}`} />
        {large && <path d={`M${left} 205h175`} />}
      </g>
      <g fill="#fbfaf8" stroke="#9b969f" strokeWidth="1.2">
        <rect x={left + 40} y={top + 29} width="94" height={large ? 86 : 110} rx="3" />
        <rect x={left + 44} y={top + 33} width="40" height="23" rx="3" />
        <rect x={left + 88} y={top + 33} width="42" height="23" rx="3" />
        <path d={`M${left + 41} ${top + 62}h92`} />
        {large && <>
          <rect x={left + 40} y="225" width="94" height="86" rx="3" />
          <rect x={left + 44} y="229" width="40" height="23" rx="3" />
          <rect x={left + 88} y="229" width="42" height="23" rx="3" />
          <path d={`M${left + 41} 258h92`} />
        </>}
      </g>
      <g fill="#fffdfa" stroke="#a39e94" strokeWidth="1.1">
        <rect x={bedroomWall + 11} y={top + 8} width={large ? 135 : 113} height="30" />
        <rect x={bedroomWall + 17} y={top + 14} width="30" height="18" rx="3" />
        <circle cx={bedroomWall + 75} cy={top + 19} r="5" />
        <circle cx={bedroomWall + 90} cy={top + 19} r="5" />
        <circle cx={bedroomWall + 75} cy={top + 30} r="4" />
        <circle cx={bedroomWall + 90} cy={top + 30} r="4" />
        <rect x={large ? 448 : 435} y={top + 12} width="39" height="39" rx="2" />
        <path d={`m${large ? 450 : 437} ${top + 14} 35 35m-35 0 35-35`} stroke="#c0c7cd" />
        <rect x={large ? 405 : 393} y={top + 14} width="25" height="15" rx="2" />
        <ellipse cx={large ? 417.5 : 405.5} cy={top + 37} rx="10" ry="13" />
        <rect x="293" y={bottom - 91} width="108" height="42" rx="6" fill="#dcdccf" />
        <path d={`M304 ${bottom - 90}v30h86v-30m-43 0v30`} />
        <rect x="318" y={bottom - 37} width="59" height="23" rx="11" />
      </g>
      <g stroke="#f6f1e8" strokeWidth="8">
        <path d={`M${bedroomWall} ${bottom - 57}v32M326 ${bottom}h61`} />
        {large && <path d="M235 153v32" />}
        <path d={`M${large ? 391 : 380} ${top + 65}v30`} />
      </g>
      <g stroke="#9fa19b" strokeWidth="1" fill="none">
        <path d={`M${bedroomWall} ${bottom - 57}h32a32 32 0 0 1-32 32`} />
        {large && <path d="M235 153h32a32 32 0 0 1-32 32" />}
      </g>
      <g stroke="#a3c5d4" strokeWidth="5">
        <path d={`M${left} ${top + 52}v50M${left + 45} ${bottom}h64M${left + width} ${bottom - 90}v49M326 ${bottom}h61`} />
      </g>
      <g fill="#5b5d64" textAnchor="middle" fontSize="11" fontFamily="inherit">
        <text x={left + 88} y={large ? 193 : top + 165}>{large ? 'Bedroom 1' : 'Bedroom'}</text>
        {large && <text x={left + 88} y="331">Bedroom 2</text>}
        <text x={large ? 313 : 312} y={top + 63}>Kitchen</text>
        <text x={large ? 447 : 432} y={top + 88}>Bathroom</text>
        <text x="347" y={bottom - 110}>Living space</text>
      </g>
    </svg>
  );
}