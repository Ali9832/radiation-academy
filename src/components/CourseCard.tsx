import Link from 'next/link';

interface CourseCardProps {
    title: string;
    level: string; // مقدماتی، پیشرفته و...
    levelColor?: string; // رنگ بج
    imageIcon: string; // فعلا ایموجی یا آیکون
    duration: string;
    students: string;
    price: string;
}

const CourseCard = ({ title, level, levelColor = '#00D4FF', imageIcon, duration, students, price }: CourseCardProps) => {
    return (
        <div className="course-card">
      <span className="course-badge" style={{ borderColor: levelColor, color: levelColor }}>
        {level}
      </span>
            <div className="course-image">{imageIcon}</div>
            <h3 className="course-title">{title}</h3>
            <div className="course-info">
                <span>{duration}</span>
                <span>{students}</span>
            </div>
            <div className="course-footer">
                <span className="price">{price}</span>
                {/* لینک به صفحه تکی دوره (بعدا میسازیم) */}
                <Link href="/courses/single-slug" className="btn-card">
                    مشاهده دوره ←
                </Link>
            </div>
        </div>
    );
};

export default CourseCard;