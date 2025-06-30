-- Verificar estrutura da tabela agent
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'agent' 
ORDER BY ordinal_position;

-- Verificar se há dados na tabela
SELECT 
    COUNT(*) as total_agents,
    COUNT(image_url) as agents_with_image,
    COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) as agents_with_valid_image
FROM agent;

-- Verificar alguns registros de exemplo
SELECT 
    id,
    name,
    type,
    status,
    CASE 
        WHEN image_url IS NULL THEN 'NULL'
        WHEN image_url = '' THEN 'EMPTY'
        WHEN image_url LIKE 'data:%' THEN 'BASE64'
        WHEN image_url LIKE '/assets/%' THEN 'ASSET_PATH'
        WHEN image_url LIKE 'http%' THEN 'URL'
        ELSE 'OTHER'
    END as image_type,
    LENGTH(image_url) as image_url_length,
    created_date
FROM agent 
ORDER BY created_date DESC 
LIMIT 10;