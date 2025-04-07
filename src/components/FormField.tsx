import { getFieldCurrentType } from "@/lib/getFieldCurrentType";
import { FormFieldProps } from "@/types";
import { format as formatDate } from "date-fns";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  editMode,
  colSpan = 2,
}) => {
  // Determine current field type based on value
  console.log("Rendering FormField:", field);
  const currentType =
    typeof value === "string" && field.type !== "text"
      ? getFieldCurrentType(field.type, value)
      : field.type;

  // Handle reset to original type
  const handleReset = () => {
    onChange(undefined);
  };

  return (
    <div className={`flex flex-col col-span-${colSpan}`}>
      <label
        className="text-sm font-medium text-[#3e7864] mb-1"
        htmlFor={field.id}
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* If the value doesn't match the original type, render text input with reset option */}
      {currentType !== field.type && (
        <div className="flex">
          <Input
            id={field.id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || ""}
            disabled={!editMode}
            className="w-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={handleReset}
            disabled={!editMode}
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Render field based on original type if types match */}
      {currentType === field.type && (
        <>
          {field.type === "text" && (
            <Input
              id={field.id}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || ""}
              disabled={!editMode}
            />
          )}

          {field.type === "boolean" && (
            <div className="flex items-center h-10">
              <Checkbox
                id={field.id}
                checked={value === true}
                onCheckedChange={(checked) => onChange(checked)}
                disabled={!editMode}
              />
              <span className="ml-2 text-sm">
                {value === true ? "Yes" : value === false ? "No" : "Not set"}
              </span>
            </div>
          )}

          {field.type === "select" && (
            <Select value={value} onValueChange={onChange} disabled={!editMode}>
              <SelectTrigger id={field.id}>
                <SelectValue
                  placeholder={field.placeholder || "Select an option"}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === "date" && (
            <div className="flex">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !value ? "text-muted-foreground" : ""
                    }`}
                    disabled={!editMode}
                  >
                    {value
                      ? formatDate(new Date(value), "MM/dd/yyyy")
                      : field.placeholder || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) =>
                      onChange(
                        date ? formatDate(date, "MM/dd/yyyy") : undefined
                      )
                    }
                    disabled={!editMode}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/* <Input
                className="ml-2 w-32"
                placeholder="MM/DD/YYYY"
                value={value || ""}
                onChange={(e) => {
                  // Allow typing directly
                  onChange(e.target.value);
                }}
                disabled={!editMode}
              /> */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormField;
