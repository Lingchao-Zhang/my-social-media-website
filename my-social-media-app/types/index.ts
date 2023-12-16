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

export type ThreadCardType = {
    threadId: string;
    currentUserId: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    author: {
        id: string;
        username: string;
        image: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean;
}

export type paramsType = {
    params: { id: string}
}

export type CommentType = {
    threadId: string;
    currentUserId: string;
    currentUserImage: string;
}