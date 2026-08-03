export function generateVehicleSlug(brand: string, model: string, id: string): string {
    const safeBrand = (brand || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const safeModel = (model || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${safeBrand}-${safeModel}-${id}`.replace(/(^-|-$)+/g, '');
}

export function extractIdFromSlug(slug: string): string {
    return slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)?.[0] || slug;
}
