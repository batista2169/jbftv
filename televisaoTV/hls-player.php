<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HLS Video Player</title>
    <!-- Incluindo a biblioteca HLS.js via CDN -->
    <script src="https://jsdelivr.net"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #111;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            width: 80%;
            max-width: 800px;
            text-align: center;
        }
        video {
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            background-color: #000;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Meu Player HLS</h2>
    
    <?php
    // Defina a URL do seu fluxo .m3u8 aqui (pode vir de um banco de dados ou parâmetro)
    $videoUrl = "https://canalgov-stream.ebc.com.br/index.m3u8"; 
    ?>

    <!-- Elemento de vídeo HTML5 padrão -->
    <video id="video" controls autoplay muted></video>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var video = document.getElementById('video');
        // Passando a variável PHP para o JavaScript
        var videoSrc = '<?php echo $videoUrl; ?>';

        // 1. Verifica se o navegador suporta HLS.js nativamente através da biblioteca
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        }
        // 2. Caso seja um navegador que já suporta HLS nativamente (como o Safari)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        } else {
            alert("Seu navegador não suporta a reprodução de vídeos HLS.");
        }
    });
</script>

</body>
</html>