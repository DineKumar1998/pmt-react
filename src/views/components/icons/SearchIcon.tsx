const SearchIcon: React.FC<
  React.SVGProps<SVGSVGElement> & {
    width?: number | string;
    height?: number | string;
    fill?: string;
  }
> = ({ width = 24, height = 24, fill = "currentColor", ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="5" cy="5" r="4.3" stroke={fill} strokeWidth="1.8" />
      <line
        x1="10.0101"
        y1="11"
        x2="8"
        y2="8.98995"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SearchIcon;
