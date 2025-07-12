"use client";

import Icon from "../Atoms/LabelIcon"; // Asumsi komponen Icon Anda menerima nama ikon dari lucide-react
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useRef, useEffect } from "react";

// Tipe dasar yang digunakan oleh semua komponen input
type BaseInputProps = {
  name: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
};

// Tipe untuk props div standar
type DivProps = React.HTMLAttributes<HTMLDivElement>;

// ----------------------------------------------------------------
// TextInput Component
// ----------------------------------------------------------------
type TextInputProps = BaseInputProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
} & DivProps;

export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  errorMessage = "This field is required",
  placeholder = "",
  className,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)} {...props}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
          <Icon icon="FileText" height={20} />
        </span>
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "input-bordered input w-full pl-10",
            error ? "input-error" : "",
          )}
        />
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// PasswordInput Component (Typo diperbaiki dari PasspwordInput)
// ----------------------------------------------------------------
type PasswordInputProps = BaseInputProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
} & DivProps;

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  errorMessage = "This field is required",
  placeholder = "",
  className,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)} {...props}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
          <Icon icon="Key" height={20} />
        </span>
        <input
          id={name}
          name={name}
          type="password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "input-bordered input w-full pl-10",
            error ? "input-error" : "",
          )}
        />
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// SelectInput Component
// ----------------------------------------------------------------
type SelectInputProps = BaseInputProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
} & DivProps;

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  error = false,
  errorMessage = "Please select an option",
  placeholder = "Select an option...",
  className,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)} {...props}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
          <Icon icon="ChevronsUpDown" height={20} />
        </span>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={cn(
            "select-bordered select w-full pl-10",
            error ? "select-error" : "",
          )}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// DateInput Component
// ----------------------------------------------------------------
type DateInputProps = BaseInputProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & DivProps;

export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  errorMessage = "This field is required",
  className,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)} {...props}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
          <Icon icon="CalendarDays" height={20} />
        </span>
        <input
          id={name}
          name={name}
          type="date"
          value={value}
          onChange={onChange}
          className={cn(
            "input-bordered input w-full pl-10",
            error ? "input-error" : "",
          )}
        />
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// TextArea Component
// ----------------------------------------------------------------
type TextAreaProps = BaseInputProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
} & DivProps;

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  errorMessage = "This field is required",
  placeholder = "",
  className,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)} {...props}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "textarea-bordered textarea h-24 w-full",
          error ? "textarea-error" : "",
        )}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// FileInput Component (Perbaikan Logika)
// ----------------------------------------------------------------
type FileInputProps = BaseInputProps & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  accept?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  DivProps;

export const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  onChange,
  error = false,
  errorMessage = "File is required",
  placeholder,
  className,
  accept,
  ...props
}) => {
  return (
    <div className={cn("form-control w-full", className)}>
      <label className="label" htmlFor={name}>
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
          <Icon icon="Upload" height={20} />
        </span>
        <input
          id={name}
          name={name}
          type="file"
          onChange={onChange}
          accept={accept}
          className={cn(
            "file-input-bordered file-input w-full pl-10",
            error ? "file-input-error" : "",
          )}
          {...props}
        />
      </div>
      <label className="label">
        {error ? (
          <span className="label-text-alt flex items-center gap-1 text-error">
            <Icon icon="CircleAlert" height={16} /> {errorMessage}
          </span>
        ) : (
          placeholder && <span className="label-text-alt">{placeholder}</span>
        )}
      </label>
    </div>
  );
};

export function SearchableSelect<T>({
  options,
  placeholder = "Cari atau pilih...",
  onSelect: propOnSelect,
  renderRow,
}: {
  options: T[];
  placeholder?: string;
  onSelect?: (option: T) => void;
  renderRow: (
    handleSelect: (val: string, i: number) => void,
    row: T,
    index: number,
  ) => React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
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
    <div ref={containerRef} className="relative">
      <input
        className="input-bordered input w-full pl-10"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
      />
      {showOptions && (
        <div className="absolute z-50 mt-1 max-h-32 w-full overflow-y-auto border bg-base-200 p-1 shadow">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) =>
              renderRow((val, i) => handleOptionClick(val, i), option, index),
            )
          ) : (
            <div className="cursor-pointer border-b p-2 last:border-0 hover:bg-base-300">
              Tidak ada hasil ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
