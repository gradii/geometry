export function covertSkipToPage(state) {
  return { pageNo: Math.floor(state.skip / state.take) + 1, pageSize: state.take };
}