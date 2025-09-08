import { useEffect, useState } from "react";
import {
  type Control,
  Controller,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";

interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  errors?: FieldErrors;
  control?: any;
  disabled?: boolean;
  handleChange?: React.ChangeEventHandler<HTMLInputElement> | any;
  placeholder?: string;
  margin?: string;
  required?: boolean;
  width?: string;
  className?: string;
  showErrorMessage?: boolean;
  size?: string; // New prop for size
  flexDirection?: string; // New prop for flex direction
  rest?: React.InputHTMLAttributes<HTMLInputElement>;
  value?: string;
  customError?: string;
}

const TextBox: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  errors = {},
  control: controlProp,
  disabled,
  handleChange = () => {},
  placeholder,
  margin = "my-75",
  width,
  className,
  showErrorMessage = true,
  size = "", // Default value for size
  flexDirection = "", // Default value for flex direction
  rest,
  value,
  customError,
}) => {
  const control: Control<FieldValues> =
    controlProp as unknown as Control<FieldValues>;

  const [show, setShow] = useState<string | null>(type);
  useEffect(() => {
    setShow(type);
  }, [type]);

  const classNames = (
    ...args: (
      | string
      | number
      | Record<string, boolean>
      | (string | number | Record<string, boolean>)[]
    )[]
  ): string => {
    return args
      .map((arg) => {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        } else if (Array.isArray(arg)) {
          return classNames(...arg);
        } else if (typeof arg === "object" && arg !== null) {
          return Object.keys(arg).filter((key) => arg[key]);
        }
      })
      .flat()
      .filter(Boolean)
      .join(" ");
  };

  const renderInput = (field: any) => (
    <>
      <input
        type={show ? show : type}
        onChange={(e) => {
          if (type === "file") {
            const file = e.target.files
              ? e.target.files.length > 1
                ? e.target.files
                : e.target.files[0]
              : null;
            handleChange && handleChange(file);
          } else {
            field.onChange(e || "");
            handleChange && handleChange(e);
          }
        }}
        className={
          classNames(
            { "is-invalid": !!errors[name] || !!customError },
            "form-input "
          ) + (className ? ` ${className}` : "")
        }
        disabled={disabled}
        placeholder={
          placeholder ||
          (label ? `Enter your ${label?.toLocaleLowerCase()}` : "")
        }
        min={type === "number" ? 0 : undefined}
        ref={field.ref}
        onBlur={field.onBlur}
        value={type === "file" ? undefined : field.value || ""}
        step={type === "number" ? 1 : undefined}
        style={{ width: "100%" }}
        {...rest}
        id={name}
      />

      {type === "password" && (
        <>
          {" "}
          <button
            type="button"
            className="password-toggle"
            onClick={() => {
              if (show === "password") {
                setShow("text");
              } else {
                setShow("password");
              }
            }}
          >
            {show === "password" ? "Show" : "Hide"}
          </button>{" "}
        </>
      )}
    </>
  );

  return (
    <div className={`form-field ${margin} ${width} ${size} ${flexDirection}`}>
      <div className="form-input-container">
        {errors && control ? (
          <Controller
            control={control}
            name={name}
            render={({ field }) => renderInput(field)}
          />
        ) : (
          renderInput({ onChange: handleChange, value })
        )}
      </div>

      {showErrorMessage &&
        errors[name] &&
        typeof errors[name] !== "string" &&
        errors[name]!.message && (
          <p className="form-error">{errors[name]!.message as string}</p>
        )}

      {customError && <p className="form-error">{customError}</p>}
    </div>
  );
};

export default TextBox;
