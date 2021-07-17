var t,e,n,s,r,a=(t,e,n)=>{if(!e.has(t))throw TypeError("Cannot "+n)},o=(t,e,n)=>(a(t,e,"read from private field"),n?n.call(t):e.get(t)),i=(t,e,n)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,n)},c=(t,e,n,s)=>(a(t,e,"write to private field"),s?s.call(t,n):e.set(t,n),n);import{_ as l,D as h,S as $,i as u,s as p,H as d,j as f,m,o as g,v,r as w,w as y,E as b,e as k,c as x,a as M,d as P,b as C,f as E,l as S,B as G,u as V,R as H,F as Z,k as j,n as T,T as I,I as O,G as W,t as A,g as F,J as L,K as N,L as B,M as q,z,N as D,O as J,P as R}from"../chunks/vendor-e24d3430.js";import{u as Y,c as _,l as K,p as U,s as Q,a as X,b as tt,d as et,e as nt,f as st}from"../chunks/store-f0b4e2b9.js";const rt={"canvas-view":[["/primary","canvas-view"]]};class at extends class{constructor(t,e){this.api=t,this.channel=e,this.errorCount=0,console.log(this.channel),this.channel.setOnChannelError(this.onChannelError.bind(this)),this.channel.setOnChannelOpen(this.onChannelOpen.bind(this))}delete(){this.channel.delete()}restart(){this.handleEvent({data:{connection:"reconnecting"}}),this.start()}onChannelOpen(t){this.errorCount=0,this.handleEvent({data:{connection:"connected"}})}onChannelError(t){if(console.error("event source error: ",t),this.errorCount++,this.errorCount>=5)return console.error("bailing out, too many retries"),void this.handleEvent({data:{connection:"disconnected"}});this.handleEvent({data:{connection:"reconnecting"}}),setTimeout((()=>{this.restart()}),750*Math.pow(2,this.errorCount-1))}subscribe(t,e){return this.api.subscribe(t,"PUT",this.api.ship,e,this.handleEvent.bind(this),(n=>{console.log(n),this.subscribe(t,e)}),(()=>{this.subscribe(t,e)}))}unsubscribe(t){this.api.unsubscribe(t)}start(){}handleEvent(t){}}{constructor(){super(...arguments),this.openSubscriptions={}}start(){this.subscribe("/primary","canvas-view"),this.subscribe("/all","s3-store")}restart(){super.restart(),l.mapValues(this.openSubscriptions,((t,e)=>{t.length>0&&(this.stopApp(e),this.startApp(e))}))}startApp(t){this.openSubscriptions[t].length>0?console.log(`${t} already started`):this.openSubscriptions[t]=rt[t].map((([t,e])=>this.subscribe(t,e)))}stopApp(t){this.openSubscriptions[t].map((t=>this.unsubscribe(t))),this.openSubscriptions[t]=[]}handleEvent(t){const e=t.data;null!==e&&("clear"in e&&e.clear||("connection"in e?Y(e.connection):"init-frontend"in e?_(e["init-frontend"].canvas):"load"in e?K(e.load):"paint"in e?U(e.paint):"gcp-token"in e?Q(e["gcp-token"]):"s3-update"in e&&("credentials"in e["s3-update"]?X(e["s3-update"].credentials):"configuration"in e["s3-update"]&&tt(e["s3-update"].configuration))))}}class ot{constructor(t,e){this.ship=t,this.channel=e,this.bindPaths=[]}unsubscribe(t){this.channel.unsubscribe(t)}subscribe(t,e,n=this.ship,s,r,a,o){return this.bindPaths=l.uniq([...this.bindPaths,t]),this.channel.subscribe(this.ship,s,t,(t=>{a(t)}),(e=>{r({data:e,from:{ship:n,path:t}})}),(t=>{o(t)}))}action(t,e,n,s=window.ship){return new Promise(((r,a)=>{this.channel.poke(s,t,e,n,(t=>{r(t)}),(t=>{a(t)}))}))}scry(t,e){return fetch(`/~/scry/${t}${e}.json`).then((t=>t.json()))}async spider(t,e,n,s){console.log(`/spider/${t}/${n}/${e}.json`);return(await fetch(`/spider/${t}/${n}/${e}.json`,{method:"POST",body:JSON.stringify(s)})).json()}}class it extends ot{async create(t,e,n,s,r,a,o,i){const c={mesh:{canvas:null,metadata:{name:t,location:e,saved:!1,private:s,template:n,width:r,height:a,columns:o,mesh:i}}};return this.sendPoke({create:c})}async send(t,e,n){const s={"canvas-name":e,location:t,strokes:n};return this.sendPoke({paint:s})}async save(t,e,n){const s={"canvas-name":e,location:t,file:n};return this.sendPoke({save:s})}async join(t,e){const n={"canvas-name":e,ship:t};return this.sendPoke({join:n})}async sendPoke(t){return this.action("canvas-view","json",t)}async leave(t,e){const n={"canvas-name":e,ship:t};return this.sendPoke({leave:n})}async makePublic(t){const e={"canvas-name":t};return this.sendPoke({unlock:e})}}class ct extends ot{async isConfigured(){return this.spider("noun","json","gcp-is-configured",{})}async getToken(){return this.spider("noun","gcp-token","gcp-get-token",{})}}t=new WeakMap,e=new WeakMap,n=new WeakMap,s=new WeakMap,r=new WeakMap;const lt=new class{constructor(){i(this,t,null),i(this,e,!1),i(this,n,null),i(this,s,0),i(this,r,!1)}configure(e){c(this,t,e)}start(){o(this,e)?console.warn("GcpManager already running"):o(this,t)?(c(this,e,!0),this.refreshLoop()):console.error("GcpManager must have api set")}stop(){if(!o(this,e))return console.warn("GcpManager already stopped"),void console.assert(null===o(this,n));c(this,e,!1),null!==o(this,n)&&(clearTimeout(o(this,n)),c(this,n,null))}restart(){o(this,e)&&this.stop(),this.start()}refreshLoop(){var e,n;o(this,r)?null==(n=o(this,t))||n.getToken().then((()=>{const t=h(et).gcpToken;if(!t)throw new Error("thread succeeded, but returned no token?");{c(this,s,0);const e=this.refreshInterval(t.expiresIn);console.log("GcpManager got token; refreshing after",e),this.refreshAfter(e)}})).catch((()=>{c(this,s,1+ +o(this,s)),console.warn("GcpManager token refresh failed; retrying with backoff"),this.refreshAfter(this.backoffInterval())})):null==(e=o(this,t))||e.isConfigured().then((t=>{if(void 0===t)throw new Error("can't check whether GCP is configured?");c(this,r,t),o(this,r)?this.refreshLoop():(console.log("GcpManager: GCP storage not configured; stopping."),this.stop())})).catch((t=>{console.error("GcpManager failure; stopping.",t),this.stop()}))}refreshAfter(t){o(this,e)&&(null===o(this,n)?c(this,n,setTimeout((()=>{c(this,n,null),this.refreshLoop()}),t)):console.warn("GcpManager already has a timeout set"))}refreshInterval(t){return Math.max(18e5,t-6e4)}backoffInterval(){return 5e3*Math.floor(Math.random()*Math.min(60,o(this,s)))}};Object.freeze(lt);function ht(t){let e,n,s;return n=new H({props:{$$slots:{default:[Mt]},$$scope:{ctx:t}}}),{c(){e=k("div"),f(n.$$.fragment),this.h()},l(t){e=x(t,"DIV",{class:!0});var s=M(e);m(n.$$.fragment,s),s.forEach(P),this.h()},h(){C(e,"class","svelte-dfvg7s")},m(t,r){E(t,e,r),g(n,e,null),s=!0},p(t,e){const s={};3&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){s||(v(n.$$.fragment,t),s=!0)},o(t){w(n.$$.fragment,t),s=!1},d(t){t&&P(e),y(n)}}}function $t(t){let e,n;return e=new N({props:{status:"finished",description:"Connected"}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function ut(t){let e,n;return e=new N({props:{status:"active",description:"Reconnecting..."}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function pt(t){let e,n;return e=new N({props:{status:"error",description:"Disconnected"}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function dt(t){let e,n,s,r;const a=[pt,ut,$t],o=[];function i(t,e){return"disconnected"===t[0].connection?0:"reconnecting"===t[0].connection?1:"connected"===t[0].connection?2:-1}return~(e=i(t))&&(n=o[e]=a[e](t)),{c(){n&&n.c(),s=S()},l(t){n&&n.l(t),s=S()},m(t,n){~e&&o[e].m(t,n),E(t,s,n),r=!0},p(t,r){let c=e;e=i(t),e!==c&&(n&&(G(),w(o[c],1,1,(()=>{o[c]=null})),V()),~e?(n=o[e],n||(n=o[e]=a[e](t),n.c()),v(n,1),n.m(s.parentNode,s)):n=null)},i(t){r||(v(n),r=!0)},o(t){w(n),r=!1},d(t){~e&&o[e].d(t),t&&P(s)}}}function ft(t){let e,n;return{c(){e=B("svg"),n=B("path"),this.h()},l(t){e=x(t,"svg",{width:!0,height:!0,viewBox:!0,style:!0},1);var s=M(e);n=x(s,"path",{d:!0,stroke:!0,"stroke-width":!0,fill:!0},1),M(n).forEach(P),s.forEach(P),this.h()},h(){C(n,"d","m 5 13 l 6 -10 l 12 0 l 6 10 l -6 10 l -12 0 l 0 0 t 0 0 l 0 0 m 0 0 l -6 -10 m 24 0 h 11 l 6 10 l -6 10 h -11 l -6 -10 m -12 0 l -6 10 l 5 10 l 15 0 l 4 -10 l -6 -10 z"),C(n,"stroke","white"),C(n,"stroke-width","0.6"),C(n,"fill","none"),C(e,"width","35"),C(e,"height","34"),C(e,"viewBox","1 1 48 44"),C(e,"style","margin-right: 5px;")},m(t,s){E(t,e,s),L(e,n)},d(t){t&&P(e)}}}function mt(t){let e,n;return{c(){e=B("svg"),n=B("path"),this.h()},l(t){e=x(t,"svg",{width:!0,height:!0,viewBox:!0,style:!0},1);var s=M(e);n=x(s,"path",{d:!0,stroke:!0,"stroke-width":!0,fill:!0},1),M(n).forEach(P),s.forEach(P),this.h()},h(){C(n,"d","M 8 8 H 8 V 23 H 23 V 8 H 8 M 38 8 H 23 V 23 H 38 V 8 Z M 38 23 M 38 37 M 38 37 H 23 V 23 H 38 Z M 5 23 H 8 Z M 5 8 H 8 Z M 8 5 V 8 Z M 23 5 V 8 Z M 38 5 V 8 Z M 41 8 H 38 Z M 41 23 H 38 Z M 41 37 H 38 Z M 38 40 V 37 Z M 23 40 V 37 Z M 20 37 H 23 Z M 8 23 V 26 Z"),C(n,"stroke","white"),C(n,"stroke-width","0.6"),C(n,"fill","none"),C(e,"width","38"),C(e,"height","34"),C(e,"viewBox","3 3 40 39"),C(e,"style","margin-right: 5px;")},m(t,s){E(t,e,s),L(e,n)},d(t){t&&P(e)}}}function gt(t){let e;function n(t,e){return"squa"===t[0].canvas[t[0].name].metadata.mesh?mt:"hexa"===t[0].canvas[t[0].name].metadata.mesh?ft:void 0}let s=n(t),r=s&&s(t);return{c(){r&&r.c(),e=S()},l(t){r&&r.l(t),e=S()},m(t,n){r&&r.m(t,n),E(t,e,n)},p(t,a){s!==(s=n(t))&&(r&&r.d(1),r=s&&s(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){r&&r.d(t),t&&P(e)}}}function vt(t){let e;return{c(){e=A("If you have S3 Storage configured, you can export your canvas as\n                SVG files.")},l(t){e=F(t,"If you have S3 Storage configured, you can export your canvas as\n                SVG files.")},m(t,n){E(t,e,n)},d(t){t&&P(e)}}}function wt(t){let e;return{c(){e=A("You can see the color picker by clicking on the Palette icon.")},l(t){e=F(t,"You can see the color picker by clicking on the Palette icon.")},m(t,n){E(t,e,n)},d(t){t&&P(e)}}}function yt(t){let e;return{c(){e=A("To show more options, right click anywhere in the canvas.")},l(t){e=F(t,"To show more options, right click anywhere in the canvas.")},m(t,n){E(t,e,n)},d(t){t&&P(e)}}}function bt(t){let e;return{c(){e=A("Feedback, questions? Contact ~norsyr-torryn :)")},l(t){e=F(t,"Feedback, questions? Contact ~norsyr-torryn :)")},m(t,n){E(t,e,n)},d(t){t&&P(e)}}}function kt(t){let e,n,s,r,a,o,i,c,l,h;return s=new W({props:{selectorPrimaryFocus:"#d",$$slots:{default:[vt]},$$scope:{ctx:t}}}),a=new W({props:{selectorPrimaryFocus:"#d",$$slots:{default:[wt]},$$scope:{ctx:t}}}),i=new W({props:{selectorPrimaryFocus:"#d",$$slots:{default:[yt]},$$scope:{ctx:t}}}),l=new W({props:{selectorPrimaryFocus:"#d",$$slots:{default:[bt]},$$scope:{ctx:t}}}),{c(){e=k("p"),n=A("Welcome to Canvas!\n              "),f(s.$$.fragment),r=j(),f(a.$$.fragment),o=j(),f(i.$$.fragment),c=j(),f(l.$$.fragment)},l(t){e=x(t,"P",{});var h=M(e);n=F(h,"Welcome to Canvas!\n              "),m(s.$$.fragment,h),r=T(h),m(a.$$.fragment,h),o=T(h),m(i.$$.fragment,h),c=T(h),m(l.$$.fragment,h),h.forEach(P)},m(t,$){E(t,e,$),L(e,n),g(s,e,null),L(e,r),g(a,e,null),L(e,o),g(i,e,null),L(e,c),g(l,e,null),h=!0},p(t,e){const n={};2&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n);const r={};2&e&&(r.$$scope={dirty:e,ctx:t}),a.$set(r);const o={};2&e&&(o.$$scope={dirty:e,ctx:t}),i.$set(o);const c={};2&e&&(c.$$scope={dirty:e,ctx:t}),l.$set(c)},i(t){h||(v(s.$$.fragment,t),v(a.$$.fragment,t),v(i.$$.fragment,t),v(l.$$.fragment,t),h=!0)},o(t){w(s.$$.fragment,t),w(a.$$.fragment,t),w(i.$$.fragment,t),w(l.$$.fragment,t),h=!1},d(t){t&&P(e),y(s),y(a),y(i),y(l)}}}function xt(t){let e,n;return e=new I({props:{icon:O,align:"end",style:"padding-top: 7px;",$$slots:{default:[kt]},$$scope:{ctx:t}}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},p(t,n){const s={};2&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function Mt(t){let e,n,s,r,a,o;return e=new Z({props:{padding:!0,$$slots:{default:[dt]},$$scope:{ctx:t}}}),s=new Z({props:{padding:!0,noGutter:!0,$$slots:{default:[gt]},$$scope:{ctx:t}}}),a=new Z({props:{padding:!0,noGutterLeft:!0,$$slots:{default:[xt]},$$scope:{ctx:t}}}),{c(){f(e.$$.fragment),n=j(),f(s.$$.fragment),r=j(),f(a.$$.fragment)},l(t){m(e.$$.fragment,t),n=T(t),m(s.$$.fragment,t),r=T(t),m(a.$$.fragment,t)},m(t,i){g(e,t,i),E(t,n,i),g(s,t,i),E(t,r,i),g(a,t,i),o=!0},p(t,n){const r={};3&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r);const o={};3&n&&(o.$$scope={dirty:n,ctx:t}),s.$set(o);const i={};2&n&&(i.$$scope={dirty:n,ctx:t}),a.$set(i)},i(t){o||(v(e.$$.fragment,t),v(s.$$.fragment,t),v(a.$$.fragment,t),o=!0)},o(t){w(e.$$.fragment,t),w(s.$$.fragment,t),w(a.$$.fragment,t),o=!1},d(t){y(e,t),t&&P(n),y(s,t),t&&P(r),y(a,t)}}}function Pt(t){let e,n,s=t[0].name&&t[0].canvas&&t[0].canvas[t[0].name]&&ht(t);return{c(){s&&s.c(),e=S()},l(t){s&&s.l(t),e=S()},m(t,r){s&&s.m(t,r),E(t,e,r),n=!0},p(t,n){t[0].name&&t[0].canvas&&t[0].canvas[t[0].name]?s?(s.p(t,n),1&n&&v(s,1)):(s=ht(t),s.c(),v(s,1),s.m(e.parentNode,e)):s&&(G(),w(s,1,1,(()=>{s=null})),V())},i(t){n||(v(s),n=!0)},o(t){w(s),n=!1},d(t){s&&s.d(t),t&&P(e)}}}function Ct(t){let e,n;return e=new d({props:{company:`⬡ ${Et()} ⬢`,platformName:"canvas",$$slots:{default:[Pt]},$$scope:{ctx:t}}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},p(t,[n]){const s={};3&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function Et(){const t="▦✎".split("");return t[Math.floor(Math.random()*t.length)]}function St(t,e,n){let s;return b(t,et,(t=>n(0,s=t))),[s]}class Gt extends ${constructor(t){super(),u(this,t,St,Ct,p,{})}}function Vt(t){let e;const n=t[0].default,s=J(n,t,t[1],null);return{c(){s&&s.c()},l(t){s&&s.l(t)},m(t,n){s&&s.m(t,n),e=!0},p(t,r){s&&s.p&&(!e||2&r)&&R(s,n,t,t[1],e?r:-1,null,null)},i(t){e||(v(s,t),e=!0)},o(t){w(s,t),e=!1},d(t){s&&s.d(t)}}}function Ht(t){let e,n;return e=new D({props:{$$slots:{default:[Vt]},$$scope:{ctx:t}}}),{c(){f(e.$$.fragment)},l(t){m(e.$$.fragment,t)},m(t,s){g(e,t,s),n=!0},p(t,n){const s={};2&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(v(e.$$.fragment,t),n=!0)},o(t){w(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function Zt(t){let e,n,s,r;return e=new Gt({}),s=new q({props:{style:"background-color: white;",$$slots:{default:[Ht]},$$scope:{ctx:t}}}),{c(){f(e.$$.fragment),n=j(),f(s.$$.fragment)},l(t){m(e.$$.fragment,t),n=T(t),m(s.$$.fragment,t)},m(t,a){g(e,t,a),E(t,n,a),g(s,t,a),r=!0},p(t,[e]){const n={};2&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){r||(v(e.$$.fragment,t),v(s.$$.fragment,t),r=!0)},o(t){w(e.$$.fragment,t),w(s.$$.fragment,t),r=!1},d(t){y(e,t),t&&P(n),y(s,t)}}}function jt(t,e,n){let{$$slots:s={},$$scope:r}=e;var a=this&&this.__awaiter||function(t,e,n,s){return new(n||(n=Promise))((function(r,a){function o(t){try{c(s.next(t))}catch(e){a(e)}}function i(t){try{c(s.throw(t))}catch(e){a(e)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,i)}c((s=s.apply(t,e||[])).next())}))};return z((()=>a(void 0,void 0,void 0,(function*(){const t=new window.channel,e=new it(window.ship,t),n=new ct(window.ship,t),s=new at(e,t);nt(e),st(s),lt.configure(n),lt.start(),s.start()})))),t.$$set=t=>{"$$scope"in t&&n(1,r=t.$$scope)},[s,r]}export default class extends ${constructor(t){super(),u(this,t,jt,Zt,p,{})}}
