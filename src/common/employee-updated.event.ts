export interface EmployeeUpdatedEvent {
  employeeId: number;
  name: string;
  changedFields: string[];
  updatedAt: string;
}
