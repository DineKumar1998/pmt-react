const UserCircleIcon: React.FC<
  React.SVGProps<SVGSVGElement> & {
    width?: number | string;
    height?: number | string;
  }
> = ({ width = 24, height = 24, ...props }) => {
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
      <circle cx="12" cy="6" r="4" fill={"#68788D"} />
      <ellipse cx="12" cy="17" rx="7" ry="4" fill={"#68788D"} />
    </svg>
  );
};

export default UserCircleIcon;
