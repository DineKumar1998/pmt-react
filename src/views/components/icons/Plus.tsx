const PlusIcon: React.FC<
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
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M13.918 25.9366C14.889 25.9366 15.6758 25.1498 15.6758 24.1788V1.82227C15.6758 0.85125 14.889 0.0644531 13.918 0.0644531C12.947 0.0644531 12.1602 0.85125 12.1602 1.82227V24.1788C12.1602 25.1498 12.947 25.9366 13.918 25.9366Z"
        fill="black"
      />
      <path
        d="M2.73914 14.7588H25.0957C26.0667 14.7588 26.8535 13.972 26.8535 13.001C26.8535 12.03 26.0667 11.2432 25.0957 11.2432H2.73914C1.76812 11.2432 0.981323 12.03 0.981323 13.001C0.981323 13.972 1.76812 14.7588 2.73914 14.7588Z"
        fill="black"
      />
    </svg>
  );
};

export default PlusIcon;
