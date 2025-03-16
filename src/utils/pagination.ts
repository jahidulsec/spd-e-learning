export const paginate = (
    currentPage: number,
    size: number,
    totalItems: number
  ) => {
    return {
      current_page: currentPage,
      per_page: size,
      total_page: Math.ceil(totalItems / size),
      total_items: totalItems,
    };
  };