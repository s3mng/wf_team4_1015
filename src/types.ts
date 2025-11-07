const SUCCESS_CODE = 'ok';

type authType = 'APPLICANT';
type infoType = 'APPLICANT';
type userRole = 'APPLICANT';

type Domain = 'FINTECH' | 'HEALTHTECH' | 'EDUCATION' | 'ECOMMERCE' | 'FOODTECH' | 'MOBILITY' | 'CONTENTS' | 'B2B' | 'OTHERS'

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

export type GetPostsResult = {
  posts: Post[];
  paginator: {
    lastPage: number
  }
}

export type Post = {
  id: string;
  companyName: string;
  employmentEndDate: string;
  positionTitle: string;
  domain: Domain;
  slogan: string;
  headCount: number;
  isBookmarked: boolean
}

/* ------------------- API Error ------------------- */

export type ApiError = {
  code: string;
  message: string;
};
