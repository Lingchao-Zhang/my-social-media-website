export type AccountProfileType = {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        biography: string;
        imageUrl: string;
    };
    buttonTitle: string
}

export type onboardingUser = {
    userId: string;
    username: string;
    name: string;
    image: string;
    biography: string;
    path: string 
}

export type threadType = {
    text: string;
    author: string;
    communityId: string | null;
    path: string
}