/**
 * Video content layer. All seven clips are vertical 9:16 (Papo's real footage).
 * Per the brief they are streamed (YouTube-nocookie / Vimeo) via a click-to-load
 * facade — NOT served as raw MP4 from the repo. Until the clips are uploaded, the
 * `url` is undefined and the facade renders the committed portrait poster as a
 * clean still, so the layout is complete in preview without any "coming soon"
 * placeholder text. Drop the embed URL in `url` and the play affordance activates.
 *
 * Captions/labels live in the `Video.captions.<id>` catalogs (translatable).
 */
import type { ServiceSlug } from "./services";

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

// Posters live in /public/video-posters (committed). Embed URLs are TODO — paste
// the unlisted YouTube/Vimeo URL per clip and the facade becomes playable.
export const videos: Record<VideoId, VideoClip> = {
  vid1: {
    id: "vid1",
    poster: "/video-posters/Vid1_poster.jpg",
    url: undefined, // TODO: commercial electrostatic disinfection (office)
    provider: "youtube",
    spokenCaptions: true,
    durationSec: 36,
    services: ["commercial"],
  },
  vid2: {
    id: "vid2",
    poster: "/video-posters/Vid2_poster.jpg",
    url: undefined, // TODO: "this is how we do it" residential montage
    provider: "youtube",
    spokenCaptions: true,
    durationSec: 18,
    services: ["residential"],
  },
  vid3: {
    id: "vid3",
    poster: "/video-posters/Vid3_poster.jpg",
    url: undefined, // TODO: detailing + operating-principles standards
    provider: "youtube",
    spokenCaptions: true,
    durationSec: 14,
    services: ["deep-cleaning"],
  },
  vid4: {
    id: "vid4",
    poster: "/video-posters/Vid4_poster.jpg",
    url: undefined, // TODO: conference-room disinfection (hero accent + commercial)
    provider: "youtube",
    spokenCaptions: false, // ambient, no speech
    durationSec: 16,
    services: ["commercial"],
  },
  vid5: {
    id: "vid5",
    poster: "/video-posters/Vid5_poster.jpg",
    url: undefined, // TODO: move-in/out montage
    provider: "youtube",
    spokenCaptions: true,
    durationSec: 16,
    services: ["move-in-out"],
  },
  vid6: {
    id: "vid6",
    poster: "/video-posters/Vid6_poster.jpg",
    url: undefined, // TODO: electrostatic disinfection explainer (motion graphic)
    provider: "youtube",
    spokenCaptions: true,
    durationSec: 10,
    services: ["commercial"],
  },
  vid7: {
    id: "vid7",
    poster: "/video-posters/Vid7_poster.jpg",
    url: undefined, // TODO: team selfie + move-out clean (About / meet-the-team)
    provider: "youtube",
    spokenCaptions: true,
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
