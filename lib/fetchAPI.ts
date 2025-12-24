

const API_URL = 'https://fatehi.ipapda.com/graphql';

export async function fetchAPI(query: string, { variables }: { variables?: any } = {}, token?: string) {
    const headers: any = { 'Content-Type': 'application/json' };

    // اگر توکن داشتیم (یعنی کاربر لاگین بود)، به هدر اضافه کن
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store', // برای پنل‌ها نباید کش کنیم چون دیتا لحظه‌ای عوض میشه
    });

    const json = await res.json();

    if (json.errors) {
        console.error("WordPress API Errors:", json.errors);
        throw new Error('Failed to fetch API');
    }

    return json.data;
}