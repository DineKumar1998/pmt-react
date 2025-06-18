import React from "react";

const ClockIcon = ({
  width = 18,
  height = 18,
  fill = "currentColor",
  ...props
}: React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  fill?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.9375 1.5C6.9375 1.18934 7.18934 0.9375 7.5 0.9375H10.5C10.8107 0.9375 11.0625 1.18934 11.0625 1.5C11.0625 1.81066 10.8107 2.0625 10.5 2.0625H7.5C7.18934 2.0625 6.9375 1.81066 6.9375 1.5ZM9 3.5625C5.58274 3.5625 2.8125 6.33274 2.8125 9.75C2.8125 13.1673 5.58274 15.9375 9 15.9375C12.4173 15.9375 15.1875 13.1673 15.1875 9.75C15.1875 6.33274 12.4173 3.5625 9 3.5625ZM1.6875 9.75C1.6875 5.71142 4.96142 2.4375 9 2.4375C13.0386 2.4375 16.3125 5.71142 16.3125 9.75C16.3125 13.7886 13.0386 17.0625 9 17.0625C4.96142 17.0625 1.6875 13.7886 1.6875 9.75ZM9 6.1875C9.31066 6.1875 9.5625 6.43934 9.5625 6.75V9.75C9.5625 10.0607 9.31066 10.3125 9 10.3125C8.68934 10.3125 8.4375 10.0607 8.4375 9.75V6.75C8.4375 6.43934 8.68934 6.1875 9 6.1875Z"
        fill={fill}
      />
    </svg>
  );
};

export default ClockIcon;
