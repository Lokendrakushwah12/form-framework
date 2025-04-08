import { FormSection } from "@/types";
import { ChevronDown } from "lucide-react";
import FormField from "./FormField";

interface DntelFormProps {
  sections: FormSection[];
  changes: { [key: string]: any };
  expandedSections: string[];
  onChangeValue: (key: string, value: any) => void;
  onExpandSection: (sectionId: string) => void;
  editMode: boolean;
}

const DntelForm: React.FC<DntelFormProps> = ({
  sections,
  changes,
  expandedSections,
  onChangeValue,
  onExpandSection,
  editMode,
}) => {
  console.log("section: ", sections);
  console.log("SrfgrS", sections[0].id, sections[0].bgColor);

  const getValue = (key: string) => {
    if (key in changes) {
      return changes[key];
    }
    return getNestedValue(key);
  };

  const getNestedValue = (key: string) => {
    const keys = key.split(".");
    let value = changes;
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value;
  };
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          style={{ backgroundColor: section.bgColor || "#f0f0f0" }}
          className={`p-2 rounded-lg transition-all border-2 
          ${
            expandedSections.includes(section.id)
              ? "border-[#3e7864]/20"
              : "border-[#3e7864]/0"
          }`}
        >
          <div className="flex justify-between p-2 rounded-lg items-center mb-2">
            <h3 className="text-xl text-[#3e7864] font-semibold">
              {section.title}
            </h3>
            <button
              onClick={() => onExpandSection(section.id)}
              className="text-sm cursor-pointer text-[#3e7864] hover:underline"
            >
              <ChevronDown
                className={` transition-all
                ${
                  expandedSections.includes(section.id)
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              />
            </button>
          </div>

          {expandedSections.includes(section.id) && (
            <div className="grid grid-cols-2 px-2 gap-4">
              {section.fields.map((field) => {
                if (!field || typeof field !== "object" || !("type" in field)) {
                  console.warn("Skipping invalid field:", field);
                  return null;
                }
                const value = getValue(field.id);

                return (
                  <FormField
                    key={field.id}
                    field={field}
                    value={field.value || value}
                    onChange={(val) => onChangeValue(field.id, val)}
                    editMode={editMode}
                    colSpan={field.colSpan || 2}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DntelForm;
