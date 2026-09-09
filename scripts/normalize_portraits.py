#!/usr/bin/env python3
"""
Normalise roster portraits to one composition.

The source photos are cutouts shot at wildly different distances: some full-body
at a distance, some cropped through the head, some head-only. A single CSS crop
cannot serve all of them, so this pre-renders a derivative per portrait in which
every face lands in the same place.

The target is lifted from the executive card that already framed well
(C Yatin Reddy): crown at 14% down the box, eyes at 32%, chin at 50%, and the
head occupying ~36% of the box height. Faces therefore sit on the upper third
across the whole grid.

Input  : public/team/<tier>/<file>.png      (originals, never modified)
         measurements JSON, percentages of source dimensions, per file:
           {"crownY":.., "chinY":.., "faceCenterX":.., "framing":".."}
Output : public/team/framed/<tier>/<file>.webp

Run:  python3 scripts/normalize_portraits.py measurements.json
"""

import json
import os
import sys
import glob
from PIL import Image

MAX_SCALE = 2.9   # beyond this the source simply lacks pixels

SRC_ROOT = "public/team"
OUT_ROOT = "public/team/framed"

# Output boxes, rendered at 2x the CSS display size for retina.
PROFILES = {
    # The tiers were swapped: volunteers now carry the large square card and
    # executives the denser 4:5 one, so the derivative boxes swap with them.
    "execom": {"w": 520, "h": 650, "crown": 0.130, "head": 0.40},   # 4:5, tighter
    "volcom": {"w": 560, "h": 560, "crown": 0.145, "head": 0.36},   # 1:1
}

# Sources that hold no torso cannot show one. Framing the head a little larger
# reads as a deliberate close-up rather than a head floating in an empty box.
HEAD_FRACTION_BY_FRAMING = {
    "head-only": 1.45,
    "chest-up": 1.15,
    "waist-up": 1.0,
    "thigh-up": 1.0,
    "full-body": 0.95,
}


def normalise(src_path, out_path, m, profile):
    im = Image.open(src_path).convert("RGBA")
    W, H = im.size

    crown_px = m["crownY"] / 100.0 * H
    chin_px = m["chinY"] / 100.0 * H
    head_px = max(chin_px - crown_px, 1.0)
    face_cx = m["faceCenterX"] / 100.0 * W

    OW, OH = profile["w"], profile["h"]
    adj = HEAD_FRACTION_BY_FRAMING.get(m.get("framing", "waist-up"), 1.0)
    target_head = profile["head"] * adj * OH

    scale = target_head / head_px

    # The sources are only ~350-450px wide. Chasing a uniform head size on a
    # distant full-body shot can demand a 4-5x upscale, which turns to mush.
    # Past MAX_SCALE, accept a smaller head rather than ship a blurred face.
    capped = False
    if scale > MAX_SCALE:
        scale = MAX_SCALE
        capped = True

    sw, sh = max(int(round(W * scale)), 1), max(int(round(H * scale)), 1)
    scaled = im.resize((sw, sh), Image.LANCZOS)

    # Place the crown at the target height and the face on the vertical centreline.
    top = int(round(crown_px * scale - profile["crown"] * OH))
    left = int(round(face_cx * scale - OW / 2.0))

    # Never crop past the subject's own bottom edge if we can avoid it: if the
    # scaled image is shorter than the box, sit the subject on the bottom rather
    # than leaving them floating in space.
    if sh - top < OH:
        top = max(0, sh - OH) if sh >= OH else top

    canvas = Image.new("RGBA", (OW, OH), (0, 0, 0, 0))
    canvas.paste(scaled, (-left, -top), scaled)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    # WebP, not PNG: these are photographs with an alpha cutout, and PNG stores
    # them at roughly 5x the bytes for no visible gain.
    canvas.save(out_path, "WEBP", quality=86, method=6, exact=False)
    actual_head = head_px * scale
    return {"scale": round(scale, 3),
            "headPctOfBox": round(actual_head / OH * 100, 1),
            "capped": capped}


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: normalize_portraits.py <measurements.json>")
    measurements = json.load(open(sys.argv[1]))

    report = []
    for src in sorted(glob.glob(f"{SRC_ROOT}/*/*.png")):
        rel = os.path.relpath(src, SRC_ROOT)
        tier = rel.split(os.sep)[0]
        if tier == "framed":
            continue
        key = rel.replace(os.sep, "__")
        m = measurements.get(key) or measurements.get(rel)
        if not m:
            print(f"  !! no measurement for {rel} — skipped")
            continue
        out = os.path.join(OUT_ROOT, os.path.splitext(rel)[0] + ".webp")
        info = normalise(src, out, m, PROFILES[tier])
        report.append((rel, info))
        flag = "  <-- UPSCALE CAPPED, head smaller than target" if info["capped"] else ""
        print(f"  {rel:<50} scale={info['scale']:<6} head={info['headPctOfBox']:>5}% of box{flag}")

    print(f"\nnormalised {len(report)} portraits into {OUT_ROOT}/")


if __name__ == "__main__":
    main()
