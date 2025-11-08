import type {
  ApiError,
  GetMeResult,
  GetPostsParams,
  GetPostsResult,
  SignInRequestBody,
  SignInResult,
  SignUpRequestBody,
  SignUpResult,
} from './types';
import { encodeQueryParams } from './utils';

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
 * const { posts, paginator } = await getPosts({ positions: ['FRONT'], isActive: false });
 * const { posts, paginator } = await getPosts({ positions: ['FRONT'] }, 'token-abc');
 */
export async function getPosts(
  params: GetPostsParams = {},
  token?: string
): Promise<GetPostsResult> {
  const queryString = encodeQueryParams({ params });
  const url = queryString
    ? `${BASE_URL}/api/post?${queryString}`
    : `${BASE_URL}/api/post`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // 토큰이 있으면 Authorization 헤더 추가
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers,
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

/**
 * @example
 * await addBookmark('post-id-123', 'token-abc');
 */
export async function addBookmark(
  postId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/post/${postId}/bookmark`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.error('Network error:', err);
    throw new Error('Network error');
  });

  // ok
  if (res.ok) return;

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
 * await removeBookmark('post-id-123', 'token-abc');
 */
export async function removeBookmark(
  postId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/post/${postId}/bookmark`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.error('Network error:', err);
    throw new Error('Network error');
  });

  // ok
  if (res.ok) return;

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
