(function(){
  const body=document.body;
  const search=document.getElementById('sbSearch');
  const themeToggle=document.getElementById('themeToggle');
  const favToggle=document.getElementById('favToggle');
  const sidebar=document.getElementById('sidebar');
  const main=document.querySelector('.main');
  const catToggle=document.getElementById('catToggle');
  const catDropdown=document.getElementById('catDropdown');
  const catToggleLabel=document.getElementById('catToggleLabel');
  const siteChatButton=document.getElementById('siteChatButton');
  const mobileEpgToggle=document.getElementById('mobileEpgToggle');
  const mobileEpgSlot=document.getElementById('mobileEpgSlot');
  const siteChat=document.getElementById('siteChat');
  const siteChatTitle=document.getElementById('siteChatTitle');
  const siteChatHint=document.getElementById('siteChatHint');
  const siteChatMessages=document.getElementById('siteChatMessages');
  const siteChatForm=document.getElementById('siteChatForm');
  const siteChatName=document.getElementById('siteChatName');
  const siteChatText=document.getElementById('siteChatText');
  const siteChatStatus=document.getElementById('siteChatStatus');
  const siteChatHp=document.getElementById('siteChatHp');
  const empty=document.getElementById('sbEmpty');
  const sbList=document.querySelector('.sb-list');
  const layout=document.querySelector('.layout');
  const desktopExtras=document.querySelector('.page-extras');
  let desktopExtrasAnchor=null;
  let epgDesktopAnchor=null;
  let mobileEpgOpen=false;
  const homeCategorySlider=document.getElementById('homeCategorySlider');
  const homeCatPrev=document.getElementById('homeCatPrev');
  const homeCatNext=document.getElementById('homeCatNext');
  const initialCatBtn=document.querySelector('[data-cat-nav].active');
  let activeCat=body.dataset.activeCategory||(initialCatBtn?initialCatBtn.dataset.catNav:'all');
  let favoritesOnly=false;
  const favoriteStorageKey='televisao_favorite_channels';
  let ajaxBusy=false;
  let activeChannelAutoScrollToken=0;
  let activeChannelAutoScrollCancelled=false;
  function normalizeChannelCategories(value){
    if(Array.isArray(value))return value.map(String).map(function(v){return v.trim();}).filter(Boolean);
    return String(value||'').split(/\s+/).map(function(v){return v.trim();}).filter(Boolean);
  }

  let currentChannelData={
    slug:body.dataset.currentSlug||'',
    iframe:body.dataset.currentIframe||'',
    name:body.dataset.currentChannelName||'',
    categories:normalizeChannelCategories(body.dataset.currentCategories||'')
  };

  const pageClassMap={
    home:'home-page',
    category:'category-page',
    channel:'channel-page',
    static:'static-page'
  };

  function setPageMode(mode){
    mode=pageClassMap[mode]?mode:'channel';
    Object.keys(pageClassMap).forEach(function(key){
      body.classList.remove(pageClassMap[key]);
    });
    body.classList.add(pageClassMap[mode]);
    body.dataset.pageType=mode;
  }

  function normalizeInitialPageMode(){
    let mode=body.dataset.pageType||'';
    if(!pageClassMap[mode]){
      if(body.classList.contains('home-page'))mode='home';
      else if(body.classList.contains('category-page'))mode='category';
      else if(body.classList.contains('static-page'))mode='static';
      else mode='channel';
    }
    setPageMode(mode);
  }

  normalizeInitialPageMode();

  let siteChatTimer=0;
  let siteChatLastCount=0;
  const siteChatApi='/chat_api.php';
  const siteChatReactions=[
    {key:'heart',emoji:'❤️',label:'Coração'},
    {key:'fire',emoji:'🔥',label:'Fogo'},
    {key:'laugh',emoji:'😂',label:'Engraçado'},
    {key:'angry',emoji:'😡',label:'Bravo'},
    {key:'poop',emoji:'💩',label:'Ruim'}
  ];

  if('scrollRestoration' in history)history.scrollRestoration='manual';

  function setSiteTheme(theme){
    theme=theme==='dark'?'dark':'light';
    document.documentElement.setAttribute('data-theme',theme);
    document.documentElement.style.colorScheme=theme;
    try{localStorage.setItem('televisao_theme_v2',theme);}catch(err){}
    if(themeToggle){
      const isDark=theme==='dark';
      themeToggle.setAttribute('aria-pressed',isDark?'true':'false');
      themeToggle.setAttribute('aria-label',isDark?'Tema claro':'Tema escuro');
      themeToggle.title=isDark?'Mudar para tema claro':'Mudar para tema escuro';
      const icon=themeToggle.querySelector('.theme-toggle-icon');
      const text=themeToggle.querySelector('.theme-toggle-text');
      if(icon)icon.textContent=isDark?'🌙':'☀️';
      if(text)text.textContent=isDark?'Escuro':'Claro';
    }
    const themeColor=document.querySelector('meta[name="theme-color"]:not([media])')||document.querySelector('meta[name="theme-color"]');
    if(themeColor)themeColor.setAttribute('content',theme==='dark'?'#202124':'#ffffff');
    const siteLogo=document.getElementById('siteLogo');
    if(siteLogo){
      const nextLogo=theme==='light'?(siteLogo.getAttribute('data-logo-light')||siteLogo.getAttribute('src')):(siteLogo.getAttribute('data-logo-dark')||siteLogo.getAttribute('src'));
      if(nextLogo&&siteLogo.getAttribute('src')!==nextLogo)siteLogo.setAttribute('src',nextLogo);
    }
  }

  function initThemeToggle(){
    let current=document.documentElement.getAttribute('data-theme')||'dark';
    if(current!=='dark')current='light';
    setSiteTheme(current);
    if(themeToggle){
      themeToggle.addEventListener('click',function(){
        const next=(document.documentElement.getAttribute('data-theme')==='dark')?'light':'dark';
        setSiteTheme(next);
      });
    }
  }

  function normalize(s){return (s||'').toString().toLowerCase().trim();}
  function viewportWidthForUi(){
    if(window.visualViewport&&window.visualViewport.width){
      return Math.round(window.visualViewport.width);
    }
    return window.innerWidth||0;
  }

  function viewportHeightForUi(){
    if(window.visualViewport&&window.visualViewport.height){
      return Math.round(window.visualViewport.height);
    }
    return window.innerHeight||0;
  }

  function updateSearchPlaceholderMode(){
    if(!search)return;
    const full='Buscar canais...';
    const short='Buscar...';
    const hasValue=search.value.trim()!=='';
    const focused=document.activeElement===search;
    const inputWidth=search.clientWidth||search.offsetWidth||0;
    const vw=viewportWidthForUi();
    const mobile=vw>0&&vw<=768;
    const minFullWidth=mobile?150:122;
    const minShortWidth=mobile?92:78;

    if(!hasValue&&!focused&&inputWidth>0&&inputWidth<minShortWidth){
      search.placeholder='';
      search.classList.add('search-icon-only');
      return;
    }

    search.classList.remove('search-icon-only');
    search.placeholder=!hasValue&&inputWidth>0&&inputWidth<minFullWidth?short:full;
  }

  let channelItemsCache=null;
  let sidebarFullListLoading=false;
  const channelSearchTextCache=new WeakMap();
  let searchFilterTimer=0;

  function items(){
    if(!channelItemsCache)channelItemsCache=Array.from(document.querySelectorAll('.sb-item'));
    return channelItemsCache;
  }
  function channelSearchText(el){
    let text=channelSearchTextCache.get(el);
    if(text!==undefined)return text;
    const name=el.dataset.name||'';
    const slug=el.dataset.slug||'';
    const title=el.querySelector('.sb-name');
    text=normalize([name,slug,title?title.textContent:''].join(' '));
    channelSearchTextCache.set(el,text);
    return text;
  }
  function scheduleSearchFilter(){
    window.clearTimeout(searchFilterTimer);
    searchFilterTimer=window.setTimeout(function(){
      searchFilterTimer=0;
      filterChannels();
    },100);
  }
  function catButtons(){return Array.from(document.querySelectorAll('[data-cat-nav]'));}
  function categoryName(key){const btn=catButtons().find(function(el){return el.dataset.catNav===key;});if(!btn)return 'Todos';const name=btn.querySelector('.cat-tag-name');return name?name.textContent.trim():btn.textContent.trim();}
  function visibleItems(){return items().filter(el=>!el.classList.contains('is-hidden'));}
  function itemLink(item){return item?(item.matches&&item.matches('a.sb-item')?item:item.querySelector('.sb-link')):null;}
  function focusChannelItem(item){const link=itemLink(item);if(link&&link.focus)link.focus({preventScroll:true});else if(item&&item.focus)item.focus({preventScroll:true});}
  function clickChannelItem(item){const link=itemLink(item);if(link&&link.click)link.click();else if(item&&item.click)item.click();}

  function createSidebarChannelItem(ch){
    ch=ch||{};
    const slug=String(ch.slug||'');
    const name=String(ch.name||'');

    const item=document.createElement('div');
    item.className='sb-item';
    item.dataset.slug=slug;
    item.dataset.cat=String(ch.category||'');
    item.dataset.cats=Array.isArray(ch.categories)?ch.categories.map(String).join(' '):String(ch.category||'');
    item.dataset.name=name;

    const active=(currentChannelData.slug||'')===slug;
    if(active)item.classList.add('active');

    const link=document.createElement('a');
    link.className='sb-link';
    link.href=String(ch.url||('/'+slug));
    link.dataset.ajaxUrl=String(ch.ajaxUrl||('/ajax.php?slug='+encodeURIComponent(slug)));
    if(active)link.setAttribute('aria-current','page');

    const logo=document.createElement('span');
    logo.className='sb-logo';
    logo.style.background=String(ch.color||'#252540');

    let logoImg=null;
    if(ch.logo){
      logoImg=document.createElement('img');
      logoImg.className='lazy-logo';
      logoImg.src=String(ch.logo);
      logoImg.alt='Logo '+name;
      logoImg.width=160;
      logoImg.height=120;
      logoImg.loading='lazy';
      logoImg.decoding='async';
      logo.appendChild(logoImg);
    }

    const fallback=document.createElement('span');
    fallback.className='sb-logo-fallback';
    fallback.textContent=String(ch.abbr||'');
    logo.appendChild(fallback);

    if(logoImg){
      wireLogoImage(logoImg);
    }

    const label=document.createElement('span');
    label.className='sb-name';
    label.textContent=name;

    link.appendChild(logo);
    link.appendChild(label);

    const favorite=document.createElement('button');
    favorite.type='button';
    favorite.className='sb-favorite';
    favorite.dataset.favoriteToggle='';
    favorite.dataset.favSlug=slug;
    favorite.dataset.favName=name;
    favorite.setAttribute('aria-label','Adicionar '+name+' aos favoritos');
    favorite.setAttribute('aria-pressed','false');
    favorite.title='Adicionar aos favoritos';
    favorite.textContent='☆';

    item.appendChild(link);
    item.appendChild(favorite);

    return item;
  }

  function sidebarExistingSlugs(){
    const seen=[];
    const used=Object.create(null);
    if(!sbList)return seen;

    sbList.querySelectorAll('.sb-item[data-slug]').forEach(function(item){
      const slug=String(item.dataset.slug||'').trim();
      if(slug&&!used[slug]){
        used[slug]=true;
        seen.push(slug);
      }
    });

    return seen;
  }

  function sidebarChannelsUrl(){
    const base=sbList?(sbList.dataset.channelsJson||'/channels-data.php'):'/channels-data.php';
    const exclude=sidebarExistingSlugs();

    try{
      const u=new URL(base,window.location.origin);
      if(exclude.length)u.searchParams.set('exclude',exclude.join(','));
      if(u.origin===window.location.origin)return u.pathname+u.search+u.hash;
      return u.toString();
    }catch(err){
      if(!exclude.length)return base;
      return String(base)+(String(base).indexOf('?')===-1?'?':'&')+'exclude='+encodeURIComponent(exclude.join(','));
    }
  }

  async function loadFullSidebarChannels(){
    if(!sbList||sbList.dataset.fullListLoaded==='1'||sidebarFullListLoading)return;

    const url=sidebarChannelsUrl();
    if(!url)return;

    sidebarFullListLoading=true;
    try{
      const existing=Object.create(null);
      sidebarExistingSlugs().forEach(function(slug){existing[slug]=true;});

      const res=await fetch(url,{headers:{'Accept':'application/json'},credentials:'same-origin',cache:'default'});
      if(!res.ok)throw new Error('HTTP '+res.status);

      const data=await res.json();
      if(!data||!data.ok||!Array.isArray(data.channels)){
        sidebarFullListLoading=false;
        return;
      }

      const frag=document.createDocumentFragment();
      let added=0;

      data.channels.forEach(function(ch){
        const slug=String((ch&&ch.slug)||'');
        if(!slug||existing[slug])return;
        existing[slug]=true;
        frag.appendChild(createSidebarChannelItem(ch));
        added++;
      });

      const emptyNode=document.getElementById('sbEmpty');
      if(added>0){
        if(emptyNode&&emptyNode.parentNode===sbList){
          sbList.insertBefore(frag,emptyNode);
        }else{
          sbList.appendChild(frag);
        }
      }

      sbList.dataset.fullListLoaded='1';
      sidebarFullListLoading=false;
      channelItemsCache=null;

      syncFavoritesUi();
      filterChannels();
      setActiveChannelBySlug(currentChannelData.slug||'');
      setupLazyLogos();
      syncMobileChannelLayout();

      if(isMobileChannelLayout()){
        queueCenterActiveChannelInMobileList();
      }else{
        queueScrollActiveChannelSecond([80,240]);
      }
    }catch(err){
      sidebarFullListLoading=false;
      if(window.console&&console.warn)console.warn('Cannot load full channel list',err);
    }
  }

  function scheduleFullSidebarChannelsLoad(){
    if(!sbList||sbList.dataset.sidebarPartial!=='1')return;

    const run=function(){loadFullSidebarChannels();};

    // Start quickly, but keep several fallbacks because requestIdleCallback may be delayed
    // on busy/mobile browsers or when another initialization task throws later.
    window.setTimeout(run,0);
    window.setTimeout(run,700);
    window.setTimeout(run,2000);

    if('requestIdleCallback' in window){
      window.requestIdleCallback(run,{timeout:1200});
    }

    window.addEventListener('load',run,{once:true});

    if(search){
      search.addEventListener('focus',run,{once:true,passive:true});
      search.addEventListener('input',run,{once:true,passive:true});
    }

    if(sbList){
      sbList.addEventListener('scroll',run,{once:true,passive:true});
      sbList.addEventListener('pointerenter',run,{once:true,passive:true});
      sbList.addEventListener('touchstart',run,{once:true,passive:true});
    }

    document.addEventListener('visibilitychange',function(){
      if(!document.hidden)run();
    },{once:true});
  }


  scheduleFullSidebarChannelsLoad();

  function detectEpgViewerTimeZone(){
    try{
      const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
      if(tz&&/^[A-Za-z_]+\/[A-Za-z0-9_+\-\/]+$/.test(tz))return tz;
    }catch(err){}
    return 'America/Sao_Paulo';
  }

  const epgViewerTimeZone=detectEpgViewerTimeZone();

  function appendEpgTimeZoneParam(url){
    try{
      const u=new URL(url,window.location.origin);
      u.searchParams.set('tz',epgViewerTimeZone);
      if(u.origin===window.location.origin)return u.pathname+u.search+u.hash;
      return u.toString();
    }catch(err){
      const sep=String(url).indexOf('?')===-1?'?':'&';
      return String(url)+sep+'tz='+encodeURIComponent(epgViewerTimeZone);
    }
  }

  function epgPad(n){return String(n).padStart(2,'0');}

  function epgLocalDateKey(date){
    return date.getFullYear()+'-'+epgPad(date.getMonth()+1)+'-'+epgPad(date.getDate());
  }

  function epgDayLabel(offset,date){
    if(offset===0)return 'Hoje';
    if(offset===1)return 'Amanhã';
    const names=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    return names[date.getDay()]||'';
  }

  function syncEpgDayTabs(root){
    const scope=root||document;
    const now=new Date();
    scope.querySelectorAll('[data-epg-day][data-epg-day-offset]').forEach(function(btn){
      const offset=parseInt(btn.dataset.epgDayOffset||'0',10)||0;
      const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset,12,0,0,0);
      const key=epgLocalDateKey(d);
      btn.dataset.epgDay=key;
      const strong=btn.querySelector('strong');
      const span=btn.querySelector('span');
      if(strong)strong.textContent=String(d.getDate());
      if(span)span.textContent=epgDayLabel(offset,d);
    });
  }

  function formatEpgLocalTime(epoch){
    const date=new Date(epoch*1000);
    try{
      return new Intl.DateTimeFormat('pt-BR',{timeZone:epgViewerTimeZone,hour:'2-digit',minute:'2-digit',hour12:false}).format(date).replace(/^24:/,'00:');
    }catch(err){
      return epgPad(date.getHours())+':'+epgPad(date.getMinutes());
    }
  }

  function syncEpgTimes(root){
    const scope=root||document;
    scope.querySelectorAll('[data-epg-time][data-epoch]').forEach(function(el){
      const epoch=parseInt(el.dataset.epoch||'0',10);
      if(epoch>0)el.textContent=formatEpgLocalTime(epoch);
    });
    scope.querySelectorAll('[data-epg-timezone-label]').forEach(function(el){
      el.textContent='Horário local';
      el.title=epgViewerTimeZone;
    });
  }

  function syncEpgProgramStates(root){
    const scope=root||document;
    const now=Math.floor(Date.now()/1000);
    scope.querySelectorAll('[data-epg-program]').forEach(function(item){
      const start=parseInt(item.dataset.epgStart||'0',10);
      const end=parseInt(item.dataset.epgEnd||'0',10);
      const isPast=end>0&&end<=now;
      const isCurrent=start>0&&end>now&&start<=now;
      item.classList.toggle('epg-program-past',isPast);
      item.classList.toggle('epg-program-current',isCurrent);
      item.classList.toggle('epg-program-future',!isPast&&!isCurrent);
      if(isCurrent)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');
    });
  }

  function syncEpgForViewerTimeZone(root,reloadActiveDay){
    const scope=root||document;
    syncEpgDayTabs(scope);
    syncEpgTimes(scope);
    syncEpgProgramStates(scope);
    if(reloadActiveDay){
      const active=scope.querySelector('[data-epg-day].active,[data-epg-day][aria-selected="true"]');
      if(active)loadEpgDay(active,true);
    }
  }

  function readFavoriteSlugs(){
    try{
      const raw=localStorage.getItem(favoriteStorageKey)||'[]';
      const list=JSON.parse(raw);
      if(Array.isArray(list))return new Set(list.filter(Boolean).map(String));
    }catch(err){}
    return new Set();
  }

  function writeFavoriteSlugs(set){
    try{localStorage.setItem(favoriteStorageKey,JSON.stringify(Array.from(set)));}catch(err){}
  }

  function isFavoriteSlug(slug){
    return readFavoriteSlugs().has(String(slug||''));
  }

  function syncFavoritesUi(){
    const favs=readFavoriteSlugs();
    document.querySelectorAll('[data-favorite-toggle]').forEach(function(btn){
      const slug=btn.dataset.favSlug||'';
      const name=btn.dataset.favName||'canal';
      const active=favs.has(slug);
      btn.classList.toggle('active',active);
      btn.textContent=active?'★':'☆';
      btn.dataset.favoriteActive=active?'1':'0';
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.setAttribute('aria-label',(active?'Remover ':'Adicionar ')+name+(active?' dos favoritos':' aos favoritos'));
      btn.title=active?'Remover dos favoritos':'Adicionar aos favoritos';
    });
    if(favToggle){
      favToggle.classList.toggle('active',favoritesOnly);
      favToggle.setAttribute('aria-pressed',favoritesOnly?'true':'false');
      favToggle.setAttribute('aria-label',favoritesOnly?'Mostrar todos os canais':'Mostrar canais favoritos');
      favToggle.title=favoritesOnly?'Todos os canais':'Canais favoritos';
    }
    body.classList.toggle('favorites-only',favoritesOnly);
  }

  function toggleFavorite(slug){
    if(!slug)return;
    const favs=readFavoriteSlugs();
    if(favs.has(slug))favs.delete(slug);else favs.add(slug);
    writeFavoriteSlugs(favs);
    syncFavoritesUi();
    filterChannels();
    updateSearchPlaceholderMode();
  }

  function isAjaxChannelTarget(link){
    return !!(link&&link.href&&link.matches&&link.matches('.sb-link,.sb-item,.category-channel-card,.related-channel'));
  }

  function isMobileChannelLayout(){return body.classList.contains('channel-page')&&window.matchMedia('(max-width:1024px)').matches;}

  function currentEpgBlock(){return document.querySelector('[data-epg-block]');}

  function syncMobileEpgPlacement(){
    const block=currentEpgBlock();
    if(!mobileEpgSlot){return;}
    if(!block){
      mobileEpgSlot.hidden=true;
      if(mobileEpgToggle){
        mobileEpgToggle.disabled=true;
        mobileEpgToggle.setAttribute('aria-expanded','false');
      }
      body.classList.remove('mobile-epg-open');
      mobileEpgOpen=false;
      return;
    }
    if(!epgDesktopAnchor&&block.parentNode){
      epgDesktopAnchor=document.createComment('epg-desktop-anchor');
      block.parentNode.insertBefore(epgDesktopAnchor,block);
    }
    if(isMobileChannelLayout()){
      if(block.parentNode!==mobileEpgSlot)mobileEpgSlot.appendChild(block);
      if(mobileEpgToggle)mobileEpgToggle.disabled=false;
      mobileEpgSlot.hidden=!mobileEpgOpen;
      body.classList.toggle('mobile-epg-open',mobileEpgOpen);
    }else{
      if(epgDesktopAnchor&&epgDesktopAnchor.parentNode&&block.parentNode!==epgDesktopAnchor.parentNode){
        epgDesktopAnchor.parentNode.insertBefore(block,epgDesktopAnchor.nextSibling);
      }
      mobileEpgOpen=false;
      mobileEpgSlot.hidden=true;
      body.classList.remove('mobile-epg-open');
      if(mobileEpgToggle){
        mobileEpgToggle.disabled=false;
        mobileEpgToggle.classList.remove('open');
        mobileEpgToggle.setAttribute('aria-expanded','false');
      }
    }
  }

  function setMobileEpgOpen(open){
    mobileEpgOpen=!!open&&isMobileChannelLayout();
    syncMobileEpgPlacement();
    const block=currentEpgBlock();
    const list=block?block.querySelector('[data-epg-list]'):null;
    const innerBtn=block?block.querySelector('[data-epg-toggle]'):null;
    body.classList.toggle('mobile-epg-open',mobileEpgOpen);
    if(mobileEpgSlot)mobileEpgSlot.hidden=!mobileEpgOpen;
    if(mobileEpgToggle){
      mobileEpgToggle.classList.toggle('open',mobileEpgOpen);
      mobileEpgToggle.setAttribute('aria-expanded',mobileEpgOpen?'true':'false');
      mobileEpgToggle.setAttribute('aria-label',mobileEpgOpen?'Fechar programação':'Abrir programação');
      mobileEpgToggle.title=mobileEpgOpen?'Fechar programação':'Programação';
    }
    if(block){
      block.classList.toggle('open',mobileEpgOpen);
      if(list){
        if(mobileEpgOpen)list.removeAttribute('hidden');else list.setAttribute('hidden','');
      }
      if(innerBtn){
        innerBtn.setAttribute('aria-expanded',mobileEpgOpen?'true':'false');
        innerBtn.textContent=mobileEpgOpen?'Ocultar programação':'Programação';
      }
    }
  }

  function syncMobileChannelLayout(){
    if(desktopExtras&&layout&&sbList){
      if(!desktopExtrasAnchor){
        desktopExtrasAnchor=document.createComment('page-extras-anchor');
        if(desktopExtras.parentNode)desktopExtras.parentNode.insertBefore(desktopExtrasAnchor,desktopExtras);
      }
      if(isMobileChannelLayout()){
        if(desktopExtras.parentNode!==sbList)sbList.appendChild(desktopExtras);
      }else if(desktopExtrasAnchor.parentNode&&desktopExtras.parentNode!==desktopExtrasAnchor.parentNode){
        desktopExtrasAnchor.parentNode.insertBefore(desktopExtras,desktopExtrasAnchor.nextSibling);
      }
    }
    syncMobileEpgPlacement();
  }

  function isScrollableY(el){
    if(!el)return false;
    const overflow=getComputedStyle(el).overflowY;
    return /^(auto|scroll|overlay)$/.test(overflow)&&el.scrollHeight>el.clientHeight+4;
  }

  function channelScrollBox(){
    if(isScrollableY(sbList))return sbList;
    if(isScrollableY(sidebar))return sidebar;
    return null;
  }

  function logoFallbackForImage(img){
    if(!img||!img.parentNode)return null;
    return img.parentNode.querySelector('.sb-logo-fallback,.category-channel-fallback');
  }

  function wireLogoImage(img){
    if(!img||img.dataset.logoWired==='1')return;
    img.dataset.logoWired='1';

    const fallback=logoFallbackForImage(img);

    const showFallback=function(){
      img.classList.remove('is-loaded');
      if(fallback)fallback.hidden=false;
    };

    const showLogo=function(){
      img.classList.add('is-loaded');
      if(fallback)fallback.hidden=true;
    };

    img.addEventListener('load',showLogo,{once:true});
    img.addEventListener('error',function(){
      img.remove();
      if(fallback)fallback.hidden=false;
    },{once:true});

    if(img.complete){
      if(img.naturalWidth>0)showLogo();
      else showFallback();
    }
  }

  function loadLazyLogo(img){
    if(!img||img.dataset.loaded==='1')return;
    const src=img.dataset.src;
    if(!src)return;

    img.dataset.loaded='1';

    const fallback=logoFallbackForImage(img);

    const showFallback=function(){
      img.classList.remove('is-loaded');
      if(fallback)fallback.hidden=false;
    };

    const showLogo=function(){
      img.src=src;
      img.removeAttribute('data-src');
      img.classList.add('is-loaded');
      if(fallback)fallback.hidden=true;
    };

    img.addEventListener('load',function(){
      img.classList.add('is-loaded');
      if(fallback)fallback.hidden=true;
    },{once:true});

    img.addEventListener('error',function(){
      img.removeAttribute('src');
      img.remove();
      showFallback();
    },{once:true});

    img.src=src;
  }

  function setupLazyLogos(){
    document.querySelectorAll('img.lazy-logo:not([data-src])').forEach(wireLogoImage);
    const imgs=Array.from(document.querySelectorAll('img.lazy-logo[data-src]'));
    if(!imgs.length)return;
    if(!('IntersectionObserver' in window)){
      imgs.forEach(loadLazyLogo);
      return;
    }

    const onIntersect=function(entries,observer){
      entries.forEach(entry=>{
        if(entry.isIntersecting||entry.intersectionRatio>0){
          loadLazyLogo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    };

    const pageObserver=new IntersectionObserver(onIntersect,{root:null,rootMargin:'350px 0px',threshold:.01});
    const sideObserver=sidebar?new IntersectionObserver(onIntersect,{root:sidebar,rootMargin:'350px 0px',threshold:.01}):pageObserver;

    imgs.forEach(img=>{
      if(sidebar&&img.closest('.sidebar'))sideObserver.observe(img);
      else pageObserver.observe(img);
    });
  }

  function itemHasCategory(el,key){
    if(key==='all')return true;
    const raw=(el&&((el.dataset&&el.dataset.cats)||el.dataset.cat))||'';
    return raw.split(/\s+/).filter(Boolean).includes(key);
  }

  function filterChannels(){
    const q=normalize(search?search.value:'');
    const favs=readFavoriteSlugs();
    let count=0;
    items().forEach(el=>{
      const okCat=itemHasCategory(el,activeCat);
      const okSearch=!q||channelSearchText(el).includes(q);
      const okFavorite=!favoritesOnly||favs.has(el.dataset.slug||'');
      const show=okCat&&okSearch&&okFavorite;
      el.classList.toggle('is-hidden',!show);
      if(show)count++;
    });
    if(empty){
      empty.textContent=favoritesOnly?'Ainda não há canais favoritos':'Nenhum canal encontrado';
      empty.hidden=count!==0;
    }
    if(sidebar)sidebar.classList.toggle('no-results',count===0);
  }

  function setActiveCategory(cat){
    activeCat=cat||'all';
    catButtons().forEach(btn=>btn.classList.toggle('active',btn.dataset.catNav===activeCat));
    if(catToggleLabel)catToggleLabel.textContent=categoryName(activeCat);
    filterChannels();
  }

  function updateCatDropdownPosition(){
    if(!catDropdown||!catToggle)return;
    const box=(catToggle.closest('.sb-search')||catToggle).getBoundingClientRect();
    const top=Math.max(0,Math.ceil(box.bottom));
    document.documentElement.style.setProperty('--cat-dropdown-top',top+'px');
  }

  function updateSiteChatPosition(){
    if(!siteChatButton)return;
    const box=(siteChatButton.closest('.sb-search')||siteChatButton).getBoundingClientRect();
    const top=Math.max(0,Math.ceil(box.bottom)+8);
    document.documentElement.style.setProperty('--chat-panel-top',top+'px');
  }

  function updateChatContext(data){
    if(data){
      currentChannelData={
        slug:data.slug||currentChannelData.slug||'',
        iframe:data.iframe||currentChannelData.iframe||'',
        name:data.name||currentChannelData.name||'',
        categories:Array.isArray(data.categories)?normalizeChannelCategories(data.categories):currentChannelData.categories
      };
    }
    const active=document.querySelector('.sb-item.active');
    if(!currentChannelData.name&&active)currentChannelData.name=active.dataset.name||active.textContent.trim()||'';
    if((!currentChannelData.categories||!currentChannelData.categories.length)&&active){
      currentChannelData.categories=normalizeChannelCategories(active.dataset.cats||active.dataset.cat||'');
    }
    body.dataset.currentSlug=currentChannelData.slug||'';
    body.dataset.currentIframe=currentChannelData.iframe||'';
    body.dataset.currentChannelName=currentChannelData.name||'';
    body.dataset.currentCategories=(currentChannelData.categories||[]).join(' ');
    updateChatHeader();
  }

  function isKidsChatDisabled(){
    if(body.dataset.pageType==='category'&&(body.dataset.activeCategory||activeCat)==='kids')return true;
    const categories=(currentChannelData.categories&&currentChannelData.categories.length)
      ?currentChannelData.categories
      :normalizeChannelCategories(body.dataset.currentCategories||'');
    return !!(currentChannelData.slug&&categories.indexOf('kids')!==-1);
  }

  function updateChatHeader(){
    const name=(body.dataset.currentChannelName||currentChannelData.name||'').trim();
    const slug=(body.dataset.currentSlug||currentChannelData.slug||'').trim();
    const kidsDisabled=isKidsChatDisabled();
    if(kidsDisabled&&siteChat&&siteChat.classList.contains('open'))closeSiteChat();
    if(siteChatTitle)siteChatTitle.textContent=slug&&name?('Chat do canal '+name):'Chat do site';
    if(siteChatHint){
      siteChatHint.textContent=kidsDisabled?'Chat desativado em canais infantis':'A mensagem aparecerá após moderação';
    }
    if(siteChatButton){
      const normalTitle=slug&&name?('Chat do canal '+name):'Chat do site';
      const normalLabel=slug&&name?('Abrir chat do canal '+name):'Abrir chat do site';
      siteChatButton.disabled=kidsDisabled;
      siteChatButton.setAttribute('aria-disabled',kidsDisabled?'true':'false');
      siteChatButton.title=kidsDisabled?'Chat desativado em canais infantis':normalTitle;
      siteChatButton.setAttribute('aria-label',kidsDisabled?'Chat desativado em canais infantis':normalLabel);
    }
  }

  function chatClientId(){
    const key='site_chat_client_id';
    let id='';
    try{id=localStorage.getItem(key)||'';}catch(err){}
    if(!/^[a-z0-9_-]{16,64}$/i.test(id)){
      id='c_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
      try{localStorage.setItem(key,id);}catch(err){}
    }
    return id;
  }

  function savedChatName(){
    try{return localStorage.getItem('site_chat_name')||'';}catch(err){return '';}
  }

  function saveChatName(name){
    try{localStorage.setItem('site_chat_name',name||'');}catch(err){}
  }

  function formatChatTime(value){
    const d=new Date(value||Date.now());
    if(Number.isNaN(d.getTime()))return '';
    const date=d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
    const time=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return date+' '+time;
  }

  function chatReactionProgress(count){
    count=Number(count)||0;
    return Math.max(0,Math.min(100,count*10));
  }

  function renderChatMessages(messages){
    if(!siteChatMessages)return;
    messages=Array.isArray(messages)?messages.slice().sort(function(a,b){
      return String(b&&b.created_at?b.created_at:'').localeCompare(String(a&&a.created_at?a.created_at:''));
    }):[];
    siteChatMessages.textContent='';
    if(!messages.length){
      const emptyBox=document.createElement('div');
      emptyBox.className='site-chat-empty';
      emptyBox.textContent='Ainda não há mensagens. Seja o primeiro a escrever.';
      siteChatMessages.appendChild(emptyBox);
      siteChatLastCount=0;
      return;
    }
    messages.forEach(function(msg){
      const item=document.createElement('div');
      item.className='site-chat-message';
      if(msg.own)item.classList.add('own');
      if(msg.status&&msg.status!=='approved')item.classList.add('is-'+msg.status);

      const meta=document.createElement('div');
      meta.className='site-chat-meta';
      const name=document.createElement('strong');
      name.className='site-chat-author';
      name.textContent=msg.name||'Visitante';

      const metaSide=document.createElement('div');
      metaSide.className='site-chat-meta-side';
      const time=document.createElement('time');
      time.className='site-chat-time';
      time.dateTime=msg.created_at||'';
      time.textContent=formatChatTime(msg.created_at);
      metaSide.appendChild(time);

      meta.appendChild(name);
      meta.appendChild(metaSide);

      const text=document.createElement('div');
      text.className='site-chat-body';
      text.textContent=msg.text||'';
      item.appendChild(meta);
      item.appendChild(text);

      if(msg.id&&msg.status==='approved'){
        const reactions=document.createElement('div');
        reactions.className='site-chat-reactions';
        reactions.setAttribute('aria-label','Reação à mensagem');
        siteChatReactions.forEach(function(r){
          const count=msg.reactions&&Number.isFinite(Number(msg.reactions[r.key]))?Number(msg.reactions[r.key]):0;
          const btn=document.createElement('button');
          btn.type='button';
          btn.className='site-chat-reaction';
          if(count>0)btn.classList.add('has-count');
          if(msg.own_reaction===r.key)btn.classList.add('active');
          btn.dataset.messageId=msg.id;
          btn.dataset.chatReaction=r.key;
          btn.style.setProperty('--reaction-progress',chatReactionProgress(count)+'%');
          btn.setAttribute('aria-label',count>0?(r.label+': '+count):r.label);
          btn.title=count>0?(r.label+' · '+count):r.label;

          const emoji=document.createElement('span');
          emoji.className='site-chat-reaction-emoji';
          emoji.textContent=r.emoji;
          btn.appendChild(emoji);

          if(count>0){
            const num=document.createElement('span');
            num.className='site-chat-reaction-count';
            num.textContent=String(count);
            btn.appendChild(num);
          }
          reactions.appendChild(btn);
        });
        item.appendChild(reactions);
      }

      if(msg.status==='pending'){
        const note=document.createElement('div');
        note.className='site-chat-note';
        note.textContent='Aguardando moderação';
        item.appendChild(note);
      }else if(msg.status==='rejected'){
        const note=document.createElement('div');
        note.className='site-chat-note';
        note.textContent='Rejeitado pelo moderador';
        item.appendChild(note);
      }
      siteChatMessages.appendChild(item);
    });
    if(messages.length!==siteChatLastCount){
      const chatScrollTarget=siteChatMessages.closest('.site-chat-panel')||siteChatMessages;
      chatScrollTarget.scrollTop=0;
    }
    siteChatLastCount=messages.length;
  }

  async function loadSiteChat(){
    if(!siteChatMessages)return;
    try{
      updateChatContext();
      const url=siteChatApi+'?action=list&client_id='+encodeURIComponent(chatClientId())+'&channel_slug='+encodeURIComponent(body.dataset.currentSlug||'')+'&page_url='+encodeURIComponent(window.location.href);
      const res=await fetch(url,{headers:{'Accept':'application/json'},credentials:'same-origin',cache:'no-store'});
      const data=await res.json();
      if(!data||!data.ok)throw new Error(data&&data.error?data.error:'chat error');
      renderChatMessages(data.messages||[]);
    }catch(err){
      if(siteChatStatus)siteChatStatus.textContent='Não foi possível carregar o chat';
    }
  }

  function openSiteChat(){
    if(!siteChat||isKidsChatDisabled())return;
    closeCatDropdown();
    updateSiteChatPosition();
    siteChat.classList.add('open');
    siteChat.setAttribute('aria-hidden','false');
    if(siteChatButton){siteChatButton.classList.add('open');siteChatButton.setAttribute('aria-expanded','true');}
    if(siteChatName&&!siteChatName.value)siteChatName.value=savedChatName();
    loadSiteChat();
    window.clearInterval(siteChatTimer);
    siteChatTimer=window.setInterval(loadSiteChat,5000);
  }

  function closeSiteChat(){
    if(!siteChat)return;
    siteChat.classList.remove('open');
    siteChat.setAttribute('aria-hidden','true');
    if(siteChatButton){siteChatButton.classList.remove('open');siteChatButton.setAttribute('aria-expanded','false');}
    window.clearInterval(siteChatTimer);
  }

  async function sendSiteChatMessage(){
    if(!siteChatForm||!siteChatText)return;
    const name=(siteChatName&&siteChatName.value.trim())||'Visitante';
    const text=siteChatText.value.trim();
    if(!text){
      if(siteChatStatus)siteChatStatus.textContent='Digite uma mensagem';
      return;
    }
    if(text.length>500){
      if(siteChatStatus)siteChatStatus.textContent='Máximo de 500 caracteres';
      return;
    }
    const btn=siteChatForm.querySelector('button[type="submit"]');
    if(btn)btn.disabled=true;
    if(siteChatStatus)siteChatStatus.textContent='Enviando...';
    try{
      updateChatContext();
      const res=await fetch(siteChatApi,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({action:'send',client_id:chatClientId(),name:name,message:text,website:siteChatHp?siteChatHp.value:'',page_url:window.location.href,channel_slug:body.dataset.currentSlug||'',channel_name:body.dataset.currentChannelName||''})});
      const data=await res.json();
      if(!data||!data.ok)throw new Error(data&&data.error?data.error:'chat error');
      saveChatName(name);
      siteChatText.value='';
      if(siteChatStatus)siteChatStatus.textContent=data.status==='approved'?'Mensagem publicada':'Mensagem enviada para moderação';
      loadSiteChat();
    }catch(err){
      if(siteChatStatus)siteChatStatus.textContent=err.message||'Erro ao enviar';
    }finally{
      if(btn)btn.disabled=false;
    }
  }

  async function reactSiteChatMessage(messageId,reaction,button){
    if(!messageId||!reaction)return;
    if(button)button.disabled=true;
    try{
      const res=await fetch(siteChatApi,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({action:'react',client_id:chatClientId(),message_id:messageId,reaction:reaction})});
      const data=await res.json();
      if(!data||!data.ok)throw new Error(data&&data.error?data.error:'chat error');
      if(siteChatStatus)siteChatStatus.textContent='Reação salva';
      loadSiteChat();
    }catch(err){
      if(siteChatStatus)siteChatStatus.textContent=err.message||'Erro ao reagir';
    }finally{
      if(button)button.disabled=false;
    }
  }

  function openCatDropdown(){
    if(!catDropdown||!catToggle)return;
    updateCatDropdownPosition();
    catDropdown.classList.add('open');
    catToggle.classList.add('open');
    catToggle.setAttribute('aria-expanded','true');
  }

  function closeCatDropdown(){
    if(!catDropdown||!catToggle)return;
    catDropdown.classList.remove('open');
    catToggle.classList.remove('open');
    catToggle.setAttribute('aria-expanded','false');
  }

  function setMeta(selector,attr,value){
    let el=document.querySelector(selector);
    if(!el&&selector.startsWith('meta')){
      el=document.createElement('meta');
      const nameMatch=selector.match(/name="([^"]+)"/);
      const propMatch=selector.match(/property="([^"]+)"/);
      if(nameMatch)el.setAttribute('name',nameMatch[1]);
      if(propMatch)el.setAttribute('property',propMatch[1]);
      document.head.appendChild(el);
    }
    if(el)el.setAttribute(attr,value||'');
  }

  function updateHead(data){
    document.title=data.title||document.title;
    setMeta('meta[name="description"]','content',data.description);
    const canonical=document.querySelector('link[rel="canonical"]')||document.head.appendChild(document.createElement('link'));
    canonical.setAttribute('rel','canonical');
    canonical.setAttribute('href',data.canonical||location.href);
    setMeta('meta[property="og:title"]','content',data.title);
    setMeta('meta[property="og:description"]','content',data.description);
    setMeta('meta[property="og:url"]','content',data.canonical);
    if(data.ogImage){
      setMeta('meta[property="og:image"]','content',data.ogImage);
      setMeta('meta[name="twitter:image"]','content',data.ogImage);
    }
    setMeta('meta[name="twitter:title"]','content',data.title);
    setMeta('meta[name="twitter:description"]','content',data.description);

    if(Array.isArray(data.schemas)){
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el=>el.remove());
      data.schemas.forEach(item=>{
        const s=document.createElement('script');
        s.type='application/ld+json';
        s.textContent=JSON.stringify(item,null,2);
        document.head.appendChild(s);
      });
    }
  }

  function playerAutoplayUrl(url){
    if(!url)return '';
    try{
      const u=new URL(url,window.location.origin);
      if(!u.searchParams.has('autoplay'))u.searchParams.set('autoplay','1');
      if(u.origin===window.location.origin)return u.pathname+u.search+u.hash;
      return u.toString();
    }catch(e){
      return url;
    }
  }

  function createPlayerFacade(data){
    const facade=document.createElement('div');
    facade.className='player-facade';
    facade.dataset.playerFacade='';
    facade.dataset.iframe=data.iframe||'';
    facade.dataset.title=data.iframeTitle||((data.name||'Canal')+' — ao vivo');
    const bg=document.createElement('div');
    bg.className='player-facade-bg';
    if(data.color)bg.style.backgroundColor=data.color;
    if(data.logo)bg.style.backgroundImage='url("'+String(data.logo).replace(/"/g,'%22')+'")';
    facade.appendChild(bg);

    const content=document.createElement('div');
    content.className='player-facade-content';

    const btn=document.createElement('button');
    btn.className='player-play';
    btn.type='button';
    btn.dataset.playerPlay='';
    btn.setAttribute('aria-label','Assistir '+(data.name||'canal')+' online');
    btn.innerHTML='<span>▶</span>';
    content.appendChild(btn);

    const title=document.createElement('span');
    title.className='player-facade-title';
    title.textContent=(data.name||'Canal')+' — ao vivo';
    content.appendChild(title);


    facade.appendChild(content);
    return facade;
  }

  function createPlayerIframe(data,withAutoplay){
    const frame=document.createElement('iframe');
    frame.className='player-iframe';
    frame.src=withAutoplay?playerAutoplayUrl(data.iframe||''):(data.iframe||'');
    frame.title=data.iframeTitle||((data.name||'Canal')+' — ao vivo');
    frame.loading='eager';
    frame.allow='autoplay; fullscreen; encrypted-media; picture-in-picture';
    return frame;
  }

  function loadPlayerFacade(facade){
    if(!facade||facade.dataset.loaded==='1')return;
    const src=facade.dataset.iframe||'';
    if(!src)return;
    const frame=createPlayerIframe({iframe:src,iframeTitle:facade.dataset.title||'Ao vivo'},true);
    facade.dataset.loaded='1';
    facade.replaceWith(frame);
    setTimeout(()=>frame.focus(),30);
  }

  function ensurePlayerSection(data){
    let section=document.querySelector('.player-section');
    if(section||!main)return section;

    main.textContent='';
    section=document.createElement('section');
    section.className='player-section';

    const wrap=document.createElement('div');
    wrap.className='player-wrap';
    wrap.dataset.playerWrap='';
    section.appendChild(wrap);
    main.appendChild(section);
    return section;
  }

  function switchToChannelPage(data){
    setPageMode('channel');
    // Do not auto-filter the sidebar by the selected channel category.
    // Preserve the user's current list state: all channels, selected category, search or favorites.
    body.dataset.activeCategory=activeCat||'all';
    syncMobileChannelLayout();
  }

  function updatePlayer(data){
    const section=ensurePlayerSection(data);
    const wrap=document.querySelector('.player-wrap');
    if(section&&data.playerLabel)section.setAttribute('aria-label',data.playerLabel);
    if(wrap){
      wrap.textContent='';
      wrap.appendChild(createPlayerIframe(data||{},false));
    }
    body.dataset.currentIframe=data.iframe||'';
    currentChannelData.iframe=data.iframe||'';
    currentChannelData.slug=data.slug||'';
    currentChannelData.name=data.name||'';
  }

  function updateEpg(data){
    const section=document.querySelector('.player-section');
    if(!section)return;
    const old=currentEpgBlock();
    if(old)old.remove();
    if(epgDesktopAnchor&&epgDesktopAnchor.parentNode)epgDesktopAnchor.parentNode.removeChild(epgDesktopAnchor);
    epgDesktopAnchor=null;
    mobileEpgOpen=false;
    if(!data||!data.epgHtml){
      syncMobileEpgPlacement();
      return;
    }
    const temp=document.createElement('div');
    temp.innerHTML=data.epgHtml;
    const block=temp.querySelector('[data-epg-block]')||temp.firstElementChild;
    if(block)section.appendChild(block);
    refreshEpgProgress();
    if(block)syncEpgForViewerTimeZone(block,true);
    syncMobileEpgPlacement();
    setMobileEpgOpen(false);
  }

  function refreshEpgProgress(){
    const now=Math.floor(Date.now()/1000);
    document.querySelectorAll('[data-epg-progress]').forEach(function(bar){
      const start=parseInt(bar.dataset.start||'0',10);
      const end=parseInt(bar.dataset.end||'0',10);
      if(!start||!end||end<=start)return;
      const percent=Math.max(0,Math.min(100,Math.round(((now-start)/(end-start))*100)));
      bar.style.width=percent+'%';
      const progressbar=bar.closest('.epg-progress');
      if(progressbar&&progressbar.getAttribute('role')==='progressbar'){
        progressbar.setAttribute('aria-valuenow',String(percent));
      }
    });
    syncEpgProgramStates(document);
  }

  async function loadEpgDay(btn,force){
    const block=btn?btn.closest('[data-epg-block]'):null;
    const content=block?block.querySelector('[data-epg-day-content]'):null;
    const day=btn?btn.dataset.epgDay:'';
    const slug=block?block.dataset.channelSlug:'';
    if(!block||!content||!day||!slug)return;
    if(!force&&content.dataset.currentDay===day&&!content.classList.contains('is-error')){syncEpgForViewerTimeZone(block,false);return;}

    block.querySelectorAll('[data-epg-day]').forEach(function(dayBtn){
      const active=dayBtn===btn;
      dayBtn.classList.toggle('active',active);
      dayBtn.setAttribute('aria-selected',active?'true':'false');
    });

    content.classList.add('is-loading');
    content.setAttribute('aria-busy','true');

    try{
      const res=await fetch('/ajax.php?slug='+encodeURIComponent(slug)+'&epg_day='+encodeURIComponent(day)+'&tz='+encodeURIComponent(epgViewerTimeZone),{
        headers:{'X-Requested-With':'XMLHttpRequest','Accept':'application/json'},
        credentials:'same-origin'
      });
      if(!res.ok)throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!data||!data.ok||!data.epgDayHtml)throw new Error(data&&data.error?data.error:'EPG error');
      content.innerHTML=data.epgDayHtml;
      content.dataset.currentDay=day;
      content.classList.remove('is-error');
      syncEpgForViewerTimeZone(block,false);
    }catch(err){
      content.classList.add('is-error');
      content.innerHTML='<h3>Programação</h3><p>Não foi possível carregar a programação deste dia.</p>';
    }finally{
      content.classList.remove('is-loading');
      content.removeAttribute('aria-busy');
    }
  }

  function updateArticles(data){
    if(!data.articleHtml)return;
    document.querySelectorAll('.page-extras .article').forEach(article=>{
      article.innerHTML=data.articleHtml;
      article.classList.remove('expanded');
    });
    document.querySelectorAll('.page-extras').forEach(extras=>extras.classList.remove('description-expanded'));
    document.querySelectorAll('[data-article-toggle]').forEach(btn=>{
      btn.textContent='Mostrar descrição';
    });
  }

  function updateRelated(data){
    const old=document.querySelector('.related-channels');
    if(old)old.remove();
    if(!data.relatedHtml)return;
    const extras=document.querySelector('.page-extras');
    if(!extras)return;
    const footer=extras.querySelector('.footer');
    const temp=document.createElement('div');
    temp.innerHTML=data.relatedHtml;
    const related=temp.firstElementChild;
    if(!related)return;
    if(footer)extras.insertBefore(related,footer);else extras.appendChild(related);
  }

  function slugFromUrl(url){
    const u=new URL(url,window.location.origin);
    return u.pathname.replace(/^\/+|\/+$/g,'');
  }

  function setActiveChannelBySlug(slug){
    items().forEach(el=>{
      const link=itemLink(el);
      const active=(el.dataset.slug||(link&&link.href?slugFromUrl(link.href):''))===slug;
      el.classList.toggle('active',active);
      if(link){
        if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
      }
      if(active)el.dataset.active='1';else delete el.dataset.active;
    });
    if(sbList){
      const index=activeVisibleChannelIndex();
      if(index>=0)sbList.setAttribute('data-active-index',String(index));
      else sbList.removeAttribute('data-active-index');
    }
  }

  function cancelActiveChannelAutoScroll(){
    activeChannelAutoScrollCancelled=true;
    activeChannelAutoScrollToken++;
  }

  function allowActiveChannelAutoScroll(){
    activeChannelAutoScrollCancelled=false;
  }

  function activeVisibleChannelIndex(){
    let index=0;
    const allItems=items();
    for(let i=0;i<allItems.length;i++){
      const el=allItems[i];
      if(el.classList.contains('is-hidden'))continue;
      if(el.classList.contains('active'))return index;
      index++;
    }
    return -1;
  }

  function estimatedMobileChannelRowHeight(){
    return window.matchMedia&&window.matchMedia('(orientation: landscape)').matches?64:77;
  }

  function estimatedMobileChannelListHeight(rowHeight){
    const vh=viewportHeightForUi();
    const vw=viewportWidthForUi();
    const landscape=window.matchMedia&&window.matchMedia('(orientation: landscape)').matches;
    if(landscape){
      return Math.max(rowHeight*3,vh-48-58);
    }
    const playerHeight=Math.min(vh*.38,Math.max(0,vw-16)*.5625)+8;
    return Math.max(rowHeight*3,vh-56-playerHeight-74);
  }

  function setMobileChannelScrollByIndex(index){
    if(!sbList||index<0)return;
    const rowHeight=estimatedMobileChannelRowHeight();
    const listHeight=estimatedMobileChannelListHeight(rowHeight);
    const visibleRows=Math.max(3,listHeight/rowHeight);
    const target=(index-Math.max(1,(visibleRows-1)/2))*rowHeight;
    const previousBehavior=sbList.style.scrollBehavior;
    sbList.style.scrollBehavior='auto';
    sbList.scrollTop=Math.max(0,Math.round(target));
    sbList.style.scrollBehavior=previousBehavior;
  }

  function centerActiveChannelInMobileList(){
    if(!isMobileChannelLayout()||!sbList)return;
    const index=activeVisibleChannelIndex();
    if(index<0)return;
    sbList.setAttribute('data-active-index',String(index));
    setMobileChannelScrollByIndex(index);
  }

  function queueCenterActiveChannelInMobileList(){
    if(!isMobileChannelLayout())return;
    window.requestAnimationFrame(function(){
      centerActiveChannelInMobileList();
      window.requestAnimationFrame(centerActiveChannelInMobileList);
    });
  }

  function scrollActiveChannelSecond(){
    if(activeChannelAutoScrollCancelled||!sidebar)return;
    const active=document.querySelector('.sb-item.active');
    if(!active||active.classList.contains('is-hidden'))return;

    const scroller=channelScrollBox();
    if(scroller){
      const scrollerRect=scroller.getBoundingClientRect();
      const activeRect=active.getBoundingClientRect();
      const currentTop=activeRect.top-scrollerRect.top+scroller.scrollTop;
      const desired=currentTop-(scroller.clientHeight/2)+(activeRect.height/2);
      const maxScroll=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
      scroller.scrollTop=Math.min(maxScroll,Math.max(0,Math.round(desired)));
    }
  }

  function queueScrollActiveChannelSecond(delays){
    if(activeChannelAutoScrollCancelled)return;
    const token=++activeChannelAutoScrollToken;
    const run=function(){
      if(token!==activeChannelAutoScrollToken||activeChannelAutoScrollCancelled)return;
      scrollActiveChannelSecond();
    };
    window.requestAnimationFrame(function(){
      run();
      window.requestAnimationFrame(run);
    });
    (delays||[90,240,520]).forEach(delay=>window.setTimeout(run,delay));
  }

  function apiUrlFor(link,url){
    if(link&&link.dataset.ajaxUrl)return appendEpgTimeZoneParam(link.dataset.ajaxUrl);
    const slug=slugFromUrl(url);
    return appendEpgTimeZoneParam('/ajax.php?slug='+encodeURIComponent(slug));
  }

  async function loadChannel(url,push,link){
    if(ajaxBusy)return;
    const wasChannelPage=body.classList.contains('channel-page');
    ajaxBusy=true;
    closeCatDropdown();
    body.classList.add('is-loading-channel');

    try{
      const res=await fetch(apiUrlFor(link,url),{
        headers:{'X-Requested-With':'XMLHttpRequest','Accept':'application/json'},
        credentials:'same-origin'
      });
      if(!res.ok)throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!data||!data.ok)throw new Error(data&&data.error?data.error:'AJAX error');

      updateHead(data);
      switchToChannelPage(data);
      updatePlayer(data);
      updateEpg(data);
      updateArticles(data);
      updateRelated(data);
      updateChatContext(data);
      if(siteChat&&siteChat.classList.contains('open'))loadSiteChat();
      setActiveChannelBySlug(data.slug);
      if(push)history.pushState({url:data.url||url},'',data.url||url);
      filterChannels();
      if(!wasChannelPage){
        allowActiveChannelAutoScroll();
        if(isMobileChannelLayout()){
          queueCenterActiveChannelInMobileList();
        }
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }
    }catch(err){
      window.location.href=url;
    }finally{
      ajaxBusy=false;
      body.classList.remove('is-loading-channel');
    }
  }

  if(search){
    search.addEventListener('focus',function(){cancelActiveChannelAutoScroll();updateSearchPlaceholderMode();},{passive:true});
    search.addEventListener('blur',updateSearchPlaceholderMode,{passive:true});
    search.addEventListener('input',function(){cancelActiveChannelAutoScroll();scheduleSearchFilter();updateSearchPlaceholderMode();});
    search.addEventListener('search',function(){cancelActiveChannelAutoScroll();scheduleSearchFilter();updateSearchPlaceholderMode();});
    search.addEventListener('keyup',function(){cancelActiveChannelAutoScroll();scheduleSearchFilter();updateSearchPlaceholderMode();});
  }

  if(favToggle){
    favToggle.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      cancelActiveChannelAutoScroll();
      favoritesOnly=!favoritesOnly;
      syncFavoritesUi();
      filterChannels();
    });
  }

  if(sbList){
    ['pointerdown','touchstart','wheel'].forEach(function(type){
      sbList.addEventListener(type,cancelActiveChannelAutoScroll,{passive:true});
    });
  }


  ['pointerdown','mousedown','touchstart'].forEach(function(type){
    document.addEventListener(type,function(e){
      const favBtn=e.target.closest&&e.target.closest('[data-favorite-toggle]');
      if(!favBtn)return;
      e.stopPropagation();
      const item=favBtn.closest('.sb-item');
      if(item&&item.blur)item.blur();
      if(type==='mousedown'&&e.cancelable)e.preventDefault();
    },{capture:true,passive:false});
  });

  document.addEventListener('click',function(e){
    const play=e.target.closest('[data-player-play]');
    if(play){
      const facade=play.closest('[data-player-facade]');
      loadPlayerFacade(facade);
      e.preventDefault();
      return;
    }

    const mobileEpgBtn=e.target.closest('#mobileEpgToggle');
    if(mobileEpgBtn){
      e.preventDefault();
      e.stopPropagation();
      setMobileEpgOpen(!mobileEpgOpen);
      return;
    }

    const epgDayBtn=e.target.closest('[data-epg-day]');
    if(epgDayBtn){
      e.preventDefault();
      loadEpgDay(epgDayBtn);
      return;
    }

    const epgBtn=e.target.closest('[data-epg-toggle]');
    if(epgBtn){
      e.preventDefault();
      const block=epgBtn.closest('[data-epg-block]');
      const list=block?block.querySelector('[data-epg-list]'):null;
      if(!list)return;
      const open=list.hasAttribute('hidden');
      if(open)list.removeAttribute('hidden');else list.setAttribute('hidden','');
      if(block)block.classList.toggle('open',open);
      epgBtn.setAttribute('aria-expanded',open?'true':'false');
      epgBtn.textContent=open?'Ocultar programação':'Programação';
      return;
    }

    const favBtn=e.target.closest('[data-favorite-toggle]');
    if(favBtn){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      cancelActiveChannelAutoScroll();
      toggleFavorite(favBtn.dataset.favSlug||'');
      const item=favBtn.closest('.sb-item');
      if(item&&item.blur)item.blur();
      if(favBtn.blur)favBtn.blur();
      return;
    }

    const link=e.target.closest('.sb-link,.category-channel-card,.related-channel');
    if(link){
      if(link.classList.contains('sb-item'))cancelActiveChannelAutoScroll();
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const url=link.href;
      if(new URL(url).origin!==window.location.origin)return;
      if(!isAjaxChannelTarget(link))return;
      e.preventDefault();
      loadChannel(url,true,link);
      return;
    }

    const articleBtn=e.target.closest('[data-article-toggle]');
    if(articleBtn){
      const target=document.getElementById(articleBtn.dataset.articleToggle);
      if(!target)return;
      const extras=articleBtn.closest('.page-extras');
      target.classList.toggle('expanded');
      const isExpanded=target.classList.contains('expanded');
      if(extras)extras.classList.toggle('description-expanded',isExpanded);
      articleBtn.textContent=isExpanded?'Ocultar descrição':'Mostrar descrição';
    }
  });

  window.addEventListener('popstate',function(){
    const path=window.location.pathname.replace(/^\/+|\/+$/g,'');
    const active=items().find(el=>el.dataset.slug===path);
    if(active){
      loadChannel(window.location.href,false,active);
    }else{
      window.location.reload();
    }
  });
  history.replaceState({url:window.location.href},'',window.location.href);

  function refreshOpenFloatingPositions(){
    if(catDropdown&&catDropdown.classList.contains('open'))updateCatDropdownPosition();
    if(siteChat&&siteChat.classList.contains('open'))updateSiteChatPosition();
  }

  window.addEventListener('resize',function(){refreshOpenFloatingPositions();updateSearchPlaceholderMode();},{passive:true});
  window.addEventListener('orientationchange',function(){refreshOpenFloatingPositions();updateSearchPlaceholderMode();},{passive:true});
  window.addEventListener('scroll',refreshOpenFloatingPositions,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',function(){refreshOpenFloatingPositions();updateSearchPlaceholderMode();},{passive:true});
    window.visualViewport.addEventListener('scroll',refreshOpenFloatingPositions,{passive:true});
  }
  if(sidebar)sidebar.addEventListener('scroll',refreshOpenFloatingPositions,{passive:true});

  if(siteChatButton){
    siteChatButton.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      if(isKidsChatDisabled())return;
      if(siteChat&&siteChat.classList.contains('open'))closeSiteChat();else openSiteChat();
    });
  }
  if(siteChat){
    siteChat.addEventListener('click',function(e){
      if(e.target===siteChat)closeSiteChat();
    });
  }
  if(siteChatForm){
    siteChatForm.addEventListener('submit',function(e){
      e.preventDefault();
      sendSiteChatMessage();
    });
  }
  if(siteChatMessages){
    siteChatMessages.addEventListener('click',function(e){
      const btn=e.target.closest('[data-chat-reaction]');
      if(!btn)return;
      e.preventDefault();
      e.stopPropagation();
      reactSiteChatMessage(btn.dataset.messageId||'',btn.dataset.chatReaction||'',btn);
    });
  }

  if(catToggle){
    catToggle.addEventListener('click',function(e){
      e.stopPropagation();
      if(catDropdown&&catDropdown.classList.contains('open'))closeCatDropdown();else openCatDropdown();
    });
  }
  if(catDropdown){
    catDropdown.addEventListener('click',function(e){
      const item=e.target.closest('.cat-dropdown-item');
      if(!item)return;
      catButtons().forEach(btn=>btn.classList.toggle('active',btn===item));
      const itemName=item.querySelector('.cat-tag-name');
      if(catToggleLabel)catToggleLabel.textContent=itemName?itemName.textContent.trim():item.textContent.trim();
      closeCatDropdown();
    });
  }

  document.addEventListener('click',function(e){
    if(!catDropdown||!catDropdown.classList.contains('open'))return;
    if(e.target.closest('.sb-search'))return;
    closeCatDropdown();
  });


  function setupHomeCategorySlider(){
    if(!homeCategorySlider)return;
    function shift(dir){
      const amount=Math.max(260,Math.round(homeCategorySlider.clientWidth*.82));
      homeCategorySlider.scrollBy({left:amount*dir,behavior:'smooth'});
    }
    if(homeCatPrev)homeCatPrev.addEventListener('click',()=>shift(-1));
    if(homeCatNext)homeCatNext.addEventListener('click',()=>shift(1));
  }

  function setupRemoteControl(){
    const ua=navigator.userAgent||'';
    const isTV=/TV|SmartTV|HbbTV|NetCast|GoogleTV|AppleTV|WebOS|Tizen|AFT|MiBOX|DuneHD/i.test(ua);
    if(isTV){
      setTimeout(()=>{
        const active=document.querySelector('.sb-item.active')||document.querySelector('.sb-item:not(.is-hidden)');
        if(active)focusChannelItem(active);
      },200);
    }

    document.addEventListener('keydown',function(e){
      const focused=document.activeElement;
      if(e.key==='Escape'){
        closeCatDropdown();
        closeSiteChat();
        if(search&&focused===search)search.blur();
        return;
      }


      if(focused&&focused.matches&&focused.matches('[data-favorite-toggle]')&&(e.key==='Enter'||e.key===' ')){
        toggleFavorite(focused.dataset.favSlug||'');
        const item=focused.closest('.sb-item');
        if(item&&item.blur)item.blur();
        if(focused.blur)focused.blur();
        e.preventDefault();
        return;
      }

      const focusedItem=focused&&focused.closest?focused.closest('.sb-item'):null;
      if(focusedItem&&(focused.matches('.sb-link')||focusedItem===focused)){
        const list=visibleItems();
        const idx=list.indexOf(focusedItem);
        if(e.key==='Enter'&&focusedItem===focused){
          clickChannelItem(focusedItem);
          e.preventDefault();
        }else if(e.key==='ArrowDown'&&list[idx+1]){
          focusChannelItem(list[idx+1]);
          list[idx+1].scrollIntoView({block:'nearest'});
          e.preventDefault();
        }else if(e.key==='ArrowUp'){
          if(idx>0){
            focusChannelItem(list[idx-1]);
            list[idx-1].scrollIntoView({block:'nearest'});
          }else if(search){
            search.focus();
          }
          e.preventDefault();
        }else if(e.key==='ArrowRight'){
          const frame=document.querySelector('.player-iframe')||document.querySelector('[data-player-facade]');
          if(frame)frame.focus();
          e.preventDefault();
        }
      }

      if(focused===search&&e.key==='ArrowDown'){
        const first=visibleItems()[0];
        if(first){focusChannelItem(first);e.preventDefault();}
      }

      if(focused&&focused.classList&&focused.classList.contains('cat-btn')){
        const btns=Array.from(document.querySelectorAll('.cat-btn'));
        const idx=btns.indexOf(focused);
        if(e.key==='ArrowRight'&&btns[idx+1]){btns[idx+1].focus();e.preventDefault();}
        else if(e.key==='ArrowLeft'&&btns[idx-1]){btns[idx-1].focus();e.preventDefault();}
        else if(e.key==='ArrowDown'){
          const first=visibleItems()[0];
          if(first)focusChannelItem(first);
          e.preventDefault();
        }
      }

      const keyTarget=e.target&&e.target.nodeType===1?e.target:focused;
      const isTypingTarget=!!(keyTarget&&(
        keyTarget.matches('input,textarea,select,[contenteditable]:not([contenteditable="false"])')||
        keyTarget.closest('[contenteditable]:not([contenteditable="false"])')
      ));

      if(/^[1-9]$/.test(e.key)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!isTypingTarget){
        const list=visibleItems();
        const idx=parseInt(e.key,10)-1;
        if(list[idx]){
          clickChannelItem(list[idx]);
          e.preventDefault();
        }
      }
    });
  }

  initThemeToggle();
  syncMobileChannelLayout();
  syncFavoritesUi();
  filterChannels();
  updateSearchPlaceholderMode();
  updateChatContext();
  setupLazyLogos();
  if(!isMobileChannelLayout())queueScrollActiveChannelSecond([90,260,620]);
  window.addEventListener('load',function(){if(!isMobileChannelLayout())queueScrollActiveChannelSecond([80,240]);},{once:true});
  window.addEventListener('pageshow',function(){syncMobileChannelLayout();if(!isMobileChannelLayout())queueScrollActiveChannelSecond([80,240]);});
  window.addEventListener('resize',function(){syncMobileChannelLayout();if(!isMobileChannelLayout())setMobileEpgOpen(false);updateSearchPlaceholderMode();if(!isMobileChannelLayout())queueScrollActiveChannelSecond([120]);});
  window.addEventListener('orientationchange',function(){syncMobileChannelLayout();if(!isMobileChannelLayout())setMobileEpgOpen(false);updateSearchPlaceholderMode();if(!isMobileChannelLayout())queueScrollActiveChannelSecond([180,480]);});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',function(){updateSearchPlaceholderMode();},{passive:true});
  }
  if('ResizeObserver' in window){
    const playerWrap=document.querySelector('.player-wrap');
    if(playerWrap){
      let resizeCenterRuns=0;
      const activeChannelResizeObserver=new ResizeObserver(function(){
        if(isMobileChannelLayout()||activeChannelAutoScrollCancelled||resizeCenterRuns>2)return;
        resizeCenterRuns++;
        queueScrollActiveChannelSecond([80]);
      });
      activeChannelResizeObserver.observe(playerWrap);
    }
  }
  refreshEpgProgress();
  syncEpgForViewerTimeZone(document,true);
  window.setInterval(function(){refreshEpgProgress();syncEpgTimes(document);},60000);
  setupHomeCategorySlider();
  setupRemoteControl();
})();
