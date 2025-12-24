import Link from 'next/link';

const Footer = () => {
    return (
        <footer style={{ background: '#05070e', padding: '4rem 10% 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', marginBottom: '3rem' }}>

                {/* ستون اول: لوگو و توضیحات */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <div className="logo" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        <span style={{ color: '#00D4FF' }}>☢</span> پرتو آکادمی
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                        اولین و معتبرترین مرجع آموزش‌های حفاظت در برابر اشعه و تصویربرداری پزشکی در کشور. ما پلی میان دانشگاه و صنعت هستیم.
                    </p>
                </div>

                {/* ستون دوم: لینک‌ها */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem' }}>دسترسی سریع</h4>
                    <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.6)', lineHeight: 2, padding: 0 }}>
                        <li><Link href="/courses" style={{ color: 'inherit', textDecoration: 'none', transition: '0.3s' }}>لیست دوره‌ها</Link></li>
                        <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', transition: '0.3s' }}>استعلام گواهینامه</Link></li>
                        <li><Link href="#" style={{ color: 'inherit', textDecoration: 'none', transition: '0.3s' }}>مقالات آموزشی</Link></li>
                    </ul>
                </div>

                {/* ستون سوم: خبرنامه */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem' }}>عضویت در خبرنامه</h4>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '8px' }}>
                        <input type="email" placeholder="ایمیل خود را وارد کنید..." style={{ background: 'transparent', border: 'none', color: '#fff', padding: '10px', flex: 1, outline: 'none' }} />
                        <button style={{ background: '#00D4FF', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ارسال</button>
                    </div>
                </div>
            </div>

            {/* کپی رایت */}
            <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                © ۱۴۰۳ تمامی حقوق برای پرتو آکادمی محفوظ است.
            </div>
        </footer>
    );
}

export default Footer;