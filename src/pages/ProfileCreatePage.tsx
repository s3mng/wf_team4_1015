import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApplicantProfile, updateApplicantProfile } from '../api';

// 학번을 두 자리로 변환 (2019 -> 19, 1985 -> 85)
const reverseStudentId = (year: number): string => {
  const yearStr = year.toString();
  return yearStr.slice(-2);
};

const ProfileCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const [studentId, setStudentId] = useState('');
  const [majors, setMajors] = useState<string[]>(['']); // 첫 번째는 주전공
  const [resume, setResume] = useState<File | null>(null);
  const [resumePath, setResumePath] = useState<string>('');
  const [loading, setLoading] = useState(isEditMode);

  const [errors, setErrors] = useState({
    studentId: '',
    major: '',
    resume: '',
  });

  // 랜덤 문자열 생성 (10자)
  const generateRandomString = (length: number): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 날짜를 YYYYMMDD 형식으로 변환
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // 수정 모드일 때 기존 프로필 데이터 로드
  useEffect(() => {
    if (!isEditMode) return;

    const loadProfile = async () => {
      const token = Cookies.get('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/sign-in');
        return;
      }

      try {
        const profile = await getApplicantProfile(token);

        // 학번 설정
        if (profile.enrollYear) {
          setStudentId(reverseStudentId(profile.enrollYear));
        }

        // 학과 설정
        if (profile.department) {
          const depts = profile.department.split(',');
          setMajors(depts);
        }

        // 이력서 경로 설정 (파일 자체는 불러오지 않음)
        if (profile.cvKey) {
          setResumePath(profile.cvKey);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        alert('프로필을 불러오는데 실패했습니다.');
        navigate('/mypage');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isEditMode, navigate]);

  // 학번 유효성 검사 (두 자리수 정수만 허용)
  const validateStudentId = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({ ...prev, studentId: '' }));
      return false;
    }

    const regex = /^\d{2}$/;
    if (!regex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        studentId: '두 자리 수 숫자로 작성해주세요. (e.g. 25)',
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, studentId: '' }));
    return true;
  };

  // 학번을 20xx 또는 19xx 형태로 변환
  const convertStudentId = (value: string): number => {
    const num = Number.parseInt(value, 10);
    if (num >= 0 && num <= 24) {
      return 2000 + num;
    }
    return 1900 + num;
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 가능, 최대 2자리
    if (value === '' || /^\d{0,2}$/.test(value)) {
      setStudentId(value);
      if (value.length === 2) {
        validateStudentId(value);
      } else if (value.length === 0) {
        setErrors((prev) => ({ ...prev, studentId: '' }));
      }
    }
  };

  const handleMajorChange = (index: number, value: string) => {
    const newMajors = [...majors];
    newMajors[index] = value;
    setMajors(newMajors);

    // 에러 메시지 초기화
    if (value && index === 0) {
      setErrors((prev) => ({ ...prev, major: '' }));
    }
  };

  const handleAddMajor = () => {
    // 최대 7개 (주전공 1 + 복부전공 6)
    if (majors.length >= 7) {
      return;
    }
    setMajors([...majors, '']);
  };

  const handleRemoveMajor = (index: number) => {
    // 첫 번째(주전공)는 삭제 불가
    if (index === 0) return;
    const newMajors = majors.filter((_, i) => i !== index);
    setMajors(newMajors);
  };

  // 학과 중복 검증
  const validateMajors = (): boolean => {
    // 주전공 필수 체크
    if (!majors[0] || majors[0].trim() === '') {
      setErrors((prev) => ({
        ...prev,
        major:
          '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.',
      }));
      return false;
    }

    // 입력된 학과만 필터링 (빈 문자열 제외)
    const filledMajors = majors.filter((m) => m.trim() !== '');

    // 중복 검증
    const uniqueMajors = new Set(filledMajors.map((m) => m.trim()));
    if (uniqueMajors.size !== filledMajors.length) {
      setErrors((prev) => ({
        ...prev,
        major:
          '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.',
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, major: '' }));
    return true;
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PDF 파일 검증
    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({
        ...prev,
        resume: 'PDF 파일만 업로드 가능합니다.',
      }));
      setResume(null);
      setResumePath('');
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        resume: '5MB 이하의 PDF 파일을 올려주세요.',
      }));
      setResume(null);
      setResumePath('');
      return;
    }

    // 파일 경로 생성: static/private/CV/{랜덤10자}_{YYYYMMDD}/{파일명}.pdf
    const randomStr = generateRandomString(10);
    const dateStr = formatDate(new Date());
    const path = `static/private/CV/${randomStr}_${dateStr}/${file.name}`;

    setResume(file);
    setResumePath(path);
    setErrors((prev) => ({ ...prev, resume: '' }));
  };

  const handleRemoveResume = () => {
    setResume(null);
    setResumePath('');
    setErrors((prev) => ({ ...prev, resume: '' }));
  };

  const isFormValid = (): boolean => {
    const isStudentIdValid = validateStudentId(studentId);
    const isMajorValid = validateMajors();
    // 수정 모드에서는 이력서가 이미 있으면 새로 업로드하지 않아도 됨
    const isResumeValid = isEditMode ? resumePath !== '' : resume !== null;

    return isStudentIdValid && isMajorValid && isResumeValid;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      // 각 필드별 에러 메시지 설정
      if (!studentId) {
        setErrors((prev) => ({
          ...prev,
          studentId: '두 자리 수 숫자로 작성해주세요. (e.g. 25)',
        }));
      }
      if (!resume) {
        setErrors((prev) => ({
          ...prev,
          resume: '5MB 이하의 PDF 파일을 올려주세요.',
        }));
      }
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/sign-in');
      return;
    }

    try {
      const convertedStudentId = convertStudentId(studentId);
      // 학과를 ','로 묶어서 전송 (주전공이 항상 앞에)
      const majorString = majors.filter((m) => m.trim() !== '').join(',');

      // 이력서: 새로 업로드한 파일이 있으면 그것 사용, 없으면 기존 경로 사용
      const finalResumePath = resume ? resumePath : resumePath;

      await updateApplicantProfile(token, {
        enrollYear: convertedStudentId,
        department: majorString,
        cvKey: finalResumePath,
      });

      alert(
        isEditMode ? '프로필이 수정되었습니다.' : '프로필이 저장되었습니다.'
      );
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-6 flex justify-center items-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-8">
          {isEditMode ? '프로필 수정' : '프로필 생성'}
        </h1>

        {/* 필수 작성 항목 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">필수 작성 항목</h2>
          <p className="text-gray-600 text-sm">
            아래 항목은 필수로 작성해주세요.
          </p>
        </div>

        {/* 학번 */}
        <div className="mb-6">
          <label className="block mb-2">
            <span className="font-medium">학번</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentId}
              onChange={handleStudentIdChange}
              placeholder="25"
              className="border border-gray-300 rounded px-4 py-2 w-32"
            />
            <span className="text-gray-600">학번</span>
          </div>
          {errors.studentId && (
            <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
          )}
        </div>

        {/* 학과 */}
        <div className="mb-6">
          <label className="block mb-2">
            <span className="font-medium">학과</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="space-y-2">
            {majors.map((major, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={major}
                  onChange={(e) => handleMajorChange(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? '농경제사회학부'
                      : '복부전공 학과명을 입력해주세요.'
                  }
                  className="border border-gray-300 rounded px-4 py-2 flex-1"
                />
                {index > 0 && (
                  <button
                    onClick={() => handleRemoveMajor(index)}
                    className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddMajor}
            disabled={majors.length >= 7}
            className={`mt-2 px-4 py-2 rounded transition-colors text-sm ${
              majors.length >= 7
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            추가
          </button>
          {errors.major && (
            <p className="text-red-500 text-sm mt-1">{errors.major}</p>
          )}
        </div>

        {/* 이력서 */}
        <div className="mb-8">
          <label className="block mb-2">
            <span className="font-medium">이력서 (CV)</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          {!resume ? (
            <div className="border border-gray-300 rounded px-4 py-8 text-center bg-gray-50">
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer text-gray-500 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                PDF 파일만 업로드 가능해요.
              </label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded px-4 py-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <span className="text-gray-700">{resume.name}</span>
              </div>
              <button
                onClick={handleRemoveResume}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                삭제
              </button>
            </div>
          )}
          {errors.resume && (
            <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors w-full"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreatePage;
