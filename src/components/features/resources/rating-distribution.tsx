interface RatingDistributionProps {
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  totalCount: number
}

export function RatingDistribution({
  distribution,
  totalCount,
}: RatingDistributionProps) {
  const getPercentage = (count: number) => {
    return totalCount > 0 ? (count / totalCount) * 100 : 0
  }

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(star => {
        const count = distribution[star as keyof typeof distribution]
        const percentage = getPercentage(count)

        return (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm text-gray-600">{star}</span>
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {count}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
