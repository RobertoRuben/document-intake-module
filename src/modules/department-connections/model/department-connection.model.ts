export interface DepartmentConnection {
    id?: number;
    sourceDepartmentId?: number;
    sourceDepartmentName?: string;
    targetDepartmentId?: number;
    targetDepartmentName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}