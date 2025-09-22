<template>
  <div class="sc-header" :style="{background: colors.header.bg, color: colors.header.text, zIndex: 1}">
    <img v-if="titleImageUrl" class="sc-header--img" :src="titleImageUrl" alt="" />
    <div class="sc-header--title">
      <slot>
        {{ title }}
      </slot>
    </div>

    <div class="sc-header--close-button" @click="$emit('close')">
      <IconClose />
    </div>
  </div>
</template>

<script>
import {mapState} from './store/'
import IconClose from './components/icons/IconClose.vue'

export default {
  components: {IconClose},
  props: {
    /*icons: {
      type: Object,
      default: function () {
        return {
          close: {
            img: null,
            name: 'default'
          },
          minimize: {
            img: null,
            name: 'default'
          }
        }
      }
    },*/
    title: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inUserList: false
    }
  },
  computed: {
    ...mapState(['disableUserListToggle', 'titleImageUrl', 'showCloseButton', 'showMinimizeButton'])
  },
}
</script>

<style scoped>
.sc-header {
  min-height: 75px;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  box-sizing: border-box;
  display: flex;
}

.sc-header--img {
  border-radius: 50%;
  align-self: center;
  padding: 10px;
}

.sc-header--title {
  align-self: center;
  padding: 10px;
  flex: 1;
  user-select: none;
  font-size: 20px;
}

.sc-header--title.enabled {
  cursor: pointer;
  border-radius: 5px;
}

.sc-header--title.enabled:hover {
  box-shadow: 0px 2px 5px rgba(0.2, 0.2, 0.5, 0.1);
}

.sc-header--close-button {
  width: 40px;
  align-self: center;
  height: 40px;
  margin-right: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
  margin-left: auto;
}

.sc-header--minimize-button {
  width: 40px;
  align-self: center;
  height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
  margin-left: auto;
}

.sc-header--close-button:hover {
  box-shadow: 0px 2px 5px rgba(0.2, 0.2, 0.5, 0.1);
}

.sc-header--close-button img,
.sc-header--close-button svg {
  width: 100%;
  height: 100%;
  padding: 13px;
  box-sizing: border-box;
}

.sc-header--minimize-button img,
.sc-header--minimize-button svg {
  width: 100%;
  height: 100%;
  padding: 13px;
  box-sizing: border-box;
}

@media (max-width: 450px) {
  .sc-header {
    border-radius: 0px;
  }
}
</style>
