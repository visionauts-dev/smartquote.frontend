/**
 * Wrapper around react-infinite-scroll-component for grid body
 */

import React from 'react';
import InfiniteScrollLib from 'react-infinite-scroll-component';

export interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loadMore: () => void;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  /** Optional height for scroll container (default: none, use parent height) */
  height?: number | string;
  /** Use scrollable target (id of parent) instead of window */
  scrollableTarget?: string;
  className?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  loadMore,
  loader = (
    <div className="py-4 text-center text-sm text-gray-500">Loading more...</div>
  ),
  endMessage,
  height,
  scrollableTarget,
  className = '',
}) => {
  return (
    <InfiniteScrollLib
      dataLength={React.Children.count(children)}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
      height={height}
      scrollableTarget={scrollableTarget}
      className={className}
    >
      {children}
    </InfiniteScrollLib>
  );
};
