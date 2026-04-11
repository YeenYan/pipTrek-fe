<template>
  <div class="relative min-h-screen bg-bg flex items-center justify-center overflow-hidden">
    <!-- Tile mosaic layer -->
    <div class="absolute inset-0 tile-grid"></div>

    <!-- Teal glow — bottom left -->
    <div
      class="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#0d9488]/20 blur-[160px]"
    ></div>

    <!-- Green glow — bottom right -->
    <div
      class="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#10b981]/15 blur-[140px]"
    ></div>

    <!-- Faint top-right accent -->
    <div
      class="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[#0d9488]/8 blur-[120px]"
    ></div>

    <!-- Page content -->
    <div class="relative z-10 w-full max-w-md px-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Dark mosaic tile pattern — layered grids at different scales */
.tile-grid {
  background-image:
    /* Large block grid */
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    /* Medium block grid */
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    /* Subtle tile fill variation */
    linear-gradient(135deg, rgba(255, 255, 255, 0.008) 25%, transparent 25%),
    linear-gradient(225deg, rgba(255, 255, 255, 0.008) 25%, transparent 25%);
  background-size:
    160px 120px,
    160px 120px,
    80px 60px,
    80px 60px,
    160px 120px,
    160px 120px;
}
</style>
