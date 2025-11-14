export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    // ПРАВИЛЬНАЯ ссылка
    const assetUrl = 'https://api.github.com/repos/swellskam/swellskam-bots/releases/assets/316416159';

    // Скачиваем файл с GitHub
    const response = await fetch(assetUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Vercel-Server',
        'Accept': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    // Получаем файл и отправляем пользователю
    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="Hybrid.Bot.Limbo.dll"');
    res.setHeader('Content-Length', fileBuffer.byteLength);

    // Отправляем файл
    res.send(Buffer.from(fileBuffer));

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Download failed: ' + error.message 
    });
  }
}
