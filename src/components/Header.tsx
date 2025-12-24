"use client";

import Link from 'next/link';

const Header = () => {
    return (
        <header>
            {/* لوگوی سایت */}
            <div className="logo">
                <span>☢</span> پرتو آکادمی
            </div>

            {/* منوی ناوبری */}
            <nav>
                <ul>
                    <li><Link href="/">خانه</Link></li>
                    <li><Link href="/courses">دوره‌ها</Link></li>
                    <li><Link href="/professors">اساتید</Link></li>
                    <li><Link href="#">درباره ما</Link></li>
                </ul>
            </nav>

            {/* دکمه پرتال */}
            <Link href="/portal" className="cta-btn-header">
                پرتال دانشجویان
            </Link>
        </header>
    );
}

export default Header;