  // from: https://github.com/urbit/urbit/blob/master/pkg/interface/src/logic/lib/util.tsx

/*
  Goes from:
    (javascript Date object)
  To:
    ~2018.7.17..23.15.09..5be5    // urbit @da
*/

export function dateToDa(d: Date, mil = false) {
  const fil = function (n: number) {
    return n >= 10 ? n : '0' + n;
  };
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

export function  stringToSymbol(str){
  let result = '';
  for (var i=0; i<str.length; i++){
    var n = str.charCodeAt(i);
    if (( (n >= 97) && (n <= 122) ) ||
        ( (n >= 48) && (n <= 57) ))
    {
      result += str[i];
    } else if ( (n >= 65) &&  (n <= 90) )
    {
      result += String.fromCharCode(n + 32);
    } else {
      result += '-';
    }
  }
  return result.replace(/^\-+|\-+$/g, '');
}