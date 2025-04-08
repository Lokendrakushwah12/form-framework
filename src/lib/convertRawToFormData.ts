import type { FormData, FormSection, FormField } from "@/types";

const isValidFieldType = (type: string): type is FormField["type"] => {
  return ["text", "boolean", "select", "date"].includes(type);
};

export function convertRawToFormData(raw: any): FormData {
  const sections: FormSection[] = Object.entries(raw.sections).map(
    ([id, section]: [string, any]) => {
      const flatFields: FormField[] = [];

      Object.entries(section.fields).forEach(([key, value]: [string, any]) => {
        if (Array.isArray(value)) {
          value.forEach((groupItem, index) => {
            Object.entries(groupItem).forEach(([subKey, subValue]: [string, any]) => {
              flatFields.push({
                id: `${key}.${index}.${subKey}`,
                key: subValue.key || `${key}.${index}.${subKey}`,
                groupId: `${key}.${index}`,
                label: subValue.title,
                type: isValidFieldType(subValue.interface?.type)
                  ? subValue.interface.type
                  : "text",
                value: subValue.value,
                options: subValue.interface?.options || [],
                colSpan: subValue.colSpan === "2" || subValue.colSpan === 2 ? 2 : 1,
                required: Boolean(subValue.required),
                placeholder: subValue.placeholder || "",
              });
            });
          });
        } else {
          flatFields.push({
            id: key,
            key: value.key || key,
            label: value.title,
            type: isValidFieldType(value.interface?.type)
              ? value.interface.type
              : "text",
            value: value.value,
            options: value.interface?.options || [],
            colSpan: value.colSpan === "2" || value.colSpan === 2 ? 2 : 1,
            required: Boolean(value.required),
            placeholder: value.placeholder || "",
          });
        }
      });

      return {
        id,
        title: section.title,
        description: section.tooltip,
        bgColor: section.bgColor,
        order: section.order,
        layout: section.layout,
        fields: flatFields,
      };
    }
  );

  return { sections };
}