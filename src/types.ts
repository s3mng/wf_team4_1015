const SUCCESS_CODE = "ok";

type authType = "APPLICANT";
type infoType = "APPLICANT";
type userRole = "APPLICANT";

type user = {
  id: string;
  userRole: userRole;
};


/* -------------- POST /api/auth/user -------------- */

export type SignUpRequestBody = {
  authType: authType;
  info: {
    type: infoType;
    name: string;
    email: string;
    password: string;
    successCode: string
  }
};

export type SignUpResult = {
  user: user;
  token: string
};

export function makeSignUpRequestBody(
  name: string,
  email: string,
  password: string
): SignUpRequestBody {
  return {
    authType: "APPLICANT",
    info: {
      type: "APPLICANT",
      name: name,
      email: email,
      password: password,
      successCode: SUCCESS_CODE
    }
  }
}


/* ---------- POST /api/auth/user/session ---------- */

export type SignInRequestBody = {
  email: string;
  password: string
};

export type SignInResult = {
  user: user;
  token: string
};

export function makeSignInRequestBody(
  email: string,
  password: string
): SignInRequestBody {
  return {
    email: email,
    password: password
  }
};


/* ---------------- GET /api/auth/me --------------- */

export type GetMeResult = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userRole: userRole;
  email: string
};


/* ------------------- API Error ------------------- */

export type ApiError = {
  code: string;
  message: string;
};
