import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/dashboard/', '/api/'],
            }
        ],
        sitemap: 'https://your-domain.com/sitemap.xml',
    };
}
