import { FormSection } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useDntelForm = (
  initialData: { sections: FormSection[] },
  id: string
) => {
  // State
  const [changes, setChanges] = useState<{ [key: string]: any }>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [lastChanged, setLastChanged] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Refs
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const initialRender = useRef(true);

  // Get sorted sections
  const sortedSections = useMemo(() => {
    return [...initialData.sections].sort((a, b) => a.order - b.order);
  }, [initialData.sections]);

  // Initialize active section
  useEffect(() => {
    if (sortedSections.length > 0 && activeSection === "") {
      setActiveSection(sortedSections[0].id);
    }
  }, [sortedSections, activeSection]);

  // Load from localStorage if id is provided
  useEffect(() => {
    if (id && initialRender.current) {
      const savedData = localStorage.getItem(`form-${id}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setChanges(parsedData.changes || {});
          setExpandedSections(parsedData.expandedSections || []);
          setLastChanged(parsedData.lastChanged || null);
          setEditMode(parsedData.editMode || false);
        } catch (e) {
          console.error("Error parsing saved form data:", e);
        }
      }
      initialRender.current = false;
    }
  }, [id]);

  // Save to localStorage when changes occur
  useEffect(() => {
    if (id && !initialRender.current) {
      const dataToSave = {
        changes,
        expandedSections,
        lastChanged,
        editMode,
      };
      localStorage.setItem(`dntel-form-${id}`, JSON.stringify(dataToSave));
    }
  }, [changes, expandedSections, lastChanged, editMode, id]);

  // Functions
  const changeValue = useCallback((key: string, value: any) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
    setLastChanged(Date.now());
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSections(sortedSections.map((section) => section.id));
  }, [sortedSections]);

  const collapseAll = useCallback(() => {
    setExpandedSections([]);
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => prev.filter((id) => id !== sectionId));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (sectionsRef.current[sectionId]) {
        sectionsRef.current[sectionId].scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
        expandSection(sectionId);
      }
    },
    [expandSection]
  );

  const reset = useCallback(() => {
    setChanges({});
    setLastChanged(Date.now());
  }, []);

  const clearLS = useCallback(() => {
    if (id) {
      localStorage.removeItem(`dntel-form-${id}`);
    }
  }, [id]);

  // Merge initial data with changes for final values
  const getFieldValue = useCallback(
    (key: string) => {
      if (key in changes) {
        return changes[key];
      }

      // Navigate through the nested structure
      const parts = key.split(".");
      let current: any = initialData;

      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }

      return current;
    },
    [changes, initialData]
  );

  return {
    // States
    changes,
    activeSection,
    expandedSections,
    lastChanged,
    editMode,

    // Functions
    expandAll,
    collapseAll,
    scrollToSection,
    expandSection,
    collapseSection,
    toggleSection,
    reset,
    changeValue,
    clearLS,
    setEditMode,
    getFieldValue,
  };
};
