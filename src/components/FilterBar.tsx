import { useState } from 'react';
import {
  DOMAINS,
  ORDER_OPTIONS,
  POSITION_CATEGORIES,
} from '../constants/filters';
import type { Domain } from '../domain';
import { domainToKorean } from '../domain';
import type { PositionType } from '../types';

export type FilterState = {
  positions: PositionType[];
  isActive: boolean;
  order: number;
  domains: Domain[];
};

type FilterBarProps = {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
};

const FilterBar = ({ filters, onApply }: FilterBarProps) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // 필터가 적용되었는지 확인하는 함수
  const hasDomainFilter = filters.domains.length > 0;
  const hasStatusFilter = filters.isActive;
  const hasOrderFilter = filters.order !== 0;

  const handlePositionToggle = (position: PositionType) => {
    setTempFilters((prev) => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter((p) => p !== position)
        : [...prev.positions, position],
    }));
  };

  const handleCategoryToggle = (category: keyof typeof POSITION_CATEGORIES) => {
    const categoryValues = POSITION_CATEGORIES[category].values;
    const allSelected = categoryValues.every((v) =>
      tempFilters.positions.includes(v)
    );

    setTempFilters((prev) => ({
      ...prev,
      positions: allSelected
        ? prev.positions.filter((p) => !categoryValues.includes(p))
        : [
            ...prev.positions.filter((p) => !categoryValues.includes(p)),
            ...categoryValues,
          ],
    }));
  };

  const handleDomainToggle = (domain: Domain) => {
    setTempFilters((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      positions: [],
      isActive: false,
      order: 0,
      domains: [],
    };
    setTempFilters(resetFilters);
    onApply(resetFilters);
  };

  const getPositionLabel = () => {
    if (tempFilters.positions.length === 0) return '직군 필터';
    if (tempFilters.positions.length === 1) {
      const category = Object.values(POSITION_CATEGORIES).find((cat) =>
        cat.values.includes(tempFilters.positions[0])
      );
      return category?.label || tempFilters.positions[0];
    }
    return `직군 필터 (${tempFilters.positions.length})`;
  };

  const getDomainLabel = () => {
    if (tempFilters.domains.length === 0) return '업종';
    if (tempFilters.domains.length === 1)
      return domainToKorean(tempFilters.domains[0]);
    return `업종 (${tempFilters.domains.length})`;
  };

  const getStatusLabel = () => {
    return tempFilters.isActive ? '모집중' : '전체';
  };

  const getOrderLabel = () => {
    const option = ORDER_OPTIONS.find((opt) => opt.value === tempFilters.order);
    return option?.label || '정렬';
  };

  return (
    <div className="w-full py-4">
      <div className="max-w-screen-lg flex flex-col mx-auto px-6 space-y-4">
        <div className="flex items-center">
          {/* 직군 필터 아코디언 */}
          <div className="w-full">
            <button
              onClick={() => setIsPositionOpen(!isPositionOpen)}
              className={
                'w-full md:justify-between px-4 py-2 bg-[#e8eBef] rounded-lg hover:bg-gray-300 flex items-center gap-2 font-bold text-md text-[#383b41]'
              }
            >
              {getPositionLabel()}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${isPositionOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isPositionOpen && (
              <div className="flex flex-col py-4 space-y-2">
                {/* 개발 섹션 */}
                <span className="font-bold text-md">개발</span>
                <div className="flex flex-col">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={POSITION_CATEGORIES.DEV.values.every((v) =>
                        tempFilters.positions.includes(v)
                      )}
                      onChange={() => handleCategoryToggle('DEV')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">전체</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('FRONT')}
                      onChange={() => handlePositionToggle('FRONT')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">프론트엔드 개발</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('BACKEND')}
                      onChange={() => handlePositionToggle('BACKEND')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">서버·백엔드 개발</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('APP')}
                      onChange={() => handlePositionToggle('APP')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">앱 개발</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('DATA')}
                      onChange={() => handlePositionToggle('DATA')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">데이터 개발</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('OTHERS')}
                      onChange={() => handlePositionToggle('OTHERS')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">기타 분야</span>
                  </label>
                </div>

                {/* 기획 섹션 */}
                <span className="font-bold text-md">기획</span>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('PLANNER')}
                      onChange={() => handleCategoryToggle('PLANNER')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">전체</span>
                  </label>
                </div>

                {/* 디자인 섹션 */}
                <span className="font-bold text-md">디자인</span>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('DESIGN')}
                      onChange={() => handleCategoryToggle('DESIGN')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">전체</span>
                  </label>
                </div>

                {/* 마케팅 섹션 */}
                <span className="font-bold text-md">마케팅</span>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={tempFilters.positions.includes('MARKETING')}
                      onChange={() => handleCategoryToggle('MARKETING')}
                      className="w-4 h-4"
                    />
                    <span className="text-md">전체</span>
                  </label>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, positions: [] }));
                      setIsPositionOpen(false);
                    }}
                    className="w-1/2 px-4 py-2 bg-[#f1f2f5] text-[#777f8b] text-sm font-semibold rounded-lg hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsPositionOpen(false);
                    }}
                    className="w-1/2 px-4 py-2 bg-[#484c53] text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {/* 업종 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsDomainOpen(!isDomainOpen)}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#484c53] text-sm ${
                hasDomainFilter
                  ? 'border-[#9fa9b9] font-semibold bg-[#f1f2f5]'
                  : 'border-[#f1f2f5]'
              }`}
            >
              {getDomainLabel()}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${isDomainOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isDomainOpen && (
              <div className="absolute top-full left-0 bg-white rounded-xl shadow-lg p-4 z-10 min-w-[200px]">
                <div className="flex flex-col">
                  {/* 전체 체크박스 */}
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2">
                    <input
                      type="checkbox"
                      checked={tempFilters.domains.length === 0}
                      onChange={() =>
                        setTempFilters((prev) => ({ ...prev, domains: [] }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">전체</span>
                  </label>
                  {/* 각 도메인 체크박스 */}
                  {DOMAINS.map((domain) => (
                    <label
                      key={domain}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.domains.includes(domain)}
                        onChange={() => handleDomainToggle(domain)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{domainToKorean(domain)}</span>
                    </label>
                  ))}
                </div>
                <div className="w-full flex gap-2 mt-2 pt-3 place-content-end">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, domains: [] }));
                      setIsDomainOpen(false);
                    }}
                    className="px-4 py-2 bg-[#f1f2f5] text-[#777f8b] text-sm font-semibold rounded-lg hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsDomainOpen(false);
                    }}
                    className="px-4 py-2 bg-[#484c53] text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 모집상태 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#484c53] text-sm ${
                hasStatusFilter
                  ? 'border-[#9fa9b9] font-semibold bg-[#f1f2f5]'
                  : 'border-[#f1f2f5]'
              }`}
            >
              {getStatusLabel()}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isStatusOpen && (
              <div className="absolute top-full left-0 bg-white rounded-xl shadow-lg p-4 z-10 min-w-[200px]">
                <div className="flex flex-col">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="status"
                      checked={!tempFilters.isActive}
                      onChange={() =>
                        setTempFilters((prev) => ({ ...prev, isActive: false }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">전체</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="status"
                      checked={tempFilters.isActive}
                      onChange={() =>
                        setTempFilters((prev) => ({ ...prev, isActive: true }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">모집중</span>
                  </label>
                </div>
                <div className="w-full flex gap-2 mt-2 pt-3 place-content-end">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, isActive: false }));
                      setIsStatusOpen(false);
                    }}
                    className="px-4 py-2 bg-[#f1f2f5] text-[#777f8b] text-sm font-semibold rounded-lg hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsStatusOpen(false);
                    }}
                    className="px-4 py-2 bg-[#484c53] text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 정렬 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#484c53] text-sm ${
                hasOrderFilter
                  ? 'border-[#9fa9b9] font-semibold bg-[#f1f2f5]'
                  : 'border-[#f1f2f5]'
              }`}
            >
              {getOrderLabel()}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${isOrderOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOrderOpen && (
              <div className="absolute top-full left-0 bg-white rounded-xl shadow-lg p-4 z-10 min-w-[200px]">
                <div className="flex flex-col">
                  {ORDER_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="radio"
                        name="order"
                        checked={tempFilters.order === option.value}
                        onChange={() =>
                          setTempFilters((prev) => ({
                            ...prev,
                            order: option.value,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className="w-full flex gap-2 mt-2 pt-3 place-content-end">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, order: 0 }));
                      setIsOrderOpen(false);
                    }}
                    className="px-4 py-2 bg-[#f1f2f5] text-[#777f8b] text-sm font-semibold rounded-lg hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsOrderOpen(false);
                    }}
                    className="px-4 py-2 bg-[#484c53] text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 초기화 버튼 */}
          <div className="ml-auto">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
              aria-label="필터 초기화"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              <span className="text-sm">초기화</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
