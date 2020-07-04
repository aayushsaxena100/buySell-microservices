import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, client: string, url: string) {
    this._client = nats.connect(clusterId, client, { url });
    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        console.log("error connecting to NATS");
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
