const headerFix=document.createElement('style');
headerFix.textContent=`
.top{display:flex;max-width:100%;overflow:hidden}
.top>div{display:flex;align-items:center;min-width:0;white-space:nowrap}
.top>div:first-child{flex:1}.top>div:last-child{flex:0 0 auto}
.top b{display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;min-width:64px!important;height:38px!important;padding:0 10px!important;white-space:nowrap!important;line-height:1!important;flex:0 0 auto}
@media(max-width:650px){.top{gap:8px}.top>div:first-child{font-size:9px}.top b{min-width:54px!important;height:32px!important;padding:0 7px!important;font-size:9px!important}.top>div:last-child{font-size:0!important}.top>div:last-child:after{content:'02';font:700 9px monospace;color:#938b88}}
`;
document.head.appendChild(headerFix);
