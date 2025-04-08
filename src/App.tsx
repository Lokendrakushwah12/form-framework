import { Edit, FormInput, X } from "lucide-react";
import DntelForm from "./components/DntelForm";
import { Button } from "./components/ui/button";
import DntelFormData from "./data/input.json";
import { useDntelForm } from "./hook/useDntelForm";
import { convertRawToFormData } from "./lib/convertRawToFormData";
import { FormData } from "./types";

function App() {
  console.log("DntelFormData:", DntelFormData);
  const initialData = convertRawToFormData(DntelFormData);
  const form = useDntelForm(initialData as FormData, "dntel-form-data");
  console.log("initialData:", initialData);

  return (
    <div className="container mx-auto text-[#212121] p-4 w-full flex flex-col gap-10">
      <div className="flex flex-wrap justify-between items-center w-full gap-2">
        <span className="text-base flex justify-center items-center gap-1 font-semibold">
          <FormInput /> Form Framework
        </span>
        <div className="flex flex-wrap justify-end gap-2 items-center">
          <Button
            variant={"outline"}
            onClick={() => form.setEditMode(!form.editMode)}
            title="Click to enable/disable form editing"
            className="shadow-sm"
          >
            {form.editMode ? (
              <>
                <X /> Exit Edit Mode
              </>
            ) : (
              <>
                <Edit />
                Enter Edit Mode
              </>
            )}
          </Button>
          <Button
            variant={"outline"}
            onClick={form.expandAll}
            title="Opens all form sections"
            className="shadow-sm"
          >
            Expand All
          </Button>
          <Button
            variant={"outline"}
            onClick={form.collapseAll}
            title="Closes all form sections"
            className="shadow-sm"
          >
            Collapse All
          </Button>
        </div>
      </div>
      <div className="flex md:flex-nowrap flex-wrap gap-4 w-full justify-center">
        <div className="mb-8 md:w-1/2 space-y-4">
          {/* Section Navigation */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Navigation:</span>
            <div className="flex flex-wrap gap-2">
              {initialData.sections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => form.scrollToSection(section.id)}
                  className={`px-3 py-1 hover:bg-transparent bg-transparent text-sm ${
                    form.activeSection === section.id
                      ? "border text-[#212121]"
                      : "hover:bg-neutral-100 shadow-none text-[#71717a]"
                  }`}
                  title={`Scroll to ${section.title} section`}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Actions:</span>
            <div className="flex space-x-4">
              <Button
                variant={"outline"}
                onClick={form.reset}
                className="px-4 py-2 border-neutral-300 hover:text-[#71717a] bg-neutral-100 text-neutral-500 hover:bg-neutral-100"
                title="Clears all form data"
              >
                Reset Form
              </Button>
              <Button
                variant={"outline"}
                onClick={form.clearLS}
                className="px-4 py-2 border-red-300 hover:text-white bg-red-100 text-red-500 hover:bg-red-600"
                title="Removes saved form data from browser storage"
              >
                Clear Storage
              </Button>
            </div>
          </div>
          <span className="text-sm text-neutral-500">
            {form.lastChanged
              ? `Last changed: ${new Date(form.lastChanged).toLocaleString()}`
              : "No changes yet"}
          </span>
        </div>

        {/* Debug Information */}
        <div className="p-4 border md:w-1/2 w-full rounded-lg h-fit">
          <span className="text-lg font-semibold">State of Form:</span>
          <pre className="text-sm p-2 rounded-lg bg-neutral-100 overflow-x-auto">
            {JSON.stringify(
              {
                changes: form.changes,
                activeSection: form.activeSection,
                expandedSections: form.expandedSections,
                editMode: form.editMode,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* Form Component */}
      <DntelForm
        sections={initialData.sections}
        changes={form.changes}
        expandedSections={form.expandedSections}
        onChangeValue={form.changeValue}
        onExpandSection={form.expandSection}
        editMode={form.editMode}
      />
    </div>
  );
}

export default App;
