const DownArrow: React.FC<
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
                d="M0.430571 0.51192C0.700138 0.197426 1.17361 0.161005 1.48811 0.430571L8.00001 6.01221L14.5119 0.430572C14.8264 0.161005 15.2999 0.197426 15.5695 0.511921C15.839 0.826415 15.8026 1.29989 15.4881 1.56946L8.48811 7.56946C8.20724 7.8102 7.79279 7.8102 7.51192 7.56946L0.51192 1.56946C0.197426 1.29989 0.161005 0.826414 0.430571 0.51192Z"
                fill="#68788D" />
        </svg>
    );
};

export default DownArrow;
