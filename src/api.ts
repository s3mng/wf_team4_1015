import type {
  ApiError,
  GetMeResult,
  GetPostsResult,
  SignInRequestBody,
  SignInResult,
  SignUpRequestBody,
  SignUpResult,
} from './types';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * Sends a POST request and processes the response.
 * @template Req, Res
 * @param {string} path
 * @param {Req} body
 * @returns {Promise<Res>}
 */
async function postJson<Req, Res>(path: string, body: Req): Promise<Res> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch((err) => {
    console.error('Network error:', err);
    throw new Error('Network error');
  });

  // ok
  if (res.ok) return (await res.json()) as Res;

  // error
  let errBody: unknown = undefined;
  try {
    errBody = await res.json();
  } catch (_) {
    _;
  }

  const apiErr: ApiError =
    typeof errBody === 'object' && errBody !== null
      ? (errBody as ApiError)
      : { code: String(res.status), message: res.statusText };

  throw Object.assign(new Error(`[${apiErr.code}] ${apiErr.message}`), {
    status: res.status,
    ...apiErr,
  });
}

/**
 * @example
 * const { user, token } = await signUp();
 */
export function signUp(req: SignUpRequestBody): Promise<SignUpResult> {
  return postJson<SignUpRequestBody, SignUpResult>('/api/auth/user', req);
}

/**
 * @example
 * const { user, token } = await signIn();
 */
export function signIn(req: SignInRequestBody): Promise<SignInResult> {
  return postJson<SignInRequestBody, SignInResult>(
    '/api/auth/user/session',
    req
  );
}

/**
 * @example
 * const { id, password } = await getUserInfo();
 */
export async function getUserInfo(token: string): Promise<GetMeResult> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.error('Network error:', err);
    throw new Error('Network error');
  });

  // ok
  if (res.ok) return (await res.json()) as GetMeResult;

  // error
  let errBody: unknown = undefined;
  try {
    errBody = await res.json();
  } catch (_) {
    _;
  }

  const apiErr: ApiError =
    typeof errBody === 'object' && errBody !== null
      ? (errBody as ApiError)
      : { code: String(res.status), message: res.statusText };

  throw Object.assign(new Error(`[${apiErr.code}] ${apiErr.message}`), {
    status: res.status,
    ...apiErr,
  });
}

/**
 * @example
 * const { posts, paginator } = await getPosts();
 */
export async function getPosts(): Promise<GetPostsResult> {
  const res = await fetch(`${BASE_URL}/api/post`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).catch((err) => {
    console.error('Network error:', err);
    throw new Error('Network error');
  });

  // ok
  if (res.ok) return (await res.json()) as GetPostsResult;

  // error
  let errBody: unknown = undefined;
  try {
    errBody = await res.json();
  } catch (_) {
    _;
  }

  const apiErr: ApiError =
    typeof errBody === 'object' && errBody !== null
      ? (errBody as ApiError)
      : { code: String(res.status), message: res.statusText };

  throw Object.assign(new Error(`[${apiErr.code}] ${apiErr.message}`), {
    status: res.status,
    ...apiErr,
  });
}
