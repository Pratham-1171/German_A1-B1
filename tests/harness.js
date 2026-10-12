const {JSDOM, VirtualConsole} = require('jsdom');
const fs = require('fs');
const _doms=[];
function closeAll(){ _doms.splice(0).forEach(d=>{ try{ d.window.close(); }catch(e){} }); }
function load(path, opts={}){
  const html = fs.readFileSync(path,'utf8');
  const errors=[]; const vc=new VirtualConsole();
  vc.on('jsdomError',e=>errors.push(String(e.detail||e.message||e).slice(0,300)));
  vc.on('error',e=>errors.push(String(e).slice(0,300)));
  const dom = new JSDOM(html,{url:'https://app.test/index.html', runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:vc,
    beforeParse(w){ w.matchMedia=w.matchMedia||(()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})); if(opts.before) opts.before(w); }});
  _doms.push(dom);
  return {dom, window:dom.window, errors};
}
module.exports={load, closeAll};
