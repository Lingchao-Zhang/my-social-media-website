import { ObjectId } from "mongoose";

export type AccountProfileType = {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        biography: string;
        imageUrl: string;
    };
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
    createdAt: string;
    author: {
        id: string;
        username: string;
        image: string;
    };
    community: {
        id: string;
        communityname: string;
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

export type ProfileHeaderType = {
    accountId: string;
    authUserId: string;
    image: string; 
    username: string; 
    name: string; 
    biography: string;
}

export type ProfileTabType = {
    tabLabel: string;
    currentUserId: string;
    profileUser: {
        objectId: ObjectId;
        id: string;
        username: string;
        image: string;
    };
}

export type fetchUserParamsType = {
    currentUserId: string;
    searchParam: string;
    currentPageNumber: number;
    pageSize: number;
}

export type UserCardType = {
    userId: string;
    username: string;
    name: string;
    image: string;
}

export type fetchCommunitiesType = {
    searchParam: string;
    currentPageNumber: number; 
    pageSize: number
}

export type CommunityCardType = {
    id: string;
    name: string;
    communityname: string;
    image: string;
    biography: string;
    members: {
      image: string;
    }[]
  }

export type CommunityTabType = {
    tabLabel: string;
    currentUserId: string;
    communityInfo: {
        communityId: string;
        members: {
            id: string;
            username: string;
            name: string;
            image: string;
        }[]
    };
}

export type PaginationType = {
    pageNumber: number;
    isNext: boolean;
    path: string;
}

export type DeleteThreadType = {
    threadId: string;
}