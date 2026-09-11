export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: string | null;
    isActive: boolean;
    notification: boolean;
    theme?: string | null;
    character?: string | null;
};
