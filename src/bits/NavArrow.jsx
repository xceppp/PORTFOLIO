export default function NavArrow({
  direction = 'next',
  className = '',
  label,
  disabled = false,
  onClick,
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      className={`nav-arrow ${isPrev ? 'nav-arrow--prev' : 'nav-arrow--next'} ${className}`.trim()}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <svg
        className="nav-arrow__icon"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path
          d={isPrev ? 'M14.5 5.5 L8 12 l6.5 6.5' : 'M9.5 5.5 L16 12 l-6.5 6.5'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}
