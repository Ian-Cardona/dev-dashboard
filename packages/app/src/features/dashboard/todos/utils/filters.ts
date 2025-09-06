import type { TodoBatch } from '@dev-dashboard/shared';

export const filterBatchesByTime = (
  timeFilter: string,
  batches: TodoBatch[]
) => {
  if (timeFilter === 'all') return batches;

  const now = new Date();
  return batches.filter(batches => {
    const batchesDate = new Date(batches.syncedAt);
    switch (timeFilter) {
      case 'today': {
        return (
          batchesDate.getDate() === now.getDate() &&
          batchesDate.getMonth() === now.getMonth() &&
          batchesDate.getFullYear() === now.getFullYear()
        );
      }
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return (
          batchesDate.getDate() === yesterday.getDate() &&
          batchesDate.getMonth() === yesterday.getMonth() &&
          batchesDate.getFullYear() === yesterday.getFullYear()
        );
      }
      case 'last7': {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return batchesDate >= sevenDaysAgo && batchesDate <= now;
      }
      default:
        return true;
    }
  });
};
