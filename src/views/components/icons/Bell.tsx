const BellIcon: React.FC<
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
        d="M15.2896 15.29L13.9996 14V9C13.9996 5.93 12.3596 3.36 9.49956 2.68V2C9.49956 1.17 8.82956 0.5 7.99956 0.5C7.16956 0.5 6.49956 1.17 6.49956 2V2.68C3.62956 3.36 1.99956 5.92 1.99956 9V14L0.709563 15.29C0.0795632 15.92 0.519563 17 1.40956 17H14.5796C15.4796 17 15.9196 15.92 15.2896 15.29ZM11.9996 15H3.99956V9C3.99956 6.52 5.50956 4.5 7.99956 4.5C10.4896 4.5 11.9996 6.52 11.9996 9V15ZM7.99956 20C9.09956 20 9.99956 19.1 9.99956 18H5.99956C5.99956 19.1 6.88956 20 7.99956 20Z"
        fill={fill}
      />
    </svg>
  );
};

export default BellIcon;
