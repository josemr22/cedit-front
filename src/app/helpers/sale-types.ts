interface SaleType {
    code: string;
    label: string;
}

export const saleTypes: SaleType[] = [
    {
        code: 'u',
        label: 'uniformes'
    },
    {
        code: 'c',
        label: 'certificados'
    },
    {
        code: 's',
        label: 'servicios'
    },
]