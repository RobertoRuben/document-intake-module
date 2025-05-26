export interface Submitter {
    id?: number;
    dni: number;
    names: string;
    paternal_surname: string;
    maternal_surname: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
}