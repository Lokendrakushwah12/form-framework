import type { FormData, FormSection, FormField } from "@/types";

// Add this helper to narrow down types
const isValidFieldType = (type: string): type is FormField["type"] => {
  return ["text", "boolean", "select", "date"].includes(type);
};

export function convertRawToFormData(raw: any): FormData {
  const sections: FormSection[] = Object.entries(raw.sections).map(
    ([id, section]: [string, any]) => ({
      id,
      title: section.title,
      description: section.tooltip,
      order: section.order,
      layout: section.layout,
      fields: Object.entries(section.fields).map(
        ([key, field]: [string, any]): FormField => ({
          id: key,
          key,
          label: field.title,
          type: isValidFieldType(field.interface?.type) ? field.interface.type : "text",
          options: field.interface?.options || [],
          colSpan: field.colSpan === "2" || field.colSpan === 2 ? 2 : 1,
          required: Boolean(field.required),
          placeholder: field.placeholder || "",
        })
      ),
    })
  );

  return { sections };
}