import { fetchAPI } from '../../../../../lib/fetchAPI';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// / 👇 این خط را اضافه کن (خیلی مهم)
export const runtime = 'edge';

// --- اینترفیس‌ها ---
interface Lesson {
    title: string;
    slug: string;
    content: string;
    lessonfields?: {
        videoUrl?: string; // فرمت صحیح (CamelCase)
        duration?: string;
    };
}

interface Course {
    title: string;
    slug: string;
    coursefields?: {
        courselessons?: {
            nodes: Lesson[];
        };
    };
}

// --- دریافت اطلاعات ---
async function getData(courseSlug: string, lessonSlug: string) {
    // لاگ کردن اسلاگ‌ها برای اطمینان از درست بودن آدرس
    console.log(`📡 Fetching data for Course: ${courseSlug}, Lesson: ${lessonSlug}`);

    try {
        const data = await fetchAPI(
            `
      query GetLessonPageData($courseId: ID!, $lessonId: ID!) {
        course(id: $courseId, idType: SLUG) {
          title
          slug
          coursefields {
            courselessons {
              nodes {
                ... on Lesson {
                  title
                  slug
                  lessonfields {
                     duration
                  }
                }
              }
            }
          }
        }

        lesson(id: $lessonId, idType: SLUG) {
          title
          content
          lessonfields {
            videoUrl  # ✅ اصلاح شد: videoUrl
            duration
          }
        }
      }
    `,
            { variables: { courseId: courseSlug, lessonId: lessonSlug } }
        );

        // لاگ کردن نتیجه برای پیدا کردن ارور
        if (!data.course) console.error("❌ Course not found in API response");
        if (!data.lesson) console.error("❌ Lesson not found in API response");

        return {
            course: data?.course as Course,
            lesson: data?.lesson as Lesson,
        };
    } catch (error) {
        console.error("❌ API Error:", error);
        return { course: null, lesson: null };
    }
}

interface PageProps {
    params: Promise<{ course: string; lessonSlug: string }>;
}

export default async function LessonPage(props: PageProps) {
    const params = await props.params;

    // دیکود کردن اسلاگ‌ها (مهم برای زبان فارسی)
    const courseSlug = decodeURIComponent(params.course);
    const lessonSlug = decodeURIComponent(params.lessonSlug);

    const { course, lesson } = await getData(courseSlug, lessonSlug);

    // اگر دیتا نیامد، ۴۰۴ بده
    if (!lesson || !course) {
        console.log("⛔ Showing 404 Page");
        notFound();
    }

    const allLessons = course.coursefields?.courselessons?.nodes || [];
    const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
    const nextLesson = allLessons[currentIndex + 1];
    const prevLesson = allLessons[currentIndex - 1];

    const videoSrc = lesson.lessonfields?.videoUrl;

    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', direction: 'rtl' }}>

            {/* هدر */}
            <header style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b' }}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <Link href={`/courses/${courseSlug}`} style={{color:'#ccc', textDecoration:'none', fontSize:'1.2rem'}}>↩</Link>
                    <h1 style={{ fontSize: '1rem', margin: 0, color: '#fff' }}>{course.title} / <span style={{color:'#00D4FF'}}>{lesson.title}</span></h1>
                </div>
                <Link href={`/courses/${courseSlug}`} style={{ textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem' }}>بازگشت به دوره</Link>
            </header>

            {/* بدنه */}
            <div style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100vh - 70px)' }}>

                {/* ستون ویدیو */}
                <div style={{ flex: '3', padding: '30px', overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: '15px', overflow: 'hidden', marginBottom: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                        {videoSrc ? (
                            <video controls src={videoSrc} style={{ width: '100%', height: '100%' }}>مرورگر پشتیبانی نمی‌کند.</video>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#666' }}>
                                <span style={{ fontSize: '3rem' }}>🎬</span>
                                <p>ویدیویی بارگذاری نشده است.</p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        {prevLesson ? (
                            <Link href={`/courses/${courseSlug}/${prevLesson.slug}`} style={{ padding: '10px 20px', background: '#23304c', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>→ درس قبلی</Link>
                        ) : <div />}
                        {nextLesson ? (
                            <Link href={`/courses/${courseSlug}/${nextLesson.slug}`} style={{ padding: '10px 20px', background: '#00D4FF', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight:'bold' }}>درس بعدی ←</Link>
                        ) : <span style={{ padding: '10px 20px', background: '#333', color: '#777', borderRadius: '8px' }}>پایان دوره</span>}
                    </div>

                    <div style={{ background: '#1e293b', padding: '30px', borderRadius: '15px', lineHeight: '1.8' }}>
                        <h2 style={{ fontSize:'1.5rem', marginBottom: '20px', color: '#9D84FF' }}>توضیحات درس</h2>
                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    </div>
                </div>

                {/* سایدبار لیست پخش */}
                <div style={{ flex: '1', minWidth: '300px', background: '#111827', overflowY: 'auto', borderRight: '1px solid #333' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', position:'sticky', top:0, background:'#111827', zIndex:10 }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>سرفصل‌های دوره</h3>
                        <span style={{ fontSize: '0.8rem', color: '#777' }}>{allLessons.length} جلسه</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {allLessons.map((item, index) => {
                            const isActive = item.slug === lessonSlug;
                            return (
                                <Link key={item.slug} href={`/courses/${courseSlug}/${item.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent', borderRight: isActive ? '3px solid #00D4FF' : '3px solid transparent', color: isActive ? '#00D4FF' : '#ccc' }}>
                                    <span style={{ fontSize: '0.8rem', width: '24px', height: '24px', background: isActive ? '#00D4FF' : '#333', color: isActive ? '#000' : '#aaa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</span>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal' }}>{item.title}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>{item.lessonfields?.duration || '10:00'}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}