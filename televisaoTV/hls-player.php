<?php
// 1. Captura o ID ou nome do canal via URL (ex: ?ch=telecine)
$canal = isset($_GET['ch']) ? $_GET['ch'] : '';

// 2. Banco de dados simples (Array) com as URLs dos fluxos M3U8
$canais = [
    'globo' => 'http://canalgov-stream.ebc.com.br/index.m3u8',
    'sbt'   => 'http://video05.logicahost.com.br/guiatvpombal/guiatvpombal/playlist.m3u8',
    'sportv'=> 'https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8'
];

// 3. Verifica se o canal existe no array, se não, define um vídeo padrão ou erro
if (array_key_exists($canal, $canais)) {
    $video_url = $canais[$canal];
} else {
    // URL de teste padrão caso o canal não seja encontrado
    $video_url = 'https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8'; 
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HLS Player Dinâmico</title>
    
    <!-- Importa a biblioteca Hls.js para compatibilidade com navegadores que não suportam HLS nativo (como Chrome/PC) -->
    <script src="https://jsdelivr.net"></script>
    
    <style>
        body {
            margin: 0;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        video {
            width: 100%;
            max-width: 800px;
            border: 2px solid #333;
        }
    </style>
</head>
<body>

    <!-- Elemento de vídeo HTML5 padrão -->
    <video id="video" controls autoplay playsinline></video>

    <script>
        // Passa a URL gerada pelo PHP diretamente para o JavaScript
        const videoSrc = "<?php echo $video_url; ?>";
        const video = document.getElementById('video');

        // Verifica se o navegador suporta Hls.js
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        }
        // Caso o navegador já tenha suporte nativo a HLS (como o Safari no iOS/Mac)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }
    </script>

</body>
</html>

