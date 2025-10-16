import { useState, useMemo } from 'react';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailId, setEmailId] = useState('');
  const emailDomain = '@snu.ac.kr';

  const isButtonDisabled = useMemo(() => {
    return !name || !password || !passwordConfirm || !emailId || password !== passwordConfirm;
  }, [name, password, passwordConfirm, emailId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focused-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focused-input"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focused-input"
          />
          <div className="flex items-center w-full border border-gray-300 rounded-md focused-input">
            <input
              type="text"
              placeholder="이메일"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-4 py-2 border-none rounded-l-md focus:outline-none"
            />
            <span className="px-4 py-2 text-gray-500 rounded-r-md">{emailDomain}</span>
          </div>
        </div>
        <button
          disabled={isButtonDisabled}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md disabled:bg-gray-400"
        >
          가입
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;