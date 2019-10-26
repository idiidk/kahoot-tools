import { Events } from "kahoot-api";

export default {
  install(Vue) {
    Vue.component();

    const Globals = new Vue({
      data: {
        options: {
          dark: false,
          selectOnAdd: true,
          stealthMode: false
        },
        notification: {
          text: "",
          type: "",
          active: false
        },
        mainPlayer: null,
        activeKahoot: {},
        nemeses: []
      },
      methods: {
        notify: function(text, type) {
          this.notification.text = text;
          this.notification.type = type;
          this.notification.active = true;
        },
        initListeners() {
          this.$on("message", message => {
            switch (message.id) {
              case Events.revealAnswer: {
                const nemesis = message.content.nemesis;
                if (nemesis) {
                  if (!this.$kahoot.getGroupByPlayerCid(nemesis.cid)) {
                    const found = this.nemeses.find(
                      player => player.cid === nemesis.cid
                    );

                    if (!found) {
                      this.notify(
                        `Able to take over ${nemesis.name} with ${nemesis.totalScore} points!`,
                        "info"
                      );
                      this.nemeses.push(nemesis);
                    } else {
                      this.nemeses.forEach((player, index) => {
                        if (player.cid === nemesis.cid) {
                          this.nemeses[index].totalScore = nemesis.totalScore;
                        }
                      });
                    }
                  }
                }
                break;
              }
            }
          });
        }
      },
      watch: {
        options: {
          handler() {
            localStorage.setItem("options", JSON.stringify(this.options));
          },
          deep: true
        }
      }
    });

    Vue.prototype.$globals = Globals;
  }
};
