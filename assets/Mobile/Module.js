const Module = new class{
    noInitialRun = true;
    arguments = ["-v", "--menu"];
    preRun = [];
    postRun = [];
    totalDependencies = 0;
    serviceVersion = 'cache_v1';
    version = 'v6.5';
    JSversion = 1;
    elmid = '#emu-webretro';
    bundleCdn = "https://cdn.jsdelivr.net/gh/BinBashBanana/webretro@master/";
    bundleCdnLatest = "https://cdn.jsdelivr.net/gh/BinBashBanana/webretro/";
    biosCdn = "https://cdn.jsdelivr.net/gh/archtaurus/RetroPieBIOS@master/BIOS/";
    action={};
    isLocal = /^(127|localhost|172)/.test(location.host)
    constructor(T){
        const M=this;
        M.JSURLINFO = document.currentScript && document.currentScript.src.split('?');
        M.JSpath = (M.JSURLINFO||[''])[0].split('/').slice(0, -1).join('/') + '/';
        if(!T){
            let script = document.createElement('script');
            script.src = M.JSpath+'common.min.js';
            document.addEventListener('NengeReady',e=>{
                console.log(e);
                M.RunSart(e.detail);
                M.installStart();

            })
            document.body.appendChild(script);
        }else{
            M.RunSart(T);
            T.docload(e=>M.installStart(T));
        }
    }
    RunSart(T){
        const M=this, I = T.Set(M),ElmBody = T.$(M.elmid);
        T.DB_NAME = 'webretro_mobile'; //定义 indexdb name
        T.LibStore = 'data-libjs'; //定义 储存js文件表
        T.version = 1;
        T.DB_STORE_MAP = { //所有表
            'data-roms': {system: false},
            'data-system': {version:false},
            'data-bios': {system: false},
            'data-config': {timestamp: false},
            'data-userdata': {timestamp: false},
            'data-libjs': {},
        }
        ElmBody.classList.add('emu-container');
        ElmBody.classList.add('emu-'+T.i18nName);
        ElmBody.innerHTML = 
`<div class="emu-welcome"><h3 id="emu-status"></h3><img id="emu-logo" src="${(M.JSpath+'zan.jpg')}"><div id="emu-welcome-result"></div></div>
<div class="emu-screen" hidden><canvas id="canvas" class="texturePixelated"></canvas></div>
<div class="emu-resume" hidden></div>
<div class="emu-settings" hidden></div>
<div class="emu-controls" hidden> </div>
<div class="emu-dialog" hidden></div>`;

    }
    async installStart(){
        let M = this,T=M.T,I=T.I,isInit=!0,status = '#emu-status';
        I.toArr(await indexedDB.databases(),entry=>{
            if(entry['name']==T.DB_NAME)isInit = !1;
        });
        var assets = (M.JSpath).split('/').slice(0, -2).join('/') + '/';
        M.URL_PATH = {
            root:M.isLocal?M.JSpath:M.bundleCdnLatest+'Mobile/',
            assets:M.isLocal?assets:M.bundleCdnLatest+'assets/',
            cores:M.isLocal?assets+'cores/':M.bundleCdnLatest+'cores/',
            bios:M.isLocal?assets+'bios/':M.biosCdn
        };
        var ROOT = M.URL_PATH,version = M.isLocal?undefined:M.JSversion;
        T.lang = await T.FetchItem({
            url:ROOT['root']+'i18n/'+T.i18nName+'.json?'+T.time,
            process:e=>T.$(status).innerHTML = e,
            type:'json',
            version
        });
        /*
        if(isInit){
            await T.FetchItem({
                url:ROOT['root']+'zip/base.zip',
                key:T.F.LibKey,
                store:T.LibStore,
                unpack:true,
                process:e=>T.$(status).innerHTML = e,
            });
        }
        */
        if(M.isLocal){
            await T.addJS(ROOT['root']+'Module_Start.js?'+T.time);
            if(!T.$('link[rel="stylesheet"]')){
                await T.addScript(
                    ROOT['root']+'webretro.css',
                    {
                        process:e=>T.$(status).innerHTML = e,
                        version
                    }
                );
            }
        }else{
            //await T.loadLibjs(ROOT['root']+'Module_Start.min.zip',e=>T.$(status).innerHTML = e,version);
            await T.addScript(
                ROOT['root']+'webretro.css',
                {
                    process:e=>T.$(status).innerHTML = e,
                    version
                }
            );
            //await T.loadLibjs(ROOT['root']+'nipplejs.js',e=>T.$(status).innerHTML = e,version);
            //await T.loadLibjs(ROOT['root']+'gamepad.min.js',e=>T.$(status).innerHTML = e,version);
            await T.loadLibjs(ROOT['root']+'Module_Start.min.js',e=>T.$(status).innerHTML = e,version);
        }
        return;
        if(location.protocol=='http:') return;
        //var mobile_sw_version = localStorage.getItem('mobile_sw_version');
        //if(!mobile_sw_version)localStorage.setItem('mobile_sw_version',M.version);
        if('serviceWorker' in navigator){
            navigator.serviceWorker.register(ROOT['root']+'sw.js').then(worker=>{
                /*
                if(mobile_sw_version != M.version){
                    worker.update(()=>{
                        localStorage.setItem('mobile_sw_version',M.version);
                    })
                }
                */
            }).catch(e=>console.log('reg errot',e));
            navigator.serviceWorker.addEventListener('message', event => {
                console.log('sw msg', event);
                if(!M.serviceWorker)M.serviceWorker = event.source;
                M.CF('server_'+event.data.type,event.data);
            });
        }
    }
    setMEMFS(MEMFS, FS, RA, GLOBAL_BASE) {
        var M = this,I=M.I; 
        if (!M.MEMFS && MEMFS) I.defines(M, {
            MEMFS
        }, 1);
        if (!M.FS && FS) I.defines(M, {
            FS
        }, 1);
        if (!M.RA && RA) I.defines(M, {
            RA
        }, 1);
        if (!M.GLOBAL_BASE && GLOBAL_BASE) I.defines(M, {
            GLOBAL_BASE
        }, 1);
    }
}(window.Nenge);