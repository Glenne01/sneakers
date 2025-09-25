'use client'

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 relative">
        {/* Badge Skeleton */}
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300 rounded-full"></div>
        {/* Heart Skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category & Gender */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Color */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        
        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="text-right">
            <div className="h-3 bg-gray-200 rounded w-14"></div>
          </div>
        </div>
        
        {/* SKU */}
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton