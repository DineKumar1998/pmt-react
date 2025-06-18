const RedirectIcon: React.FC<
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
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM7.75 7C7.75 6.58579 8.08579 6.25 8.5 6.25H13C13.4142 6.25 13.75 6.58579 13.75 7V11.5C13.75 11.9142 13.4142 12.25 13 12.25C12.5858 12.25 12.25 11.9142 12.25 11.5V8.81066L7.53033 13.5303C7.23744 13.8232 6.76256 13.8232 6.46967 13.5303C6.17678 13.2374 6.17678 12.7626 6.46967 12.4697L11.1893 7.75H8.5C8.08579 7.75 7.75 7.41421 7.75 7Z"
        fill={fill}
      />
    </svg>
  );
};

export default RedirectIcon;
// "#1C274C"
