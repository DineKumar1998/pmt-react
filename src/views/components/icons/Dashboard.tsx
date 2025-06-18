const DashboardIcon = ({
  width = 24,
  height = 24,
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
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g clipPath="url(#clip0_577_3921)">
        <path
          d="M9.99961 18.9987V13.9987H13.9996V18.9987C13.9996 19.5487 14.4496 19.9988 14.9996 19.9988H17.9996C18.5496 19.9988 18.9996 19.5487 18.9996 18.9987V11.9987H20.6996C21.1596 11.9987 21.3796 11.4288 21.0296 11.1288L12.6696 3.59875C12.2896 3.25875 11.7096 3.25875 11.3296 3.59875L2.96961 11.1288C2.62961 11.4288 2.83961 11.9987 3.29961 11.9987H4.99961V18.9987C4.99961 19.5487 5.44961 19.9988 5.99961 19.9988H8.99961C9.54961 19.9988 9.99961 19.5487 9.99961 18.9987Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_577_3921">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DashboardIcon;
