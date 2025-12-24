"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './student.module.css';

export default function StudentPanel() {
    const router = useRouter();

    // استیت‌های احراز هویت
    const [userName, setUserName] = useState('دانشجو');
    const [loading, setLoading] = useState(true);

    // --- بررسی امنیت (آیا لاگین هست؟) ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedName = localStorage.getItem('userName');

        if (!token) {
            router.push('/portal'); // اگر لاگین نیست، برو بیرون
        } else {
            if (savedName) setUserName(savedName);
            setLoading(false);
        }
    }, [router]);

    // خروج از حساب
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/portal');
    };

    if (loading) {
        return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0f172a', color:'#fff'}}>در حال بارگذاری...</div>;
    }

    return (
        <div className={styles.container} dir="rtl">

            {/* --- سایدبار --- */}
            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>👤</div>
                    {/* نام داینامیک */}
                    <div className={styles.userName}>{userName}</div>
                    <div className={styles.userRole}>دانشجوی پرتلاش</div>
                </div>

                <ul className={styles.menu}>
                    <li className={`${styles.menuItem} ${styles.activeItem}`}>📚 دوره‌های من</li>
                    <li className={styles.menuItem}>🎓 گواهینامه‌ها</li>
                    <li className={styles.menuItem}>💳 تراکنش‌ها</li>
                    <li className={styles.menuItem}>⚙️ تنظیمات حساب</li>
                    <li
                        className={styles.menuItem}
                        style={{color:'#ff6b6b', marginTop:'20px'}}
                        onClick={handleLogout} // دکمه خروج فعال
                    >
                        🚪 خروج
                    </li>
                </ul>
            </aside>

            {/* --- محتوای اصلی --- */}
            <main className={styles.mainContent}>

                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>داشبورد یادگیری</h1>
                    <p style={{color:'rgba(255,255,255,0.6)'}}>سلام <b>{userName}</b> عزیز، امروز چه چیزی یاد می‌گیریم؟</p>
                </div>

                {/* آمار */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>3</div>
                        <div className={styles.statLabel}>دوره‌های فعال</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>12</div>
                        <div className={styles.statLabel}>ساعت آموزش دیده</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber} style={{color:'#00E676'}}>85%</div>
                        <div className={styles.statLabel}>میانگین پیشرفت</div>
                    </div>
                </div>

                {/* لیست دوره‌های من (فعلاً استاتیک - برای فاز بعد می‌تونیم این رو هم وصل کنیم) */}
                <h2 style={{marginBottom:'20px', fontSize:'1.2rem'}}>ادامه یادگیری</h2>
                <div className={styles.coursesList}>

                    <div className={styles.courseItem}>
                        <div className={styles.courseThumb} style={{background: 'linear-gradient(45deg, #111, #333)'}}></div>
                        <div className={styles.courseInfo}>
                            <h3 style={{fontSize:'1rem', marginBottom:'5px'}}>فیزیک MRI پیشرفته</h3>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#aaa'}}>
                                <span>مدرس: دکتر رادمنش</span>
                                <span>۶۰٪ تکمیل شده</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{width:'60%'}}></div>
                            </div>
                        </div>
                        {/* لینک به اولین درس (می‌تونی اسلاگ واقعی بذاری) */}
                        <Link href="/courses/mri-physics/lesson-1" className={styles.continueBtn}>
                            ادامه دوره
                        </Link>
                    </div>

                    <div className={styles.courseItem}>
                        <div className={styles.courseThumb} style={{background: 'linear-gradient(45deg, #222, #444)'}}></div>
                        <div className={styles.courseInfo}>
                            <h3 style={{fontSize:'1rem', marginBottom:'5px'}}>حفاظت در برابر اشعه</h3>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#aaa'}}>
                                <span>مدرس: مهندس پرتوی</span>
                                <span>۳۰٪ تکمیل شده</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{width:'30%', background:'#FFD700'}}></div>
                            </div>
                        </div>
                        <Link href="#" className={styles.continueBtn}>
                            ادامه دوره
                        </Link>
                    </div>

                </div>

            </main>

        </div>
    );
}