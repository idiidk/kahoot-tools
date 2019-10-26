import Vue from "vue";
import { Adapters } from "kahoot-api";

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

class PlayerGroup {
  constructor(name, target, canBeRemoved = true, selected = false) {
    this.name = name;
    this.players = [];
    this.joined = 0;
    this.errored = 0;
    this.target = target;
    this.selected = selected;
    this.canBeRemoved = canBeRemoved;
  }

  get totalPlayers() {
    return this.joined + this.errored;
  }
}

const manager = new Vue({
  data() {
    return {
      pin: null,
      session: null,
      socket: null,
      groups: []
    };
  },
  methods: {
    async initPlayer() {
      const socket = await this.session.openSocket();
      const player = new Adapters.Player(socket);
      return player;
    },
    addPlayerGroup(name, amount, canBeRemoved, selectOnAdd) {
      return new Promise(async (resolve, reject) => {
        const group = new PlayerGroup(name, amount, canBeRemoved, selectOnAdd);
        this.groups.push(group);

        for (let i = 0; i < amount; i++) {
          this.initPlayer().then(player => {
            let finalName;
            if (amount === 1) {
              finalName = name;
            } else {
              finalName = `${name}-${i}`;
            }

            group.players.push(player);
            return player
              .join(finalName)
              .then(() => {
                player.on("message", msg =>
                  this.$globals.$emit("message", msg)
                );
                group.joined++;
              })
              .catch(error => {
                group.errored++;
                reject(error);
              });
          });

          await wait(100);
        }

        resolve(group);
      });
    },
    getGroupByName(name) {
      return this.groups.filter(group => group.name === name);
    },
    getGroupByPlayerCid(cid) {
      return this.groups.find(group => {
        return group.players.find(player => player.cid === cid);
      });
    },
    getSelectedGroups() {
      return this.groups.filter(group => group.selected);
    },
    getSelectedPlayers() {
      const groups = this.getSelectedGroups();
      let players = [];

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        players = players.concat(group.players);
      }

      return players;
    },
    removeSelectedGroups() {
      const selected = this.getSelectedGroups();
      const canBeRemoved = selected.filter(
        playerGroup => playerGroup.canBeRemoved
      );

      canBeRemoved.forEach(playerGroup => {
        for (let i = 0; i < playerGroup.players.length; i++) {
          const player = playerGroup.players[i];
          player.leave();
        }

        this.groups.splice(this.groups.indexOf(playerGroup), 1);
      });
    }
  }
});

export default {
  install(MainVue) {
    MainVue.prototype.$kahoot = manager;
  }
};

export { PlayerGroup };
