/**
 * Video content layer. All seven clips are vertical 9:16 (Papo's real footage),
 * hosted as **unlisted YouTube** videos and streamed via a click-to-load
 * youtube-nocookie facade — NOT served as raw MP4 from the repo. The clips are
 * **silent** (muted re-uploads), so no subtitle track is needed (`spokenCaptions`
 * stays false; the seam remains for any future spoken clip).
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
  | "vid7";

export type VideoProvider = "youtube" | "vimeo";

export interface VideoClip {
  id: VideoId;
  /** Committed portrait poster (fallback + facade still). */
  poster: string;
  /** TODO: youtube-nocookie/vimeo *embed* URL once the clip is uploaded. */
  url?: string;
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
};

export const heroVideo = videos.vid4;
export const standardsVideo = videos.vid3;
export const teamVideo = videos.vid7;

export function videoForService(slug: string): VideoClip[] {
  return (Object.values(videos) as VideoClip[]).filter((v) =>
    v.services.includes(slug as ServiceSlug),
  );
}
