interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <header className="bg-primary text-white py-4">
            <div className="container">
                <h1 className="h3 mb-0">{title}</h1>
                {subtitle && <p className="mb-0 mt-1">{subtitle}</p>}
            </div>
        </header>

    );
}