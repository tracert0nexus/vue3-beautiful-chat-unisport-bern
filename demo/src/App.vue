<template>
  <div :style="{background: backgroundColor}">
    <beautiful-chat
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :close="closeChat"
      :colors="colors"
      :is-open="isChatOpen"
      :message-list="messageList"
      :message-styling="messageStyling"
      :on-message-was-sent="onMessageWasSent"
      :open="openChat"
      :participants="participants"
      :show-text-input="showTextInput"
    >
      <template v-slot:header>
        Unisport Sekretariat
      </template>
      <template v-slot:text-message-body="scopedProps">
        <p class="sc-message--text-content" v-html="scopedProps.messageText"></p>
        <p
          v-if="scopedProps.message.data.meta"
          class="sc-message--meta"
          :style="{color: scopedProps.messageColors.color}"
        >
          {{ scopedProps.message.data.meta }}
        </p>
      </template>
      <template v-slot:system-message-body="{message}"> [System]: {{ message.text }} </template>
    </beautiful-chat>
  </div>
</template>

<script>
import chatParticipants from './config/chatProfiles'
import availableColors from './config/colors'
import { fetchSuggestions } from './services/chatApi'

export default {
  name: 'unisport-chatbot',
  data() {
    return {
      participants: chatParticipants,
      messageList: [],
      isChatOpen: false,
      colors: null,
      availableColors,
      alwaysScrollToBottom: true,
      messageStyling: true,
      showTextInput: false
    }
  },
  created() {
    this.setColor('red')
  },
  mounted() {
    this.messageList.forEach((x) => (x.liked = false))
  },
  methods: {
    makeId() {
      return Math.floor(Math.random() * 1e9);
    },
    async loadSuggestionsForId(id) {
      try {
        const messages = await fetchSuggestions(id)
        const botMessages = messages.map(m => ({
          ...m,
          id: m.id ?? this.makeId()
        }))

        this.messageList = [...this.messageList, ...botMessages]

        const last = botMessages[botMessages.length - 1] || {}
        this.showTextInput = !(Array.isArray(last.suggestions) && last.suggestions.length > 0)
      } catch (err) {
        console.error(err)
        this.messageList = [
          ...this.messageList,
          {
            type: 'system',
            author: 'system',
            id: this.makeId(),
            data: { text: 'Konnte die Antwort nicht laden. Bitte wende dich an it.sport@unibe.ch' },
            suggestions: []
          }
        ]
      }
    },
    // TODO Freitext
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          id: Math.random(),
          data: {text}
        })
      }
    },
    onMessageWasSent(message) {
      const userMsg = { ...message, id: message.id ?? this.makeId() }
      this.messageList = [...this.messageList, userMsg]

      if (message.suggestionId) {
        this.loadSuggestionsForId(message.suggestionId)
      } else {
        // TODO Freitextfall
      }
    },
    async openChat() {
      this.isChatOpen = true
      if (this.messageList.length === 0) {
        await this.loadSuggestionsForId(-1) // Welcome
      }
    },
    closeChat() {
      this.isChatOpen = false
    },
    setColor(color = 'red') {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    }
  }
}
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}

.toggle a {
  text-decoration: none;
}

</style>
