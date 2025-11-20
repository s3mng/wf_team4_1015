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

type postJsonOptions<Body = void> = {
  body?: Body;
  token?: string
}

type getJsonOptions<Params = void> = {
  params?: Params;
  token?: string
}

/**
 * Sends a POST request and processes the response.
 * @template Req, Res
 * @param {string} path
 * @param {postJsonOptions<Body>} options
 * @returns {Promise<Res>}
 */
async function postJson<Req, Res>(
  path: string,
  options: postJsonOptions<Req>
): Promise<Res> {
  const { body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add an Authorization header if the token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
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
 * Sends a GET request and processes the response.
 * @template Res
 * @param {string} path
 * @param {getJsonOptions} options
 * @returns {Promise<Res>}
 */
export async function getJson<Res, Params = void>(
  path: string, 
  options: getJsonOptions<Params>
): Promise<Res> {
  const { params, token } = options;

  const queryString = params ? encodeQueryParams({ params }) : "";
  const fetchURL = queryString
    ? `${BASE_URL}${path}?${queryString}`
    : `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  
  // Add an Authorization header if the token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(fetchURL, {
    method: 'GET',
    headers,
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
  return postJson<SignUpRequestBody, SignUpResult>('/api/auth/user', { body: req });
}

/**
 * @example
 * const { user, token } = await signIn();
 */
export function signIn(req: SignInRequestBody): Promise<SignInResult> {
  return postJson<SignInRequestBody, SignInResult>(
    '/api/auth/user/session',
    { body: req }
  );
}

/**
 * @example
 * const { id, password } = await getUserInfo();
 */
export function getUserInfo(token: string): Promise<GetMeResult> {
  return getJson<GetMeResult>(
    '/api/auth/me',
    { token }
  );
}

/**
 * @example
 * const { posts, paginator } = await getPosts({ positions: ['FRONT'], isActive: false });
 * const { posts, paginator } = await getPosts({ positions: ['FRONT'] }, 'token-abc');
 */
export function getPosts(
  params: GetPostsParams = {},
  token?: string
): Promise<GetPostsResult> {
  return getJson<GetPostsResult, GetPostsParams>(
    '/api/post',
    { params, token }
  );
}

/**
 * @example
 * await addBookmark('post-id-123', 'token-abc');
 */
export function addBookmark(
  postId: string,
  token: string
): Promise<void> {
  return postJson<void, void>(
    `/api/post/${postId}/bookmark`,
    { token }
  );
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
