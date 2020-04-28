
export function reparseDrawForms(data) {
  console.log(data);
  data.forEach(function (item, i, array) {
    const properties = item[item.length - 1];
    array[i].strokeStyle = properties.strokeStyle;
    array[i].lineWidth = parseFloat(properties.lineWidth);
    array[i].pop();
    array[i].forEach(function (item, i, array) {
      array[i][0] = parseFloat(item[0]),
      array[i][1] = parseFloat(item[1]);
    });
  });
  console.log(data);
  return data;
}
