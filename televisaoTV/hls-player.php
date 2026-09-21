<?php
// 1. Defina um array com os links de transmissão (m3u8) dos seus canais
$canais = ['tv-brasil'='https://video05.logicahost.com.br/guiatvpombal/guiatvpombal/playlist.m3u8',
'outra-tv'='https://canalgov-stream.ebc.com.br/index.m3u8'
];

// 2. Captura o canal via parâmetro GET da URL (?ch=...)
$canal_solicitado = isset($_GET['ch']) ? trim($_GET['ch']) : '';

// 3. Verifica se o canal existe no seu mapeamento. Se não existir, define um padrão.
if (array_key_exists($canal_solicitado, $canais)) {
    $video_url = $canais[$canal_solicitado];
    $nome_canal = ucwords(str_replace('-', ' ', $canal_solicitado));
} else {
    // Canal padrão caso a URL esteja vazia ou incorreta
    $video_url = $canais['tv-brasil'];
    $nome_canal = "TV Brasil";
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player HLS - <?php echo htmlspecialchars($nome_canal); ?></title>
    
    <!-- Importa o Player de Vídeo e o CSS (Usando Video.js como base elegante) -->
    <link href="https://zencdn.net" rel="stylesheet" />
    <style>
        body { background-color: #111; color: #fff; font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 20px; }
        .player-container { max-width: 800px; margin: 20px auto; box-shadow: 0px 4px 15px rgba(0,0,0,0.5); }
        h1 { font-size: 24px; color: #f0f0f0; }
    </style>
</head>
<body>

    <h1>Assistindo: <?php echo htmlspecialchars($nome_canal); ?></h1>

    <div class="player-container">
        <!-- Elemento de vídeo HTML5 configurado para o Video.js -->
        <video 
            id="hls-player" 
            class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered" 
            controls 
            preload="auto" 
            autoplay 
            muted>
            <source src="<?php echo htmlspecialchars($video_url); ?>" type="application/x-mpegURL">
            <p class="vjs-no-js">
                Para assistir a este vídeo, por favor ative o JavaScript ou atualize seu navegador.
            </p>
        </video>
    </div>

    <!-- Scripts necessários para o player funcionar em qualquer navegador -->
    <script src="https://zencdn.net"></script>
    <script>
        // Inicializa o player automaticamente
        var player = videojs('hls-player');
    </script>
</body>
</html>
