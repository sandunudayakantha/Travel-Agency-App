import React from 'react';

const StarRating = ({ rating, onRatingChange, size = 'md', readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-10 h-10';
      default:
        return 'w-6 h-6';
    }
  };

  const handleClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (!readonly) {
      // Add hover effect if needed
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          disabled={readonly}
          className={`${getSizeClasses()} transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <svg
            className={`w-full h-full ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating; 