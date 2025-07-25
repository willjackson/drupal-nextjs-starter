import Link from 'next/link';

interface TagProps {
  tag: string;
  variant?: 'default' | 'large' | 'pill';
  className?: string;
}

export default function Tag({ tag, variant = 'default', className = '' }: TagProps) {
  const baseClasses = 'inline-block transition-colors duration-200 hover:bg-blue-100 hover:text-blue-800';
  
  const variantClasses = {
    default: 'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded',
    large: 'text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg',
    pill: 'text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full'
  };

  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {tag}
    </Link>
  );
}

interface TagListProps {
  tags: string[];
  variant?: 'default' | 'large' | 'pill';
  maxTags?: number;
  className?: string;
}

export function TagList({ tags, variant = 'default', maxTags, className = '' }: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayTags.map(tag => (
        <Tag key={tag} tag={tag} variant={variant} />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}