# YOUNOYA gift edition media

Twelve existing product photographs were visually matched to the objects named in the Mercury edition source. The numbered photo folders do **not** match the source SKU numbers. Mappings and unchanged-original/export hashes are in `photography.json`.

The owner asked us to create imagery for missing photographs. Built-in imagegen produced three restrained graphite/watercolour studies: bottle format, itr format, and the selenite/rose-quartz horse pairing. These are illustrations, not exact merchandise photography. Every use carries an illustration caption and alt text. No new branding, stone certification, dimensions or inclusion quantities are asserted. Prompts are preserved in `illustration-prompts.json`; original generated files remain at their recorded paths.

Responsive exports: 480/800/1200px for photographs where resolution permits, 480/800px for the generated studies. No upscaling, creative Python editing, source-photo modification or replacement of the original archive. Pillow was used only for orientation-aware responsive encoding. Existing photo backgrounds are retained. Three lower-page object entries with no verified photograph (element wall hanging, sage/palo santo and copper kalash) intentionally use text instead of a fabricated product photo. Every edition has a photographed or explicitly illustrated hero.

Frontend registry: `src/data/giftRevealMedia.js` (paths relative to younoya-web), consumed by `giftRevealItems.js`. Keep item aliases explicit. A new asset needs visual identification, source provenance, appropriate caption and intrinsic dimensions; do not identify it from its folder number alone.

QA evidence in `qa/`: desktop/mobile screenshots from the built frontend, actual downloaded 1080-square Post and 1080-by-1920 Story cards, and the 48-route/responsive check report. Screenshot dimensions reflect the browser capture surface; verified CSS viewports were 1440x900 and 430x932. No real orders, payments or external messages were created.
