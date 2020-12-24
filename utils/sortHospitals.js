// sort algorithm using merge sort
function sortHospitals(arr) {
  let sorted = arr.slice();
  const n = sorted.length;
  let buffer = new Array(n);

  for (let size = 1; size < n; size *= 2) {
    for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
      let left = leftStart;
      let right = Math.min(left + size, n);
      let leftLimit = right;
      let rightLimit = Math.min(right + size, n);
      let i = left;

      while (left < leftLimit && right < rightLimit) {
        if (sorted[left].distance <= sorted[right].distance) {
          buffer[i++] = sorted[left++];
        } else {
          buffer[i++] = sorted[right++];
        }
      }

      while (left < leftLimit) {
        buffer[i++] = sorted[left++];
      }

      while (right < rightLimit) {
        buffer[i++] = sorted[right++];
      }
    }

    let temp = sorted;
    sorted = buffer;
    buffer = temp;
  }

  return sorted;
}

export default sortHospitals;
