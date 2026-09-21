<?php
// 1. Captura o canal enviado pelo parâmetro '?ch=' na URL
$canal_solicitado = isset($_GET['ch']) ? trim($_GET['ch']) : '';

// 2. Banco de dados simulado (Matriz de canais e seus respectivos links m3u8)
// Substitua o link da TV Brasil pela URL oficial ou de sua preferência.
$canais = [
    'tv-brasil' => 'https://tvbrasil-stream.ebc.com.br/index.m3u8',
    'rede-super' => 'https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8'
];

// 3. Verifica se o canal solicitado existe na lista
if (array_key_exists($canal_solicitado, $canais)) {
    $stream_url = $canais[$canal_solicitado];
    $nome_canal = ucwords(str_replace('-', ' ', $canal_solicitado));
} else {
    // Canal padrão ou erro se não for encontrado
    $stream_url = 'https://cdn-tiva-video03-logicahost-com-br.smartbit.co/cariocainternacional1/cariocainternacional1/playlist.m3u8'; 
    $nome_canal = "Canal Padrão";
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player HLS - <?php echo htmlspecialchars($nome_canal); ?></title>
    
    <!-- Importação da biblioteca HLS.js via CDN para compatibilidade com navegadores modernos -->
    <script src="https://jsdelivr.net"></script>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #111;
            color: #fff;
            text-align: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        video {
            width: 100%;
            max-height: 450px;
            background-color: #000;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .erro {
            color: #ff4d4d;
            padding: 20px;
            border: 1px dashed #ff4d4d;
            border-radius: 5px;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Assistindo: <?php echo htmlspecialchars($nome_canal); ?></h1>

    <?php if (empty($stream_url)): ?>
        <div class="erro">
            <p>O canal solicitado não está disponível ou é inválido.</p>
            <p>Uso correto: <code>hls-player.php?ch=tv-brasil</code></p>
        </div>
    <?php else: ?>
        <!-- Elemento nativo de vídeo do HTML5 -->
        <video id="video" controls autoplay muted playsinline></video>

        <script>
            document.addEventListener("DOMContentLoaded", function() {
                var video = document.getElementById('video');
                var videoSrc = '<?php echo $stream_url; ?>';

                // Cenário A: O navegador não suporta HLS nativamente, mas suporta a biblioteca HLS.js (Ex: Chrome, Firefox, Edge)
                if (Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        video.play();
                    });
                }
                // Cenário B: O navegador possui suporte nativo a HLS (Ex: Safari no Mac/iOS ou a maioria dos navegadores Android)
                else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc;
                    video.addEventListener('loadedmetadata', function() {
                        video.play();
                    });
                } else {
                    alert('Seu navegador não suporta a reprodução deste formato de vídeo (HLS).');
                }
            });
        </script>
    <?php endif; ?>
</div>

</body>
</html>
