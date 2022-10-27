# vue-responsive-image-loader

響應式圖片元件

## 功能
* 讓圖片依照傳入的 `sizes` 設定載入顯示
* 當圖片載入失敗時，嘗試載入其他尺寸的圖片
* 圖片載入動畫效果

## Props
| 名稱 | 資料型別 | 必須 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| images | Object | `V` | `{ original: ''}` | 圖片設定，範例： `{ w400: 'https://i.imgur.com/JWLBxWl-w400.jpeg', original: 'https://i.imgur.com/JWLBxWl.jpeg' }`，w400 為寬度 400 以上時，要載入的圖片設定 |
| sizes | String |  | `100vw` | 請參考： [The Image Embed element#sizes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes) |
| alt | String |  | `''` | 替代文字 |
| showLoadingEffect | Boolean |  | `true` | 是否顯示載入特效 |

## 使用說明
### 安裝
```javascript
yarn install @readr-media/vue-responsive-image-loader
```

### 在元件中使用
```vue
<template>
  <ResponsiveImageLoader :images="image" :alt="alt" />
</template>

<script>
// 導入元件
import { ResponsiveImageLoader } from '@readr-media/vue-responsive-image-loader'
export default {
  components: {
    ResponsiveImageLoader,
  },
  data() {
    return {
      images: {
        w400: 'https://i.imgur.com/JWLBxWl-w400.jpeg',
        original: 'https://i.imgur.com/JWLBxWl.jpeg'
      }
    }
  }
}
</script>

<style>
// 導入 CSS，請使用 style，不要使用 style scoped
@import '@readr-media/vue-responsive-image-loader/dist/style.css';
</style>

```

### 客製化載入效果
```vue
<template>
  <ResponsiveImageLoader :images="image" :alt="alt">
    <template v-slot:loading>
      <!-- 客製化載入效果請放這裡 -->
    </template>
  </ResponsiveImageLoader>
</template>
```
