const screenshotFix=document.createElement('style');
screenshotFix.textContent=`
:root{--b:#09090a!important;--c:#141315!important;--w:#f2ede7!important;--g:#938b88!important;--y:#c84b6f!important;--l:rgba(242,237,231,.13)!important}
html,body{background:#09090a!important;color:#f2ede7!important}body{background-image:radial-gradient(circle at 82% 10%,rgba(139,39,72,.18),transparent 30%),linear-gradient(135deg,#09090a 0%,#0d0b0c 58%,#120a0d 100%)!important}
.top{background:rgba(9,9,10,.9)!important;border-color:rgba(242,237,231,.12)!important}.top b{border-color:rgba(242,237,231,.38)!important;color:#f2ede7!important}
.hero h1{color:#f2ede7!important}.hero h1 span{color:#d85f82!important}.hero p,.rule p,.score p,.row,.share-body>p,.share-supply p{color:#938b88!important}
.ey,.rule b,.qh,.supply small,.score small,.verdict small,.row strong,.share-grid b,.share-supply small,.share-question small,.fanshi-final>small,.final-words b{color:#c84b6f!important}.ey:before{background:#c84b6f!important}
.rule{border-color:rgba(200,75,111,.28)!important;background:linear-gradient(135deg,rgba(200,75,111,.08),rgba(255,255,255,.015)),#111012!important}
.q{background:#121113!important;border-color:rgba(242,237,231,.11)!important}.q:hover{background:#161417!important}.opts,.checks{background:rgba(242,237,231,.11)!important}.opts button,.checks label{background:#0e0e0f!important;color:#8e8784!important}.opts button:hover{background:#1b181a!important;color:#e7dfd8!important}.opts button.on,.checks label.on{outline-color:#c84b6f!important;background:linear-gradient(135deg,#29151c,#161214)!important;color:#f2ede7!important}
.supply{border-color:rgba(242,237,231,.12)!important;background:radial-gradient(circle at 90% 0,rgba(139,39,72,.13),transparent 36%),#121113!important}
#submit{background:#9f3154!important;color:#fff!important}#submit:disabled{background:#242124!important;color:#6f6866!important}#submit:not(:disabled):hover{background:#c84b6f!important;box-shadow:0 18px 55px rgba(139,39,72,.28)!important}
.report,.community-share{border-color:rgba(200,75,111,.35)!important;background:#0d0d0e!important}.report{background-image:radial-gradient(circle at 88% 8%,rgba(139,39,72,.13),transparent 34%)!important}.score>div+div,.row,.share-head,.share-score{border-color:rgba(242,237,231,.11)!important}
.verdict,.fanshi-final{border-color:rgba(200,75,111,.3)!important;background:linear-gradient(145deg,#201217,#0e0d0e 65%)!important}.share-head{color:#c84b6f!important}.share-grid{background:rgba(242,237,231,.11)!important}.share-grid div{background:#121113!important}
.share-question,.final-order{border-left-color:#c84b6f!important;background:#1d1115!important}.share-actions button{border-color:#c84b6f!important;background:#9f3154!important}.share-actions button:last-child{background:transparent!important;color:#c84b6f!important}.shot-exit{background:#c84b6f!important;color:#fff!important}
.shot-mode body>main{display:block!important}
.shot-mode body>header{display:none!important}
.shot-mode body .community-share{display:block!important;position:fixed!important;inset:0!important;z-index:9998!important;width:100%!important;height:100vh!important;overflow:auto!important;background:#0b0b0c!important}
.shot-mode .shot-exit{display:block!important;z-index:9999!important}
`;
document.head.appendChild(screenshotFix);
