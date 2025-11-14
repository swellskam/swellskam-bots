export default async function handler(req, res) {
  // Настраиваем CORS-заголовки для кросс-доменных запросов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обрабатываем предварительный CORS-запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Разрешаем только GET-запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // 1. Получаем токен из переменных окружения Vercel
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token is not configured in environment variables.');
    }

    // 2. Формируем URL для запроса к GitHub API
    const assetUrl = 'https://api.github.com/repos/swellskam/swellskam-bots/releases/assets/316416159';

    // 3. Выполняем запрос к GitHub API с токеном и специальным заголовком
    const response = await fetch(assetUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Vercel-Server',
        'Accept': 'application/octet-stream' // Этот заголовок важен для скачивания бинарных файлов
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    // 4. Получаем данные о файле
    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // 5. Отправляем файл пользователю
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="Hybrid.Bot.Limbo.dll"');
    res.send(Buffer.from(fileBuffer));

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Download failed: ' + error.message 
    });
  }
}
