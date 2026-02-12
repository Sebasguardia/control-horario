import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} TimeTrack Pro. Todos los derechos reservados.
                </p>
                <div className="flex gap-4">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Privacidad
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Términos
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Contacto
                    </Link>
                </div>
            </div>
        </footer>
    );
}
