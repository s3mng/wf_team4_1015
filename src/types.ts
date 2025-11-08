import type { Domain } from './domain';

const SUCCESS_CODE = 'ok';

type authType = 'APPLICANT';
type infoType = 'APPLICANT';
type userRole = 'APPLICANT';

export type User = {
  id: string;
  userRole: userRole;
  name: string;
};

/* -------------- POST /api/auth/user -------------- */

export type SignUpRequestBody = {
  authType: authType;
  info: {
    type: infoType;
    name: string;
    email: string;
    password: string;
    successCode: string;
  };
};

export type SignUpResult = {
  user: User;
  token: string;
};

export function makeSignUpRequestBody(
  name: string,
  email: string,
  password: string
): SignUpRequestBody {
  return {
    authType: 'APPLICANT',
    info: {
      type: 'APPLICANT',
      name: name,
      email: email,
      password: password,
      successCode: SUCCESS_CODE,
    },
  };
}

/* ---------- POST /api/auth/user/session ---------- */

export type SignInRequestBody = {
  email: string;
  password: string;
};

export type SignInResult = {
  user: User;
  token: string;
};

export function makeSignInRequestBody(
  email: string,
  password: string
): SignInRequestBody {
  return {
    email: email,
    password: password,
  };
}

/* ---------------- GET /api/auth/me --------------- */

export type GetMeResult = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userRole: userRole;
  email: string;
};

/* ----------------- GET /api/post ----------------- */

export type GetPostsParams = {
  positions?: PositionType[];
  isActive?: boolean;
  order?: number;
  domains?: Domain[];
  page?: number;
};

export type GetPostsResult = {
  posts: Post[];
  paginator: {
    lastPage: number;
  };
};

export type PostAuthor = {
  id: string;
  name: string;
  profileImageKey: string;
};

export type PostTag = {
  tag: string;
};

export type PositionType =
  | 'FRONT'
  | 'APP'
  | 'BACKEND'
  | 'DATA'
  | 'OTHERS'
  | 'DESIGN'
  | 'PLANNER'
  | 'MARKETING';

export type Post = {
  id: string;
  author: PostAuthor;
  companyName: string;
  profileImageKey: string;
  location: string;
  employmentEndDate: string;
  positionTitle: string;
  domain: Domain;
  slogan: string;
  detailSummary: string;
  positionType: PositionType;
  headCount: number;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: PostTag[];
  coffeeChatCount: number;
};

/* ------------------- API Error ------------------- */

export type ApiError = {
  code: string;
  message: string;
};
