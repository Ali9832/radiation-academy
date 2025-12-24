"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '../../lib/fetchAPI';

// --- اینترفیس‌ها ---
interface Course {
  slug: string;
  title: string;
  date: string;
  featuredImage?: { node: { sourceUrl: string } };
  coursefields?: { price?: string; duration?: string; };
  courseCategories?: { nodes: { name: string }[] };
}

interface ParticleType {
  x: number; y: number; directionX: number; directionY: number; size: number; color: string;
  draw: () => void; update: () => void;
}

// --- کامپوننت کارت دوره (با استایل شیشه‌ای) ---
const CourseCard = ({ course }: { course: Course }) => (
    <div className="course-card" style={{
      minWidth: '290px',
      margin: '0 15px',
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{position:'absolute', top:'10px', right:'10px', zIndex:10}}>
        <span className="course-badge" style={{background:'rgba(0, 212, 255, 0.9)', color:'#000', padding:'4px 10px', borderRadius:'6px', fontSize:'0.75rem', fontWeight:'800', boxShadow:'0 0 10px rgba(0,212,255,0.4)'}}>
            {course.courseCategories?.nodes[0]?.name || 'تخصصی'}
        </span>
      </div>

      <div className="course-image" style={{height:'170px', overflow:'hidden', background:'#0f172a', position:'relative'}}>
        {course.featuredImage ? (
            <img src={course.featuredImage.node.sourceUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', color:'#334155'}}>☢</div>
        )}
        <div style={{position:'absolute', bottom:0, left:0, width:'100%', height:'50%', background:'linear-gradient(to top, rgba(30,41,59,1), transparent)'}}></div>
      </div>

      <div style={{padding:'15px'}}>
        <h3 className="course-title" style={{ fontSize: '1.1rem', marginBottom:'10px', height:'55px', overflow:'hidden', lineHeight:'1.5', fontWeight:'bold' }}>{course.title}</h3>
        <div className="course-info" style={{display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', marginBottom:'15px'}}>
          <span style={{display:'flex', alignItems:'center', gap:'5px'}}>⏱ {course.coursefields?.duration || '۲۰ ساعت'}</span>
          <span style={{display:'flex', alignItems:'center', gap:'5px'}}>👥 ظرفیت محدود</span>
        </div>
        <div className="course-footer" style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'12px'}}>
          <span className="price" style={{ fontSize: '1rem', color:'#4ade80', fontWeight:'bold', textShadow:'0 0 10px rgba(74, 222, 128, 0.3)' }}>{course.coursefields?.price || 'تماس بگیرید'}</span>
          <Link href={`/courses/${course.slug}`} style={{color:'#38bdf8', textDecoration:'none', fontSize:'0.9rem', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
            مشاهده <span style={{fontSize:'1.2rem'}}>←</span>
          </Link>
        </div>
      </div>
    </div>
);

// --- کامپوننت اسلایدر دسته‌بندی ---
const CategorySection = ({ title, courses, icon }: { title: string, courses: Course[], icon: string }) => {
  if (!courses || courses.length === 0) return null;
  return (
      <section style={{ marginBottom: '80px', padding: '0 5%', position:'relative', zIndex:5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{
            width:'55px', height:'55px',
            background:'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
            borderRadius:'12px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: '2rem',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>{icon}</div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f1f5f9', margin: 0, letterSpacing:'-0.5px' }}>{title}</h2>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.5), transparent)', marginRight: '20px', borderRadius:'2px' }}></div>
        </div>

        <div style={{
          display: 'flex',
          overflowX: 'auto',
          paddingBottom: '40px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(56, 189, 248, 0.3) transparent'
        }}>
          {courses.map(course => (
              <div key={course.slug} style={{ scrollSnapAlign: 'center' }}>
                <CourseCard course={course} />
              </div>
          ))}
        </div>
      </section>
  );
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [data, setData] = useState<{
    latest: Course[],
    nuclear: Course[],
    chemical: Course[],
    biological: Course[],
    radiation: Course[]
  }>({ latest: [], nuclear: [], chemical: [], biological: [], radiation: [] });

  const [loading, setLoading] = useState(true);

  // --- دریافت داده‌ها ---
  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetchAPI(`
          query GetHomePageData {
            latest: courses(first: 4, where: { orderby: { field: DATE, order: DESC } }) { nodes { ...CourseFields } }
            nuclearData: courseCategories(where: { slug: ["nuclear"] }) { nodes { courses(first: 6) { nodes { ...CourseFields } } } }
            chemicalData: courseCategories(where: { slug: ["chemical"] }) { nodes { courses(first: 6) { nodes { ...CourseFields } } } }
            biologicalData: courseCategories(where: { slug: ["biological"] }) { nodes { courses(first: 6) { nodes { ...CourseFields } } } }
            radiationData: courseCategories(where: { slug: ["radiation"] }) { nodes { courses(first: 6) { nodes { ...CourseFields } } } }
          }
          fragment CourseFields on Course {
            slug
            title
            date
            featuredImage { node { sourceUrl } }
            coursefields { price duration }
            courseCategories { nodes { name } }
          }
        `);

        if (response) {
          setData({
            latest: response.latest?.nodes || [],
            nuclear: response.nuclearData?.nodes[0]?.courses?.nodes || [],
            chemical: response.chemicalData?.nodes[0]?.courses?.nodes || [],
            biological: response.biologicalData?.nodes[0]?.courses?.nodes || [],
            radiation: response.radiationData?.nodes[0]?.courses?.nodes || [],
          });
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  // --- انیمیشن‌ها ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray: ParticleType[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: (canvas.height / 150) * (canvas.width / 150) };

    window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });

    class Particle implements ParticleType {
      x: number; y: number; directionX: number; directionY: number; size: number; color: string;
      constructor(x: number, y: number, dx: number, dy: number, size: number, color: string) {
        this.x = x; this.y = y; this.directionX = dx; this.directionY = dy; this.size = size; this.color = color;
      }
      draw() { if(ctx) { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = '#00D4FF'; ctx.fill(); } }
      update() {
        if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x; const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas!.width - this.size * 10) this.x += 10;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
            if (mouse.y < this.y && this.y < canvas!.height - this.size * 10) this.y += 10;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
          }
        }
        this.x += this.directionX; this.y += this.directionY; this.draw();
      }
    }
    function init() {
      particlesArray = [];
      const numberOfParticles = (canvas!.height * canvas!.width) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        const dx = (Math.random() * 0.5) - 0.25;
        const dy = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, dx, dy, size, '#00D4FF'));
      }
    }
    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (!ctx || !canvas) return;
      ctx.clearRect(0,0,innerWidth, innerHeight);
      for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
      connect();
    }
    function connect() {
      if (!ctx) return;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
          if (distance < (canvas!.width/7) * (canvas!.height/7)) {
            const opacityValue = 1 - (distance/20000);
            ctx.strokeStyle = 'rgba(0, 212, 255,' + opacityValue + ')';
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
          }
        }
      }
    }
    const handleResize = () => { if (!canvas) return; canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = ((canvas.height/150) * (canvas.height/150)); init(); };
    window.addEventListener('resize', handleResize); init(); animate();

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const items = document.querySelectorAll('.timeline-row');
      items.forEach(item => observer.observe(item));
    }, 100);

    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return (
      <main style={{background: '#0B1021', minHeight:'100vh', color:'#fff', fontFamily:'inherit'}}>

        {/* --- Hero Section --- */}
        <section className="hero" style={{position:'relative', zIndex:1}}>
          <div className="hero-content">
            <span className="hero-badge">مرجع تخصصی آموزش‌های پرتوی</span>
            <h1>ایمنی و تخصص در <br/><span>دنیای پرتوها</span></h1>
            <p className="hero-desc">ارائه دهنده پیشرفته‌ترین دوره‌های حفاظت در برابر اشعه، دزیمتری و تصویربرداری پزشکی.</p>
            <div className="hero-btns">
              <Link href="/courses" className="btn-primary">شروع یادگیری</Link>
              <Link href="/portal" className="btn-secondary">پنل کاربری</Link>
            </div>
          </div>
          <div className="atom-container">
            <div className="core"></div>
            <div className="orbit"><div className="electron"></div></div>
            <div className="orbit"><div className="electron"></div></div>
            <div className="orbit"><div className="electron"></div></div>
          </div>
          <canvas ref={canvasRef} id="canvas-container"></canvas>
        </section>

        {/* --- Trust Section --- */}
        <section className="trust-section" style={{position:'relative', zIndex:2, background:'#0B1021'}}>
          <div className="trust-grid">
            <div className="trust-item"><span>✦</span> سازمان انرژی اتمی</div>
            <div className="trust-item"><span>✦</span> انجمن فیزیک پزشکی</div>
            <div className="trust-item"><span>✦</span> بیمارستان رضوی</div>
            <div className="trust-item"><span>✦</span> انجمن رادیولوژی</div>
            <div className="trust-item"><span>✦</span> استاندارد ISO 9001</div>
          </div>
        </section>

        {/* --- 1. جدیدترین دوره‌ها (با بک‌گراند گرادینت آبی نفتی) --- */}
        <section className="courses-section" style={{
          paddingTop:'60px',
          background: 'linear-gradient(180deg, #0B1021 0%, #1e293b 100%)'
        }}>
          <div className="section-header">
            <span className="section-subtitle">به‌روزترین محتوا</span>
            <h2 className="section-title">تازه‌ترین <span style={{ color: 'var(--primary-blue)' }}>دوره‌های منتشر شده</span></h2>
          </div>
          <div className="courses-grid">
            {loading ? ( <div style={{color: 'white', textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>در حال بارگذاری...</div> )
                : data.latest.length > 0 ? (
                    data.latest.map((course) => (
                        <div key={course.slug} className="course-card">
                          <span className="course-badge">جدید</span>
                          <div className="course-image">
                            {course.featuredImage ? <img src={course.featuredImage.node.sourceUrl} alt={course.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span>☢</span>}
                          </div>
                          <h3 className="course-title">{course.title}</h3>
                          <div className="course-footer">
                            <span className="price">{course.coursefields?.price || 'تماس بگیرید'}</span>
                            <Link href={`/courses/${course.slug}`} className="btn-card">مشاهده</Link>
                          </div>
                        </div>
                    ))
                ) : ( <div style={{color: '#aaa', textAlign: 'center'}}>دوره جدیدی نیست.</div> )}
          </div>
        </section>

        {/* --- 2. بخش‌های دسته‌بندی شده --- */}
        <div style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          paddingTop: '60px',
          paddingBottom: '40px',
          position: 'relative',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>

          <CategorySection title="دوره‌های هسته‌ای" courses={data.nuclear} icon="☢️" />
          <CategorySection title="دوره‌های شیمیایی" courses={data.chemical} icon="🧪" />
          <CategorySection title="دوره‌های بیولوژیکی" courses={data.biological} icon="🦠" />
          <CategorySection title="دوره‌های پرتویی" courses={data.radiation} icon="⚡" />
        </div>

        {/* --- 3. نقشه راه موفقیت (با بک‌گراند شبکه‌ای آبی و درخشان) --- */}
        <section className="roadmap-section" style={{
          position: 'relative',
          padding: '100px 0',
          backgroundColor: '#050914',
          // 🔥 اصلاح شده: خطوط آبی نئونی (Cyan) برای شبکه
          backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px'
        }}>
          <div style={{position:'absolute', top:0, left:0, width:'100%', height:'150px', background:'linear-gradient(to bottom, #0f172a, transparent)', pointerEvents:'none'}}></div>

          <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem', position:'relative', zIndex:2 }}>
            <h2 className="section-title">نقشه راه <span style={{ color: 'var(--secondary-purple)' }}>موفقیت شما</span></h2>
          </div>

          <div className="timeline-wrapper" style={{position:'relative', zIndex:2}}>
            <div className="timeline-line"></div>

            <div className="timeline-row">
              <div className="timeline-half"></div>
              <div className="timeline-dot"></div>
              <div className="timeline-half">
                <div className="timeline-content">
                  <h2 style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', marginBottom: '10px' }}>۱. انتخاب دوره</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>بر اساس نیاز شغلی، دوره مناسب را از بین دوره‌های حفاظت یا تصویربرداری انتخاب کنید.</p>
                </div>
              </div>
            </div>

            <div className="timeline-row">
              <div className="timeline-half">
                <div className="timeline-content">
                  <h2 style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', marginBottom: '10px' }}>۲. مشاهده آموزش‌ها</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>دسترسی نامحدود به ویدیوهای با کیفیت بالا و جزوات تخصصی اساتید برتر کشور.</p>
                </div>
              </div>
              <div className="timeline-dot"></div>
              <div className="timeline-half"></div>
            </div>

            <div className="timeline-row">
              <div className="timeline-half"></div>
              <div className="timeline-dot"></div>
              <div className="timeline-half">
                <div className="timeline-content">
                  <h2 style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', marginBottom: '10px' }}>۳. آزمون آنلاین</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>شرکت در آزمون‌های شبیه‌سازی شده استاندارد جهت سنجش مهارت‌های کسب شده.</p>
                </div>
              </div>
            </div>

            <div className="timeline-row">
              <div className="timeline-half">
                <div className="timeline-content">
                  <h2 style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', marginBottom: '10px' }}>۴. دریافت گواهینامه</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>صدور آنی گواهینامه معتبر دوزبانه و معرفی به مراکز درمانی جهت اشتغال.</p>
                </div>
              </div>
              <div className="timeline-dot"></div>
              <div className="timeline-half"></div>
            </div>
          </div>
        </section>

        {/* --- 4. بخش آمار --- */}
        <section className="stats-section" style={{ padding: '4rem 10%', background: '#050914', borderTop: '1px solid rgba(255,255,255,0.05)', position:'relative', zIndex:2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="stat-box">
              <h3 style={{ fontSize: '3rem', color: 'var(--primary-blue)', marginBottom: '5px' }}>+۱۵۰۰</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>فارغ‌التحصیل موفق</p>
            </div>
            <div className="stat-box">
              <h3 style={{ fontSize: '3rem', color: 'var(--secondary-purple)', marginBottom: '5px' }}>+۵۰</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>دوره تخصصی</p>
            </div>
            <div className="stat-box">
              <h3 style={{ fontSize: '3rem', color: '#00E676', marginBottom: '5px' }}>+۱۲</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>سال سابقه آموزشی</p>
            </div>
          </div>
        </section>
      </main>
  );
}