export enum UserStatus {
    ACTIVATE = "Activate",
    DEACTIVATE = "Deactivate"
}

export interface User {
    id: number;
    username: string;
    password: string;
    isActive: UserStatus;
    roleId?: number;
    roleName?: string;
    employeeId?: number;
    employeeName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}