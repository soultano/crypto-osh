import Link from "next/link";
import { Art } from "@/components/Illustrations";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary("ru");
  return (
    <section className="page-hero">
      <div className="container center">
        <Art name="madrasa" className="notfound-art art-float" />
        <h1>404</h1>
        <p className="lead">{t.notFound.title}</p>
        <Link className="btn" href="/ru">
          {t.notFound.back}
        </Link>
      </div>
    </section>
  );
}
