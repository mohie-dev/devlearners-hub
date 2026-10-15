export type DepartmentCode = "CS" | "IS" | "IT" | "GENERAL";

export function isDepartmentSelectionAllowed(studyLevel: number): boolean {
  return studyLevel === 3 || studyLevel === 4;
}

export function resolveRegistrationDepartment(
  studyLevel: number,
  selectedDepartment?: DepartmentCode,
): DepartmentCode | undefined {
  return isDepartmentSelectionAllowed(studyLevel) ? selectedDepartment : "GENERAL";
}
