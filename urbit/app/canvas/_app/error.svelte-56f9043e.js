import{S as s,i as r,s as a,e as t,t as e,c as o,a as n,g as c,d as u,f as p,J as l,h as d,k as f,l as i,n as m,U as h}from"./chunks/vendor-e24d3430.js";function k(s){let r,a,f=s[1].stack+"";return{c(){r=t("pre"),a=e(f)},l(s){r=o(s,"PRE",{});var t=n(r);a=c(t,f),t.forEach(u)},m(s,t){p(s,r,t),l(r,a)},p(s,r){2&r&&f!==(f=s[1].stack+"")&&d(a,f)},d(s){s&&u(r)}}}function v(s){let r,a,v,E,g,x,P,$=s[1].message+"",j=s[1].stack&&k(s);return{c(){r=t("h1"),a=e(s[0]),v=f(),E=t("p"),g=e($),x=f(),j&&j.c(),P=i()},l(t){r=o(t,"H1",{});var e=n(r);a=c(e,s[0]),e.forEach(u),v=m(t),E=o(t,"P",{});var p=n(E);g=c(p,$),p.forEach(u),x=m(t),j&&j.l(t),P=i()},m(s,t){p(s,r,t),l(r,a),p(s,v,t),p(s,E,t),l(E,g),p(s,x,t),j&&j.m(s,t),p(s,P,t)},p(s,[r]){1&r&&d(a,s[0]),2&r&&$!==($=s[1].message+"")&&d(g,$),s[1].stack?j?j.p(s,r):(j=k(s),j.c(),j.m(P.parentNode,P)):j&&(j.d(1),j=null)},i:h,o:h,d(s){s&&u(r),s&&u(v),s&&u(E),s&&u(x),j&&j.d(s),s&&u(P)}}}function E({error:s,status:r}){return{props:{error:s,status:r}}}function g(s,r,a){let{status:t}=r,{error:e}=r;return s.$$set=s=>{"status"in s&&a(0,t=s.status),"error"in s&&a(1,e=s.error)},[t,e]}export default class extends s{constructor(s){super(),r(this,s,g,v,a,{status:0,error:1})}}export{E as load};
