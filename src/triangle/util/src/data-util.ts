export function covertSkipToPage(state) {
  return {pageNo: Math.floor(state.pageIndex / state.pageSize) + 1, pageSize: state.pageSize};
}
