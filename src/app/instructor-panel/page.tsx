"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // برای ریدایرکت
import styles from './instructor.module.css';

// --- دیتای ساختگی (شبیه‌سازی دیتابیس) ---
const myClasses = [
    { id: 1, title: 'فیزیک MRI پیشرفته', type: 'آفلاین (ویدیویی)', studentsCount: 145, status: 'active' },
    { id: 2, title: 'حفاظت پرتویی (گروه A)', type: 'آنلاین / حضوری', studentsCount: 30, status: 'active' },
    { id: 3, title: 'کنترل کیفی دستگاه‌ها', type: 'آفلاین (ویدیویی)', studentsCount: 50, status: 'completed' },
];

const classStudents: any = {
    1: [
        { id: 101, name: 'سارا احمدی', progress: 85, lastLesson: 'جلسه ۱۸: سکانس‌های پالسی', status: 'active', statusText: 'فعال و منظم' },
        { id: 102, name: 'علی رضایی', progress: 40, lastLesson: 'جلسه ۸: گرادیان‌ها', status: 'warning', statusText: 'عقب افتاده' },
        { id: 103, name: 'مریم کمالی', progress: 100, lastLesson: 'دوره تکمیل شده', status: 'completed', statusText: 'فارغ‌التحصیل' },
        { id: 104, name: 'امید زند', progress: 10, lastLesson: 'جلسه ۲: مقدمات', status: 'danger', statusText: 'ریسک انصراف' },
    ],
    2: [
        { id: 201, name: 'محمد حسین‌پور', progress: 90, lastLesson: 'حضور در کارگاه عملی', status: 'active', statusText: 'تایید شده' },
        { id: 202, name: 'نازنین فتحی', progress: 0, lastLesson: 'غیبت در ۳ جلسه', status: 'danger', statusText: 'مشروط' },
    ],
    3: []
};

