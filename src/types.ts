type authType = "APPLICANT";
type userRole = "APPLICANT";

type user = {
  id: string;
  userRole: userRole;
};

/* -------------- POST /api/auth/user -------------- */

export type SignUpReqBody = {
  authType: authType;
  info: {
    type: string;
    name: string;
    email: string;
    password: string;
    successCode: string
  }
};

export type SignUpResponse = {
  user: user;
  token: string
};


/* ---------- POST /api/auth/user/session ---------- */

export type SignInReqBody = {
  email: string;
  password: string
};

export type SignInResponse = {
  user: user;
  token: string
};


/* ---------------- GET /api/auth/me --------------- */

export type GetMeResponse = {
  id: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  userRole: userRole;
  email: string
};
