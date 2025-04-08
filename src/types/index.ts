export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  bgColor?: string;
  description?: string;
  order: number;
  layout?: "full" | "left" | "right";
}

export interface FormField {
  id: string;
  key: string;
  label: string;
  value?: any;
  type: "text" | "boolean" | "select" | "date";
  options?: string[];
  colSpan?: 1 | 2;
  required?: boolean;
  placeholder?: string;
}

export interface FormData {
  sections: FormSection[];
  [key: string]: any;
}

export interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  editMode: boolean;
  colSpan?: 1 | 2;
}