export default function InstructorPanel() {
    const router = useRouter();

    // استیت‌های صفحه
    const [userName, setUserName] = useState('کاربر'); // نام کاربر
    const [loading, setLoading] = useState(true);      // حالت لودینگ اولیه
    const [selectedClassId, setSelectedClassId] = useState<number>(1);

    // --- بررسی وضعیت لاگین (Auth Check) ---
    useEffect(() => {
        // خواندن توکن و نام از لوکال استوریج
        const token = localStorage.getItem('token');
        const savedName = localStorage.getItem('userName');

        if (!token) {
            // اگر توکن نبود، یعنی لاگین نیست -> برو به صفحه ورود
            router.push('/portal');
        } else {
            // اگر بود، اسمش رو ست کن و لودینگ رو بردار
            if (savedName) setUserName(savedName);
            setLoading(false);
        }
    }, [router]);

    // اگر هنوز داره چک میکنه، صفحه رو نشون نده (یا یک لودینگ ساده نشون بده)
    if (loading) {
        return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0f172a', color:'#fff'}}>در حال بارگذاری پنل...</div>;
    }

    const currentClassInfo = myClasses.find(c => c.id === selectedClassId);
    const currentStudents = classStudents[selectedClassId] || [];

    // خروج از حساب
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/portal');
    };

    return (
        <div className={styles.container} dir="rtl">

            {/* سایدبار */}
            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>👨‍🏫</div>
                    {/* نمایش نام واقعی کاربر */}
                    <div className={styles.userName}>{userName}</div>
                    <div className={styles.userRole}>پنل مدیریت آموزش</div>
                </div>

                <ul className={styles.menu}>
                    <li className={`${styles.menuItem} ${styles.activeItem}`}>👥 مدیریت دانشجویان</li>
                    <li className={styles.menuItem}>📝 تصحیح تکالیف</li>
                    <li className={styles.menuItem}>📅 تقویم کلاسی</li>
                    <li className={styles.menuItem}>💬 پیام‌ها (۵)</li>
                    <li
                        className={styles.menuItem}
                        style={{color:'#ff6b6b', marginTop:'20px'}}
                        onClick={handleLogout} // اتصال دکمه خروج
                    >
                        🚪 خروج
                    </li>
                </ul>
            </aside>

            {/* محتوای اصلی */}
            <main className={styles.mainContent}>

                <div className={styles.header}>
                    <div>
                        <h1 style={{fontSize:'1.8rem', marginBottom:'5px'}}>رهگیری وضعیت آموزشی</h1>
                        <p style={{color:'rgba(255,255,255,0.6)'}}>خوش آمدید <b>{userName}</b> عزیز، کلاس مورد نظر را انتخاب کنید.</p>
                    </div>
                </div>

                {/* لیست کلاس‌ها */}
                <h2 style={{fontSize:'1.1rem', marginBottom:'15px', color:'#9D84FF'}}>۱. کلاس مورد نظر را انتخاب کنید:</h2>
                <div className={styles.statsGrid}>
                    {myClasses.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClassId(cls.id)}
                            className={styles.statCard}
                            style={{
                                cursor: 'pointer',
                                border: selectedClassId === cls.id ? '2px solid #9D84FF' : '1px solid rgba(255,255,255,0.05)',
                                background: selectedClassId === cls.id ? 'rgba(157, 132, 255, 0.1)' : 'rgba(30, 41, 59, 0.6)'
                            }}
                        >
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <span style={{fontSize:'0.8rem', background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:'5px'}}>{cls.type}</span>
                                {selectedClassId === cls.id && <span style={{color:'#9D84FF'}}>✔ انتخاب شده</span>}
                            </div>
                            <div style={{fontWeight:'bold', fontSize:'1.1rem', marginBottom:'5px'}}>{cls.title}</div>
                            <div className={styles.statLabel}>{cls.studentsCount} دانشجو</div>
                        </div>
                    ))}
                </div>

                {/* جدول دانشجویان */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'40px', marginBottom:'20px'}}>
                    <h2 style={{fontSize:'1.2rem'}}>
                        لیست دانشجویان: <span style={{color:'#00D4FF'}}>{currentClassInfo?.title}</span>
                    </h2>
                    <button className={styles.createBtn} style={{fontSize:'0.8rem'}}>⬇ خروجی اکسل</button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.courseTable}>
                        <thead>
                        <tr>
                            <th>نام دانشجو</th>
                            <th>وضعیت کلی</th>
                            <th style={{width:'35%'}}>میزان پیشرفت</th>
                            <th>آخرین فعالیت / موقعیت</th>
                            <th>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentStudents.length > 0 ? currentStudents.map((std: any) => (
                            <tr key={std.id}>
                                <td>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{width:'35px', height:'35px', borderRadius:'50%', background:'#333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem'}}>👤</div>
                                        {std.name}
                                    </div>
                                </td>
                                <td>
                                <span className={styles.statusBadge} style={{
                                    background: std.status === 'active' ? 'rgba(0,230,118,0.1)' : std.status === 'warning' ? 'rgba(255,171,0,0.1)' : std.status === 'danger' ? 'rgba(255,82,82,0.1)' : 'rgba(0,212,255,0.1)',
                                    color: std.status === 'active' ? '#00E676' : std.status === 'warning' ? '#FFAB00' : std.status === 'danger' ? '#FF5252' : '#00D4FF'
                                }}>
                                    {std.statusText}
                                </span>
                                </td>
                                <td>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{flex:1, height:'6px', background:'#333', borderRadius:'3px', overflow:'hidden'}}>
                                            <div style={{
                                                width: `${std.progress}%`,
                                                height:'100%',
                                                background: std.progress === 100 ? '#00E676' : std.progress < 30 ? '#FF5252' : '#9D84FF'
                                            }}></div>
                                        </div>
                                        <span style={{fontSize:'0.8rem', width:'35px'}}>{std.progress}%</span>
                                    </div>
                                </td>
                                <td style={{fontSize:'0.9rem', color:'rgba(255,255,255,0.7)'}}>
                                    {std.lastLesson}
                                </td>
                                <td>
                                    <Link href="#" style={{color:'#9D84FF', fontSize:'0.85rem', textDecoration:'none', border:'1px solid #9D84FF', padding:'5px 10px', borderRadius:'5px'}}>
                                        جزئیات
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{textAlign:'center', padding:'30px', color:'#aaa'}}>
                                    هیچ دانشجویی در این کلاس یافت نشد.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

            </main>

        </div>
    );
}