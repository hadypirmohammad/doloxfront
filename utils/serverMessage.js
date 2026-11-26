export const serverMessage = (raw) => {
    if (!raw) return '';
    try {
        const data = JSON.parse(raw);
        if (typeof data === 'string') return data;
        if (data?.message) return data.message;
        if (data?.title) return data.title;
        const errors = data?.errors || data;
        if (errors && typeof errors === 'object') {
            const first = Object.values(errors).flat().filter((item) => typeof item === 'string');
            if (first.length) return first.join(' - ');
        }
    } catch (error) {
        return raw.slice(0, 200);
    }
    return '';
};
