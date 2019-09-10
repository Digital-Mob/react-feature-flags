import e from"react";const t="feature:flags",n=3e5,r=e.createContext(new Map);class a extends e.PureComponent{constructor(){super(...arguments),this.state={featureFlags:new Map},this.intervalID=null}componentDidMount(){const{refreshInterval:e=n}=this.props,r=function(){const e=window.localStorage.getItem(t);if(e)try{const t=JSON.parse(e);if((t.createdAt||0)+n>=Date.now())return new Map(t.flags)}catch(e){}}();r?this.setState(e=>({...e,featureFlags:r})):this.getFeaturesFlags(),this.intervalID=setInterval(()=>{this.getFeaturesFlags()},e)}componentWillUnmount(){this.intervalID&&(clearInterval(this.intervalID),this.intervalID=null)}render(){const{children:t}=this.props,{featureFlags:n}=this.state;return e.createElement(r.Provider,{value:n},t)}getFeaturesFlags(){const{url:e}=this.props;(function(e){return window.fetch(e).then(e=>e.json()).then(e=>{return(e&&e.featureFlags||[]).reduce((e,t)=>(t.enabled&&e.set(t.name,t),e),new Map)})})(e).then(e=>{this.setState(t=>({...t,featureFlags:e})),function(e){if(e&&e.size>0){const n=JSON.stringify({flags:Array.from(e.entries()),createdAt:Date.now()});window.localStorage.setItem(t,n)}else window.localStorage.removeItem(t)}(e)})}}const s=t=>{const{children:n,flags:a,exact:s=!0,fallback:l}=t,o=[].concat(a||[]);return e.createElement(r.Consumer,null,e=>{return(s?o.every(t=>e.has(t)):o.some(t=>e.has(t)))?n:l&&l()||null})};export{a as FeatureFlagsProvider,s as FeatureFlagsWidget};
