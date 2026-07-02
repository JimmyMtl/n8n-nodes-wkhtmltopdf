# n8n image preloaded with the `wkhtmltopdf` CLI that n8n-nodes-wkhtmltopdf
# shells out to. The community node itself is installed at startup by
# entrypoint.sh from the source mounted at /opt/code-temp.
#
# n8n 2.x ships as a Docker Hardened Image (Alpine, no package manager), and
# unlike samba-client, `wkhtmltopdf` is NOT in Alpine's repos. So we:
#   1. pull the prebuilt patched-Qt binary + libwkhtmltox from the de-facto
#      standard `surnet/alpine-wkhtmltopdf` image, and
#   2. collect wkhtmltopdf's runtime libraries + fonts from a matching plain
#      Alpine and copy the resulting files into the final image.
# Keep ALPINE_VERSION in sync with the Alpine baked into WKHTMLTOPDF_IMAGE so
# the copied libssl3/freetype/etc. match what libwkhtmltox links against.

# Declared before the first FROM so it can be used in the final FROM line.
ARG N8N_VERSION=2.28.3
ARG ALPINE_VERSION=3.24
ARG WKHTMLTOPDF_IMAGE=surnet/alpine-wkhtmltopdf:3.23.4-0.12.6-full

# ---- Stage 1: collect wkhtmltopdf's runtime dependency files ----
FROM alpine:${ALPINE_VERSION} AS deps
RUN set -eux; \
    apk add --no-cache \
        libstdc++ libx11 libxrender libxext libssl3 ca-certificates \
        fontconfig freetype ttf-dejavu ttf-liberation \
        2>&1 | tee /tmp/apk.log; \
    mkdir -p /export; \
    # Copy every file owned by the packages apk installed. Base Alpine packages
    # (musl, etc.) are already in the hardened image, so they never appear in
    # the "Installing" lines and aren't copied/clobbered.
    for p in $(grep -oE 'Installing [^ ]+' /tmp/apk.log | awk '{print $2}'); do \
        apk info -L "$p" | grep -E '^(usr/|lib/|etc/)' | while read -r f; do \
            [ -e "/$f" ] || continue; \
            mkdir -p "/export/$(dirname "$f")"; \
            cp -a "/$f" "/export/$f"; \
        done; \
    done

# ---- Stage 2: prebuilt wkhtmltopdf (patched qt) binary + libs ----
FROM ${WKHTMLTOPDF_IMAGE} AS wkhtmltopdf

# ---- Stage 3: n8n + wkhtmltopdf ----
FROM n8nio/n8n:${N8N_VERSION}

USER root

COPY --from=deps /export/ /
# Place the binary at /usr/bin so the node's Linux default
# (wkhtmltopdf.command = '/usr/bin/wkhtmltopdf') works with no extra config.
COPY --from=wkhtmltopdf /bin/wkhtmltopdf /usr/bin/wkhtmltopdf
COPY --from=wkhtmltopdf /bin/wkhtmltoimage /usr/bin/wkhtmltoimage
COPY --from=wkhtmltopdf /lib/libwkhtmltox* /lib/

# Build the font cache and fail the build early if wkhtmltopdf can't run
# (missing lib, font, etc.).
RUN fc-cache -f && wkhtmltopdf --version

COPY docker/entrypoint.sh /usr/local/bin/wkhtmltopdf-node-entrypoint.sh
RUN chmod +x /usr/local/bin/wkhtmltopdf-node-entrypoint.sh

USER node

ENTRYPOINT ["tini", "--", "/usr/local/bin/wkhtmltopdf-node-entrypoint.sh"]
