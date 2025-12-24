"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './portal.module.css';

export default function PortalPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // استیت‌های فرم
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // تابع لاگین
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. ساخت کوئری لاگین (اصلاح شده: حذف slug)
        const query = `
      mutation Login($username: String!, $password: String!) {
        login(input: {username: $username, password: $password}) {
          authToken
          user {
            databaseId
            name
            email
            roles {
              nodes {
                name
                # slug را حذف کردیم چون باعث ارور می‌شد
              }
            }
          }
        }
      }
    `;

        try {
            const res = await fetch('https://fatehi.ipapda.com/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    variables: { username, password }
                }),
            });

            const json = await res.json();

            // 3. بررسی نتیجه
            if (json.errors) {
                // اگر ارور مربوط به کوئری باشد، در کنسول چاپ کن
                console.error("GraphQL Errors:", json.errors);

                // چک کنیم آیا ارور واقعاً مربوط به پسورد است یا ساختار کوئری
                const errorMessage = json.errors[0]?.message || '';
                if (errorMessage.includes('incorrect_password') || errorMessage.includes('invalid_username')) {
                    setError('نام کاربری یا رمز عبور اشتباه است.');
                } else {
                    setError('خطا در ساختار درخواست (لطفاً کنسول را چک کنید).');
                }
            } else if (json.data?.login?.authToken) {

                // --- لاگین موفق ---
                const { authToken, user } = json.data.login;

                localStorage.setItem('token', authToken);
                localStorage.setItem('userName', user.name);

                // ب) تشخیص نقش کاربر (اصلاح شده: استفاده از name به جای slug)
                // نقش‌ها معمولاً به صورت "Administrator" برمی‌گردند، ما کوچکشان می‌کنیم
                const userRoles = user.roles.nodes.map((r: { name: string }) => r.name.toLowerCase());

                console.log("User Roles:", userRoles); // برای دیباگ

                if (userRoles.includes('administrator') || userRoles.includes('professor') || userRoles.includes('editor')) {
                    router.push('/instructor-panel');
                } else {
                    router.push('/student-panel');
                }

            } else {
                setError('خطای ناشناخته در ورود.');
            }

        } catch (err) {
            setError('خطا در برقراری ارتباط با سرور.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} dir="rtl">
            <div className={styles.authCard}>

                <div className={styles.header}>
                    <span className={styles.logo}>☢</span>
                    <h1 className={styles.title}>ورود به پرتال</h1>
                    <p className={styles.subtitle}>برای دسترسی به دوره‌ها وارد شوید</p>
                </div>

                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`} onClick={() => setActiveTab('login')}>ورود</button>
                    <button className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`} onClick={() => setActiveTab('register')}>ثبت‌نام</button>
                </div>

                {error && (
                    <div style={{background: 'rgba(255, 82, 82, 0.2)', color:'#ff8080', padding:'10px', borderRadius:'8px', marginBottom:'15px', textAlign:'center', fontSize:'0.9rem', border:'1px solid rgba(255, 82, 82, 0.3)'}}>
                        ⛔ {error}
                    </div>
                )}

                {activeTab === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>نام کاربری</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>رمز عبور</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading} style={{opacity: loading ? 0.7 : 1}}>
                            {loading ? 'در حال بررسی...' : 'ورود به سیستم'}
                        </button>
                    </form>
                ) : (
                    <div style={{textAlign:'center', padding:'20px', color:'#aaa'}}>
                        <p>بخش ثبت‌نام فعلاً غیرفعال است.</p>
                        <p style={{fontSize:'0.8rem'}}>لطفاً با پشتیبانی تماس بگیرید.</p>
                    </div>
                )}

                <div className={styles.footer}>
                    <Link href="/" className={styles.link}>بازگشت به خانه</Link>
                </div>

            </div>
        </div>
    );
}