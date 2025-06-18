const RelationshipManagerIcon = ({
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
      {...props}
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <g clipPath="url(#clip0_577_3900)">
        <circle cx="11" cy="6" r="4" fill={fill} />
        <ellipse cx="11" cy="17" rx="7" ry="4" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_577_3900">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RelationshipManagerIcon;
