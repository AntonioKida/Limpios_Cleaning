/**
 * Video content layer. All clips are vertical 9:16 (Papo's real footage).
 * Vid1–7 are hosted as **unlisted YouTube** videos streamed via a click-to-load
 * youtube-nocookie facade — NOT served as raw MP4 from the repo. Exceptions:
 * small muted clips committed via `selfSrc` (vid4 hero loop, vid9 window
 * proof). vid8 is a poster-only seam until the owner re-uploads it clean
 * (see its TODO). All clips are **silent** (muted), so no subtitle track is
 * needed (`spokenCaptions` stays false; the seam remains for spoken clips).
 *
 * The descriptive labels in `Video.captions.<id>` (translatable) are the visible
 * caption + accessible name — not subtitle tracks.
 */
import type { ServiceSlug } from "./services";

const YT = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

export type VideoId =
  | "vid1"
  | "vid2"
  | "vid3"
  | "vid4"
  | "vid5"
  | "vid6"
  | "vid7"
  | "vid8"
  | "vid9";

export type VideoProvider = "youtube" | "vimeo";

export interface VideoClip {
  id: VideoId;
  /** Committed portrait poster (fallback + facade still). */
  poster: string;
  /** youtube-nocookie / vimeo embed URL. Absent → the facade renders the
   *  poster as a clean still (no dead control) until the owner wires an ID. */
  url?: string;
  /** Small muted self-hosted MP4 (committed) — plays natively on click instead
   *  of a streamed embed. The vid4 hero loop + vid9 window clip use this. */
  selfSrc?: string;
  provider: VideoProvider;
  /** Has spoken content → force EN/ES captions on the embed. */
  spokenCaptions: boolean;
  durationSec: number;
  /** Service detail pages this clip appears on. */
  services: ServiceSlug[];
}

// Posters live in /public/video-posters (committed). Unlisted YouTube IDs below.
export const videos: Record<VideoId, VideoClip> = {
  vid1: {
    id: "vid1",
    poster: "/video-posters/Vid1_poster.jpg",
    url: YT("vKDWt7Y_nq4"), // commercial electrostatic disinfection (office)
    provider: "youtube",
    spokenCaptions: false, // silent re-upload
    durationSec: 36,
    services: ["commercial"],
  },
  vid2: {
    id: "vid2",
    poster: "/video-posters/Vid2_poster.jpg",
    url: YT("oMk5WvdESvU"), // residential deep clean
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 18,
    services: ["residential"],
  },
  vid3: {
    id: "vid3",
    poster: "/video-posters/Vid3_poster.jpg",
    url: YT("zEYDdHTSN-o"), // detail: blinds & windows (standards)
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 14,
    services: ["deep-cleaning"],
  },
  vid4: {
    id: "vid4",
    poster: "/video-posters/Vid4_poster.jpg",
    url: YT("oJ9s_1biHW0"), // office/conference-room disinfection (hero + commercial)
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 16,
    services: ["commercial"],
  },
  vid5: {
    id: "vid5",
    poster: "/video-posters/Vid5_poster.jpg",
    url: YT("jG_B7pq3s2w"), // move-in / move-out
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 16,
    services: ["move-in-out"],
  },
  vid6: {
    id: "vid6",
    poster: "/video-posters/Vid6_poster.jpg",
    url: YT("EP6Gl9g_rGI"), // electrostatic disinfection explainer (motion graphic)
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 10,
    services: ["commercial"],
  },
  vid7: {
    id: "vid7",
    poster: "/video-posters/Vid7_poster.jpg",
    url: YT("-4ugsDLVN8U"), // team selfie + move-out clean (About / meet-the-team)
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 19,
    services: [],
  },
  vid8: {
    id: "vid8",
    poster: "/video-posters/Vid8_poster.jpg",
    // Move-in job walkthrough (bedroom → marble bath → toilet detailing).
    // TODO: owner re-uploads the CLEAN original (the on-hand copy is an
    // Instagram repost with a baked-in overlay + copyrighted music credit),
    // muted, to unlisted YouTube — then paste the ID here like Vid1–7.
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 19,
    services: ["move-in-out"],
  },
  vid9: {
    id: "vid9",
    poster: "/video-posters/Vid9_poster.jpg",
    // Window-cleaning close-up (scrub + squeegee on a soaped pane). Muted
    // trimmed clip self-hosted below — clean footage, no embed needed.
    selfSrc: "/video/vid9-window.mp4",
    provider: "youtube",
    spokenCaptions: false,
    durationSec: 10,
    services: ["window-cleaning"],
  },
};

export const heroVideo = videos.vid4;
export const standardsVideo = videos.vid3;
export const teamVideo = videos.vid7;

/**
 * The hero accent is self-hosted (committed MP4) rather than the YouTube facade:
 * the clips were uploaded as Shorts, so the embed inherits YouTube's cramped
 * Shorts player chrome — unacceptable for the always-visible hero. Self-hosting
 * Vid4 (small, silent) gives a clean, contained, chrome-free muted autoplay loop.
 * The other placements stay on the click-to-load facade.
 */
export const heroVideoSrc = "/video/vid4-hero.mp4";

export function videoForService(slug: string): VideoClip[] {
  return (Object.values(videos) as VideoClip[]).filter((v) =>
    v.services.includes(slug as ServiceSlug),
  );
}
