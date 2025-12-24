import { fetchAPI } from '../../../lib/fetchAPI';
import CoursesClient from './CoursesClient';
import styles from './courses.module.css';
// / 👇 این خط را اضافه کن (خیلی مهم)
export const runtime = 'edge';
async function getPageData() {
    try {
        const data = await fetchAPI(`
      query GetAllData {
        courses(first: 50) {
          nodes {
            slug
            title
            featuredImage { node { sourceUrl } }
            coursefields { price duration }
            
            # --- اصلاح نهایی: تمام فیلدها با حروف کوچک شروع می‌شوند (camelCase) ---
            courseCategories { nodes { name slug } }
            courseLevels { nodes { name slug } }
            courseTypes { nodes { name slug } }
          }
        }

        # --- لیست‌های سایدبار: اینجا هم حتماً باید با حروف کوچک شروع شود ---
        courseCategories(first: 100) { nodes { name slug count } }
        courseLevels(first: 100) { nodes { name slug count } }
        courseTypes(first: 100) { nodes { name slug count } }
      }
    `);

        return {
            courses: data?.courses?.nodes || [],
            // چون در کوئری حروف کوچک نوشتیم، در دیتا هم با حروف کوچک می‌آید
            categories: data?.courseCategories?.nodes || [],
            levels: data?.courseLevels?.nodes || [],
            types: data?.courseTypes?.nodes || [],
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return { courses: [], categories: [], levels: [], types: [] };
    }
}

export default async function CoursesArchive() {
    const { courses, categories, levels, types } = await getPageData();

    return (
        <div className={styles.mainContainer}>
            <section className={styles.searchHero}>
                <div className={styles.heroContent}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        کاوش در دنیای <span style={{ color: 'var(--secondary-purple)' }}>دانش پرتویی</span>
                    </h1>
                    <div className={styles.searchBox}>
                        <input type="text" className={styles.searchInput} placeholder="جستجو در بین دوره‌ها..." />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>
            </section>

            <CoursesClient
                initialCourses={courses}
                categories={categories}
                levels={levels}
                types={types}
            />
        </div>
    );
}