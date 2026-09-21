
<?php
// Desative a exibição de erros diretamente na tela em produção por segurança
ini_set('display_errors', 0);

// Captura o valor do parâmetro 'ch' via GET
$stream_url = isset($_GET['ch']) ? trim($_GET['ch']) : '';

// Validação básica: verifica se a URL é válida e se termina com .m3u8 ou mp4
// Se você for usar apenas canais pré-definidos (ID), mude a lógica abaixo.
$is_valid_url = filter_var($stream_url, FILTER_VALIDATE_URL) && 
                 (strpos($stream_url, '.m3u8') !== false || strpos($stream_url, '.mp4') !== false);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HLS Player PHP</title>
    
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
    <?php if ($is_valid_url): ?>
        <!-- Player de Vídeo -->
        <video 
            id="hls-player" 
            class="video-js vjs-default-skin vjs-big-play-centered" 
            controls 
            preload="auto" 
            autoplay 
            muted
            data-setup='{}'>
            <source src="<?php echo htmlspecialchars($stream_url, ENT_QUOTES, 'UTF-8'); ?>" type="application/x-mpegURL">
            <p class="vjs-no-js">
                Para assistir a este vídeo, por favor, habilite o JavaScript ou mude para um navegador que 
                <a href="https://videojs.com" target="_blank">suporte vídeo em HTML5</a>.
            </p>
        </video>
    <?php else: ?>
        <!-- Mensagem de Erro ou Tela Inicial -->
        <div class="error-message">
            <h2>Nenhum canal ou stream válido foi encontrado.</h2>
            <p>Use o formato: <code>hls-player.php?ch=https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8</code></p>
        </div>
    <?php endif; ?>
</div>

<!-- Video.js JS -->
<script src="https://zencdn.net"></script>

<script>
    // Configuração opcional para garantir que o autoplay funcione mesmo se o navegador bloquear áudio inicial
    var player = videojs('hls-player', {
        responsive: true,
        fluid: true
    });
</script>

</body>
</html>
