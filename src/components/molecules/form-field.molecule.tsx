"use client";

import { cn } from "@/lib/utils";
import Label from "@/components/atoms/label.atom";
import Input from "@/components/atoms/input.atom";
import Select from "@/components/atoms/select.atom";
import Textarea from "@/components/atoms/textarea.atom";
import {
  LuFileText,
  LuKey,
  LuChevronsUpDown,
  LuCalendarDays,
  LuUpload,
  LuCircleAlert,
} from "react-icons/lu";
import { forwardRef, useEffect, useRef, useState } from "react";

// Base props for wrapper layout
type BaseFieldProps = {
  name: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  icon?: React.ReactNode;
  hideDefaultIcon?: boolean;
  placeholder?: string;
};

// ----------------------------------------------------------------
// TextInput
// ----------------------------------------------------------------
type TextInputProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      label,
      error = false,
      errorMessage = "This field is required",
      placeholder = "",
      className,
      icon,
      hideDefaultIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <div className="relative">
          {!hideDefaultIcon && (
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              {icon || <LuFileText className="h-5 w-5" />}
            </span>
          )}
          <Input
            ref={ref}
            id={name}
            name={name}
            type="text"
            placeholder={placeholder}
            variant={error ? "error" : undefined}
            className={cn(!hideDefaultIcon && "pl-10")}
            {...props}
          />
        </div>
        {error && (
          <Label
            icon={<LuCircleAlert className="h-4 w-4" />}
            className="mt-1 cursor-default items-center gap-1 text-xs text-error"
            showIcon={true}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

// ----------------------------------------------------------------
// PasswordInput
// ----------------------------------------------------------------
type PasswordInputProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      name,
      label,
      error = false,
      errorMessage = "This field is required",
      placeholder = "",
      className,
      icon,
      hideDefaultIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <div className="relative">
          {!hideDefaultIcon && (
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              {icon || <LuKey className="h-5 w-5" />}
            </span>
          )}
          <Input
            ref={ref}
            id={name}
            name={name}
            type="password"
            placeholder={placeholder}
            variant={error ? "error" : undefined}
            className={cn(!hideDefaultIcon && "pl-10")}
            {...props}
          />
        </div>
        {error && (
          <Label
            icon={<LuCircleAlert className="h-4 w-4" />}
            className="mt-1 cursor-default items-center gap-1 text-xs text-error"
            showIcon={true}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

// ----------------------------------------------------------------
// SelectInput
// ----------------------------------------------------------------
type SelectInputProps = BaseFieldProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
    options?: { value: string | number; label: string; disabled?: boolean }[];
  };

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      name,
      label,
      options,
      error = false,
      errorMessage = "Please select an option",
      placeholder = "Select an option...",
      className,
      icon,
      hideDefaultIcon = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <div className="relative">
          {!hideDefaultIcon && (
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              {icon || <LuChevronsUpDown className="h-5 w-5" />}
            </span>
          )}
          <Select
            ref={ref}
            id={name}
            name={name}
            variant={error ? "error" : undefined}
            className={cn(!hideDefaultIcon && "pl-10")}
            defaultValue=""
            {...props}
          >
            {placeholder && (
              <option disabled value="">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </Select>
        </div>
        {error && (
          <Label
            icon={<LuCircleAlert className="h-4 w-4" />}
            className="mt-1 cursor-default items-center gap-1 text-xs text-error"
            showIcon={true}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    );
  },
);
SelectInput.displayName = "SelectInput";

// ----------------------------------------------------------------
// DateInput
// ----------------------------------------------------------------
type DateInputProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      name,
      label,
      error = false,
      errorMessage = "This field is required",
      className,
      icon,
      hideDefaultIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <div className="relative">
          {!hideDefaultIcon && (
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              {icon || <LuCalendarDays className="h-5 w-5" />}
            </span>
          )}
          <Input
            ref={ref}
            id={name}
            name={name}
            type="date"
            variant={error ? "error" : undefined}
            className={cn(!hideDefaultIcon && "pl-10")}
            {...props}
          />
        </div>
        {error && (
          <Label
            icon={<LuCircleAlert className="h-4 w-4" />}
            className="mt-1 cursor-default items-center gap-1 text-xs text-error"
            showIcon={true}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    );
  },
);
DateInput.displayName = "DateInput";

// ----------------------------------------------------------------
// TextArea
// ----------------------------------------------------------------
type TextAreaProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      name,
      label,
      error = false,
      errorMessage = "This field is required",
      placeholder = "",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          variant={error ? "error" : undefined}
          className="h-24"
          {...props}
        />
        {error && (
          <Label
            icon={<LuCircleAlert className="h-4 w-4" />}
            className="mt-1 cursor-default items-center gap-1 text-xs text-error"
            showIcon={true}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

// ----------------------------------------------------------------
// FileInput
// ----------------------------------------------------------------
type FileInputProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      name,
      label,
      error = false,
      errorMessage = "File is required",
      placeholder,
      className,
      icon,
      hideDefaultIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
        )}
        <div className="relative">
          {!hideDefaultIcon && (
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
              {icon || <LuUpload className="h-5 w-5" />}
            </span>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            type="file"
            className={cn(
              "file-input-bordered file-input w-full transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none",
              !hideDefaultIcon && "pl-10",
              error ? "file-input-error" : "",
            )}
            {...props}
          />
        </div>
        <Label className="mt-1 cursor-default text-xs">
          {error ? (
            <span className="flex items-center gap-1 text-error">
              <LuCircleAlert className="h-4 w-4" /> {errorMessage}
            </span>
          ) : (
            placeholder && (
              <span className="text-base-content/60">{placeholder}</span>
            )
          )}
        </Label>
      </div>
    );
  },
);
FileInput.displayName = "FileInput";

// ----------------------------------------------------------------
// SearchableSelect
// ----------------------------------------------------------------
export function SearchableSelect<T>({
  options,
  placeholder = "Cari atau pilih...",
  onSelect: propOnSelect,
  renderRow,
  className,
}: {
  options: T[];
  placeholder?: string;
  onSelect?: (option: T) => void;
  renderRow: (
    handleSelect: (val: string, index: number) => void,
    row: T,
    index: number,
  ) => React.ReactNode;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const lowerCaseValue = value.toLowerCase();
    const newFilteredOptions = options.filter((option: any) =>
      Object.values(option).some((val) =>
        String(val).toLowerCase().includes(lowerCaseValue),
      ),
    );
    setFilteredOptions(newFilteredOptions);
    setShowOptions(true);
  };

  const handleOptionClick = (option: string, index: number) => {
    setInputValue(option);
    propOnSelect?.(filteredOptions[index]);
    setShowOptions(false);
  };

  const handleInputFocus = () => {
    setFilteredOptions(options);
    setShowOptions(true);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
      />
      {showOptions && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-box border border-base-300 bg-base-200 p-1 shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) =>
              renderRow((val, i) => handleOptionClick(val, i), option, index),
            )
          ) : (
            <div className="p-3 text-center text-sm text-base-content/60">
              Tidak ada hasil ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
