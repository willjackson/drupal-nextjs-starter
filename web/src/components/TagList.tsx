import Link from 'next/link';

type Tag = string | { id: string; name: string };

interface TagListProps {
  tags: Tag[];
  className?: string;
  maxTags?: number;
  variant?: 'default' | 'large' | 'pill';
}

export function TagList({ tags, className = "", maxTags, variant = 'default' }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Deduplicate tags by ID/name
  const uniqueTags = tags.filter((tag, index, self) => {
    const tagKey = typeof tag === 'string' ? tag : tag.id;
    return index === self.findIndex(t => {
      const tKey = typeof t === 'string' ? t : t.id;
      return tKey === tagKey;
    });
  });

  const displayTags = maxTags ? uniqueTags.slice(0, maxTags) : uniqueTags;
  const remainingCount = maxTags && uniqueTags.length > maxTags ? uniqueTags.length - maxTags : 0;

  const getVariantClasses = () => {
    switch (variant) {
      case 'large':
        return 'px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 robot-text rounded-lg';
      case 'pill':
        return 'px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 robot-text rounded-full';
      default:
        return 'px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 robot-text rounded-md';
    }
  };

  const getTagName = (tag: Tag): string => {
    return typeof tag === 'string' ? tag : tag.name;
  };

  const getTagKey = (tag: Tag): string => {
    return typeof tag === 'string' ? tag : tag.id;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => {
        const tagName = getTagName(tag);
        const tagKey = getTagKey(tag);
        
        return (
          <Link
            key={tagKey}
            href={`/tags/${encodeURIComponent(tagName.toLowerCase())}`}
            className={`inline-flex items-center font-medium transition-colors hover:bg-primary/20 hover:border-primary/40 ${getVariantClasses()}`}
          >
            {tagName}
          </Link>
        );
      })}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500 robot-text">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
