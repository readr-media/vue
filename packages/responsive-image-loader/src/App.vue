<template>
  <div style="width: 500px; height: 200px">
    <ResponsiveImageLoader :images="images" alt="沒有圖片" />
  </div>
</template>

<script>
import { ResponsiveImageLoader } from './index'
export default {
  name: 'App',
  components: {
    ResponsiveImageLoader,
  },
  data() {
    return {
      images: {
        w2400:
          'https://storage.googleapis.com/static-vision-tw-dev/images/d015b152-1300-489c-aee5-c9fc137ab14a-w2400.jpg',
        w1600:
          'https://storage.googleapis.com/static-vision-tw-dev/images/d015b152-1300-489c-aee5-c9fc137ab14a-w1600.jpg',
        w1280: '',
        w800: 'https://storage.googleapis.com/static-vision-tw-dev/images/d015b152-1300-489c-aee5-c9fc137ab14a-w800.jpg',
        w480: 'https://storage.googleapis.com/static-vision-tw-dev/images/d015b152-1300-489c-aee5-c9fc137ab14a-w480.jpg',
        original: 'https://storage.googleapis.com/static-vision-tw-dev/images/d015b152-1300-489c-aee5-c9fc137ab14a.jpg',
      },
    }
  },
}
</script>
