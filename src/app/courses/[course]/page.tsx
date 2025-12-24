import { fetchAPI } from '../../../../lib/fetchAPI';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// --- 1. تعریف اینترفیس‌های جدید برای استاد ---
interface Professor {
    title: string; // نام استاد (عنوان پست)
    professorFields?: {
        jobTitle?: string; // عنوان شغلی (job_title)
        avatar?: {         // عکس استاد (avatar)
            node: {
                sourceUrl: string;
            };
        };
    };
}

interface Lesson {
    title: string;
    slug: string;
    lessonfields?: {
        duration?: string;
    };
}

interface Course {
    title: string;
    slug: string;
    content: string;
    date: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
    coursefields?: {
        price?: string;
        duration?: string;
        // اضافه کردن ارتباط با استاد
        courseInstructor?: {
            nodes: Professor[];
        };
        courselessons?: {
            nodes: Lesson[];
        };
    };
    courseCategories?: {
        nodes: { name: string }[];
    };
}

// --- دریافت اطلاعات دوره + استاد ---
async function getCourse(slug: string) {
    const data = await fetchAPI(
        `
    query GetSingleCourse($id: ID!) {
      course(id: $id, idType: SLUG) {
        title
        content
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        coursefields {
          price
          duration
          
          # --- دریافت اطلاعات استاد (جدید) ---
          courseInstructor {
            nodes {
              ... on Professor {
                title
                professorFields {
                  jobTitle  # نام فیلد در وردپرس job_title بوده، اینجا معمولا jobTitle میشه
                  avatar {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }

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
        courseCategories {
          nodes {
            name
          }
        }
      }
    }
  `,
        { variables: { id: slug } }
    );

    return data?.course as Course;
}

interface PageProps {
    params: Promise<{ course: string }>;
}

