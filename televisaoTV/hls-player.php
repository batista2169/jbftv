
<?php
// Obtém a URL do canal via parâmetro 'ch' e sanitiza a entrada
$stream_url = isset($_GET['ch']) ? filter_var($_GET['ch'], FILTER_VALIDATE_URL) : '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HLS Player</title>
    
    <!-- Video.js CSS -->
    <link href="https://zencdn.net" rel="stylesheet" />
    
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
        .video-container {
            width: 100%;
            height: 100%;
            max-width: 100vw;
            max-height: 100vh;
        }
        .video-js {
            width: 100% !important;
            height: 100% !important;
        }
        .error-message {
            color: #fff;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>

    <div class="video-container">
        <?php if ($stream_url): ?>
            <!-- Player de Vídeo -->
            <video 
                id="my-video" 
                class="video-js vjs-default-skin vjs-big-play-centered" 
                controls 
                preload="auto" 
                autoplay 
                muted
                data-setup="{}">
                <source src="<?php echo htmlspecialchars($stream_url, ENT_QUOTES, 'UTF-8'); ?>" type="application/x-mpegURL">
                <p class="vjs-no-js">
                    Para assistir a este vídeo, ative o JavaScript ou atualize para um navegador que 
                    <a href="https://videojs.com" target="_blank">suporte vídeo HTML5</a>.
                </p>
            </video>
        <?php else: ?>
            <!-- Mensagem caso o parâmetro ch esteja vazio ou inválido -->
            <div class="error-message">
                <h2>Erro: Nenhuma transmissão válida foi fornecida.</h2>
                <p>Use o formato: <code>hls-player.php?ch=https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8</code></p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Video.js JS -->
    <script src="https://zencdn.net"></script>

</body>
</html>
