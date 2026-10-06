(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,O=1029,k=1030,A=1031,ee=1033,j=33776,te=33777,M=33778,ne=33779,N=35840,re=35841,ie=35842,ae=35843,oe=36196,se=37492,ce=37496,le=37488,P=37489,ue=37490,de=37491,fe=37808,pe=37809,me=37810,he=37811,ge=37812,_e=37813,ve=37814,ye=37815,be=37816,xe=37817,Se=37818,Ce=37819,we=37820,Te=37821,Ee=36492,De=36494,Oe=36495,ke=36283,Ae=36284,je=36285,Me=36286,Ne=2300,F=2301,Pe=2302,Fe=2303,Ie=2400,I=2401,Le=2402,L=3200,Re=`srgb`,ze=`srgb-linear`,Be=`linear`,Ve=`srgb`,He=7680,Ue=35044,We=35048,Ge=2e3;function Ke(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function qe(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Je(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ye(){let e=Je(`canvas`);return e.style.display=`block`,e}var Xe={};function Ze(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Qe(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function R(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function z(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $e(...e){let t=e.join(` `);t in Xe||(Xe[t]=!0,R(...e))}function et(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var tt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},nt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},rt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),it=1234567,at=Math.PI/180,ot=180/Math.PI;function st(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(rt[e&255]+rt[e>>8&255]+rt[e>>16&255]+rt[e>>24&255]+`-`+rt[t&255]+rt[t>>8&255]+`-`+rt[t>>16&15|64]+rt[t>>24&255]+`-`+rt[n&63|128]+rt[n>>8&255]+`-`+rt[n>>16&255]+rt[n>>24&255]+rt[r&255]+rt[r>>8&255]+rt[r>>16&255]+rt[r>>24&255]).toLowerCase()}function B(e,t,n){return Math.max(t,Math.min(n,e))}function ct(e,t){return(e%t+t)%t}function lt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ut(e,t,n){return e===t?0:(n-e)/(t-e)}function dt(e,t,n){return(1-n)*e+n*t}function ft(e,t,n,r){return dt(e,t,1-Math.exp(-n*r))}function pt(e,t=1){return t-Math.abs(ct(e,t*2)-t)}function mt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function ht(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function gt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function _t(e,t){return e+Math.random()*(t-e)}function vt(e){return e*(.5-Math.random())}function yt(e){e!==void 0&&(it=e);let t=it+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function bt(e){return e*at}function xt(e){return e*ot}function St(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ct(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function wt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Tt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:R(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Et(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Dt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Ot={DEG2RAD:at,RAD2DEG:ot,generateUUID:st,clamp:B,euclideanModulo:ct,mapLinear:lt,inverseLerp:ut,lerp:dt,damp:ft,pingpong:pt,smoothstep:mt,smootherstep:ht,randInt:gt,randFloat:_t,randFloatSpread:vt,seededRandom:yt,degToRad:bt,radToDeg:xt,isPowerOfTwo:St,ceilPowerOfTwo:Ct,floorPowerOfTwo:wt,setQuaternionFromProperEuler:Tt,normalize:Dt,denormalize:Et},V=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(B(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},kt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:R(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(B(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this.z=B(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this.z=B(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return At.copy(this).projectOnVector(e),this.sub(At)}reflect(e){return this.sub(At.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(B(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},At=new H,jt=new kt,U=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return $e(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Mt.makeScale(e,t)),this}rotate(e){return $e(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Mt.makeRotation(-e)),this}translate(e,t){return $e(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Mt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Mt=new U,Nt=new U().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pt=new U().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ft(){let e={enabled:!0,workingColorSpace:ze,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Lt(e.r),e.g=Lt(e.g),e.b=Lt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Rt(e.r),e.g=Rt(e.g),e.b=Rt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Be:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return $e(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return $e(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ze]:{primaries:t,whitePoint:r,transfer:Be,toXYZ:Nt,fromXYZ:Pt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:r,transfer:Ve,toXYZ:Nt,fromXYZ:Pt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),e}var It=Ft();function Lt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Rt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var zt,Bt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zt===void 0&&(zt=Je(`canvas`)),zt.width=e.width,zt.height=e.height;let t=zt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=zt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Je(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Lt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Lt(t[e]/255)*255):t[e]=Lt(t[e]);return{data:t,width:e.width,height:e.height}}return R(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Vt=0,Ht=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Vt++}),this.uuid=st(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Ut(r[t].image)):e.push(Ut(r[t]))}else e=Ut(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Ut(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Bt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(R(`Texture: Unable to serialize Texture.`),{})}var Wt=0,Gt=new H,Kt=class r extends nt{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wt++}),this.uuid=st(),this.name=``,this.source=new Ht(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new V(0,0),this.repeat=new V(1,1),this.center=new V(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new U,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Gt).x}get height(){return this.source.getSize(Gt).y}get depth(){return this.source.getSize(Gt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){R(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){R(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Kt.DEFAULT_IMAGE=null,Kt.DEFAULT_MAPPING=300,Kt.DEFAULT_ANISOTROPY=1;var qt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this.z=B(this.z,e.z,t.z),this.w=B(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this.z=B(this.z,e,t),this.w=B(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Jt=class extends nt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new qt(0,0,e,t),this.scissorTest=!1,this.viewport=new qt(0,0,e,t),this.textures=[];let r=new Kt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ht(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Yt=class extends Jt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Xt=class extends Kt{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Zt=class extends Kt{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Qt=class extends Yt{constructor(e=1,t=1,n=1,r={}){super(e,t,r),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Zt(null,e,t,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},W=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/$t.setFromMatrixColumn(e,0).length(),i=1/$t.setFromMatrixColumn(e,1).length(),a=1/$t.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(tn,e,nn)}lookAt(e,t,n){let r=this.elements;return on.subVectors(e,t),on.lengthSq()===0&&(on.z=1),on.normalize(),rn.crossVectors(n,on),rn.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),rn.crossVectors(n,on)),rn.normalize(),an.crossVectors(on,rn),r[0]=rn.x,r[4]=an.x,r[8]=on.x,r[1]=rn.y,r[5]=an.y,r[9]=on.y,r[2]=rn.z,r[6]=an.z,r[10]=on.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],j=r[14],te=r[3],M=r[7],ne=r[11],N=r[15];return i[0]=a*x+o*T+s*k+c*te,i[4]=a*S+o*E+s*A+c*M,i[8]=a*C+o*D+s*ee+c*ne,i[12]=a*w+o*O+s*j+c*N,i[1]=l*x+u*T+d*k+f*te,i[5]=l*S+u*E+d*A+f*M,i[9]=l*C+u*D+d*ee+f*ne,i[13]=l*w+u*O+d*j+f*N,i[2]=p*x+m*T+h*k+g*te,i[6]=p*S+m*E+h*A+g*M,i[10]=p*C+m*D+h*ee+g*ne,i[14]=p*w+m*O+h*j+g*N,i[3]=_*x+v*T+y*k+b*te,i[7]=_*S+v*E+y*A+b*M,i[11]=_*C+v*D+y*ee+b*ne,i[15]=_*w+v*O+y*j+b*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=$t.set(r[0],r[1],r[2]).length(),o=$t.set(r[4],r[5],r[6]).length(),s=$t.set(r[8],r[9],r[10]).length();i<0&&(a=-a),en.copy(this);let c=1/a,l=1/o,u=1/s;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=l,en.elements[5]*=l,en.elements[6]*=l,en.elements[8]*=u,en.elements[9]*=u,en.elements[10]*=u,t.setFromRotationMatrix(en),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},$t=new H,en=new W,tn=new H(0,0,0),nn=new H(1,1,1),rn=new H,an=new H,on=new H,sn=new W,cn=new kt,ln=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(B(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-B(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(B(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-B(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(B(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-B(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:R(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return sn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cn.setFromEuler(this),this.setFromQuaternion(cn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER=`XYZ`;var un=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},dn=0,fn=new H,pn=new kt,mn=new W,hn=new H,gn=new H,_n=new H,vn=new kt,yn=new H(1,0,0),bn=new H(0,1,0),xn=new H(0,0,1),Sn={type:`added`},Cn={type:`removed`},wn={type:`childadded`,child:null},Tn={type:`childremoved`,child:null},En=class e extends nt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dn++}),this.uuid=st(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new ln,r=new kt,i=new H(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new W},normalMatrix:{value:new U}}),this.matrix=new W,this.matrixWorld=new W,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new un,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return pn.setFromAxisAngle(e,t),this.quaternion.multiply(pn),this}rotateOnWorldAxis(e,t){return pn.setFromAxisAngle(e,t),this.quaternion.premultiply(pn),this}rotateX(e){return this.rotateOnAxis(yn,e)}rotateY(e){return this.rotateOnAxis(bn,e)}rotateZ(e){return this.rotateOnAxis(xn,e)}translateOnAxis(e,t){return fn.copy(e).applyQuaternion(this.quaternion),this.position.add(fn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(yn,e)}translateY(e){return this.translateOnAxis(bn,e)}translateZ(e){return this.translateOnAxis(xn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?hn.copy(e):hn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),gn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(gn,hn,this.up):mn.lookAt(hn,gn,this.up),this.quaternion.setFromRotationMatrix(mn),r&&(mn.extractRotation(r.matrixWorld),pn.setFromRotationMatrix(mn),this.quaternion.premultiply(pn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(z(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Sn),wn.child=e,this.dispatchEvent(wn),wn.child=null):z(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Cn),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Sn),wn.child=e,this.dispatchEvent(wn),wn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gn,e,_n),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gn,vn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};En.DEFAULT_UP=new H(0,1,0),En.DEFAULT_MATRIX_AUTO_UPDATE=!0,En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Dn=class extends En{constructor(){super(),this.isGroup=!0,this.type=`Group`}},On={type:`move`},kn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(On)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Dn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},An={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Mn={h:0,s:0,l:0};function Nn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var G=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Re){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,It.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=It.workingColorSpace){return this.r=e,this.g=t,this.b=n,It.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=It.workingColorSpace){if(e=ct(e,1),t=B(t,0,1),n=B(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Nn(i,r,e+1/3),this.g=Nn(i,r,e),this.b=Nn(i,r,e-1/3)}return It.colorSpaceToWorking(this,r),this}setStyle(e,t=Re){function n(t){t!==void 0&&parseFloat(t)<1&&R(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:R(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);R(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Re){let n=An[e.toLowerCase()];return n===void 0?R(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Lt(e.r),this.g=Lt(e.g),this.b=Lt(e.b),this}copyLinearToSRGB(e){return this.r=Rt(e.r),this.g=Rt(e.g),this.b=Rt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Re){return It.workingToColorSpace(Pn.copy(this),e),Math.round(B(Pn.r*255,0,255))*65536+Math.round(B(Pn.g*255,0,255))*256+Math.round(B(Pn.b*255,0,255))}getHexString(e=Re){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=It.workingColorSpace){It.workingToColorSpace(Pn.copy(this),t);let n=Pn.r,r=Pn.g,i=Pn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=It.workingColorSpace){return It.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=Re){It.workingToColorSpace(Pn.copy(this),e);let t=Pn.r,n=Pn.g,r=Pn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Mn);let n=dt(jn.h,Mn.h,t),r=dt(jn.s,Mn.s,t),i=dt(jn.l,Mn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pn=new G;G.NAMES=An;var Fn=class extends En{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},In=new H,Ln=new H,Rn=new H,zn=new H,Bn=new H,Vn=new H,Hn=new H,Un=new H,Wn=new H,Gn=new H,Kn=new qt,qn=new qt,Jn=new qt,Yn=class e{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),In.subVectors(e,t),r.cross(In);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){In.subVectors(r,t),Ln.subVectors(n,t),Rn.subVectors(e,t);let a=In.dot(In),o=In.dot(Ln),s=In.dot(Rn),c=Ln.dot(Ln),l=Ln.dot(Rn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,zn)!==null&&zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,zn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,zn.x),s.addScaledVector(a,zn.y),s.addScaledVector(o,zn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Kn.setScalar(0),qn.setScalar(0),Jn.setScalar(0),Kn.fromBufferAttribute(e,t),qn.fromBufferAttribute(e,n),Jn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Kn,i.x),a.addScaledVector(qn,i.y),a.addScaledVector(Jn,i.z),a}static isFrontFacing(e,t,n,r){return In.subVectors(n,t),Ln.subVectors(e,t),In.cross(Ln).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),In.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Bn.subVectors(r,n),Vn.subVectors(i,n),Un.subVectors(e,n);let s=Bn.dot(Un),c=Vn.dot(Un);if(s<=0&&c<=0)return t.copy(n);Wn.subVectors(e,r);let l=Bn.dot(Wn),u=Vn.dot(Wn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Bn,a);Gn.subVectors(e,i);let f=Bn.dot(Gn),p=Vn.dot(Gn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Vn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Hn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Hn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Bn,a).addScaledVector(Vn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Xn=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Qn):Qn.fromBufferAttribute(r,t),Qn.applyMatrix4(e.matrixWorld),this.expandByPoint(Qn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),$n.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),$n.copy(e.boundingBox)),$n.applyMatrix4(e.matrixWorld),this.union($n)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qn),Qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(or),sr.subVectors(this.max,or),er.subVectors(e.a,or),tr.subVectors(e.b,or),nr.subVectors(e.c,or),rr.subVectors(tr,er),ir.subVectors(nr,tr),ar.subVectors(er,nr);let t=[0,-rr.z,rr.y,0,-ir.z,ir.y,0,-ar.z,ar.y,rr.z,0,-rr.x,ir.z,0,-ir.x,ar.z,0,-ar.x,-rr.y,rr.x,0,-ir.y,ir.x,0,-ar.y,ar.x,0];return!ur(t,er,tr,nr,sr)||(t=[1,0,0,0,1,0,0,0,1],!ur(t,er,tr,nr,sr))?!1:(cr.crossVectors(rr,ir),t=[cr.x,cr.y,cr.z],ur(t,er,tr,nr,sr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Zn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Zn=[new H,new H,new H,new H,new H,new H,new H,new H],Qn=new H,$n=new Xn,er=new H,tr=new H,nr=new H,rr=new H,ir=new H,ar=new H,or=new H,sr=new H,cr=new H,lr=new H;function ur(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){lr.fromArray(e,a);let o=i.x*Math.abs(lr.x)+i.y*Math.abs(lr.y)+i.z*Math.abs(lr.z),s=t.dot(lr),c=n.dot(lr),l=r.dot(lr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var dr=fr();function fr(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function pr(e){Math.abs(e)>65504&&R(`DataUtils.toHalfFloat(): Value out of range.`),e=B(e,-65504,65504),dr.floatView[0]=e;let t=dr.uint32View[0],n=t>>23&511;return dr.baseTable[n]+((t&8388607)>>dr.shiftTable[n])}function mr(e){let t=e>>10;return dr.uint32View[0]=dr.mantissaTable[dr.offsetTable[t]+(e&1023)]+dr.exponentTable[t],dr.floatView[0]}var hr=class{static toHalfFloat(e){return pr(e)}static fromHalfFloat(e){return mr(e)}},gr=new H,_r=new V,vr=0,yr=class extends nt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ue,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix3(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix4(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyNormalMatrix(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.transformDirection(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Et(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Et(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Et(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Et(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Et(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array),i=Dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},br=class extends yr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},xr=class extends yr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},K=class extends yr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Sr=new Xn,Cr=new H,wr=new H,Tr=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Sr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cr.subVectors(e,this.center);let t=Cr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Cr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cr.copy(e.center).add(wr)),this.expandByPoint(Cr.copy(e.center).sub(wr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Er=0,Dr=new W,Or=new En,kr=new H,Ar=new Xn,jr=new Xn,Mr=new H,Nr=class e extends nt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Er++}),this.uuid=st(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ke(e)?xr:br)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new U().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Dr.makeRotationFromQuaternion(e),this.applyMatrix4(Dr),this}rotateX(e){return Dr.makeRotationX(e),this.applyMatrix4(Dr),this}rotateY(e){return Dr.makeRotationY(e),this.applyMatrix4(Dr),this}rotateZ(e){return Dr.makeRotationZ(e),this.applyMatrix4(Dr),this}translate(e,t,n){return Dr.makeTranslation(e,t,n),this.applyMatrix4(Dr),this}scale(e,t,n){return Dr.makeScale(e,t,n),this.applyMatrix4(Dr),this}lookAt(e){return Or.lookAt(e),Or.updateMatrix(),this.applyMatrix4(Or.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(kr).negate(),this.translate(kr.x,kr.y,kr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new K(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&R(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){z(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ar.setFromBufferAttribute(n),this.morphTargetsRelative?(Mr.addVectors(this.boundingBox.min,Ar.min),this.boundingBox.expandByPoint(Mr),Mr.addVectors(this.boundingBox.max,Ar.max),this.boundingBox.expandByPoint(Mr)):(this.boundingBox.expandByPoint(Ar.min),this.boundingBox.expandByPoint(Ar.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&z(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){z(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new H,1/0);return}if(e){let n=this.boundingSphere.center;if(Ar.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Mr.addVectors(Ar.min,jr.min),Ar.expandByPoint(Mr),Mr.addVectors(Ar.max,jr.max),Ar.expandByPoint(Mr)):(Ar.expandByPoint(jr.min),Ar.expandByPoint(jr.max))}Ar.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Mr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Mr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Mr.fromBufferAttribute(a,t),o&&(kr.fromBufferAttribute(e,t),Mr.add(kr)),r=Math.max(r,n.distanceToSquared(Mr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&z(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){z(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new yr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new H,s[e]=new H;let c=new H,l=new H,u=new H,d=new V,f=new V,p=new V,m=new H,h=new H;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new H,y=new H,b=new H,x=new H;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new yr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mr.fromBufferAttribute(e,t),Mr.normalize(),e.setXYZ(t,Mr.x,Mr.y,Mr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new yr(a,r,i)}if(this.index===null)return R(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Pr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Ue,this.updateRanges=[],this.version=0,this.uuid=st()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=st()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=st()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Fr=new H,Ir=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix4(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyNormalMatrix(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.transformDirection(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Et(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Et(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Et(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Et(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Et(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array),i=Dt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Ze(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new yr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ze(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Lr=new H,Rr=new H,zr=new U,Br=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Lr.subVectors(n,t).cross(Rr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Lr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||zr.getNormalMatrix(e),r=this.coplanarPoint(Lr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Vr=0,Hr=class extends nt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vr++}),this.uuid=st(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new G(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=He,this.stencilZFail=He,this.stencilZPass=He,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){R(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){R(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new G().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Br().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new V().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new V().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ur=new H,Wr=new H,Gr=new H,Kr=new H,qr=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ur)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ur.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ur.copy(this.origin).addScaledVector(this.direction,t),Ur.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Wr.copy(e).add(t).multiplyScalar(.5),Gr.copy(t).sub(e).normalize(),Kr.copy(this.origin).sub(Wr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Gr),o=Kr.dot(this.direction),s=-Kr.dot(Gr),c=Kr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Wr).addScaledVector(Gr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ur.subVectors(e.center,this.origin);let n=Ur.dot(this.direction),r=Ur.dot(Ur)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ur)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,ee,j,te;if(y>=b&&y>=x?(w=s,D=u,A=p,te=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,ee=_,j=v):(S=l,C=c,T=f,E=d,O=h,k=m,ee=v,j=_)):b>=x?(w=c,D=d,A=m,te=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,ee=v,j=g):(S=s,C=l,T=u,E=f,O=p,k=h,ee=g,j=v)):(w=l,D=f,A=h,te=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,ee=g,j=_):(S=c,C=s,T=d,E=u,O=m,k=p,ee=_,j=g)),w===0)return null;let M=S/w,ne=C/w,N=1/w,re=T-M*D,ie=E-ne*D,ae=O-M*A,oe=k-ne*A,se=ee-M*te,ce=j-ne*te,le=se*oe-ce*ae,P=re*ce-ie*se,ue=ae*ie-oe*re;if(r){if(le<0||P<0||ue<0)return null}else if((le<0||P<0||ue<0)&&(le>0||P>0||ue>0))return null;let de=le+P+ue;if(de===0)return null;let fe=N*(le*D+P*A+ue*te);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Jr=class extends Hr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Yr=new W,Xr=new qr,Zr=new Tr,Qr=new H,$r=new H,ei=new H,ti=new H,ni=new H,ri=new H,ii=new H,ai=new H,oi=class extends En{constructor(e=new Nr,t=new Jr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ri.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ni.fromBufferAttribute(s,e),a?ri.addScaledVector(ni,r):ri.addScaledVector(ni.sub(t),r))}t.add(ri)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Xr.copy(e.ray).recast(e.near),!(Zr.containsPoint(Xr.origin)===!1&&(Xr.intersectSphere(Zr,Qr)===null||Xr.origin.distanceToSquared(Qr)>(e.far-e.near)**2))&&(Yr.copy(i).invert(),Xr.copy(e.ray).applyMatrix4(Yr),(n.boundingBox===null||Xr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Xr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ci(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ci(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ci(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ci(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function si(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ai.copy(s),ai.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ai);return l<n.near||l>n.far?null:{distance:l,point:ai.clone(),object:e}}function ci(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,$r),e.getVertexPosition(c,ei),e.getVertexPosition(l,ti);let u=si(e,t,n,r,$r,ei,ti,ii);if(u){let e=new H;Yn.getBarycoord(ii,$r,ei,ti,e),i&&(u.uv=Yn.getInterpolatedAttribute(i,s,c,l,e,new V)),a&&(u.uv1=Yn.getInterpolatedAttribute(a,s,c,l,e,new V)),o&&(u.normal=Yn.getInterpolatedAttribute(o,s,c,l,e,new H),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new H,materialIndex:0};Yn.getNormal($r,ei,ti,t.normal),u.face=t,u.barycoord=e}return u}var li=class extends Kt{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ui=class extends yr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},di=new W,fi=new W,pi=[],mi=new Xn,hi=new W,gi=new oi,_i=new Tr,vi=class extends oi{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,hi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Xn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,di),mi.copy(e.boundingBox).applyMatrix4(di),this.boundingBox.union(mi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Tr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,di),_i.copy(e.boundingSphere).applyMatrix4(di),this.boundingSphere.union(_i)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(gi.geometry=this.geometry,gi.material=this.material,gi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_i.copy(this.boundingSphere),_i.applyMatrix4(n),e.ray.intersectsSphere(_i)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,di),fi.multiplyMatrices(n,di),gi.matrixWorld=fi,gi.raycast(e,pi);for(let e=0,n=pi.length;e<n;e++){let n=pi[e];n.instanceId=i,n.object=this,t.push(n)}pi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ui(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new li(new Float32Array(r*this.count),r,this.count,D,h));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},yi=new Tr,bi=new V(.5,.5),xi=new H,Si=class{constructor(e=new Br,t=new Br,n=new Br,r=new Br,i=new Br,a=new Br){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ge,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(yi)}intersectsSprite(e){return yi.center.set(0,0,0),yi.radius=.7071067811865476+bi.distanceTo(e.center),yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(yi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(xi.x=r.normal.x>0?e.max.x:e.min.x,xi.y=r.normal.y>0?e.max.y:e.min.y,xi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(xi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ci=class extends Hr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new G(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},wi=new H,Ti=new H,Ei=new W,Di=new qr,Oi=new Tr,ki=new H,Ai=new H,ji=class extends En{constructor(e=new Nr,t=new Ci){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)wi.fromBufferAttribute(t,e-1),Ti.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=wi.distanceTo(Ti);e.setAttribute(`lineDistance`,new K(n,1))}else R(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oi.copy(n.boundingSphere),Oi.applyMatrix4(r),Oi.radius+=i,e.ray.intersectsSphere(Oi)===!1)return;Ei.copy(r).invert(),Di.copy(e.ray).applyMatrix4(Ei);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Mi(this,e,Di,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Mi(this,e,Di,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Mi(this,e,Di,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Mi(this,e,Di,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Mi(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(wi.fromBufferAttribute(s,i),Ti.fromBufferAttribute(s,a),n.distanceSqToSegment(wi,Ti,ki,Ai)>r)return;ki.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(ki);if(!(c<t.near||c>t.far))return{distance:c,point:Ai.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Ni=new H,Pi=new H,Fi=class extends ji{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Ni.fromBufferAttribute(t,e),Pi.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Ni.distanceTo(Pi);e.setAttribute(`lineDistance`,new K(n,1))}else R(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Ii=class extends Hr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new G(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Li=new W,Ri=new qr,zi=new Tr,Bi=new H,Vi=class extends En{constructor(e=new Nr,t=new Ii){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zi.copy(n.boundingSphere),zi.applyMatrix4(r),zi.radius+=i,e.ray.intersectsSphere(zi)===!1)return;Li.copy(r).invert(),Ri.copy(e.ray).applyMatrix4(Li);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Bi.fromBufferAttribute(l,n),Hi(Bi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Bi.fromBufferAttribute(l,a),Hi(Bi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Hi(e,t,n,r,i,a,o){let s=Ri.distanceSqToPoint(e);if(s<n){let n=new H;Ri.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ui=class extends Kt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Wi=class extends Kt{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ht(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Gi=class extends Wi{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ki=class extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},qi=class e extends Nr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new K(c,3)),this.setAttribute(`normal`,new K(l,3)),this.setAttribute(`uv`,new K(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new H;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ji=class e extends Nr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new K(u,3)),this.setAttribute(`normal`,new K(d,3)),this.setAttribute(`uv`,new K(f,2));function _(){let a=new H,_=new H,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new V,m=new H,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Yi=class e extends Ji{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Xi=class e extends Nr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new K(i,3)),this.setAttribute(`normal`,new K(i.slice(),3)),this.setAttribute(`uv`,new K(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new H,r=new H,i=new H;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new H;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new H;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new H,t=new H,n=new H,r=new H,o=new V,s=new V,c=new V;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Zi=class e extends Xi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Qi=class e extends Xi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},$i=class e extends Nr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new K(p,3)),this.setAttribute(`normal`,new K(m,3)),this.setAttribute(`uv`,new K(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ea=class e extends Nr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new H,d=new H,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new K(p,3)),this.setAttribute(`normal`,new K(m,3)),this.setAttribute(`uv`,new K(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function ta(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ra(i))i.isRenderTargetTexture?(R(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ra(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function na(e){let t={};for(let n=0;n<e.length;n++){let r=ta(e[n]);for(let e in r)t[e]=r[e]}return t}function ra(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ia(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function aa(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:It.workingColorSpace}var oa={clone:ta,merge:na},sa=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ca=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,la=class extends Hr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sa,this.fragmentShader=ca,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ta(e.uniforms),this.uniformsGroups=ia(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new G().setHex(r.value);break;case`v2`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new qt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new U().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new W().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ua=class extends la{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},da=class extends Hr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new G(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},fa=class extends Hr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=L,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pa=class extends Hr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ma(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function ha(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ga=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},_a=class extends ga{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ie,endingEnd:Ie}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case I:i=e,o=2*t-n;break;case Le:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case I:a=e,s=2*n-t;break;case Le:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},va=class extends ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},ya=class extends ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},ba=class extends ga{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Ca(n,t,g,y,r);i[p]=xa(x,o,_,b,m)}return i}};function xa(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Sa(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Ca(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=xa(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Sa(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var wa=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ma(t,this.TimeBufferType),this.values=ma(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ma(e.times,Array),values:ma(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),ha(e.settings)&&(n.settings={inTangents:ma(e.settings.inTangents,Array),outTangents:ma(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new _a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ba(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ne:t=this.InterpolantFactoryMethodDiscrete;break;case F:t=this.InterpolantFactoryMethodLinear;break;case Pe:t=this.InterpolantFactoryMethodSmooth;break;case Fe:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return R(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ne;case this.InterpolantFactoryMethodLinear:return F;case this.InterpolantFactoryMethodSmooth:return Pe;case this.InterpolantFactoryMethodBezier:return Fe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;ha(this.settings)&&(Ta(this.settings.inTangents,e),Ta(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(z(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(z(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){z(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){z(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&qe(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){z(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Pe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,ha(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ta(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}wa.prototype.ValueTypeName=``,wa.prototype.TimeBufferType=Float32Array,wa.prototype.ValueBufferType=Float32Array,wa.prototype.DefaultInterpolation=F;var Ea=class extends wa{constructor(e,t,n){super(e,t,n)}};Ea.prototype.ValueTypeName=`bool`,Ea.prototype.ValueBufferType=Array,Ea.prototype.DefaultInterpolation=Ne,Ea.prototype.InterpolantFactoryMethodLinear=void 0,Ea.prototype.InterpolantFactoryMethodSmooth=void 0;var Da=class extends wa{constructor(e,t,n,r){super(e,t,n,r)}};Da.prototype.ValueTypeName=`color`;var Oa=class extends wa{constructor(e,t,n,r){super(e,t,n,r)}};Oa.prototype.ValueTypeName=`number`;var ka=class extends ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)kt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Aa=class extends wa{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ka(this.times,this.values,this.getValueSize(),e)}};Aa.prototype.ValueTypeName=`quaternion`,Aa.prototype.InterpolantFactoryMethodSmooth=void 0;var ja=class extends wa{constructor(e,t,n){super(e,t,n)}};ja.prototype.ValueTypeName=`string`,ja.prototype.ValueBufferType=Array,ja.prototype.DefaultInterpolation=Ne,ja.prototype.InterpolantFactoryMethodLinear=void 0,ja.prototype.InterpolantFactoryMethodSmooth=void 0;var Ma=class extends wa{constructor(e,t,n,r){super(e,t,n,r)}};Ma.prototype.ValueTypeName=`vector`;var Na=class extends En{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new G(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Pa=new W,Fa=new H,Ia=new H,La=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new V(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new W,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Si,this._frameExtents=new V(1,1),this._viewportCount=1,this._viewports=[new qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Fa.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fa),Ia.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ia),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Pa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Pa,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Pa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ra=new H,za=new kt,Ba=new H,Va=class extends En{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new W,this.projectionMatrix=new W,this.projectionMatrixInverse=new W,this.coordinateSystem=Ge,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ra,za,Ba),Ba.x===1&&Ba.y===1&&Ba.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,za,Ba.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ra,za,Ba),Ba.x===1&&Ba.y===1&&Ba.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,za,Ba.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ha=new H,Ua=new V,Wa=new V,Ga=class extends Va{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ot*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(at*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ot*2*Math.atan(Math.tan(at*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ha.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ha.x,Ha.y).multiplyScalar(-e/Ha.z),Ha.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ha.x,Ha.y).multiplyScalar(-e/Ha.z)}getViewSize(e,t){return this.getViewBounds(e,Ua,Wa),t.subVectors(Wa,Ua)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(at*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ka=class extends Va{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},qa=class extends Nr{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Ja=-90,Ya=1,Xa=class extends En{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ga(Ja,Ya,e,t);r.layers=this.layers,this.add(r);let i=new Ga(Ja,Ya,e,t);i.layers=this.layers,this.add(i);let a=new Ga(Ja,Ya,e,t);a.layers=this.layers,this.add(a);let o=new Ga(Ja,Ya,e,t);o.layers=this.layers,this.add(o);let s=new Ga(Ja,Ya,e,t);s.layers=this.layers,this.add(s);let c=new Ga(Ja,Ya,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Za=class extends Ga{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Qa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=$a.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function $a(){this._document.hidden===!1&&this.reset()}var eo=`\\[\\]\\.:\\/`,to=RegExp(`[\\[\\]\\.:\\/]`,`g`),no=`[^\\[\\]\\.:\\/]`,ro=`[^`+eo.replace(`\\.`,``)+`]`,io=`((?:WC+[\\/:])*)`.replace(`WC`,no),ao=`(WCOD+)?`.replace(`WCOD`,ro),oo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,no),so=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,no),co=RegExp(`^`+io+ao+oo+so+`$`),lo=[`material`,`materials`,`bones`,`map`],uo=class{constructor(e,t,n){let r=n||fo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},fo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(to,``)}static parseTrackName(e){let t=co.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);lo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){R(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){z(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){z(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){z(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){z(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){z(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;z(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fo.Composite=uo,fo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},fo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},fo.prototype.GetterByBindingType=[fo.prototype._getValue_direct,fo.prototype._getValue_array,fo.prototype._getValue_arrayElement,fo.prototype._getValue_toArray],fo.prototype.SetterByBindingTypeAndVersioning=[[fo.prototype._setValue_direct,fo.prototype._setValue_direct_setNeedsUpdate,fo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fo.prototype._setValue_array,fo.prototype._setValue_array_setNeedsUpdate,fo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fo.prototype._setValue_arrayElement,fo.prototype._setValue_arrayElement_setNeedsUpdate,fo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fo.prototype._setValue_fromArray,fo.prototype._setValue_fromArray_setNeedsUpdate,fo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var po=class extends Pr{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function mo(e,t,n,r){let i=ho(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case O:return e*t/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case ee:return e*t*4/i.components*i.byteLength;case j:case te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case M:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case re:case ae:return Math.max(e,16)*Math.max(t,8)/4;case N:case ie:return Math.max(e,8)*Math.max(t,8)/2;case oe:case se:case le:case P:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ce:case ue:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ge:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Te:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ee:case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*8;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ho(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?R(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function go(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function _o(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},J={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new U}},envmap:{envMap:{value:null},envMapRotation:{value:new U},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new U}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new U}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new U},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new U},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new U},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new U}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new U}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new U}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0},uvTransform:{value:new U}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}}},vo={basic:{uniforms:na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:q.meshbasic_vert,fragmentShader:q.meshbasic_frag},lambert:{uniforms:na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)},envMapIntensity:{value:1}}]),vertexShader:q.meshlambert_vert,fragmentShader:q.meshlambert_frag},phong:{uniforms:na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:q.meshphong_vert,fragmentShader:q.meshphong_frag},standard:{uniforms:na([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag},toon:{uniforms:na([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new G(0)}}]),vertexShader:q.meshtoon_vert,fragmentShader:q.meshtoon_frag},matcap:{uniforms:na([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:q.meshmatcap_vert,fragmentShader:q.meshmatcap_frag},points:{uniforms:na([J.points,J.fog]),vertexShader:q.points_vert,fragmentShader:q.points_frag},dashed:{uniforms:na([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:q.linedashed_vert,fragmentShader:q.linedashed_frag},depth:{uniforms:na([J.common,J.displacementmap]),vertexShader:q.depth_vert,fragmentShader:q.depth_frag},normal:{uniforms:na([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:q.meshnormal_vert,fragmentShader:q.meshnormal_frag},sprite:{uniforms:na([J.sprite,J.fog]),vertexShader:q.sprite_vert,fragmentShader:q.sprite_frag},background:{uniforms:{uvTransform:{value:new U},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:q.background_vert,fragmentShader:q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new U}},vertexShader:q.backgroundCube_vert,fragmentShader:q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:q.cube_vert,fragmentShader:q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:q.equirect_vert,fragmentShader:q.equirect_frag},distance:{uniforms:na([J.common,J.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:q.distance_vert,fragmentShader:q.distance_frag},shadow:{uniforms:na([J.lights,J.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:q.shadow_vert,fragmentShader:q.shadow_frag}};vo.physical={uniforms:na([vo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new U},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new U},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new U},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new U},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new U},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new U},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new U},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new U},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new U},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new U},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new U},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new U}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag};var yo={r:0,b:0,g:0},bo=new W,xo=new U;xo.set(-1,0,0,0,1,0,0,0,1);function So(e,t,n,r,i,a){let o=new G(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new oi(new qi(1,1,1),new la({name:`BackgroundCubeMaterial`,uniforms:ta(vo.backgroundCube.uniforms),vertexShader:vo.backgroundCube.vertexShader,fragmentShader:vo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(bo.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(xo),l.material.toneMapped=It.getTransfer(i.colorSpace)!==Ve,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new oi(new $i(2,2),new la({name:`BackgroundMaterial`,uniforms:ta(vo.background.uniforms),vertexShader:vo.background.vertexShader,fragmentShader:vo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=It.getTransfer(i.colorSpace)!==Ve,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(yo,aa(e)),n.buffers.color.setClear(yo.r,yo.g,yo.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Co(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function wo(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function To(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(R(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&R(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Eo(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Br,s=new U,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Do=4,Oo=6,ko=20,Ao=256,jo=new Ka,Mo=new G,No=null,Po=0,Fo=0,Io=!1,Lo=new H,Ro=new H,zo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Lo}=i;No=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),Io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ko(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Go(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(No,Po,Fo),this._renderer.xr.enabled=Io,e.scissorTest=!1,Ho(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),No=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),Io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:ze,depthBuffer:!1},r=Vo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vo(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Bo(r)),this._blurMaterial=Wo(r,e,t),this._ggxMaterial=Uo(r,e,t)}return r}_compileMaterial(e){let t=new oi(new Nr,e);this._renderer.compile(t,jo)}_sceneToCubeUV(e,t,n,r,i){let a=new Ga(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Mo),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new oi(new qi,new Jr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Mo),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Ho(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ko()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Go());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Ho(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,jo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Do?n-d+Do:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Ho(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,jo),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Ho(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,jo)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Ho(t,3*l*(r>this._lodMax-Do?r-this._lodMax+Do:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,jo)}};function Bo(e){let t=[],n=[],r=e,i=e-Do+1+Oo;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Ro.set(1,r,n):e===1?Ro.set(-n,1,-r):e===2?Ro.set(-n,r,1):e===3?Ro.set(-1,r,-n):e===4?Ro.set(-n,-1,r):Ro.set(n,r,-1),Ro.toArray(l,(e*6+t)*3)}}let u=new Nr;u.setAttribute(`position`,new yr(c,3)),u.setAttribute(`outputDirection`,new yr(l,3)),n.push(new oi(u,null)),r>Do&&r--}return{lodMeshes:n,sizeLods:t}}function Vo(e,t,n){let r=new Yt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Ho(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Uo(e,t,n){return new la({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ao,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:qo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Wo(e,t,n){return new la({name:`SphericalGaussianBlur`,defines:{SAMPLES:ko,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:qo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Go(){return new la({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ko(){return new la({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function qo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Jo=class extends Yt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ui(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new qi(5,5,5),i=new la({name:`CubemapFromEquirect`,uniforms:ta(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new oi(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new Xa(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Yo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Jo(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new zo(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new zo(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Xo(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&$e(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Zo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?xr:br)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Qo(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function $o(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:z(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function es(e,t,n){let r=new WeakMap,i=new qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new Xt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new V(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function ts(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var ns={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function rs(e,t,n,r,i,a){let o=new Yt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Nr;l.setAttribute(`position`,new K([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new K([0,2,0,0,2,0],2));let u=new ua({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new oi(l,u),f=new Ka(-1,1,1,-1,0,1),p=null,m=null,h=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Yt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new Yt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},It.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=ns[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(d,f),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var is=new Kt,as=new Wi(1,1),os=new Xt,ss=new Zt,cs=new Ui,ls=[],us=[],ds=new Float32Array(16),fs=new Float32Array(9),ps=new Float32Array(4);function ms(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=ls[i];if(a===void 0&&(a=new Float32Array(i),ls[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function hs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function gs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function _s(e,t){let n=us[t];n===void 0&&(n=new Int32Array(t),us[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function vs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(hs(n,t))return;e.uniform2fv(this.addr,t),gs(n,t)}}function bs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(hs(n,t))return;e.uniform3fv(this.addr,t),gs(n,t)}}function xs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(hs(n,t))return;e.uniform4fv(this.addr,t),gs(n,t)}}function Ss(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(hs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),gs(n,t)}else{if(hs(n,r))return;ps.set(r),e.uniformMatrix2fv(this.addr,!1,ps),gs(n,r)}}function Cs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(hs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),gs(n,t)}else{if(hs(n,r))return;fs.set(r),e.uniformMatrix3fv(this.addr,!1,fs),gs(n,r)}}function ws(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(hs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),gs(n,t)}else{if(hs(n,r))return;ds.set(r),e.uniformMatrix4fv(this.addr,!1,ds),gs(n,r)}}function Ts(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Es(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(hs(n,t))return;e.uniform2iv(this.addr,t),gs(n,t)}}function Ds(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(hs(n,t))return;e.uniform3iv(this.addr,t),gs(n,t)}}function Os(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(hs(n,t))return;e.uniform4iv(this.addr,t),gs(n,t)}}function ks(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function As(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(hs(n,t))return;e.uniform2uiv(this.addr,t),gs(n,t)}}function js(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(hs(n,t))return;e.uniform3uiv(this.addr,t),gs(n,t)}}function Ms(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(hs(n,t))return;e.uniform4uiv(this.addr,t),gs(n,t)}}function Ns(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(as.compareFunction=n.isReversedDepthBuffer()?518:515,a=as):a=is,n.setTexture2D(t||a,i)}function Ps(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||ss,i)}function Fs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||cs,i)}function Is(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||os,i)}function Ls(e){switch(e){case 5126:return vs;case 35664:return ys;case 35665:return bs;case 35666:return xs;case 35674:return Ss;case 35675:return Cs;case 35676:return ws;case 5124:case 35670:return Ts;case 35667:case 35671:return Es;case 35668:case 35672:return Ds;case 35669:case 35673:return Os;case 5125:return ks;case 36294:return As;case 36295:return js;case 36296:return Ms;case 35678:case 36198:case 36298:case 36306:case 35682:return Ns;case 35679:case 36299:case 36307:return Ps;case 35680:case 36300:case 36308:case 36293:return Fs;case 36289:case 36303:case 36311:case 36292:return Is}}function Rs(e,t){e.uniform1fv(this.addr,t)}function zs(e,t){let n=ms(t,this.size,2);e.uniform2fv(this.addr,n)}function Bs(e,t){let n=ms(t,this.size,3);e.uniform3fv(this.addr,n)}function Vs(e,t){let n=ms(t,this.size,4);e.uniform4fv(this.addr,n)}function Hs(e,t){let n=ms(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Us(e,t){let n=ms(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Ws(e,t){let n=ms(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Gs(e,t){e.uniform1iv(this.addr,t)}function Ks(e,t){e.uniform2iv(this.addr,t)}function qs(e,t){e.uniform3iv(this.addr,t)}function Js(e,t){e.uniform4iv(this.addr,t)}function Ys(e,t){e.uniform1uiv(this.addr,t)}function Xs(e,t){e.uniform2uiv(this.addr,t)}function Zs(e,t){e.uniform3uiv(this.addr,t)}function Qs(e,t){e.uniform4uiv(this.addr,t)}function $s(e,t,n){let r=this.cache,i=t.length,a=_s(n,i);hs(r,a)||(e.uniform1iv(this.addr,a),gs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?as:is;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ec(e,t,n){let r=this.cache,i=t.length,a=_s(n,i);hs(r,a)||(e.uniform1iv(this.addr,a),gs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||ss,a[e])}function tc(e,t,n){let r=this.cache,i=t.length,a=_s(n,i);hs(r,a)||(e.uniform1iv(this.addr,a),gs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||cs,a[e])}function nc(e,t,n){let r=this.cache,i=t.length,a=_s(n,i);hs(r,a)||(e.uniform1iv(this.addr,a),gs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||os,a[e])}function rc(e){switch(e){case 5126:return Rs;case 35664:return zs;case 35665:return Bs;case 35666:return Vs;case 35674:return Hs;case 35675:return Us;case 35676:return Ws;case 5124:case 35670:return Gs;case 35667:case 35671:return Ks;case 35668:case 35672:return qs;case 35669:case 35673:return Js;case 5125:return Ys;case 36294:return Xs;case 36295:return Zs;case 36296:return Qs;case 35678:case 36198:case 36298:case 36306:case 35682:return $s;case 35679:case 36299:case 36307:return ec;case 35680:case 36300:case 36308:case 36293:return tc;case 36289:case 36303:case 36311:case 36292:return nc}}var ic=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ls(t.type)}},ac=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=rc(t.type)}},oc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},sc=/(\w+)(\])?(\[|\.)?/g;function cc(e,t){e.seq.push(t),e.map[t.id]=t}function lc(e,t,n){let r=e.name,i=r.length;for(sc.lastIndex=0;;){let a=sc.exec(r),o=sc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){cc(n,l===void 0?new ic(s,e,t):new ac(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new oc(s),cc(n,e)),n=e}}}var uc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);lc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function dc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var fc=37297,pc=0;function mc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var hc=new U;function gc(e){It._getMatrix(hc,It.workingColorSpace,e);let t=`mat3( ${hc.elements.map(e=>e.toFixed(4))} )`;switch(It.getTransfer(e)){case Be:return[t,`LinearTransferOETF`];case Ve:return[t,`sRGBTransferOETF`];default:return R(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function _c(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+mc(e.getShaderSource(t),r)}return i}function vc(e,t){let n=gc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var yc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function bc(e,t){let n=yc[t];return n===void 0?(R(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var xc=new H;function Sc(){return It.getLuminanceCoefficients(xc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${xc.x.toFixed(4)}, ${xc.y.toFixed(4)}, ${xc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Cc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ec).join(`
`)}function wc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Tc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ec(e){return e!==``}function Dc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Oc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var kc=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ac(e){return e.replace(kc,Mc)}var jc=new Map;function Mc(e,t){let n=q[t];if(n===void 0){let e=jc.get(t);if(e!==void 0)n=q[e],R(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Ac(n)}var Nc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pc(e){return e.replace(Nc,Fc)}function Fc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Ic(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Lc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Rc(e){return Lc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var zc={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Bc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:zc[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Vc={302:`ENVMAP_MODE_REFRACTION`};function Hc(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Vc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Uc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Wc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Uc[e.combine]||`ENVMAP_BLENDING_NONE`}function Gc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Kc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Rc(n),l=Bc(n),u=Hc(n),d=Wc(n),f=Gc(n),p=Cc(n),m=wc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ec).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ec).join(`
`),_.length>0&&(_+=`
`)):(g=[Ic(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ec).join(`
`),_=[Ic(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:q.tonemapping_pars_fragment,n.toneMapping===0?``:bc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,q.colorspace_pars_fragment,vc(`linearToOutputTexel`,n.outputColorSpace),Sc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ec).join(`
`)),o=Ac(o),o=Dc(o,n),o=Oc(o,n),s=Ac(s),s=Dc(s,n),s=Oc(s,n),o=Pc(o),s=Pc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=dc(i,i.VERTEX_SHADER,y),S=dc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=_c(i,x,`vertex`),n=_c(i,S,`fragment`);z(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):R(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new uc(i,h),T=Tc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,fc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=pc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var qc=0,Jc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Yc(e),t.set(e,n)),n}},Yc=class{constructor(e){this.id=qc++,this.code=e,this.usedTimes=0}};function Xc(e){return e===1030||e===37490||e===36285}function Zc(e,t,n,r,i,a){let o=new un,s=new Jc,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&R(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=vo[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let ee=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),te=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.dispersion>0,me=i.retroreflectivity>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=de&&!!i.anisotropyMap,ye=fe&&!!i.clearcoatMap,be=fe&&!!i.clearcoatNormalMap,xe=fe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,we=ge&&!!i.sheenColorMap,Te=ge&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,ke=_e&&!!i.transmissionMap,Ae=_e&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,F=!!i.alphaHash,Pe=!!i.extensions,Fe=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:te,instancingColor:te&&h.instanceColor!==null,instancingMorph:te&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:It.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&Xc(i.normalMap.format),metalnessMap:P,roughnessMap:ue,anisotropy:de,anisotropyMap:ve,clearcoat:fe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:pe,retroreflection:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:_e,transmissionMap:ke,thicknessMap:Ae,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:F,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:ke&&m(i.transmissionMap.channel),thicknessMapUv:Ae&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&It.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&It.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Pe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=vo[t];n=oa.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Kc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Qc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function $c(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function el(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function tl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||$c),r.length>1&&r.sort(t||el),i.length>1&&i.sort(t||el)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function nl(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new tl,e.set(t,[i])):n>=r.length?(i=new tl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function rl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new H,color:new G};break;case`SpotLight`:n={position:new H,direction:new H,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new H,color:new G,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new H,skyColor:new G,groundColor:new G};break;case`RectAreaLight`:n={color:new G,position:new H,halfWidth:new H,halfHeight:new H}}return e[t.id]=n,n}}}function il(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var al=0;function ol(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function sl(e){let t=new rl,n=il(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new H);let i=new H,a=new W,o=new W;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(ol);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=J.LTC_FLOAT_1,r.rectAreaLTC2=J.LTC_FLOAT_2):(r.rectAreaLTC1=J.LTC_HALF_1,r.rectAreaLTC2=J.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=al++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function cl(e){let t=new sl(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function ll(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new cl(e),t.set(n,[a])):r>=i.length?(a=new cl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var ul=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,fl=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],pl=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],ml=new W,hl=new H,gl=new H;function _l(e,t,n){let i=new Si,a=new V,s=new V,c=new qt,l=new fa,u=new pa,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new la({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:ul,fragmentShader:dl}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new Nr;y.setAttribute(`position`,new yr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new oi(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(R(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){R(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){R(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Yt(a.x,a.y,{format:k,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Wi(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new Jo(a.x),p.map.depthTexture=new Gi(a.x,m)):(p.map=new Yt(a.x,a.y),p.map.depthTexture=new Wi(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==a.x||p.map.height!==a.y)&&p.map.setSize(a.x,a.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);for(let t=0;t<x;t++){let r=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),hl.setFromMatrixPosition(d.matrixWorld),e.position.copy(hl),gl.copy(e.position),gl.add(fl[t]),e.up.copy(pl[t]),e.lookAt(gl),e.updateMatrixWorld(),n.makeTranslation(-hl.x,-hl.y,-hl.z),ml.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(ml,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}i=p.getFrustum(t),E(n,l,r,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null?n.mapPass=new Yt(a.x,a.y,{format:k,type:g}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value.set(n.map.width,n.map.height),_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value.set(n.map.width,n.map.height),v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function vl(e,t){function n(){let t=!1,n=new qt,r=null,i=new qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=tt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=M>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new qt().fromArray(ie),se=new qt().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),P(e.CULL_FACE),ge(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ue(e.BLEND),g=!1);return}if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:z(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:z(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:z(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:z(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(P(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function be(t){t!==k&&(te&&e.lineWidth(t),k=t)}function xe(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?P(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+j-1),N!==t&&(e.activeTexture(t),N=t)}function we(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+j-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function De(){try{e.compressedTexImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Oe(){try{e.texSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function ke(){try{e.texSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function F(){try{e.texImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Fe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ie(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function I(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Le(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function L(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Re(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function ze(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:De,texImage2D:F,texImage3D:Pe,pixelStorei:Ie,getParameter:Fe,updateUBOMapping:L,uniformBlockBinding:Re,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Oe,texSubImage3D:ke,compressedTexSubImage2D:Ae,compressedTexSubImage3D:je,scissor:I,viewport:Le,reset:ze}}function yl(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new V,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Je(`canvas`)}function T(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),R(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&R(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function D(e){return e.generateMipmaps}function O(e){l.generateMipmap(e)}function k(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function A(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];R(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||R(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?Be:It.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function ee(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,R(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function j(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),re(t)}function ne(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&N(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function N(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function re(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let ie=0;function ae(){ie=0}function oe(){return ie}function se(e){ie=e}function ce(){let e=ie;return e>=p.maxTextures&&R(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function le(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(e,t){let n=f.get(e);if(e.isVideoTexture&&F(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)R(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)R(`WebGLRenderer: Texture marked for update but image is incomplete`);else{be(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function ue(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){be(n,e,t);return}e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t)}function de(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){be(n,e,t);return}d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function fe(e,t){let n=f.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version){xe(n,e,t);return}d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let pe={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},me={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},he={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function ge(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&R(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,pe[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,pe[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,pe[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,me[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,me[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,he[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function _e(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,te));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=le(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&N(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ye(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=ve(r.start,t.width,4),c=ve(n.start,t.width,4);r.start<=o+1&&s===c&&ve(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function be(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=_e(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=It.getPrimaries(It.workingColorSpace),n=t.colorSpace===``?null:It.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=Pe(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=A(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);ge(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=j(t,e);if(t.isDepthTexture)u=ee(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&ye(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=mo(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data);t.layerUpdates.size>0&&t.clearLayerUpdates()}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=mo(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=Fe(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=Fe(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&O(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function xe(e,t,n){if(t.image.length!==6)return;let r=_e(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=It.getPrimaries(It.workingColorSpace),o=t.colorSpace===``?null:It.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Pe(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=A(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=j(t,h);ge(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=Fe(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&O(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function Se(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=A(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Me(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ce(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=ee(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=A(i.internalFormat,a,o,i.normalized,i.colorSpace);Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function we(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,te)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else P(t.depthTexture,0);let a=i.__webglTexture,o=Me(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)we(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?we(t.__webglFramebuffer[0],e,0):we(t.__webglFramebuffer,e,0)}}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Ce(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Ce(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ee(e,t,n){let r=f.get(e);t!==void 0&&Se(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&Te(e)}function De(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,M);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&Ne(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=A(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Me(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Ce(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)Se(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&O(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),ge(o,r),Se(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&O(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),ge(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else Se(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&O(i),d.unbindTexture()}e.depthBuffer&&Te(e)}function Oe(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=k(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),O(t),d.unbindTexture()}}}let ke=[],Ae=[];function je(e){if(e.samples>0){if(Ne(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(ke.length=0,Ae.length=0,ke.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&(ke.push(a),Ae.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,Ae)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,ke))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Me(e){return Math.min(p.maxSamples,e.samples)}function Ne(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function F(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(It.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&R(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):z(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ce,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=se,this.setTexture2D=P,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ee,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function bl(e,t){function n(n,r=``){let i,a=It.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var xl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Cl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ki(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new la({vertexShader:xl,fragmentShader:Sl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new oi(new $i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},wl=class extends nt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Cl,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],O=new V,k=null,A=null,ee=new Ga;ee.viewport=new qt;let j=new Ga;j.viewport=new qt;let te=[ee,j],M=new Za,ne=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new kn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new kn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new kn,C[e]=t),t.getHandSpace()};function re(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}ne=null,N=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),A!==null){let e=A.camera;e.fov=A.fov,e.zoom=A.zoom,e.updateProjectionMatrix(),A=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),b.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Yt(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new Wi(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Yt(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new H,se=new H;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),M.near=j.near=ee.near=t,M.far=j.far=ee.far=n,(ne!==M.near||N!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),ne=M.near,N=M.far),M.layers.mask=e.layers.mask|6,ee.layers.mask=M.layers.mask&-5,j.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;le(M,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(M,ee,j):M.projectionMatrix.copy(ee.projectionMatrix),A===null&&e.isPerspectiveCamera&&(A={camera:e,fov:e.fov,zoom:e.zoom}),P(e,M,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ot*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let ue=null;function de(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=te[n];o===void 0&&(o=new Ga,o.layers.enable(n),o.viewport=new qt,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new Ki,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let fe=new go;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},Tl=new W,El=new U;El.set(-1,0,0,0,1,0,0,0,1);function Dl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,aa(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Tl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(El),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ol(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return z(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?R(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):R(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var kl=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Al=null;function jl(){return Al===null&&(Al=new li(kl,16,16,k,g),Al.name=`DFG_LUT`,Al.minFilter=o,Al.magFilter=o,Al.wrapS=t,Al.wrapT=t,Al.generateMipmaps=!1,Al.needsUpdate=!0),Al}var Ml=class{constructor(e={}){let{canvas:t=Ye(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([ee,A,O]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new H,k=null,j=null,te=[],M=[],ne=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,re=!1,ie=null,ae=null,oe=null,se=null;this._outputColorSpace=Re;let ce=0,le=0,P=null,ue=-1,de=null,fe=new qt,pe=new qt,me=null,he=new G(0),ge=0,_e=t.width,ve=t.height,ye=1,be=null,xe=null,Se=new qt(0,0,_e,ve),Ce=new qt(0,0,_e,ve),we=!1,Te=new Si,Ee=!1,De=!1,Oe=new W,ke=new H,Ae=new qt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?ye:1}let F=n;function Pe(e,n){return t.getContext(e,n)}let Fe,Ie,I,Le,L,ze,Be,Ve,He,Ue,We,Ke,qe,Je,Xe,Qe,$e,tt,nt,rt,it,at,ot;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,ct,!1),t.addEventListener(`webglcontextrestored`,lt,!1),t.addEventListener(`webglcontextcreationerror`,ut,!1),F===null){let t=`webgl2`;if(F=Pe(t,e),F===null)throw Pe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}st()}catch(e){throw t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,lt,!1),t.removeEventListener(`webglcontextcreationerror`,ut,!1),z(`WebGLRenderer: `+e.message),e}function st(){Fe=new Xo(F),Fe.init(),it=new bl(F,Fe),Ie=new To(F,Fe,e,it),I=new vl(F,Fe),Ie.reversedDepthBuffer&&h&&I.buffers.depth.setReversed(!0),ae=F.createFramebuffer(),oe=F.createFramebuffer(),se=F.createFramebuffer(),Le=new $o(F),L=new Qc,ze=new yl(F,Fe,I,L,Ie,it,Le),Be=new Yo(N),Ve=new _o(F),at=new Co(F,Ve),He=new Zo(F,Ve,Le,at),Ue=new ts(F,He,Ve,at,Le),tt=new es(F,Ie,ze),Xe=new Eo(L),We=new Zc(N,Be,Fe,Ie,at,Xe),Ke=new Dl(N,L),qe=new nl,Je=new ll(Fe),$e=new So(N,Be,I,Ue,x,s),Qe=new _l(N,Ue,Ie),ot=new Ol(F,Le,Ie,I),nt=new wo(F,Fe,Le),rt=new Qo(F,Fe,Le),Le.programs=We.programs,N.capabilities=Ie,N.extensions=Fe,N.properties=L,N.renderLists=qe,N.shadowMap=Qe,N.state=I,N.info=Le}S!==1009&&(ne=new rs(S,t.width,t.height,o,r,i));let B=new wl(N,F);this.xr=B,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(e){e!==void 0&&(ye=e,this.setSize(_e,ve,!1))},this.getSize=function(e){return e.set(_e,ve)},this.setSize=function(e,n,r=!0){if(B.isPresenting){R(`WebGLRenderer: Can't change size while VR device is presenting.`);return}_e=e,ve=n,t.width=Math.floor(e*ye),t.height=Math.floor(n*ye),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ne!==null&&ne.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(_e*ye,ve*ye).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ve=n,ye=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){z(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){R(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ne.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(fe)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),I.viewport(fe.copy(Se).multiplyScalar(ye).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),I.scissor(pe.copy(Ce).multiplyScalar(ye).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){I.setScissorTest(we=e)},this.setOpaqueSort=function(e){be=e},this.setTransparentSort=function(e){xe=e},this.getClearColor=function(e){return e.copy($e.getClearColor())},this.setClearColor=function(){$e.setClearColor(...arguments)},this.getClearAlpha=function(){return $e.getClearAlpha()},this.setClearAlpha=function(){$e.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=C.has(t)}if(e){let e=P.texture.type,t=w.has(e),n=$e.getClearColor(),r=$e.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,F.clearBufferuiv(F.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,F.clearBufferiv(F.COLOR,0,E))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,lt,!1),t.removeEventListener(`webglcontextcreationerror`,ut,!1),$e.dispose(),qe.dispose(),Je.dispose(),L.dispose(),Be.dispose(),Ue.dispose(),at.dispose(),ot.dispose(),We.dispose(),B.dispose(),B.removeEventListener(`sessionstart`,_t),B.removeEventListener(`sessionend`,vt),yt.stop()};function ct(e){e.preventDefault(),Ze(`WebGLRenderer: Context Lost.`),re=!0}function lt(){Ze(`WebGLRenderer: Context Restored.`),re=!1;let e=Le.autoReset,t=Qe.enabled,n=Qe.autoUpdate,r=Qe.needsUpdate,i=Qe.type;st(),Le.autoReset=e,Qe.enabled=t,Qe.autoUpdate=n,Qe.needsUpdate=r,Qe.type=i}function ut(e){z(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),ft(t)}function ft(e){pt(e),L.remove(e)}function pt(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){We.releaseProgram(e)}),e.isShaderMaterial&&We.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=V(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=He.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;at.setup(i,r,s,n,c);let h,g=nt;if(c!==null&&(h=Ve.get(c),g=rt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Fe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ve.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n,r){ie!==null&&e.isNodeMaterial&&ie.setObject(r,e),Ee===!0&&Xe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Tt(e,t,r),e.side=0,e.needsUpdate=!0,Tt(e,t,r),e.side=2):Tt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ie!==null&&ie.renderStart(e,t,n),j=Je.get(n),j.init(t),M.push(j),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),j.setupLights(),ie!==null&&ie.updateLights(j.state.lightsArray),De=this.localClippingEnabled,Ee=Xe.init(this.clippingPlanes,De),Ee===!0&&Xe.setGlobalState(this.clippingPlanes,t),ie!==null&&Qe.render(j.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];mt(o,n,t,e),r.add(o)}else mt(i,n,t,e),r.add(i)}}),j=M.pop(),ie!==null&&ie.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Fe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ht=null;function gt(e){ht&&ht(e)}function _t(){yt.stop()}function vt(){yt.start()}let yt=new go;yt.setAnimationLoop(gt),typeof self<`u`&&yt.setContext(self),this.setAnimationLoop=function(e){ht=e,B.setAnimationLoop(e),e===null?yt.stop():yt.start()},B.addEventListener(`sessionstart`,_t),B.addEventListener(`sessionend`,vt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){z(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(re===!0)return;ie!==null&&ie.renderStart(e,t);let n=B.enabled===!0&&B.isPresenting===!0,r=ne!==null&&(P===null||n)&&ne.begin(N,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),B.enabled===!0&&B.isPresenting===!0&&(ne===null||ne.isCompositing()===!1)&&(B.cameraAutoUpdate===!0&&B.updateCamera(t),t=B.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,P),j=Je.get(e,M.length),j.init(t),j.state.textureUnits=ze.getTextureUnits(),M.push(j),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,Ge,t.reversedDepth),De=this.localClippingEnabled,Ee=Xe.init(this.clippingPlanes,De),k=qe.get(e,te.length),k.init(),te.push(k),B.enabled===!0&&B.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&bt(e,t,-1/0,N.sortObjects)}bt(e,t,0,N.sortObjects),k.finish(),ie!==null&&ie.updateLights(j.state.lightsArray),N.sortObjects===!0&&k.sort(be,xe),Me=B.enabled===!1||B.isPresenting===!1||B.hasDepthSensing()===!1,Me&&$e.addToRenderList(k,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Xe.beginShadows();let i=j.state.shadowsArray;if(Qe.render(i,e,t),Ee===!0&&Xe.endShadows(),(r&&ne.hasRenderPass())===!1){let n=k.opaque,r=k.transmissive;if(j.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];St(n,r,e,a)}Me&&$e.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];xt(k,e,n,n.viewport)}}else r.length>0&&St(n,r,e,t),Me&&$e.render(e),xt(k,e,t)}P!==null&&le===0&&(ze.updateMultisampleRenderTarget(P),ze.updateRenderTargetMipmap(P)),r&&ne.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),at.resetDefaultState(),ue=-1,de=null,M.pop(),M.length>0?(j=M[M.length-1],ze.setTextureUnits(j.state.textureUnits),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,j.state.camera)):j=null,te.pop(),k=te.length>0?te[te.length-1]:null,ie!==null&&ie.renderEnd()};function bt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)j.pushLightProbeGrid(e);else if(e.isLight)j.pushLight(e),e.castShadow&&j.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Te)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let i=Ue.update(e),a=e.material;a.visible&&k.push(e,i,a,n,Ae.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Te))){let i=Ue.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ae.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&k.push(e,i,c,n,Ae.z,s,t)}}else a.visible&&k.push(e,i,a,n,Ae.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)bt(i[e],t,n,r)}function xt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;j.setupLightsView(n),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,n),r&&I.viewport(fe.copy(r)),i.length>0&&Ct(i,t,n),a.length>0&&Ct(a,t,n),o.length>0&&Ct(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function St(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(j.state.transmissionRenderTarget[r.id]===void 0){let e=Fe.has(`EXT_color_buffer_half_float`)||Fe.has(`EXT_color_buffer_float`);j.state.transmissionRenderTarget[r.id]=new Yt(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Ie.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:It.workingColorSpace})}let a=j.state.transmissionRenderTarget[r.id],o=r.viewport||fe;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),u=N.getActiveCubeFace(),d=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(he),ge=N.getClearAlpha(),ge<1&&N.setClearColor(16777215,.5),N.clear(),Me&&$e.render(n);let f=N.toneMapping;N.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),j.setupLightsView(r),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,r),Ct(e,n,r),ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a),Fe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,wt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a))}N.setRenderTarget(s,u,d),N.setClearColor(he,ge),p!==void 0&&(r.viewport=p),N.toneMapping=f}function Ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&wt(o,t,n,s,l,c)}}function wt(e,t,n,r,i,a){ie!==null&&i.isNodeMaterial&&ie.setObject(e,i),e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function Tt(e,t,n){t.isScene!==!0&&(t=je);let r=L.get(e),i=j.state.lights,a=j.state.shadowsArray,o=i.state.version,s=We.getParameters(e,i.state,a,t,n,j.state.lightProbeGridArray),c=We.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Be.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Dt(e,s),d}else s.uniforms=We.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,N),d=We.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),Dt(e,s),r.needsLights=At(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=j.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Et(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=uc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Dt(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ot(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function V(e,t,n,r,i){t.isScene!==!0&&(t=je),ze.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?N.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:It.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Be.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),y=j.state.lights;if(Ee===!0&&(De===!0||e!==de)){let t=e===de&&r.id===ue;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=j.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Tt(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(I.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ue&&(ue=r.id,C=!0),v.needsLights){let e=Ot(j.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||de!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(F,`projectionMatrix`,e.projectionMatrix),T.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(F,ke.setFromMatrixPosition(e.matrixWorld)),Ie.logarithmicDepthBuffer&&T.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(F,`sunShadowMap`,y.state.sunShadowMap,ze),y.state.directionalShadowMap.length>0&&T.setValue(F,`directionalShadowMap`,y.state.directionalShadowMap,ze),y.state.spotShadowMap.length>0&&T.setValue(F,`spotShadowMap`,y.state.spotShadowMap,ze),y.state.pointShadowMap.length>0&&T.setValue(F,`pointShadowMap`,y.state.pointShadowMap,ze)),i.isSkinnedMesh){T.setOptional(F,i,`bindMatrix`),T.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(F,`boneTexture`,e.boneTexture,ze))}i.isBatchedMesh&&(T.setOptional(F,i,`batchingTexture`),T.setValue(F,`batchingTexture`,i._matricesTexture,ze),T.setOptional(F,i,`batchingIdTexture`),T.setValue(F,`batchingIdTexture`,i._indirectTexture,ze),T.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(F,`batchingColorTexture`,i._colorsTexture,ze));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&tt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=jl()),C){if(T.setValue(F,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&kt(E,w),a&&r.fog===!0&&Ke.refreshFogUniforms(E,a),Ke.refreshMaterialUniforms(E,r,ye,ve,j.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}uc.upload(F,Et(v),E,ze)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(uc.upload(F,Et(v),E,ze),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(F,`center`,i.center),T.setValue(F,`modelViewMatrix`,i.modelViewMatrix),T.setValue(F,`normalMatrix`,i.normalMatrix),T.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];ot.update(n,x),ot.bind(n,x)}}return x}function kt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function At(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest,I.viewport(fe),I.scissor(pe),I.setScissorTest(me),ue=-1;return}if(o.__webglFramebuffer===void 0)ze.setupRenderTarget(e);else if(o.__hasExternalTextures)ze.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);ze.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&ze.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest}else fe.copy(Se).multiplyScalar(ye).floor(),pe.copy(Ce).multiplyScalar(ye).floor(),me=we;if(n!==0&&(r=ae),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(fe),I.scissor(pe),I.setScissorTest(me),i){let r=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function jt(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ie.textureFormatReadable(e.format),t.__typeReadable=Ie.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=jt(o);if(u.__formatReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,it.convert(c),it.convert(l),a)}finally{let e=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=jt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,it.convert(l),it.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await et(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;ze.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=it.convert(t.format),_=it.convert(t.type),v;t.isData3DTexture?(ze.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(ze.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(ze.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,o,s,f,p,o,s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,oe),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,o,s,f,p,o,s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&ze.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?ze.setTextureCube(e,0):e.isData3DTexture?ze.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?ze.setTexture2DArray(e,0):ze.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){ce=0,le=0,P=null,I.reset(),at.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ge}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=It._getDrawingBufferColorSpace(e),t.unpackColorSpace=It._getUnpackColorSpace()}},Nl={Float32Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Uint8Array,Int8Array};function Pl(e){let t=new Uint8Array(e);if(t[0]!==80||t[1]!==82||t[2]!==65||t[3]!==72)throw Error(`not a PRAH pack`);let n=new DataView(e).getUint32(4,!0),r=JSON.parse(new TextDecoder().decode(t.subarray(8,8+n))),i=8+n,a={};for(let t of r.arrays)a[t.name]=new Nl[t.type](e,i+t.offset,t.length);return{meta:r.meta,arrays:a}}async function Fl(e){let t=await fetch(e);if(!t.ok)throw Error(`${e}: ${t.status}`);let n=await t.arrayBuffer(),r=new Uint8Array(n,0,2);if(r[0]===31&&r[1]===139){let e=new Blob([n]).stream().pipeThrough(new DecompressionStream(`gzip`));n=await new Response(e).arrayBuffer()}return Pl(n)}var Il=class e{x0;z0;cell;nx;nz;h;constructor(e,t){this.x0=e.x0,this.z0=e.z0,this.cell=e.cell,this.nx=e.nx,this.nz=e.nz,this.h=t}static fromPack(t){let n=t.arrays.height,{nx:r}=t.meta,i=new Float32Array(n.length),a=0;for(let e=0;e<n.length;e++)a=e%r===0?n[e]:a+n[e]&65535,i[e]=a/100-100;return new e(t.meta,i)}at(e,t){return e=e<0?0:e>=this.nx?this.nx-1:e,t=t<0?0:t>=this.nz?this.nz-1:t,this.h[t*this.nx+e]}sample(e,t){let n=(e-this.x0)/this.cell,r=(t-this.z0)/this.cell,i=Math.floor(n),a=Math.floor(r),o=n-i,s=r-a,c=this.at(i,a),l=this.at(i+1,a),u=this.at(i,a+1),d=this.at(i+1,a+1);return(c*(1-o)+l*o)*(1-s)+(u*(1-o)+d*o)*s}maxAround(e,t,n){let r=Math.floor((e-n-this.x0)/this.cell),i=Math.ceil((e+n-this.x0)/this.cell),a=Math.floor((t-n-this.z0)/this.cell),o=Math.ceil((t+n-this.z0)/this.cell),s=-1/0;for(let e=a;e<=o;e++)for(let t=r;t<=i;t++)s=Math.max(s,this.at(t,e));return s}contains(e,t){return e>=this.x0&&t>=this.z0&&e<=this.x0+(this.nx-1)*this.cell&&t<=this.z0+(this.nz-1)*this.cell}},Ll={Urban:0,Water:1,Grass:2,Wood:3,Park:4,Garden:5,Orchard:6,Cemetery:7,Pitch:8,Residential:9,Industrial:10,Road:11,Cobbles:12,Path:13,Square:14,Rail:15,Meadow:16,Scrub:17,Rock:18,Parking:19,Vineyard:20,Sand:21,Construction:22,Clay:23,Farmland:24,Flowerbed:25},Rl=`#353b2a`,zl={[Ll.Urban]:`#6c665e`,[Ll.Water]:`#3a4a52`,[Ll.Grass]:`#455a34`,[Ll.Wood]:`#3a4330`,[Ll.Park]:`#425632`,[Ll.Garden]:`#3f5030`,[Ll.Orchard]:`#4d5a31`,[Ll.Cemetery]:`#4b5a37`,[Ll.Pitch]:`#445a35`,[Ll.Residential]:`#6f695f`,[Ll.Industrial]:`#716b62`,[Ll.Road]:`#4f4d4b`,[Ll.Cobbles]:`#5b5752`,[Ll.Path]:`#8f877a`,[Ll.Square]:`#6e685e`,[Ll.Rail]:`#4c4540`,[Ll.Meadow]:`#505e32`,[Ll.Scrub]:`#4c5a35`,[Ll.Rock]:`#8a8074`,[Ll.Parking]:`#595755`,[Ll.Vineyard]:`#5c6a3c`,[Ll.Sand]:`#c2b28f`,[Ll.Construction]:`#9a8d78`,[Ll.Clay]:`#b0654a`,[Ll.Farmland]:`#a0a06a`,[Ll.Flowerbed]:`#5e4a3e`},Bl=`
#define A_PI 3.14159265359
const float A_RG = 6360.0;
const float A_RT = 6460.0;
uniform vec3 aRayleigh;
uniform float aMieScat;
uniform float aMieExt;
uniform vec3 aOzone;
uniform float aMieG;

// Aerosol scatters short wavelengths more (Ångström exponent 1.3, relative to 550 nm): a grey
// aerosol takes the low sun's yellow and, over the blue of the air, reads green at the horizon.
const vec3 A_MIE_SPECTRUM = vec3(0.76, 1.0, 1.34);

void aMedium(float h, out vec3 scatR, out vec3 scatM, out vec3 ext) {
  float dR = exp(-h / 8.0);
  float dM = exp(-h / 1.2);
  float dO = max(0.0, 1.0 - abs(h - 25.0) / 15.0);
  scatR = aRayleigh * dR;
  scatM = aMieScat * A_MIE_SPECTRUM * dM;
  ext = aRayleigh * dR + aMieExt * A_MIE_SPECTRUM * dM + aOzone * dO;
}

// Nearest non-negative hit of a ray from inside or outside a sphere at the planet centre, or -1.
float aRaySphere(vec3 ro, vec3 rd, float r) {
  float b = dot(ro, rd), c = dot(ro, ro) - r * r;
  float disc = b * b - c;
  if (disc < 0.0) return -1.0;
  float s = sqrt(disc);
  float t0 = -b - s, t1 = -b + s;
  if (t0 >= 0.0) return t0;
  if (t1 >= 0.0) return t1;
  return -1.0;
}

float aRayleighPhase(float c) { return 3.0 / (16.0 * A_PI) * (1.0 + c * c); }
float aMiePhase(float c, float g) {
  float g2 = g * g;
  return 3.0 / (8.0 * A_PI) * ((1.0 - g2) * (1.0 + c * c)) / ((2.0 + g2) * pow(max(1e-4, 1.0 + g2 - 2.0 * g * c), 1.5));
}
`,Vl=`
uniform sampler2D aTransLut;
vec2 aTransUv(float r, float mu) {
  float H = sqrt(A_RT * A_RT - A_RG * A_RG);
  float rho = sqrt(max(0.0, r * r - A_RG * A_RG));
  float disc = r * r * (mu * mu - 1.0) + A_RT * A_RT;
  float d = max(0.0, -r * mu + sqrt(max(0.0, disc)));
  float dMin = A_RT - r, dMax = rho + H;
  vec2 uv = vec2((d - dMin) / max(1e-6, dMax - dMin), rho / H);
  return clamp(uv, 0.0, 1.0) * (1.0 - 1.0 / vec2(256.0, 64.0)) + 0.5 / vec2(256.0, 64.0);
}
vec3 aTransmittance(float r, float mu) { return texture2D(aTransLut, aTransUv(r, mu)).rgb; }
// Transmittance toward the sun, fading out as the planet covers the sun's disc.
vec3 aSunTransmittance(float r, float mu) {
  float muH = -sqrt(max(0.0, 1.0 - (A_RG / r) * (A_RG / r)));
  float vis = smoothstep(muH - 0.0047, muH + 0.0047, mu);
  return aTransmittance(r, max(mu, muH)) * vis;
}
`,Hl=`
uniform sampler2D aMsLut;
vec3 aMultiScat(float r, float muS) {
  vec2 uv = vec2(muS * 0.5 + 0.5, (r - A_RG) / (A_RT - A_RG));
  return texture2D(aMsLut, clamp(uv, 0.0, 1.0) * (31.0 / 32.0) + 0.5 / 32.0).rgb;
}
`,Ul=`
uniform sampler2D aSkyLut;
uniform float aCamR;
uniform float aSunE;
uniform float aSkySat;
uniform float aSkyFlat;
uniform float aSkyHorizon;
uniform vec3 uSunDir;
vec2 aSkyUv(vec3 dir) {
  float r = aCamR;
  float vHorizon = sqrt(max(0.0, r * r - A_RG * A_RG));
  float beta = acos(clamp(vHorizon / r, -1.0, 1.0));
  float zh = A_PI - beta;
  float vza = acos(clamp(dir.y, -1.0, 1.0));
  float v = vza < zh
    ? 0.5 * (1.0 - sqrt(max(0.0, 1.0 - vza / zh)))
    : 0.5 + 0.5 * sqrt(max(0.0, (vza - zh) / beta));
  vec2 dh = dir.xz + vec2(1e-6, 0.0), sh = uSunDir.xz + vec2(1e-6, 0.0);
  float cosL = dot(normalize(dh), normalize(sh));
  float u = sqrt(clamp(0.5 - 0.5 * cosL, 0.0, 1.0));
  return vec2(u, v) * (1.0 - 1.0 / vec2(192.0, 108.0)) + 0.5 / vec2(192.0, 108.0);
}
// The photographs' skies are flatter than the physical one: the dark band opposite the sun is
// lifted toward the horizon's brightness in the same direction by a power, aSkyFlat.
vec3 aSky(vec3 dir) {
  vec3 s = texture2D(aSkyLut, aSkyUv(dir)).rgb * aSunE;
  float l = dot(s, vec3(0.2126, 0.7152, 0.0722));
  if (aSkyFlat > 0.0 && dir.y > 0.035) {
    vec3 h = texture2D(aSkyLut, aSkyUv(normalize(vec3(dir.x, 0.035, dir.z)))).rgb * aSunE;
    float lh = dot(h, vec3(0.2126, 0.7152, 0.0722));
    float k = pow(clamp(l / max(lh, 1e-9), 1e-3, 1.0), -aSkyFlat);
    s *= k;
    l *= k;
  }
  // Three wavelengths make the low band away from a low sun greenish (the yellowed sunlight over
  // the air's blue); the photographs show it pale blue. Away from the sun, the band takes a pale
  // version of the hue the sky has 15 degrees up, keeping its own brightness (aSkyHorizon).
  if (aSkyHorizon > 0.0 && dir.y < 0.26) {
    vec3 up = texture2D(aSkyLut, aSkyUv(normalize(vec3(dir.x, 0.26, dir.z)))).rgb;
    float lu = dot(up, vec3(0.2126, 0.7152, 0.0722));
    vec3 hue = mix(vec3(1.0), up / max(lu, 1e-9), 0.45);
    vec2 dh = normalize(dir.xz + vec2(1e-6, 0.0)), sh = normalize(uSunDir.xz + vec2(1e-6, 0.0));
    // Once the sun is well down the whole horizon, the afterglow's side too, is the photographs'
    // pale blue (9547): three wavelengths leave twilight's low band pink.
    float away = max(smoothstep(0.3, -0.4, dot(dh, sh)), smoothstep(0.0, -0.07, uSunDir.y));
    float w = aSkyHorizon * away * (1.0 - smoothstep(0.0, 0.26, max(dir.y, 0.0)));
    s = mix(s, l * hue / max(dot(hue, vec3(0.2126, 0.7152, 0.0722)), 1e-6), w);
  }
  return max(mix(vec3(l), s, aSkySat), 0.0);
}
`,Wl=`
uniform sampler2D uSkyStats;
uniform vec4 uHaze;
uniform vec3 uHazeTint;
uniform sampler2D uTerrainShadow;
uniform vec4 uTerrainShadowRect;
uniform sampler2D uWeather;
uniform vec4 uCloud;
uniform vec2 uWind;
uniform float uOvercast;
uniform vec3 uOvercastSky;
uniform sampler2D tAO;
uniform mat4 uAOViewProj;
uniform float uAOOn;
uniform float uCityLights;
uniform sampler2D tLampMap;
uniform vec4 uLampRect;

// The street lamps' light round a point at night (design.md §8.7), from the pools src/world/lights.ts
// bakes: warm, strongest on the ground and the lowest storey, gone by the third.
vec3 praLampPool(vec3 wp, float above) {
  if (uCityLights <= 0.0) return vec3(0.0);
  vec2 uv = (wp.xz - uLampRect.xy) * uLampRect.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec3(0.0);
  // Sodium through the daylight balance of the blue hour (design.md §5.3): deep orange (9542, 9547).
  return vec3(1.0, 0.36, 0.08) * texture2D(tLampMap, uv).r * exp(-max(0.0, above - 4.0) / 7.0) * uCityLights;
}

// How much of the sky this point sees: the screen-space occlusion of the previous frame, found
// again by reprojecting the point into it.
float praAO(vec3 wp) {
  if (uAOOn < 0.5) return 1.0;
  vec4 c = uAOViewProj * vec4(wp, 1.0);
  vec2 uv = c.xy / c.w * 0.5 + 0.5;
  if (c.w <= 0.0 || uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  return texture2D(tAO, uv).r;
}

float praSunVisibility(vec3 wp) {
  float vis = 1.0;
  vec2 tuv = (wp.xz - uTerrainShadowRect.xy) * uTerrainShadowRect.zw;
  if (tuv.x > 0.0 && tuv.y > 0.0 && tuv.x < 1.0 && tuv.y < 1.0) {
    vec2 s = texture2D(uTerrainShadow, tuv).rg;
    float soft = 3.0 + s.y * 0.006;
    vis = smoothstep(s.x - soft, s.x + soft, wp.y + 3.0);
  }
  if (uCloud.y > 0.0) {
    vec3 p = wp + uSunDir * ((uCloud.z - wp.y) / max(uSunDir.y, 0.06));
    vec3 w = texture2D(uWeather, (p.xz - uWind) / 24000.0).rgb;
    // The small wispy clouds (the map's blue, M17) are thin: half a shadow.
    vis *= 1.0 - uCloud.y * (1.0 - 0.5 * w.b) * smoothstep(uCloud.x, uCloud.x + uCloud.w, w.r);
  }
  return vis;
}

// Height fog along the view ray; its colour is the sky just above the horizon in that direction.
vec3 praAerial(vec3 col, vec3 wp) {
  vec3 v = wp - cameraPosition;
  float d = length(v);
  v /= max(d, 1e-3);
  float H = uHaze.y;
  float k = v.y * d / H;
  float od = uHaze.x * exp(-cameraPosition.y / H) * d * (abs(k) > 1e-3 ? (1.0 - exp(-k)) / k : 1.0);
  float T = exp(-od) * smoothstep(uHaze.z, uHaze.z * 0.55, d);
  vec3 hv = normalize(vec3(v.x, max(v.y, 0.03), v.z));
  // By day the haze glows like the horizon; once the sun is below it, the low air is in the
  // earth's shadow and lit only by the sky above, so it takes the sky's mean light instead of
  // the sunset glow (uHaze.w: 1 with the sun up, 0 below).
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  // Low haze scatters less than the whole horizon column above it: about two thirds of its light,
  // which also leaves distant hills a shade darker than the sky behind them.
  vec3 S = mix(mix(hemi * 0.8, aSky(hv) * 0.65, uHaze.w), uOvercastSky * 0.85, uOvercast) * uHazeTint;
  return col * T + S * (1.0 - T);
}
`,Gl=()=>({value:null}),Y={aTransLut:Gl(),aMsLut:Gl(),aSkyLut:Gl(),aRayleigh:{value:new H(.005802,.013558,.0331)},aMieScat:{value:.003996},aMieExt:{value:.0044},aOzone:{value:new H(65e-5,.001881,85e-6)},aMieG:{value:.8},aCamR:{value:6360.2},aSunE:{value:100},aSkySat:{value:1},aSkyFlat:{value:0},aSkyHorizon:{value:0},uSkyStats:Gl(),uSunDir:{value:new H(0,1,0)},uHaze:{value:new qt(15e-5,900,17e3,0)},uHazeTint:{value:new G(1,1,1)},uTerrainShadow:Gl(),uTerrainShadowRect:{value:new qt(0,0,0,0)},uWeather:Gl(),uCloud:{value:new qt(1,0,1600,.1)},uWind:{value:new V},uOvercast:{value:0},uOvercastSky:{value:new G},uNight:{value:0},tAO:Gl(),uAOViewProj:{value:new W},uAOOn:{value:0},uTime:{value:0},uCityLights:{value:0},tLampMap:Gl(),uLampRect:{value:new qt(0,0,0,0)},uMirrorPass:{value:0}},Kl=`getSunLightInfo( sunLight, directLight );`;if(!q.lights_fragment_begin.includes(Kl))throw Error(`lit.ts: three.js sun light chunk changed`);var ql=q.lights_fragment_begin.replace(Kl,`${Kl}\n\t\tdirectLight.color *= praSunVisibility( vPraWorld );`),Jl=`#include <aomap_fragment>
	{
		float praOcc = praAO( vPraWorld );
		reflectedLight.indirectDiffuse *= praOcc;
		reflectedLight.indirectSpecular *= mix( 1.0, praOcc, 0.7 );
	}`;function Yl(e,t,n=``){return e.onBeforeCompile=e=>{for(let[t,n]of Object.entries(Y))e.uniforms[t]=n;e.vertexShader=e.vertexShader.replace(`#include <fog_pars_vertex>`,`varying vec3 vPraWorld;`).replace(`#include <fog_vertex>`,`vPraWorld = (mvPosition.xyz - viewMatrix[3].xyz) * mat3(viewMatrix);`),e.fragmentShader=e.fragmentShader.replace(`#include <fog_pars_fragment>`,`varying vec3 vPraWorld;\n${Bl}\n${Ul}\n${Wl}`).replace(`#include <lights_fragment_begin>`,ql).replace(`#include <aomap_fragment>`,Jl).replace(`#include <fog_fragment>`,`gl_FragColor.rgb = praAerial(gl_FragColor.rgb, vPraWorld);`),t?.(e)},e.customProgramCacheKey=()=>`praha-lit-2${n}`,e}var Xl=`
float praBHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float praBNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(praBHash(i), praBHash(i + vec2(1.0, 0.0)), f.x), mix(praBHash(i + vec2(0.0, 1.0)), praBHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
vec3 praBloom(vec2 xz) {
  float v = praBNoise(xz * 0.18 + 11.0);
  return v < 0.5 ? vec3(0.58, 0.035, 0.028) : v < 0.68 ? vec3(0.7, 0.07, 0.004) : v < 0.86 ? vec3(0.66, 0.24, 0.3) : vec3(0.8, 0.76, 0.7);
}
// The leaves of a rose bed or bush.
const vec3 PRA_ROSE_LEAF = vec3(0.03, 0.045, 0.026);
`,Zl=1e3,Ql=[1,2,4,8],$l=[900,2e3,3800],eu=25,tu=class{group=new Dn;material;chunks=[];grid;world;constructor(e,t,n){this.grid=e,this.world=n,this.material=ou(t);let r=Zl/e.cell;for(let t=0;t<e.nz-1;t+=r)for(let n=0;n<e.nx-1;n+=r){let i=Math.min(r,e.nx-1-n,e.nz-1-t),a=e.x0+(n+i/2)*e.cell,o=e.z0+(t+i/2)*e.cell,s=new oi(void 0,this.material);s.receiveShadow=!0,s.castShadow=!1,s.matrixAutoUpdate=!1,this.group.add(s),this.chunks.push({mesh:s,cx:a,cz:o,i0:n,j0:t,n:i,level:-1,geoms:[]})}for(let e of this.chunks)this.setLevel(e,Ql.length-1)}update(e,t=2){let n=this.chunks.map(t=>{let n=this.grid.sample(t.cx,t.cz),r=Math.max(0,Math.abs(e.x-t.cx)-Zl/2),i=Math.max(0,Math.abs(e.z-t.cz)-Zl/2),a=Math.hypot(r,i,(e.y-n)*.5),o=$l.findIndex(e=>a<e);return o<0&&(o=Ql.length-1),{c:t,l:o,d:a}});n.sort((e,t)=>e.d-t.d);for(let{c:e,l:r}of n)if(r!==e.level){if(!e.geoms[r]){let e=r===0?2:1;if(t<e)continue;t-=e}this.setLevel(e,r)}}setLevel(e,t){e.geoms[t]??=this.build(e,Ql[t]),e.mesh.geometry=e.geoms[t],e.level=t;for(let n=0;n<t-1;n++)e.geoms[n]?.dispose(),e.geoms[n]=void 0}build(e,t){let n=this.grid,r=e.n/t,i=r+1,a=i*i+4*i,o=new Float32Array(a*3),s=new Float32Array(a*3),c=new Float32Array(a*2),l=this.world.xMax-this.world.xMin,u=this.world.zMax-this.world.zMin,d=t*n.cell,f=0,p=n.h,m=n.nx,h=n.nz,g=(e,t)=>p[(t<0?0:t>=h?h-1:t)*m+(e<0?0:e>=m?m-1:e)],_=(e,r,i)=>{let a=n.x0+e*n.cell,p=n.z0+r*n.cell;o[f*3]=a,o[f*3+1]=g(e,r)-i,o[f*3+2]=p;let m=(g(e+t,r)-g(e-t,r))/(2*d),h=(g(e,r+t)-g(e,r-t))/(2*d),_=Math.sqrt(m*m+1+h*h);return s[f*3]=-m/_,s[f*3+1]=1/_,s[f*3+2]=-h/_,c[f*2]=(a-this.world.xMin)/l,c[f*2+1]=(p-this.world.zMin)/u,f++};for(let n=0;n<=r;n++)for(let i=0;i<=r;i++)_(e.i0+i*t,e.j0+n*t,0);let v=new Uint32Array(r*r*6+4*r*12),y=0;for(let e=0;e<r;e++)for(let t=0;t<r;t++){let n=e*i+t,r=n+1,a=n+i,o=a+1;v[y++]=n,v[y++]=a,v[y++]=r,v[y++]=r,v[y++]=a,v[y++]=o}let b=new Uint32Array(i),x=new Uint32Array(i);for(let n=0;n<4;n++){for(let a=0;a<=r;a++){let o=n===0?a:n===1?r:n===2?r-a:0,s=n===0?0:n===1?a:n===2?r:r-a;b[a]=s*i+o,x[a]=_(e.i0+o*t,e.j0+s*t,eu)}for(let e=0;e<r;e++){let t=b[e],n=b[e+1],r=x[e],i=x[e+1];v[y++]=t,v[y++]=r,v[y++]=n,v[y++]=n,v[y++]=r,v[y++]=i,v[y++]=t,v[y++]=n,v[y++]=r,v[y++]=n,v[y++]=i,v[y++]=r}}let S=new Nr;return S.setAttribute(`position`,new yr(o.subarray(0,f*3),3)),S.setAttribute(`normal`,new yr(s.subarray(0,f*3),3)),S.setAttribute(`uv`,new yr(c.subarray(0,f*2),2)),S.setIndex(new yr(v,1)),S.computeBoundingSphere(),S.computeBoundingBox(),S}};function nu(e,n,r){let i=new Uint8Array(768);for(let[e,t]of Object.entries(zl)){let n=parseInt(t.slice(1),16);i.set([n>>16&255,n>>8&255,n&255],Number(e)*3)}let a=new Uint8Array(256);a[Ll.Flowerbed]=32,a[Ll.Path]=64,a[Ll.Road]=a[Ll.Parking]=a[Ll.Industrial]=128,a[Ll.Square]=192,a[Ll.Cobbles]=255;let s=new Uint8Array(n*r*4),l=parseInt(Rl.slice(1),16),u=[l>>16&255,l>>8&255,l&255],d=1234567;for(let t=0;t<n*r;t++){d=d*1103515245+12345>>>0;let n=.94+(d>>>16&255)/255*.12,r=e[t]&63,o=r*3,c=e[t]>>6?.6:0;for(let e=0;e<3;e++)s[t*4+e]=Math.min(255,(i[o+e]*(1-c)+u[e]*c)*n);s[t*4+3]=a[r]}let f=new li(s,n,r,w);return f.colorSpace=Re,f.generateMipmaps=!0,f.minFilter=c,f.magFilter=o,f.wrapS=f.wrapT=t,f.needsUpdate=!0,f}var ru=`
{
  float pave = sampledDiffuseColor.a;
  diffuseColor.a = 1.0;
  if (pave > 0.19) {
    vec2 xz = vPraWorld.xz;
    float n1 = praGNoise(xz * 0.35), n2 = praGNoise(xz * 2.3);
    // Asphalt and gravel: patches and grain.
    float grain = 0.93 + 0.1 * n1 + 0.08 * (n2 - 0.5);
    float setts = smoothstep(0.62, 0.8, pave), cobbles = smoothstep(0.85, 0.98, pave);
    vec3 c = diffuseColor.rgb * mix(grain, 1.0, setts);
    if (setts > 0.0) {
      // Setts in rows, every other row offset; cobbles smaller than the square's setts.
      float size = mix(0.2, 0.11, cobbles);
      vec2 p = xz / size;
      p.x += 0.5 * mod(floor(p.y), 2.0);
      vec2 cell = floor(p), f = fract(p);
      float w = max(fwidth(p.x), fwidth(p.y));
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      float gap = 1.0 - smoothstep(0.04, 0.14, edge);
      float tone = 0.82 + 0.34 * praGHash(cell);
      float stones = mix(tone, 0.55, gap);
      // Averaged away when a stone is under about two pixels.
      float fade = 1.0 - smoothstep(0.25, 0.6, w);
      float mean = 0.9;
      // The squares' grid of lighter granite lines, every 2.4 m.
      vec2 g = xz / 2.4;
      float gw = max(fwidth(g.x), fwidth(g.y));
      float lines = (1.0 - cobbles) * max(praGPulse(g.x, 0.0, 0.06, gw), praGPulse(g.y, 0.0, 0.06, gw));
      c *= mix(1.0, mix(mean, stones, fade), setts) * (1.0 + 0.35 * lines * setts);
    }
    diffuseColor.rgb = c;
  }
}`,iu=`
float praGHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float praGNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(praGHash(i), praGHash(i + vec2(1.0, 0.0)), f.x), mix(praGHash(i + vec2(0.0, 1.0)), praGHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float praGPulse(float x, float a, float b, float w) {
  w = max(w, 1e-4);
  float x0 = x - 0.5 * w, x1 = x + 0.5 * w;
  return ((floor(x1) * (b - a) + clamp(fract(x1), a, b)) - (floor(x0) * (b - a) + clamp(fract(x0), a, b))) / w;
}`,au=`
if (sampledDiffuseColor.a < 0.19) {
  vec3 c = diffuseColor.rgb;
  vec2 xz = vPraWorld.xz;
  float mpp = length(fwidth(vPraWorld));
  float a = sampledDiffuseColor.a;
  // A bed by its alpha, and by its brown (a lawn blending into a path passes the same alpha, grey-green).
  float bed = smoothstep(0.07, 0.11, a) * (1.0 - smoothstep(0.15, 0.19, a)) * smoothstep(1.3, 1.45, c.r / max(c.g, 1e-4));
  float veg = clamp((c.g - max(c.r, c.b * 1.1)) / (0.01 + 0.25 * c.g), 0.0, 1.0);
  if (bed > 0.01) {
    vec3 leaves = PRA_ROSE_LEAF * (0.8 + 0.4 * praGNoise(xz * 2.1));
    vec3 bloom = praBloom(xz);
    vec2 p = xz / 0.28;
    vec2 cell = floor(p), f = fract(p) - 0.5;
    vec2 jit = vec2(praGHash(cell + 1.3), praGHash(cell + 2.7)) - 0.5;
    float r = length(f - jit * 0.4);
    float bloomHere = step(praGHash(cell), 0.5) * (1.0 - smoothstep(0.16, 0.3, r));
    float fade = smoothstep(0.25, 0.7, max(fwidth(p.x), fwidth(p.y)));
    float cover = mix(bloomHere, 0.22, fade);
    diffuseColor.rgb = mix(c, mix(leaves, bloom * (0.85 + 0.3 * praGHash(cell + 5.1)), cover), bed);
  } else if (veg > 0.0 && a < 0.05) {
    // How much of a meadow: the yellower the green, the longer and drier the grass.
    float meadow = smoothstep(0.34, 0.48, (c.r - c.b) / max(c.g, 1e-3));
    float n1 = praGNoise(xz * 0.07), n2 = praGNoise(xz * 0.31 + 3.0), n3 = praGNoise(xz * 1.6 + 7.0), n4 = praGNoise(xz * vec2(9.0, 3.0) + 1.0);
    vec3 g = c;
    // Early summer: patches gone yellow, more of them in a meadow.
    g = mix(g, g * vec3(1.16, 1.06, 0.8), smoothstep(0.5 - 0.15 * meadow, 0.85, n1) * (0.35 + 0.35 * meadow));
    g *= 0.84 + 0.32 * n2;
    g *= mix(1.0, 0.72 + 0.56 * n3, (1.0 - smoothstep(0.3, 1.2, mpp)) * (0.5 + 0.5 * meadow));
    g *= mix(1.0, 0.7 + 0.6 * n4, (1.0 - smoothstep(0.05, 0.25, mpp)) * (0.4 + 0.6 * meadow));
    diffuseColor.rgb = mix(c, g, veg);
  }
}`;function ou(e){return Yl(new da({map:e,roughness:.95,metalness:0}),e=>{e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${iu}\n${Xl}`).replace(`#include <map_fragment>`,`#include <map_fragment>\n${au}\n${ru}`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * praLampPool(vPraWorld, 0.0) * 0.06;`)},`-terrain`)}function su(e,t){let n=e.nx,r=[],i=[],a=[],o=new Int32Array(n*n).fill(-1),s=(e,n)=>e>t.xMin+1&&e<t.xMax-1&&n>t.zMin+1&&n<t.zMax-1,c=(t,a)=>{let s=a*n+t;if(o[s]<0){o[s]=r.length/3;let n=e.x0+t*e.cell,c=e.z0+a*e.cell;r.push(n,e.at(t,a),c);let l=(e.at(t+1,a)-e.at(t-1,a))/(2*e.cell),u=(e.at(t,a+1)-e.at(t,a-1))/(2*e.cell),d=Math.hypot(l,1,u);i.push(-l/d,1/d,-u/d)}return o[s]};for(let t=0;t+1<n;t++)for(let r=0;r+1<n;r++){if(s(e.x0+(r+.5)*e.cell,e.z0+(t+.5)*e.cell))continue;let n=c(r,t),i=c(r+1,t),o=c(r,t+1),l=c(r+1,t+1);a.push(n,o,i,i,o,l)}let l=new Nr;l.setAttribute(`position`,new K(r,3)),l.setAttribute(`normal`,new K(i,3)),l.setIndex(a),l.computeBoundingSphere();let u=new oi(l,new da({color:`#8f8c7c`,roughness:1,metalness:0}));return u.receiveShadow=!1,u.matrixAutoUpdate=!1,u}var cu={Wall:0,Roof:1,FlatRoof:2,Gable:3,Chimney:4,DormerFront:5,DormerRoof:6,Plain:7,Stone:8,Metal:9,Glass:10,Opening:11,Trim:12},lu={Ashlar:0,Brick:1,Rubble:2,Render:3,Setts:4},uu={Slate:0,Copper:1,Lead:2,Gold:3,Glazed:4},du={Plain:0,Tracery:1,Rose:2,Curtain:3,Casement:4},fu={Party:1,Floodlit:2,TrimDeep:4,TrimPale:8,FloodDim:16,Blackened:32},pu=`float praRand(uint s, uint k) { uint h = s * 747796405u + k * 2891336453u; h ^= h >> 13; h *= 0x5bd1e995u; h ^= h >> 15; return float(h & 0xffffffu) / 16777216.0; }`,mu={Portal:100,Balcony:2,Arch:3,Hood:4,WreathPier:5,Wreath:6,Wood:7,Shutters:8,Trim:9,Hood2:10,Quoins:11,Band:12},hu={Hood2Straight:.5,Quoins:.35,Band:.6,Quoin:.56},gu=[{name:`blank`,cell:0,winW:0,winH:0,sill:0,storey:3.5,ground:0},{name:`baroque`,cell:2.7,winW:1,winH:1.55,sill:1,storey:3.4,ground:0},{name:`old-town`,cell:2.9,winW:1.1,winH:1.75,sill:.95,storey:3.6,ground:1},{name:`block`,cell:3.1,winW:1.2,winH:2.05,sill:.9,storey:3.6,ground:1},{name:`modern`,cell:2.6,winW:1.9,winH:1.45,sill:.9,storey:3,ground:1},{name:`house`,cell:3.2,winW:1.2,winH:1.4,sill:.9,storey:3,ground:0},{name:`palace`,cell:3,winW:1.25,winH:2.1,sill:1,storey:3.9,ground:0}],_u={Blank:0,Baroque:1,OldTown:2,Block:3,Modern:4,House:5,Palace:6},vu=`
varying vec4 vFacade;
flat varying vec4 vInfo;
varying vec3 vPraN;
uniform vec4 uStyleA[${gu.length}];
uniform vec4 uStyleB[${gu.length}];
uniform float uDetail;
uniform float uRelief;
${pu}
float praHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float praNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(praHash(i), praHash(i + vec2(1.0, 0.0)), f.x), mix(praHash(i + vec2(0.0, 1.0)), praHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// The share of [x - w/2, x + w/2] that falls inside [a, b] of each unit period: a box-filtered pulse train.
float praPulse(float x, float a, float b, float w) {
  w = max(w, 1e-4);
  float x0 = x - 0.5 * w, x1 = x + 0.5 * w;
  float F1 = floor(x1) * (b - a) + clamp(fract(x1), a, b);
  float F0 = floor(x0) * (b - a) + clamp(fract(x0), a, b);
  return (F1 - F0) / w;
}
float praStep(float e, float x, float w) { return clamp((x - e) / max(w, 1e-4) + 0.5, 0.0, 1.0); }
// The box-filtered coverage of the rectangle [lo, hi] at p, for a footprint w.
float praBox(vec2 p, vec2 lo, vec2 hi, vec2 w) {
  return (praStep(lo.x, p.x, w.x) - praStep(hi.x, p.x, w.x)) * (praStep(lo.y, p.y, w.y) - praStep(hi.y, p.y, w.y));
}
// The coverage of an ellipse centred at c with radii r (by an approximate distance).
float praEll(vec2 p, vec2 c, vec2 r, vec2 w) {
  float d = (length((p - c) / r) - 1.0) * min(r.x, r.y);
  return 1.0 - clamp(d / max(max(w.x, w.y), 1e-4) + 0.5, 0.0, 1.0);
}
// An opening with a round head: a rectangle from y0 up to its spring ys, under a half disc of
// radius hw centred at (0, ys).
float praArch(vec2 p, float hw, float y0, float ys, vec2 w) {
  float disc = praEll(p, vec2(0.0, ys), vec2(hw), w) * praStep(ys, p.y, w.y);
  return clamp(praBox(p, vec2(-hw, y0), vec2(hw, ys), w) + disc, 0.0, 1.0);
}
// A thin line through the origin across n, for glazing bars.
float praBar(vec2 q, vec2 n, float hw, vec2 w) {
  float d = dot(q, n);
  return praStep(-hw, d, max(w.x, w.y)) - praStep(hw, d, max(w.x, w.y));
}
// Stucco (8777), each as a coverage; drawn in relief by reading it twice, a few centimetres apart.
// A cartouche filling an apron hw either side: a framed shield, a volute at each end, and a
// garland sagging between them.
float praCartouche(vec2 q, float hw, vec2 w) {
  vec2 k = vec2(abs(q.x), q.y);
  float s = praEll(q, vec2(0.0), vec2(0.19, 0.13), w);
  s = max(s, praEll(q, vec2(0.0), vec2(0.27, 0.18), w) - praEll(q, vec2(0.0), vec2(0.235, 0.15), w));
  float vx = hw - 0.11;
  s = max(s, praEll(k, vec2(vx, 0.02), vec2(0.095), w) - praEll(k, vec2(vx, 0.02), vec2(0.042), w));
  float t = (k.x - 0.25) / max(vx - 0.33, 0.05), yg = 0.03 - 0.1 * sin(3.1416 * clamp(t, 0.0, 1.0));
  s = max(s, step(0.0, t) * step(t, 1.0) * (praStep(yg - 0.022, k.y, w.y) - praStep(yg + 0.022, k.y, w.y)));
  return s;
}
// A wreath of leaves, 0.7 m across.
float praWreath(vec2 q, vec2 w) {
  float t = 0.055 + 0.025 * cos(atan(q.y, q.x) * 14.0);
  return clamp(praEll(q, vec2(0.0), vec2(0.3 + t), w) - praEll(q, vec2(0.0), vec2(0.3 - t), w), 0.0, 1.0);
}
// A shell in a pediment: a fan with flutes.
float praShell(vec2 q, vec2 w) {
  return praEll(q, vec2(0.0), vec2(0.21, 0.17), w) * praStep(0.0, q.y, w.y) * (0.72 + 0.28 * cos(atan(q.y, q.x) * 11.0));
}
// Where the balconies are: on the 19th-century blocks the middle windows of the upper floors but
// the top; on the rich fronts the window over the portal, on most palaces and some others.
bool praBalcony(int style, bool rich, bool portal, float fl, float col, float n, float nS, float dcol, float hb) {
  if (style == ${_u.Block}) return hb < 0.6 && abs(col - 0.5 * (n - 1.0)) < 0.6 && fl > 0.5 && fl < nS - 1.5;
  return rich && portal && fl > 0.5 && fl < 1.5 && col == dcol && hb < (style == ${_u.Palace} ? 0.8 : 0.45);
}
`,yu=`
float praGlass = 0.0, praMetal = 0.0, praRough = -1.0;
// Night (design.md §8.7): light of its own (scaled by uCityLights), and the height above the ground
// the street lamps' pools are judged at (negative: not lit by them).
vec3 praEmit = vec3(0.0);
float praAbove = -1.0;
{
  int kind = int(vInfo.x + 0.5);
  int style = int(vInfo.y + 0.5);
  float party = mod(vInfo.z, 2.0);
  float seed = vInfo.w;
  // The seed as an integer and the flags' bits, for the choices the tile worker makes too (M14).
  uint us = uint(seed + 0.5);
  int bits = int(vInfo.z + 0.5);
  vec3 wp = vPraWorld;
  if (kind == ${cu.Wall}) {
    vec4 A = uStyleA[style], B = uStyleB[style];
    float u = vFacade.x, L = vFacade.y, v = vFacade.z, top = vFacade.w;
    float wv = max(fwidth(v), 1e-4), wu = max(fwidth(u), 1e-4);
    vec3 c = diffuseColor.rgb;
    // The details of the close-ups (design.md §8.2, M9) on the old fronts; the rich ones (baroque,
    // Old Town, palace) also get aprons and hoods. They fade out between about 5 and 14 cm a pixel
    // (M18; 3 and 9 before): each is box-filtered to its footprint, and holds to twice the distance.
    bool orn = style == ${_u.Baroque} || style == ${_u.OldTown} || style == ${_u.Palace} || style == ${_u.Block} || style == ${_u.House};
    bool rich = style == ${_u.Baroque} || style == ${_u.OldTown} || style == ${_u.Palace};
    float near = orn ? (1.0 - smoothstep(0.05, 0.14, max(wu, wv))) * uDetail : 0.0;
    // Two tones: the trim paler (white and cream on ochre, 8884), deeper and warmer (salmon on pale
    // pink, 8777; red-orange on ochre, 8082), or the field's own colour in relief; by building,
    // decided in the tile worker (src/world/relief.ts) from the seed and the field's saturation,
    // and carried in the flags.
    vec3 trim = (bits & ${fu.TrimDeep}) != 0 ? c * vec3(0.8, 0.44, 0.34) : (bits & ${fu.TrimPale}) != 0 ? mix(c, vec3(0.86, 0.82, 0.72), 0.75) : c * 1.08;
    if (!orn) trim = c;
    float inC = 0.0;
    if (party > 0.5) {
      // A firewall: bare, a little grey.
      c = mix(c, vec3(dot(c, vec3(0.3333))), 0.35) * 0.86;
    } else if (top > 3.0) {
      // Cornice under the eave, in the trim: a lit moulding over a line of shadow.
      inC = praStep(top - 0.5, v, wv);
      float line = praStep(top - 0.78, v, wv) * (1.0 - inC);
      c = mix(c, trim, 0.85 * inC) * (1.0 + 0.12 * inC) * (1.0 - 0.38 * line);
      // Plinth.
      c *= mix(0.8, 1.0, praStep(0.9, v, wv));
      // Lesenes: strips of the trim up the ends of the front, from the plinth to the cornice.
      if (orn && style != ${_u.House} && L > 5.0) {
        float les = ((1.0 - praStep(0.55, u, wu)) + praStep(L - 0.55, u, wu)) * praStep(0.9, v, wv) * (1.0 - inC);
        // M18: on a third of the rich fronts, rusticated quoins instead, long and short in turn.
        if (rich && praRand(us, ${mu.Quoins}u) < ${hu.Quoins}) {
          float qc = v / ${hu.Quoin}, qw = mod(floor(qc), 2.0) > 0.5 ? 0.55 : 0.9;
          les = ((1.0 - praStep(qw, u, wu)) + praStep(L - qw, u, wu)) * praStep(0.9, v, wv) * (1.0 - inC);
          les *= 1.0 - praPulse(qc, 0.89, 1.0, wv / ${hu.Quoin});
        }
        c = mix(c, trim, les);
      }
    }
    float win = 0.0, frame = 0.0;
    float n = A.x > 0.0 ? floor((L - 0.8) / A.x) : 0.0;
    if (n >= 1.0 && top > 2.5) {
      float span = (L - 0.8) / n;
      float cc = (u - 0.4) / span;
      float wc = max(fwidth(cc), 1e-4);
      float inside = praStep(0.0, cc, wc) * (1.0 - praStep(n, cc, wc));
      float hw = 0.5 * A.y / span;
      float cols = praPulse(cc, 0.5 - hw, 0.5 + hw, wc) * inside;
      float usable = max(top - 0.9, 2.5);
      float nS = max(1.0, floor(usable / B.x + 0.35));
      float sh = usable / nS;
      float r = v / sh;
      float wr = max(fwidth(r), 1e-4);
      float upper = praStep(1.0, r, wr) * (1.0 - praStep(nS, r, wr));
      float a = A.w / sh, b = min(0.9, (A.w + A.z) / sh);
      win = cols * praPulse(r, a, b, wr) * upper;
      float ground = praStep(0.0, r, wr) * (1.0 - praStep(1.0, r, wr));
      if (B.y > 0.5) {
        float sw = min(0.42, hw * 1.7);
        win += ground * praPulse(cc, 0.5 - sw, 0.5 + sw, wc) * inside * praPulse(r, 0.1, 0.78, wr);
        // The blocks' ground floor is rusticated.
        if (style == ${_u.Block}) c *= 1.0 - 0.14 * ground * praPulse(v / 0.42, 0.0, 0.1, wv / 0.42);
      } else {
        win += ground * cols * praPulse(r, 0.3, min(0.88, 0.3 + A.z / sh), wr);
      }
      // String course between the ground floor and the first, in the trim.
      float sc = praPulse(r, 0.96, 1.0, wr) * step(0.5, r) * step(r, 1.5);
      // M18: on most rich fronts a thinner band under the top floor.
      if (rich && nS > 2.5 && praRand(us, ${mu.Band}u) < ${hu.Band}) sc = max(sc, 0.8 * praPulse(r, 0.975, 1.0, wr) * step(nS - 1.5, r) * step(r, nS - 0.5));
      c = mix(c, trim, 0.7 * sc) * (1.0 - 0.18 * sc);
      win = clamp(win, 0.0, 1.0);
      float h = praHash(vec2(floor(cc) + seed * 3.7, floor(r) + seed * 1.3));
      vec3 glass = mix(vec3(0.035, 0.042, 0.05), vec3(0.13, 0.13, 0.13), h * h);
      // White casements; the modern fronts' frames are dark metal. From afar a window is glass
      // with its frame in it, a grey, not a black hole.
      vec3 frameC = orn ? vec3(0.78, 0.76, 0.7) : vec3(0.08, 0.085, 0.09);
      // Painted over everything at the end: doors and balcony railings (M10).
      vec3 ovC = vec3(0.0);
      float ovA = 0.0;
      #ifndef PRA_NO_DETAIL
      if (near > 0.0) {
        // Metres from the window's axis, and above the storey's floor.
        vec2 p = vec2((fract(cc) - 0.5) * span, fract(r) * sh), w2 = vec2(wu, wv);
        float fl = floor(r), col = floor(cc);
        bool gf = fl < 0.5;
        // Nothing below the ground floor, where a street falls away along a front.
        float mCell = near * inside * step(0.0, fl) * step(fl, nS - 1.0);
        // The ground floor's plain windows take the same frames; shopfronts do not.
        float m = mCell * (gf && B.y > 0.5 ? 0.0 : 1.0);
        float W = A.y, y0 = gf ? 0.3 * sh : A.w, y1 = gf ? min(0.88 * sh, 0.3 * sh + A.z) : min(A.w + A.z, 0.9 * sh);
        float sw = rich ? 0.2 : 0.13;
        // The portal (8777, 8082): one door to a street front, in the middle of a rich one.
        float hd = praRand(us, ${mu.Portal}u + uint(L * 10.0 + 0.5)), hb = praRand(us, ${mu.Balcony}u);
        bool portal = party < 0.5 && top > 3.0 && hd < 0.9 && span > 1.9;
        float dcol = rich && n >= 3.0 ? floor(n * 0.5) : floor(hd / 0.9 * n);
        bool door = portal && gf && col == dcol;
        bool balc = praBalcony(style, rich, portal, fl, col, n, nS, dcol, hb);
        bool balcUp = praBalcony(style, rich, portal, fl + 1.0, col, n, nS, dcol, hb);
        // Round-headed windows on the rich fronts' ground floors (8777).
        bool arch = rich && gf && B.y < 0.5 && !door && praRand(us, ${mu.Arch}u) < 0.65;
        float ys = arch ? y1 - 0.5 * W : y1;
        float yb = 0.12; // a balcony's floor above the storey's
        float rect = arch ? praArch(p, 0.5 * W, y0, ys, w2) : praBox(p, vec2(-0.5 * W, y0), vec2(0.5 * W, y1), w2);
        float sur = (arch ? praArch(p, 0.5 * W + sw, y0 - sw, ys, w2) : praBox(p, vec2(-0.5 * W - sw, y0 - sw), vec2(0.5 * W + sw, y1 + sw), w2)) - rect;
        // Ears at the top corners of the surrounds on the rich fronts' upper windows.
        if (rich && !gf) sur += praBox(vec2(abs(p.x), p.y), vec2(0.5 * W + sw, y1 + sw - 0.17), vec2(0.5 * W + sw + 0.08, y1 + sw), w2);
        // The sill: a lit ledge with its shadow under it; the rich fronts an apron panel below.
        float noSill = balc ? 0.0 : 1.0;
        float sill = praBox(p, vec2(-0.5 * W - sw - 0.06, y0 - sw - 0.07), vec2(0.5 * W + sw + 0.06, y0 - sw + 0.01), w2) * noSill;
        float sillSh = praBox(p, vec2(-0.5 * W - sw, y0 - sw - 0.16), vec2(0.5 * W + sw, y0 - sw - 0.07), w2) * noSill;
        float apron = rich && !gf ? praBox(p, vec2(-0.5 * W + 0.05, y0 - sw - 0.62), vec2(0.5 * W - 0.05, y0 - sw - 0.22), w2) * noSill : 0.0;
        if (door) { sur = 0.0; sill = 0.0; sillSh = 0.0; }
        c = mix(c, trim, clamp(sur + 0.55 * apron, 0.0, 1.0) * m);
        c = mix(c, trim * 1.15, sill * m);
        c *= 1.0 - 0.35 * sillSh * m;
        // Stucco in relief, lit from above: a cartouche in the apron of the baroque and palace
        // fronts (the Old Town's first floor only), a keystone over the upper windows of the rich
        // fronts, a wreath on one pier of the first floor; a shell in its pediments (below).
        vec2 up = vec2(0.0, 0.03);
        float st0 = 0.0, st1 = 0.0;
        if (rich && !gf && apron > 0.0 && (style != ${_u.OldTown} || fl < 1.5)) {
          vec2 q = p - vec2(0.0, y0 - sw - 0.42);
          st0 = praCartouche(q, 0.5 * W - 0.05, w2); st1 = praCartouche(q + up, 0.5 * W - 0.05, w2);
        }
        // M18: hoods over the second floor too where a floor stands above it; the second floor's
        // straight on half the fronts, the first floor's kind on the rest.
        float hk = praRand(us, ${mu.Hood}u);
        bool hooded = rich ? fl > 0.5 && fl < min(2.5, nS - 1.5) : style == ${_u.Block} && fl > 0.5 && fl < nS - 1.5;
        float hkF = fl > 1.5 && praRand(us, ${mu.Hood2}u) < ${hu.Hood2Straight} ? 0.0 : hk;
        if (rich && fl > 1.5 && !balc && !hooded) {
          st0 = max(st0, praBox(p, vec2(-0.1, y1), vec2(0.1, y1 + sw + 0.12), w2));
          st1 = max(st1, praBox(p + up, vec2(-0.1, y1), vec2(0.1, y1 + sw + 0.12), w2));
        }
        if (rich && fl > 0.5 && fl < 1.5) {
          float pc = floor(praRand(us, ${mu.WreathPier}u) * max(n - 1.0, 1.0));
          if (praRand(us, ${mu.Wreath}u) < 0.4 && n > 1.5 && span - W > 1.1 && (col == pc || col == pc + 1.0)) {
            vec2 q = p - vec2((col == pc ? 0.5 : -0.5) * span, 0.5 * (y0 + y1));
            st0 = max(st0, praWreath(q, w2)); st1 = max(st1, praWreath(q + up, w2));
          }
        }
        c = mix(c, trim * 1.1, st0 * m);
        c *= 1.0 + (0.3 * st0 * (1.0 - st1) - 0.4 * (1.0 - st0) * st1) * m;
        // A hood over the window: on the first two floors of the rich fronts segmental, triangular
        // or straight by building, the segmental on consoles ending in scrolls (M18, 8607); over
        // every upper window but the top row of the blocks, straight.
        if (hooded && !balc) {
          float yt = y1 + sw + 0.05, hwH = 0.5 * W + sw + 0.1;
          float xx = clamp(abs(p.x) / hwH, 0.0, 1.0);
          float rise = style == ${_u.Block} || hkF < 0.34 ? 0.0 : hkF < 0.67 ? 0.26 * sqrt(1.0 - xx * xx) : 0.34 * (1.0 - xx);
          if (rich && hkF >= 0.34 && hkF < 0.67) {
            vec2 qa = vec2(abs(p.x), p.y);
            float scr = max(praEll(qa, vec2(hwH, yt + 0.05), vec2(0.085), w2), praBox(qa, vec2(hwH - 0.15, yt - 0.32), vec2(hwH - 0.03, yt), w2));
            float scrU = max(praEll(qa + up, vec2(hwH, yt + 0.05), vec2(0.085), w2), praBox(qa + up, vec2(hwH - 0.15, yt - 0.32), vec2(hwH - 0.03, yt), w2));
            c = mix(c, trim * 1.1, scr * m);
            c *= 1.0 + (0.25 * scr * (1.0 - scrU) - 0.35 * (1.0 - scr) * scrU) * m;
          }
          float span2 = praStep(-hwH, p.x, wu) - praStep(hwH, p.x, wu);
          float hood = span2 * (praStep(yt, p.y, wv) - praStep(yt + 0.14 + rise, p.y, wv));
          float hoodSh = praBox(p, vec2(-hwH + 0.05, yt - 0.08), vec2(hwH - 0.05, yt), w2);
          c = mix(c, trim * 1.12, hood * m);
          c *= 1.0 - 0.4 * hoodSh * m;
          // In a segmental or triangular pediment, a shell in relief.
          if (rich && hkF >= 0.34 && fl < 1.5) {
            vec2 q = p - vec2(0.0, yt + 0.03);
            float s0 = praShell(q, w2), s1 = praShell(q + up, w2);
            c *= 1.0 + (0.3 * s0 * (1.0 - s1) - 0.4 * (1.0 - s0) * s1 + 0.08 * s0) * m;
          }
        }
        // The window: a casement with a frame, a mullion and a transom two thirds up, the upper
        // panes taking more sky; a round head has its fan of bars; a balcony's window is a door
        // down to the balcony's floor, panelled below the sill.
        float fw = 0.07, yT = arch ? ys : y0 + 0.66 * (y1 - y0);
        float open = rect, panes;
        if (arch) panes = praArch(p, 0.5 * W - fw, y0 + fw, ys, w2);
        else panes = praBox(p, vec2(-0.5 * W + fw, y0 + fw), vec2(0.5 * W - fw, y1 - fw), w2);
        if (balc) open = max(open, praBox(p, vec2(-0.5 * W, yb), vec2(0.5 * W, y0), w2));
        float bars = max(praBox(p, vec2(-0.035, y0), vec2(0.035, y1), w2), praBox(p, vec2(-0.5 * W, yT - 0.035), vec2(0.5 * W, yT + 0.035), w2));
        // M18: the old fronts' casements in six panes, a second transom a third of the way up (8607).
        if (rich && !arch && !gf) { float yT2 = y0 + 0.33 * (y1 - y0); bars = max(bars, praBox(p, vec2(-0.5 * W, yT2 - 0.03), vec2(0.5 * W, yT2 + 0.03), w2)); }
        if (arch) {
          vec2 qf = p - vec2(0.0, ys);
          bars = max(bars, max(praBar(qf, vec2(-0.7071, 0.7071), 0.03, w2), praBar(qf, vec2(0.7071, 0.7071), 0.03, w2)) * praStep(ys, p.y, wv));
        }
        if (!door) {
          frame = clamp(open - panes * (1.0 - bars), 0.0, 1.0) * m;
          win = mix(win, open, m);
        }
        glass += vec3(0.03, 0.035, 0.04) * praStep(yT, p.y, wv) * m;
        // Balconies: a slab on two consoles, its shadow on the wall under it, an iron railing.
        for (int k = 0; k < 2; k++) {
          if (k == 0 ? !balc : !balcUp) continue;
          vec2 q = p - vec2(0.0, float(k) * sh);
          float bw = 0.5 * W + 0.45;
          float slab = praBox(q, vec2(-bw, yb - 0.16), vec2(bw, yb), w2);
          float cons = praBox(vec2(abs(q.x), q.y), vec2(bw - 0.3, yb - 0.5), vec2(bw - 0.14, yb - 0.16), w2);
          float under = praBox(q, vec2(-bw + 0.06, yb - 0.55), vec2(bw - 0.06, yb - 0.16), w2);
          c *= 1.0 - 0.45 * under * (1.0 - cons) * mCell;
          c = mix(c, trim * 0.92, cons * mCell);
          c = mix(c, trim * 1.15, slab * mCell);
          if (k == 0) {
            float rails = max(praBox(q, vec2(-bw, yb + 0.9), vec2(bw, yb + 0.95), w2), praBox(q, vec2(-bw, yb + 0.03), vec2(bw, yb + 0.07), w2));
            float bal = praPulse((q.x + bw) / 0.11, 0.0, 0.2, wu / 0.11) * praBox(q, vec2(-bw, yb), vec2(bw, yb + 0.92), w2);
            ovC = vec3(0.025, 0.028, 0.028);
            // The railing is geometry where the relief is built (M14).
            ovA = max(ovA, max(rails, bal) * mCell * (1.0 - uRelief));
          }
        }
        if (door) {
          // The portal: a stone frame round the opening, round-headed on most baroque and palace
          // fronts with a keystone, straight under a cornice on the rest; the leaves dark painted
          // wood with raised panels; a fanlight or a transom light of glass above them.
          float Wd = min(rich ? 1.7 : 1.3, span - 0.7), Hd = min(sh - 0.7, rich ? 3.1 : 2.6);
          bool roundTop = style == ${_u.Baroque} || style == ${_u.Palace} ? hd < 0.6 : hd < 0.25;
          float ps = rich ? 0.3 : 0.18;
          float yS = roundTop ? Hd - 0.5 * Wd : Hd - 0.5;
          float hole = roundTop ? praArch(p, 0.5 * Wd, 0.0, yS, w2) : praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, Hd), w2);
          float dfr = (roundTop ? praArch(p, 0.5 * Wd + ps, 0.0, yS, w2) : praBox(p, vec2(-0.5 * Wd - ps, 0.0), vec2(0.5 * Wd + ps, Hd + ps), w2)) - hole;
          vec3 stoneC = rich ? mix(trim, vec3(0.6, 0.58, 0.53), 0.5) : trim * 1.05;
          c = mix(c, stoneC, dfr * mCell);
          if (roundTop) {
            float key = praBox(p, vec2(-0.13, Hd - 0.08), vec2(0.13, Hd + ps + 0.1), w2);
            c = mix(c, stoneC * 1.12, key * mCell);
          } else if (rich) {
            float cor = praBox(p, vec2(-0.5 * Wd - ps - 0.15, Hd + ps), vec2(0.5 * Wd + ps + 0.15, Hd + ps + 0.17), w2);
            c = mix(c, stoneC * 1.12, cor * mCell);
            c *= 1.0 - 0.4 * praBox(p, vec2(-0.5 * Wd - ps - 0.1, Hd + ps - 0.08), vec2(0.5 * Wd + ps + 0.1, Hd + ps), w2) * mCell * (1.0 - cor);
          }
          // Glass above the leaves, with bars.
          float fan = clamp(hole - praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, yS + 0.04), w2), 0.0, 1.0);
          vec2 qf = p - vec2(0.0, yS);
          float fb = roundTop
            ? max(max(praBar(qf, vec2(-0.7071, 0.7071), 0.025, w2), praBar(qf, vec2(0.7071, 0.7071), 0.025, w2)), praBar(qf, vec2(1.0, 0.0), 0.025, w2))
            : praBar(qf, vec2(1.0, 0.0), 0.025, w2);
          fb = max(fb, fan - (roundTop ? praEll(p, vec2(0.0, yS), vec2(0.5 * Wd - 0.06), w2) : praBox(p, vec2(-0.5 * Wd + 0.06, yS + 0.1), vec2(0.5 * Wd - 0.06, Hd - 0.06), w2)));
          frame = clamp(fan * fb, 0.0, 1.0) * mCell;
          win = mix(win, fan, mCell);
          frameC = vec3(0.06, 0.05, 0.04);
          // The leaves.
          float leaves = praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, yS + 0.04), w2);
          float hw2 = 0.5 * Wd;
          vec2 a2 = vec2(abs(p.x), p.y);
          float pan = praBox(a2, vec2(0.1, 0.25), vec2(hw2 - 0.1, 0.4 * yS), w2) + praBox(a2, vec2(0.1, 0.48 * yS), vec2(hw2 - 0.1, yS - 0.14), w2);
          float panU = praBox(a2 + up, vec2(0.1, 0.25), vec2(hw2 - 0.1, 0.4 * yS), w2) + praBox(a2 + up, vec2(0.1, 0.48 * yS), vec2(hw2 - 0.1, yS - 0.14), w2);
          float wk = praRand(us, ${mu.Wood}u);
          vec3 wood = wk < 0.5 ? vec3(0.07, 0.038, 0.022) : wk < 0.75 ? vec3(0.028, 0.055, 0.038) : vec3(0.1, 0.03, 0.022);
          wood *= 1.0 + 0.5 * pan * (1.0 - panU) - 0.4 * (1.0 - pan) * panU;
          wood *= 1.0 - 0.6 * praBox(p, vec2(-0.012, 0.0), vec2(0.012, yS), w2);
          ovC = wood;
          ovA = leaves * mCell;
        }
      }
      // Shutters (design.md §8.2) on some plain houses and villas, not on the core's baroque fronts,
      // which the photographs show without: two painted leaves beside each window, louvred, in
      // faded colours; big enough to show from the drone.
      float shK = praRand(us, ${mu.Shutters}u);
      if (style == ${_u.House} && shK < 0.12 && party < 0.5 && 2.0 * A.y < span - 0.4) {
        float rows = praPulse(r, a, b, wr) * upper + (B.y > 0.5 ? 0.0 : praStep(0.0, r, wr) * (1.0 - praStep(1.0, r, wr)) * praPulse(r, 0.3, min(0.88, 0.3 + A.z / sh), wr));
        float leaf = (praPulse(cc, 0.5 + hw, 0.5 + 2.0 * hw, wc) + praPulse(cc, 0.5 - 2.0 * hw, 0.5 - hw, wc)) * inside * rows;
        vec3 shC = shK < 0.045 ? vec3(0.1, 0.17, 0.11) : shK < 0.07 ? vec3(0.17, 0.09, 0.045) : shK < 0.095 ? vec3(0.24, 0.29, 0.23) : vec3(0.21, 0.065, 0.045);
        float lv = v / 0.07;
        shC *= 1.0 - 0.3 * praPulse(lv, 0.0, 0.35, max(fwidth(lv), 1e-4)) * (1.0 - smoothstep(0.3, 0.7, fwidth(lv)));
        c = mix(c, shC, leaf);
      }
      #endif
      glass = mix(glass, frameC, (orn ? 0.22 : 0.12) * (1.0 - near));
      // Beyond the details' range the trim keeps its share of the window cells (surrounds, aprons,
      // hoods: a fifth of a rich front's), so a two-tone front stays two-toned from the drone (M18).
      if (orn) c = mix(c, trim, (rich ? 0.2 : 0.1) * (1.0 - near) * uDetail * inside * upper);
      c = mix(c, glass, win);
      c = mix(c, frameC, frame * win);
      c = mix(c, ovC, ovA);
      // At night a quarter of the windows are lit, and half the shopfronts: warm, some whiter.
      float hl = praHash(vec2(floor(cc) * 1.7 + seed * 5.3, floor(r) * 2.3 + seed));
      float lit = step(hl, r < 1.0 ? 0.4 : 0.18);
      vec3 warm = mix(vec3(1.0, 0.38, 0.1), vec3(1.0, 0.62, 0.3), praHash(vec2(hl * 7.0, seed)));
      praEmit += warm * win * (1.0 - 0.7 * frame) * lit * 0.015;
    }
    diffuseColor.rgb = c;
    praGlass = win * (1.0 - frame);
    // Where a street falls away along a front, the wall below the building's ground is at the
    // street's level for the lamps' pools, not unlit.
    praAbove = max(v, 0.0);
  } else if (kind == ${cu.Roof} || kind == ${cu.DormerRoof}) {
    float u = vFacade.x, s = vFacade.y, smax = vFacade.z;
    float course = s / 0.34;
    float cw = max(fwidth(course), 1e-4);
    float line = praPulse(course, 0.0, 0.18, cw);
    float colc = u / 0.24 + 0.5 * floor(course);
    float groove = praPulse(colc, 0.0, 0.14, max(fwidth(colc), 1e-4));
    float colTone = 0.94 + 0.12 * praHash(vec2(floor(colc), floor(course)));
    float fadeCols = 1.0 - smoothstep(0.3, 0.7, fwidth(colc));
    float tile = (1.0 - 0.32 * line - 0.07 * groove) * mix(1.0, colTone, fadeCols);
    float n1 = praNoise(wp.xz * 0.22 + seed), n2 = praNoise(wp.xz * 1.1 + seed * 0.37);
    float weather = 0.84 + 0.26 * n1 + 0.12 * (n2 - 0.5);
    float ridge = smoothstep(smax - 0.6, smax - 0.25, s) * step(0.8, smax);
    float north = clamp(-normalize(vPraN).z, 0.0, 1.0);
    vec3 c = diffuseColor.rgb * tile * weather * (1.0 + 0.16 * ridge);
    // Lichen and grime on north slopes, patchy.
    c = mix(c, c * vec3(0.7, 0.76, 0.64), north * (0.25 + 0.5 * n2) * 0.7);
    // Skylights, one in about twelve cells of 3.4 by 2.6 m on the tiled slopes (8884): dark glass in
    // a pale metal frame, fading out beyond a few hundred metres.
    float su = max(fwidth(u), 1e-4), ss = max(fwidth(s), 1e-4);
    float nearR = kind == ${cu.Roof} ? (1.0 - smoothstep(0.15, 0.4, max(su, ss))) * uDetail : 0.0;
    if (nearR > 0.0) {
      vec2 cell = vec2(u / 3.4, s / 2.6), id = floor(cell);
      float on = step(praHash(id + seed * 0.71), 0.085) * step(1.0, id.y * 2.6) * step((id.y + 1.0) * 2.6, smax - 1.0);
      vec2 q = (fract(cell) - 0.5) * vec2(3.4, 2.6), w2 = vec2(su, ss);
      float pane = praBox(q, vec2(-0.39, -0.55), vec2(0.39, 0.55), w2) * on * nearR;
      float gl = praBox(q, vec2(-0.33, -0.49), vec2(0.33, 0.49), w2) * on * nearR;
      c = mix(c, vec3(0.32, 0.32, 0.3), pane);
      c = mix(c, vec3(0.03, 0.036, 0.044), gl);
      praGlass = gl;
    }
    diffuseColor.rgb = c;
  } else if (kind == ${cu.FlatRoof}) {
    diffuseColor.rgb *= 0.86 + 0.22 * praNoise(wp.xz * 0.4 + seed) + 0.08 * (praNoise(wp.xz * 2.7) - 0.5);
  } else if (kind == ${cu.Gable}) {
    if (party > 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3333))), 0.35) * 0.86;
  } else if (kind == ${cu.Chimney}) {
    float v = vFacade.z, H = vFacade.w;
    // Most stacks in the core are plastered white or cream (8884), the rest the house's colour.
    float ck = praHash(vec2(seed * 5.9, 1.3));
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.84, 0.81, 0.74), vec3(0.72, 0.68, 0.6), ck), step(ck, 0.7));
    diffuseColor.rgb *= mix(1.0, 0.42, praStep(H - 0.28, v, max(fwidth(v), 1e-4)));
  } else if (kind == ${cu.DormerFront}) {
    float x = vFacade.x / max(vFacade.y, 0.1), y = vFacade.z / max(vFacade.w, 0.1);
    float wx = fwidth(x), wy = fwidth(y);
    float win = (praStep(0.2, x, wx) - praStep(0.8, x, wx)) * (praStep(0.18, y, wy) - praStep(0.86, y, wy));
    // The front white (8884), the window a casement with a cross.
    vec3 front = mix(diffuseColor.rgb, vec3(0.84, 0.81, 0.74), 0.7);
    float fx = 0.06 / max(vFacade.y, 0.1), fy = 0.06 / max(vFacade.w, 0.1);
    float panes = (praStep(0.2 + fx, x, wx) - praStep(0.8 - fx, x, wx)) * (praStep(0.18 + fy, y, wy) - praStep(0.86 - fy, y, wy));
    float bars = max(praStep(0.5 - 0.5 * fx, x, wx) - praStep(0.5 + 0.5 * fx, x, wx), praStep(0.62 - 0.5 * fy, y, wy) - praStep(0.62 + 0.5 * fy, y, wy));
    float glassA = win * panes * (1.0 - bars);
    diffuseColor.rgb = mix(front, vec3(0.04, 0.045, 0.05), glassA);
    praGlass = glassA;
  } else if (kind == ${cu.Stone}) {
    // Courses of blocks (ashlar, brick, rubble) or setts, each block its own tone, the joints
    // darker; then the blackening Prague sandstone takes on in patches and streaks, and grime at
    // the foot. Every pattern fades to its average below a pixel.
    float u = vFacade.x, v = vFacade.y, wea = vFacade.z;
    vec3 c = diffuseColor.rgb;
    float row = 0.0, col = 0.0, fade = 0.0;
    // M18: stone that carries the Blackened flag blackens stone by stone, in smaller, more varied
    // blocks (Týn's sandstone, 8607); the rest keeps the patches (granite and the quays read even).
    bool blocks = (bits & ${fu.Blackened}) != 0 && (style == ${lu.Ashlar} || style == ${lu.Rubble});
    if (style != ${lu.Render}) {
      vec2 cell = style == ${lu.Brick} ? vec2(0.29, 0.085) : style == ${lu.Rubble} ? vec2(0.62, 0.34) : style == ${lu.Setts} ? vec2(0.16, 0.16) : blocks ? vec2(0.75, 0.38) : vec2(0.95, 0.47);
      row = v / cell.y;
      float rw = max(fwidth(row), 1e-4);
      // M20: blackened sandstone's courses each take their own length of stone (8607's Týn).
      float rowLen = blocks ? 0.7 + 0.6 * praHash(vec2(floor(row) * 0.73, seed * 3.1)) : 1.0;
      col = u / (cell.x * rowLen) + (style == ${lu.Setts} ? 0.37 * floor(row) : 0.5 * floor(row));
      if (style == ${lu.Rubble}) col += 0.4 * praHash(vec2(floor(row), seed));
      float cw = max(fwidth(col), 1e-4);
      float jr = style == ${lu.Brick} ? 0.16 : style == ${lu.Setts} ? 0.14 : 0.06;
      float jc = style == ${lu.Brick} ? 0.05 : style == ${lu.Setts} ? 0.14 : 0.035;
      float joint = max(praPulse(row, 0.0, jr, rw), praPulse(col, 0.0, jc, cw));
      fade = 1.0 - smoothstep(0.25, 0.6, max(rw, cw));
      float tone = blocks ? 0.8 + 0.38 * praHash(vec2(floor(col) + seed * 1.7, floor(row))) : 0.88 + 0.24 * praHash(vec2(floor(col) + seed * 1.7, floor(row)));
      c *= mix(1.0, tone, fade);
      c *= 1.0 - (style == ${lu.Brick} ? 0.1 : 0.3) * joint;
    }
    float n1 = praNoise(vec2(u * 0.3, v * 0.07) + seed * 0.13), n2 = praNoise(vec2(u, v) * 0.9 + seed);
    float black = wea * smoothstep(0.3, 0.8, 0.65 * n1 + 0.45 * n2);
    if (blocks) {
      // M18: Prague sandstone blackens stone by stone (8607's Týn: pale blocks beside black ones).
      // The patches give the odds a stone is black; far off, the wall takes their average.
      // M20, measured on 8607's south tower: a third of the face's stones black and three in four
      // under the gallery, the corners black, and a black stone near black (a tenth of a pale one).
      // A prism's wall carries its length and its top's height (length + 256 × top), so the odds
      // rise toward its corners and over its top fifth, where the rain runs and lingers.
      // M21: the black under 8607's galleries is their cornice, parapet and shields, modelled now
      // (design.md §7.1); the last metres of wall under a top, sheltered, are paler than the face.
      float Lw = mod(vFacade.w, 256.0), r = vFacade.w >= 256.0 * 5.0 ? v / floor(vFacade.w / 256.0) : 0.0;
      float corner = Lw > 0.5 ? 1.0 - smoothstep(0.3, 1.6, min(u, Lw - u)) : 0.0;
      float high = smoothstep(0.66, 0.82, r), shelter = smoothstep(0.85, 0.9, r);
      float odds = wea * clamp(0.08 + 0.72 * smoothstep(0.42, 0.78, 0.65 * n1 + 0.45 * n2) + 0.3 * corner + 0.45 * high - 0.8 * shelter, 0.0, 0.92);
      float bh = praHash(vec2(floor(col) * 1.37 + seed * 0.71, floor(row) * 0.93 + 3.1));
      black = mix(odds, step(bh, odds) * (0.85 + 0.15 * fract(bh * 13.7)), fade);
      c = mix(c, c * vec3(0.15, 0.145, 0.14), black);
    } else c = mix(c, c * vec3(0.4, 0.39, 0.38), black);
    c *= mix(0.82, 1.0, smoothstep(0.0, 2.5, v));
    diffuseColor.rgb = c;
    praAbove = v;
  } else if (kind == ${cu.Metal}) {
    float u = vFacade.x, s = vFacade.y, smax = vFacade.z;
    vec3 c = diffuseColor.rgb;
    if (style == ${uu.Gold}) {
      c = vec3(0.78, 0.52, 0.2);
      praMetal = 1.0; praRough = 0.32;
    } else if (style == ${uu.Copper}) {
      // Standing seams down the slope, patina in streaks, darker where the run-off gathers.
      float k = u / 0.55;
      float seam = praPulse(k, 0.0, 0.1, max(fwidth(k), 1e-4));
      float n = praNoise(vec2(u * 0.7, s * 0.12) + seed), n3 = praNoise(wp.xz * 0.4 + wp.y * 0.3);
      c *= (1.0 - 0.16 * seam) * (0.84 + 0.26 * n + 0.1 * (n3 - 0.5));
      c *= mix(0.85, 1.0, smoothstep(0.0, 1.5, s));
      praRough = 0.55;
    } else if (style == ${uu.Glazed}) {
      // Glazed tiles in lozenges, 1.6 m across and 1.9 m up the slope: a pale lattice on the grey
      // field, each lozenge its own tone (St Vitus, 8809). The lattice box-filters to its average.
      float a = (u + 0.84 * s) / 1.6, b = (u - 0.84 * s) / 1.6;
      float wa = max(fwidth(a), 1e-4), wb = max(fwidth(b), 1e-4);
      float lattice = max(praPulse(a, 0.0, 0.12, wa), praPulse(b, 0.0, 0.12, wb));
      float fade = 1.0 - smoothstep(0.3, 0.7, max(wa, wb));
      float tone = 0.92 + 0.16 * praHash(vec2(floor(a), floor(b)) + seed);
      c *= (1.0 + 0.34 * lattice) * mix(1.0, tone, fade);
      praRough = 0.5;
    } else {
      // Slate and lead: small courses.
      float course = s / (style == ${uu.Slate} ? 0.24 : 0.7);
      float cw = max(fwidth(course), 1e-4);
      float line = praPulse(course, 0.0, 0.16, cw);
      float colc = u / 0.32 + 0.5 * floor(course);
      float fade = 1.0 - smoothstep(0.3, 0.7, max(fwidth(colc), cw));
      float tone = 0.9 + 0.18 * praHash(vec2(floor(colc), floor(course)) + seed);
      float n = praNoise(wp.xz * 0.3 + wp.y * 0.2 + seed);
      c *= (1.0 - 0.22 * line) * mix(1.0, tone, fade) * (0.9 + 0.2 * n);
      praRough = 0.6;
    }
    diffuseColor.rgb = c;
  } else if (kind == ${cu.Glass}) {
    // A window: dark glass in stone tracery (mullions, and a transom where the head begins) or a
    // rose; coordinates across and up in metres, with the window's width and height.
    float x = vFacade.x, y = vFacade.y, W = max(vFacade.z, 0.1), H = max(vFacade.w, 0.1);
    vec3 g = vec3(0.03, 0.036, 0.044) * (0.75 + 0.6 * praHash(vec2(seed, floor(y / 2.0))));
    float stone = 0.0;
    if (style == ${du.Curtain}) {
      // A curtain wall: pale, half-mirrored glass in a light frame of mullions and floors.
      g = vec3(0.3, 0.35, 0.38);
      float k = x / 1.5, f = y / 3.1;
      stone = max(praPulse(k, 0.0, 0.06, max(fwidth(k), 1e-4)), praPulse(f, 0.0, 0.08, max(fwidth(f), 1e-4)));
      praMetal = 0.55 * (1.0 - stone);
    } else if (style == ${du.Tracery}) {
      float n = max(2.0, floor(W / 0.85 + 0.5));
      float k = x / W * n;
      stone = praPulse(k + 0.06, 0.0, 0.12, max(fwidth(k), 1e-4)) * step(0.02, x / W) * step(x / W, 0.98);
      float bars = y / 1.1;
      stone = max(stone, 0.5 * praPulse(bars, 0.0, 0.05, max(fwidth(bars), 1e-4)));
    } else if (style == ${du.Casement}) {
      // White frames round two leaves, a mullion between them, panes about 0.55 m high (8607).
      // M20: the frame, the mullion and, on a tall window, the transom at two thirds are held at
      // every distance, box-filtered, so that from the square a window still reads as a white
      // cross on dark glass (8607: they had faded to an even grey from 60 m); only the panes' thin
      // bars fade to their average. Behind the glass, curtains in about a third of the windows,
      // pale; the rest dark.
      float rows = max(2.0, floor(H / 0.55 + 0.5));
      float fx = x / W, fy = y / H;
      float bw = 0.07, wx = max(fwidth(x), 1e-4), wy = max(fwidth(y), 1e-4);
      float frame = 1.0 - (praStep(bw, x, wx) - praStep(W - bw, x, wx)) * (praStep(bw, y, wy) - praStep(H - bw, y, wy));
      float mull = praPulse(fx, 0.5 - 0.045 / W, 0.5 + 0.045 / W, max(fwidth(fx), 1e-4));
      float tran = H > 1.6 ? praPulse(fy, 0.66 - 0.035 / H, 0.66 + 0.035 / H, max(fwidth(fy), 1e-4)) : 0.0;
      float tr = fy * rows;
      float hb = 0.016 * rows / H;
      float bars = praPulse(tr + hb, 0.0, 2.0 * hb, max(fwidth(tr), 1e-4)) * step(0.5, tr) * step(tr, rows - 0.5);
      float fade = 1.0 - smoothstep(0.02, 0.05, max(wx, wy));
      stone = max(max(frame, mull), max(tran, mix(0.04, bars, fade)));
      // The window's centre in the world, from the fragment, its place in the window and the
      // wall's normal (the window's across is the normal turned a right angle about the vertical).
      vec3 nw = normalize(vPraN);
      vec3 centre = wp + (0.5 * W - x) * vec3(nw.z, 0.0, -nw.x) + vec3(0.0, 0.5 * H - y, 0.0);
      float curtain = step(praHash(floor(centre.xz * 4.0) + floor(centre.y * 4.0) * 1.7 + seed), 0.35);
      g = mix(g, vec3(0.22, 0.21, 0.2) * (0.8 + 0.4 * praHash(floor(centre.xz * 4.0) + 5.3)), curtain);
    } else if (style == ${du.Rose}) {
      vec2 d = vec2(x - W * 0.5, y - H * 0.5) / (0.5 * W);
      float r = length(d), a = atan(d.y, d.x) * 12.0 / 6.2832;
      stone = max(praPulse(a, 0.0, 0.12, max(fwidth(a), 1e-4)) * step(0.25, r), 1.0 - smoothstep(0.18, 0.25, r) + praPulse(r * 3.0, 0.0, 0.1, max(fwidth(r * 3.0), 1e-4)));
    }
    stone = clamp(stone, 0.0, 1.0);
    diffuseColor.rgb = mix(g, diffuseColor.rgb, stone);
    praGlass = 1.0 - stone;
  } else if (kind == ${cu.Opening}) {
    praRough = 1.0;
  } else if (kind == ${cu.Trim}) {
    praAbove = vFacade.z;
  }
  // Floodlit landmarks: warm light from below on the walls, less on the roofs, fading upward. The
  // dim flag (M17) gives a third of it: the quays' fronts under the embankment lamps, Charles
  // Bridge's body under its lanterns.
  // Both bits together: three floodlights, for the Castle and St Vitus, the brightest lit of all
  // (9553, and 9547's far Castle).
  float praFloodDim = mod(floor(vInfo.z / 16.0 + 0.01), 2.0) > 0.5 ? 1.0 : 0.0;
  float praFlood = mod(floor(vInfo.z / 2.0 + 0.01), 2.0) > 0.5 ? 1.0 + 2.0 * praFloodDim : 0.25 * praFloodDim;
  if (praFlood > 0.0) {
    float facing = 1.0 - 0.6 * abs(normalize(vPraN).y);
    float up = praAbove >= 0.0 ? praAbove : 20.0;
    // Sodium and halogen through the blue hour's daylight white balance: deep orange (9542: the
    // tower and the museum a quarter of the way to white, orange through and through; M17 took
    // the yellow out, and the sky's light off the stone, which had made it grey).
    praEmit += diffuseColor.rgb * vec3(1.0, 0.3, 0.05) * 0.02 * praFlood * facing * (0.5 + 0.5 * exp(-up / 30.0));
  }
  if (kind == ${cu.Glass} && style != ${du.Curtain}) praEmit += vec3(1.0, 0.6, 0.25) * 0.008 * praGlass;
  if (kind == ${cu.Glass} && style == ${du.Curtain}) praEmit += vec3(1.0, 0.86, 0.66) * 0.03 * praGlass;
}
vec3 praPoolE = praAbove >= 0.0 ? diffuseColor.rgb * praLampPool(vPraWorld, praAbove) * 0.07 : vec3(0.0);
`,bu={value:1},xu={value:1};function Su(){let e=new da({vertexColors:!0,roughness:.88,metalness:0}),t=gu.map(e=>new qt(e.cell,e.winW,e.winH,e.sill)),n=gu.map(e=>new qt(e.storey,e.ground,0,0));return Yl(e,e=>{e.uniforms.uStyleA={value:t},e.uniforms.uStyleB={value:n},e.uniforms.uDetail=bu,e.uniforms.uRelief=xu,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec4 aFacade;
attribute vec4 aInfo;
varying vec4 vFacade;
flat varying vec4 vInfo;
varying vec3 vPraN;`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
vFacade = aFacade;
vInfo = aInfo;
vPraN = objectNormal;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${vu}`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>\n${yu}\nif (praRough >= 0.0) roughnessFactor = praRough;\nroughnessFactor = mix(roughnessFactor, 0.14, praGlass);`).replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>
metalnessFactor = max(metalnessFactor, praMetal);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
totalEmissiveRadiance += praEmit * uCityLights + praPoolE;`)},`-buildings`)}var Cu=class{target;matrix=new W;camera=new Ga;planeY=NaN;clip=new Br(new H(0,1,0),0);range=2200;scale;constructor(e=.4){this.scale=e,this.target=new Yt(1,1,{type:g,depthBuffer:!0}),this.target.texture.minFilter=this.target.texture.magFilter=o,this.target.texture.generateMipmaps=!1,this.camera.layers.set(1)}setSize(e,t){this.target.setSize(Math.max(1,Math.round(e*this.scale)),Math.max(1,Math.round(t*this.scale)))}render(e,t,n,r){let i=new H().setFromMatrixPosition(n.matrixWorld);if(i.y<=r+.05){this.planeY=NaN;return}this.planeY=r;let a=e=>e.set(e.x,2*r-e.y,e.z),o=new W().extractRotation(n.matrixWorld),s=new H(0,0,-1).applyMatrix4(o).add(i),c=new H(0,1,0).applyMatrix4(o),l=this.camera;l.position.copy(a(i.clone())),l.up.set(c.x,-c.y,c.z),l.lookAt(a(s)),l.updateMatrixWorld(),l.projectionMatrix.copy(n.projectionMatrix),l.projectionMatrixInverse.copy(n.projectionMatrixInverse),this.matrix.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1).multiply(l.projectionMatrix).multiply(l.matrixWorldInverse),this.clip.constant=-(r-.3);let u={clip:e.clippingPlanes,shadows:e.shadowMap.autoUpdate,ao:Y.uAOOn.value,target:e.getRenderTarget(),alpha:e.getClearAlpha()},d=e.getClearColor(new G);e.clippingPlanes=[this.clip],e.shadowMap.autoUpdate=!1,Y.uAOOn.value=0;let f=[],p=l.position;t.traverseVisible(e=>{let t=e;if(!t.isMesh||t.isInstancedMesh||!t.layers.isEnabled(1)||!t.geometry.boundingSphere)return;let n=t.geometry.boundingSphere,r=new H().copy(n.center).applyMatrix4(t.matrixWorld);Math.hypot(r.x-p.x,r.z-p.z)-n.radius>this.range&&(t.visible=!1,f.push(t))}),e.setRenderTarget(this.target),e.setClearColor(0,0),e.clear(!0,!0,!1),Y.uMirrorPass.value=1,e.render(t,l),Y.uMirrorPass.value=0,e.setClearColor(d,u.alpha),e.setRenderTarget(u.target);for(let e of f)e.visible=!0;e.clippingPlanes=u.clip,e.shadowMap.autoUpdate=u.shadows,Y.uAOOn.value=u.ao}};new Uint8Array(256).map((e,t)=>{let n=t/255;return Math.round(255*(n<=.04045?n/12.92:((n+.055)/1.055)**2.4))}),_u.Baroque,_u.OldTown,_u.Palace,_u.Block,_u.House,_u.Baroque,_u.OldTown,_u.Palace;var wu=class{group=new Dn;material=Su();details=[];workers=[];pending=new Map;queue=[];base;tileSize;world;tileWorker=new Map;tileOrigin=new Map;chunks=new Map;inflight=0;arrivals=[];loaded=0;total=0;detailRange=1600;reliefRange=300;reliefSettled=!0;reliefTriangles=0;constructor(e,t,n){this.base=e,this.tileSize=t,this.world=n;let r=Math.max(2,Math.min(4,(navigator.hardwareConcurrency||4)-1));for(let e=0;e<r;e++){let e=new Worker(new URL(`/prague-drone/assets/tiles.worker-CviTq0E9.js`,``+import.meta.url),{type:`module`});e.onmessage=t=>this.onMessage(e,t.data),this.workers.push(e)}}load(e,t){let n=e=>[this.world.xMin+(e.i+.5)*this.tileSize,this.world.zMin+(e.j+.5)*this.tileSize];this.queue=e.slice().sort((e,r)=>{let[i,a]=n(e),[o,s]=n(r);return Math.hypot(i-t.x,a-t.z)-Math.hypot(o-t.x,s-t.z)}),this.total=e.length;for(let e of this.workers)this.next(e)}update(e){for(let t of this.details){let n=t.geometry.boundingSphere;t.visible=Math.hypot(e.x-(n.center.x+t.position.x),e.z-(n.center.z+t.position.z))-n.radius<this.detailRange}this.updateRelief(e)}updateRelief(e){let t=this.arrivals.shift();t&&this.place(t.c,t.mesh,t.far);let n=this.reliefRange,r=this.tileSize/2,i=Math.round(this.tileSize/100),a=(t,n,r)=>Math.hypot(Math.max(t-e.x,0,e.x-t-r),Math.max(n-e.z,0,e.z-n-r)),o=[];if(n>0){for(let[e,{ox:t,oz:s}]of this.tileOrigin)if(!(a(t-r,s-r,this.tileSize)>n))for(let c=0;c<i;c++)for(let l=0;l<i;l++){let i=t-r+c*100,u=s-r+l*100,d=a(i,u,100);if(d>n)continue;let f=`${e}/${c}_${l}`,p=this.chunks.get(f);p||(p={id:e,ci:c,cj:l,x0:i,z0:u,want:0,built:-1,pending:!1,mesh:null,d},this.chunks.set(f,p)),p.d=d;let m=Math.min(140,n);p.built<0?p.want=d<m?0:1:p.built===1&&d<m-20?p.want=0:p.built===0&&d>m+20&&(p.want=1),o.push(p)}}for(let[e,t]of this.chunks)t.pending||(a(t.x0,t.z0,100)>n+50||n===0)&&(t.mesh&&this.drop(t),this.chunks.delete(e));o.sort((e,t)=>e.d-t.d);for(let e of o){if(this.inflight>=2)break;if(e.pending||e.built===e.want)continue;let t=this.tileWorker.get(e.id);t&&(e.pending=!0,this.inflight++,t.postMessage({id:e.id,relief:{ci:e.ci,cj:e.cj,tile:this.tileSize,far:e.want===1}}))}this.reliefSettled=o.every(e=>e.built===e.want)&&this.arrivals.length===0}drop(e){e.mesh&&=(this.group.remove(e.mesh),this.reliefTriangles-=e.mesh.geometry.index.count/3,e.mesh.geometry.dispose(),null)}place(e,t,n){if(e.pending=!1,this.chunks.get(`${e.id}/${e.ci}_${e.cj}`)!==e)return;this.drop(e),e.built=+!!n;let r=this.tileOrigin.get(e.id);if(t.index.length&&r){let i=Tu(t,this.material,r.ox,r.oz);i.name=`relief ${e.id} ${e.ci},${e.cj}${n?` far`:``}`,e.mesh=i,this.reliefTriangles+=t.index.length/3,this.group.add(i)}}next(e){let t=this.queue.shift();if(!t)return;let n=`${t.i}_${t.j}`;this.pending.set(n,t),e.postMessage({url:`${this.base}/${t.file}`,id:n})}onMessage(e,t){if(t.relief){this.inflight--;let e=this.chunks.get(`${t.id}/${t.relief.ci}_${t.relief.cj}`);if(t.error&&console.warn(`relief`,t.id,t.error),!e)return;t.mesh?this.arrivals.push({c:e,mesh:t.mesh,far:t.relief.far}):(e.pending=!1,e.built=e.want);return}if(this.pending.delete(t.id),t.error)console.warn(`tile`,t.id,t.error);else if(t.meta&&t.main&&t.detail){if(this.tileWorker.set(t.id,e),this.tileOrigin.set(t.id,{ox:t.meta.ox,oz:t.meta.oz}),t.main.index.length){let e=Tu(t.main,this.material,t.meta.ox,t.meta.oz);e.layers.enable(1),this.group.add(e)}if(t.detail.index.length){let e=Tu(t.detail,this.material,t.meta.ox,t.meta.oz);this.details.push(e),this.group.add(e)}}this.loaded++,this.next(e)}};function Tu(e,t,n,r){let i=new Nr;i.setAttribute(`position`,new yr(e.position,3)),i.setAttribute(`normal`,new yr(e.normal,3,!0)),i.setAttribute(`color`,new yr(e.color,3,!0)),i.setAttribute(`aFacade`,new yr(e.facade,4)),i.setAttribute(`aInfo`,new yr(e.info,4)),i.setIndex(new yr(e.index,1)),i.computeBoundingSphere();let a=new oi(i,t);return a.position.set(n,0,r),a.updateMatrix(),a.matrixAutoUpdate=!1,a.castShadow=!0,a.receiveShadow=!0,a}var Eu=1e3,Du=900,Ou=250,ku=600,Au=300,ju=150,Mu=1.435,Nu=5.6,Pu=450,Fu=class{group=new Dn;pieces=[];constructor(e){let t=e.arrays.railStart,n=e.arrays.rail,r=e.arrays.lamp,i=e.arrays.wallLamp??new Float32Array,a=e.arrays.lamp2??new Float32Array,o=Yl(new da({color:`#8d8b86`,metalness:.45,roughness:.42})),s=new Map;for(let e=0;e+1<t.length;e++)for(let r=t[e];r<t[e+1]-1;r+=100){let i=Math.min(t[e+1],r+101),a=r+i>>1,o=`${Math.floor(n[a*3]/Eu)},${Math.floor(n[a*3+2]/Eu)}`;(s.get(o)??s.set(o,[]).get(o)).push(Array.from(n.subarray(r*3,i*3)))}for(let e of s.values()){let t=[],n=[];for(let r of e){let e=r.length/3;for(let i of[-1,1]){let a=t.length/3;for(let n=0;n<e;n++){let a=Math.max(0,n-1),o=Math.min(e-1,n+1),s=r[o*3]-r[a*3],c=r[o*3+2]-r[a*3+2],l=Math.hypot(s,c)||1;s/=l,c/=l;let u=-c,d=s,f=r[n*3]+u*i*Mu/2,p=r[n*3+2]+d*i*Mu/2,m=r[n*3+1]+.07;t.push(f-u*.04,m,p-d*.04,f+u*.04,m,p+d*.04)}for(let t=0;t+1<e;t++){let e=a+t*2;n.push(e,e+2,e+1,e+1,e+2,e+3)}}}let r=new Nr;r.setAttribute(`position`,new K(t,3));let i=new Float32Array(t.length);for(let e=1;e<i.length;e+=3)i[e]=1;r.setAttribute(`normal`,new yr(i,3)),r.setIndex(n),r.computeBoundingSphere();let a=new oi(r,o);o.side=2,a.receiveShadow=!0,a.matrixAutoUpdate=!1,this.add(a,r.boundingSphere)}let c=Yl(new Ci({color:`#ffffff`}),e=>{e.fragmentShader=e.fragmentShader.replace(`gl_FragColor.rgb = praAerial(`,`gl_FragColor.rgb *= texture2D(uSkyStats, vec2(0.375, 0.5)).rgb * 0.08;
	gl_FragColor.rgb = praAerial(`)},`-wire`);for(let e of s.values()){let t=[];for(let n of e)for(let e=0;e+5<n.length;e+=3)t.push(n[e],n[e+1]+Nu,n[e+2],n[e+3],n[e+4]+Nu,n[e+5]);let n=new Nr;n.setAttribute(`position`,new K(t,3)),n.computeBoundingSphere();let r=new Fi(n,c);r.matrixAutoUpdate=!1,this.add(r,n.boundingSphere,Pu)}let l=e.arrays.pole;if(l?.length){let e=Iu(`#3b423f`),t=Ru([new qi(.22,8.2,.22).translate(0,4.1,0),new qi(3.7,.09,.09).translate(1.85,6.4,0),Lu()]),n=Yl(new da({color:new G(...e),metalness:.4,roughness:.55})),r=new Map;for(let e=0;e<l.length;e+=4){let t=`${Math.floor(l[e]/Eu)},${Math.floor(l[e+2]/Eu)}`;(r.get(t)??r.set(t,[]).get(t)).push(l[e],l[e+1],l[e+2],l[e+3])}let i=new kt,a=new H(0,1,0),o=new H(1,1,1),s=new H;for(let e of r.values()){let r=e.length/4,c=new vi(t,n,r),l=new Xn;for(let t=0;t<r;t++)i.setFromAxisAngle(a,-e[t*4+3]),s.set(e[t*4],e[t*4+1],e[t*4+2]),c.setMatrixAt(t,new W().compose(s,i,o)),l.expandByPoint(s);let u=new Tr;l.getBoundingSphere(u),c.computeBoundingSphere(),c.castShadow=!0,c.receiveShadow=!0,this.add(c,u,600)}}let u=`#2c3430`,d=`#b3ae9f`,f=(e,t=1)=>[zu(new Ji(.2,.12,.46,4).rotateY(Math.PI/4),d),zu(new Ji(.045,.045,.1,4).translate(0,-.28,0),u),zu(new Yi(.27,.22,4).rotateY(Math.PI/4).translate(0,.34,0),u),zu(new qi(.3,.035,.3).translate(0,.23,0),u),zu(new Yi(.04,.16,4).translate(0,.53,0),u)].map(n=>n.scale(t,t,t).translate(0,e,0)),p=Ru([zu(new Ji(.06,.1,4.1,6).translate(0,2.05,0),u),zu(new Ji(.14,.16,.7,6).translate(0,.35,0),u),...f(4.4)]),m=.8,h=Ru([...f(4.4),zu(new qi(.05,.05,m).translate(0,4.98,-.8/2),u),zu(new qi(.04,.04,Math.hypot(m,.5)).rotateX(-Math.atan2(.5,m)).translate(0,4.73,-.8/2-.05),u),zu(new qi(.16,.7,.04).translate(0,4.75,-.8),u)]),g=.52,_=Ru([zu(new Ji(.17,.21,.9,6,1,!0).translate(0,.45,0),u),zu(new Ji(.12,.17,.25,6,1,!0).translate(0,1.02,0),u),zu(new Ji(.065,.1,2.75,6,1,!0).translate(0,2.5,0),u),zu(new Ji(.1,.1,.14,6,1,!0).translate(0,3.55,0),u),zu(new qi(1.1400000000000001,.06,.06).translate(0,3.72,0),u),...[-1,1].flatMap(e=>[zu(new qi(Math.hypot(.44,.4),.04,.04).rotateZ(e*Math.atan2(.4,.44)).translate(e*.6/2,3.5,0),u),zu(new Ji(.05,.07,.1,4,1,!0).translate(e*g,3.78,0),u),...f(4.25,1.35).map(t=>t.translate(e*g,0,0))]),zu(new Ji(.045,.065,.75,4,1,!0).translate(0,4.1,0),u),zu(new Qi(.085).translate(0,4.52,0),u),zu(new Yi(.035,.32,4,1,!0).translate(0,4.74,0),u)]),v=(e,t,n=1)=>zu(new qi(.34*n,.6*n,.34*n).translate(e,t,0),d),y=[Ru([zu(new Ji(.07,.12,4.1,4,1,!0).translate(0,2.05,0),u),v(0,4.45)]),Ru([v(0,4.45),zu(new qi(.05,.05,m).translate(0,4.98,-.8/2),u)]),Ru([zu(new Ji(.07,.15,4.4,4,1,!0).translate(0,2.2,0),u),zu(new qi(1.1400000000000001,.06,.06).translate(0,3.72,0),u),v(-.52,4.25,1.35),v(g,4.25,1.35)])],b=Yl(new da({vertexColors:!0,metalness:.3,roughness:.55})),x=new Map,S=(e,t,n,r,i)=>{let a=`${Math.floor(e/Ou)},${Math.floor(n/Ou)}`;(x.get(a)??x.set(a,[]).get(a)).push(e,t,n,r,i)};for(let e=0;e<r.length;e+=3)S(r[e],r[e+1],r[e+2],0,0);for(let e=0;e<i.length;e+=4)S(i[e],i[e+1],i[e+2],i[e+3],1);for(let e=0;e<a.length;e+=4)S(a[e],a[e+1],a[e+2],a[e+3],2);let C=new W,w=new W;for(let e of x.values())for(let t of[0,1,2]){let n=[];for(let r=0;r<e.length;r+=5)e[r+4]===t&&n.push(e[r],e[r+1],e[r+2],e[r+3]);let r=n.length/4;if(r)for(let e of[`near`,`far`]){let i=new vi(e===`near`?[p,h,_][t]:y[t],b,r),a=new Tr,o=new Xn;for(let e=0;e<r;e++)C.makeTranslation(n[e*4],n[e*4+1],n[e*4+2]),t&&C.multiply(w.makeRotationY(n[e*4+3])),i.setMatrixAt(e,C),o.expandByPoint(new H(n[e*4],n[e*4+1],n[e*4+2]));o.getBoundingSphere(a),i.computeBoundingSphere(),i.castShadow=!0,i.receiveShadow=!0,this.add(i,a,ku,e)}}}add(e,t,n,r){this.group.add(e),this.pieces.push({mesh:e,x:t.center.x,z:t.center.z,r:t.radius,range:n,lamp:r})}update(e){let t=Du+Math.max(0,e.y-200)*.5;for(let n of this.pieces){let r=Math.hypot(e.x-n.x,e.z-n.z)-n.r;if(n.mesh.visible=r<(n.range?n.range+Math.max(0,e.y-100)*.3:t),n.lamp){let e=r<ju;n.mesh.visible&&=n.lamp===`near`?e:!e,n.mesh.castShadow=r<Au}}}},Iu=e=>{let t=new G(e);return[t.r,t.g,t.b]};function Lu(){return new qi(Math.hypot(2.6,1.2),.06,.06).rotateZ(Math.atan2(1.2,2.6)).translate(1.3,5.8,0)}function Ru(e){let t=[],n=[],r=[];for(let i of e){let e=i.index?i.toNonIndexed():i;t.push(...e.getAttribute(`position`).array),n.push(...e.getAttribute(`normal`).array);let a=e.getAttribute(`color`);a&&r.push(...a.array)}let i=new Nr;return i.setAttribute(`position`,new K(t,3)),i.setAttribute(`normal`,new K(n,3)),r.length===t.length&&i.setAttribute(`color`,new K(r,3)),i}function zu(e,t){let n=e.index?e.toNonIndexed():e,r=new G(t),i=n.getAttribute(`position`).count,a=new Float32Array(i*3);for(let e=0;e<i;e++)a[e*3]=r.r,a[e*3+1]=r.g,a[e*3+2]=r.b;return n.setAttribute(`color`,new K(a,3)),n}var Bu=class{group=new Dn;fine=[];details=[];fines=[];detailRange=1400;fineRange=300;constructor(e,t){let n=e.arrays;for(let r of e.meta.items){let e=(e,t)=>e.subarray(r.v0*t,(r.v0+r.nv)*t),i=Tu({position:e(n.position,3),normal:e(n.normal,3),color:e(n.color,3),facade:e(n.facade,4),info:e(n.info,4),index:n.index.subarray(r.i0,r.i0+r.ni)},t,0,0);i.name=`${r.id}${r.tier===1?` detail`:r.tier===2?` fine`:``}`,this.group.add(i),r.tier===1?this.details.push({mesh:i,s:r.sphere}):r.tier===2&&(this.fines.push({mesh:i,s:r.sphere}),this.fine.push(i),i.castShadow=!1,i.visible=!1)}}update(e){for(let{mesh:t,s:n}of this.details)t.visible=Math.hypot(e.x-n[0],e.y-n[1],e.z-n[2])-n[3]<this.detailRange;for(let{mesh:t,s:n}of this.fines)t.visible=Math.hypot(e.x-n[0],e.y-n[1],e.z-n[2])-n[3]<this.fineRange}},Vu=1e3,Hu=`
uniform sampler2D tRipple;
uniform sampler2D tReflect;
uniform mat4 uReflectMatrix;
uniform float uReflectOn;
uniform vec2 uReflectTexel;
uniform float uReflectScale;
uniform float uRipple;
uniform float uTime;
varying vec2 vFlow;
varying float vFoam;
varying float vBank;
vec3 praRipN;
float praFoamK;
float praDist;
// The wind over the river, from the west-south-west, as the prevailing wind: its ripples run across it.
const vec2 WIND = vec2(0.9206, -0.3906);

// Slopes (d height / d x, d z) of the tiling ripple texture, carried along the flow in two phases.
vec2 praSlope(vec2 p, vec2 flow, float scale, float speed, float period) {
  float t = uTime / period;
  float a = fract(t), b = fract(t + 0.5);
  vec2 off = flow * speed * period / scale;
  vec2 sa = texture2D(tRipple, p / scale - off * a).rg * 2.0 - 1.0;
  vec2 sb = texture2D(tRipple, p / scale - off * b + 0.5).rg * 2.0 - 1.0;
  float wa = 1.0 - abs(2.0 * a - 1.0);
  return (sa * wa + sb * (1.0 - wa)) / scale;
}

// A long, low swell along the wind (M13): three sines, each moving at a deep-water wave's own
// speed, that sway the reflections slowly (8988, 8490) without a pattern to see.
vec2 praSwell(vec2 p, float t) {
  vec2 s = vec2(0.0);
  vec2 w1 = WIND, w2 = vec2(WIND.x * 0.94 - WIND.y * 0.34, WIND.x * 0.34 + WIND.y * 0.94), w3 = vec2(WIND.x * 0.94 + WIND.y * 0.34, -WIND.x * 0.34 + WIND.y * 0.94);
  float k1 = 6.2832 / 6.5, k2 = 6.2832 / 11.0, k3 = 6.2832 / 19.0;
  // Each train swells and fades along a slow envelope of its own, so no bands run across the river.
  float e1 = 0.55 + 0.45 * sin(dot(p, vec2(0.031, 0.047)) + t * 0.11);
  float e2 = 0.55 + 0.45 * sin(dot(p, vec2(-0.052, 0.024)) + 2.0 - t * 0.09);
  float e3 = 0.55 + 0.45 * sin(dot(p, vec2(0.018, -0.061)) + 4.0 + t * 0.07);
  s += w1 * (0.014 * e1 * cos(k1 * dot(p, w1) - sqrt(9.81 * k1) * t));
  s += w2 * (0.018 * e2 * cos(k2 * dot(p, w2) - sqrt(9.81 * k2) * t + 1.7));
  s += w3 * (0.014 * e3 * cos(k3 * dot(p, w3) - sqrt(9.81 * k3) * t + 4.1));
  return s;
}
`,Uu=`
{
  vec2 p = vPraWorld.xz;
  vec2 f = length(vFlow) > 0.01 ? normalize(vFlow) : vec2(0.0, -1.0);
  praDist = length(vPraWorld - cameraPosition);
  // The wind's fetch: glassy within a few metres of a wall or a bank, rough out in the stream.
  float bank = vBank * 255.0;
  float fetch = smoothstep(1.5, 14.0, bank), swellK = smoothstep(4.0, 40.0, bank);
  // A slow, smooth warp of the sampling point, so the tiling never shows as a pattern (8988).
  vec2 warp = 3.0 * vec2(sin(p.x * 0.083 + p.y * 0.047), cos(p.x * 0.039 - p.y * 0.091));
  vec2 pw = p + warp;
  // The current's ripples carried downstream, the wind's chop across them at two scales, the swell,
  // and near the eye the capillary ripples that give the sun its sparkle.
  // The small scales fade with distance, where many of their crests would share a pixel and
  // alias into a grid at a grazing angle (8988); the swell and the long ripples carry the far water.
  float midK = 1.0 - smoothstep(80.0, 500.0, praDist), smallK = 1.0 - smoothstep(30.0, 220.0, praDist);
  vec2 s = praSlope(p, f, 9.0, 0.55, 3.1) * 0.3 + praSlope(pw, f, 2.4, 0.55, 1.7) * 0.35 * midK;
  // Two tilings of the wind's chop at periods that share no multiple, one turned 31°, so that
  // seen at a grazing angle neither repeats as a grid (8988).
  vec2 pr = vec2(pw.x * 0.857 - pw.y * 0.515, pw.x * 0.515 + pw.y * 0.857);
  vec2 wr = vec2(WIND.x * 0.857 - WIND.y * 0.515, WIND.x * 0.515 + WIND.y * 0.857);
  s += (praSlope(pw, WIND, 3.2, 0.9, 2.3) * 0.5 + praSlope(pr, wr, 4.9, 1.0, 2.9) * 0.45 + praSlope(pw + 17.0, WIND, 0.95, 0.5, 0.9) * 0.45 * smallK) * fetch;
  s += praSwell(p, uTime) * swellK;
  float nearK = 1.0 - smoothstep(15.0, 80.0, praDist);
  s += praSlope(pw, WIND, 0.42, 0.35, 0.45) * 0.22 * fetch * nearK;
  // Over the weirs: quick streaks down the glacis.
  float foam = vFoam;
  if (foam > 0.0) {
    vec2 q = vec2(dot(p, vec2(-f.y, f.x)) * 0.9, dot(p, f) * 0.22 - uTime * 0.9);
    float n = texture2D(tRipple, q / 3.0).b * 0.6 + texture2D(tRipple, q / 1.1 + 0.3).b * 0.4;
    // Streaks: foam where the noise rises over what the band's strength leaves uncovered; never all
    // of it, so from the air the band keeps its streaks and does not read as a painted strip.
    praFoamK = smoothstep(1.2 - foam * 0.9, 1.42 - foam * 0.9, n) * smoothstep(0.05, 0.3, foam);
    s += praSlope(p, f, 1.3, 2.2, 0.7) * foam * 1.4;
  } else praFoamK = 0.0;
  praRipN = normalize(vec3(-s.x, 1.0, -s.y));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.55, 0.57, 0.56), praFoamK);
}
`,Wu=`
vec3 praWaterReflect(vec3 wp, vec3 N) {
  vec3 V = normalize(wp - cameraPosition);
  vec3 R = reflect(V, N);
  R.y = max(R.y, 0.015);
  R = normalize(R);
  // Ripples too small to see tilt the facets up and down: the water shows the sky over a band of
  // heights about the reflected ray. Seen low (8704, 8683) the facets tilted up show the blue
  // above the pale horizon; seen from above (8849, 8490) those tilted away show the paler sky
  // toward the horizon, and the river reads grey-blue, not navy.
  vec3 R1 = normalize(vec3(R.x, R.y + 0.12, R.z)), R2 = normalize(vec3(R.x, R.y + 0.3, R.z));
  vec3 R0 = normalize(vec3(R.x, max(0.015, R.y * 0.45), R.z));
  // Edge on, the eye sees mostly the facets turned toward it, which reflect higher.
  float g = smoothstep(0.03, 0.4, R.y);
  vec4 wt = mix(vec4(0.2, 0.35, 0.35, 0.1), vec4(0.35, 0.15, 0.1, 0.4), g);
  vec3 sky = aSky(R) * wt.x + aSky(R1) * wt.y + aSky(R2) * wt.z + aSky(R0) * wt.w;
  // Cumulus along the reflected ray, from the coverage map at the layer's middle.
  if (uCloud.x < 1.0) {
    vec3 c = wp + R * ((uCloud.z - wp.y) / R.y);
    float w = texture2D(uWeather, (c.xz - uWind) / 24000.0).r;
    float a = 0.85 * smoothstep(uCloud.x, uCloud.x + uCloud.w * 2.0, w) * smoothstep(0.02, 0.12, R.y);
    // Lit cumulus: a little brighter than the horizon sky under them.
    sky = mix(sky, texture2D(uSkyStats, vec2(0.625, 0.5)).rgb * 1.9, a);
  }
  // Under overcast the water lies a shade darker than the sky it carries (8988).
  sky = mix(sky, uOvercastSky * 0.8, uOvercast * smoothstep(0.0, 0.06, R.y));
  if (uReflectOn < 0.5) return sky;
  // The mirror, displaced by the ripples and drawn out into columns: ripples too small to see
  // still tilt the surface, by uRipple radians or so, and spread each reflection up and down the
  // screen by twice that. Taps jittered per pixel and frame; TAA smooths them.
  vec4 c = uReflectMatrix * vec4(wp, 1.0);
  vec2 uv = c.xy / c.w;
  float d = length(wp - cameraPosition);
  // A surface tilted by δ toward the eye turns the reflected ray up by 2δ: up the screen by
  // 2δ times the texture units per radian. Sideways tilts move it much less.
  vec2 hv = normalize(V.xz + vec2(1e-5, 0.0));
  float tiltV = dot(N.xz, -hv), tiltH = dot(N.xz, vec2(-hv.y, hv.x));
  // Seen at a grazing angle, the facets turned toward the eye show most, and they reflect higher:
  // the lookup leans toward the sky, keeping the far bank's reflection close under it.
  vec2 dist = vec2(tiltH * 0.3, tiltV * 1.1 - 2.5 * uRipple) * uReflectScale;
  // Reflections are drawn out into columns, the more so at night, when the lamps' run down the
  // water in long broken streaks (9542, 9547; M13: longer than before, as the photographs have them).
  float spread = 2.0 * mix(0.03, 0.11, uCityLights) * uReflectScale;
  float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))) + fract(uTime * 7.31));
  vec4 acc = vec4(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 8; i++) {
    float k = (float(i) + j) / 8.0 * 2.0 - 1.0;
    float wt = exp(-1.8 * k * k);
    vec2 o = uv + dist + vec2(0.0, k * spread);
    acc += texture2D(tReflect, clamp(o, 0.001, 0.999)) * wt;
    wsum += wt;
  }
  vec4 m = acc / wsum;
  // Some of the facets of rippled water tilt up to the sky whatever lies across the river; at
  // night the sky is dark and the lights are all there is to see. The mirror is premultiplied:
  // its city covers the sky by its alpha, and the lamps (drawn added, without alpha) come on top
  // of whatever they lie over, the sky included, so a lamp's streak is never halved by the
  // alpha the city under it wrote (M17).
  // Under an overcast sky, bright everywhere, the tilted facets show more of it: the Čertovka's
  // water in 9204 is silver under dark trees where the mirror alone gave dark trees (M17).
  float k = mix(mix(0.78, 0.9, uCityLights), 0.4, uOvercast);
  return sky * (1.0 - k * clamp(m.a, 0.0, 1.0)) + m.rgb * k;
}

// How much of the reflection the water returns (M13): little seen from above, where the water's
// own colour shows (8490, 8849), most at a grazing angle, where the far river carries the sky and
// the far bank almost whole (8683, 8988, 9542). Softer than Fresnel's curve, as the ripples' facets
// spread the angles.
float praWaterFresnel(vec3 wp) {
  vec3 V = normalize(wp - cameraPosition);
  float c = clamp(-V.y, 0.0, 1.0);
  float f = pow(1.0 - c, 3.0);
  return mix(0.42, 1.0, f) * 0.88;
}
`;function Gu(){let t=1234567,n=()=>(t=t*1664525+1013904223>>>0,t/4294967296),r=[];for(;r.length<96;){let e=Math.round((n()*2-1)*40),t=Math.round((n()*2-1)*40),i=Math.hypot(e,t);i<3||i>42||r.push({kx:e,ky:t,a:i**-1.25,ph:n()*Math.PI*2})}let i=new Float32Array(65536),a=new Float32Array(65536),s=new Float32Array(65536),l=0,u=1/0,d=-1/0;for(let e=0;e<256;e++)for(let t=0;t<256;t++){let n=t/256,o=e/256,c=0,f=0,p=0;for(let e of r){let t=2*Math.PI*(e.kx*n+e.ky*o)+e.ph,r=Math.cos(t);c+=e.a*2*Math.PI*e.kx*r,f+=e.a*2*Math.PI*e.ky*r,p+=e.a*Math.sin(t)}let m=e*256+t;i[m]=c,a[m]=f,s[m]=p,l=Math.max(l,Math.abs(c),Math.abs(f)),u=Math.min(u,p),d=Math.max(d,p)}let f=new Uint8Array(262144);for(let e=0;e<65536;e++)f[e*4]=Math.round((i[e]/l*.5+.5)*255),f[e*4+1]=Math.round((a[e]/l*.5+.5)*255),f[e*4+2]=Math.round((s[e]-u)/(d-u)*255),f[e*4+3]=f[(e*7+131)%65536*4+2];let p=new li(f,256,256,w);return p.wrapS=p.wrapT=e,p.generateMipmaps=!0,p.minFilter=c,p.magFilter=o,p.needsUpdate=!0,p}var Ku=class{group=new Dn;material;mirror=new Cu(.4);mirrorOn=!0;tiles=[];levels=new Map;cell;frustum=new Si;frame=0;lastPos=new H(1e9,0,0);lastRot=new kt;m=new W;constructor(e,t=1){let n=e.arrays.position,r=e.arrays.index;this.cell=e.meta.cell;let i={position:new yr(n,3),aFlow:new yr(e.arrays.flow,2,!0),aFoam:new yr(e.arrays.foam,1,!0),aBank:new yr(e.arrays.bank??new Uint8Array(n.length/3).fill(255),1,!0),normal:new yr(new Int8Array(n.length).map((e,t)=>t%3==1?127:0),3,!0)};for(let e=0;e<n.length;e+=3)this.levels.set(this.key(n[e],n[e+2]),n[e+1]);let a=this.material=new da({color:`#1f2a26`,roughness:.1,metalness:0}),o=Gu();o.anisotropy=t;let s={tRipple:{value:o},tReflect:{value:this.mirror.target.texture},uReflectMatrix:{value:this.mirror.matrix},uReflectOn:{value:0},uReflectTexel:{value:new V(1,1)},uReflectScale:{value:1},uRipple:{value:.012}};this.uniforms=s,Yl(a,e=>{Object.assign(e.uniforms,s),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec2 aFlow;
attribute float aFoam;
attribute float aBank;
varying vec2 vFlow;
varying float vFoam;
varying float vBank;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vFlow = aFlow;
vFoam = aFoam;
vBank = aBank;`),e.fragmentShader=e.fragmentShader.replace(`#include <clipping_planes_pars_fragment>`,`#include <clipping_planes_pars_fragment>\n${Hu}\n${Wu}`).replace(`#include <color_fragment>`,`#include <color_fragment>\n${Uu}`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix(mix(0.09, 0.3, smoothstep(40.0, 900.0, praDist)), 0.85, praFoamK);`).replace(`#include <normal_fragment_maps>`,`normal = normalize((viewMatrix * vec4(praRipN, 0.0)).xyz);`).replace(`#include <lights_fragment_maps>`,`#include <lights_fragment_maps>
radiance = praWaterReflect(vPraWorld, praRipN) * (1.0 - praFoamK) * praWaterFresnel(vPraWorld);`)},`-water`);let c=new Map;for(let e=0;e<r.length;e+=3){let t=r[e]*3,i=`${Math.floor(n[t]/Vu)},${Math.floor(n[t+2]/Vu)}`;(c.get(i)??c.set(i,[]).get(i)).push(r[e],r[e+1],r[e+2])}for(let e of c.values()){let t=new Nr;for(let[e,n]of Object.entries(i))t.setAttribute(e,n);t.setIndex(new yr(new Uint32Array(e),1));let r=new Xn,o=new H;for(let t of e)r.expandByPoint(o.fromArray(n,t*3));t.boundingBox=r,t.boundingSphere=r.getBoundingSphere(new Tr);let s=new oi(t,a);s.receiveShadow=!0,s.matrixAutoUpdate=!1,this.group.add(s),this.tiles.push(s)}}uniforms;key(e,t){return Math.round(e/this.cell)*1e5+Math.round(t/this.cell)}levelAt(e,t){for(let n=0;n<=3;n++)for(let r=-n;r<=n;r++)for(let i=-n;i<=n;i++){let n=this.levels.get(this.key(e+r*this.cell,t+i*this.cell));if(n!==void 0)return n}return NaN}setSize(e,t){this.mirror.setSize(e,t),this.uniforms.uReflectTexel.value.set(1/this.mirror.target.width,1/this.mirror.target.height)}renderMirror(e,t,n){this.frustum.setFromProjectionMatrix(this.m.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),n.coordinateSystem,n.reversedDepth);let r=this.mirrorOn&&this.tiles.some(e=>this.frustum.intersectsSphere(e.geometry.boundingSphere)),i=new H(0,0,-1).applyQuaternion(n.quaternion),a=Math.max(60,Math.min(600,n.position.y*4)),o=this.levelAt(n.position.x+i.x*a,n.position.z+i.z*a);Number.isNaN(o)&&(o=this.levelAt(n.position.x,n.position.z)),Number.isNaN(o)&&(o=0);let s=n.position.distanceTo(this.lastPos)>25||n.quaternion.angleTo(this.lastRot)>.06;this.frame++,r&&(s||this.frame%2==0||Number.isNaN(this.mirror.planeY))&&(this.mirror.render(e,t,n,o),this.lastPos.copy(n.position),this.lastRot.copy(n.quaternion)),this.uniforms.uReflectScale.value=.5/Math.tan(Ot.degToRad(n.fov)/2),this.uniforms.uReflectOn.value=r&&!Number.isNaN(this.mirror.planeY)?1:0}};function qu(e){e.traverse(e=>e.layers.enable(1))}var Ju={x0:-2150,z0:-1350,size:4096,res:2048,radius:18},Yu=`
attribute float aKind;
uniform float uCity;
uniform float uPx;
uniform float uMirrorPass;
varying float vI;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 1.0);
  // A lantern's glow about 2.4 m across, never less than four pixels; fading with distance once it
  // is that small, as a farther lamp gives less light to a pixel.
  float px = uPx * 2.4 / d;
  // In the river's mirror the point is drawn out into a streak many times its size by eight
  // jittered taps (src/world/water.ts): drawn four times as wide there, so the taps find a smooth
  // disc rather than a dot (which sparkled), with nine times the light in all, since a lamp is a
  // hundred times brighter than the exposure's white and the photographs' streaks are bright (9542,
  // M17). A far lamp, at the four-pixel floor in both, gets no more light in the mirror than in the
  // view: thousands of them seen from above had washed the river pale.
  float pm = px * mix(1.0, 4.0, uMirrorPass);
  gl_PointSize = clamp(pm, 4.0, 110.0);
  vI = uCity * min(1.0, pow(px / 4.0, 1.2) + 0.1) * exp(-d / 9000.0) * mix(1.0, 0.55, uMirrorPass * smoothstep(4.0, 8.0, pm));
}`,Xu=`
varying float vI;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0 || vI <= 0.0) discard;
  float core = exp(-r2 * 28.0), halo = exp(-r2 * 5.0);
  // Sodium: a deep orange halo round a warm core, through the blue hour's daylight balance (9547).
  vec3 col = mix(vec3(1.0, 0.42, 0.1), vec3(1.0, 0.74, 0.4), core);
  gl_FragColor = vec4(col * vI * (core * 20.0 + halo * 0.45), 1.0);
}`,Zu={blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:200,blendDstAlpha:201},Qu=`
uniform float uSize;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize;
}`,$u=`
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  float f = (1.0 - r2) * (1.0 - r2);
  gl_FragColor = vec4(f, f, f, 1.0);
}`,ed=class{points;pool;material;constructor(e,t,n){let r=[],i=[];for(let e=0;e<t.length;e+=3)r.push(t[e],t[e+1]+4.5,t[e+2]),i.push(0);for(let e=0;e<n.length;e+=4)r.push(n[e],n[e+1],n[e+2]),i.push(n[e+3]);let a=[];for(let e=0;e<i.length;e++)i[e]===0&&a.push(r[e*3],r[e*3+1],r[e*3+2]);let s=new Nr;s.setAttribute(`position`,new K(a,3)),s.setAttribute(`aKind`,new K(new Float32Array(a.length/3),1)),s.computeBoundingSphere(),this.material=new la({uniforms:{uCity:Y.uCityLights,uPx:{value:1e3},uMirrorPass:Y.uMirrorPass},vertexShader:Yu,fragmentShader:Xu,transparent:!0,depthWrite:!1,...Zu,fog:!1}),this.points=new Vi(s,this.material),this.points.frustumCulled=!1,this.points.renderOrder=10,this.points.layers.enable(1),this.points.onBeforeRender=(e,t,n)=>{let r=e.getRenderTarget(),i=r?r.height:e.getDrawingBufferSize(new V).y;this.material.uniforms.uPx.value=n.projectionMatrix.elements[5]*i*.5},this.pool=new Yt(Ju.res,Ju.res,{type:g,depthBuffer:!1}),this.pool.texture.minFilter=this.pool.texture.magFilter=o,this.pool.texture.generateMipmaps=!1;let c=new Fn,l=new Nr,u=[];for(let e=0;e<i.length;e++)u.push(r[e*3],0,r[e*3+2]);l.setAttribute(`position`,new K(u,3));let d=new la({uniforms:{uSize:{value:2*Ju.radius*Ju.res/Ju.size}},vertexShader:Qu,fragmentShader:$u,transparent:!0,depthTest:!1,depthWrite:!1,blending:2}),f=new Vi(l,d);f.frustumCulled=!1,c.add(f);let p=new Ka(Ju.x0,Ju.x0+Ju.size,-(Ju.z0+Ju.size),-Ju.z0,-100,100);p.position.set(0,10,0),p.up.set(0,0,-1),p.lookAt(0,0,0),p.updateMatrixWorld();let m=e.getRenderTarget();e.setRenderTarget(this.pool),e.setClearColor(0,0),e.clear(!0,!1,!1),e.render(c,p),e.setRenderTarget(m),l.dispose(),d.dispose(),Y.tLampMap.value=this.pool.texture,Y.uLampRect.value.set(Ju.x0,Ju.z0,1/Ju.size,1/Ju.size)}update(){this.points.visible=Y.uCityLights.value>.001}},X={Broad:0,Fruit:1,Poplar:2,Conifer:3,Rose:4,Shrub:5,Willow:6,Chestnut:7},td=65.535,nd=.2,rd=.1,id=2048,ad=8192,od=[{n:3,r0:.003,r1:.012,h:.046,flare:0,w:2.6,tone:.95,close:.011},{n:3,r0:.005,r1:.017,h:.049,flare:0,w:2.4,tone:.95,close:.01},{n:4,r0:.007,r1:.021,h:.05,flare:.002,w:2,tone:.95,close:.006},{n:5,r0:.009,r1:.027,h:.046,flare:.007,w:1.7,tone:.93},{n:5,r0:.012,r1:.034,h:.046,flare:.01,w:1.55,tone:.95},{n:6,r0:.015,r1:.042,h:.042,flare:.014,w:1.35,tone:.97},{n:6,r0:.018,r1:.048,h:.032,flare:.02,w:1.25,tone:1}];function sd(e){let t=[],n=[],r=[],i=[],a=e?8:3,o=e?6:2;(e?od:od.slice(2).filter((e,t)=>t!==1)).forEach((e,s)=>{for(let c=0;c<e.n;c++){let l=c/e.n*Math.PI*2+s*2.4,u=.8+.2*Math.abs(Math.sin(s*7.1+c*3.7)),d=t.length/3;for(let i=0;i<=o;i++)for(let s=0;s<=a;s++){let c=s/a*2-1,d=i/o,f=l+c*(e.w/2)*(.55+.45*Math.sin(d*Math.PI/2)),p=.011*(e.r1/.048)*(1-c*c)*Math.sin(d*Math.PI*.85),m=e.r0+(e.r1-e.r0)*d-(e.close??0)*d*d+e.flare*d*d*d*(1+.5*c*c)+p,h=Math.max(0,d-.6)/.4,g=e.h*d-e.flare*.8*d**4-.22*e.h*c*c*d*d-.12*e.h*h*h*(.4+Math.abs(c));t.push(m*Math.cos(f),g,m*Math.sin(f));let _=e.close?1.15:1,v=u*e.tone*_*(.45+.55*d**.9)*(1-.12*c*c)*(1+.18*h*Math.abs(c));n.push(v,v*(.85+.25*h)*(e.close?1.2:1),v*(.85+.1*d)*(e.close?1.3:1)),r.push(c,d)}for(let e=0;e<o;e++)for(let t=0;t<a;t++){let n=d+e*(a+1)+t,r=n+a+1;i.push(n,n+1,r+1,n,r+1,r)}}});let s=new Nr;return s.setAttribute(`position`,new K(t,3)),s.setAttribute(`color`,new K(n,3)),s.setAttribute(`uv`,new K(r,2)),s.setIndex(i),s.computeVertexNormals(),s}function cd(){let e=[],t=(e,t,n,r)=>{let i=e.getAttribute(`position`).count,a=new Float32Array(i*3);for(let e=0;e<i;e++)a[e*3]=t,a[e*3+1]=n,a[e*3+2]=r;return e.setAttribute(`color`,new K(a,3)),e};e.push(t(new Ji(.0035,.005,.5,5,1,!0).translate(0,-.25,0),.035,.055,.025));for(let n=0;n<5;n++){let r=n/5*Math.PI*2,i=new Nr;i.setAttribute(`position`,new K([.004,.002,-.004,.004,.002,.004,.03,-.012,0],3)),e.push(t(i.rotateY(r),.03,.05,.022))}let n=e=>{let t=e*.32,n=new Nr;return n.setAttribute(`position`,new K([0,0,0,e*.35,.002,t,e*.35,.002,-t,e*.4,-.003,0,e,0,0],3)),n.setIndex([0,3,1,0,2,3,3,4,1,3,2,4]),n.toNonIndexed()};for(let[r,i,a]of[[-.09,.3,1],[-.2,2.6,1.15],[-.33,4.6,1.25]]){let o=.1*a,s=.8+.2*Math.sin(i*5),c=[t(new Ji(.0012,.0015,o,3,1,!0).rotateZ(-Math.PI/2).translate(o/2,0,0),.03,.045,.022)];c.push(t(n(.045*a).translate(o,0,0),.03*s,.05*s,.022*s));for(let[e,r]of[[.45,1],[.45,-1],[.8,1],[.8,-1]])c.push(t(n(.038*a).rotateY(r*Math.PI/3).translate(o*e,0,0),.028*s,.047*s,.02*s));for(let t of c)e.push(t.rotateZ(.35).rotateY(i).translate(0,r,0))}let r=[],i=[];for(let t of e){let e=t.index?t.toNonIndexed():t;r.push(...e.getAttribute(`position`).array),i.push(...e.getAttribute(`color`).array)}let a=new Nr;return a.setAttribute(`position`,new K(r,3)),a.setAttribute(`color`,new K(i,3)),a.computeVertexNormals(),a}var ld=e=>e-Math.floor(e);function ud(e,t){let n=ld(e*.1031),r=ld(t*.1031),i=n,a=n*(r+33.33)+r*(i+33.33)+i*(n+33.33);return n+=a,r+=a,i+=a,ld((n+r)*i)}function dd(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r;i=i*i*(3-2*i),a=a*a*(3-2*a);let o=ud(n,r),s=ud(n+1,r),c=ud(n,r+1),l=ud(n+1,r+1);return o+(s-o)*i+(c+(l-c)*i-(o+(s-o)*i))*a}function fd(e,t,n){let r=dd(e*.18+11,t*.18+11);return r<.5?n.setRGB(.58,.035,.028):r<.68?n.setRGB(.7,.07,.004):r<.86?n.setRGB(.66,.24,.3):n.setRGB(.8,.76,.7)}var pd=class{group=new Dn;meshes=null;set(e){if(!e.length&&!this.meshes)return;let t=this.meshes??this.create(),n=0,r=0,i=new W,a=new kt,o=new kt,s=new H,c=new H,l=new H,u=new H(0,1,0),d=new G;for(let f of e){let e=f.d<3,p=Math.round(Math.PI*2*f.rx*f.rx*(e?22:12)),m=Math.floor(f.seed*2147483646)+1+Math.floor(Math.abs(f.x*131+f.z*71))%1e3,h=()=>((m=m*16807%2147483647)-1)/2147483646;for(let m=0;m<p&&!(e?n>=id:r>=ad);m++){let p=1-1.15*h()**1.4,m=h()*Math.PI*2,g=Math.sqrt(Math.max(0,1-p*p)),_=g*Math.cos(m),v=g*Math.sin(m);l.set(_/f.rx,p/(.82*f.ry),v/f.rx).normalize(),c.set(f.x+_*f.rx,f.y+f.cy+p*.82*f.ry,f.z+v*f.rx).addScaledVector(l,.03+.03*h()),l.y+=.45,l.x+=(h()-.5)*.9,l.z+=(h()-.5)*.9,l.normalize(),a.setFromUnitVectors(u,l),o.setFromAxisAngle(u,h()*Math.PI*2),a.multiply(o);let y=1+.3*h();i.compose(c,a,s.set(y,y,y)),fd(f.x,f.z,d).multiplyScalar(.85+.3*h()),e?(t.near.setMatrixAt(n,i),t.near.setColorAt(n,d),t.green.setMatrixAt(n,i),n++):(t.far.setMatrixAt(r,i),t.far.setColorAt(r,d),r++)}}t.near.count=n,t.green.count=n,t.far.count=r;for(let e of[t.near,t.green,t.far])e.visible=e.count>0,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}create(){let e=Yl(new da({vertexColors:!0,roughness:.78,side:2}),e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vPetal;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPetal = uv;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec2 vPetal;`).replace(`#include <color_fragment>`,`#include <color_fragment>
{
  float s = abs(vPetal.x), t = vPetal.y;
  float veins = 1.0 - 0.07 * pow(abs(sin(vPetal.x * 9.0 + t * 1.5)), 6.0) * smoothstep(0.1, 0.5, t);
  float base = mix(0.55, 1.0, smoothstep(0.0, 0.35, t));
  float lip = smoothstep(0.75, 1.0, max(s, t)) * smoothstep(0.55, 0.9, t);
  diffuseColor.rgb *= veins * base * (1.0 + 0.22 * lip);
  diffuseColor.g += 0.012 * lip;
}`).replace(`#include <lights_fragment_end>`,`#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= 1.1;
reflectedLight.indirectSpecular *= 0.25;
reflectedLight.directSpecular *= 0.35;
#if NUM_DIR_LIGHTS > 0
reflectedLight.directDiffuse += diffuseColor.rgb * diffuseColor.rgb * 1.6 * directionalLights[0].color * praSunVisibility(vPraWorld) * 0.55 * max(-dot(normal, directionalLights[0].direction), 0.0) * RECIPROCAL_PI;
#endif`)},`-petals`),t=Yl(new da({vertexColors:!0,roughness:.7,side:2})),n=(e,t,n,r)=>{let i=new vi(e,t,n);return r&&i.setColorAt(0,new G(1,1,1)),i.count=0,i.frustumCulled=!1,i.receiveShadow=!0,this.group.add(i),i};return this.meshes={near:n(sd(!0),e,id,!0),green:n(cd(),t,id,!1),far:n(sd(!1),e,ad,!0)},this.meshes}},md={value:3.2},hd=250,gd=6,_d=12,vd=class{pos=[];nor=[];part=[];index=[];card=[];lobeOf=[];lobe(e,t){let n=new Zi(1,t),r=n.getAttribute(`position`),i=this.pos.length/3,a=new Map,o=[];for(let t=0;t<r.count;t++){let n=r.getX(t),s=r.getY(t),c=r.getZ(t),l=`${n.toFixed(4)},${s.toFixed(4)},${c.toFixed(4)}`,u=a.get(l);if(u===void 0){u=this.pos.length/3-i,a.set(l,u),this.pos.push(e.c[0]+n*e.r,e.c[1]+s*e.ry,e.c[2]+c*e.r);let t=new H(n/e.r,s/e.ry,c/e.r).normalize();this.nor.push(t.x,t.y,t.z),this.part.push(0),this.card.push(0,0,0),this.lobeOf.push(e.c[0],e.c[1],e.c[2],e.r)}o.push(u)}for(let e of o)this.index.push(i+e);n.dispose()}cone(e,t,n,r,i){let a=this.pos.length/3,o=n/(t-e);for(let a=0;a<=r;a++){let s=i+a/r*Math.PI*2,c=Math.cos(s),l=Math.sin(s),u=Math.hypot(1,o);this.pos.push(c*n,e,l*n),this.nor.push(c/u,o/u,l/u),this.part.push(0),this.pos.push(0,t,0),this.nor.push(c/u,o/u,l/u),this.part.push(0),this.lobeOf.push(0,e,0,0,0,e,0,0),this.card.push(0,0,0,0,0,0)}for(let e=0;e<r;e++){let t=a+e*2;this.index.push(t,t+1,t+2)}let s=this.pos.length/3;this.pos.push(0,e+(t-e)*.15,0),this.nor.push(0,-1,0),this.part.push(0),this.lobeOf.push(0,e,0,0),this.card.push(0,0,0);for(let e=0;e<r;e++){let t=a+e*2,n=a+(e+1)*2;this.index.push(s,n,t)}}cards(e,t,n,r){let i=yd(r),a=new H,o=new H,s=new H,c=new H,l=(e,t)=>{let n=(e[0]-t.c[0])/t.r,r=(e[1]-t.c[1])/t.ry,i=(e[2]-t.c[2])/t.r;return n*n+r*r+i*i<.94};e.forEach((r,u)=>{let d=Math.round(n*4*Math.PI*r.r*Math.sqrt(r.r*r.ry));for(let n=0;n<d;n++){let f=1-2*(n+i())/d,p=Math.sqrt(Math.max(0,1-f*f)),m=n*2.39996+i();a.set(Math.cos(m)*p,f,Math.sin(m)*p);let h=[r.c[0]+a.x*r.r*1.04,r.c[1]+a.y*r.ry*1.04,r.c[2]+a.z*r.r*1.04];if(e.some((e,t)=>t!==u&&l(h,e)))continue;c.set(i()-.5,i()-.5,i()-.5).multiplyScalar(.9);let g=a.clone().add(c).normalize();o.set(-g.z,0,g.x),o.lengthSq()<1e-4&&o.set(1,0,0),o.normalize(),s.crossVectors(g,o);let _=i()*Math.PI,v=Math.cos(_),y=Math.sin(_),b=o.clone().multiplyScalar(v).addScaledVector(s,y),x=s.clone().multiplyScalar(v).addScaledVector(o,-y),S=t*(.8+.4*i()),C=i(),w=this.pos.length/3,T=new H(a.x/r.r,a.y/r.ry,a.z/r.r).normalize();for(let[e,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])this.pos.push(h[0]+(b.x*e+x.x*t)*S,h[1]+(b.y*e+x.y*t)*S,h[2]+(b.z*e+x.z*t)*S),this.nor.push(T.x,T.y,T.z),this.part.push(2),this.lobeOf.push(r.c[0],r.c[1],r.c[2],r.r),this.card.push(e,t,C);this.index.push(w,w+1,w+2,w,w+2,w+3,w,w+2,w+1,w,w+3,w+2)}})}trunk(e,t){let n=this.pos.length/3;for(let n=0;n<=e;n++){let r=n/e*Math.PI*2,i=Math.cos(r),a=Math.sin(r);this.pos.push(i,0,a,i*.7,1,a*.7),this.nor.push(i,0,a,i,0,a),this.part.push(1,1),this.lobeOf.push(0,t,0,0,0,t,0,0),this.card.push(0,0,0,0,0,0)}for(let t=0;t<e;t++){let e=n+t*2;this.index.push(e,e+1,e+2,e+2,e+1,e+3)}}limb(e,t,n,r,i,a){let o=new H(...e),s=new H(...t.c),c=o.clone().add(s).multiplyScalar(.5).add(new H(...a)),l=s.clone().sub(o).normalize(),u=new H(-l.z,0,l.x);u.lengthSq()<1e-4&&u.set(1,0,0),u.normalize();let d=new H().crossVectors(l,u),f=this.pos.length/3,p=[[o,n,0],[c,(n+r)*.55,.5],[s,r,1]];for(let[e,n,r]of p)for(let a=0;a<=i;a++){let o=a/i*Math.PI*2,s=Math.cos(o),c=Math.sin(o),l=u.x*s+d.x*c,f=u.y*s+d.y*c,p=u.z*s+d.z*c;this.pos.push(e.x+l*n,e.y+f*n,e.z+p*n),this.nor.push(l,f,p),this.part.push(1),this.lobeOf.push(t.c[0],t.c[1],t.c[2],-Math.max(r,.001)),this.card.push(0,0,0)}for(let e=0;e<2;e++)for(let t=0;t<i;t++){let n=f+e*(i+1)+t,r=n+i+1;this.index.push(n,r,n+1,n+1,r,r+1)}}};function yd(e){let t=e;return()=>((t=t*16807%2147483647)-1)/2147483646}function bd(e,t){let n=yd(t),r=[],i=n()*Math.PI*2,a=(e,t,a,o,s,c,l,u,d,f=0)=>{for(let p=0;p<e;p++){let m=p/e*Math.PI*2+f+(n()-.5)*.5,h=1+.16*Math.cos(m-i),g=(s+n()*c)*h,_=t*(.96+.08*h);r.push({c:[Math.cos(m)*_,a+(n()-.5)*o,Math.sin(m)*_],r:g,ry:g*l,limb:u,main:d})}};switch(e){case X.Poplar:for(let e=0;e<8;e++){let t=e/7,i=-.72+t*1.5,a=.62*(1-.6*t*t)*(.88+.24*n());r.push({c:[(n()-.5)*.25,i,(n()-.5)*.25],r:a,ry:a*1.2,main:e%2==0||e===7})}return r;case X.Chestnut:return r.push({c:[0,0,0],r:.55,ry:.7,main:!0}),a(5,.56,-.42,.12,.4,.06,.66,!0,!0),a(5,.46,.08,.12,.42,.06,.66,!0,!1,.63),a(3,.24,.5,.06,.38,.05,.7,!0,!1,1.2),r.push({c:[0,.72,0],r:.32,ry:.22,main:!0}),r;case X.Fruit:return r.push({c:[0,.05,0],r:.5,ry:.46,main:!0}),a(6,.5,-.02,.3,.38,.1,.85,!0,!0),a(2,.26,.45,.1,.36,.05,.8,!0,!1,.9),a(3,.3,-.5,.1,.32,.04,.8,!1,!1,1.7),r;case X.Willow:return r.push({c:[0,.3,0],r:.55,ry:.45,main:!0}),a(4,.32,.5,.08,.4,.05,.8,!0,!1),a(7,.68,-.22,.2,.28,.06,2.5,!0,!0,.4),a(3,.4,-.45,.1,.3,.04,2,!1,!1,1.1),r;case X.Rose:case X.Shrub:{let t=e===X.Rose?.65:.8;r.push({c:[0,.05,0],r:.66,ry:.66,main:!0});for(let e=0;e<5;e++){let i=e/5*Math.PI*2+n()*.6,a=.5+n()*.08,o=.44+n()*.07;r.push({c:[Math.cos(i)*a,(-.12+n()*.3)*t,Math.sin(i)*a],r:o,ry:o,main:e<3})}for(let e=0;e<4;e++){let i=e/4*Math.PI*2+1+n(),a=.46+n()*.06;r.push({c:[Math.cos(i)*.3,.5*t,Math.sin(i)*.3],r:a,ry:a,main:e===0})}for(let e=0;e<2;e++){let e=n()*Math.PI*2;r.push({c:[Math.cos(e)*.35,-.48,Math.sin(e)*.35],r:.4,ry:.4})}return r}default:return r.push({c:[0,.02,0],r:.6,ry:.66,main:!0}),a(6,.5,-.05,.3,.4,.1,.88,!0,!0),a(4,.3,.42,.14,.38,.06,.85,!0,!1,.7),r.push({c:[(n()-.5)*.1,.6,(n()-.5)*.1],r:.36,ry:.3,limb:!0,main:!0}),a(2,.38,-.55,.08,.32,.04,.85,!0,!1,1.5),r}}function xd(e){switch(e){case X.Fruit:return{fork:-.72,r0:.09,r1:.035,kink:.16};case X.Willow:return{fork:-.3,r0:.06,r1:.025,kink:.08};case X.Chestnut:return{fork:-.62,r0:.055,r1:.022,kink:.08};case X.Broad:return{fork:-.6,r0:.055,r1:.022,kink:.08};default:return null}}function Sd(e){let t=new vd,n=[],r=xd(e),i=(i,a=!1)=>{let o=t.index.length;if(e===X.Conifer){let e=[3,4,5][i],n=[5,7,9][i];for(let r=0;r<e;r++){let a=r/e,o=-1+a*1.7,s=o+[1,.85,.75][i];t.cone(o,Math.min(1,s),1-a*.78,n,r*.7)}}else{let n=bd(e,11+e),o=i===2?n:n.filter(e=>e.main);for(let e of o)t.lobe(e,i);if(r&&i===2){let n=yd(5+e);for(let e of o)e.limb&&t.limb([0,r.fork,0],e,r.r0,r.r1,5,[(n()-.5)*r.kink,(n()-.5)*r.kink,(n()-.5)*r.kink])}a&&t.cards(o,e===X.Poplar?.05:e===X.Rose?.1:.06,e===X.Poplar?90:e===X.Rose?60:80,71+e)}t.trunk([3,4,6][i],r&&i===2?r.fork:e===X.Fruit?-.5:0),n.push([o,t.index.length-o])};i(2,!0),i(2),i(1),i(0);let a=new Nr;return a.setAttribute(`position`,new K(t.pos,3)),a.setAttribute(`normal`,new K(t.nor,3)),a.setAttribute(`aPart`,new K(t.part,1)),a.setAttribute(`aLobe`,new K(t.lobeOf,4)),a.setAttribute(`aCard`,new K(t.card,3)),a.setIndex(t.index),{geom:a,lod:n}}var Cd=`
float praTHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }`,wd=`
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
uniform vec3 uNearCentre;
uniform float uNearR;
float praVHash(float s) { return fract(sin(s * 12.9898 + 4.1) * 43758.5453); }
`,Td=`
${wd}
attribute float aPart;
attribute vec4 aLobe;
attribute vec3 aCard;
varying vec3 vCard;
varying float vKind;
varying vec3 vTreeCol;
varying vec3 vUnit;
varying vec3 vCrownN;
varying float vPart;
varying float vSeed;
varying float vExp;
varying float vHeight;
`,Ed=`
vec3 praLobeHash(vec3 c, float seed) {
  return fract(sin(vec3(dot(c, vec3(12.9898, 78.233, 37.719)), dot(c, vec3(39.346, 11.135, 83.155)), dot(c, vec3(73.156, 52.235, 9.151))) + seed * vec3(91.7, 53.1, 27.3)) * 43758.5453);
}
vec3 praLobeShift(vec3 c, float seed) { return (praLobeHash(c, seed) - 0.5) * vec3(0.36, 0.24, 0.36); }
vec3 praLobe(vec3 p, vec4 lobe, float seed) {
  if (lobe.w <= 0.0) return p;
  vec3 h = praLobeHash(lobe.xyz, seed);
  vec3 c = lobe.xyz + (h - 0.5) * vec3(0.36, 0.24, 0.36);
  return c + (p - lobe.xyz) * (0.78 + 0.44 * h.y);
}
// How far a kind leans: the orchard trees and the willows most.
float praLeanOf(float kind) {
  return abs(kind - ${X.Fruit}.0) < 0.5 ? 0.24 : abs(kind - ${X.Willow}.0) < 0.5 ? 0.16 : (abs(kind - ${X.Broad}.0) < 0.5 || abs(kind - ${X.Chestnut}.0) < 0.5) ? 0.06 : 0.0;
}`,Dd=`
float praSeed = fract(iC.w);
float praYaw = praSeed * 6.2832;
float praC = cos(praYaw), praS = sin(praYaw);
mat3 praRot = mat3(praC, 0.0, -praS, 0.0, 1.0, 0.0, praS, 0.0, praC);
vec3 praScale = vec3(iB.x, iB.y, iB.x);
bool praTrunk = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0;
vec3 transformed;
if (praTrunk) {
  // From the ground to the fork (or the crown's centre).
  transformed = iA.xyz + praRot * vec3(position.x * iB.w, position.y * (iB.z + aLobe.y * iB.y), position.z * iB.w);
} else {
  vec3 local;
  if (aPart > 0.5 && aPart < 1.5) {
    local = position + praLobeShift(aLobe.xyz, praSeed) * (-aLobe.w);
  } else {
    local = praLobe(position, aLobe, praSeed);
    #ifdef PRA_BUMPS
    // Near, each lobe is lumpy: pushed in and out along its normal by the leaf-clump noise; the
    // leaf cards on it move with it, or they would float off where a lobe is pushed in.
    if (aLobe.w > 0.0) {
      vec3 wp0 = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale);
      float bump = textureLod(tLeafNoise, wp0 * 0.9 / 8.0, 0.0).r - 0.5;
      local += normal * bump * 0.55 * aLobe.w;
    }
    #endif
  }
  // The crown sways a little with the wind, its top most.
  float ph = praSeed * 6.2832 + uTime * 1.1;
  vec2 sway = vec2(sin(ph), sin(ph * 1.37 + 1.0)) * 0.006 * (local.y + 1.0) * iB.y;
  transformed = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale) + vec3(sway.x, 0.0, sway.y);
}
// The whole tree leans a little, by its kind and seed.
vec2 praLean = (vec2(praVHash(praSeed * 7.1), praVHash(praSeed * 3.3 + 0.7)) - 0.5) * praLeanOf(floor(iC.w));
transformed.xz += praLean * max(0.0, transformed.y - iA.y);
`,Od=`
float praSeed0 = fract(iC.w);
float praYaw0 = praSeed0 * 6.2832;
float praC0 = cos(praYaw0), praS0 = sin(praYaw0);
mat3 praRot0 = mat3(praC0, 0.0, -praS0, 0.0, 1.0, 0.0, praS0, 0.0, praC0);
vec3 objectNormal = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0 ? praRot0 * normal : normalize(praRot0 * (normal / vec3(iB.x, iB.y, iB.x)));
vTreeCol = iC.rgb;
vUnit = aPart > 0.5 && aPart < 1.5 ? position : praLobe(position, aLobe, praSeed0);
vPart = aPart;
vCard = aCard;
vSeed = praSeed0;
vKind = floor(iC.w);
vExp = iA.w;
vHeight = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0 ? position.y * (iB.z + aLobe.y * iB.y) : iB.z + position.y * iB.y;
// Unnormalized: a unit vector interpolated across a coarse lobe's face can pass near zero (where
// the face lies close to the crown's centre), and its normalize went non-finite (8490's mirror).
vCrownN = praRot0 * (vUnit / vec3(iB.x, iB.y, iB.x));
`,kd=`
${Xl}
uniform highp sampler3D tLeafNoise;
vec4 praNm = vec4(0.5);
vec4 praNd = vec4(0.5);
vec4 praNf = vec4(0.5);
float praFine = 0.0;
varying float vKind;
varying vec3 vTreeCol;
varying vec3 vUnit;
varying vec3 vCrownN;
varying float vPart;
varying vec3 vCard;
varying float vSeed;
varying float vExp;
varying float vHeight;
${Cd}
float praTreeOcc = 1.0;
vec3 praCN = vec3(0.0, 1.0, 0.0);
float praSun = 1.0;
float praLeaf = 0.5;
float praClump = 0.5;
float praDetail = 0.0;
float praMid = 0.0;
float praRoseBloom = 0.0;
float praTrans = 0.0;
uniform float uLensCut;
// The leaf noise is read along turned axes: a value noise thresholded along the world's axes
// showed as square blocks up close (8884).
const mat3 PRA_TURN = mat3(0.8440, 0.4491, -0.2931, -0.2931, 0.8440, 0.4491, 0.4491, -0.2931, 0.8440);
// The sun lights the tops of the leaf clumps and not their hollows, and reaches less far down a
// crown's side than a sphere's shading would; a tree closed in by a wood (exposure 0) is lit on
// its top only. \`up\` is the crown normal's y, \`top\` how high in the crown (−1..1).
float praCanopySun(float clump, float mid, float up, float top, float exposure) {
  float gate = mix(0.85, mix(0.5, 1.1, smoothstep(0.3, 0.72, clump)), mid);
  float side = mix(0.7, 1.0, smoothstep(-0.8, 0.6, up));
  float closed = mix(mix(0.7, 1.0, exposure), 1.0, smoothstep(0.1, 0.8, top));
  return gate * side * closed;
}
`,Ad=`
{
  bool praRose = abs(vKind - ${X.Rose}.0) < 0.5;
  bool praWillow = abs(vKind - ${X.Willow}.0) < 0.5;
  praCN = normalize(vCrownN + vec3(0.0, 1e-5, 0.0));
  vec3 wp = vPraWorld;
  // A willow's foliage hangs: its noise is read stretched down into streaks.
  vec3 wq = PRA_TURN * (praWillow ? vec3(wp.x, wp.y * 0.28, wp.z) : wp);
  // Metres per pixel here: each scale fades out as it falls under two pixels.
  float mpp = length(fwidth(wp));
  praDetail = 1.0 - smoothstep(0.12, 0.45, mpp * (praRose ? 3.4 : 1.0));
  praMid = 1.0 - smoothstep(0.5, 1.8, mpp);
  #ifdef PRA_CUT
  // Nothing within a few metres of the lens: the near plane would cut a crown into slivers.
  if (length(vViewPosition) < (praRose ? uLensCut : max(5.0, uLensCut))) discard;
  #endif
  float depth = smoothstep(0.25, 0.95, length(vUnit));
  if (vPart > 1.5) {
    // A leaf cluster: a sprig of sixteen small overlapping leaves on the card, pointed ellipses
    // turned at random (a willow's narrow); the rest cut away.
    float cs = vCard.z, top = -1.0, tone = 0.0;
    vec2 leafSize = praWillow ? vec2(0.42, 0.07) : praRose ? vec2(0.24, 0.13) : vec2(0.34, 0.16);
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      vec2 c0 = vec2(praTHash(vec3(cs * 91.0, fi, 1.3)), praTHash(vec3(cs * 91.0, fi, 2.7))) * 1.5 - 0.75;
      float a = praTHash(vec3(cs * 91.0, fi, 4.1)) * 6.2832;
      vec2 d = vCard.xy - c0;
      vec2 e = vec2(cos(a) * d.x + sin(a) * d.y, -sin(a) * d.x + cos(a) * d.y) / (leafSize * (0.8 + 0.4 * praTHash(vec3(cs * 91.0, fi, 9.3))));
      // Narrower toward the tip.
      if (e.x * e.x + e.y * e.y * (1.0 + 0.9 * max(e.x, 0.0)) < 1.0) { top = fi; tone = praTHash(vec3(cs * 91.0, fi, 7.7)); }
    }
    #ifdef PRA_CUT
    if (top < 0.0) discard;
    #endif
    // The sprig sits in the same clumps as the lobe under it: lit on a clump's top, dark in a hollow.
    if (praMid > 0.0) praNm = texture(tLeafNoise, (wq * 0.6 + vSeed * 13.0) / 8.0);
    praClump = mix(0.5, praNm.r, praMid);
    vec3 c = vTreeCol * (0.55 + 0.6 * tone) * (0.8 + 0.4 * praClump);
    // Leaves turned to the light at the top of the crown are lighter and yellower.
    c = mix(c, c * vec3(1.2, 1.2, 0.8), smoothstep(0.65, 1.0, tone) * smoothstep(0.0, 0.8, vUnit.y));
    diffuseColor.rgb = c;
    praLeaf = tone;
    praTreeOcc = mix(0.4, 1.0, depth) * (0.55 + 0.45 * smoothstep(-1.0, 0.7, praCN.y));
    // Each leaf of a sprig is lit or shaded on its own, not by the clump under it.
    praSun = praCanopySun(tone, 1.0, praCN.y, vUnit.y, vExp);
    praTrans = 0.6;
  } else if (vPart > 0.5) {
    // Bark; a fruit tree's trunk whitewashed to a metre, as the orchards' are (8725).
    vec3 bark = vec3(0.075, 0.062, 0.05) * (0.8 + 0.4 * texture(tLeafNoise, wp * 3.0 / 8.0).r);
    if (abs(vKind - ${X.Fruit}.0) < 0.5) bark = mix(vec3(0.62, 0.6, 0.54) * (0.85 + 0.3 * texture(tLeafNoise, wp * 5.0 / 8.0).g), bark, smoothstep(0.85, 1.15, vHeight));
    diffuseColor.rgb = bark;
    praTreeOcc = mix(0.5, 1.0, depth);
    praSun = 0.8;
  } else {
    // A rose's leaves are a few centimetres: the same texture, finer. The noise comes from a small
    // tiling 3D texture (four channels: a value and a tilt for the normal), each scale only where it shows.
    float ls = praRose ? 3.4 : 1.0;
    if (praDetail > 0.0) {
      praNd = texture(tLeafNoise, (wq * 2.2 * ls + vSeed * 31.0) / 8.0);
      float leaf2 = texture(tLeafNoise, (wq * 5.1 * ls + 7.0) / 8.0).r;
      praLeaf = mix(0.5, praNd.r * 0.65 + leaf2 * 0.35, praDetail);
      // Close, the leaves themselves: clusters of a decimetre or so, crisp, with dark gaps between.
      praFine = 1.0 - smoothstep(0.012, 0.05, mpp * ls);
      if (praFine > 0.0) {
        praNf = texture(tLeafNoise, (wq * 8.5 * ls + 3.0) / 8.0);
        float cluster = smoothstep(0.44, 0.56, praNf.r * 0.7 + leaf2 * 0.3);
        #ifdef PRA_CUT
        // Gaps between the leaf clusters open onto the lobes behind, darker for their depth: a
        // near crown is leaves with the crown's shade between them, not a skin (8385, 8884).
        if (!praRose && praFine > 0.4 && praNf.g * 0.6 + praNd.g * 0.4 < 0.36) discard;
        #endif
        // A rose bush is dense: its gaps are shallower than a tree's.
        praLeaf = mix(praLeaf, praRose ? 0.35 + 0.55 * cluster : cluster * 0.9 + 0.05, praFine);
      }
    }
    if (praMid > 0.0) {
      praNm = texture(tLeafNoise, (wq * 0.6 + vSeed * 13.0) / 8.0);
      // Close up the leaves carry the texture, and the two-metre clumps only half of it: at full
      // strength they read as camouflage blotches (8385).
      praClump = mix(0.5, praNm.r, praMid * (1.0 - 0.5 * praFine));
    }
    // Holes along each lobe's outline where the clusters thin out.
    #ifdef PRA_CUT
    float facing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
    // The clumps cut deep lobes into the outline, as the photographs' crowns have (8884, 9204).
    float ragged = 0.55 * praLeaf * praDetail + 0.7 * max(0.0, praClump - 0.32) * praMid * (1.0 - 0.5 * praFine) + 0.4 * praFine * (1.0 - praLeaf);
    if (facing < min(ragged, 0.82) * (praRose ? 0.4 : 1.0)) discard;
    // A willow's hem: the fronds end at their own heights.
    if (praWillow && vUnit.y < -0.4 && praNd.r < 0.3 + 0.55 * smoothstep(-0.4, -1.05, vUnit.y)) discard;
    // Near the lens a rose bush opens (M11, 8722): its mass of lobes thins to its lit clusters and
    // then to nothing within two metres, leaving the leaf clusters, the stems, leaves and blooms of
    // src/world/roses.ts, and the sky between them.
    if (praRose && praLeaf < 1.05 * (1.0 - smoothstep(1.8, 4.5, length(vViewPosition)))) discard;
    #endif
    vec3 c = vTreeCol;
    // Near, the leaf clusters stand out more: lit clusters lighter and yellower, the gaps deeper.
    float lc = mix(0.56, 0.9, praFine);
    c *= (1.0 - 0.5 * lc + lc * praLeaf) * (0.62 + 0.76 * praClump * mix(1.0, 0.25, praDetail) + 0.28 * praDetail);
    c = mix(c, c * vec3(1.12, 1.15, 0.85), praFine * smoothstep(0.6, 0.9, praLeaf));
    // Lighter, yellower young growth where a cluster catches the light at the crown's top.
    c = mix(c, c * vec3(1.18, 1.16, 0.9), smoothstep(0.55, 0.95, vUnit.y) * praClump);
    if (praRose) {
      // A rose bush in bloom: flowers of eight to ten centimetres massed on its top and the sides
      // that face out, each with its petals in rings when near.
      vec3 q = wp / 0.085;
      vec3 cell = floor(q);
      vec3 off = vec3(praTHash(cell + 1.7), praTHash(cell + 2.9), praTHash(cell + 4.1)) - 0.5;
      float size = 0.34 + 0.2 * praTHash(cell + 6.3);
      vec3 dq = fract(q) - 0.5 - off * 0.3;
      float rr = length(dq) / size;
      float where = smoothstep(-0.6, 0.5, praCN.y + 0.4 * length(vUnit.xz) - 0.25);
      // Within a few metres the nearest blooms are modelled (src/world/roses.ts); fewer painted.
      float thin = mix(0.4, 1.0, smoothstep(3.0, 8.0, length(vViewPosition)));
      float here = step(praTHash(cell + 0.37), 0.8 * where * thin) * (1.0 - smoothstep(0.85, 1.05, rr));
      float fade = smoothstep(0.015, 0.06, mpp);
      float cover = mix(here, 0.42 * where, fade);
      // Petals round the centre, turning as they go in; darker toward the heart.
      float ang = atan(dq.y + dq.z, dq.x);
      float petals = mix(1.0, (0.8 + 0.2 * cos(ang * 5.0 + rr * 9.0 + praTHash(cell + 3.3) * 6.0)) * (0.78 + 0.22 * smoothstep(0.0, 0.6, rr)), 1.0 - fade);
      c = mix(c, praBloom(wp.xz) * (0.85 + 0.3 * praTHash(cell)) * petals, cover);
      praRoseBloom = cover;
    }
    diffuseColor.rgb = c;
    #ifdef PRA_DBG
    diffuseColor.rgb = vec3(praFine, praDetail, praMid); praSun = 0.0; praTrans = 0.0;
    #endif
    // The sky reaches into a crown less deep down and inside.
    praTreeOcc = mix(0.25, 1.0, depth) * (0.5 + 0.5 * smoothstep(-1.0, 0.7, praCN.y));
    // Near, the leaf clusters carry the light, not the two-metre clumps (which read as camouflage).
    praSun = praCanopySun(mix(praClump, praLeaf, praFine * 0.8), max(praMid, praFine), praCN.y, vUnit.y, vExp);
    praTrans = mix(0.25, 0.7, 1.0 - depth * 0.5) * (1.0 - praRoseBloom);
    // A bush is small and open: the sky's light reaches most of it, and the blooms face it.
    if (praRose) { praTreeOcc = mix(mix(0.55, 1.0, praTreeOcc), 1.0, praRoseBloom); praSun = mix(0.85, 1.0, praRoseBloom); }
    if (abs(vKind - ${X.Shrub}.0) < 0.5) praSun = mix(praSun, 1.0, 0.4);
  }
}`,jd=`
if (vPart < 0.5 || vPart > 1.5) {
  vec3 cn = normalize((viewMatrix * vec4(praCN, 0.0)).xyz);
  normal = normalize(mix(normal, cn, 0.62));
  // Near, the two-metre clumps hardly tilt the normal (they read as camouflage blotches, 8385); the leaves do.
  vec3 tilt = (praNm.gba - 0.5) * 2.0 * praMid * (1.0 - 0.85 * praFine) + (praNd.gba - 0.5) * 1.6 * praDetail * (1.0 - 0.7 * praFine) + (praNf.gba - 0.5) * 2.8 * praFine;
  normal = normalize(normal + (viewMatrix * vec4(tilt, 0.0)).xyz);
}`,Md=`#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= (0.5 + 0.5 * praTreeOcc);
reflectedLight.indirectSpecular *= praTreeOcc * praTreeOcc * 0.35;
reflectedLight.directDiffuse *= mix(1.0, praTreeOcc, 0.5) * praSun;
reflectedLight.directSpecular *= 0.4 * praSun;
{
  vec3 praV = normalize(vViewPosition);
  vec3 praL = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
  float praBack = max(0.0, dot(-praV, praL));
  float praThin = 1.0 - abs(dot(normal, praV));
  reflectedLight.directDiffuse += directLight.color * diffuseColor.rgb * vec3(1.0, 1.1, 0.75) * praTrans * praBack * praBack * (0.35 + 0.65 * praThin) * (1.0 - 0.6 * max(0.0, dot(normal, praL)));
}`;function Nd(e,t){let n={uNearCentre:{value:e.centre},uNearR:e.r,uLensCut:md},r=new da({roughness:.78,metalness:0});r.defines=t?{PRA_CUT:``,PRA_BUMPS:``}:{};let i=Yl(r,e=>{Object.assign(e.uniforms,n,{tLeafNoise:{value:Bd()}}),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Td}\nuniform float uTime;\nuniform highp sampler3D tLeafNoise;\n${Ed}`).replace(`#include <beginnormal_vertex>`,Od).replace(`#include <begin_vertex>`,Dd),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${kd}`).replace(`#include <color_fragment>`,`#include <color_fragment>\n${Ad}`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>\n${jd}`).replace(`#include <lights_fragment_end>`,Md)},t?`-trees-cut`:`-trees`),a=new fa;return a.onBeforeCompile=e=>{Object.assign(e.uniforms,n,{uTime:Y.uTime}),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${wd}\nattribute float aPart;\nattribute vec4 aLobe;\nuniform float uTime;\n${Ed}`).replace(`#include <begin_vertex>`,Dd)},a.customProgramCacheKey=()=>`praha-tree-depth`,{material:i,depth:a}}var Pd=`
${wd}
attribute vec2 aCorner;
varying float vRadius;
varying vec2 vQuad;
varying vec3 vAxA;
varying vec3 vAxB;
varying vec3 vAxD;
varying vec3 vTreeCol;
varying float vKind;
varying float vSeed;
varying float vExp;
`,Fd=`
vec3 praCentre = iA.xyz + vec3(0.0, iB.z, 0.0);
vec3 praD = isOrthographic ? normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])) : normalize(cameraPosition - praCentre);
vec3 praA = normalize(cross(vec3(0.0, 1.0, 0.0), praD));
vec3 praB = cross(praD, praA);
float praUp = praB.y;
float praHa = iB.x, praHb = sqrt(iB.x * iB.x * (1.0 - praUp * praUp) + iB.y * iB.y * praUp * praUp);
// Far away, fewer and bigger crowns: a tree whose key falls above the share kept shrinks away, and
// the rest grow so the canopy covers what it covered (fewer layers of sprites to shade). The trees
// closed in by their neighbours go first, so a wood keeps its outline.
// Distances from the drone (the near set's centre), so the shadows and the mirror thin alike.
float praDist = length(uNearCentre - praCentre);
float praKeep = clamp(pow(1400.0 / max(praDist, 1.0), 1.4), 0.3, 1.0);
float praKey = fract(iC.w) * mix(1.5, 0.7, iA.w);
float praSize = (1.0 - smoothstep(praKeep - 0.12, praKeep, praKey)) / sqrt(praKeep);
vec2 praQ = aCorner * 1.06;
// Pulled toward the camera along the ground only: pulled along the line of sight, a crown that
// reaches the ground sank under it, and under the water in the mirror (8490).
vec3 transformed = praCentre + (praA * praQ.x * praHa + praB * praQ.y * praHb) * praSize + vec3(praD.x, 0.0, praD.z) * iB.x * 0.9;
// Trees of the near set are meshes (and a sprite never draws under the near set's radius).
vec2 praOff = iA.xz - uNearCentre.xz;
if (dot(praOff, praOff) < uNearR * uNearR) transformed = vec3(0.0, -1e5, 0.0);
vQuad = praQ;
vAxA = praA; vAxB = praB; vAxD = praD;
vRadius = iB.x * praSize;
vTreeCol = iC.rgb;
vKind = floor(iC.w);
vSeed = fract(iC.w);
vExp = iA.w;
`,Id=`
vec3 praSub = vec3(0.0, 0.0, 1.0);
float praHollow = 0.0;
{
  vec2 q = vQuad;
  float s1 = fract(sin(vSeed * 91.7) * 43758.5), s2 = fract(sin(vSeed * 53.1 + 1.0) * 43758.5), s3 = fract(sin(vSeed * 27.3 + 2.0) * 43758.5);
  float best = -1.0;
  bool inside = false;
  if (abs(vKind - ${X.Conifer}.0) < 0.5) {
    float edge = (1.0 - q.y) * 0.55 + 0.08 + 0.04 * sin(q.y * 14.0 + s1 * 6.0);
    inside = abs(q.x) < edge && q.y > -0.98;
    praSub = normalize(vec3(q.x / max(edge, 0.05), 0.35, 0.8));
    praHollow = 0.0;
  } else if (abs(vKind - ${X.Poplar}.0) < 0.5) {
    float w = 0.8 * pow(max(0.0, 1.0 - q.y * q.y), 0.35) * (1.0 - 0.55 * smoothstep(0.2, 1.0, q.y)) + 0.06 * sin(q.y * 7.0 + s1 * 6.0) + 0.04 * sin(q.y * 13.0 + s2 * 9.0);
    inside = abs(q.x) < w && abs(q.y) < 0.99;
    praSub = normalize(vec3(q.x / max(w, 0.05), 0.15 + 0.5 * step(0.5, q.y), sqrt(max(0.05, 1.0 - q.x * q.x / max(w * w, 0.01)))));
    praHollow = smoothstep(0.35, 0.65, fract(q.y * 2.5 + s2));
  } else {
    // Up to five discs: the kind lays them out, the seed turns and sizes them.
    vec2 c[5]; vec2 r[5]; int n = 4;
    if (abs(vKind - ${X.Chestnut}.0) < 0.5) {
      c[0] = vec2(0.0, -0.45); r[0] = vec2(0.9, 0.42);
      c[1] = vec2(0.06 * (s1 - 0.5), 0.05); r[1] = vec2(0.78, 0.4);
      c[2] = vec2(0.1 * (s2 - 0.5), 0.5); r[2] = vec2(0.56, 0.36);
      c[3] = vec2(0.0, 0.72); r[3] = vec2(0.3, 0.2);
    } else if (abs(vKind - ${X.Fruit}.0) < 0.5) {
      c[0] = vec2(0.0, 0.1); r[0] = vec2(0.72, 0.5);
      c[1] = vec2(-0.45 - 0.2 * s1, -0.05); r[1] = vec2(0.42, 0.34);
      c[2] = vec2(0.45 + 0.2 * s2, 0.0); r[2] = vec2(0.4, 0.32);
      c[3] = vec2(0.3 * (s3 - 0.5), 0.5); r[3] = vec2(0.36, 0.3);
    } else if (abs(vKind - ${X.Willow}.0) < 0.5) {
      c[0] = vec2(0.0, 0.42); r[0] = vec2(0.74, 0.55);
      c[1] = vec2(0.0, -0.3); r[1] = vec2(0.9, 0.75);
      c[2] = vec2(-0.5, -0.5); r[2] = vec2(0.45, 0.55);
      c[3] = vec2(0.5, -0.5); r[3] = vec2(0.45, 0.55);
    } else {
      float a1 = s1 * 6.2832, a2 = a1 + 2.1 + s2, a3 = a2 + 2.0 + s3;
      c[0] = vec2(0.0, 0.0); r[0] = vec2(0.7, 0.72);
      c[1] = vec2(cos(a1), sin(a1)) * 0.34; r[1] = vec2(0.5, 0.5) * (0.9 + 0.3 * s2);
      c[2] = vec2(cos(a2), sin(a2)) * 0.36; r[2] = vec2(0.45, 0.45) * (0.9 + 0.3 * s3);
      c[3] = vec2(cos(a3), sin(a3)) * 0.32; r[3] = vec2(0.42, 0.42) * (0.9 + 0.3 * s1);
      c[4] = vec2(0.1 * (s2 - 0.5), 0.55); r[4] = vec2(0.42, 0.36); n = 5;
    }
    float ang = atan(q.y, q.x);
    float wobble = 1.0 + 0.05 * sin(ang * 7.0 + vSeed * 60.0) + 0.035 * sin(ang * 11.0 + vSeed * 17.0);
    for (int i = 0; i < 5; i++) {
      if (i >= n) break;
      vec2 d = (q - c[i]) / (r[i] * wobble);
      float d2 = dot(d, d);
      if (d2 < 1.0) {
        inside = true;
        float h = sqrt(1.0 - d2) * min(r[i].x, r[i].y);
        if (h > best) { best = h; praSub = normalize(vec3(d.x, d.y, sqrt(1.0 - d2) * 1.3)); }
      }
    }
    praHollow = 1.0 - smoothstep(0.05, 0.3, best);
    if (abs(vKind - ${X.Willow}.0) < 0.5) {
      // The hem: fronds ending at their own heights, in streaks.
      float k = floor((q.x + 1.0) * 7.0 + s1 * 3.0);
      float hem = -1.02 + 0.35 * fract(sin(k * 12.9898 + vSeed * 78.2) * 43758.5);
      if (q.y < hem) inside = false;
      praSub = normalize(vec3(praSub.x * 0.6, praSub.y * 0.3 + 0.1, praSub.z));
    }
  }
  if (!inside) discard;
}`,Ld=`
varying float vRadius;
varying vec2 vQuad;
varying vec3 vAxA;
varying vec3 vAxB;
varying vec3 vAxD;
varying vec3 vTreeCol;
varying float vKind;
varying float vSeed;
varying float vExp;
`;function Rd(e){let t={uNearCentre:{value:e.centre},uNearR:e.r},n=Yl(new da({roughness:.8,metalness:0}),e=>{Object.assign(e.uniforms,t,{tLeafNoise:{value:Bd()}}),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Pd}`).replace(`#include <beginnormal_vertex>`,`vec3 objectNormal = vec3(0.0, 1.0, 0.0);`).replace(`#include <begin_vertex>`,Fd),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Ld}\nfloat praTreeOcc = 1.0;\nfloat praSun = 1.0;\nfloat praTrans = 0.4;\nuniform highp sampler3D tLeafNoise;\nvec3 praSn;\nvec4 praClumpN = vec4(0.5);\nvec3 praClumpT;`).replace(`#include <color_fragment>`,`#include <color_fragment>\n${Id}
{
  // The crown's surface point this pixel stands for, on the ellipsoid, blended with the lobe under
  // it, for the same two-metre clumps the meshes have (while they are more than a pixel or two).
  vec2 q = vQuad;
  float d2 = min(1.0, dot(q, q));
  vec3 whole = normalize(q.x * vAxA + q.y * vAxB + sqrt(max(0.05, 1.0 - d2)) * vAxD);
  vec3 lobe = normalize(praSub.x * vAxA + praSub.y * vAxB + praSub.z * vAxD);
  praSn = normalize(mix(whole, lobe, 0.55));
  float mid = 1.0 - smoothstep(0.5, 1.8, length(fwidth(vPraWorld)));
  if (mid > 0.0) praClumpN = texture(tLeafNoise, (vPraWorld + praSn * vRadius) * 0.6 / 8.0 + vSeed * 1.7);
  float clump = mix(0.5, praClumpN.r, mid);
  praClumpT = (praClumpN.gba - 0.5) * 2.0 * mid;
  vec3 c = vTreeCol * (0.92 + 0.16 * vSeed) * (0.62 + 0.76 * clump) * (1.0 - 0.35 * praHollow);
  // Lighter, yellower growth on the top.
  c = mix(c, c * vec3(1.14, 1.12, 0.9), smoothstep(0.4, 0.95, q.y) * clump);
  diffuseColor.rgb = c;
  praTreeOcc = mix(0.45, 1.0, smoothstep(-0.9, 0.5, q.y)) * mix(1.0, 0.75, d2) * (1.0 - 0.3 * praHollow);
  praSun = mix(0.85, mix(0.5, 1.1, smoothstep(0.3, 0.72, clump)), mid) * mix(0.7, 1.0, smoothstep(-0.8, 0.6, praSn.y)) * mix(mix(0.7, 1.0, vExp), 1.0, smoothstep(0.1, 0.8, q.y)) * (1.0 - 0.35 * praHollow);
  praTrans = 0.45 * (1.0 - 0.5 * praHollow);
}`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(normalize(praSn + praClumpT), 0.0)).xyz);`).replace(`#include <lights_fragment_end>`,Md)},`-tree-sprites`),r=new fa;return r.onBeforeCompile=e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Pd}`).replace(`#include <begin_vertex>`,Fd),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Ld}`).replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>\n${Id}`)},r.customProgramCacheKey=()=>`praha-tree-sprite-depth`,{material:n,depth:r}}var zd=null;function Bd(){if(zd)return zd;let t=yd(4242),n=Array.from({length:4},()=>Float32Array.from({length:512},()=>t())),r=new Uint8Array(131072),i=e=>e*e*(3-2*e);for(let e=0;e<32;e++)for(let t=0;t<32;t++)for(let a=0;a<32;a++){let o=a/4,s=t/4,c=e/4,l=Math.floor(o),u=Math.floor(s),d=Math.floor(c),f=i(o-l),p=i(s-u),m=i(c-d);for(let i=0;i<4;i++){let o=(e,t,r)=>n[i][(r%8*8+t%8)*8+e%8],s=(o(l,u,d)*(1-f)+o(l+1,u,d)*f)*(1-p)*(1-m)+(o(l,u+1,d)*(1-f)+o(l+1,u+1,d)*f)*p*(1-m)+(o(l,u,d+1)*(1-f)+o(l+1,u,d+1)*f)*(1-p)*m+(o(l,u+1,d+1)*(1-f)+o(l+1,u+1,d+1)*f)*p*m;r[((e*32+t)*32+a)*4+i]=Math.round(s*255)}}let a=new Zt(r,32,32,32);return a.format=w,a.wrapS=a.wrapT=a.wrapR=e,a.minFilter=c,a.magFilter=o,a.generateMipmaps=!0,a.needsUpdate=!0,zd=a,a}var Vd={[X.Broad]:[`#4a5a40`,`#3d4b34`,`#52693f`,`#43533a`,`#4d5f3f`],[X.Fruit]:[`#58703f`,`#516640`,`#556c43`],[X.Poplar]:[`#3d4b34`,`#384730`,`#435339`],[X.Conifer]:[`#27342b`,`#2d3d2d`,`#25322d`],[X.Rose]:[`#44573a`,`#3d5134`],[X.Shrub]:[`#39472f`,`#34422c`,`#3e4e33`],[X.Willow]:[`#5b6b48`,`#526343`,`#5a6a4e`],[X.Chestnut]:[`#44533c`,`#3f4d37`,`#4a5c40`,`#42523a`]},Hd=Object.fromEntries(Object.entries(Vd).map(([e,t])=>[e,t.map(e=>new G(e))])),Ud=class{group=new Dn;count;tiles=[];sprites=[];near={centre:new H(1e9,0,1e9),r:{value:hd}};buckets=[];sorted=new H(1e9,0,1e9);roses=new pd;constructor(e,t){let{nx:n,nz:r,tile:i,x0:a,z0:o}=e.meta,s=e.arrays.start,c=e.arrays.xz,l=e.arrays.hr,u=e.arrays.ks;this.count=s[s.length-1];let d=new G;for(let e=0;e<r;e++)for(let r=0;r<n;r++){let f=e*n+r,p=s[f],m=s[f+1];if(m===p)continue;let h=a+r*i,g=o+e*i,_=new Float32Array((m-p)*_d);for(let e=p;e<m;e++){let n=h+c[e*2]/td,r=g+c[e*2+1]/td,i=l[e*2]*nd,a=l[e*2+1]*rd,o=u[e*2]&15,s=(u[e*2]>>4)/15,f=u[e*2+1]/256,m=(e-p)*_d,v=Kd(o,i,a,f);_[m]=n,_[m+1]=t.sample(n,r),_[m+2]=r,_[m+3]=s,_[m+4]=v.rx,_[m+5]=v.ry,_[m+6]=v.cy,_[m+7]=v.trunk;let y=Hd[o]??Hd[X.Broad];d.copy(y[Math.floor(f*7919)%y.length]).multiplyScalar(.9+.2*(f*37%1)),_[m+8]=d.r,_[m+9]=d.g,_[m+10]=d.b,_[m+11]=o+Math.min(f,.999)}this.tiles.push({x0:h,z0:g,n:m-p,data:_})}let f=[Nd(this.near,!0),Nd(this.near,!1)],p=[X.Broad,X.Fruit,X.Poplar,X.Conifer,X.Rose,X.Shrub,X.Willow,X.Chestnut].map(e=>Sd(e));for(let e=0;e<4;e++){let t=[];for(let n=0;n<p.length;n++){let{geom:r,lod:i}=p[n],a=new qa;a.index=r.index;for(let e of[`position`,`normal`,`aPart`,`aLobe`,`aCard`])a.setAttribute(e,r.getAttribute(e));let o=new po(new Float32Array(768),_d,1).setUsage(We);Wd(a,o),a.instanceCount=0;let s=i[e],c=i[i.length-1];a.setDrawRange(s[0],s[1]);let l=f[e<3?0:1],u=new oi(a,l.material);u.customDepthMaterial=l.depth,u.frustumCulled=!1,u.castShadow=!0,u.receiveShadow=!0,u.matrixAutoUpdate=!1,u.onBeforeShadow=()=>a.setDrawRange(c[0],c[1]),u.onAfterShadow=()=>a.setDrawRange(s[0],s[1]),u.onBeforeRender=(e,t,n)=>{n.layers.isEnabled(0)||a.setDrawRange(c[0],c[1])},u.onAfterRender=()=>a.setDrawRange(s[0],s[1]),u.layers.enable(1),this.group.add(u),t.push({mesh:u,geom:a,buffer:o,count:0})}this.buckets.push(t)}this.group.add(this.roses.group);let m=Rd(this.near),h=new Nr;h.setAttribute(`position`,new K(new Float32Array(12),3)),h.setAttribute(`aCorner`,new K([-1,-1,1,-1,1,1,-1,1],2)),h.setIndex([0,1,2,0,2,3]);for(let e of this.tiles){let t=new qa;t.index=h.index,t.setAttribute(`position`,h.getAttribute(`position`)),t.setAttribute(`aCorner`,h.getAttribute(`aCorner`)),Wd(t,new po(e.data,_d,1)),t.instanceCount=e.n;let n=0;for(let t=0;t<e.n;t++)n=Math.max(n,e.data[t*_d+1]+e.data[t*_d+6]*2);t.boundingSphere=new Tr(new H(e.x0+500,n/2,e.z0+500),Math.hypot(720,n/2+40));let r=new oi(t,m.material);r.customDepthMaterial=m.depth,r.castShadow=!0,r.receiveShadow=!1,r.matrixAutoUpdate=!1,r.layers.enable(1),this.group.add(r),this.sprites.push(r)}}leaves=!0;set spriteShadows(e){for(let t of this.sprites)t.castShadow=e}update(e){if(Math.hypot(e.x-this.sorted.x,e.y-this.sorted.y,e.z-this.sorted.z)<gd)return;this.sorted.copy(e),this.near.centre.copy(e);for(let e of this.buckets)for(let t of e)t.count=0;let t=62500,n=this.leaves?2500:0,r=this.leaves?(12+gd)**2:0,i=[];for(let a of this.tiles){let o=Math.max(0,a.x0-e.x,e.x-(a.x0+1e3)),s=Math.max(0,a.z0-e.z,e.z-(a.z0+1e3));if(o*o+s*s>t)continue;let c=a.data;for(let o=0,s=0;o<a.n;o++,s+=_d){let a=c[s]-e.x,o=c[s+2]-e.z,l=a*a+o*o;if(l>=t)continue;let u=c[s+1]+c[s+6]-e.y,d=l+u*u,f=d<n?0:d<8100?1:d<52900?2:3,p=Math.floor(c[s+11]);p===X.Rose&&d<r&&i.push({x:c[s],y:c[s+1],z:c[s+2],rx:c[s+4],ry:c[s+5],cy:c[s+6],seed:c[s+11]-p,d:Math.sqrt(d)});let m=this.buckets[f][p];(m.count+1)*_d>m.buffer.array.length&&Gd(m),m.buffer.array.set(c.subarray(s,s+_d),m.count*_d),m.count++}}this.roses.set(i);for(let e of this.buckets)for(let t of e)t.geom.instanceCount=t.count,t.mesh.visible=t.count>0,t.buffer.clearUpdateRanges(),t.buffer.addUpdateRange(0,t.count*_d),t.buffer.needsUpdate=!0}};function Wd(e,t){e.setAttribute(`iA`,new Ir(t,4,0)),e.setAttribute(`iB`,new Ir(t,4,4)),e.setAttribute(`iC`,new Ir(t,4,8))}function Gd(e){let t=e.buffer.array,n=new Float32Array(t.length*2);n.set(t),e.buffer=new po(n,_d,1).setUsage(We),Wd(e.geom,e.buffer)}function Kd(e,t,n,r){let i,a;switch(e){case X.Fruit:i=Math.min(1.4,Math.max(.6,.22*t)),a=Math.min(Math.max(n,.5*(t-i)),.7*(t-i));break;case X.Willow:i=.08*t,a=Math.min(Math.max(n*1.05,.38*t),.6*t);break;case X.Chestnut:i=t*(.22+.1*r),a=Math.min(Math.max(n*1.15,.35*(t-i)),.9*(t-i));break;case X.Poplar:i=.1*t,a=Math.min(Math.max(n,.1*t),.2*t);break;case X.Rose:return{rx:n,ry:t/2+.1,cy:t/2-.1,trunk:0};case X.Shrub:return{rx:n,ry:t/2+.75,cy:t/2-.75,trunk:0};case X.Conifer:i=.06*t,a=Math.min(Math.max(n,.16*t),.3*t);break;default:i=t*(.2+.12*r),a=Math.min(Math.max(n*1.12,.3*(t-i)),.85*(t-i))}let o=(t-i)/2;return{rx:a,ry:o,cy:i+o,trunk:(e===X.Fruit?.07:e===X.Willow?.06:.05)+.012*t}}var Z=e=>{let t=new G(e);return[t.r,t.g,t.b]},qd=class{p=[];n=[];c=[];g=[];t=[];w=[];glow=0;tint=0;wing=0;tri(e,t,n,r,i){let a=t[0]-e[0],o=t[1]-e[1],s=t[2]-e[2],c=n[0]-e[0],l=n[1]-e[1],u=n[2]-e[2],d=o*u-s*l,f=s*c-a*u,p=a*l-o*c,m=Math.hypot(d,f,p);if(!(m<1e-9)){d/=m,f/=m,p/=m,d*i[0]+f*i[1]+p*i[2]<0&&([t,n]=[n,t],d=-d,f=-f,p=-p);for(let i of[e,t,n])this.p.push(i[0],i[1],i[2]),this.n.push(d,f,p),this.c.push(r[0],r[1],r[2]),this.g.push(this.glow),this.t.push(this.tint),this.w.push(this.wing)}}quad(e,t,n,r,i,a){this.tri(e,t,n,i,a),this.tri(e,n,r,i,a)}box(e,t,n,r,i,a,o,s=!1){this.prism([[e,n],[r,n],[r,a],[e,a]],t,i,()=>o),this.lid([[e,n],[r,n],[r,a],[e,a]],i,o,1),s&&this.lid([[e,n],[r,n],[r,a],[e,a]],t,o,-1)}beam(e,t,n,r){let i=new H(t[0]-e[0],t[1]-e[1],t[2]-e[2]).normalize(),a=Math.abs(i.y)>.9?new H(1,0,0):new H(0,1,0),o=new H().crossVectors(i,a).normalize().multiplyScalar(n/2),s=new H().crossVectors(o,i).normalize().multiplyScalar(n/2),c=(e,t)=>{let n=[[1,1],[-1,1],[-1,-1],[1,-1]][t];return[e[0]+o.x*n[0]+s.x*n[1],e[1]+o.y*n[0]+s.y*n[1],e[2]+o.z*n[0]+s.z*n[1]]};for(let n=0;n<4;n++){let i=(n+1)%4,a=c(e,n),o=c(e,i),s=c(t,i),l=c(t,n),u=c([0,0,0],n),d=c([0,0,0],i);this.quad(a,o,s,l,r,[u[0]+d[0],u[1]+d[1],u[2]+d[2]])}}prism(e,t,n,r){this.band(e,t,e,n,r)}band(e,t,n,r,i){let a=0,o=0;for(let[t,n]of e)a+=t,o+=n;a/=e.length,o/=e.length;for(let s=0;s<e.length;s++){let c=(s+1)%e.length,l=(e[s][0]+e[c][0])/2,u=(e[s][1]+e[c][1])/2,d=r>t&&(n[s][0]-e[s][0])**2+(n[s][1]-e[s][1])**2>1e-6?.6:0;this.quad([e[s][0],t,e[s][1]],[e[c][0],t,e[c][1]],[n[c][0],r,n[c][1]],[n[s][0],r,n[s][1]],i(l,u,s),[l-a,d,u-o])}}lid(e,t,n,r){let i=0,a=0;for(let[t,n]of e)i+=t,a+=n;i/=e.length,a/=e.length;for(let o=0;o<e.length;o++){let s=(o+1)%e.length;this.tri([i,t,a],[e[o][0],t,e[o][1]],[e[s][0],t,e[s][1]],n,[0,r,0])}}ellipsoid(e,t,n,r=8,i=5){let a=(n,a)=>{let o=Math.PI*a/i,s=2*Math.PI*n/r;return[e[0]+t[0]*Math.sin(o)*Math.cos(s),e[1]+t[1]*Math.cos(o),e[2]+t[2]*Math.sin(o)*Math.sin(s)]};for(let t=0;t<i;t++)for(let o=0;o<r;o++){let r=a(o,t),s=a(o+1,t),c=a(o+1,t+1),l=a(o,t+1),u=[(r[0]+c[0])/2-e[0],(r[1]+c[1])/2-e[1],(r[2]+c[2])/2-e[2]];t===0?this.tri(r,c,l,n,u):t===i-1?this.tri(r,s,c,n,u):this.quad(r,s,c,l,n,u)}}get triangles(){return this.p.length/9}geometry(){let e=new Nr;return e.setAttribute(`position`,new K(this.p,3)),e.setAttribute(`normal`,new K(this.n,3)),e.setAttribute(`color`,new K(this.c,3)),e.setAttribute(`aGlow`,new K(this.g,1)),e.setAttribute(`aTint`,new K(this.t,1)),this.w.some(e=>e)&&e.setAttribute(`aWing`,new K(this.w,1)),e.computeBoundingSphere(),e}};function Jd(e,t,n,r,i=[]){let a=[],o=t/2,s=(e,t,n)=>{for(let r=0;r<=6;r++){let i=-Math.PI/2+Math.PI*r/6,s=Math.cos(i),c=Math.sin(i);a.push([e+n*t*Math.sign(s)*Math.abs(s)**.7,n*-o*Math.sign(c)*Math.abs(c)**.5])}},c=[-e/2+r,...i.filter(t=>t>-e/2+r&&t<e/2-n).sort((e,t)=>e-t),e/2-n];for(let e of c.slice(1,-1))a.push([e,o]);s(e/2-n,n,1);for(let e of c.slice(1,-1).reverse())a.push([e,-o]);return s(-e/2+r,r,-1),a}function Yd(e,t,n){let r=1/0,i=-1/0,a=0;for(let[t,n]of e)r=Math.min(r,t),i=Math.max(i,t),a=Math.max(a,Math.abs(n));let o=(r+i)/2,s=(i-r)/2;return e.map(([e,r])=>[o+(e-o)*(s-t)/s,r*(a-n)/a])}var Xd=new W;function Zd(e,t,n,r,i,a,o,s=1,c=1,l=1){Xd.set(a*s,0,-o*l,n,0,c,0,r,o*s,0,a*l,i,0,0,0,1),e.setMatrixAt(t,Xd)}function Qd(e){let t=e>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)/4294967296)}function $d(e,t,n,r={}){let i=new vi(e,t,n);return i.count=0,i.frustumCulled=!1,i.castShadow=!!r.shadow,i.receiveShadow=!0,r.reflect&&i.layers.enable(1),i}function ef(e){let t=Math.max(1,e.count);e.instanceMatrix.clearUpdateRanges(),e.instanceMatrix.addUpdateRange(0,t*16),e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.clearUpdateRanges(),e.instanceColor.addUpdateRange(0,t*3),e.instanceColor.needsUpdate=!0);let n=e.geometry.getAttribute(`aFlap`);n&&(n.clearUpdateRanges(),n.addUpdateRange(0,t*4),n.needsUpdate=!0)}var tf=`
attribute float aGlow;
attribute float aTint;
varying float vGlow;
#ifdef PRA_WINGS
attribute float aWing;
// Per bird: how far the wings are open, the beat's amplitude (radians), its phase, its rate (radians a second).
attribute vec4 aFlap;
uniform float uTime;
#endif
`,nf=`
#ifdef PRA_WINGS
if (aWing > 0.5) {
  float span = abs(transformed.z) * aFlap.x;
  float a = aFlap.y * sin(uTime * aFlap.w + aFlap.z) + 0.2 * aFlap.x;
  transformed.z = sign(transformed.z) * span * cos(a);
  transformed.y += span * sin(a);
}
#endif
`,rf=`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR )
  vColor = vec4(1.0);
#endif
#ifdef USE_COLOR_ALPHA
  vColor *= color;
#elif defined( USE_COLOR )
  vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
  vColor.rgb *= mix(vec3(1.0), instanceColor.rgb, aTint);
#endif
`;function af(e={}){let t=new da({vertexColors:!0,roughness:e.roughness??.6,metalness:e.metalness??0});e.transparent&&(t.transparent=!0,t.depthWrite=!1),e.wings&&(t.defines={PRA_WINGS:``});let n=(e.glow??.09).toFixed(3);return Yl(t,e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${tf}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>\nvGlow = aGlow;\n${nf}`).replace(`#include <color_vertex>`,rf),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vGlow;`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
totalEmissiveRadiance += vGlow * uCityLights * vec3(1.0, 0.8, 0.56) * ${n} + diffuseColor.rgb * praLampPool(vPraWorld, 1.5) * 0.05;`)},`-life${e.wings?`-wings`:``}${e.transparent?`-t`:``}-${n}`)}var of={Bridge:0,Square:1,Lanes:2,Kampa:3,Quay:4,Petrin:5},sf={tram:[10,100,10,10],walk:[10,100,10],road:[10,100,10]};function cf(e,t,n,r,i){let a=i.length,o=new Float32Array(n*a),s=r.slice();for(let r=0;r<n;r++)for(let n=0;n<a;n++)s[n]+=e[(t+r)*a+n],o[r*a+n]=s[n]/i[n];return o}var lf=Z(`#c8352a`),uf=Z(`#f2ede6`),df=Z(`#1c2024`),ff=Z(`#2e2d2b`),pf=Z(`#cfcbc2`),mf=Z(`#ecebe6`),hf=Z(`#8e9296`),gf=Z(`#151719`),_f=Z(`#6f6a5c`),vf=Z(`#232323`),yf=Z(`#d8d1c4`),bf=Z(`#3a3a3c`),xf=Z(`#fff4dc`),Sf=Z(`#c0281c`),Cf=Z(`#b9b5ad`),wf=15.1,Tf=[11.3,8.6,11.3];function Ef(e,t,n){e.box(t-.8,n,-.55,t+.8,n+.12,.55,ff);let r=5.55;e.beam([t-.7,n+.12,0],[t+.35,(n+r)/2+.2,0],.07,_f),e.beam([t+.35,(n+r)/2+.2,0],[t-.2,5.5,0],.06,_f),e.box(t-.35,5.47,-.85,t-.05,r,.85,ff);for(let r of[-.45,.45])e.beam([t-.75,n+.12,r],[t+.75,n+.12,r],.05,_f),e.box(t-.1,n,r-.08,t+.1,n+.14,r+.08,Cf)}function Df(e,t,n,r){let i=[];for(let a=-e/2+t;a<e/2-t+.01;a+=n)i.push([a-r/2,a+r/2]);return i}function Of(e){return e.flat()}function kf(e,t,n,r=1.7){e.box(t-r/2-.55,.14,-n/2+.2,t+r/2+.55,.5,n/2-.2,ff);for(let i of[-r/2,r/2])for(let r of[-n/2+.22,n/2-.22])e.ellipsoid([t+i,.36,r],[.34,.34,.06],bf,10,3)}function Af(e,t,n,r){for(let r of n){e.glow=r.glow??0;let n=typeof r.col==`function`?r.col:()=>r.col;r.top?e.band(t,r.y0,r.top,r.y1,n):e.prism(t,r.y0,r.y1,n)}e.glow=0;let i=Yd(t,r.inset,r.inset);e.band(t,r.y,i,r.top,()=>r.col),e.lid(i,r.top,r.col,1)}function jf(){let e=new qd,t=2.5,n=[[-5.3,-3.95],[-.65,.65],[3.95,5.3]],r=Df(14,1.5,1.42,.18),i=n.flatMap(([e,t])=>[(e+t)/2-.025,(e+t)/2+.025]),a=Jd(14,t,1.25,1.25,[...Of(r),...n.flat(),...i]),o=(e,r)=>r>t/2-.2&&n.some(([t,n])=>e>t-.01&&e<n+.01),s=e=>n.some(([t,n])=>Math.abs(e-(t+n)/2)<.03),c=(e,n)=>Math.abs(n)>t/2-.2&&r.some(([t,n])=>e>t-.01&&e<n+.01);Af(e,a,[{y0:.42,y1:.6,col:uf},{y0:.6,y1:1.28,col:(e,t)=>o(e,t)?s(e)?ff:yf:lf},{y0:1.28,y1:1.36,col:(e,t)=>o(e,t)?s(e)?ff:yf:uf},{y0:1.36,y1:2.28,col:(e,t)=>o(e,t)?s(e)?ff:df:c(e,t)?uf:df,glow:1},{y0:2.28,y1:2.72,col:uf}],{y:2.72,col:pf,inset:.3,top:3.06}),e.glow=1,e.ellipsoid([8.120000000000001,.98,0],[.13,.2,.2],xf,8,3);for(let t of[-.8,.8])e.box(-8.2,.9,t-.1,-8.05,1.05,t+.1,Sf);e.glow=0,kf(e,-3.9,t),kf(e,3.9,t),e.box(-1.2,3.06,-.7,1.2,3.3,.7,Cf);for(let t of[-4.6,-3.2,2.6,4])e.box(t-.35,3.06,-.45,t+.35,3.18,.45,Cf);return Ef(e,-.2,3.3),e.geometry()}function Mf(e){let t=new qd,n=e===`mid`?Tf[1]-.6:Tf[0]-.6,r=2.46,i=e===`mid`?[[-3.3,-1.7],[1.7,3.3]]:e===`front`?[[-2.6,-1],[-n/2+.9,-n/2+2.5]]:[[1,2.6],[n/2-2.5,n/2-.9]],a=Df(n,1.2,1.6,.14),o=i.flatMap(([e,t])=>[(e+t)/2-.02,(e+t)/2+.02]),s=e===`front`?1:.05,c=e===`rear`?.9:.05,l=[...Of(a),...i.flat(),...o],u=Jd(n,r,s,c,l),d=Jd(n,r,e===`front`?s-.45:s,e===`rear`?c-.4:c,l),f=(e,t)=>t>r/2-.2&&i.some(([t,n])=>e>t-.01&&e<n+.01),p=e=>i.some(([t,n])=>Math.abs(e-(t+n)/2)<.03),m=(e,t)=>Math.abs(t)>r/2-.2&&a.some(([t,n])=>e>t-.01&&e<n+.01),h=t=>e===`front`&&t>n/2-.3||e===`rear`&&t<-n/2+.3;Af(t,u,[{y0:.3,y1:1.02,col:(e,t)=>f(e,t)?p(e)?ff:mf:lf},{y0:1.02,y1:1.08,col:mf},{y0:1.08,y1:2.3,col:(e,t)=>f(e,t)?p(e)?ff:df:m(e,t)&&!h(e)?gf:df,glow:1,top:d},{y0:2.3,y1:2.9,col:mf,top:d}],{y:2.9,col:hf,inset:.25,top:3.15}),t.box(-n/2+1.2,3.15,-.8,n/2-1.2,3.5,.8,hf);for(let e of[-n/2+2,n/2-2])t.box(e-.5,3.5,-.6,e+.5,3.62,.6,Cf);if(e!==`rear`&&t.box(-n/2-.65,.4,-1.12,-n/2+.05,2.9,1.12,vf),e===`mid`&&Ef(t,0,3.5),t.glow=1,e===`front`)for(let e of[-.72,.72])t.ellipsoid([n/2+.95,.75,e],[.1,.14,.22],xf,8,3);if(e===`rear`)for(let e of[-.72,.72])t.box(-n/2-.9,.7,e-.12,-n/2-.78,.9,e+.12,Sf);return t.glow=0,kf(t,e===`mid`?0:e===`front`?1.6:-1.6,r,1.8),t.geometry()}function Nf(e,t){let n=0,r=e.length-2;if(t<=e[0])return 0;if(t>=e[r+1])return r;for(;n<r;){let i=n+r+1>>1;e[i]<=t?n=i:r=i-1}return n}var Pf=class{group=new Dn;runs=[];t3;ft;m=new W;a=new H;b=new H;X=new H;Y=new H;Z=new H;lamps=[];shown=0;constructor(e,t){for(let n of e.trams){let e=cf(t,n.start,n.count,n.first,sf.tram),r=n.count,i=new Float32Array(r),a=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r),c=new Float32Array(r),l=1/0,u=-1/0,d=1/0,f=-1/0;for(let t=0;t<r;t++){let n=t*4;i[t]=e[n],a[t]=e[n+1],o[t]=e[n+2],s[t]=e[n+3],c[t]=t?c[t-1]+Math.hypot(i[t]-i[t-1],o[t]-o[t-1]):0,l=Math.min(l,i[t]),u=Math.max(u,i[t]),d=Math.min(d,o[t]),f=Math.max(f,o[t])}this.runs.push({x:i,y:a,z:o,t:s,s:c,phase:n.phase,headway:n.headway,T:s[r-1],line:n.line,box:[l,u,d,f]})}let n=af({roughness:.45}),r=(e,t)=>{let r=new vi(e,n,t);return r.count=0,r.castShadow=r.receiveShadow=!0,r.frustumCulled=!1,r.layers.enable(1),this.group.add(r),r};this.t3=r(jf(),512),this.ft=[r(Mf(`front`),256),r(Mf(`mid`),256),r(Mf(`rear`),256)]}at(e,t,n){let r=Nf(e.s,t),i=e.s[r+1]-e.s[r],a=i>1e-6?Math.min(1,Math.max(0,(t-e.s[r])/i)):0;return n.set(e.x[r]+(e.x[r+1]-e.x[r])*a,e.y[r]+(e.y[r+1]-e.y[r])*a,e.z[r]+(e.z[r+1]-e.z[r])*a)}car(e,t,n,r,i=!1){if(t-n<0||t>e.s[e.s.length-1])return!1;this.at(e,t-n*.2,this.a),this.at(e,t-n*.8,this.b);let a=this.a.x-this.b.x,o=this.a.y-this.b.y,s=this.a.z-this.b.z,c=Math.hypot(a,o,s)||1,{X:l,Y:u,Z:d}=this;return l.set(a/c,o/c,s/c),i&&l.negate(),d.set(-l.z,0,l.x).normalize(),u.crossVectors(d,l),this.m.makeBasis(l,u,d),this.m.setPosition((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2,(this.a.z+this.b.z)/2),r.setMatrixAt(r.count++,this.m),!0}update(e,t,n,r){this.t3.count=0;for(let e of this.ft)e.count=0;this.lamps.length=0,this.shown=0;let i=n*n;for(let a=0;a<this.runs.length;a++){let o=this.runs[a];if(t.x<o.box[0]-n||t.x>o.box[1]+n||t.z<o.box[2]-n||t.z>o.box[3]+n)continue;let s=e-o.phase;for(let e=Math.ceil((s-o.T)/o.headway);e<=Math.floor(s/o.headway);e++){let n=s-e*o.headway,c=Nf(o.t,n),l=o.t[c+1]-o.t[c],u=l>1e-6?Math.min(1,Math.max(0,(n-o.t[c])/l)):0,d=o.s[c]+(o.s[c+1]-o.s[c])*u,f=o.x[c],p=o.z[c];if((f-t.x)**2+(p-t.z)**2>i)continue;let m=Math.sin(a*12.9898+e*78.233)*43758.5453,h=m-Math.floor(m),g=!1;if(h<.34){if(this.ft[0].count<256){let e=d;this.ft.forEach((t,n)=>{g=this.car(o,e,Tf[n],t)||g,e-=Tf[n]})}}else this.t3.count<510&&(g=this.car(o,d,wf,this.t3),h>.5&&(g=this.car(o,d-wf,wf,this.t3)||g));g&&(this.shown++,r&&(this.at(o,d-.3,this.a),this.lamps.push(this.a.x,this.a.y+1,this.a.z,1)))}}for(let e of[this.t3,...this.ft])ef(e)}},Ff=[`#8fb8d8`,`#e8b04a`,`#d9674a`,`#9cc79a`,`#f0e6c8`,`#6d8fc7`].map(e=>new G(e)),If=Z(`#eeeeea`),Lf=Z(`#27344a`),Rf=Z(`#1d2227`),zf=Z(`#d9d8d2`),Bf=Z(`#2c2824`),Vf=[`#d9522f`,`#e8c235`,`#2f6fbd`,`#4ea35a`,`#e86a9a`,`#f0f0ea`].map(e=>new G(e)),Hf=Z(`#d4602c`),Uf=Z(`#f1e9d6`),Wf=Z(`#e6e6e2`),Gf=Z(`#3a3d40`),Kf=Z(`#1e1e1e`),qf=Z(`#9b2a22`),Jf=Z(`#35507a`),Yf=Z(`#f4f4f2`),Xf=Z(`#c8202a`);function Zf(e,t,n,r,i=Wf){let a=t.length;for(let o=0;o<a;o++){let[s,c]=t[o],[l,u]=t[(o+1)%a],d=Math.hypot(l-s,u-c);e.beam([s,n+r,c],[l,n+r,u],.05,i),e.beam([s,n+r*.5,c],[l,n+r*.5,u],.035,i);let f=Math.max(1,Math.round(d/1.6));for(let t=0;t<f;t++){let a=t/f,o=s+(l-s)*a,d=c+(u-c)*a;e.beam([o,n,d],[o,n+r,d],.045,i)}}}function Qf(e,t,n,r,i){e.beam([t,n,r],[t,n+i,r],.06,Wf),e.box(t,n+i-.5,r-.02,t+.75,n+i-.25,r+.02,Yf),e.box(t,n+i-.75,r-.02,t+.75,n+i-.5,r+.02,Xf),e.box(t,n+i-.7,r-.025,t+.28,n+i-.3,r+.025,Z(`#1d3f8a`))}function $f(e,t,n,r,i,a){let o=1/0,s=-1/0,c=0;for(let[e,n]of t)o=Math.min(o,e),s=Math.max(s,e),c=Math.max(c,Math.abs(n));e.glow=1;for(let t=o+1.2;t+a<s-.8;t+=i)for(let i of[-1,1]){let o=i*c;e.box(t,n,Math.min(o,o+i*.04),t+a,r,Math.max(o,o+i*.04),Rf)}e.glow=0}function ep(e){let t=new qd,n=e===2?6.6:5.6,r=e===1,i=Jd(28.6,n-1,5,1.4),a=Jd(30,n,5.5,1.6);t.prism(i,-.35,.2,()=>r?Bf:Lf),t.band(i,.2,a,1.15,()=>r?Bf:If),t.prism(Yd(a,-.05,-.06),.98,1.12,()=>Gf),t.lid(a,1.15,zf,1),t.prism(Yd(a,.1,.05),1.15,1.7,()=>If),t.prism(Yd(a,.3,.2),1.15,1.7,()=>If),t.lid(Yd(a,.1,.05),1.7,zf,1);let o=Yd(a,3.4,.5),s=1.15;if(e===2){t.prism(o,s,1.65,()=>If),t.glow=1,t.prism(o,1.65,3.4499999999999997,()=>Rf),t.glow=0,t.prism(o,3.4499999999999997,3.9,()=>If),t.lid(o,3.9,zf,1);let e=0;for(let[,t]of o)e=Math.max(e,Math.abs(t));for(let n=-10.5;n<9;n+=1.7)for(let r of[-1,1])t.beam([n,1.65,r*(e+.02)],[n,3.4499999999999997,r*(e+.02)],.08,If);return t.box(6,3.9,-1.5,9,4.35,1.5,If),t.glow=1,t.box(6,4.35,-1.52,9,5.1,1.52,Rf),t.glow=0,t.box(5.8,5.1,-1.7,9.2,5.22,1.7,If),Qf(t,-13.2,1.7,0,2.6),t.geometry()}t.prism(o,s,2.65,()=>If),$f(t,o,1.7,2.5,1.7,1.15),t.prism(o,2.65,3,()=>If),t.lid(o,3,zf,1),Zf(t,Yd(o,.12,.06),3,1);for(let e=-10;e<=4;e+=1.6)t.box(e,3,-1.9,e+.5,3.45,-.4,Jf),t.box(e,3,.4,e+.5,3.45,1.9,Jf);let c=n/2-1;for(let e of[-10.8,-6,-1.2])for(let n of[-1,1])t.beam([e,3,n*c],[e,5.25,n*c],.08,Wf);return t.box(-11.3,5.25,-c-.3,-.7,5.4,c+.3,If,!0),t.box(6.5,3,-1.4,9.4,3.5,1.4,If),t.glow=1,t.box(6.5,3.5,-1.42,9.4,4.25,1.42,Rf),t.glow=0,t.box(6.3,4.25,-1.6,9.6,4.4,1.6,If),t.beam([9.8,3,0],[9.8,6.2,0],.07,Wf),Qf(t,-13.4,1.7,0,2.4),e===1&&(t.box(-.3,3,-.6,.9,6.4,.6,Kf),t.box(-.32,5.5,-.62,.92,5.95,.62,qf)),t.geometry()}function tp(){let e=new qd,t=Jd(3.6,1.9,1,.4);e.prism(t,-.12,.3,()=>If),e.tint=1,e.prism(t,.3,.48,()=>[1,1,1]),e.tint=0,e.lid(t,.48,zf,1),e.box(.75,.48,-.72,.8,.9,.72,Z(`#9fb4bf`));let n=[Z(`#e9e4da`),Z(`#3b4452`)];return[-.45,.45].forEach((t,r)=>{e.box(-.55,.48,t-.32,-.05,.72,t+.32,Hf);for(let n=0;n<5;n++)e.box(-.62,.72+n*.11,t-.32,-.5,.83+n*.11,t+.32,n%2?Uf:Hf);e.box(-.5,.72,t-.19,-.18,1.12,t+.19,n[r]),e.ellipsoid([-.34,1.25,t],[.11,.13,.11],Z(`#c9a58a`),6,3)}),e.geometry()}function np(){let e=new qd,t=Jd(4.3,.64,1.9,1.9);return e.tint=1,e.prism(t,-.1,.22,()=>[1,1,1]),e.lid(t,.22,[.92,.92,.92],1),e.tint=0,e.box(-.5,.22,-.22,.4,.26,.22,Z(`#1c1e20`)),e.box(-.35,.22,-.17,-.02,.62,.17,Z(`#d9522f`)),e.ellipsoid([-.18,.74,0],[.1,.12,.1],Z(`#c9a58a`),6,3),e.beam([.15,.62,-1.15],[.15,.46,1.15],.04,Z(`#e8e2c6`)),e.box(.12,.6,-1.3,.18,.7,-1,Z(`#f0c030`)),e.box(.12,.38,1,.18,.5,1.3,Z(`#f0c030`)),e.geometry()}function rp(){let e=new qd,t=Jd(17.6,.6,6,5);e.prism(t,-.05,.28,()=>Z(`#e8e2c6`)),e.lid(t,.28,Z(`#d8d0b0`),1);for(let t=0;t<8;t++){let n=-5.2+t*1.4,r=t%2?1:-1;e.box(n-.18,.28,-.2,n+.18,.95,.2,Z(`#2d4f8c`)),e.ellipsoid([n,1.05,0],[.1,.12,.1],Z(`#c9a58a`),6,3),e.beam([n+.2,.55,.3*r],[n+.6,.35,3.6*r],.05,Z(`#e2e2de`)),e.box(n+.45,.25,3.3*r-.12,n+.75,.4,3.9*r+.12*r,Z(`#c73a2e`))}return e.box(6.3,.28,-.2,6.7,.8,.2,Z(`#3a3a3a`)),e.geometry()}function ip(){let e=new qd,t=Z(`#f1f0ea`);e.ellipsoid([0,.12,0],[.55,.22,.26],t,8,4),e.beam([.38,.2,0],[.5,.62,0],.09,t),e.beam([.5,.62,0],[.47,.8,0],.08,t),e.ellipsoid([.53,.82,0],[.09,.05,.05],t,6,3),e.box(.6,.79,-.025,.7,.83,.025,Z(`#d8662a`)),e.wing=1;for(let n of[-1,1])e.tri([-.35,.3,0],[.25,.3,0],[-.25,.3,1.05*n],t,[0,1,0]),e.tri([-.35,.3,0],[.25,.3,0],[-.25,.3,1.05*n],t,[0,-1,0]);return e.wing=0,e.geometry()}function ap(){let e=new qd;return e.box(-11,-.3,-1.8,11,.45,1.8,Z(`#77736b`)),e.box(-11,.45,1.7,11,1.4,1.8,Z(`#dcdad4`)),e.box(-2,.45,-1.2,2,2.6,.8,Z(`#e2ded5`)),e.geometry()}function op(){let e=[],t=[],n=[],r=r=>{let i=e.length/3;for(let n=0;n<r.length;n++){let[i,a,o,s]=r[n],c=Math.min(r.length-1,n+1),l=Math.max(0,n-1),u=r[c][0]-r[l][0],d=r[c][1]-r[l][1],f=Math.hypot(u,d)||1,p=-d/f,m=u/f;e.push(i+p*o,0,a+m*o,i-p*o,0,a-m*o),t.push(.6,.64,.66,s,.6,.64,.66,s)}for(let e=0;e+1<r.length;e++){let t=i+e*2;n.push(t,t+2,t+1,t+1,t+2,t+3)}},i=19.5*Math.PI/180;for(let e of[-1,1]){let t=[];for(let n=0;n<=1;n+=.1){let r=n*3.2;t.push([.42-r*Math.cos(i),e*(.06+r*Math.sin(i)),.02+.05*n,.12*(1-n)**1.6])}r(t)}let a=[];for(let e=0;e<=1;e+=.1)a.push([-.5-e*2.2,0,.08+.08*e,.16*(1-e)**1.8]);r(a);let o=new Nr;return o.setAttribute(`position`,new K(e,3)),o.setAttribute(`normal`,new K(e.map((e,t)=>+(t%3==1)),3)),o.setAttribute(`color`,new K(t,4)),o.setAttribute(`aGlow`,new K(new Float32Array(e.length/3),1)),o.setAttribute(`aTint`,new K(new Float32Array(e.length/3),1)),o.setIndex(n),o}var sp=class{n;length;st;wl;wr;constructor(e){this.st=e,this.n=e.length/5,this.length=(this.n-1)*10,this.wl=new Float32Array(this.n),this.wr=new Float32Array(this.n);for(let t=0;t<this.n;t++){let n=0,r=0,i=0;for(let a=-5;a<=5;a++){let o=Math.min(this.n-1,Math.max(0,t+a));n+=e[o*5+3],r+=e[o*5+4],i++}this.wl[t]=n/i,this.wr[t]=r/i}}at(e,t,n){let r=Math.min(this.n-1.001,Math.max(0,e/10)),i=Math.floor(r),a=r-i,o=this.st,s=o[i*5]+(o[i*5+5]-o[i*5])*a,c=o[i*5+1]+(o[i*5+6]-o[i*5+1])*a,l=o[i*5+5]-o[i*5],u=o[i*5+6]-o[i*5+1],d=Math.hypot(l,u)||1;return l/=d,u/=d,n.x=s+u*t,n.z=c-l*t,n.y=o[i*5+2]+(o[i*5+7]-o[i*5+2])*a,n.dx=l,n.dz=u,n.wl=this.wl[i]+(this.wl[i+1]-this.wl[i])*a,n.wr=this.wr[i]+(this.wr[i+1]-this.wr[i])*a,n}locate(e,t,n){let r=Math.min(this.n-1,Math.max(0,Math.round(n/10))),i=n=>(this.st[n*5]-e)**2+(this.st[n*5+1]-t)**2;for(let e=0;e<400;e++)if(r>0&&i(r-1)<i(r))r--;else if(r<this.n-1&&i(r+1)<i(r))r++;else break;return r*10}level(e){let t=Math.min(this.n-1,Math.max(0,Math.round(e/10)));return this.st[t*5+2]}},cp=class{st;a;b;up;down;length;R;constructor(e,t,n,r,i){this.st=e,this.a=t,this.b=n,this.up=r,this.down=i;let a=e.at((t+n)/2,0,lp);this.R=Math.min(60,(r*a.wl+i*a.wr)/2),this.length=2*(n-t)+2*Math.PI*this.R}place(e){let t=this.b-this.a,n=Math.PI*this.R;e=(e%this.length+this.length)%this.length;let r=(e,t)=>{let n=this.st.at(e,0,lp);return t>0?this.up*n.wl:-this.down*n.wr};if(e<t){let t=this.b-e;return[t,r(t,1)]}if(e-=t,e<n){let t=e/n;return[this.a-this.R*Math.sin(Math.PI*t),r(this.a,1)+(r(this.a,-1)-r(this.a,1))*(.5-.5*Math.cos(Math.PI*t))]}if(e-=n,e<t){let t=this.a+e;return[t,r(t,-1)]}e-=t;let i=e/n;return[this.b+this.R*Math.sin(Math.PI*i),r(this.b,-1)+(r(this.b,1)-r(this.b,-1))*(.5-.5*Math.cos(Math.PI*i))]}},lp={x:0,y:0,z:0,dx:0,dz:0,wl:0,wr:0},up=class{group=new Dn;st;bank;level;bm;tours=[];rowers=[];pedal=[];kayaks=[];pedalRange;swans=[];boats;pedalMesh;kayakMesh;eightMesh;swanMesh;wakeMesh;flap;moored;pontoonAt;pontoonMesh;rand;lamps=[];constructor(e,t,n,r){this.st=new sp(t),this.bank=n,this.level=r,this.bm=e.bank,this.moored=e.moored,this.pontoonAt=e.pontoon;let i=e.river.marks,a=e.river.pools,o=e=>a.find(([t,n])=>e>=t&&e<=n)??[e-200,e+200],s=o(i.palacky),c=o(i.legion),l=o(i.cechuv),u=[[new cp(this.st,Math.max(s[0],i.railway-150)+70,s[1]-90,.42,.42),1],[new cp(this.st,c[0]+80,c[1]-80,.35,.3),1],[new cp(this.st,Math.max(l[0],i.charles)+90,Math.min(l[1]-90,i.cechuv+380),.4,.4),2]],d=Qd(11);this.rand=Qd(5);let f=(e,t,n,r)=>{for(let i=0;i<60;i++){let i=e+(d()-.5)*n,a=t+(d()-.5)*n;if(this.bankAt(i,a)>=r)return[i,a]}return[e,t]};for(let[e,t]of u)for(let n=0;n<t;n++)this.tours.push({c:e,u0:(n/t+d()*.2)*e.length,v:2.8+d()*.8,kind:d()<.3?2:0,len:26+d()*10});let p=new cp(this.st,Math.max(s[0]+150,i.vysehrad-700),s[1]-70,.12,.12);this.rowers.push({c:p,u0:0,v:4.6},{c:p,u0:p.length*.55,v:4.9});let m=e.river.weirs.find(([e])=>e>i.legion)??[c[1],c[1]];this.pedalRange=[i.legion+25,(m[0]+m[1])/2];for(let e=0;e<12;e++){let e=this.pedalRange[0]+d()*(this.pedalRange[1]-this.pedalRange[0]),t=this.st.at(e,0,lp),[n,r]=f(t.x,t.z,160,12);this.pedal.push({x:n,z:r,th:d()*Math.PI*2,w:0,wt:0,v:0,vt:1.1,s:e,rest:d()*20,flap:0})}for(let e=0;e<6;e++){let e=this.pedalRange[0]+d()*(this.pedalRange[1]-this.pedalRange[0]),t=this.st.at(e,0,lp),[n,r]=f(t.x,t.z,120,10);this.kayaks.push({x:n,z:r,th:d()*Math.PI*2,w:0,wt:0,v:0,vt:1.5,s:e,rest:d()*20,flap:0})}for(let[t,,n,r]of e.swans)for(let e=0;e<r;e++){let[e,r]=f(t,n,16,3);this.swans.push({x:e,z:r,th:d()*6.28,w:0,wt:0,v:0,vt:.2,s:this.st.locate(t,n,0),rest:0,flap:30+d()*60,home:[t,n]})}let h=af({roughness:.5}),g=e=>(this.group.add(e),e);this.boats=[0,1,2].map(e=>g($d(ep(e),h,24,{shadow:!0,reflect:!0}))),this.pedalMesh=g($d(tp(),h,40,{shadow:!0,reflect:!0})),this.kayakMesh=g($d(np(),h,8,{reflect:!0})),this.kayakMesh.setColorAt(0,Vf[0]),this.eightMesh=g($d(rp(),h,4,{reflect:!0})),this.pontoonMesh=g($d(ap(),h,1,{shadow:!0,reflect:!0}));let _=ip();this.flap=new ui(new Float32Array(this.swans.length*4),4),_.setAttribute(`aFlap`,this.flap),this.swanMesh=g($d(_,af({roughness:.7,wings:!0}),this.swans.length,{reflect:!0})),this.wakeMesh=g($d(op(),af({roughness:.9,transparent:!0}),40)),this.wakeMesh.receiveShadow=!1,this.wakeMesh.renderOrder=2,this.pedalMesh.setColorAt(0,Ff[0])}bankAt(e,t){let n=this.bm,r=Math.round((e-n.x0)/n.cell),i=Math.round((t-n.z0)/n.cell);return r>=0&&i>=0&&r<n.nx&&i<n.nz?this.bank[i*n.nx+r]:0}waterAt(e,t,n){let r=this.bm,i=(e-r.x0)/r.cell,a=(t-r.z0)/r.cell,o=Math.floor(i),s=Math.floor(a);if(o<0||s<0||o>=r.nx-1||s>=r.nz-1)return this.st.level(n);let c=i-o,l=a-s,u=this.level,d=s*r.nx+o,f=u[d],p=u[d+1],m=u[d+r.nx],h=u[d+r.nx+1];if(f===-32768||p===-32768||m===-32768||h===-32768){let e=[f,p,m,h].filter(e=>e!==-32768);return e.length?e.reduce((e,t)=>e+t,0)/e.length/100:this.st.level(n)}return((f*(1-c)+p*c)*(1-l)+(m*(1-c)+h*c)*l)/100}steer(e,t,n,r,i,a,o){e.wt+=t,e.wt>4&&(e.wt=0,e.w=(n()-.5)*.25);let s=e.w,c=Math.cos(e.th),l=Math.sin(e.th),u=a+4,d=e.x+c*u,f=e.z+l*u;if(this.bankAt(d,f)<a){let t=this.bankAt(d+6,f)-this.bankAt(d-6,f),n=this.bankAt(d,f+6)-this.bankAt(d,f-6),r=Math.atan2(n,t)-e.th;r=Math.atan2(Math.sin(r),Math.cos(r)),s+=Math.sign(r)*.6}e.s=this.st.locate(e.x,e.z,e.s);let p=this.st.at(e.s,0,lp);if(e.home){let t=e.home[0]-e.x,n=e.home[1]-e.z;if(t*t+n*n>484){let r=Math.atan2(n,t)-e.th;r=Math.atan2(Math.sin(r),Math.cos(r)),s+=Math.sign(r)*.3}}else if(e.s<r||e.s>i){let t=e.s<r?1:-1,n=Math.atan2(p.dz*t,p.dx*t)-e.th;n=Math.atan2(Math.sin(n),Math.cos(n)),s+=Math.sign(n)*.4}for(let t of o){if(t===e)continue;let n=t.x-e.x,r=t.z-e.z;n*n+r*r<100&&n*c+r*l>0&&(s+=(n*l-r*c>0?1:-1)*.3)}e.th+=Math.max(-.5,Math.min(.5,s))*t,e.v+=(e.vt-e.v)*Math.min(1,t*.5);let m=e.x+Math.cos(e.th)*e.v*t,h=e.z+Math.sin(e.th)*e.v*t;this.bankAt(m,h)>=2?(e.x=m,e.z=h):e.th+=Math.PI*.5*t}simulate(e){let t=this.rand;for(let n of this.pedal){if(n.rest-=e,n.rest<0){let e=t()<.25;n.vt=e?0:.8+t()*.7,n.rest=e?8+t()*20:20+t()*40}this.steer(n,e,t,this.pedalRange[0],this.pedalRange[1],16,this.pedal)}for(let n of this.kayaks)n.rest-=e,n.rest<0&&(n.vt=t()<.2?.2:1.2+t()*.8,n.rest=15+t()*30),this.steer(n,e,t,this.pedalRange[0],this.pedalRange[1],10,this.kayaks);for(let n of this.swans)n.rest-=e,n.rest<0&&(n.vt=t()<.4?.05:.15+t()*.25,n.rest=6+t()*14),n.flap-=e,n.flap<-2.2&&(n.flap=40+t()*80),this.steer(n,e,t,0,this.st.length,4,this.swans)}update(e,t,n,r,i){this.simulate(Math.min(t,.25)),this.lamps.length=0;let a=(1800+Math.max(0,r.y)*3)**2,o=(e,t)=>(e-r.x)**2+(t-r.z)**2<a;for(let e of this.boats)e.count=0;this.wakeMesh.count=0;let s={...lp},c={...lp},l=(e,t,n,r,i,a,o)=>{this.wakeMesh.count<40&&Zd(this.wakeMesh,this.wakeMesh.count++,e,t+.06,n,r,i,a,1,o)};for(let t of this.tours){let n=t.u0+t.v*e,[r,a]=t.c.place(n),[u,d]=t.c.place(n+2);if(this.st.at(r,a,s),this.st.at(u,d,c),!o(s.x,s.z))continue;let f=c.x-s.x,p=c.z-s.z,m=Math.hypot(f,p)||1,h=this.boats[t.kind];s.y=this.waterAt(s.x,s.z,r),Zd(h,h.count++,s.x,s.y,s.z,f/m,p/m,t.len/30),l(s.x,s.y,s.z,f/m,p/m,t.len,t.len*.9),i&&this.lamps.push(s.x+f/m*t.len*.45,s.y+3.5,s.z+p/m*t.len*.45,1)}for(let[e,t,n,r,i,a]of this.moored){if(!o(e,n))continue;let s=this.boats[a];s.count<24&&Zd(s,s.count++,e,t,n,Math.sin(r),-Math.cos(r),i/30)}for(let e of this.boats)ef(e);{let[e,t,n,r]=this.pontoonAt;this.pontoonMesh.count=0,e!==void 0&&o(e,n)&&Zd(this.pontoonMesh,this.pontoonMesh.count++,e,t,n,Math.sin(r),-Math.cos(r)),ef(this.pontoonMesh)}if(this.eightMesh.count=0,n>5.5&&n<10.5)for(let t of this.rowers){let n=t.u0+t.v*e,[r,i]=t.c.place(n),[a,u]=t.c.place(n+2);if(this.st.at(r,i,s),this.st.at(a,u,c),!o(s.x,s.z))continue;let d=c.x-s.x,f=c.z-s.z,p=Math.hypot(d,f)||1;s.y=this.waterAt(s.x,s.z,r),Zd(this.eightMesh,this.eightMesh.count++,s.x,s.y,s.z,d/p,f/p),l(s.x,s.y,s.z,d/p,f/p,17.6,9)}ef(this.eightMesh),this.pedalMesh.count=0;let u=n>9&&n<21.5,d=7;this.pedal.forEach((e,t)=>{if(!u){d++;return}if(!o(e.x,e.z))return;let n=Math.cos(e.th),r=Math.sin(e.th),i=this.waterAt(e.x,e.z,e.s);this.pedalMesh.setColorAt(this.pedalMesh.count,Ff[t%Ff.length]),Zd(this.pedalMesh,this.pedalMesh.count++,e.x,i,e.z,n,r),e.v>.3&&l(e.x,i,e.z,n,r,3.5,3.5*Math.min(1,e.v))});{let[e,t,n,r]=this.pontoonAt;if(e!==void 0&&o(e,n))for(let i=0;i<d;i++){let a=Math.sin(r),o=-Math.cos(r),s=i<10?0:1,c=(i%10-4.5)*2.2,l=3.6+s*3.6;this.pedalMesh.setColorAt(this.pedalMesh.count,Ff[i*5%Ff.length]),Zd(this.pedalMesh,this.pedalMesh.count++,e+a*c-o*l,t,n+o*c+a*l,o,-a)}}ef(this.pedalMesh),this.kayakMesh.count=0,u&&this.kayaks.forEach((e,t)=>{if(!o(e.x,e.z))return;let n=Math.cos(e.th),r=Math.sin(e.th),i=this.waterAt(e.x,e.z,e.s);this.kayakMesh.setColorAt(this.kayakMesh.count,Vf[t%Vf.length]),Zd(this.kayakMesh,this.kayakMesh.count++,e.x,i,e.z,n,r),e.v>.4&&l(e.x,i,e.z,n,r,4.3,3*Math.min(1,e.v/1.5))}),ef(this.kayakMesh),this.swanMesh.count=0;for(let e of this.swans){if(!o(e.x,e.z))continue;let t=this.swanMesh.count++;Zd(this.swanMesh,t,e.x,this.waterAt(e.x,e.z,e.s),e.z,Math.cos(e.th),Math.sin(e.th));let n=e.flap<0?Math.min(1,-e.flap*3,(2.2+e.flap)*3):0;this.flap.setXYZW(t,n,.7,t*1.7,9)}ef(this.swanMesh),ef(this.wakeMesh)}},dp={[of.Bridge]:650,[of.Square]:420,[of.Lanes]:260,[of.Kampa]:110,[of.Quay]:300,[of.Petrin]:150};function fp(e,t){let n=(e,n,r,i)=>r+(i-r)*Math.min(1,Math.max(0,(t-e)/(n-e))),r=t<6?.06:t<9?n(6,9,.08,.4):t<12?n(9,12,.4,1):t<18?1:t<21?n(18,21,1,.65):n(21,23,.65,.3);return e===of.Quay&&(r=t<12?r*.6:t<21.5?Math.max(r,.9):r),e===of.Petrin&&t>18&&(r*=n(18,21,1,.3)),r}var pp=[`#e8e4dc`,`#d9cfbd`,`#c2b49a`,`#5b6f8c`,`#34405a`,`#23272e`,`#6d7074`,`#9aa0a6`,`#f0ede6`,`#4e5a3e`,`#8c3b35`,`#b98a5e`,`#7fa3b8`,`#c9a3a6`,`#2f3a4a`].map(e=>new G(e));function mp(){let e=new qd;return e.box(-.13,0,-.17,.13,.84,.17,Z(`#3a3c40`)),e.tint=1,e.box(-.14,.84,-.22,.14,1.44,.22,[1,1,1]),e.tint=0,e.box(-.1,1.44,-.09,.1,1.68,.09,Z(`#c19a80`)),e.box(-.11,1.6,-.1,.09,1.72,.1,Z(`#4a3a2e`)),e.geometry()}var hp=class{group=new Dn;paths=[];walkers=[];zoneBox=[];mesh;constructor(e,t){for(let n of e.walks){let e=cf(t,n.start,n.count,n.first,sf.walk),r=n.count,i=new Float32Array(r),a=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r),c=1/0,l=-1/0,u=1/0,d=-1/0;for(let t=0;t<r;t++){let n=t*3;i[t]=e[n],a[t]=e[n+1],o[t]=e[n+2],s[t]=t?s[t-1]+Math.hypot(i[t]-i[t-1],o[t]-o[t-1]):0,c=Math.min(c,i[t]),l=Math.max(l,i[t]),u=Math.min(u,o[t]),d=Math.max(d,o[t])}this.paths.push({zone:n.zone,x:i,y:a,z:o,s,width:n.width,box:[c,l,u,d]})}let n=Qd(23),r=0;for(let e of Object.values(of)){let t=this.paths.map((e,t)=>({p:e,i:t})).filter(t=>t.p.zone===e),i=t.reduce((e,t)=>e+t.p.s[t.p.s.length-1],0),a=[],o=[1/0,-1/0,1/0,-1/0];for(let{p:e}of t)o[0]=Math.min(o[0],e.box[0]),o[1]=Math.max(o[1],e.box[1]),o[2]=Math.min(o[2],e.box[2]),o[3]=Math.max(o[3],e.box[3]);if(i>0)for(let r=0;r<dp[e];r++){let e=n()*i,r=t[0];for(let n of t)if(e-=n.p.s[n.p.s.length-1],r=n,e<=0)break;let o=n()<.18;a.push({path:r.i,phase:n(),v:o?0:1+n()*.5,lat:(n()-.5)*r.p.width,rank:n(),colour:Math.floor(n()*pp.length)})}a.sort((e,t)=>e.rank-t.rank),this.walkers[e]=a,this.zoneBox[e]=o,r+=a.length}this.mesh=$d(mp(),af({roughness:.85}),r),this.mesh.setColorAt(0,pp[0]),this.group.add(this.mesh)}update(e,t,n){let r=700+Math.max(0,n.y)*.8,i=r*r,a=0;for(let o=0;o<this.walkers.length;o++){let s=this.zoneBox[o],c=this.walkers[o];if(!c?.length||n.x<s[0]-r||n.x>s[1]+r||n.z<s[2]-r||n.z>s[3]+r)continue;let l=Math.round(c.length*fp(o,t));for(let t=0;t<l;t++){let r=c[t],o=this.paths[r.path],s=o.s[o.s.length-1],l=(r.phase*2*s+r.v*e)%(2*s),u=l>s,d=u?2*s-l:l,f=0,p=0,m=o.s.length-2;for(;p<m;){let e=p+m+1>>1;o.s[e]<=d?p=e:m=e-1}f=p;let h=o.s[f+1]-o.s[f]||1,g=(d-o.s[f])/h,_=(o.x[f+1]-o.x[f])/h,v=(o.z[f+1]-o.z[f])/h,y=o.x[f]+(o.x[f+1]-o.x[f])*g-v*r.lat,b=o.z[f]+(o.z[f+1]-o.z[f])*g+_*r.lat;(y-n.x)**2+(b-n.z)**2>i||(u&&(_=-_,v=-v),this.mesh.setColorAt(a,pp[r.colour]),Zd(this.mesh,a++,y,o.y[f]+(o.y[f+1]-o.y[f])*g,b,_,v))}}this.mesh.count=a,ef(this.mesh)}};function gp(){let e=new qd,t=Z(`#7c818d`);e.ellipsoid([0,.13,0],[.17,.08,.075],t,6,3),e.ellipsoid([.15,.22,0],[.05,.05,.045],Z(`#5d6470`),5,3),e.tri([-.15,.14,0],[-.3,.12,-.06],[-.3,.12,.06],Z(`#50555f`),[0,1,0]),e.box(-.01,0,-.03,.03,.06,.03,Z(`#b0585a`)),e.wing=1;for(let n of[-1,1])e.tri([-.1,.18,0],[.08,.18,0],[-.04,.18,.34*n],t,[0,1,0]),e.tri([-.1,.18,0],[.08,.18,0],[-.04,.18,.34*n],Z(`#5a5f6a`),[0,-1,0]);return e.wing=0,e.geometry()}var _p=class{group=new Dn;flocks=[];mesh;flap;constructor(e){let t=Qd(31),n=0;for(let[r,i,a,o]of e.pigeons){let e=[];for(let n=0;n<o;n++){let n=t()*Math.PI*2,r=Math.sqrt(t())*5;e.push({dx:Math.cos(n)*r,dz:Math.sin(n)*r,R:6+t()*12,H:5+t()*10,w:(.8+t()*.5)*(t()<.8?1:-1),psi:t()*6.28,D:14+t()*9,peck:t()*6.28})}this.flocks.push({x:r,y:i,z:a,birds:e,lifted:-1e9}),n+=o}let r=gp();this.flap=new ui(new Float32Array(n*4),4),r.setAttribute(`aFlap`,this.flap),this.mesh=$d(r,af({roughness:.8,wings:!0}),n),this.group.add(this.mesh)}update(e,t,n,r){let i=0;for(let a of this.flocks){let o=(a.x-t.x)**2+(a.z-t.z)**2>16e4;if(r<25&&(a.x-n.x)**2+(a.z-n.z)**2<1225&&e-a.lifted>26&&(a.lifted=e),o)continue;let s=e-a.lifted;a.birds.forEach((t,n)=>{let r=a.x+t.dx,o=a.y,c=a.z+t.dz,l=Math.cos(t.peck),u=Math.sin(t.peck),d=0;if(s<t.D){let e=Math.min(1,s/2),n=Math.min(1,Math.max(0,(s-t.D+3)/3)),i=e*e*(3-2*e)*(1-n*n*(3-2*n)),f=t.psi+t.w*s,p=a.x+Math.cos(f)*t.R,m=a.z+Math.sin(f)*t.R;r+=(p-r)*i,c+=(m-c)*i,o+=t.H*i,l=-Math.sin(f)*Math.sign(t.w),u=Math.cos(f)*Math.sign(t.w),d=+(i>.02)}else{let n=e*.3+t.peck*3;r+=Math.sin(n)*.4,c+=Math.cos(n*.7)*.4,l=Math.cos(n*.5+t.peck),u=Math.sin(n*.5+t.peck)}this.flap.setXYZW(i,d,.8,n*2.3,16),Zd(this.mesh,i++,r,o,c,l,u)})}this.mesh.count=i,ef(this.mesh)}},vp=40/3.6,yp=17,bp=[`#c4c6c8`,`#e9e9e6`,`#1f2124`,`#4b4f55`,`#2a3752`,`#7d2a26`,`#d7d1c3`,`#39443a`,`#9aa2aa`,`#e6e3dc`].map(e=>new G(e));function xp(){let e=new qd,t=Z(`#1e2327`),n=Z(`#1b1b1b`);e.box(-1.55,.12,-.92,-.95,.62,.92,n),e.box(.95,.12,-.92,1.55,.62,.92,n),e.tint=1,e.box(-2.15,.3,-.88,2.15,.86,.88,[1,1,1]),e.tint=0,e.glow=.3;let r=[[-1.45,-.8],[.75,-.8],[.75,.8],[-1.45,.8]],i=[[-1.2,-.72],[.35,-.72],[.35,.72],[-1.2,.72]];return e.band(r,.86,i,1.38,()=>t),e.glow=0,e.tint=1,e.lid(i,1.38,[1,1,1],1),e.tint=0,e.geometry()}var Sp=class{group=new Dn;lanes=[];mesh;lamps=[];constructor(e,t){e.roads.forEach((e,n)=>{let r=cf(t,e.start,e.count,e.first,sf.road),i=e.count,a=new Float32Array(i),o=new Float32Array(i),s=new Float32Array(i),c=new Float32Array(i),l=1/0,u=-1/0,d=1/0,f=-1/0;for(let e=0;e<i;e++){let t=e*3;a[e]=r[t],o[e]=r[t+1],s[e]=r[t+2],c[e]=e?c[e-1]+Math.hypot(a[e]-a[e-1],s[e]-s[e-1]):0,l=Math.min(l,a[e]),u=Math.max(u,a[e]),d=Math.min(d,s[e]),f=Math.max(f,s[e])}this.lanes.push({x:a,y:o,z:s,s:c,phase:n*7.3%yp,box:[l,u,d,f]})}),this.mesh=$d(xp(),af({roughness:.35,metalness:.3,glow:.05}),400,{shadow:!0,reflect:!0}),this.mesh.setColorAt(0,bp[0]),this.mesh.layers.enable(1),this.group.add(this.mesh)}update(e,t,n){let r=900+Math.max(0,t.y),i=r*r,a=0;this.lamps.length=0,this.lanes.forEach((o,s)=>{if(t.x<o.box[0]-r||t.x>o.box[1]+r||t.z<o.box[2]-r||t.z>o.box[3]+r)return;let c=o.s[o.s.length-1],l=e-o.phase;for(let e=Math.ceil((l-c/vp)/yp)-1;e<=Math.floor(l/yp);e++){let r=Math.sin(s*91.7+e*12.9898)*43758.5453,u=r-Math.floor(r);if(u<.25)continue;let d=(l-e*yp-u*yp*.33)*vp;if(d<0||d>c)continue;let f=0,p=o.s.length-2;for(;f<p;){let e=f+p+1>>1;o.s[e]<=d?f=e:p=e-1}let m=o.s[f+1]-o.s[f]||1,h=(d-o.s[f])/m,g=o.x[f]+(o.x[f+1]-o.x[f])*h,_=o.z[f]+(o.z[f+1]-o.z[f])*h,v=o.y[f]+(o.y[f+1]-o.y[f])*h;if((g-t.x)**2+(_-t.z)**2>i||a>=400)continue;let y=(o.x[f+1]-o.x[f])/m,b=(o.z[f+1]-o.z[f])/m;if(this.mesh.setColorAt(a,bp[Math.floor(u*1e3)%bp.length]),Zd(this.mesh,a++,g,v,_,y,b),n)for(let e of[-.62,.62])this.lamps.push(g+y*2.15-b*e,v+.62,_+b*2.15+y*e,1),this.lamps.push(g-y*2.15-b*e,v+.7,_-b*2.15+y*e,0)}}),this.mesh.count=a,ef(this.mesh)}},Cp=`
attribute float aKind;
uniform float uCity;
uniform float uPx;
uniform float uMirrorPass;
varying float vI;
varying vec3 vCol;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 1.0);
  float px = uPx * 0.9 / d;
  float pm = px * mix(1.0, 4.0, uMirrorPass);
  gl_PointSize = clamp(pm, 3.0, 60.0);
  vI = uCity * min(1.0, pow(px / 3.0, 1.2) + 0.1) * exp(-d / 5000.0) * mix(0.5, 1.0, aKind) * mix(1.0, 0.55, uMirrorPass * smoothstep(3.0, 6.0, pm));
  vCol = mix(vec3(1.0, 0.12, 0.08), vec3(1.0, 0.93, 0.8), aKind);
}`,wp=`
varying float vI;
varying vec3 vCol;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0 || vI <= 0.0) discard;
  float core = exp(-r2 * 30.0), halo = exp(-r2 * 6.0);
  gl_FragColor = vec4(vCol * vI * (core * 8.0 + halo * 0.2), 1.0);
}`,Tp=4096,Ep=class{points;pos=new Float32Array(Tp*3);kind=new Float32Array(Tp);material;constructor(){let e=new Nr;e.setAttribute(`position`,new yr(this.pos,3).setUsage(We)),e.setAttribute(`aKind`,new yr(this.kind,1).setUsage(We)),e.setDrawRange(0,0),this.material=new la({uniforms:{uCity:Y.uCityLights,uPx:{value:1e3},uMirrorPass:Y.uMirrorPass},vertexShader:Cp,fragmentShader:wp,transparent:!0,depthWrite:!1,...Zu,fog:!1}),this.points=new Vi(e,this.material),this.points.frustumCulled=!1,this.points.renderOrder=10,this.points.layers.enable(1),this.points.onBeforeRender=(e,t,n)=>{let r=e.getRenderTarget(),i=r?r.height:e.getDrawingBufferSize(new V).y;this.material.uniforms.uPx.value=n.projectionMatrix.elements[5]*i*.5}}set(e){let t=0;for(let n of e)for(let e=0;e+3<n.length&&t<Tp;e+=4,t++)this.pos[t*3]=n[e],this.pos[t*3+1]=n[e+1],this.pos[t*3+2]=n[e+2],this.kind[t]=n[e+3];let n=this.points.geometry;n.setDrawRange(0,t),t&&(n.attributes.position.needsUpdate=!0,n.attributes.aKind.needsUpdate=!0),this.points.visible=t>0&&Y.uCityLights.value>.001}},Dp=class{group=new Dn;trams;river;people;pigeons;cars;lamps=new Ep;time=0;constructor(e){let t=e.arrays,n=e.meta;this.trams=new Pf(n,t.tram),this.river=new up(n,t.river,t.bank,t.level),this.people=new hp(n,t.walk),this.pigeons=new _p(n),this.cars=new Sp(n,t.road),this.group.add(this.trams.group,this.river.group,this.people.group,this.pigeons.group,this.cars.group,this.lamps.points)}setTime(e){for(let t=this.time;t<e;t+=.25)this.river.simulate(.25);this.time=e}update(e,t,n,r,i){this.time+=e;let a=this.time,o=Y.uCityLights.value>.001,s=Math.min(3e3,1300+Math.max(0,n.y)*4);this.trams.update(a,n,s,o),this.river.update(a,e,t,n,o),this.people.update(a,t,n),this.pigeons.update(a,n,r,i),this.cars.update(a,n,o),this.lamps.set(o?[this.trams.lamps,this.cars.lamps,this.river.lamps]:[])}},Op=class e{group=new Dn;manifest;terrain;buildings;water;streets=null;landmarks=null;lights=null;trees=null;life=null;rest;streamDone=!1;bounds;height;surf;constructor(e,t,n,r,i,a,o,s,c){this.manifest=t,this.bounds=t.world,this.height=n,this.surf=r,i.anisotropy=s.capabilities.getMaxAnisotropy(),this.terrain=new tu(n,i,t.world),this.group.add(this.terrain.group);let l=su(a,t.world);this.group.add(l),this.water=new Ku(o,s.capabilities.getMaxAnisotropy()),this.group.add(this.water.group),this.buildings=new wu(e,t.tile,t.world),this.group.add(this.buildings.group),qu(this.terrain.group),qu(l),Yl(l.material),this.rest=c}get complete(){return this.streamDone&&this.buildings.loaded>=this.buildings.total&&this.buildings.reliefSettled}async stream(e,t){let n=this.rest,r=async e=>{await t(e),this.group.add(e)},[i,a]=await Promise.all([n.streets,n.landmarks]);this.streets=new Fu(i),this.landmarks=new Bu(a,this.buildings.material),qu(this.landmarks.group);for(let e of this.landmarks.fine)e.layers.disable(1);let o=i.arrays.lamp,s=i.arrays.wallLamp??new Float32Array,c=i.arrays.lamp2??new Float32Array,l=new Float32Array(o.length+(s.length+c.length)/4*3);l.set(o);let u=o.length;for(let e of[s,c])for(let t=0;t<e.length;t+=4,u+=3)l.set(e.subarray(t,t+3),u);this.lights=new ed(e,l,a.meta.lights??[]),await Promise.all([r(this.streets.group),r(this.landmarks.group),r(this.lights.points)]);let d=await n.trees;if(d){let e=new Ud(d,this.height);await r(e.group),this.trees=e}let f=await n.life;if(f){let e=new Dp(f);await r(e.group),this.life=e}this.streamDone=!0}static async load(t,n){let r=await(await fetch(`${t}/manifest.json`)).json(),i=Promise.all([Fl(`${t}/terrain.bin`),Fl(`${t}/surface.bin`),Fl(`${t}/landuse.bin`),Fl(`${t}/horizon.bin`),Fl(`${t}/water.bin`)]),a=e=>i.then(e),o={streets:a(()=>Fl(`${t}/streets.bin`)),landmarks:a(()=>Fl(`${t}/landmarks.bin`)),trees:a(()=>r.trees?Fl(`${t}/trees.bin`):Promise.resolve(null)),life:a(()=>r.life?Fl(`${t}/life.bin`):Promise.resolve(null))},[s,c,l,u,d]=await i,f=l.meta;return new e(t,r,Il.fromPack(s),Il.fromPack(c),nu(l.arrays.ground,f.nx,f.nz),Il.fromPack(u),d,n,o)}ground(e,t){return this.height.contains(e,t)?this.height.sample(e,t):0}surface(e,t,n){return this.surf.contains(e,t)?this.surf.maxAround(e,t,n):this.ground(e,t)}},kp=new W,Ap=new W,jp=new H,Mp=new H,Np=new H,Pp=[new H,new H,new H,new H],Fp=[new H,new H,new H,new H],Ip=[new H,new H,new H,new H,new H,new H,new H,new H],Lp=2,Rp=.1,zp=class extends La{constructor(){super(new Ka(-5,5,5,-5,.5,500)),this.isSunLightShadow=!0,this.mapSize.set(1024,1024),this._cameras=[],this._matrices=[],this._frustums=[],this._cascadeSplits=[,,,].fill(0),this._cascadeData=[],this._viewportCount=Lp,this._frameExtents.set(2,1);for(let e=0;e<Lp;e++)this._cameras.push(new Ka),this._matrices.push(new W),this._frustums.push(new Si),this._cascadeData.push(new qt);for(;this._viewports.length<Lp;)this._viewports.push(new qt)}getCamera(e=0){return this._cameras[e]}getMatrix(e=0){return this._matrices[e]}getFrustum(e=0){return this._frustums[e]}updateMatrices(e,t){if(t===void 0)return;let n=Math.min(.25,(Math.ceil(this.radius)+1)/this.mapSize.x),r=Math.min(.25,(Math.ceil(this.radius)+1)/this.mapSize.y);for(let e=0;e<Lp;e++)this._viewports[e].set(e+n,r,1-2*n,1-2*r);let i=this.mapSize.x*(1-2*n),a=this.mapSize.y*(1-2*r),o=Math.min(i,a),s=this.camera,c=t.near,l=Math.max(c+1e-6,Math.min(s.far,t.far)),u=this._cascadeSplits;u[0]=c;for(let e=1;e<Lp;e++){let t=e/Lp,n=c+(l-c)*t,r=c>0?c*(l/c)**+t:n;u[e]=(n+r)*.5}u[Lp]=l,jp.setFromMatrixPosition(e.matrixWorld).negate().normalize(),Mp.set(0,1,0),Math.abs(Mp.dot(jp))>.99&&Mp.set(0,0,1),kp.lookAt(Np.set(0,0,0),jp,Mp),Ap.copy(kp).transpose().multiply(t.matrixWorld);let d=t.reversedDepth?1:t.coordinateSystem===2001?0:-1,f=t.projectionMatrixInverse,p=-1/0;for(let e=0;e<4;e++){let n=e===0||e===1?1:-1,r=e===0||e===3?1:-1,i=Pp[e].set(n,r,d).applyMatrix4(f),a=Fp[e];t.isPerspectiveCamera===!0?a.copy(i).multiplyScalar(l/c):a.set(i.x,i.y,-l),i.applyMatrix4(Ap),a.applyMatrix4(Ap),p=Math.max(p,i.z,a.z)}p+=l;let m=s.near;for(let e=0;e<Lp;e++){let t=e===0?u[0]:this._cascadeData[e-1].z,n=u[e+1],r=n-Rp*(n-u[e]);this._cascadeData[e].set(e===0?-1e10:t,n,r,0);let d=(t-c)/(l-c),f=(n-c)/(l-c);Np.set(0,0,0);for(let e=0;e<4;e++)Ip[e*2].lerpVectors(Pp[e],Fp[e],d),Ip[e*2+1].lerpVectors(Pp[e],Fp[e],f),Np.add(Ip[e*2]).add(Ip[e*2+1]);Np.multiplyScalar(1/8);let h=0,g=1/0;for(let e=0;e<8;e++)h=Math.max(h,Ip[e].distanceToSquared(Np)),g=Math.min(g,Ip[e].z);let _=Math.sqrt(h);if(o>1){_/=1-1/o;let e=2*_/i,t=2*_/a;Np.x=Math.round(Np.x/e)*e,Np.y=Math.round(Np.y/t)*t}Np.z=p+m,Np.applyMatrix4(kp);let v=this._cameras[e];v.position.copy(Np),v.quaternion.setFromRotationMatrix(kp),v.left=-_,v.right=_,v.top=_,v.bottom=-_,v.near=m,v.far=p-g+2*m,v.coordinateSystem=s.coordinateSystem,v._reversedDepth=s.reversedDepth,v.updateProjectionMatrix(),v.updateMatrixWorld(),this._updateMatrix(v,this._matrices[e],this._frustums[e],this._viewports[e])}}},Bp=class extends Na{constructor(e,t){super(e,t),this.isSunLight=!0,this.type=`SunLight`,this.position.copy(En.DEFAULT_UP),this.updateMatrix(),this.shadow=new zp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t}},Vp=50.087,Hp=14.42,Up=2,Wp=Math.PI/180;function Gp(e){let t=e-Up,n=2*Math.PI/365*(150+(t-12)/24),r=229.18*(75e-6+.001868*Math.cos(n)-.032077*Math.sin(n)-.014615*Math.cos(2*n)-.040849*Math.sin(2*n)),i=.006918-.399912*Math.cos(n)+.070257*Math.sin(n)-.006758*Math.cos(2*n)+907e-6*Math.sin(2*n)-.002697*Math.cos(3*n)+.00148*Math.sin(3*n),a=((t*60+r+4*Hp)/4-180)*Wp,o=Vp*Wp,s=Math.sin(o)*Math.sin(i)+Math.cos(o)*Math.cos(i)*Math.cos(a);return{elevation:90-Math.acos(Math.min(1,Math.max(-1,s)))/Wp,azimuth:(Math.atan2(Math.sin(a),Math.cos(a)*Math.sin(o)-Math.tan(i)*Math.cos(o))/Wp+180+360)%360}}function Kp(e){let t=Math.round(e*60),n=Math.floor(t/60)%24,r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function qp(e){let[t,n]=e.split(`:`).map(Number);return t+n/60}var Jp=new Ka(-1,1,1,-1,0,1),Yp=new Nr;Yp.setAttribute(`position`,new K([-1,-1,0,3,-1,0,-1,3,0],3)),Yp.setAttribute(`uv`,new K([0,0,2,0,0,2],2));var Xp=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Zp=class{mesh;material;constructor(e,t,n={}){this.material=new la({vertexShader:Xp,fragmentShader:e,uniforms:t,defines:n,depthTest:!1,depthWrite:!1}),this.mesh=new oi(Yp,this.material),this.mesh.frustumCulled=!1}get uniforms(){return this.material.uniforms}render(e,t,n=0){e.setRenderTarget(t,n),e.render(this.mesh,Jp)}},Qp=`
${Bl}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / vec2(255.0, 63.0);
  float H = sqrt(A_RT * A_RT - A_RG * A_RG);
  float rho = H * uv.y;
  float r = sqrt(rho * rho + A_RG * A_RG);
  float dMin = A_RT - r, dMax = rho + H;
  float d = dMin + uv.x * (dMax - dMin);
  float mu = d <= 0.0 ? 1.0 : clamp((H * H - rho * rho - d * d) / (2.0 * r * d), -1.0, 1.0);
  vec3 ro = vec3(0.0, r, 0.0), rd = vec3(sqrt(max(0.0, 1.0 - mu * mu)), mu, 0.0);
  float tMax = max(0.0, aRaySphere(ro, rd, A_RT));
  vec3 od = vec3(0.0);
  const int N = 48;
  float dt = tMax / float(N);
  for (int i = 0; i < N; i++) {
    vec3 p = ro + rd * ((float(i) + 0.5) * dt);
    vec3 sR, sM, e;
    aMedium(length(p) - A_RG, sR, sM, e);
    od += e * dt;
  }
  gl_FragColor = vec4(exp(-od), 1.0);
}`,$p=`
${Bl}
${Vl}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / 31.0;
  float muS = uv.x * 2.0 - 1.0;
  float r = A_RG + max(0.01, uv.y * (A_RT - A_RG));
  vec3 ro = vec3(0.0, r, 0.0);
  vec3 sunDir = vec3(0.0, muS, -sqrt(max(0.0, 1.0 - muS * muS)));
  vec3 lum = vec3(0.0), fms = vec3(0.0);
  const int SQ = 8;
  const float INV = 1.0 / float(SQ * SQ);
  for (int i = 0; i < SQ; i++) for (int j = 0; j < SQ; j++) {
    float theta = A_PI * (float(i) + 0.5) / float(SQ);
    float phi = acos(clamp(1.0 - 2.0 * (float(j) + 0.5) / float(SQ), -1.0, 1.0));
    vec3 rd = vec3(sin(phi) * sin(theta), cos(phi), sin(phi) * cos(theta));
    float tA = aRaySphere(ro, rd, A_RT), tG = aRaySphere(ro, rd, A_RG);
    float tMax = tG > 0.0 ? tG : tA;
    vec3 L = vec3(0.0), F = vec3(0.0), T = vec3(1.0);
    float t = 0.0;
    for (int k = 0; k < 20; k++) {
      float tn = (float(k) + 0.3) / 20.0 * tMax;
      float dt = tn - t;
      t = tn;
      vec3 p = ro + rd * t;
      float rr = length(p);
      vec3 sR, sM, e;
      aMedium(rr - A_RG, sR, sM, e);
      vec3 sT = exp(-dt * e);
      vec3 scat = sR + sM;
      vec3 ee = max(e, vec3(1e-7));
      F += T * (scat - scat * sT) / ee;
      vec3 inS = scat * (1.0 / (4.0 * A_PI)) * aSunTransmittance(rr, dot(p / rr, sunDir));
      L += T * (inS - inS * sT) / ee;
      T *= sT;
    }
    if (tG > 0.0) {
      vec3 hp = ro + rd * tG;
      float muG = dot(normalize(hp), sunDir);
      L += T * aSunTransmittance(A_RG, muG) * max(muG, 0.0) * (0.3 / A_PI);
    }
    lum += L * INV;
    fms += F * INV;
  }
  gl_FragColor = vec4(lum / max(vec3(1e-4), 1.0 - fms), 1.0);
}`,em=`
${Bl}
${Vl}
${Hl}
uniform float aCamR;
uniform vec3 uSunDir;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / vec2(191.0, 107.0);
  float r = aCamR;
  float vHorizon = sqrt(max(0.0, r * r - A_RG * A_RG));
  float beta = acos(clamp(vHorizon / r, -1.0, 1.0));
  float zh = A_PI - beta;
  float vza;
  if (uv.y < 0.5) { float c = 1.0 - 2.0 * uv.y; vza = zh * (1.0 - c * c); }
  else { float c = uv.y * 2.0 - 1.0; vza = zh + beta * c * c; }
  float cosL = -(uv.x * uv.x * 2.0 - 1.0);
  vec3 rd = vec3(sin(vza) * cosL, cos(vza), sin(vza) * sqrt(max(0.0, 1.0 - cosL * cosL)));
  float muS = uSunDir.y;
  vec3 sunDir = vec3(sqrt(max(0.0, 1.0 - muS * muS)), muS, 0.0);
  vec3 ro = vec3(0.0, r, 0.0);
  float tG = aRaySphere(ro, rd, A_RG), tA = aRaySphere(ro, rd, A_RT);
  float tMax = min(tG > 0.0 ? tG : tA, 3000.0);
  float cosT = dot(rd, sunDir);
  float pR = aRayleighPhase(cosT), pM = aMiePhase(cosT, aMieG);
  vec3 L = vec3(0.0), T = vec3(1.0);
  float t = 0.0;
  const int N = 40;
  for (int i = 0; i < N; i++) {
    float s = (float(i) + 0.5) / float(N);
    float tn = s * s * tMax;
    float dt = tn - t;
    t = tn;
    vec3 p = ro + rd * t;
    float rr = length(p);
    vec3 sR, sM, e;
    aMedium(rr - A_RG, sR, sM, e);
    vec3 sT = exp(-dt * e);
    float muSp = dot(p / rr, sunDir);
    vec3 S = (sR * pR + sM * pM) * aSunTransmittance(rr, muSp) + (sR + sM) * aMultiScat(rr, muSp);
    L += T * (S - S * sT) / max(e, vec3(1e-7));
    T *= sT;
  }
  gl_FragColor = vec4(L, 1.0);
}`,tm=`
${Bl}
${Ul}
uniform vec3 uSunIrradiance;
uniform float uOvercast;
uniform vec3 uOvercastSky;
void main() {
  int k = int(gl_FragCoord.x);
  vec3 zen = aSky(vec3(0.0, 1.0, 0.0));
  vec3 hemi = vec3(0.0), hor = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * A_PI / 4.0;
    hor += aSky(normalize(vec3(cos(a), 0.03, sin(a)))) / 8.0;
    hemi += (aSky(normalize(vec3(cos(a), 0.35, sin(a)))) + aSky(normalize(vec3(cos(a), 1.2, sin(a))))) / 16.0;
  }
  hemi = mix(hemi, uOvercastSky, uOvercast);
  hor = mix(hor, uOvercastSky, uOvercast);
  zen = mix(zen, uOvercastSky, uOvercast);
  vec3 ground = vec3(0.13, 0.12, 0.10) * (uSunIrradiance / A_PI + hemi);
  gl_FragColor = vec4(k == 0 ? zen : k == 1 ? hemi : k == 2 ? hor : ground, 1.0);
}`;function nm(e,n){let r=new Yt(e,n,{type:g,depthBuffer:!1});return r.texture.minFilter=r.texture.magFilter=o,r.texture.generateMipmaps=!1,r.texture.wrapS=r.texture.wrapT=t,r}var rm=6360,im=6460,am=class{trans=nm(256,64);ms=nm(32,32);sky=nm(192,108);stats=nm(4,1);transPass=new Zp(Qp,Y);msPass=new Zp($p,Y);skyPass=new Zp(em,Y);statsPass;aerosol=-1;sunIrradiance={value:new G};constructor(){Y.aTransLut.value=this.trans.texture,Y.aMsLut.value=this.ms.texture,Y.aSkyLut.value=this.sky.texture,Y.uSkyStats.value=this.stats.texture,this.stats.texture.minFilter=this.stats.texture.magFilter=r,this.statsPass=new Zp(tm,{...Y,uSunIrradiance:this.sunIrradiance})}setAerosol(e,t){Y.aMieScat.value=.003996*t,Y.aMieExt.value=.0044*t,!(Math.abs(t-this.aerosol)<.01*this.aerosol)&&(this.aerosol=t,this.transPass.render(e,this.trans),this.msPass.render(e,this.ms))}update(e,t){Y.aCamR.value=rm+Math.max(.02,(185+t)/1e3),this.skyPass.render(e,this.sky),this.statsPass.render(e,this.stats)}sunTransmittance(e,t,n){let r=rm+e,i=t.y,a=-Math.sqrt(Math.max(0,1-(rm/r)**2)),o=Ot.smoothstep(i,a-.0047,a+.0047);if(o<=0)return n.setRGB(0,0,0);let s=Math.max(i,a),c=Math.sqrt(Math.max(0,1-s*s)),l=s,u=r*l,d=r*r-im*im,f=-u+Math.sqrt(u*u-d),p=Y.aRayleigh.value,m=Y.aOzone.value,h=Y.aMieExt.value,g=0,_=0,v=0;for(let e=0;e<64;e++){let t=e/64,n=(e+1)/64,i=t*t*f,a=n*n*f,o=.5*(i+a),s=a-i,u=c*o,d=r+l*o,p=Math.hypot(u,d)-rm;g+=Math.exp(-p/8)*s,_+=Math.exp(-p/1.2)*s,v+=Math.max(0,1-Math.abs(p-25)/15)*s}return n.setRGB(Math.exp(-(p.x*g+h*.76*_+m.x*v))*o,Math.exp(-(p.y*g+h*_+m.y*v))*o,Math.exp(-(p.z*g+h*1.34*_+m.z*v))*o)}};function om(e){let t=e>>>0||1;return()=>(t^=t<<13,t>>>=0,t^=t>>>17,t^=t<<5,t>>>=0,t/4294967296)}function sm(e,t){let n=new Float32Array(e*e),r=new Float32Array(e*e);for(let i=0;i<e*e;i++){let e=t()*Math.PI*2;n[i]=Math.cos(e),r[i]=Math.sin(e)}return(t,i)=>{let a=Math.floor(t),o=Math.floor(i),s=t-a,c=i-o,l=(t,i,l,u)=>{let d=((o+i)%e+e)%e*e+((a+t)%e+e)%e;return n[d]*(s-l)+r[d]*(c-u)},u=s*s*s*(s*(s*6-15)+10),d=c*c*c*(c*(c*6-15)+10),f=l(0,0,0,0)+(l(1,0,1,0)-l(0,0,0,0))*u;return f+(l(0,1,0,1)+(l(1,1,1,1)-l(0,1,0,1))*u-f)*d}}function cm(e,t){let n=new Float32Array(e*e),r=new Float32Array(e*e),i=new Float32Array(e*e);for(let a=0;a<e*e;a++)n[a]=t(),r[a]=t(),i[a]=t();let a=(t,o)=>{let s=Math.floor(t),c=Math.floor(o),l=9,u=0;for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){let d=((c+i)%e+e)%e*e+((s+a)%e+e)%e,f=s+a+n[d]-t,p=c+i+r[d]-o,m=f*f+p*p;m<l&&(l=m,u=d)}return a.own=i[u],1-Math.min(1,Math.sqrt(l))};return a.own=0,a}var lm=e=>Math.min(1,Math.max(0,e));function um(e){let t=om(e*7919+17),n=cm(13,t),r=cm(29,t),i=cm(68,t),a=[6,12,24,48,96].map(e=>sm(e,t)),o=sm(4,t),s=sm(9,t),c=sm(5,t),l=sm(8,t),u=sm(6,t),d=new Float32Array(262144),f=new Uint8Array(1048576);for(let e=0;e<512;e++)for(let t=0;t<512;t++){let p=t/512,m=e/512,h=0,g=.5;for(let e=0;e<a.length;e++){let t=[6,12,24,48,96][e];h+=g*a[e](p*t,m*t),g*=.5}let _=.55*(h+.5)-.1,v=n(p*13,m*13),y=r(p*29,m*29),b=r.own,x=i(p*68,m*68),S=i.own,C=(.5*v+.2*y+_)*(.9+.5*u(p*6,m*6)),w=lm(.45+1.6*c(p*5,m*5)),T=lm(.2+1.8*l(p*8,m*8)),E=(.7*y+.08*x+.6*_)*(.8+.2*w)*(.68+.45*b)-.16*(1-w),D=(.74*x+.55*_)*(.8+.2*T)*(.6+.6*S)-.18*(1-T),O=C,k=0;E>O&&(O=E,k=1),D>O&&(O=D,k=2);let A=e*512+t;d[A]=lm(O);let ee=(.5+.9*o(p*4,m*4)+.5*s(p*9,m*9))*[1,.55,.3][k];f[A*4]=Math.round(d[A]*255),f[A*4+1]=Math.round(lm(ee)*255),f[A*4+2]=Math.round([0,.55,1][k]*255),f[A*4+3]=255}return{data:f,sorted:Float32Array.from(f.filter((e,t)=>t%4==0),e=>e/255).sort()}}var dm=`
uniform float uLayer;
uniform float uSize;
uniform float uDetail;
uniform float uSeed;
varying vec2 vUv;
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float grad(vec3 i, vec3 f, vec3 o, float period) {
  return dot(hash33(mod(i + o, period) + uSeed) * 2.0 - 1.0, f - o);
}
float perlin(vec3 x, float period) {
  vec3 i = floor(x), f = fract(x);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(grad(i, f, vec3(0, 0, 0), period), grad(i, f, vec3(1, 0, 0), period), u.x),
        mix(grad(i, f, vec3(0, 1, 0), period), grad(i, f, vec3(1, 1, 0), period), u.x), u.y),
    mix(mix(grad(i, f, vec3(0, 0, 1), period), grad(i, f, vec3(1, 0, 1), period), u.x),
        mix(grad(i, f, vec3(0, 1, 1), period), grad(i, f, vec3(1, 1, 1), period), u.x), u.y), u.z);
}
float worley(vec3 x, float period) {
  vec3 i = floor(x), f = fract(x);
  float d = 1e9;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int k = -1; k <= 1; k++) {
    vec3 o = vec3(float(k), float(y), float(z));
    vec3 r = o + hash33(mod(i + o, period) + uSeed * 1.7) - f;
    d = min(d, dot(r, r));
  }
  return 1.0 - clamp(sqrt(d), 0.0, 1.0);
}
float worleyFbm(vec3 p, float f) {
  return worley(p * f, f) * 0.625 + worley(p * f * 2.0, f * 2.0) * 0.25 + worley(p * f * 4.0, f * 4.0) * 0.125;
}
void main() {
  vec3 p = vec3(vUv, (uLayer + 0.5) / uSize);
  // Top octaves stay at four or more texels per cell: finer noise aliases into stripes.
  if (uDetail > 0.5) {
    gl_FragColor = vec4(worleyFbm(p, 1.0), worleyFbm(p, 2.0), worleyFbm(p, 4.0), 1.0);
    return;
  }
  float n = 0.0, a = 1.0, s = 0.0, f = 4.0;
  for (int k = 0; k < 5; k++) { n += a * perlin(p * f, f); s += a; a *= 0.5; f *= 2.0; }
  float pn = clamp(n / s * 1.4 + 0.5, 0.0, 1.0);
  float w = worleyFbm(p, 4.0);
  float pw = clamp(w + pn * (1.0 - w), 0.0, 1.0);  // Perlin-Worley: remap(perlin, 0, 1, worley, 1)
  gl_FragColor = vec4(pw, worleyFbm(p, 2.0), worleyFbm(p, 4.0), worleyFbm(p, 8.0));
}`,fm=`
${Bl}
${Ul}
uniform sampler2D uSkyStats;
uniform highp sampler3D tShape;
uniform highp sampler3D tDetail;
uniform sampler2D uWeather;
uniform vec4 uCloud;
uniform vec2 uWind;
uniform vec4 uHaze;
uniform vec4 uLayer;       // base, top, extinction per metre at density 1, detail erosion
uniform vec3 uNoiseOffset;
uniform mat4 uInvViewProj;
uniform vec3 uCamPos;
uniform vec3 uSunColour;
uniform float uFrame;
varying vec2 vUv;

float remap(float v, float lo, float hi, float a, float b) { return a + (v - lo) * (b - a) / (hi - lo); }

float density(vec3 p, bool detail, out float hRel) {
  // Explicit level: inside the march, neighbouring pixels sample far-apart points and implicit
  // derivatives would pick a blurred level on alternate rows.
  vec3 w = textureLod(uWeather, (p.xz - uWind) / 24000.0, 0.0).rgb;
  // Local coverage stays below 1 so the noise always carves the cell: cumulus, not cylinders.
  float cov = 0.82 * smoothstep(uCloud.x, uCloud.x + uCloud.w, w.r);
  hRel = 0.0;
  if (cov <= 0.0) return 0.0;
  // The map's blue is how wispy the cloud is (M17): 0 for the large solid ones, 1 for the small
  // fair-weather cloudlets, which are shallow, thin and ragged (8372, 9369).
  float wisp = w.b;
  float top = uLayer.x + (uLayer.y - uLayer.x) * mix(0.35, 1.0, w.g);
  float h = (p.y - uLayer.x) / (top - uLayer.x);
  hRel = h;
  if (h <= 0.0 || h >= 1.0) return 0.0;
  // A flat, sharp base (the condensation level), widest a third of the way up, rounding toward
  // the top; the wisps have no flat base to speak of.
  float grad = smoothstep(0.0, mix(0.05, 0.3, wisp), h) * (1.0 - smoothstep(mix(0.35, 0.2, wisp), 1.0, h));
  vec3 q = p;
  q.xz -= uWind;
  q += uNoiseOffset;
  // Wider than tall: fair-weather cumulus spread more than they tower; the small ones are shaped
  // by a finer noise, drawn out along the wind, so they are ragged wisps, not one lump each.
  vec4 n = texture(tShape, q / mix(vec3(1700.0, 900.0, 1700.0), vec3(950.0, 400.0, 550.0), wisp));
  float fbm = n.g * 0.625 + n.b * 0.25 + n.a * 0.125;
  float base = remap(n.r, fbm - 1.0, 1.0, 0.0, 1.0);
  base = remap(base * grad, 1.0 - cov, 1.0, 0.0, 1.0) * cov;
  if (base <= 0.0) return 0.0;
  if (detail) {
    // Billows of 100 to 200 m: the cauliflower of the photographs' cumulus (8372, 9369).
    vec3 d = texture(tDetail, q / 160.0).rgb;
    // Stretched to the full range: the fbm of cells sits near its middle, and so carved little.
    float dfbm = smoothstep(0.3, 0.8, d.r * 0.625 + d.g * 0.25 + d.b * 0.125);
    float m = mix(dfbm, 1.0 - dfbm, clamp(h * 4.0, 0.0, 1.0));
    base = remap(base, m * uLayer.w * mix(1.0, 1.5, wisp), 1.0, 0.0, 1.0);
  }
  // A soft knee at the low end: thin fringes vanish, so edges read crisp like cauliflower; the
  // wisps keep their fringes and stay thin, so the sky shows through them.
  base *= smoothstep(0.0, mix(0.2, 0.45, wisp), base);
  return clamp(base * mix(1.8, 0.7, wisp), 0.0, 1.0);
}

float lightDepth(vec3 p) {
  float od = 0.0, s = 30.0, h;
  vec3 q = p;
  for (int i = 0; i < 6; i++) {
    q += uSunDir * s;
    od += density(q, false, h) * s;
    s *= 1.8;
  }
  return od * uLayer.z;
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * A_PI * pow(max(1e-4, 1.0 + g2 - 2.0 * g * c), 1.5));
}

void main() {
  vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, 0.5, 1.0);
  vec3 dir = normalize(wp.xyz / wp.w - uCamPos);
  if (dir.y < 0.004) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  float t0 = (uLayer.x - uCamPos.y) / dir.y;
  if (t0 > 32000.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  // Long grazing paths are cut short: sparse steps there turn clouds into noise.
  float t1 = min((uLayer.y - uCamPos.y) / dir.y, t0 + 9000.0);
  float path = t1 - t0;
  float n = clamp(path / 40.0, 32.0, 96.0);
  float dt = path / n;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))) + uFrame * 0.61803399);
  float cosT = dot(dir, uSunDir);
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  vec3 ground = texture2D(uSkyStats, vec2(0.875, 0.5)).rgb;
  vec3 L = vec3(0.0);
  float T = 1.0, dSum = 0.0, wSum = 0.0;
  float t = t0 + dt * jitter;
  for (int i = 0; i < 96; i++) {
    if (float(i) >= n || T < 0.02) break;
    vec3 p = uCamPos + dir * t;
    float h;
    // Far away the erosion detail is below a pixel; leave it out.
    float dens = density(p, t < 12000.0, h);
    if (dens > 0.003) {
      float ext = dens * uLayer.z;
      float od = lightDepth(p);
      // Single scattering with a forward and a back lobe, plus the light that diffuses through
      // the cloud after many bounces: nearly isotropic and slow to fade. Without that second term
      // a cumulus renders grey; with it, sunlit tops are white and bases a soft grey.
      float single = mix(hg(cosT, 0.8), hg(cosT, -0.25), 0.3) * exp(-od);
      float diffuse = 0.24 * exp(-od * 0.2);
      // Powder: the thin outer layer has had little light scattered into it yet, so seen with the
      // sun behind, the folds between the billows are darker than their sunlit fronts.
      float powder = mix(1.0, 1.0 - exp(-dens * 5.0), 0.7 * (0.5 - 0.5 * cosT));
      vec3 sun = uSunColour * (single + diffuse) * powder;
      vec3 amb = mix(ground * 1.1, hemi * 1.25, clamp(h * 1.3, 0.0, 1.0));
      vec3 S = (sun + amb) * ext;
      float sT = exp(-ext * dt);
      L += T * (S - S * sT) / ext;
      float wgt = T * (1.0 - sT);
      dSum += wgt * t;
      wSum += wgt;
      T *= sT;
    }
    t += dt;
  }
  // The air between the camera and the cloud: height haze plus a clear-air term.
  float dm = wSum > 0.0 ? dSum / wSum : t0;
  float H = uHaze.y;
  float kk = dir.y * dm / H;
  float od = uHaze.x * exp(-uCamPos.y / H) * dm * (abs(kk) > 1e-3 ? (1.0 - exp(-kk)) / kk : 1.0) + dm * 1.2e-5;
  float Ta = exp(-od);
  gl_FragColor = vec4(L * Ta + aSky(dir) * (1.0 - T) * (1.0 - Ta), T);
}`;function pm(t){let n=om(t*104729+3),r=[[2,24],[4,48],[8,96]].map(([e,t])=>({a:e,b:t,n:sm(t,n)})),i=sm(3,n),a=[4,8,16,32].map(e=>({n:e,f:sm(e,n)})),s=new Uint8Array(262144);for(let e=0;e<256;e++)for(let t=0;t<256;t++){let n=t/256,o=e/256,c=0,l=.6;for(let{a:e,b:t,n:i}of r)c+=l*Math.abs(i(n*e+o*.3*e,o*t)),l*=.5;let u=Math.max(0,i(n*3,o*3)*1.8+.2),d=Math.max(0,Math.min(1,(.55-c)*1.8))*Math.min(1,u),f=0;l=.5;for(let{n:e,f:t}of a)f+=l*t(n*e,o*e),l*=.5;let p=(e*256+t)*4;s[p]=Math.round(d*255),s[p+1]=Math.round(Math.min(1,Math.max(0,f+.5))*255),s[p+3]=255}let l=new li(s,256,256,w);return l.wrapS=l.wrapT=e,l.magFilter=o,l.minFilter=c,l.generateMipmaps=!0,l.needsUpdate=!0,l}function mm(e=Math.floor(Math.random()*1e9)){let t=om(e);return{seed:e,coverage:.05+t()*.6,base:1200+t()*600,wind:3+t()*5,cirrus:t()<.5?0:.35+t()*.45}}var hm=class{session;coverage=0;target;cirrusOffset=new V;cirrusTexture;shape;detail;weather;sorted;pass;frame=0;worker;time=0;sunColour={value:new G};constructor(t,n){this.session=n;let r=t=>{let n=new Qt(t,t,t,{depthBuffer:!1});return n.texture.wrapS=n.texture.wrapT=n.texture.wrapR=e,n.texture.minFilter=n.texture.magFilter=o,n.texture.generateMipmaps=!1,n};this.shape=r(128),this.detail=r(64);let i=new Zp(dm,{uLayer:{value:0},uSize:{value:0},uDetail:{value:0},uSeed:{value:17.3}});for(let[e,n,r]of[[this.shape,128,0],[this.detail,64,1]]){i.uniforms.uSize.value=n,i.uniforms.uDetail.value=r;for(let r=0;r<n;r++)i.uniforms.uLayer.value=r,i.render(t,e,r)}i.material.dispose(),t.setRenderTarget(null),this.target=new Yt(1,1,{type:g,depthBuffer:!1}),this.target.texture.minFilter=this.target.texture.magFilter=o,this.target.texture.generateMipmaps=!1,this.pass=new Zp(fm,{...Y,tShape:{value:this.shape.texture},tDetail:{value:this.detail.texture},uLayer:{value:new qt},uNoiseOffset:{value:new H},uInvViewProj:{value:new W},uCamPos:{value:new H},uSunColour:this.sunColour,uFrame:{value:0}}),this.cirrusTexture=pm(n.seed),this.apply(n,um(n.seed))}reseed(e){this.worker??=new Worker(new URL(`/prague-drone/assets/weather.worker-DOd8Fiwv.js`,``+import.meta.url),{type:`module`}),this.worker.onmessage=t=>{t.data.seed===e.seed&&this.apply(e,t.data)},this.worker.postMessage(e.seed)}apply(t,n){this.session=t,this.weather?.dispose(),this.weather=new li(n.data,512,512,w),this.weather.wrapS=this.weather.wrapT=e,this.weather.magFilter=o,this.weather.minFilter=c,this.weather.generateMipmaps=!0,this.weather.needsUpdate=!0,this.sorted=n.sorted,Y.uWeather.value=this.weather;let r=om(t.seed+99);this.pass.uniforms.uNoiseOffset.value.set(r()*3e3,r()*3e3,r()*3e3),Y.uWind.value.set(r()*24e3,r()*24e3)}divisor=2;maxCoverage=.65;setSize(e,t){this.target.setSize(Math.max(1,Math.ceil(e/this.divisor)),Math.max(1,Math.ceil(t/this.divisor)))}moveDensestOver(e,t){let n=this.weather.image.data,r=0,i=0;for(let e=0;e<262144;e++)n[e*4]>r&&(r=n[e*4],i=e);let a=(i%512+.5)/512,o=(Math.floor(i/512)+.5)/512;Y.uWind.value.set(e-a*24e3,t-o*24e3)}update(e,t,n){this.time+=e;let r=this.session,i=Ot.degToRad(67.5);Y.uWind.value.x+=Math.sin(i)*r.wind*e,Y.uWind.value.y+=-Math.cos(i)*r.wind*e,this.cirrusOffset.x+=Math.sin(i)*r.wind*2.5*e,this.cirrusOffset.y+=-Math.cos(i)*r.wind*2.5*e;let a=Math.min(.05,r.coverage)*Ot.smoothstep(t,0,.25);this.coverage=Ot.clamp(Math.min(r.coverage,this.maxCoverage)*t,a,.65)*(1-n);let o=this.sorted.length,s=this.coverage>1e-4?this.sorted[Math.floor(Ot.clamp(1-this.coverage,0,.9999)*o)]:2,c=Math.max(.06,(this.sorted[o-1]-s)*.5),l=400+700*Math.min(1,r.coverage/.5);Y.uCloud.value.set(s,.82*(1-n)*Ot.smoothstep(this.coverage,0,.01),r.base+l*.3,c),this.pass.uniforms.uLayer.value.set(r.base,r.base+l,.065,.62),this.pass.uniforms.uNoiseOffset.value.y-=.8*e}render(e,t){let n=this.pass.uniforms;n.uInvViewProj.value.multiplyMatrices(t.matrixWorld,t.projectionMatrixInverse),n.uCamPos.value.setFromMatrixPosition(t.matrixWorld),n.uFrame.value=this.frame++%64,this.pass.render(e,this.target)}},gm=[{t:4.5,aerosol:2.5,haze:.3,hazeHeight:500,skySat:.9,skyFlat:0,sun:1,ambient:1,ev:-.6,wb:[.94,.98,1.08],sat:.95,contrast:1,lift:.01,cumulus:.25,night:.6},{t:5.3,aerosol:3,haze:.34,hazeHeight:500,skySat:.88,skyFlat:.1,sun:1,ambient:1,ev:-.2,wb:[1.03,1,.97],sat:.97,contrast:1,lift:.01,cumulus:.25,night:0},{t:7,aerosol:2.6,haze:.28,hazeHeight:600,skySat:.9,skyFlat:.25,sun:1,ambient:.7,ev:.1,wb:[1.03,1,.97],sat:1,contrast:1.08,lift:.005,cumulus:.3},{t:9.5,aerosol:1.8,haze:.2,hazeHeight:800,skySat:.92,skyFlat:.35,sun:1,ambient:.75,ev:.15,wb:[1,1,1],sat:1,contrast:1.08,lift:0,cumulus:.6},{t:11.5,aerosol:1.2,haze:.1,hazeHeight:1e3,skySat:.94,skyFlat:.5,sun:1,ambient:.72,ev:.2,wb:[1,1,1],sat:1,contrast:1.1,lift:0,cumulus:1},{t:16,aerosol:1.3,haze:.1,hazeHeight:1e3,skySat:.94,skyFlat:.5,sun:1,ambient:.72,ev:.2,wb:[1,1,1],sat:1,contrast:1.1,lift:0,cumulus:1},{t:18.5,aerosol:1.4,haze:.05,hazeHeight:900,skySat:.96,skyFlat:.35,sun:1,ambient:.55,ev:.15,wb:[1,1,1],sat:1,contrast:1.12,lift:0,cumulus:.75},{t:20.2,aerosol:2.8,haze:.08,hazeHeight:800,skySat:.9,skyFlat:.6,sun:.65,ambient:.8,ev:.7,wb:[1,1,1],sat:1,contrast:1.05,lift:0,cumulus:.55},{t:21,aerosol:2,haze:.15,hazeHeight:800,skySat:.75,skyFlat:.2,sun:1,ambient:.8,ev:-.6,wb:[.9,1,1.1],sat:1,contrast:1,lift:0,cumulus:.08},{t:21.4,aerosol:1.6,haze:.14,hazeHeight:800,skySat:.6,skyFlat:.6,sun:1,ambient:.5,ev:-1.1,wb:[.8,1,1.2],sat:1,contrast:1,lift:0,cumulus:0,night:.25},{t:21.75,aerosol:1.4,haze:.14,hazeHeight:800,skySat:.55,skyFlat:.7,sun:1,ambient:.3,ev:-.75,wb:[.78,1,1.22],sat:1,contrast:1,lift:.005,cumulus:0,night:.5},{t:22.5,aerosol:1.4,haze:.14,hazeHeight:800,skySat:.5,skyFlat:.5,sun:1,ambient:.25,ev:-.9,wb:[.8,.99,1.2],sat:.95,contrast:1,lift:.01,cumulus:0,night:1},{t:23,aerosol:1.4,haze:.14,hazeHeight:800,skySat:.5,skyFlat:.2,sun:1,ambient:.25,ev:-1.4,wb:[.86,.98,1.16],sat:.95,contrast:1,lift:.01,cumulus:0,night:1}].map(e=>({night:0,skyHorizon:.8,...e})),_m={aerosol:6,haze:.3,hazeHeight:700,skySat:.5,skyFlat:0,sun:.04,ambient:.6,ev:0,wb:[.92,1,1.12],sat:.88,contrast:1.12,lift:0,cumulus:0},vm=(e,t,n)=>e+(t-e)*n;function ym(e,t,n){let r={...e};for(let i of Object.keys(t)){let a=t[i];r[i]=Array.isArray(a)?e[i].map((e,t)=>vm(e,a[t],n)):vm(e[i],a,n)}return r}function bm(e,t){let n;if(e<=gm[0].t)n=gm[0];else if(e>=gm[gm.length-1].t)n=gm[gm.length-1];else{let t=0;for(;e>gm[t+1].t;)t++;let r=gm[t],i=gm[t+1],a=(e-r.t)/(i.t-r.t);n=ym(r,i,a*a*(3-2*a))}return t>0?ym(n,_m,t):n}var xm=`
varying vec3 vDir;
void main() {
  vDir = (modelMatrix * vec4(position, 0.0)).xyz;
  vec4 p = projectionMatrix * viewMatrix * vec4((modelMatrix * vec4(position, 1.0)).xyz, 1.0);
  gl_Position = vec4(p.xy, 0.0, p.w);
}`,Sm=`
${Bl}
${Ul}
uniform sampler2D uSkyStats;
uniform float uEnv;
uniform sampler2D tClouds;
uniform vec2 uResolution;
uniform float uCloudsOn;
uniform float uCoverage;
uniform sampler2D tCirrus;
uniform float uCirrus;
uniform vec2 uCirrusOffset;
uniform float uOvercast;
uniform vec3 uOvercastSky;
uniform vec3 uSunDisc;
uniform vec3 uCloudSun;
uniform float uNight;
uniform float uCityLights;
varying vec3 vDir;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec3 d = normalize(vDir);
  vec3 sky = aSky(d);
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  float up = max(d.y, 0.0);

  // Night: the city's glow on the horizon and a few stars (design.md §8.7).
  if (uNight > 0.0) {
    // Light pollution: an orange glow low down, a few times brighter than the zenith.
    sky += uNight * aSunE * (vec3(0.5, 0.4, 0.32) * 6e-8 * exp(-up * 9.0) + vec3(0.03, 0.06, 0.12) * 3e-7);
    vec3 cell = floor(d * 260.0);
    float h = hash13(cell);
    if (h > 0.9965 && d.y > 0.05) {
      vec3 f = fract(d * 260.0) - 0.5 - (vec3(hash13(cell + 1.7), hash13(cell + 5.3), hash13(cell + 9.1)) - 0.5) * 0.6;
      sky += uNight * aSunE * 2e-5 * (h - 0.9965) / 0.0035 * smoothstep(0.12, 0.0, length(f)) * smoothstep(0.05, 0.3, d.y);
    }
  }

  // Cirrus far above, lit like thin ice: bright toward the sun.
  if (uCirrus > 0.0 && d.y > 0.01) {
    vec2 c = d.xz / d.y * 8500.0 + uCirrusOffset;
    // Gone with the city's lights coming on: lit by the sky's mean, they stood pale against the
    // zenith of the blue-hour hold, whose sky the photographs show clear (9541, 9547, 9553; M17).
    float a = texture2D(tCirrus, c / 42000.0).r * uCirrus * smoothstep(0.01, 0.2, d.y) * (1.0 - 0.9 * uCityLights);
    float cosS = dot(d, uSunDir);
    vec3 lit = uCloudSun * (0.02 + 0.25 * pow(max(cosS, 0.0), 6.0)) + hemi * 0.9;
    sky = mix(sky, lit, a * (1.0 - uOvercast));
  }

  // The overcast deck: bright grey with soft texture, a little darker toward the horizon.
  if (uOvercast > 0.0) {
    float tex = texture2D(tCirrus, d.xz / max(d.y, 0.04) * 900.0 / 9000.0 + uCirrusOffset / 60000.0).g;
    vec3 deck = uOvercastSky * (0.72 + 0.56 * tex) * (0.82 + 0.3 * smoothstep(0.0, 0.8, up));
    sky = mix(sky, deck, uOvercast * smoothstep(-0.03, 0.02, d.y));
  }

  if (uEnv < 0.5) {
    float cosS = dot(d, uSunDir);
    // The disc, limb darkened, and a soft glare; gone under the overcast.
    float disc = smoothstep(0.99998691, 0.99999124, cosS);
    sky += uSunDisc * disc * (1.0 - uOvercast);
    sky += uSunDisc * 2e-6 * exp(-acos(clamp(cosS, -1.0, 1.0)) * 90.0) * (1.0 - uOvercast);
    if (uCloudsOn > 0.5 && d.y > 0.0) {
      vec4 cl = texture2D(tClouds, gl_FragCoord.xy / uResolution);
      sky = sky * cl.a + cl.rgb;
    }
  } else {
    // For the environment light: the cumulus as a grey veil on the upper sky, the ground below.
    vec3 cloud = hemi * 1.2 + uCloudSun * max(uSunDir.y, 0.0) * 0.1;
    sky = mix(sky, cloud, uCoverage * 0.75 * smoothstep(0.0, 0.25, d.y));
    vec3 ground = texture2D(uSkyStats, vec2(0.875, 0.5)).rgb;
    sky = mix(sky, ground, smoothstep(0.0, -0.06, d.y));
  }
  gl_FragColor = vec4(sky, 1.0);
}`,Cm=(e,t,n)=>Ot.smoothstep(n,e,t),wm=class{sun=new Bp(`#ffffff`,1);dome;scattering=new am;clouds;light=bm(12,0);lightOverride={};elevation=0;azimuth=0;overcast=0;overcastTarget=0;domeUniforms;envUniforms;envScene=new Fn;pmrem;env;envKey=[-999,-1,-1,-1];scene;renderer;sunAtCamera=new G;sunAtClouds=new G;shadowsMade=!1;constructor(e,t,n=mm(),r=Math.random()<.2){this.renderer=e,this.scene=t,this.clouds=new hm(e,n),this.overcast=this.overcastTarget=+!!r;let i={tClouds:{value:this.clouds.target.texture},uResolution:{value:new V(1,1)},uCloudsOn:{value:1},uCoverage:{value:0},tCirrus:{value:this.clouds.cirrusTexture},uCirrus:{value:n.cirrus},uCirrusOffset:{value:this.clouds.cirrusOffset},uSunDisc:{value:new G},uCloudSun:this.clouds.sunColour};this.domeUniforms={...Y,...i,uEnv:{value:0}},this.envUniforms={...Y,...i,uEnv:{value:1}};let a=e=>new la({uniforms:e,vertexShader:xm,fragmentShader:Sm,side:1,depthWrite:!1,fog:!1});this.dome=new oi(new ea(1,64,32),a(this.domeUniforms)),this.dome.scale.setScalar(4e4),this.dome.renderOrder=1e6,this.dome.frustumCulled=!1,t.add(this.dome),this.envScene.add(new oi(new ea(100,64,32),a(this.envUniforms))),this.pmrem=new zo(e);let o=this.sun.shadow;o.mapSize.set(2048,2048),o.camera.near=1,o.camera.far=2800,o.bias=-15e-5,o.normalBias=.7,o.radius=1.5,this.sun.castShadow=!0,t.add(this.sun)}get sunDir(){return Y.uSunDir.value}reseed(e){this.clouds.reseed(e),this.domeUniforms.uCirrus.value=e.cirrus}setSize(e,t){this.clouds.setSize(e,t),this.domeUniforms.uResolution.value.set(e,t)}update(e,t,n){let{elevation:r,azimuth:i}=Gp(e);this.elevation=r,this.azimuth=i;let a=Ot.degToRad(r),o=Ot.degToRad(i),s=Y.uSunDir.value.set(Math.cos(a)*Math.sin(o),Math.sin(a),-Math.cos(a)*Math.cos(o));this.overcast+=(this.overcastTarget-this.overcast)*(1-Math.exp(-n/1.2)),Math.abs(this.overcast-this.overcastTarget)<.001&&(this.overcast=this.overcastTarget);let c=this.light={...bm(e,this.overcast),...this.lightOverride};this.scattering.setAerosol(this.renderer,c.aerosol),Y.aSkySat.value=c.skySat,Y.aSkyFlat.value=c.skyFlat,Y.aSkyHorizon.value=c.skyHorizon,Y.uHaze.value.set(c.haze/1e3,c.hazeHeight,17e3,Cm(-4,5,r)),Y.uNight.value=c.night,Y.uCityLights.value=1-Ot.smoothstep(r,-6,-2),Y.uOvercast.value=this.overcast;let l=t.position.y,u=this.scattering.sunTransmittance((185+l)/1e3,s,this.sunAtCamera);this.sun.color.copy(u),this.sun.intensity=100*c.sun,this.sun.position.copy(s),this.sun.updateMatrixWorld(),this.renderer.shadowMap.autoUpdate=r>-1.5,this.shadowsMade||(this.renderer.shadowMap.needsUpdate=!0),this.shadowsMade=!0,this.scattering.sunIrradiance.value.copy(u).multiplyScalar(100*c.sun*Math.max(0,s.y));let d=this.scattering.sunTransmittance(2185/1e3,s,this.sunAtClouds);this.clouds.sunColour.value.copy(d).multiplyScalar(100*c.sun),this.domeUniforms.uSunDisc.value.copy(u).multiplyScalar(3e4);let f=100*(.06*Math.max(0,Math.sin(a))+.004*Cm(-8,2,r))*(.2+.8*Cm(-4,8,r));Y.uOvercastSky.value.setRGB(f*.95,f*.97,f*1.02),this.clouds.update(n,c.cumulus,this.overcast),this.domeUniforms.uCoverage.value=this.clouds.coverage,this.domeUniforms.uCloudsOn.value=+(this.overcast<.999&&this.clouds.coverage>0),this.scattering.update(this.renderer,l),this.scene.environmentIntensity=c.ambient,this.dome.position.copy(t.position)}updateEnvironment(){let e=[this.elevation,this.clouds.coverage,this.overcast,this.light.aerosol];if(!(Math.abs(e[0]-this.envKey[0])>.4||Math.abs(e[1]-this.envKey[1])>.03||Math.abs(e[2]-this.envKey[2])>.05||Math.abs(e[3]-this.envKey[3])>.1)&&this.env)return;this.envKey=e;let t=this.pmrem.fromScene(this.envScene,0,1,1e3);this.env?.dispose(),this.env=t,this.scene.environment=t.texture}renderClouds(e){this.domeUniforms.uCloudsOn.value&&this.clouds.render(this.renderer,e)}},Tm=`
uniform sampler2D tHeight;
uniform vec4 uRect;
uniform vec3 uSunDir;
varying vec2 vUv;
float height(vec2 p) {
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return -1e4;
  return texture2D(tHeight, uv).r;
}
void main() {
  vec2 p = uRect.xy + vUv * uRect.zw;
  vec2 dir = normalize(uSunDir.xz + vec2(1e-6, 0.0));
  float tanE = uSunDir.y / max(length(uSunDir.xz), 1e-4);
  float best = -1e4, bestD = 0.0, s = 12.0;
  for (int i = 0; i < 72; i++) {
    float h = height(p + dir * s) - s * tanE;
    if (h > best) { best = h; bestD = s; }
    s = s * 1.065 + 6.0;
  }
  gl_FragColor = vec4(best, bestD, 0.0, 1.0);
}`,Em=class{target;pass;last=new H;constructor(e){let t=Math.floor((e.nx-1)/2)+1,n=Math.floor((e.nz-1)/2)+1,r=new Uint16Array(t*n);for(let i=0;i<n;i++)for(let n=0;n<t;n++)r[i*t+n]=hr.toHalfFloat(e.at(n*2,i*2));let i=new li(r,t,n,D,g);i.minFilter=i.magFilter=o,i.needsUpdate=!0;let a=(t-1)*e.cell*2,s=(n-1)*e.cell*2;this.target=new Yt(t,n,{type:g,depthBuffer:!1}),this.target.texture.minFilter=this.target.texture.magFilter=o,this.target.texture.generateMipmaps=!1,this.pass=new Zp(Tm,{tHeight:{value:i},uRect:{value:new qt(e.x0,e.z0,a,s)},uSunDir:Y.uSunDir}),Y.uTerrainShadow.value=this.target.texture,Y.uTerrainShadowRect.value.set(e.x0,e.z0,1/a,1/s)}update(e,t){t.dot(this.last)>Math.cos(Ot.degToRad(.05))||(this.last.copy(t),this.pass.render(e,this.target))}},Dm=`vec3(0.2126, 0.7152, 0.0722)`,Om=`
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tHistory;
uniform sampler2D tExposure;
uniform mat4 uInvViewProj;
uniform mat4 uPrevViewProj;
uniform vec2 uTexel;
uniform float uReset;
varying vec2 vUv;
float E;
vec3 comp(vec3 c) { c *= E; return c / (1.0 + max(c.r, max(c.g, c.b))); }
vec3 decomp(vec3 c) { return c / max(1e-6, 1.0 - max(c.r, max(c.g, c.b))) / E; }
vec3 ycocg(vec3 c) { return vec3(0.25 * c.r + 0.5 * c.g + 0.25 * c.b, 0.5 * c.r - 0.5 * c.b, -0.25 * c.r + 0.5 * c.g - 0.25 * c.b); }
vec3 rgb(vec3 c) { return vec3(c.x + c.y - c.z, c.x + c.z, c.x - c.y - c.z); }
vec3 fetch(vec2 uv) { return ycocg(comp(texture2D(tColor, uv).rgb)); }
// Catmull-Rom history sample in nine bilinear taps, for a sharper resolve.
vec3 history(vec2 uv) {
  vec2 size = 1.0 / uTexel;
  vec2 pos = uv * size, c = floor(pos - 0.5) + 0.5, f = pos - c;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2, o12 = w2 / w12;
  vec2 t0 = (c - 1.0) * uTexel, t3 = (c + 2.0) * uTexel, t12 = (c + o12) * uTexel;
  vec3 r = vec3(0.0);
  r += texture2D(tHistory, vec2(t12.x, t0.y)).rgb * w12.x * w0.y;
  r += texture2D(tHistory, vec2(t0.x, t12.y)).rgb * w0.x * w12.y;
  r += texture2D(tHistory, vec2(t12.x, t12.y)).rgb * w12.x * w12.y;
  r += texture2D(tHistory, vec2(t3.x, t12.y)).rgb * w3.x * w12.y;
  r += texture2D(tHistory, vec2(t12.x, t3.y)).rgb * w12.x * w3.y;
  float w = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
  return max(r / w, 0.0);
}
void main() {
  E = exp2(texture2D(tExposure, vec2(0.5)).r);
  float d = texture2D(tDepth, vUv).r;
  vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, d, 1.0);
  wp /= wp.w;
  vec4 pc = uPrevViewProj * wp;
  vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
  vec3 m1 = vec3(0.0), m2 = vec3(0.0), cur = vec3(0.0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 s = fetch(vUv + vec2(float(x), float(y)) * uTexel);
    if (x == 0 && y == 0) cur = s;
    m1 += s; m2 += s * s;
  }
  vec3 mu = m1 / 9.0, sigma = sqrt(abs(m2 / 9.0 - mu * mu));
  vec3 lo = mu - 1.25 * sigma, hi = mu + 1.25 * sigma;
  vec3 h = ycocg(comp(history(puv)));
  // Clip the history toward the neighbourhood mean.
  vec3 centre = 0.5 * (hi + lo), ext = 0.5 * (hi - lo) + 1e-5;
  vec3 v = h - centre, a = abs(v / ext);
  float m = max(a.x, max(a.y, a.z));
  if (m > 1.0) h = centre + v / m;
  float motion = length((puv - vUv) / uTexel);
  // The sky reprojects exactly under rotation and its clouds are noisy: keep a longer history there.
  float alpha = mix(d <= 0.0 ? 0.04 : 0.08, 0.25, clamp(motion / 24.0, 0.0, 1.0));
  if (uReset > 0.5 || puv.x < 0.0 || puv.y < 0.0 || puv.x > 1.0 || puv.y > 1.0) alpha = 1.0;
  gl_FragColor = vec4(decomp(rgb(mix(h, cur, alpha))), 1.0);
}`,km=`
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
uniform float uProjScale;
uniform float uRadius;
uniform float uStrength;
uniform float uFrame;
varying vec2 vUv;
vec3 viewPos(vec2 uv) {
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, texture2D(tDepth, uv).r, 1.0);
  return p.xyz / p.w;
}
void main() {
  if (texture2D(tDepth, vUv).r <= 0.0) { gl_FragColor = vec4(1.0); return; }
  vec3 P = viewPos(vUv);
  vec3 x1 = viewPos(vUv + vec2(uTexel.x, 0.0)), x0 = viewPos(vUv - vec2(uTexel.x, 0.0));
  vec3 y1 = viewPos(vUv + vec2(0.0, uTexel.y)), y0 = viewPos(vUv - vec2(0.0, uTexel.y));
  vec3 dx = abs(x1.z - P.z) < abs(P.z - x0.z) ? x1 - P : P - x0;
  vec3 dy = abs(y1.z - P.z) < abs(P.z - y0.z) ? y1 - P : P - y0;
  vec3 n = normalize(cross(dx, dy));
  if (dot(n, P) > 0.0) n = -n;
  float rpx = min(uRadius * uProjScale / -P.z, 120.0);
  if (rpx < 1.5) { gl_FragColor = vec4(1.0); return; }
  float noise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float rot = (noise + uFrame * 0.618034) * 6.2831853;
  float R2 = uRadius * uRadius, sum = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = (float(i) + 0.5) / 8.0;
    float ang = a * 6.2831853 * 2.0 + rot;
    vec2 uv = vUv + vec2(cos(ang), sin(ang)) * (a * rpx) * uTexel;
    vec3 v = viewPos(uv) - P;
    float vv = dot(v, v);
    float cosA = dot(v, n) * inversesqrt(vv + 1e-6);
    sum += max(0.0, cosA - 0.12) * max(0.0, 1.0 - vv / R2);
  }
  gl_FragColor = vec4(max(0.0, 1.0 - uStrength * sum / 8.0), 0.0, 0.0, 1.0);
}`,Am=`
uniform sampler2D tAO;
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
varying vec2 vUv;
float viewZ(vec2 uv) {
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, texture2D(tDepth, uv).r, 1.0);
  return p.z / p.w;
}
void main() {
  float z0 = viewZ(vUv);
  float s = 0.0, w = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2 o = i == 0 ? vec2(0.0) : vec2(i == 1 || i == 2 ? -1.0 : 1.0, i == 1 || i == 3 ? -1.0 : 1.0);
    vec2 uv = vUv + o * uTexel;
    float k = exp(-abs(viewZ(uv) - z0) / (0.02 * abs(z0) + 0.05));
    s += texture2D(tAO, uv).r * k;
    w += k;
  }
  gl_FragColor = vec4(s / max(w, 1e-4), 0.0, 0.0, 1.0);
}`,jm=5,Mm=`
uniform sampler2D tColor;
uniform sampler2D tExposure;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  float E = exp2(texture2D(tExposure, vec2(0.5)).r);
  float s = 0.0, w = 0.0;
  for (int y = 0; y < 3; y++) for (int x = 0; x < 3; x++) {
    vec3 c = texture2D(tColor, vUv + (vec2(float(x), float(y)) - 1.0) * uTexel * 0.33).rgb;
    float L = max(dot(c, ${Dm}), 1e-7);
    // Highlight priority: bright pixels weigh more.
    float k = pow(clamp(L * E, 0.02, 16.0), 0.7);
    s += k * log2(L);
    w += k;
  }
  gl_FragColor = vec4(s / 9.0, w / 9.0, 0.0, 1.0);
}`,Nm=`
uniform sampler2D tLum;
uniform float uLod;
uniform sampler2D tPrev;
uniform sampler2D uSkyStats;
uniform vec3 uOvercastSky;
uniform float uOvercast;
uniform float uCityLights;
uniform float uDt;
uniform float uBias;
uniform float uReset;
void main() {
  vec2 s = textureLod(tLum, vec2(0.5), uLod).rg;
  float meterLog = s.x / max(s.y, 1e-6);
  // The sky near the horizon sets the base, as a camera exposed for the highlights would: there
  // it lands near a third of full scale. The meter, weighted toward the highlights, may move a
  // stop darker or 0.8 of one brighter from there: views away from a low sun, where the
  // photographs let the pale sky go near white (8683, 9486), needed more than the 0.6 of M1.
  // Under overcast the deck is the sky, and the photographs let it go nearly white (8942, 8158).
  // After dark the photographs are exposed for the city's lights: the sky goes deep (9542, 9547).
  float target = mix(mix(0.24, 0.5, uOvercast), 0.085, uCityLights);
  float evFrame = log2(target) - meterLog;
  vec3 hor = texture2D(uSkyStats, vec2(0.625, 0.5)).rgb;
  hor = mix(hor, uOvercastSky * 0.85, uOvercast);
  // A camera stops brightening somewhere: 11.5 stops below the midday sky (9547 is 10 below).
  float evSky = log2(target / max(dot(hor, ${Dm}), 0.003));
  float ev = evSky + clamp(evFrame - evSky, -1.0, 0.8) + uBias;
  float prev = texture2D(tPrev, vec2(0.5)).r;
  float next = uReset > 0.5 ? ev : prev + (ev - prev) * (1.0 - exp(-uDt / 0.7));
  gl_FragColor = vec4(next, ev, evFrame, evSky);
}`,Pm=`
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
uniform float uK;
uniform float uFocus;
uniform float uMaxR;
uniform float uStep;
varying vec2 vUv;
float dist(vec2 uv) {
  float d = texture2D(tDepth, uv).r;
  if (d <= 0.0) return 1e6;
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, d, 1.0);
  return -p.z / p.w;
}
float coc(float s) { return min(uK * abs(1.0 - uFocus / s), uMaxR); }
void main() {
  vec3 acc = texture2D(tColor, vUv).rgb;
  float d0 = dist(vUv), r0 = coc(d0), tot = 1.0;
  float radius = uStep, ang = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) * 6.2831853;
  for (int i = 0; i < 4096; i++) {
    if (radius >= uMaxR) break;
    vec2 uv = vUv + vec2(cos(ang), sin(ang)) * uTexel * radius;
    vec3 c = texture2D(tColor, uv).rgb;
    float d = dist(uv), r = coc(d);
    if (d > d0) r = min(r, r0 * 2.0);
    float m = smoothstep(radius - 0.5, radius + 0.5, r);
    acc += mix(acc / tot, c, m);
    tot += 1.0;
    radius += uStep / radius;
    ang += 2.39996323;
  }
  gl_FragColor = vec4(acc / tot, 1.0);
}`,Fm=`
uniform sampler2D tColor;
uniform sampler2D tExposure;
uniform highp sampler3D tLut;
uniform float uLutSize;
uniform float uGrade;
uniform vec3 uWB;
uniform float uSat;
uniform float uContrast;
uniform float uLift;
uniform float uVignette;
uniform float uGrain;
uniform float uCA;
uniform float uTime;
uniform vec2 uResolution;
uniform float uFit;
uniform sampler2D tDepth;
varying vec2 vUv;

// Uchimura's filmic curve (Gran Turismo): toe, linear middle, shoulder, each its own knob.
const float P = 1.0, A = 1.2, M = 0.2, LL = 0.34, C = 1.55, B = 0.0;
float curve(float x) {
  float l0 = ((P - M) * LL) / A;
  float S0 = M + l0, S1 = M + A * l0;
  float C2 = (A * P) / (P - S1), CP = -C2 / P;
  float w0 = 1.0 - smoothstep(0.0, M, x);
  float w2 = step(M + l0, x);
  float w1 = 1.0 - w0 - w2;
  float T = M * pow(max(x, 0.0) / M, C) + B;
  float S = P - (P - S1) * exp(CP * (x - S0));
  float Lin = M + A * (x - M);
  return T * w0 + Lin * w1 + S * w2;
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }

void main() {
  vec2 cc = vUv - 0.5;
  vec3 c;
  if (uCA > 0.0 && uGrade > 0.5) {
    vec2 o = cc * uCA;
    c = vec3(texture2D(tColor, vUv - o).r, texture2D(tColor, vUv).g, texture2D(tColor, vUv + o).b);
  } else c = texture2D(tColor, vUv).rgb;
  c *= exp2(texture2D(tExposure, vec2(0.5)).r);
  if (uGrade > 0.5) {
    c *= uWB;
    float l = dot(c, ${Dm});
    c = max(mix(vec3(l), c, uSat), 0.0);
  }
  c = vec3(curve(c.r), curve(c.g), curve(c.b));
  vec3 s = srgb(clamp(c, 0.0, 1.0));
  // Development only, for tools/lut-fit.ts: the image as it enters the LUT, or the sky's mask.
  if (uFit > 0.5) { gl_FragColor = uFit > 1.5 ? vec4(vec3(step(texture2D(tDepth, vUv).r, 0.0)), 1.0) : vec4(s, 1.0); return; }
  float n = hash(gl_FragCoord.xy + fract(uTime * 7.31) * 517.0) + hash(gl_FragCoord.yx * 1.37 + fract(uTime * 3.17) * 911.0) - 1.0;
  if (uGrade > 0.5) {
    s = texture(tLut, s * ((uLutSize - 1.0) / uLutSize) + 0.5 / uLutSize).rgb;
    // The family's contrast as an S about the middle that keeps black and white where they are: a
    // straight stretch clipped the darkest few percent to black, and shadows never go to pure
    // black in daylight (design.md §5.1).
    s = clamp(s + 4.0 * (uContrast - 1.0) * (s - 0.5) * s * (1.0 - s), 0.0, 1.0);
    s = uLift + s * (1.0 - uLift);
    float aspect = uResolution.x / uResolution.y;
    float r = length(cc * vec2(aspect, 1.0)) / length(vec2(aspect, 1.0) * 0.5);
    s *= 1.0 - uVignette * pow(r, 2.4);
    float lum = dot(s, vec3(0.299, 0.587, 0.114));
    s += n * uGrain * (0.5 + 0.5 * (1.0 - abs(lum * 2.0 - 1.0)));
  } else {
    s += n / 255.0;
  }
  gl_FragColor = vec4(s, 1.0);
}`;function Im(e,t,n={}){let r=new Yt(e,t,{type:g,depthBuffer:!1,...n});return r.texture.minFilter=r.texture.magFilter=o,r.texture.generateMipmaps=!1,r}var Lm=Array.from({length:16},(e,t)=>{let n=(e,t)=>{let n=1,r=0;for(;t>0;)n/=e,r+=t%e*n,t=Math.floor(t/e);return r};return[n(2,t+1)-.5,n(3,t+1)-.5]}),Rm=class{grade=!0;dof=null;fit=0;renderer;hdr;hist;lum;expo;aoRaw;aoOut;aoPass;aoBlur;ao=!0;taa;lumPass;adapt;final;dofPass;dofOut;frame=0;time=0;reset=!0;prevViewProj=new W;prevPos=new H;width=1;height=1;constructor(e,t){this.renderer=e,this.hdr=Im(1,1,{depthBuffer:!0,depthTexture:new Wi(1,1,h)}),this.hdr.texture.minFilter=this.hdr.texture.magFilter=r,this.hist=[Im(1,1),Im(1,1)],this.lum=Im(128,64),this.lum.texture.generateMipmaps=!0,this.lum.texture.minFilter=c,this.expo=[0,1].map(()=>{let e=new Yt(1,1,{type:h,depthBuffer:!1});return e.texture.minFilter=e.texture.magFilter=r,e}),this.aoRaw=Im(1,1),this.aoOut=Im(1,1),this.aoPass=new Zp(km,{tDepth:{value:this.hdr.depthTexture},uProjInv:{value:new W},uTexel:{value:new V},uProjScale:{value:1},uRadius:{value:jm},uStrength:{value:1.6},uFrame:{value:0}}),this.aoBlur=new Zp(Am,{tAO:{value:this.aoRaw.texture},tDepth:{value:this.hdr.depthTexture},uProjInv:this.aoPass.uniforms.uProjInv,uTexel:{value:new V}}),this.taa=new Zp(Om,{tColor:{value:this.hdr.texture},tDepth:{value:this.hdr.depthTexture},tHistory:{value:null},tExposure:{value:null},uInvViewProj:{value:new W},uPrevViewProj:{value:new W},uTexel:{value:new V},uReset:{value:1}}),this.dofOut=Im(1,1),this.dofPass=new Zp(Pm,{tColor:{value:null},tDepth:{value:this.hdr.depthTexture},uProjInv:{value:new W},uTexel:{value:new V},uK:{value:0},uFocus:{value:1},uMaxR:{value:0},uStep:{value:1}}),this.lumPass=new Zp(Mm,{tColor:{value:null},tExposure:{value:null},uTexel:{value:new V(1/128,1/64)}}),this.adapt=new Zp(Nm,{tLum:{value:this.lum.texture},uLod:{value:7},tPrev:{value:null},uSkyStats:Y.uSkyStats,uOvercastSky:Y.uOvercastSky,uOvercast:Y.uOvercast,uCityLights:Y.uCityLights,uDt:{value:0},uBias:{value:0},uReset:{value:1}}),this.final=new Zp(Fm,{tColor:{value:null},tExposure:{value:null},tLut:{value:t},uLutSize:{value:t.image.width},uGrade:{value:1},uWB:{value:new H(1,1,1)},uSat:{value:1},uContrast:{value:1},uLift:{value:0},uVignette:{value:.2},uGrain:{value:.012},uCA:{value:0},uTime:{value:0},uResolution:{value:new V},uFit:{value:0},tDepth:{value:this.hdr.depthTexture}})}setSize(e,t){this.width=e,this.height=t,this.hdr.setSize(e,t);for(let n of this.hist)n.setSize(e,t);this.dofOut.setSize(e,t),this.dofPass.uniforms.uTexel.value.set(1/e,1/t);let n=Math.max(1,Math.round(e/2)),r=Math.max(1,Math.round(t/2));this.aoRaw.setSize(n,r),this.aoOut.setSize(n,r),this.aoPass.uniforms.uTexel.value.set(1/e,1/t),this.aoBlur.uniforms.uTexel.value.set(1/n,1/r),this.taa.uniforms.uTexel.value.set(1/e,1/t),this.final.uniforms.uResolution.value.set(e,t),this.reset=!0}invalidate(){this.reset=!0}warm(e,t,n=!1){let r=this.renderer,i=r.getRenderTarget(),a=[];n&&e.traverse(e=>{e.frustumCulled&&(e.frustumCulled=!1,a.push(e))}),r.setRenderTarget(this.hdr),r.render(e,t),r.setRenderTarget(i);for(let e of a)e.frustumCulled=!0}async compile(e,t,n){let r=this.renderer,i=r.getRenderTarget(),a=r.clippingPlanes,o=[];e.traverse(e=>{e.visible||(e.visible=!0,o.push(e))}),r.setRenderTarget(this.hdr);let s=r.compileAsync(e,t,n);r.clippingPlanes=[new Br(new H(0,1,0),0)];let c=r.compileAsync(e,t,n);r.clippingPlanes=a,r.setRenderTarget(i);for(let e of o)e.visible=!1;await Promise.all([s,c])}render(e,t,n){let r=this.renderer;this.time+=n.dt,t.position.distanceTo(this.prevPos)>150&&(this.reset=!0),this.prevPos.copy(t.position);let[i,a]=Lm[this.frame%Lm.length],o=t.projectionMatrix.clone();if(t.projectionMatrix.elements[8]+=2*i/this.width,t.projectionMatrix.elements[9]+=2*a/this.height,t.projectionMatrixInverse.copy(t.projectionMatrix).invert(),n.beforeScene?.(t),(this.reset||!this.ao)&&(Y.uAOOn.value=0),r.setRenderTarget(this.hdr),r.render(e,t),this.ao){let e=this.aoPass.uniforms;e.uProjInv.value.copy(t.projectionMatrixInverse),e.uProjScale.value=t.projectionMatrix.elements[5]*this.height/4,e.uFrame.value=this.frame%64,e.uTexel.value.set(2/this.width,2/this.height),this.aoPass.render(r,this.aoRaw),this.aoBlur.render(r,this.aoOut),Y.tAO.value=this.aoOut.texture,Y.uAOViewProj.value.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Y.uAOOn.value=1}let[s,c]=this.frame%2?[this.hist[1],this.hist[0]]:[this.hist[0],this.hist[1]],[l,u]=this.frame%2?[this.expo[1],this.expo[0]]:[this.expo[0],this.expo[1]],d=this.taa.uniforms;d.tHistory.value=s.texture,d.tExposure.value=l.texture,d.uInvViewProj.value.multiplyMatrices(t.matrixWorld,t.projectionMatrixInverse),d.uPrevViewProj.value.copy(this.prevViewProj),d.uReset.value=+!!this.reset,this.taa.render(r,c);let f=c;if(this.dof){let e=this.dofPass.uniforms,n=this.dof.focal35,i=this.dof.fstop,a=this.width/(this.width<this.height?24:36),o=n*n/(i*Math.max(1,this.dof.focus*1e3-n))/2*a;e.tColor.value=c.texture,e.uProjInv.value.copy(t.projectionMatrixInverse),e.uK.value=o,e.uFocus.value=this.dof.focus,e.uMaxR.value=Math.min(o,48),e.uStep.value=Math.max(.5,e.uMaxR.value*e.uMaxR.value/1600),this.dofPass.render(r,this.dofOut),f=this.dofOut}this.lumPass.uniforms.tColor.value=c.texture,this.lumPass.uniforms.tExposure.value=l.texture,this.lumPass.render(r,this.lum);let p=this.adapt.uniforms;p.tPrev.value=l.texture,p.uDt.value=n.dt,p.uBias.value=n.light.ev,p.uReset.value=+!!this.reset,this.adapt.render(r,u);let m=this.final.uniforms;m.tColor.value=f.texture,m.tExposure.value=u.texture,m.uGrade.value=+!!this.grade,m.uFit.value=this.fit,m.uWB.value.set(...n.light.wb),m.uSat.value=n.light.sat,m.uContrast.value=n.light.contrast,m.uLift.value=n.light.lift,m.uVignette.value=Ot.lerp(.26,.12,n.lens),m.uCA.value=Ot.lerp(.0016,0,Math.min(1,n.lens*3)),m.uTime.value=this.time,this.final.render(r,null),t.projectionMatrix.copy(o),t.projectionMatrixInverse.copy(o).invert(),this.prevViewProj.multiplyMatrices(o,t.matrixWorldInverse),this.reset=!1,this.frame++}};async function zm(e){let n=await(await fetch(e)).text(),r=0,i=[];for(let e of n.split(`
`)){let t=e.trim();if(!t||t.startsWith(`#`)||t.startsWith(`TITLE`)||t.startsWith(`DOMAIN`))continue;if(t.startsWith(`LUT_3D_SIZE`)){r=Number(t.split(/\s+/)[1]);continue}let[n,a,o]=t.split(/\s+/).map(Number);i.push(n,a,o)}if(!r||i.length!==r**3*3)throw Error(`bad LUT ${e}`);let a=new Uint8Array(r**3*4);for(let e=0;e<r**3;e++)a[e*4]=Math.round(i[e*3]*255),a[e*4+1]=Math.round(i[e*3+1]*255),a[e*4+2]=Math.round(i[e*3+2]*255),a[e*4+3]=255;let s=new Zt(a,r,r,r);return s.format=w,s.minFilter=s.magFilter=o,s.wrapS=s.wrapT=s.wrapR=t,s.unpackAlignment=1,s.needsUpdate=!0,s}var Bm=2.5;function Vm(e){return 2*Math.atan(18/e)}var Hm=class{t;p;m;constructor(e,t){this.t=e,this.p=t;let n=t.length;this.m=t.map(()=>new H);for(let r=1;r<n-1;r++){let n=e[r]-e[r-1],i=e[r+1]-e[r],a=t[r].clone().sub(t[r-1]).divideScalar(n),o=t[r+1].clone().sub(t[r]).divideScalar(i);if(this.m[r].copy(a).multiplyScalar(i).addScaledVector(o,n).divideScalar(n+i),a.y*o.y<=0)this.m[r].y=0;else{let e=3*Math.min(Math.abs(a.y),Math.abs(o.y));this.m[r].y=Math.sign(this.m[r].y)*Math.min(Math.abs(this.m[r].y),e)}}}at(e,t){let n=this.t,r=n.length;if(e<=n[0])return t.copy(this.p[0]);if(e>=n[r-1])return t.copy(this.p[r-1]);let i=0;for(;i<r-2&&e>n[i+1];)i++;let a=n[i+1]-n[i],o=(e-n[i])/a,s=o*o,c=s*o,l=2*c-3*s+1,u=c-2*s+o,d=-2*c+3*s,f=c-s;return t.copy(this.p[i]).multiplyScalar(l).addScaledVector(this.m[i],u*a).addScaledVector(this.p[i+1],d).addScaledVector(this.m[i+1],f*a)}},Um=([e,t,n])=>new H(e,n,-t),Wm=e=>e<=0?0:e>=1?1:e*e*(3-2*e),Gm=class{data;duration;end;stops;pos;gaze;knots;lensIn;lensOut;transitions=[];holdClockEnd;constructor(e){this.data=e,this.duration=e.duration;let t=e.stops.map(e=>({n:e.n,name:e.name,t:e.t,clock:e.via?NaN:qp(e.clock),pos:Um(e.pos),gaze:Um(e.gaze)}));this.stops=t.filter((t,n)=>!e.stops[n].via),this.end=t[t.length-1].t,this.knots=t.map((t,n)=>n===0?e.hold:t.t),this.pos=new Hm(this.knots,t.map(e=>e.pos)),this.gaze=new Hm(this.knots,t.map(e=>e.gaze)),this.lensIn=e.stops.map(e=>e.lens===`wide`?24:55),this.lensOut=e.stops.map(e=>e.lens===`long`?55:24),this.holdClockEnd=qp(e.holdClockEnd);let n=this.knots;for(let e=0;e<n.length;e++)if(this.lensIn[e]!==this.lensOut[e]&&this.transitions.push({start:n[e]+1,from:this.lensIn[e],to:this.lensOut[e]}),e+1<n.length&&this.lensOut[e]!==this.lensIn[e+1]){let t=this.lensIn[e+1]>this.lensOut[e]?n[e+1]-3-Bm:n[e]+1;this.transitions.push({start:t,from:this.lensOut[e],to:this.lensIn[e+1]})}this.transitions.sort((e,t)=>e.start-t.start)}position(e,t){return this.pos.at(e,t)}target(e,t){return this.gaze.at(e,t)}clock(e){let t=this.stops;if(e<=t[0].t)return t[0].clock;for(let n=0;n+1<t.length;n++)if(e<=t[n+1].t)return t[n].clock+(e-t[n].t)/(t[n+1].t-t[n].t)*(t[n+1].clock-t[n].clock);return t[t.length-1].clock}focal(e){let t=this.lensIn[0];for(let n of this.transitions){if(e<n.start)break;if(e<n.start+Bm)return this.blend(n.from,n.to,(e-n.start)/Bm);t=n.to}return t}blend(e,t,n){let r=Vm(e),i=r+(Vm(t)-r)*Wm(n);return 18/Math.tan(i/2)}stopAt(e){let t=0;for(;t<this.stops.length-1&&e>(this.stops[t].t+this.stops[t+1].t)/2;)t++;return this.stops[t]}nearest(e){let t=new H,n=0,r=1/0;for(let i=0;i<=this.end;i+=.5){let a=this.position(i,t).distanceToSquared(e);a<r&&(r=a,n=i)}return n}},Km=Math.PI/180,qm=12,Jm=15,Ym=600,Xm=3,Zm=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-r/n)),Qm=class{route;world;mode=`auto`;fast=!1;waiting=!1;waitTime=0;driftGain=0;t=0;position=new H;quaternion=new kt;focal=24;heading=0;pitch=-10*Km;speed=0;yawRate=0;climb=0;strafe=0;bank=0;hover=!1;floorY=-1/0;autoBank=0;lastYaw=0;blendFrom;holdTime=0;get holdSeconds(){return this.holdTime}prev=new H;get holding(){return this.mode===`auto`&&this.t>=this.route.end}constructor(e,t){this.route=e,this.world=t,this.setAuto(0)}setAuto(e){this.mode=`auto`,this.t=e,this.blendFrom=void 0,this.holdTime=0,this.autoPose(0),this.floorY=this.position.y}rejoin(){this.mode!==`auto`&&(this.blendFrom={pos:this.position.clone(),quat:this.quaternion.clone(),focal:this.focal,left:Xm},this.t=Math.min(this.route.nearest(this.position),this.route.end),this.holdTime=0,this.mode=`auto`)}fly(){this.waiting=!1}takeOver(e=!1){if(this.mode===`manual`)return;this.waiting=!1;let t=new H(0,0,-1).applyQuaternion(this.quaternion);this.heading=Math.atan2(t.x,-t.z),this.pitch=Ot.clamp(Math.asin(Ot.clamp(t.y,-1,1)),-60*Km,20*Km),this.speed=e?0:Ot.clamp(this.velocity.length(),0,60),this.hover=e,this.yawRate=0,this.climb=0,this.strafe=0,this.bank=this.autoBank,this.mode=`manual`,this.blendFrom=void 0,this.focal=24}velocity=new H;update(e,t){this.prev.copy(this.position),this.mode===`auto`?this.updateAuto(e):this.updateManual(e,t),e>0&&this.velocity.copy(this.position).sub(this.prev).divideScalar(e)}tmp=new H;look=new H;m=new W;autoPose(e){let t=this.route,n=Math.min(this.t,t.end);t.position(n,this.position),t.target(n,this.look),this.t>=t.end?this.drift(this.holdTime,1):this.driftGain>0&&this.drift(this.waitTime,this.driftGain);let r=-1/0;for(let e of[0,1,2,3])t.position(Math.min(n+e*(this.fast?2:1),t.end),this.tmp),r=Math.max(r,this.world.surface(this.tmp.x,this.tmp.z,qm)+qm,this.world.ground(this.tmp.x,this.tmp.z)+Jm);this.floorY=e>0?r>this.floorY?Zm(this.floorY,r,.6,e):Zm(this.floorY,r,2,e):r,this.position.y=Math.max(this.position.y,this.floorY),this.m.lookAt(this.position,this.look,En.DEFAULT_UP),this.quaternion.setFromRotationMatrix(this.m);let i=this.tmp.set(0,0,-1).applyQuaternion(this.quaternion),a=Math.atan2(i.x,-i.z),o=a-this.lastYaw;o=Math.atan2(Math.sin(o),Math.cos(o)),this.lastYaw=a,e>0&&(this.autoBank=Zm(this.autoBank,Ot.clamp(o/e*.35,-8*Km,8*Km),.8,e)),this.quaternion.multiply(new kt().setFromAxisAngle(new H(0,0,1),-this.autoBank)),this.focal=t.focal(n)}drift(e,t){let n=e*.05;this.position.x+=Math.sin(n)*12*t,this.position.z+=(Math.cos(n)-1)*12*t,this.position.y+=Math.sin(e*.21)*1.2*t}updateAuto(e){let t=this.route;if((this.waiting||this.driftGain>0)&&(this.waitTime+=e,this.driftGain=this.waiting?1:Zm(this.driftGain,0,.5,e),this.driftGain<.002&&(this.driftGain=0)),this.waiting||(this.t<t.end?this.t=Math.min(t.end,this.t+e*(this.fast?2:1)):this.holdTime+=e),this.autoPose(e),this.blendFrom){let t=this.blendFrom;t.left-=e;let n=Ot.smoothstep(1-t.left/Xm,0,1);this.position.lerpVectors(t.pos,this.position,n),this.quaternion.slerpQuaternions(t.quat,this.quaternion,n),this.focal=t.focal+(this.focal-t.focal)*n,t.left<=0&&(this.blendFrom=void 0)}}updateManual(e,t){let n=t.held(`ArrowLeft`),r=(!!t.held(`ArrowRight`)-+!!n)*45*Km;this.yawRate=Zm(this.yawRate,r,.35,e),this.heading+=this.yawRate*e,this.bank=Zm(this.bank,this.yawRate/(45*Km)*12*Km,.4,e);let i=t.held(`ArrowUp`),a=t.held(`ArrowDown`);this.climb=Zm(this.climb,(!!i-+!!a)*20,.3,e);let o=this.hover?0:t.held(`ShiftLeft`)||t.held(`ShiftRight`)?60:22;this.speed=Zm(this.speed,o,1.2,e);let s=t.held(`KeyA`),c=t.held(`KeyD`);this.strafe=Zm(this.strafe,(!!c-+!!s)*15,.3,e);let l=t.held(`KeyW`),u=t.held(`KeyS`);this.pitch=Ot.clamp(this.pitch+(!!l-+!!u)*40*Km*e,-60*Km,20*Km);let d=this.world.bounds,f=this.position.x,p=this.position.z,m=Math.max(d.xMin+700-f,f-(d.xMax-700),d.zMin+700-p,p-(d.zMax-700),0);if(m>0){let t=Math.atan2(-f,p)-this.heading;t=Math.atan2(Math.sin(t),Math.cos(t)),this.heading+=t*Math.min(1,m/700*1.5)*e}let h=Math.sin(this.heading),g=Math.cos(this.heading);this.position.x+=(h*this.speed+g*this.strafe)*e,this.position.z+=(-g*this.speed+h*this.strafe)*e,this.position.y+=this.climb*e,this.position.x=Ot.clamp(this.position.x,d.xMin+100,d.xMax-100),this.position.z=Ot.clamp(this.position.z,d.zMin+100,d.zMax-100);let _=this.world.ground(this.position.x,this.position.z),v=Math.max(_+Jm,this.world.surface(this.position.x,this.position.z,qm)+qm);for(let e of[1,2]){let t=this.position.x+h*this.speed*e,n=this.position.z-g*this.speed*e;v=Math.max(v,this.world.surface(t,n,qm)+qm-4*e)}this.position.y<v&&(this.position.y=Zm(this.position.y,v,.25,e)),this.position.y=Math.min(this.position.y,_+Ym);let y=new ln(this.pitch,-this.heading,-this.bank,`YXZ`);this.quaternion.setFromEuler(y),this.focal=24}toggleHover(){if(this.mode!==`manual`)return this.takeOver(!0);this.hover=!this.hover}},$m=class{down=new Set;pressed=[];constructor(e){e.addEventListener(`keydown`,e=>{if(e.target instanceof HTMLInputElement||e.metaKey||e.ctrlKey||e.altKey)return;let t=e.code;[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Space`].includes(t)&&e.preventDefault(),e.repeat||this.pressed.push(t),this.down.add(t)}),e.addEventListener(`keyup`,e=>this.down.delete(e.code)),e.addEventListener(`blur`,()=>this.down.clear())}held(e){return this.down.has(e)}drain(){let e=this.pressed;return this.pressed=[],e}},eh=4.5,th=23,nh=class{el;chip;clock;sun;alt;clouds;weather;slider;check;buttons;landmark;keys;stats;dragging=!1;shownLandmark=``;constructor(e,t,n){this.el=e,e.innerHTML=`
      <div class="tl">
        <h1>PRAHA</h1>
        <div class="sub">EARLY SUMMER · STARÉ MĚSTO · MALÁ STRANA · PETŘÍN · VYŠEHRAD</div>
        <div class="chip" data-chip></div>
      </div>
      <div class="tr">
        <div class="clock" data-clock>06:20</div>
        <div>SUN <span data-sun>0°</span> · CLOUDS <span data-clouds>—</span></div>
        <div>ALT <span data-alt>0 m</span></div>
      </div>
      <div id="landmark"><div class="cz"></div><div class="en"></div></div>
      <div id="stats"></div>
      <div class="bottom">
        <div class="keys" data-keys>
          <div><kbd>←</kbd><kbd>→</kbd> turn &nbsp; <kbd>↑</kbd><kbd>↓</kbd> altitude</div>
          <div><kbd>⇧</kbd> faster &nbsp; <kbd>␣</kbd> hover &nbsp; <kbd>W</kbd><kbd>S</kbd> tilt</div>
          <div><kbd>A</kbd><kbd>D</kbd> strafe &nbsp; <kbd>⏎</kbd> back to auto &nbsp; <kbd>C</kbd> new clouds</div>
        </div>
        <div class="panel interactive">
          <div class="row">
            <div class="lbl">TIME OF DAY</div>
            <input type="range" data-slider min="${eh}" max="${th}" step="0.01" value="6.33" aria-label="Time of day">
            <label class="check"><input type="checkbox" data-check checked> DAY ADVANCES WITH FLIGHT</label>
          </div>
          <div class="row">
            <div class="lbl">MODE</div>
            <div class="btns">
              <button data-mode="auto">AUTO 6:00</button>
              <button data-mode="fast">FAST 3:00</button>
              <button data-mode="manual">MANUAL</button>
            </div>
            <div class="lbl right">WEATHER</div>
            <div class="btns"><button data-weather>OVERCAST</button></div>
          </div>
        </div>
      </div>
      <div class="attribution">${n}</div>`;let r=t=>e.querySelector(t);this.chip=r(`[data-chip]`),this.clock=r(`[data-clock]`),this.sun=r(`[data-sun]`),this.alt=r(`[data-alt]`),this.clouds=r(`[data-clouds]`),this.weather=r(`[data-weather]`),this.slider=r(`[data-slider]`),this.check=r(`[data-check]`),this.landmark=r(`#landmark`),this.keys=r(`[data-keys]`),this.stats=r(`#stats`),this.buttons=Object.fromEntries([...e.querySelectorAll(`[data-mode]`)].map(e=>[e.dataset.mode,e])),this.slider.addEventListener(`input`,()=>{this.dragging=!0,this.check.checked=!1,t.setDayAdvances(!1),t.setClock(Number(this.slider.value))}),this.slider.addEventListener(`change`,()=>{this.dragging=!1,this.slider.blur()}),this.check.addEventListener(`change`,()=>{t.setDayAdvances(this.check.checked),this.check.blur()}),this.weather.addEventListener(`click`,()=>{t.setOvercast(!this.weather.classList.contains(`on`)),this.weather.blur()});for(let[e,n]of Object.entries(this.buttons))n.addEventListener(`click`,()=>{t.setMode(e),n.blur()})}shown(){setTimeout(()=>this.keys.style.opacity=`0`,2e4)}update(e){this.chip.innerHTML=e.mode===`manual`?`MANUAL`:e.mode===`fast`?`FAST · <b>3:00</b>`:`AUTO · <b>6:00</b>`;for(let[t,n]of Object.entries(this.buttons))n.classList.toggle(`on`,t===e.mode);this.clock.textContent=Kp(e.clock),this.sun.textContent=`${Math.round(e.sun)}°`,this.alt.textContent=`${Math.round(e.altitude)} m`,this.clouds.textContent=`${Math.round(e.clouds*100)}%`,this.weather.classList.toggle(`on`,e.overcast),this.dragging||(this.slider.value=String(Math.min(th,Math.max(eh,e.clock)))),this.check.checked!==e.dayAdvances&&(this.check.checked=e.dayAdvances)}setLandmark(e,t){let n=e+t;if(n!==this.shownLandmark){if(this.shownLandmark=n,!e){this.landmark.style.opacity=`0`;return}this.landmark.querySelector(`.cz`).textContent=e.toUpperCase(),this.landmark.querySelector(`.en`).textContent=t.toUpperCase(),this.landmark.style.opacity=`1`}}},rh={full:{preset:`full`,pixels:42e5,ao:!0,mirror:.5,mirrorRange:2200,clouds:2,coverage:.65,shadow:2048,shadowFar:2800,spriteShadows:!0,detail:1600,fine:300,relief:300,target:1/60,minScale:.72},lite:{preset:`lite`,pixels:17e5,ao:!1,mirror:.2,mirrorRange:1300,clouds:3,coverage:.4,shadow:1024,shadowFar:1400,spriteShadows:!1,detail:900,fine:0,relief:0,target:1/30,minScale:.6}};function ih(e,t){let n=e.get(`quality`);if(n===`lite`||n===`full`)return n;let r=t.getExtension(`WEBGL_debug_renderer_info`),i=String(r?t.getParameter(r.UNMASKED_RENDERER_WEBGL):t.getParameter(t.RENDERER));return/Intel|Iris|UHD Graphics|HD Graphics|SwiftShader|llvmpipe|Software/i.test(i)?`lite`:`full`}var ah=class{scale=1;avg=0;quiet=0;settle=3;probeWait=20;probing=!1;beaten=0;q;constructor(e){this.q=e}set quality(e){this.q=e,this.scale=1,this.avg=0,this.settle=3,this.probing=!1,this.beaten=0}sample(e){if(e<=0||e>.25||(this.avg=this.avg?this.avg+(e-this.avg)*Math.min(1,e/.8):e,(this.settle-=e)>0))return;let{target:t,minScale:n}=this.q;if(this.avg>t*1.2)return this.probing&&(this.probing=!1,this.probeWait=Math.min(160,this.probeWait*2)),this.scale<=n+.001?(this.beaten=this.avg>t*1.5?this.beaten+e:0,this.q.preset===`full`&&this.beaten>6?`lite`:void 0):(this.scale=Math.max(n,this.scale*Math.max(.82,Math.sqrt(t/this.avg))),this.settle=2.5,this.quiet=0,`scale`);if(this.probing=!1,this.beaten=0,this.scale<1&&(this.quiet+=e)>this.probeWait)return this.scale=Math.min(1,this.scale*1.08),this.probing=!0,this.settle=2.5,this.quiet=0,`scale`}},oh=class{el;go;state=`loading`;onFly;constructor(e,t){this.onFly=t,this.el=document.createElement(`div`),this.el.id=`cover`,this.el.innerHTML=`
      <div class="ground"></div>
      <div class="veil"></div>
      <div class="words"><h1>PRAHA</h1><div class="sub">EARLY SUMMER · FROM THE AIR</div><div class="go">LOADING THE CITY</div></div>`,e.appendChild(this.el),this.go=this.el.querySelector(`.go`),this.el.addEventListener(`click`,()=>this.lift())}get up(){return this.state!==`lifted`}showCity(){this.state===`loading`&&(this.state=`shown`,this.el.classList.add(`shown`))}ready(){this.state===`shown`&&(this.state=`ready`,this.go.textContent=`CLICK TO FLY`,this.el.classList.add(`ready`))}lift(){this.state!==`lifted`&&(this.state=`lifted`,this.el.classList.add(`lifted`),this.onFly(),setTimeout(()=>this.el.remove(),1800))}},sh={note:`The auto route of design.md §9.2. Positions and gaze are [x, north, alt] in the §6.1 frame, alt above the river (y). Lens 'long>wide' arrives long and opens to wide after the stop.`,duration:360,hold:4,clockStart:`06:20`,clockEnd:`21:45`,holdClockEnd:`22:30`,stops:[{n:1,name:`Vyšehrad, take-off`,t:0,clock:`06:20`,pos:[420,-2500,183],gaze:[110,-1341,14],lens:`wide`},{n:2,name:`Down the Vltava`,t:20,clock:`07:15`,pos:[250,-2e3,200],gaze:[100,-1250,12],lens:`wide`},{n:3,name:`Dancing House`,t:40,clock:`08:05`,pos:[330,-1500,110],gaze:[215,-1215,30],lens:`long>wide`},{n:4,name:`National Theatre, Legion Bridge`,t:58,clock:`08:55`,pos:[260,-900,115],gaze:[157,-600,20],lens:`wide`},{n:5,name:`Petřín, the climb`,t:74,clock:`09:40`,pos:[-450,-720,190],gaze:[-1173,-334,90],lens:`wide`},{n:6,name:`Petřín, rose garden and tower`,t:90,clock:`10:20`,pos:[-1120,-640,260],gaze:[-1137,-445,60],lens:`wide`},{n:7,name:`The Castle ridge`,t:108,clock:`11:10`,pos:[-1360,150,330],gaze:[-751,489,120],lens:`long`},{n:8,name:`Malá Strana roofs`,t:126,clock:`12:00`,pos:[-640,440,180],gaze:[-325,89,40],lens:`wide`},{n:9,name:`Charles Bridge, low pass`,t:144,clock:`12:45`,pos:[-236,42,30],gaze:[157,-40,30],lens:`wide`},{via:!0,n:0,name:`turning upstream`,t:153,clock:``,pos:[-93,-139,46],gaze:[-150,-470,15],lens:`wide`},{n:10,name:`Kampa, Čertovka`,t:162,clock:`13:35`,pos:[60,-250,75],gaze:[-243,-167,10],lens:`wide`},{via:!0,n:0,name:`panning north`,t:168,clock:``,pos:[192,-166,105],gaze:[103,499,40],lens:`wide`},{n:11,name:`Old Town Square, orbit`,t:178,clock:`14:15`,pos:[560,-40,125],gaze:[808,122,60],lens:`long`},{via:!0,n:0,name:`round Týn, south`,t:182,clock:``,pos:[808,-143,125],gaze:[808,122,60],lens:`long`},{via:!0,n:0,name:`round Týn, east`,t:187,clock:``,pos:[1006,69,125],gaze:[808,122,60],lens:`long`},{n:12,name:`Old Town Square, orbit`,t:192,clock:`14:55`,pos:[900,240,125],gaze:[808,122,60],lens:`long`},{n:13,name:`Old Town Square, orbit`,t:204,clock:`15:25`,pos:[700,340,120],gaze:[808,122,60],lens:`wide`},{n:14,name:`Josefov to Mánes Bridge`,t:218,clock:`16:05`,pos:[450,520,150],gaze:[-500,400,60],lens:`wide`},{via:!0,n:0,name:`turning south`,t:231,clock:``,pos:[850,-230,207],gaze:[450,-950,40],lens:`wide`},{n:15,name:`Wenceslas Square`,t:240,clock:`17:05`,pos:[1e3,-560,110],gaze:[1344,-856,60],lens:`long`},{n:16,name:`The bridges from Letná`,t:268,clock:`18:20`,pos:[330,960,300],gaze:[0,0,20],lens:`long>wide`},{n:17,name:`Back up the river`,t:302,clock:`19:50`,pos:[240,-1250,260],gaze:[458,-2446,60],lens:`wide`},{via:!0,n:0,name:`round the basilica`,t:324,clock:``,pos:[180,-2660,250],gaze:[458,-2446,90],lens:`wide`},{n:18,name:`Vyšehrad, blue hour`,t:345,clock:`21:45`,pos:[700,-2950,280],gaze:[138,-1559,69],lens:`wide`}]},ch={note:`The landmarks of design.md §6.2. x and north in metres in the §6.1 frame, as listed in §6.2 (verified against OSM on 2026-09-25). 'osm' names the OSM elements that are the landmark (verified by tools/build-world.ts, report in cache/landmarks-check.txt); 'box' places a stand-in box where OSM has no footprint. Names are shown in the app as the drone passes.`,landmarks:[{id:`charles-bridge`,cz:`Karlův most`,en:`Charles Bridge`,kind:`bridge`,x:0,north:0,osm:[`way/119016167`]},{id:`old-town-bridge-tower`,cz:`Staroměstská mostecká věž`,en:`Old Town Bridge Tower`,kind:`building`,x:164,north:-33,osm:[`way/839278890`]},{id:`lesser-town-bridge-towers`,cz:`Malostranské mostecké věže`,en:`Lesser Town Bridge Towers`,kind:`building`,x:-322,north:89,osm:[`way/839278891`]},{id:`tyn`,cz:`Týnský chrám`,en:`Church of Our Lady before Týn`,kind:`building`,x:808,north:122,osm:[`way/379512802`]},{id:`old-town-hall`,cz:`Staroměstská radnice a orloj`,en:`Old Town Hall and the astronomical clock`,kind:`building`,x:672,north:56,osm:[`way/391354925`,`way/321115101`]},{id:`st-nicholas-old-town`,cz:`Kostel svatého Mikuláše na Starém Městě`,en:`St Nicholas, Old Town Square`,kind:`building`,x:606,north:157,osm:[`way/27859115`]},{id:`hus-memorial`,cz:`Pomník mistra Jana Husa`,en:`Jan Hus Memorial`,kind:`monument`,x:710,north:131},{id:`marian-column`,cz:`Mariánský sloup`,en:`Marian Column`,kind:`monument`,x:710,north:96,osm:[`way/815041625`]},{id:`st-nicholas`,cz:`Chrám svatého Mikuláše`,en:`St Nicholas, Malá Strana`,kind:`building`,x:-579,north:167,osm:[`way/7645355`]},{id:`st-vitus`,cz:`Katedrála svatého Víta`,en:`St Vitus Cathedral`,kind:`building`,x:-751,north:489,osm:[`relation/15317899`]},{id:`petrin-tower`,cz:`Petřínská rozhledna`,en:`Petřín Lookout Tower`,kind:`building`,x:-1173,north:-334,osm:[`way/7645353`]},{id:`rose-garden`,cz:`Růžový sad na Petříně`,en:`Petřín rose garden`,kind:`place`,x:-1137,north:-445},{id:`strahov`,cz:`Strahovský klášter`,en:`Strahov Monastery`,kind:`building`,x:-1573,north:0,osm:[`relation/6268801`,`way/34638497`]},{id:`vysehrad-basilica`,cz:`Bazilika svatého Petra a Pavla`,en:`Basilica of Sts Peter and Paul, Vyšehrad`,kind:`building`,x:458,north:-2446,osm:[`way/24376643`]},{id:`leopold-gate`,cz:`Leopoldova brána`,en:`Leopold Gate, Vyšehrad`,kind:`building`,x:736,north:-2591,osm:[`way/51718887`]},{id:`dancing-house`,cz:`Tančící dům`,en:`Dancing House`,kind:`building`,x:200,north:-1223,osm:[`relation/6751056`]},{id:`national-theatre`,cz:`Národní divadlo`,en:`National Theatre`,kind:`building`,x:157,north:-634,osm:[`way/7649971`]},{id:`sitkov-tower`,cz:`Šítkovská vodárenská věž`,en:`Šítkov water tower`,kind:`building`,x:164,north:-1034,osm:[`way/30169179`]},{id:`smetana-museum`,cz:`Muzeum Bedřicha Smetany`,en:`Smetana Museum`,kind:`building`,x:129,north:-89,osm:[`way/30619188`,`way/30619195`]},{id:`st-francis`,cz:`Kostel svatého Františka z Assisi`,en:`St Francis of Assisi`,kind:`building`,x:207,north:-11,osm:[`way/28552795`]},{id:`klementinum-tower`,cz:`Astronomická věž Klementina`,en:`Klementinum astronomical tower`,kind:`building`,x:365,north:33,osm:[`way/382636013`,`way/462196623`]},{id:`rudolfinum`,cz:`Rudolfinum`,en:`Rudolfinum`,kind:`building`,x:293,north:378,osm:[`way/30123527`]},{id:`powder-tower`,cz:`Prašná brána`,en:`Powder Tower`,kind:`building`,x:1173,north:89,osm:[`way/27124370`]},{id:`national-museum`,cz:`Václavské náměstí, Národní muzeum`,en:`Wenceslas Square, the National Museum`,kind:`building`,x:1394,north:-845,osm:[`relation/3366506`]},{id:`letna-metronome`,cz:`Metronom na Letné`,en:`Letná metronome`,kind:`building`,x:329,north:912,box:{w:6,d:3,h:25,rot:-23}},{id:`wallenstein-garden`,cz:`Valdštejnská zahrada`,en:`Wallenstein Garden`,kind:`place`,x:-386,north:445},{id:`zizkov-tower`,cz:`Žižkovský vysílač`,en:`Žižkov Television Tower`,kind:`building`,x:2831,north:-612,box:{w:14,d:14,h:216}},{id:`legion-bridge`,cz:`Most Legií`,en:`Legion Bridge`,kind:`bridge`,x:-57,north:-578,osm:[`way/244981647`]},{id:`manes-bridge`,cz:`Mánesův most`,en:`Mánes Bridge`,kind:`bridge`,x:93,north:334,osm:[`way/166823562`]},{id:`cechuv-bridge`,cz:`Čechův most`,en:`Čech Bridge`,kind:`bridge`,x:400,north:734,osm:[`way/904148543`]},{id:`jiraskuv-bridge`,cz:`Jiráskův most`,en:`Jirásek Bridge`,kind:`bridge`,x:0,north:-1212,osm:[`relation/18257746`]},{id:`palacky-bridge`,cz:`Palackého most`,en:`Palacký Bridge`,kind:`bridge`,x:43,north:-1523,osm:[`way/476017590`]},{id:`railway-bridge`,cz:`Železniční most na Výtoni`,en:`Výtoň railway bridge`,kind:`bridge`,x:150,north:-2180,osm:[`way/1327958390`]},{id:`stefanik-bridge`,cz:`Štefánikův most`,en:`Štefánik Bridge`,kind:`bridge`,x:1115,north:890,osm:[`way/142370517`]},{id:`strelecky-island`,cz:`Střelecký ostrov`,en:`Střelecký Island`,kind:`island`,x:-100,north:-612},{id:`slovansky-island`,cz:`Slovanský ostrov, Žofín`,en:`Slavonic Island`,kind:`island`,x:43,north:-834},{id:`kampa`,cz:`Kampa`,en:`Kampa Island`,kind:`island`,x:-243,north:-167},{id:`naplavka`,cz:`Náplavka`,en:`Rašín embankment`,kind:`place`,x:257,north:-1612},{id:`schonborn-gloriette`,cz:`Glorieta Schönbornské zahrady`,en:`Schönborn garden gloriette`,kind:`building`,x:-733,north:-82,osm:[`way/27580901`]}]},lh=`/prague-drone/assets/classic-neg-BhCKGLcz.cube`,uh=new URLSearchParams(location.search),dh=`/prague-drone/world`,fh=new Ml({canvas:document.getElementById(`view`),antialias:!1,powerPreference:`high-performance`,reversedDepthBuffer:!0});fh.toneMapping=0,fh.shadowMap.enabled=!0,fh.shadowMap.type=1,fh.info.autoReset=!1;var ph=new Fn,mh=new Ga(50,1,3,6e4),hh=!uh.has(`t`)&&!uh.has(`manual`)?new oh(document.body,()=>Rh()):void 0,gh=0,_h=mm(uh.has(`seed`)?Number(uh.get(`seed`)):void 0);uh.has(`coverage`)&&(_h.coverage=Ot.clamp(Number(uh.get(`coverage`)),0,.65)),uh.has(`cirrus`)&&(_h.cirrus=Number(uh.get(`cirrus`)));var vh=uh.has(`overcast`)?uh.get(`overcast`)!==`0`:Math.random()<.2,yh=new Gm(sh),[bh,Q]=await Promise.all([zm(lh),Op.load(dh,fh)]),xh=new wm(fh,ph,_h,vh),Sh=new Rm(fh,bh),Ch=rh[ih(uh,fh.getContext())],wh=new ah(Ch),Th=uh.has(`scale`)?Number(uh.get(`scale`)):void 0;Th&&(wh.scale=Th);function Eh(e){Ch=e,Sh.ao=e.ao&&!0,Q.water.mirror.scale=e.mirror,Q.water.mirror.range=e.mirrorRange,xh.clouds.divisor=e.clouds,xh.clouds.maxCoverage=e.coverage,xh.sun.shadow.camera.far=e.shadowFar,Q.buildings.detailRange=e.detail,Q.buildings.reliefRange=e.relief,xu.value=+(Q.buildings.reliefRange>0),Q.landmarks&&(Q.landmarks.detailRange=e.detail*.9,Q.landmarks.fineRange=e.fine),Q.trees&&(Q.trees.spriteShadows=e.spriteShadows),bu.value=1,Q.trees&&(Q.trees.leaves=!0)}Eh(Ch),xh.sun.shadow.mapSize.set(Ch.shadow,Ch.shadow);var Dh=new Em(Q.height);ph.add(Q.group),xh.sun.layers.enable(1);var Oh=Q.stream(fh,e=>Sh.compile(e,mh,ph)).then(()=>{performance.mark(`praha:streamed`),Eh(Ch)});function kh(){let e=Y.uCityLights.value,t=mh.position;Y.uCityLights.value=1,Q.lights&&(Q.lights.points.visible=!0),Q.life?.lamps.set([[t.x,t.y-40,t.z,1,t.x+2,t.y-40,t.z,0]]),Q.buildings.detailRange=Q.landmarks.detailRange=Q.landmarks.fineRange=1/0,Q.buildings.update(t),Q.landmarks?.update(t),Sh.warm(ph,mh,!0),Q.water.mirror.render(fh,ph,mh,Math.min(0,t.y-50)),Y.uCityLights.value=e,Q.life?.lamps.set([]),Eh(Ch),Q.lights?.update()}function Ah(){let e=window.innerWidth,t=window.innerHeight,n=Math.min(window.devicePixelRatio,Math.sqrt(Ch.pixels/(e*t)));fh.setPixelRatio(Math.max(.5,n*wh.scale)),fh.setSize(e,t,!1),mh.aspect=e/t;let r=fh.getDrawingBufferSize(new V);Sh.setSize(r.x,r.y),xh.setSize(r.x,r.y),Q.water.setSize(r.x,r.y)}window.addEventListener(`resize`,Ah),Ah();var $=new Qm(yh,Q),jh=new $m(window),Mh=!0,Nh=yh.clock(0),Ph=Nh;uh.has(`clock`)&&(Mh=!1,Ph=Nh=uh.get(`clock`).includes(`:`)?qp(uh.get(`clock`)):Number(uh.get(`clock`))),uh.has(`t`)&&$.setAuto(Number(uh.get(`t`))),$.fast=uh.has(`fast`),uh.has(`manual`)&&$.takeOver(),$.waiting=hh!==void 0,Mh&&(Nh=yh.clock($.t));var Fh=new nh(document.getElementById(`hud`),{setClock:e=>{Ph=Nh=e},setDayAdvances:e=>{Mh=e,e||(Ph=Nh)},setMode:e=>{if(e===`manual`)return $.takeOver();$.fast=e===`fast`,$.mode===`manual`&&$.rejoin()},setOvercast:e=>{xh.overcastTarget=+!!e}},Q.manifest.attribution.replace(`Map data `,``).replace(/\. /g,` · `)),Ih=uh.has(`stats`);Fh.stats.style.display=Ih?`block`:`none`;var Lh=document.getElementById(`hud`);Lh.classList.toggle(`covered`,hh!==void 0);function Rh(){$.fly(),setTimeout(()=>{Lh.classList.remove(`covered`),Fh.shown()},1e3)}hh||Fh.shown(),Q.buildings.load(Q.manifest.tiles,$.position),performance.mark(`praha:world`),performance.now();var zh=!1;uh.has(`life`)&&Oh.then(()=>Q.life?.setTime(uh.has(`life`)?Number(uh.get(`life`)):60));function Bh(){mh.position.copy($.position),mh.quaternion.copy($.quaternion);let e=Vm($.focal);mh.fov=Ot.radToDeg(2*Math.atan(Math.tan(e/2)/mh.aspect)),mh.updateProjectionMatrix(),mh.updateMatrixWorld()}function Vh(e){if(fh.info.reset(),xh.update(Nh,mh,e),xh.updateEnvironment(),Dh.update(fh,xh.sunDir),Q.terrain.update(mh.position),Q.buildings.update(mh.position),Q.streets?.update(mh.position),Q.landmarks?.update(mh.position),Q.trees?.update(mh.position),Q.lights?.update(),Q.life){let t=$.position.y-Q.ground($.position.x,$.position.z);Q.life.update(e,Nh,mh.position,$.position,t)}Y.uTime.value+=e,Q.water.renderMirror(fh,ph,mh),Sh.render(ph,mh,{dt:e,light:xh.light,lens:Ot.clamp(($.focal-24)/31,0,1),beforeScene:e=>xh.renderClouds(e)})}var Hh=ch.landmarks,Uh=-1,Wh=0;function Gh(e){let t=new H(0,0,-1).applyQuaternion($.quaternion),n=-1,r=1/0;Hh.forEach((e,i)=>{let a=e.x-$.position.x,o=-e.north-$.position.z,s=Q.ground(e.x,-e.north)+20-$.position.y,c=Math.hypot(a,s,o);if(c>900)return;let l=(a*t.x+s*t.y+o*t.z)/c;if(l<Math.cos(22*Math.PI/180))return;let u=c*(2-l);u<r&&(r=u,n=i)}),n!==Uh&&e-Wh>4&&(Uh=n,Wh=e,Fh.setLandmark(n>=0?Hh[n].cz:``,n>=0?Hh[n].en:``))}var Kh=new Qa,qh=0,Jh=0,Yh=0,Xh=0,Zh=document.createElement(`div`);Zh.id=`fade`,document.body.appendChild(Zh);function Qh(){$.setAuto(0),Mh&&(Nh=yh.clock(0)),Zh.style.transition=`none`,Zh.style.opacity=`1`,Zh.offsetWidth,Zh.style.transition=``,Zh.style.opacity=`0`}function $h(e){performance.now(),Kh.update(e);let t=Kh.getDelta(),n=Math.min(t,.1);if(!Th&&zh){let e=wh.sample(t);e===`lite`&&(Eh(rh.lite),wh.quality=rh.lite),e&&Ah()}let r=jh.drain();r.length&&hh?.up&&hh.lift();for(let e of r)e===`ArrowLeft`||e===`ArrowRight`||e===`ArrowUp`||e===`ArrowDown`||e===`KeyA`||e===`KeyD`?$.takeOver():e===`Space`?$.toggleHover():e===`Enter`||e===`NumpadEnter`?$.mode===`manual`?$.rejoin():$.holding&&Qh():e===`Backquote`?(Ih=!Ih,Fh.stats.style.display=Ih?`block`:`none`):e===`KeyC`&&xh.reseed(mm());if($.update(n,jh),Mh&&$.mode===`auto`){let e=$.holding?Math.min(yh.holdClockEnd,yh.clock(yh.end)+$.holdSeconds/60):yh.clock($.t);Nh+=(e-Nh)*(1-Math.exp(-n/.6))}else Mh||(Nh=Ph);if(Bh(),Vh(n),Jh++,Yh+=n,Yh>.5&&(Xh=Jh/Yh,Jh=0,Yh=0),qh+=n,qh>.2){qh=0;let t=$.position.y-Q.ground($.position.x,$.position.z);if(Fh.update({mode:$.mode===`manual`?`manual`:$.fast?`fast`:`auto`,clock:Nh,sun:xh.elevation,altitude:t,dayAdvances:Mh,clouds:xh.overcast>.5?1:xh.clouds.coverage,overcast:xh.overcastTarget>.5}),Gh(e/1e3),Ih){let e=fh.info.render,t=xh.clouds.session;Fh.stats.textContent=`${Xh.toFixed(0)} fps  ${e.calls} calls  ${(e.triangles/1e6).toFixed(2)} M tris\nt ${$.t.toFixed(1)} s  stop ${yh.stopAt($.t).n}  ${$.focal.toFixed(0)} mm\nx ${$.position.x.toFixed(0)}  north ${(-$.position.z).toFixed(0)}  y ${$.position.y.toFixed(0)}\nclouds seed ${t.seed}  peak ${(t.coverage*100).toFixed(0)}%  base ${t.base.toFixed(0)} m  wind ${t.wind.toFixed(1)} m/s  cirrus ${t.cirrus.toFixed(2)}\ntiles ${Q.buildings.loaded}/${Q.buildings.total}  grade ${Sh.grade?`on`:`off`}  ao ${Sh.ao?`on`:`off`}\n${Ch.preset}  scale ${wh.scale.toFixed(2)}  ${fh.domElement.width} × ${fh.domElement.height}`}}gh||(gh=performance.now(),performance.mark(`praha:first-frame`),hh?.showCity()),!zh&&Q.complete&&(zh=!0,performance.mark(`praha:city`),kh()),hh?.up&&(zh||performance.now()-gh>6e3)&&hh.ready(),requestAnimationFrame($h)}requestAnimationFrame($h);