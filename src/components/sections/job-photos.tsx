import Image from "next/image";
import { useTranslations } from "next-intl";
import type { JobPhoto } from "@/content/photos";

/**
 * Strip of real job-site photos (round-3 batch) at native portrait aspect.
 * Distinct from the before/after gallery: these are single "on the job" and
 * finished-result shots, not draggable pairs. Alt text is translatable
 * (`Photos.alts.<id>`); blur placeholders ship from photo-blur.json.
 */
export function JobPhotos({ photos }: { photos: JobPhoto[] }) {
  const t = useTranslations("Photos");

  if (photos.length === 0) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {photos.map((photo) => (
        <li key={photo.id} className="w-full max-w-[15rem] sm:w-60">
          <Image
            src={photo.src}
            alt={t(`alts.${photo.id}`)}
            width={photo.width}
            height={photo.height}
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            sizes="(max-width: 640px) 80vw, 240px"
            className="h-auto w-full rounded-2xl border border-border object-cover shadow-md ring-1 ring-black/5"
          />
        </li>
      ))}
    </ul>
  );
}
