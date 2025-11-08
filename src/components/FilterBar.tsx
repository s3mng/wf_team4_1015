import { useState } from 'react';
import type { Domain } from '../domain';
import { domainToKorean } from '../domain';
import type { PositionType } from '../types';
import { DOMAINS, ORDER_OPTIONS, POSITION_CATEGORIES } from '../constants/filters';

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
  const hasPositionFilter = filters.positions.length > 0;
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

  const handleApply = () => {
    onApply(tempFilters);
  };

  const getPositionLabel = () => {
    if (tempFilters.positions.length === 0) return '직무 카테고리';
    if (tempFilters.positions.length === 1) {
      const category = Object.values(POSITION_CATEGORIES).find((cat) =>
        cat.values.includes(tempFilters.positions[0])
      );
      return category?.label || tempFilters.positions[0];
    }
    return `직무 카테고리 (${tempFilters.positions.length})`;
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
    <div className="w-full bg-white border-b border-gray-200 py-4">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 직무 카테고리 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsPositionOpen(!isPositionOpen)}
              className={`px-4 py-2 bg-white border rounded hover:bg-gray-50 flex items-center gap-2 ${
                hasPositionFilter
                  ? 'border-blue-500 font-bold text-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {getPositionLabel()}
              <span className="text-gray-500">{isPositionOpen ? '▲' : '▼'}</span>
            </button>
            {isPositionOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 z-10 min-w-[300px]">
                <div className="space-y-3">
                  {Object.entries(POSITION_CATEGORIES).map(([key, category]) => {
                    const allSelected = category.values.every((v) =>
                      tempFilters.positions.includes(v)
                    );
                    return (
                      <div key={key}>
                        <button
                          onClick={() =>
                            handleCategoryToggle(
                              key as keyof typeof POSITION_CATEGORIES
                            )
                          }
                          className={`px-3 py-1 text-sm rounded ${
                            allSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category.label}
                        </button>
                        {key === 'DEV' && (
                          <div className="mt-2 ml-4 flex flex-wrap gap-2">
                            {category.values.map((pos) => (
                              <button
                                key={pos}
                                onClick={() => handlePositionToggle(pos)}
                                className={`px-2 py-1 text-xs rounded ${
                                  tempFilters.positions.includes(pos)
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 업종 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsDomainOpen(!isDomainOpen)}
              className={`px-4 py-2 bg-white border rounded hover:bg-gray-50 flex items-center gap-2 ${
                hasDomainFilter
                  ? 'border-blue-500 font-bold text-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {getDomainLabel()}
              <span className="text-gray-500">{isDomainOpen ? '▲' : '▼'}</span>
            </button>
            {isDomainOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 z-10 min-w-[300px]">
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => handleDomainToggle(domain)}
                      className={`px-3 py-1 text-sm rounded ${
                        tempFilters.domains.includes(domain)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {domainToKorean(domain)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 모집상태 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`px-4 py-2 bg-white border rounded hover:bg-gray-50 flex items-center gap-2 text-sm ${
                hasStatusFilter
                  ? 'border-blue-500 font-bold text-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {getStatusLabel()}
              <span className="text-gray-500">{isStatusOpen ? '▲' : '▼'}</span>
            </button>
            {isStatusOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 z-10 min-w-[200px]">
                <div className="space-y-2">
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
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, isActive: false }));
                      setIsStatusOpen(false);
                    }}
                    className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsStatusOpen(false);
                    }}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
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
              className={`px-4 py-2 bg-white border rounded hover:bg-gray-50 flex items-center gap-2 text-sm ${
                hasOrderFilter
                  ? 'border-blue-500 font-bold text-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {getOrderLabel()}
              <span className="text-gray-500">{isOrderOpen ? '▲' : '▼'}</span>
            </button>
            {isOrderOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 z-10 min-w-[200px]">
                <div className="space-y-2">
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
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setTempFilters((prev) => ({ ...prev, order: 0 }));
                      setIsOrderOpen(false);
                    }}
                    className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => {
                      onApply(tempFilters);
                      setIsOrderOpen(false);
                    }}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 초기화/적용 버튼 */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
