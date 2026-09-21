<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#05050a">
<title>TV Brasil AO VIVO</title>
<link rel="preload" href="https://televisao.tv/css/hls-player.css?v=1786126457" as="style">
<link rel="preload" href="https://televisao.tv/js/hls.min.js?v=1779612796" as="script">
<link rel="stylesheet" href="https://televisao.tv/css/hls-player.css?v=1786126457">
</head>
<body>
<div class="player loading" id="player">
<svg class="video-filters" aria-hidden="true" focusable="false">
    <filter id="sharpness-filter" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feConvolveMatrix id="sharpnessKernel" order="3" preserveAlpha="true" edgeMode="duplicate" kernelMatrix="0 0 0 0 1 0 0 0 0"></feConvolveMatrix>
    </filter>
</svg>
    <video id="video" playsinline autoplay preload="metadata" crossorigin="anonymous"></video>
    <div class="loader" aria-hidden="true"></div>

    <div class="top-title">
        <div class="video-title">TV Brasil AO VIVO</div>
        <div class="channel-name">TV Brasil</div>
    </div>

    <div class="top-actions">
        <div class="volume-wrap" id="volumeWrap">
            <button class="icon-btn" id="muteBtn" aria-label="Som" aria-pressed="false">
                <svg id="volumeIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 9v6h4l5 4V5L8 9H4z"></path><path d="M16 9.5c.8.7 1.2 1.5 1.2 2.5s-.4 1.8-1.2 2.5"></path><path d="M18.5 7c1.5 1.3 2.4 3 2.4 5s-.9 3.7-2.4 5"></path>
                </svg>
            </button>
            <div class="volume-panel" id="volumePanel"><input id="volumeRange" class="volume-range" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume"></div>
        </div>
        <button class="icon-btn settings-btn" id="settingsBtn" aria-label="Configurações" aria-expanded="false" aria-haspopup="menu">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 0 1-2.97 2.97l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 0 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.66-1.1H2.1a2.1 2.1 0 0 1 0-4.2h.06A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.1 2.1 0 0 1 2.97-2.97l.04.04A1.8 1.8 0 0 0 8.4 4a1.8 1.8 0 0 0 1.1-1.66V2.1a2.1 2.1 0 0 1 4.2 0v.06A1.8 1.8 0 0 0 14.8 4a1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 0 1 2.97 2.97l-.04.04a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.66 1.1h.06a2.1 2.1 0 0 1 0 4.2h-.06A1.8 1.8 0 0 0 19.4 15z"></path></svg>
        </button>
    </div>

    <button class="big-play" id="bigPlay" aria-label="Reproduzir"><svg id="bigPlayIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.7 6.2l8.5 5.8-8.5 5.8V6.2z"></path></svg></button>

    <button class="icon-btn fullscreen-main" id="fullscreenBtn" aria-label="Tela cheia"><svg id="fullscreenIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5"></path><path d="M20 9V4h-5"></path><path d="M4 15v5h5"></path><path d="M20 15v5h-5"></path></svg></button>

    <div class="bottom-ui">
        <div class="timeline" aria-hidden="true">
            <div class="timeline-track">
                <div class="timeline-buffered" id="timelineBuffered"></div>
                <div class="timeline-progress" id="timelineProgress"></div>
            </div>
        </div>
        <div class="live-label" aria-hidden="true">Ao vivo</div>
        <div class="bottom-actions">
            <button class="icon-btn" id="shotBtn" aria-label="Salvar quadro">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="6" width="18" height="13" rx="2"></rect>
                    <path d="M8 6l1.5-2h5L16 6"></path>
                    <circle cx="12" cy="12.5" r="3"></circle>
                    <rect x="6" y="8" width="3" height="2" rx="1"></rect>
                </svg>
            </button>
            <button class="icon-btn" id="pipBtn" aria-label="Picture-in-Picture"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><rect x="13" y="12" width="6" height="4" rx="1"></rect></svg></button>
            <button class="icon-btn" id="refreshBtn" aria-label="Atualizar transmissão"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path></svg></button>
        </div>
    </div>

    <div class="settings-menu" id="settingsMenu" role="menu" aria-label="Configurações do player">
        <div class="settings-title">Configurações</div>
        <div class="settings-section">
            <div class="settings-label">Qualidade do vídeo</div>
            <div id="qualityList"><button class="setting active" role="menuitemradio" aria-checked="true" data-quality="-1"><span>Automático</span><span class="setting-note">melhor disponível</span></button></div>
        </div>
        <div class="settings-section image-settings">
            <div class="settings-label">Imagem</div>
            <label class="slider-setting">
                <span class="slider-setting-top"><span>Brilho</span><span class="slider-setting-value" id="brightnessValue">100%</span></span>
                <input id="brightnessRange" type="range" min="50" max="150" step="1" value="100" aria-label="Brilho">
            </label>
            <label class="slider-setting">
                <span class="slider-setting-top"><span>Contraste</span><span class="slider-setting-value" id="contrastValue">100%</span></span>
                <input id="contrastRange" type="range" min="50" max="180" step="1" value="100" aria-label="Contraste">
            </label>
            <label class="slider-setting">
                <span class="slider-setting-top"><span>Saturação</span><span class="slider-setting-value" id="saturationValue">100%</span></span>
                <input id="saturationRange" type="range" min="0" max="200" step="1" value="100" aria-label="Saturação">
            </label>
            <label class="slider-setting">
                <span class="slider-setting-top"><span>Matiz</span><span class="slider-setting-value" id="hueValue">0°</span></span>
                <input id="hueRange" type="range" min="-45" max="45" step="1" value="0" aria-label="Matiz">
            </label>
            <label class="slider-setting" id="sharpnessRow">
                <span class="slider-setting-top"><span>Nitidez</span><span class="slider-setting-value" id="sharpnessValue">0%</span></span>
                <input id="sharpnessRange" type="range" min="0" max="100" step="1" value="0" aria-label="Nitidez">
            </label>
            <button class="setting reset-setting" id="resetImageBtn" role="menuitem"><span>Redefinir imagem</span></button>
        </div>
    </div>

    <div class="error-box" id="errorBox" role="alert"></div>
</div>

<script>
window.HLS_PLAYER_CONFIG = {"streamUrl":"https://tvbrasil-stream.ebc.com.br/index.m3u8","channelSlug":"tv-brasil","imageSettingsKey":"hls-image-settings-tv-brasil-v1","screenshotPrefix":"tv-brasil-"};
</script>
<script src="https://televisao.tv/js/hls.min.js?v=1779612796"></script>
<script src="https://televisao.tv/js/hls-player.js?v=1786126457"></script>
<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/v31edd6df95cf4e85bb4c19e7a9bdbcba1788362987495" integrity="sha512-iIg7k2xntmwu6/uSb5tpc/hySgZc4eoL31yB29W6tJFo2akwjPWcEqnCEdJvGexCL0KEQwVYv5BlowfhVz26hg==" data-cf-beacon='{"version":"2024.11.0","token":"884b4e758e054baa9f650307215f5236","r":1,"spa":2}' crossorigin="anonymous"></script>
</body>
</html>
