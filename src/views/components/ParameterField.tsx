import { DeleteIcon, EditIcon, ShuffleIcon } from "./icons";

import "./components.scss";

type ParameterFieldType = {
  placeholder?: string;
  isShuffleIcon?: boolean;
  removeParameter?: () => void;
  isEditable?: boolean;
  className?: string;
  dragHandleProps?: any;
  disabled?: boolean;
  showDeleteIcon?: boolean;
};

const ParameterField = ({
  isShuffleIcon,
  dragHandleProps,
  removeParameter,
  className,
  isEditable = false,
  disabled = false,
  showDeleteIcon = true,
  ...rest
}: ParameterFieldType) => {
  return (
    <div className="parameter-field">
      {isShuffleIcon && !disabled && (
        <span className="shuffle-icon" {...dragHandleProps}>
          <ShuffleIcon height={22} width={22} />
        </span>
      )}
      <input type="text" className={`parameter-input ${className}`} disabled={disabled} {...rest} />

      {isEditable && (
        <span className="edit-icon">
          <EditIcon />
        </span>
      )}

      {showDeleteIcon && !disabled && (
        <span className={`delete-icon`} onClick={removeParameter}>
          <DeleteIcon />
        </span>
      )}
    </div>
  );
};

export default ParameterField;
