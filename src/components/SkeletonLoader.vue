<template>
  <div class="skeleton-wrap">
    <div class="sk sk-title"></div>
    <div class="sk sk-image"></div>
    <div class="sk-options">
      <div class="sk sk-option" v-for="i in 4" :key="i"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.4vh, 16px);
  padding: 16px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.sk {
  background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-shine) 50%, var(--sk-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 8px;
}

.sk-title  { width: 220px; height: 30px; }
.sk-image  { width: 180px; height: 180px; max-height: 30vh; max-width: 30vh; border-radius: 50%; }

.sk-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
}

.sk-option { width: 250px; height: 42px; border-radius: 22px; }
</style>
