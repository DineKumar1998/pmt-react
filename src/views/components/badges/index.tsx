import React from "react";

import "./styles.css";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

const Badge = ({ children, className = "" }: BadgeProps) => {
  return <span className={`badge ${className}`}>{children}</span>;
};

const Success = (props: BadgeProps) => <Badge {...props} className="badge-success" />;
const Danger = (props: BadgeProps) => <Badge {...props} className="badge-danger" />;
const Info = (props: BadgeProps) => <Badge {...props} className="badge-info" />;

export default Object.assign(Badge, {
  Success,
  Danger,
  Info
});
