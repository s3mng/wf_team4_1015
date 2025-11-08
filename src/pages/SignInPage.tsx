import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { makeSignInRequestBody } from '../types';

const SignInPage = () => { //good
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const emailDomain = '@snu.ac.kr';

  const isButtonDisabled = useMemo(() => {
    return !emailId || !password;
  }, [emailId, password]);

  const onSignInRequested = async () => {
    const reqBody = makeSignInRequestBody(emailId + emailDomain, password);

    try {
      const result = await signIn(reqBody);
      await login(result.token);
      alert('로그인 성공');
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>
        <div className="space-y-4">
          <div className="flex items-center w-full border border-gray-300 rounded-md focused-input">
            <input
              type="text"
              placeholder="이메일"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-4 py-2 border-none rounded-l-md focus:outline-none"
            />
            <span className="px-4 py-2 text-gray-500 rounded-r-md">
              {emailDomain}
            </span>
          </div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focused-input"
          />
        </div>
        <button
          disabled={isButtonDisabled}
          onClick={onSignInRequested}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md disabled:bg-gray-400"
        >
          로그인
        </button>
        <div className="text-sm text-center">
          <p>
            계정이 없으면{' '}
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
