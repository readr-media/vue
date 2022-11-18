<template>
  <span class="container">
    <img
      v-if="fallback === false"
      class="image"
      :data-src="images[resolution]"
      :data-srcset="srcset"
      :sizes="sizes"
      ref="image"
      :style="style"
      data-order="1"
      @load="loadHandler($event)"
      @error="errorHandler($event)"
    />
    <img
      v-else
      class="image"
      :data-src="images[resolution]"
      :alt="alt"
      ref="image"
      :style="style"
      data-order="2"
      @load="loadHandler($event)"
      @error="errorHandler($event)"
    />
    <div v-show="loading && showLoadingEffect" class="loading">
      <slot name="loading">
        <img :src="require('../assets/loading.svg')" />
      </slot>
    </div>
  </span>
</template>

<script>
import lozad from 'lozad'

export default {
  name: 'ResponsiveImageLoader',
  props: {
    images: {
      type: Object,
      default: () => {
        return {
          original: '',
        }
      },
      required: true,
    },
    sizes: {
      type: String,
      default: '100vw',
    },
    alt: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0)',
    },
    height: {
      type: Number,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    showLoadingEffect: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      resolution: 'original',
      fallback: false,
      loading: true,
    }
  },
  methods: {
    loadHandler(event) {
      this.loading = false
      const imageSrc = event.target?.currentSrc
      if (imageSrc) {
        const pair = this.resolutionList.find((p) => p[1] === imageSrc)

        if (pair) {
          this.resolution = pair[0]
        }
      }
    },
    errorHandler(event) {
      // if current image failed, try next image with larger size
      if (this.fallback === true) {
        this.$refs.image.setAttribute('srcset', '')
      }
      this.fallback = true
      const imageSrc = event.target?.currentSrc
      if (imageSrc) {
        const index = this.resolutionList.findIndex((p) => p[1] === imageSrc)

        if (index !== -1) {
          if (index < this.resolutionList.length) {
            this.resolution = this.resolutionList[index + 1][0]
            this.$refs.image.src = this.images[this.resolution]
          } else {
            this.loading = false
          }
        }
      }
    },
  },
  computed: {
    resolutionList() {
      // keep original at end of array
      return Object.entries(this.images)
        .filter((pair) => (/^w\d+$/.test(pair[0]) && pair[1]) || pair[0] === 'original')
        .sort((pairA, pairB) => {
          // pair: [w800, image-w800.jpg], [original, image.jpg]
          const keyA = pairA[0]
          const keyB = pairB[0]

          const regex = /(\d+)/
          const matchedA = keyA.match(regex)
          const matchedB = keyB.match(regex)

          if (matchedA && matchedB) {
            // match: [800]
            const sizeA = Number(matchedA[0])
            const sizeB = Number(matchedB[0])

            return sizeA - sizeB
          } else if (matchedA) {
            return -1
          } else {
            return 1
          }
        })
    },
    srcset() {
      const str = this.resolutionList
        .filter((pair) => pair[0] !== 'original')
        .map((pair) => {
          const regex = /(\d+)/
          const width = pair[0].match(regex)[0]

          return `${pair[1]} ${width}w`
        })
        .join(',')

      return str
    },
    aspectRatio() {
      // Calculate the aspect ratio of the image if the width and the height are given.
      if (!this.width || !this.height) return null

      return (this.height / this.width) * 100
    },
    style() {
      /**
       * The background color is used as a placeholder while loading the image.
       * You can use the dominant color of the image to improve perceived performance.
       * See: https://manu.ninja/dominant-colors-for-lazy-loading-images/
       */
      const style = { backgroundColor: this.backgroundColor }

      if (this.width) style.width = `${this.width}px`

      /**
       * If the image is still loading and an aspect ratio could be calculated,
       * we apply the calculated aspect ratio by using padding top.
       */
      const applyAspectRatio = this.loading && this.aspectRatio
      if (applyAspectRatio) {
        // Prevent flash of unstyled image after the image is loaded.
        style.height = 0

        // Scale the image container according to the aspect ratio.
        style.paddingTop = `${this.aspectRatio}%`
      }

      return style
    },
  },
  watch: {
    srcset: {
      handler(newValue) {
        // when images.original and computed srcset are both empty, stop loading effect
        if (newValue === '' && this.images[this.resolution] === '') this.loading = false
      },
      immediate: true,
    },
  },
  mounted() {
    // We initialize Lozad.js on the img element of our component.
    const observer = lozad(this.$refs.image)
    observer.observe()
  },
}
</script>

<style scoped>
.container {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
}
.image {
  width: inherit;
  height: inherit;
  object-fit: cover;
  object-position: center;
}
.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
