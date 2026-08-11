export default function Logo({ width = 120, height = 40 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="28" fontFamily="Inter" fontWeight="800" fontSize="28" fill="#FEFEFE">SPX</text>
      <text x="62" y="28" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#ED3237">(IA)</text>
    </svg>
  )
}
