import { ResourceCategory } from '@/types'

interface ResourceFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  categories: ResourceCategory[]
}

export function ResourceFilter({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categories,
}: ResourceFilterProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            搜索资源
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="搜索资源标题、描述或标签..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            筛选分类
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">全部分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.icon} {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                onCategoryChange('all')
                onSearchChange('')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>

      {/* Quick Category Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center space-x-1 ${
                selectedCategory === category.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
