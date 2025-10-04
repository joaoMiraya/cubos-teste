
export interface UserType {
    user: {
        id: string;
        name: string;
        email: string;
    }
    accessToken: string;
    refreshToken: string;
}

export type SafeUserType = Omit<UserType, "accessToken" | "refreshToken">;
