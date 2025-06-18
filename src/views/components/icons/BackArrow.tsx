const BackArrow: React.FC<
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3254 2.95437C10.5351 3.13408 10.5593 3.44973 10.3796 3.65939L6.65854 8.00066L10.3796 12.3419C10.5593 12.5516 10.5351 12.8672 10.3254 13.047C10.1157 13.2267 9.80008 13.2024 9.62037 12.9927L5.62037 8.32606C5.45988 8.13881 5.45988 7.86251 5.62037 7.67526L9.62037 3.0086C9.80008 2.79893 10.1157 2.77465 10.3254 2.95437Z"
        fill={fill}
      />
    </svg>
  );
};

export default BackArrow;
