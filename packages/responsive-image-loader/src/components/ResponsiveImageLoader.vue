<template>
  <span :class="classes.container">
    <img
      v-if="fallback === false"
      :class="classes.image"
      :src="images[resolution]"
      :alt="alt"
      :srcset="srcset"
      :sizes="sizes"
      loading="lazy"
      @load="loadHandler($event)"
      @error="errorHandler($event)"
    />
    <img
      v-else
      :class="classes.image"
      :src="images[resolution]"
      :alt="alt"
      @load="loadHandler($event)"
      @error="errorHandler($event)"
    />
    <div v-show="loading && showLoadingEffect" :class="classes.loading">
      <slot name="loading">
        <img :src="require('../assets/loading.svg')" />
      </slot>
    </div>
  </span>
</template>

<script>
import classes from './ResponsiveImageLoader.module.css'

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
      classes,
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
      this.fallback = true
      const imageSrc = event.target?.currentSrc
      if (imageSrc) {
        const index = this.resolutionList.findIndex((p) => p[1] === imageSrc)

        if (index !== -1) {
          if (index < this.resolutionList.length) {
            this.resolution = this.resolutionList[index + 1][0]
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
}
</script>
