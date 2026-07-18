export const EMPLOYEES_PATTERNS = {
  CREATE: 'employees.create',
  FIND_ALL: 'employees.findAll',
  FIND_ONE: 'employees.findOne',
  FIND_BY_IDS: 'employees.findByIds',
  FIND_BY_EMAIL: 'employees.findByEmail',
  UPDATE: 'employees.update',
  REMOVE: 'employees.remove',
} as const;

export const ATTENDANCES_PATTERNS = {
  CREATE: 'attendances.create',
  FIND_ALL: 'attendances.findAll',
  FIND_ONE: 'attendances.findOne',
  FIND_BY_EMPLOYEE: 'attendances.findByEmployee',
  FIND_TODAY_BY_EMPLOYEE: 'attendances.findTodayByEmployee',
  UPDATE: 'attendances.update',
  REMOVE: 'attendances.remove',
} as const;

export const ORDERS_PATTERNS = {
  CREATE: 'orders.create',
  FIND_ALL: 'orders.findAll',
  UPDATE: 'orders.update',
  REMOVE: 'orders.remove',
} as const;

export const AUTH_PATTERNS = {
  LOGIN: 'auth.login',
} as const;

// Fire-and-forget events (ClientProxy.emit / @EventPattern), as opposed to
// the request/reply patterns above (ClientProxy.send / @MessagePattern).
export const EMPLOYEE_EVENTS = {
  UPDATED: 'employee.updated',
  DELETED: 'employee.deleted',
} as const;
