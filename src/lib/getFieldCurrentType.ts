import { isValid, parse } from "date-fns";

const isDateString = (value: string): boolean => {
  const parsedDate = parse(value, "MM/dd/yyyy", new Date());
  return isValid(parsedDate);
};

export const getFieldCurrentType = (
  originalType: "text" | "boolean" | "select" | "date",
  value: any
): "text" | "boolean" | "select" | "date" => {
  if (value === null || value === undefined) return originalType;

  if (typeof value === "string") {
    // If the value is a string but the field is not meant to be a string
    if (originalType !== "text") {
      if (originalType === "date" && isDateString(value)) {
        return "date";
      } else if (
        originalType === "boolean" &&
        (value === "true" || value === "false")
      ) {
        return "boolean";
      } else {
        return "text"; // The string can't be parsed as the original type
      }
    }
  }

  return originalType;
};
