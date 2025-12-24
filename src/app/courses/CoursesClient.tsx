"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './courses.module.css';

interface TaxonomyItem {
    name: string;
    slug: string;
    count?: number;
}

interface Course {
    slug: string;
    title: string;
    featuredImage?: { node: { sourceUrl: string } };
    coursefields?: { price?: string; duration?: string };
    // اینترفیس‌های جدید که از page.tsx میان
    courseCategories?: { nodes: TaxonomyItem[] };
    courseLevels?: { nodes: TaxonomyItem[] };
    courseTypes?: { nodes: TaxonomyItem[] };
}

interface CoursesClientProps {
    initialCourses: Course[];
    categories: TaxonomyItem[];
    levels: TaxonomyItem[];
    types: TaxonomyItem[];
}

export default function CoursesClient({ initialCourses, categories, levels, types }: CoursesClientProps) {

    // --- 1. استیت‌ها ---
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = useState('');

    // استیت‌های فیلتر (هر کدام جداگانه)
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // --- 2. منطق فیلتر کردن چندگانه ---
    useEffect(() => {
        let result = initialCourses;

        // فیلتر جستجو
        if (searchTerm) {
            result = result.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // فیلتر دسته‌بندی
        if (selectedCategory !== 'all') {
            result = result.filter(course =>
                course.courseCategories?.nodes.some(cat => cat.slug === selectedCategory)
            );
        }

        // فیلتر سطح دوره (جدید)
        if (selectedLevel !== 'all') {
            result = result.filter(course =>
                course.courseLevels?.nodes.some(lvl => lvl.slug === selectedLevel)
            );
        }

        // فیلتر نوع برگزاری (جدید)
        if (selectedType !== 'all') {
            result = result.filter(course =>
                course.courseTypes?.nodes.some(tp => tp.slug === selectedType)
            );
        }

        setFilteredCourses(result);
    }, [searchTerm, selectedCategory, selectedLevel, selectedType, initialCourses]);

    // تابع ریست کردن همه فیلترها
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLevel('all');
        setSelectedType('all');
    };

    return (
        <div className={styles.container}>

            {/* >>> سایدبار فیلترها <<< */}
            <aside className={styles.filters}>

                {/* --- گروه ۱: دسته‌بندی‌ها --- */}
                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle}>دسته‌بندی‌ها</div>
                    <label className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                            style={{display:'none'}}
                        />
                        <span className={styles.customCheckbox} style={selectedCategory === 'all' ? {background:'var(--primary-blue)', color:'black'} : {}}>
                        {selectedCategory === 'all' && '✓'}
                    </span>
                        همه دوره‌ها
                    </label>
                    {categories.map((cat) => (
                        <label key={cat.slug} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={selectedCategory === cat.slug}
                                onChange={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                                style={{display:'none'}}
                            />
                            <span className={styles.customCheckbox} style={selectedCategory === cat.slug ? {background:'var(--primary-blue)', color:'black'} : {}}>
                            {selectedCategory === cat.slug && '✓'}
                        </span>
                            {cat.name}
                            {cat.count !== null && <span style={{fontSize:'0.8rem', opacity:0.5, marginRight:'auto'}}>({cat.count})</span>}
                        </label>
                    ))}
                </div>

                {/* --- گروه ۲: سطح دوره --- */}
                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle}>سطح دوره</div>
                    <label className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            checked={selectedLevel === 'all'}
                            onChange={() => setSelectedLevel('all')}
                            style={{display:'none'}}
                        />
                        <span className={styles.customCheckbox} style={selectedLevel === 'all' ? {background:'var(--primary-blue)', color:'black'} : {}}>
                        {selectedLevel === 'all' && '✓'}
                    </span>
                        همه سطوح
                    </label>
                    {levels.length > 0 ? levels.map((level) => (
                        <label key={level.slug} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={selectedLevel === level.slug}
                                onChange={() => setSelectedLevel(selectedLevel === level.slug ? 'all' : level.slug)}
                                style={{display:'none'}}
                            />
                            <span className={styles.customCheckbox} style={selectedLevel === level.slug ? {background:'var(--primary-blue)', color:'black'} : {}}>
                            {selectedLevel === level.slug && '✓'}
                        </span>
                            {level.name}
                        </label>
                    )) : <p style={{color:'#777', fontSize:'0.8rem'}}>آیتمی یافت نشد</p>}
                </div>

                {/* --- گروه ۳: نوع برگزاری --- */}
                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle}>نوع برگزاری</div>
                    <label className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            checked={selectedType === 'all'}
                            onChange={() => setSelectedType('all')}
                            style={{display:'none'}}
                        />
                        <span className={styles.customCheckbox} style={selectedType === 'all' ? {background:'var(--primary-blue)', color:'black'} : {}}>
                        {selectedType === 'all' && '✓'}
                    </span>
                        همه انواع
                    </label>
                    {types.length > 0 ? types.map((type) => (
                        <label key={type.slug} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={selectedType === type.slug}
                                onChange={() => setSelectedType(selectedType === type.slug ? 'all' : type.slug)}
                                style={{display:'none'}}
                            />
                            <span className={styles.customCheckbox} style={selectedType === type.slug ? {background:'var(--primary-blue)', color:'black'} : {}}>
                            {selectedType === type.slug && '✓'}
                        </span>
                            {type.name}
                        </label>
                    )) : <p style={{color:'#777', fontSize:'0.8rem'}}>آیتمی یافت نشد</p>}
                </div>

            </aside>

            {/* >>> لیست دوره‌ها <<< */}
            <main className={styles.coursesGrid} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course.slug} className={styles.courseCard}>
                                <div className={styles.cardImg}>
                             <span className={styles.cardBadge}>
                                {/* نمایش سطح دوره به عنوان بج */}
                                 {course.courseLevels?.nodes[0]?.name || 'ثبت نام باز'}
                             </span>
                                    {course.featuredImage ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={course.featuredImage.node.sourceUrl} alt={course.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    ) : ( <span>☢</span> )}
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{course.title}</h3>
                                    <div className={styles.instructorInfo}>
                                        <div className={styles.instructorAvatar}></div>
                                        {course.courseCategories?.nodes[0]?.name || 'آموزشی'}
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.rating}>⭐ ۵.۰</div>
                                        <div className={styles.price}>
                                            {course.coursefields?.price ? `${course.coursefields.price} تومان` : 'مشاهده جزئیات'}
                                        </div>
                                    </div>
                                    <Link href={`/courses/${course.slug}`} className={styles.btnView}>
                                        مشاهده دوره
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{gridColumn: '1/-1', textAlign:'center', padding:'40px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', width: '100%'}}>
                            <h3 style={{color:'#ff6b6b'}}>هیچ دوره‌ای با این مشخصات یافت نشد</h3>
                            <button
                                onClick={resetFilters}
                                style={{marginTop:'15px', padding:'8px 15px', background:'var(--primary-blue)', border:'none', borderRadius:'5px', cursor:'pointer'}}
                            >
                                پاک کردن همه فیلترها
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}