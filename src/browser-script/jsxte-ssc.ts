import type { PropsSelectorDescriptor } from "../props-selector/props-selector-types";

export function jsxte_ssc_init() {
  /* Polyfill indexOf. */
  let indexOf: <T, E extends T>(haystack: T[], elem: E) => number;

  if (typeof Array.prototype.indexOf === "function") {
    indexOf = function (haystack, needle) {
      return haystack.indexOf(needle);
    };
  } else {
    indexOf = function (haystack, needle) {
      let i = 0,
        idx = -1,
        found = false;
      const length = haystack.length;

      while (i < length && !found) {
        if (haystack[i] === needle) {
          idx = i;
          found = true;
        }

        i++;
      }

      return idx;
    };
  }

  type EventEmitterListener = (...args: any[]) => void;

  class __cls_JSXTEEventEmitter {
    private events: Record<string, EventEmitterListener[]> = {};

    emit(event: string, ...args: any[]) {
      let i: number, listeners: EventEmitterListener[], length: number;

      const eventListeners = this.events[event];

      if (typeof eventListeners === "object") {
        listeners = eventListeners.slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
          listeners[i]!.apply(this, args);
        }
      }
    }

    on(event: string, listener: EventEmitterListener): void {
      if (typeof this.events[event] !== "object") {
        this.events[event] = [];
      }

      this.events[event]!.push(listener);
    }

    removeListener(event: string, listener: EventEmitterListener) {
      const eventListeners = this.events[event];

      if (typeof eventListeners === "object") {
        const idx = indexOf(eventListeners, listener);

        if (idx > -1) {
          eventListeners.splice(idx, 1);
        }
      }
    }
  }

  const __JSXTEEventEmitter = new __cls_JSXTEEventEmitter();

  class FetchCacheEntry {
    readonly id: string;

    private readonly expireAt: number;
    private readonly url: string;
    private readonly body: string;
    readonly result: string;

    constructor(
      id: string,
      url: string,
      body: string,
      result: string,
      expire = 30 * 60 * 1000
    ) {
      this.id = id;
      this.url = url;
      this.body = body;
      this.result = result;
      this.expireAt = Date.now() + expire;
    }

    isValid() {
      return Date.now() < this.expireAt;
    }

    isMatch(url: string, body: string) {
      return this.url === url && this.body === body;
    }
  }

  class FetchCache {
    private cache: Array<FetchCacheEntry> = [];

    private flush() {
      this.cache = this.cache.filter((e) => e.isValid());
    }

    get(url: string, body: string) {
      this.flush();

      return this.cache.find((e) => e.isMatch(url, body))?.result;
    }

    set(
      id: string,
      url: string,
      body: string,
      result: string,
      expire?: number
    ) {
      this.cache.unshift(new FetchCacheEntry(id, url, body, result, expire));
    }

    clear(id?: string) {
      if (id) {
        this.cache = this.cache.filter((e) => e.id === id);
      } else {
        this.cache = [];
      }
    }
  }

  const cache = new FetchCache();

  const request = async (params: {
    url: string;
    id: string;
    body?: object;
    expire?: number;
    useCache: boolean;
  }): Promise<string> => {
    const { useCache, url, body, expire, id } = params;

    const bodyData = body ? JSON.stringify(body) : "{}";

    if (useCache) {
      const cachedResult = cache.get(url, bodyData);

      if (cachedResult) return cachedResult;
    }

    const response = await fetch(url, {
      method: "POST",
      body: bodyData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Fetch request has failed. [url="${url}"]\n${response.statusText}`
      );
    }

    const result = await response.text();

    cache.set(id, url, bodyData, result, expire);

    return result;
  };

  const isObject = (v: unknown): v is object => {
    return typeof v === "object" && v !== null;
  };

  const isPropSelector = (v: object): v is PropsSelectorDescriptor<any> => {
    return (
      "jsxte_ssc_selector_token" in v &&
      (v as { jsxte_ssc_selector_token: any })["jsxte_ssc_selector_token"] ===
        "jsxte_ssc_selector_token"
    );
  };

  const resolveSelector = (
    selector: PropsSelectorDescriptor<any>,
    event?: Event
  ): any => {
    if (selector.list) {
      switch (selector.type) {
        case "select":
        case "input": {
          const elem = document.querySelectorAll(
            selector.selector
          ) as NodeListOf<HTMLInputElement>;
          if (!elem) return undefined;

          return [...elem].map((input) => input.value);
        }
        case "checkbox": {
          const elem = document.querySelectorAll(
            selector.selector
          ) as NodeListOf<HTMLInputElement>;
          if (!elem) return undefined;

          return [...elem].map((elem) => [elem.value, elem.checked]);
        }
        default:
          return undefined;
      }
    } else {
      switch (selector.type) {
        case "select":
        case "input": {
          const elem = document.querySelector(selector.selector) as
            | HTMLInputElement
            | undefined;
          if (!elem) return undefined;

          return elem.value;
        }
        case "checkbox": {
          const elem = document.querySelector(selector.selector) as
            | HTMLInputElement
            | undefined;
          if (!elem) return undefined;

          return [elem.value, elem.checked];
        }
        case "radio": {
          const radios = document.querySelectorAll(
            selector.selector
          ) as NodeListOf<HTMLInputElement>;

          return [...radios].find((r) => r.checked === true)?.value;
        }
        case "event": {
          return eval(selector.selector)(event);
        }
        default:
          return undefined;
      }
    }
  };

  const replaceSelectors = (v: object | any[], event?: Event): object => {
    if (Array.isArray(v)) {
      return v.map((elem) => {
        if (isObject(elem)) {
          if (isPropSelector(elem)) {
            return resolveSelector(elem, event);
          } else {
            return replaceSelectors(elem, event);
          }
        } else {
          return elem;
        }
      });
    }

    return Object.fromEntries(
      Object.entries(v).map(([key, value]) => {
        if (isObject(value)) {
          if (isPropSelector(value)) {
            return [key, resolveSelector(value, event)];
          } else {
            return [key, replaceSelectors(value, event)];
          }
        } else {
          return [key, value];
        }
      })
    );
  };

  class ServerComponent extends HTMLElement {
    private endpoint: string | null = null;
    private uid: string | null = null;
    private listeners = new Map<string, { remove(): void }>();

    constructor() {
      super();
    }

    protected connectedCallback() {
      this.endpoint = this.getAttribute("data-component-endpoint");
      this.uid = this.getAttribute("data-sscuid");

      this.listenForComponentUpdateEvents();
    }

    protected disconnectedCallback() {
      this.listeners.forEach((l) => l.remove());
    }

    private parseProps(event?: Event, props?: string): object {
      const parsed = JSON.parse(props ? window.atob(props) : "{}");

      return replaceSelectors(parsed, event);
    }

    private async updateComponentHtml(event?: Event, props?: string) {
      if (!this.endpoint) return;

      const url = new URL(this.endpoint, window.location.origin);

      const html = await request({
        id: this.uid ?? "undefined",
        url: url.toString(),
        body: this.parseProps(event, props),
        expire: Number(this.getAttribute("data-expire") ?? "0") || undefined,
        useCache: Boolean(this.getAttribute("data-use-cache") ?? true),
      });

      this.innerHTML = html;
    }

    private async listenForComponentUpdateEvents() {
      if (!this.uid) return;
      const eventName = `update:${this.uid}`;

      this.listeners.get(eventName)?.remove();

      const handler = (e?: Event, props?: string) =>
        this.updateComponentHtml(e, props);

      __JSXTEEventEmitter.on(eventName, handler);

      this.listeners.set(eventName, {
        remove: () => {
          __JSXTEEventEmitter.removeListener(eventName, handler);
          this.listeners.delete(eventName);
        },
      });
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
      if (name === "data-component-endpoint") {
        this.endpoint = newValue;
        return void this.updateComponentHtml();
      }
      if (name === "data-sscuid") {
        this.uid = newValue;
        return void this.listenForComponentUpdateEvents();
      }
    }
  }

  window.customElements.define("server-component", ServerComponent);

  function ssc_updateComponent(id: string, event?: Event, props?: string) {
    __JSXTEEventEmitter.emit(`update:${id}`, event, props);
  }

  function ssc_clearCache(id?: string) {
    cache.clear(id);
  }

  Object.assign(window, { ssc_updateComponent, ssc_clearCache });
}
