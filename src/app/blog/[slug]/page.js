import Link from "next/link";
import { blogPosts as fallbackPosts, getBlogPost as getFallbackPost } from "@/dados/blogData";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { RADAR_SLUG_PATTERN, RADAR_SLUG_PREFIX } from "@/lib/radarPosts";

export async function generateStaticParams() {
  // Try to fetch from DB for static generation
  try {
    const { data } = await supabase.from('blog_posts').select('slug').not("slug", "like", RADAR_SLUG_PATTERN);
    if (data && data.length > 0) {
      return data.map((post) => ({ slug: post.slug }));
    }
  } catch (e) {
    console.error(e);
  }
  return fallbackPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug.startsWith(RADAR_SLUG_PREFIX)) return {};
  let post = null;
  
  try {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (data) {
      post = {
        title: data.seo_title || `${data.title} | LexAero`,
        description: data.seo_description || data.summary
      };
    }
  } catch (e) {
    console.error(e);
  }
  
  if (!post) {
    const fbPost = getFallbackPost(slug);
    if (!fbPost) return {};
    post = {
      title: fbPost.seo.title,
      description: fbPost.seo.description
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  if (slug.startsWith(RADAR_SLUG_PREFIX)) notFound();
  let post = null;
  let related = [];
  
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (data) {
      post = {
        slug: data.slug,
        title: data.title,
        category: data.category,
        date: new Date(data.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: data.read_time,
        summary: data.summary,
        coverImage: data.cover_image,
        content: data.content
      };
      
      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('*')
        .neq('slug', slug)
        .not("slug", "like", RADAR_SLUG_PATTERN)
        .limit(2);
        
      if (relatedData) {
        related = relatedData.map(p => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          readTime: p.read_time
        }));
      }
    }
  } catch (err) {
    console.error("Error fetching single post from Supabase", err);
  }

  if (!post) {
    post = getFallbackPost(slug);
    if (!post) return notFound();
    related = fallbackPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  }

  return (
    <div className="blog-post-page">
      {/* ── HERO DO ARTIGO ── */}
      <section className="blog-post-hero" style={{ 
        position: "relative", 
        overflow: "hidden", 
        textAlign: "left",
        backgroundImage: `linear-gradient(rgba(17,17,17,0.85), rgba(17,17,17,0.95)), url('${post.coverImage || '/wing_sunset_bg.jpg'}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Imagem de avião no fundo */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", opacity: 0.3, backgroundImage: "url('/aviao_animation.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "right center", zIndex: 0 }}></div>
        <div className="container" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Link href="/blog" className="blog-back-link" style={{ display: "inline-flex", color: "var(--lex-gold)", marginBottom: "1rem", fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ marginRight: "6px" }}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar ao Blog
          </Link>
          <span className="blog-post-hero__category" style={{ display: "inline-block", alignSelf: "flex-start", marginBottom: "1rem" }}>{post.category}</span>
          <h1 className="blog-post-hero__title" style={{ textAlign: "left", maxWidth: "800px", margin: "0 0 1rem 0" }}>{post.title}</h1>
          <div className="blog-post-hero__meta" style={{ justifyContent: "flex-start", margin: 0 }}>
            <span>{post.date}</span>
            <span className="blog-card__dot">•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── CONTEÚDO + SIDEBAR ── */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="blog-post-layout">
            {/* Conteúdo principal */}
            <article className="blog-post-content">
              {/<[a-z][\s\S]*>/i.test(post.content) ? (
                <div
                  className="blog-post-body"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="blog-post-body">
                  {post.content.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Navegação entre artigos */}
              <div className="blog-post-nav">
                <hr style={{ borderColor: "var(--lex-border-light)", margin: "2rem 0" }} />
                <p style={{ fontSize: "0.85rem", color: "var(--lex-text-muted)", marginBottom: "1rem" }}>
                  Outros artigos que podem te ajudar:
                </p>
                <div className="blog-post-nav__links">
                  {related.map((rel) => (
                    <Link key={rel.slug} href={`/blog/${rel.slug}`} className="blog-post-nav__item">
                      <span className="blog-post-nav__cat">{rel.category}</span>
                      <span className="blog-post-nav__relTitle">{rel.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="blog-post-sidebar">
              {/* CTA Card */}
              <div className="blog-sidebar-cta">
                <span className="eyebrow" style={{ color: "var(--lex-gold)", fontSize: "0.7rem" }}>
                  ANÁLISE GRATUITA
                </span>
                <h3 className="blog-sidebar-cta__title">
                  Você pode ter direito a indenização
                </h3>
                <p className="blog-sidebar-cta__text">
                  Nossa equipe avalia seu caso em 2 minutos, de forma gratuita e sem compromisso.
                </p>
                <Link href="/diagnostico" className="btn btn--primary" style={{ width: "100%", justifyContent: "center", color: "var(--lex-black)" }}>
                  Analisar meu caso
                </Link>
              </div>

              {/* Outros artigos */}
              <div className="blog-sidebar-posts">
                <h4 className="blog-sidebar-posts__title">Outros artigos</h4>
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="blog-sidebar-post-item">
                    <span className="blog-sidebar-post-item__cat">{rel.category}</span>
                    <span className="blog-sidebar-post-item__title">{rel.title}</span>
                    <span className="blog-sidebar-post-item__time">{rel.readTime}</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="section" style={{ 
        background: "linear-gradient(rgba(17, 17, 17, 0.9), rgba(17, 17, 17, 0.95)), url('/wing_sunset_bg.jpg') center/cover" 
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--lex-gold)" }}>PRÓXIMO PASSO</span>
          <h2 style={{ color: "var(--lex-white)", marginTop: "0.5rem", marginBottom: "1rem", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            Passou por isso? Descubra se você tem direito a indenização.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            Nossa análise é gratuita, leva 2 minutos e não exige nenhum compromisso da sua parte.
          </p>
          <Link href="/diagnostico" className="btn btn--primary btn--lg" style={{ color: "var(--lex-black)" }}>
            Fazer análise gratuita
            <span className="btn__icon-circle" aria-hidden="true">
              <img src="/aviao.svg" width="20" height="20" alt="" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
