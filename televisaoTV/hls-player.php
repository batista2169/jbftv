<?php
// hls-player.php

// 1. Simulação de lógica do lado do servidor (PHP)
// Aqui você pode buscar a URL de um banco de dados ou via parâmetro GET de forma segura
$video_url = isset($_GET['stream']) ? $_GET['stream'] : '';

// URL de teste padrão caso nenhuma seja passada (Vídeo de amostra pública da Apple)
if (empty($video_url)) {
    $video_url = "https://video05.logicahost.com.br/guiatvpombal/guiatvpombal/playlist.m3u8";
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player HLS Nativo & HLS.js</title>
    
    <!-- Estilização simples para o Player -->
    <style>
        body {
            background-color: #111;
            color: #fff;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .player-container {
            width: 100%;
            max-width: 800px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            background: #000;
        }
        video {
            width: 100%;
            display: block;
        }
    </style>

    <!-- 2. Importação da Biblioteca HLS.js via CDN (Essencial para navegadores como Chrome/Firefox) -->
    <script src="https://jsdelivr.net"></script>
</head>
<body>

    <div class="player-container">
        <!-- Tag de vídeo padrão do HTML5 com controles habilitados -->
        <video id="video" controls autoplay muted playsinline></video>
    </div>

    <script>
        // 3. Passando a variável do PHP com segurança para o JavaScript
        const videoSrc = "<?php echo htmlspecialchars($video_url, ENT_QUOTES, 'UTF-8'); ?>";
        const video = document.getElementById('video');

        // 4. Verificação de compatibilidade
        if (Hls.isSupported()) {
            // Para navegadores modernos (Chrome, Firefox, Edge) que não suportam HLS nativamente
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                console.log("Manifesto HLS carregado com sucesso!");
            });
        } 
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Suporte nativo (Safari no macOS/iOS e alguns navegadores Android)
            video.src = videoSrc;
        } 
        else {
            alert('Este navegador não possui suporte para reprodução de streaming HLS (.m3u8).');
        }
    </script>

</body>
</html>