export default async function SingleCoursePage(props: PageProps) {
    const params = await props.params;
    const decodedSlug = decodeURIComponent(params.course);

    const course = await getCourse(decodedSlug);

    if (!course) {
        notFound();
    }

    const lessons = course.coursefields?.courselessons?.nodes || [];
    const firstLesson = lessons.length > 0 ? lessons[0] : null;

    // --- استخراج اطلاعات استاد ---
    // چون آرایه است، اولین نفر رو میگیریم
    const instructor = course.coursefields?.courseInstructor?.nodes[0];

    return (
        <div style={{ backgroundColor: '#1B263B', minHeight: '100vh', color: '#fff', paddingBottom: '50px', direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }}>

            {/* Hero Section */}
            <div style={{
                padding: '3rem 5%',
                background: `linear-gradient(90deg, rgba(11,16,33,0.9) 0%, rgba(27,38,59,0.9) 100%), url(${course.featuredImage?.node?.sourceUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                        <Link href="/" style={{color:'inherit', textDecoration:'none'}}>خانه</Link> /
                        <Link href="/courses" style={{color:'inherit', textDecoration:'none', margin:'0 5px'}}>دوره‌ها</Link> /
                        <span style={{color:'#fff'}}>{course.courseCategories?.nodes[0]?.name || 'تخصصی'}</span>
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.4 }}>{course.title}</h1>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                        <span style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #00E676', color: '#00E676', background: 'rgba(0, 230, 118, 0.1)' }}>بروزرسانی جدید</span>
                        <span style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)' }}>{course.coursefields?.duration || '۲۰'} ساعت آموزش</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#FFD700', fontWeight: 'bold' }}>★ ۵.۰</span> (امتیاز کاربران)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* نمایش نام استاد در هدر هم اگر بخواهی */}
                            👨‍🏫 مدرس: {instructor ? instructor.title : 'تیم آموزشی'}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '3rem',
                padding: '3rem 5%',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>

                <div style={{ minWidth: 0 }}>

                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '2rem' }}>
                        <button style={{ padding: '15px 0', background: 'none', border: 'none', color: '#00D4FF', fontSize: '1.1rem', cursor: 'pointer', borderBottom: '3px solid #00D4FF', fontWeight: 700 }}>معرفی دوره</button>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '16px', padding: '2rem', marginBottom: '2rem', lineHeight: 1.8
                    }}>
                        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>توضیحات دوره</h3>
                        <div dangerouslySetInnerHTML={{ __html: course.content }} style={{color:'rgba(255,255,255,0.8)'}} />
                    </div>

                    <h3 style={{ color: '#fff; margin-bottom: 1.5rem' }}>سرفصل‌های آموزشی</h3>

                    <div style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                            <span>لیست جلسات دوره</span>
                            <span>▼</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                            {lessons.length > 0 ? (
                                lessons.map((lesson, index) => (
                                    <Link
                                        key={lesson.slug}
                                        href={`/courses/${decodedSlug}/${lesson.slug}`}
                                        style={{
                                            padding: '15px 20px',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', justifyContent: 'space-between',
                                            fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none', transition: '0.2s'
                                        }}
                                    >
                                <span style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <span style={{background:'rgba(255,255,255,0.1)', width:'25px', height:'25px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem'}}>{index + 1}</span>
                                    {lesson.title}
                                </span>
                                        <span style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                                    {lesson.lessonfields?.duration || '10:00'}
                                            <span style={{color: '#00D4FF'}}>▶</span>
                                </span>
                                    </Link>
                                ))
                            ) : (
                                <div style={{padding:'20px', color:'#ff6b6b'}}>هنوز جلسه‌ای بارگذاری نشده است.</div>
                            )}
                        </div>
                    </div>

                    {/* --- باکس مدرس دوره (داینامیک شده) --- */}
                    {instructor && (
                        <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>مدرس دوره</h3>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                {/* عکس استاد */}
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    border: '2px solid #00D4FF', overflow: 'hidden', background: '#333'
                                }}>
                                    {instructor.professorFields?.avatar ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={instructor.professorFields.avatar.node.sourceUrl}
                                            alt={instructor.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem'}}>🎓</div>
                                    )}
                                </div>

                                <div>
                                    <h4 style={{ color: '#00D4FF', fontSize: '1.2rem', marginBottom: '5px' }}>
                                        {instructor.title}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                        {instructor.professorFields?.jobTitle || 'مدرس رسمی آکادمی'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(30, 41, 65, 0.9), rgba(20, 28, 48, 0.9))',
                        border: '1px solid #00D4FF', borderRadius: '20px', overflow: 'hidden',
                        boxShadow: '0 0 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)'
                    }}>
                        <div style={{ width: '100%', height: '200px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {course.featuredImage ? (
                                <img src={course.featuredImage.node.sourceUrl} alt="cover" style={{width:'100%', height:'100%', objectFit:'cover', opacity:0.6}} />
                            ) : null}
                            <div style={{ position:'absolute', width: '60px', height: '60px', background: 'rgba(0, 212, 255, 0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', boxShadow: '0 0 20px #00D4FF' }}>▶</div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '5px' }}>
                                {course.coursefields?.price ? `${course.coursefields.price} تومان` : 'رایگان'}
                            </div>

                            {firstLesson ? (
                                <Link href={`/courses/${decodedSlug}/${firstLesson.slug}`} style={{
                                    display: 'block', width: '100%', padding: '15px', margin: '20px 0',
                                    background: '#00D4FF', color: '#000', fontWeight: 800, fontSize: '1.1rem',
                                    textAlign: 'center', textDecoration: 'none', borderRadius: '10px',
                                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
                                }}>
                                    شروع یادگیری
                                </Link>
                            ) : (
                                <button disabled style={{ width: '100%', padding: '15px', margin: '20px 0', background: '#333', color: '#777', border:'none', borderRadius:'10px' }}>به زودی</button>
                            )}

                            <ul style={{ listStyle: 'none', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                <li style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>♾️ دسترسی نامحدود مادام‌العمر</li>
                                <li style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>📜 گواهینامه معتبر دوزبانه</li>
                                <li style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>📱 قابل مشاهده در موبایل و لپ‌تاپ</li>
                            </ul>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}