export interface AuthResponseModel {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    expiresIn: number;
}
