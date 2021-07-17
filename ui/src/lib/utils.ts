// from: https://github.com/urbit/urbit/blob/master/pkg/interface/src/logic/lib/util.tsx

const fil = function (n: number) {
  return n >= 10 ? n : '0' + n;
};

/*
  Goes from:
    (javascript Date object)
  To:
    ~2018.7.17..23.15.09..5be5    // urbit @da
*/

export function dateToDa(d: Date, mil = false) {
  return (
    `~${d.getUTCFullYear()}.` +
    `${d.getUTCMonth() + 1}.` +
    `${fil(d.getUTCDate())}..` +
    `${fil(d.getUTCHours())}.` +
    `${fil(d.getUTCMinutes())}.` +
    `${fil(d.getUTCSeconds())}` +
    `${mil ? '..0000' : ''}`
  );
}

export function dateToShortDa(d: Date, mil = false) {
  return (
    `~${d.getUTCFullYear()}.` +
    `${d.getUTCMonth() + 1}.` +
    `${fil(d.getUTCDate())}`
  );
}

/*
  Goes from:
    ~2018.7.17..23.15.09..5be5    // urbit @da
  To:
    (javascript Date object)
*/
export function daToDate(st: string) {
  const dub = function (n: string) {
    return parseInt(n) < 10 ? '0' + parseInt(n) : n.toString();
  };
  const da = st.split('..');
  if (da.length === 1) return null;
  const bigEnd = da[0].split('.');
  const lilEnd = da[1].split('.');
  if (bigEnd.length === 1 || lilEnd.length === 1) return null;
  const ds = `${bigEnd[0].slice(1)}-${dub(bigEnd[1])}-${dub(bigEnd[2])}T${dub(
    lilEnd[0]
  )}:${dub(lilEnd[1])}:${dub(lilEnd[2])}Z`;
  return new Date(ds);
}

export function stringToSymbol(str) {
  let result = '';
  for (var i = 0; i < str.length; i++) {
    var n = str.charCodeAt(i);
    if ((n >= 97 && n <= 122) || (n >= 48 && n <= 57)) {
      result += str[i];
    } else if (n >= 65 && n <= 90) {
      result += String.fromCharCode(n + 32);
    } else {
      result += '-';
    }
  }
  return result.replace(/^\-+|\-+$/g, '');
}
