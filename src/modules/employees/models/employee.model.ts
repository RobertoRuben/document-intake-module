export interface Employee {
    id?: number;
    dni: number;
    paternalSurname: string;
    maternalSurname: string;
    names: string;
    gender: string;
    positionId: number;
    positionName?: string;
    departmentId: number;
    departmentName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}