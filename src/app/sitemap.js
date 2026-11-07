import { supabase } from "@/lib/supabaseClient";
import { RADAR_SLUG_PATTERN } from "@/lib/radarPosts";

export default async function sitemap() {
  const baseUrl = 'https://www.lexaero.com.br';
  
  const staticRoutes = [
    '',
    '/voo-atrasado',
    '/voo-cancelado',
    '/overbooking',
    '/bagagem',
    '/conexao-perdida',
    '/assistencia-material',
    '/outros-problemas',
    '/reembolso',
    '/diagnostico',
    '/kareline-staut',
    '/sobre-a-lexaero',
    '/radar-juridico',
    '/blog',
    '/lgpd'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  let dynamicRoutes = [];
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .not("slug", "like", RADAR_SLUG_PATTERN);
    
    if (!error && data) {
      dynamicRoutes = data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Error fetching blog posts for sitemap:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
