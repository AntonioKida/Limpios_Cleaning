# Video processing commands used in the Fable run (2026-07-06).
# ffmpeg is NOT a repo dependency; this run used a local binary already present
# on the machine (OBS-bundled ffmpeg 7.0.2). Any ffmpeg >= 5 reproduces this.
#
#   $ff = "C:\Users\Omen\AppData\Local\Overwolf\Extensions\ncfplpkmiejjaklknfnkgcpapnhkggmlcppckhcb\270.0.25\obs\bin\64bit\ffmpeg.exe"
#
# Probe results (raw):
#   vid8.mp4  — 19.00s, 528x944 (9:16), 30fps, h264 + AAC audio.
#               Instagram repost: @limpioscleaning overlay + "Rick Ross · Hustlin'"
#               music credit BAKED INTO FRAMES from ~t=1.5s onward. Audio is
#               copyrighted music → any reuse must be MUTED; overlay argues for a
#               clean re-upload by the owner rather than self-hosting.
#   vid9.mp4  — 14.30s, 464x832 (9:16), 59.94fps, h264 + AAC audio.
#               Clean footage (no overlay): close-up scrubbing + squeegeeing a
#               soaped exterior window. Ideal window-cleaning proof.
#
# 1) Posters (match existing convention: native-res JPEG, /public/video-posters,
#    capital "VidN_poster.jpg"). vid8 poster taken at t=0.15s — BEFORE the IG
#    overlay/music credit fades in, so no third-party text ships in the poster.
& $ff -y -ss 0.15 -i Media\vid8.mp4 -frames:v 1 -q:v 3 public\video-posters\Vid8_poster.jpg
# (first attempt used t=0.50 — too dark/ambiguous; final poster uses t=10s,
#  where the gloved hand + soaped pane + sill read clearly as window cleaning)
& $ff -y -ss 10 -i Media\vid9.mp4 -frames:v 1 -q:v 3 public\video-posters\Vid9_poster.jpg

# 2) Small self-hosted MUTED clip for the Window Cleaning page (follows the
#    vid4-hero.mp4 precedent: small, silent, committed; bulk video stays out of
#    Git). -an strips the audio track entirely.
#    First attempt (fps=30, scale=464:832, crf 27, full 14.3s) → 3.57 MB: too
#    heavy for the soap-droplet noise. Final: first 10s, 24fps, 432x768, crf 31
#    → 1.39 MB committed.
& $ff -y -i Media\vid9.mp4 -an -t 10 -vf "fps=24,scale=432:768" -c:v libx264 -profile:v main -crf 31 -preset slow -movflags +faststart public\video\vid9-window.mp4

# vid8 is NOT self-hosted (IG overlay + music credit baked into frames).
# It gets a poster + a url-less facade seam in src/content/media.ts; the OWNER
# should re-upload the original (no overlay), muted, to unlisted YouTube and
# paste the ID — same pattern as Vid1–7.
