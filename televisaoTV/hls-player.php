
<?php
// Captura o canal enviado via ?ch= e limpa o texto por segurança
$canal = isset($_GET['ch']) ? htmlspecialchars($_GET['ch']) : '';

// Define a URL padrão baseada no canal (Altere com o seu domínio ou lógica de caminhos)
$stream_url = "https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8";
if (!empty($canal)) {
    // Exemplo 1: Se o 'ch' for o link completo (ex: ?ch=https://site.com)
    if (filter_var($canal, FILTER_VALIDATE_URL)) {
        $stream_url = $canal;
    } 
    // Exemplo 2: Se o 'ch' for apenas o nome do canal (ex: ?ch=globo)
    else {
        $stream_url = "https://seu-servidor-de-stream.com{$canal}/index.m3u8";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HLS Player - <?php echo $canal; ?></title>
    
    <!-- Estilos do Video.js -->
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
    </style>
</head>
<body>

    <div class="video-container">
        <?php if (!empty($stream_url)): ?>
            <video 
                id="hls-player" 
                class="video-js vjs-default-skin vjs-big-play-centered" 
                controls 
                preload="auto" 
                autoplay 
                muted
                data-setup='{}'>
                <source src="<?php echo $stream_url; ?>" type="application/x-mpegURL">
                <p class="vjs-no-js">
                    Para assistir a este vídeo, ative o JavaScript ou atualize para um navegador que 
                    <a href="https://videojs.com" target="_blank">suporte vídeo HTML5</a>.
                </p>
            </video>
        <?php else: ?>
            <div style="color: white; font-family: sans-serif; text-align: center;">
                <h2>Nenhum canal foi informado ou link inválido.</h2>
                <p>Use: <code>hls-player.php?ch=globo</code> ou o link completo do .m3u8</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Scripts do Video.js -->
    <script src="https://zencdn.net"></script>
    <script>
        // Inicializa o player e força o autoplay se permitido pelo navegador
        var player = videojs('hls-player');
        player.ready(function() {
            player.play();
        });
    </script>
</body>
</html>

