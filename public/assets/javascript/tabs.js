// app/assets/javascript/tabs.js
var Tabs = class _Tabs {
  constructor($module, namespace, responsive, historyEnabled) {
    this.$module = $module;
    this.namespace = namespace;
    this.responsive = responsive;
    this.historyEnabled = historyEnabled;
    this.$tabs = $module.querySelectorAll(`.${this.namespace}__tab`);
    this.keys = {
      down: 40,
      left: 37,
      right: 39,
      up: 38
    };
    this.jsHiddenClass = `${this.namespace}__panel--hidden`;
    this.showEvent = new CustomEvent("tab.show");
    this.hideEvent = new CustomEvent("tab.hide");
  }
  init() {
    if (typeof window.matchMedia === "function" && this.responsive) {
      this.setupResponsiveChecks();
    } else {
      this.setup();
    }
  }
  setupResponsiveChecks() {
    this.mql = window.matchMedia("(min-width: 641px)");
    this.mql.addEventListener("change", this.checkMode.bind(this));
    this.checkMode();
  }
  checkMode() {
    if (this.mql.matches) {
      this.setup();
    } else {
      this.teardown();
    }
  }
  setup() {
    const { $module } = this;
    const { $tabs } = this;
    const $tabList = $module.querySelector(`.${this.namespace}__list`);
    const $tabListItems = $module.querySelectorAll(`.${this.namespace}__list-item`);
    if (!$tabs || !$tabList || !$tabListItems) {
      return;
    }
    $tabList.setAttribute("role", "tablist");
    $tabListItems.forEach(($item) => {
      $item.setAttribute("role", "presentation");
    });
    $tabs.forEach(($tab) => {
      this.setAttributes($tab);
      $tab.boundTabClick = this.onTabClick.bind(this);
      $tab.boundTabKeydown = this.onTabKeydown.bind(this);
      $tab.addEventListener("click", $tab.boundTabClick, true);
      $tab.addEventListener("keydown", $tab.boundTabKeydown, true);
      this.hideTab($tab);
    });
    const $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
    this.showTab($activeTab);
    if (this.historyEnabled) {
      $module.boundOnHashChange = this.onHashChange.bind(this);
      window.addEventListener("hashchange", $module.boundOnHashChange, true);
    }
  }
  teardown() {
    const { $module } = this;
    const { $tabs } = this;
    const $tabList = $module.querySelector(`.${this.namespace}__list`);
    const $tabListItems = $module.querySelectorAll(`.${this.namespace}__list-item`);
    if (!$tabs || !$tabList || !$tabListItems) {
      return;
    }
    $tabList.removeAttribute("role");
    $tabListItems.forEach(($item) => {
      $item.removeAttribute("role", "presentation");
    });
    $tabs.forEach(($tab) => {
      $tab.removeEventListener("click", $tab.boundTabClick, true);
      $tab.removeEventListener("keydown", $tab.boundTabKeydown, true);
      this.unsetAttributes($tab);
    });
    if (this.historyEnabled) {
      window.removeEventListener("hashchange", $module.boundOnHashChange, true);
    }
  }
  onHashChange() {
    const { hash } = window.location;
    const $tabWithHash = this.getTab(hash);
    if (!$tabWithHash) {
      return;
    }
    if (this.changingHash) {
      this.changingHash = false;
      return;
    }
    const $previousTab = this.getCurrentTab();
    this.hideTab($previousTab);
    this.showTab($tabWithHash);
    $tabWithHash.focus();
  }
  hideTab($tab) {
    this.unhighlightTab($tab);
    this.hidePanel($tab);
  }
  showTab($tab) {
    this.highlightTab($tab);
    this.showPanel($tab);
  }
  getTab(hash) {
    return this.$module.querySelector(`.${this.namespace}__tab[href="${hash}"]`);
  }
  setAttributes($tab) {
    const panelId = _Tabs.getHref($tab).slice(1);
    $tab.setAttribute("id", `tab_${panelId}`);
    $tab.setAttribute("role", "tab");
    $tab.setAttribute("aria-controls", panelId);
    $tab.setAttribute("aria-selected", "false");
    $tab.setAttribute("tabindex", "-1");
    const $panel = this.getPanel($tab);
    $panel.setAttribute("role", "tabpanel");
    $panel.setAttribute("aria-labelledby", $tab.id);
    $panel.classList.add(this.jsHiddenClass);
  }
  unsetAttributes($tab) {
    $tab.removeAttribute("id");
    $tab.removeAttribute("role");
    $tab.removeAttribute("aria-controls");
    $tab.removeAttribute("aria-selected");
    $tab.removeAttribute("tabindex");
    const $panel = this.getPanel($tab);
    $panel.removeAttribute("role");
    $panel.removeAttribute("aria-labelledby");
    $panel.removeAttribute("tabindex");
    $panel.classList.remove(this.jsHiddenClass);
  }
  onTabClick(e) {
    if (!e.target.classList.contains(`${this.namespace}__tab`)) {
      e.stopPropagation();
      e.preventDefault();
    }
    e.preventDefault();
    const $newTab = e.target;
    const $currentTab = this.getCurrentTab();
    this.hideTab($currentTab);
    this.showTab($newTab);
    this.createHistoryEntry($newTab);
  }
  createHistoryEntry($tab) {
    if (this.historyEnabled) {
      const $panel = this.getPanel($tab);
      const { id } = $panel;
      $panel.id = "";
      this.changingHash = true;
      window.location.hash = _Tabs.getHref($tab).slice(1);
      $panel.id = id;
    }
  }
  onTabKeydown(e) {
    switch (e.keyCode) {
      case this.keys.left:
      case this.keys.up:
        this.activatePreviousTab();
        e.preventDefault();
        break;
      case this.keys.right:
      case this.keys.down:
        this.activateNextTab();
        e.preventDefault();
        break;
      default:
    }
  }
  activateNextTab() {
    const currentTab = this.getCurrentTab();
    const nextTabListItem = currentTab.parentNode.nextElementSibling;
    let nextTab;
    if (nextTabListItem) {
      nextTab = nextTabListItem.querySelector(`.${this.namespace}__tab`);
    }
    if (nextTab) {
      this.hideTab(currentTab);
      this.showTab(nextTab);
      nextTab.focus();
      this.createHistoryEntry(nextTab);
    }
  }
  activatePreviousTab() {
    const currentTab = this.getCurrentTab();
    const previousTabListItem = currentTab.parentNode.previousElementSibling;
    let previousTab;
    if (previousTabListItem) {
      previousTab = previousTabListItem.querySelector(`.${this.namespace}__tab`);
    }
    if (previousTab) {
      this.hideTab(currentTab);
      this.showTab(previousTab);
      previousTab.focus();
      this.createHistoryEntry(previousTab);
    }
  }
  getPanel($tab) {
    const $panel = this.$module.querySelector(_Tabs.getHref($tab));
    return $panel;
  }
  showPanel($tab) {
    const $panel = this.getPanel($tab);
    $panel.classList.remove(this.jsHiddenClass);
    $panel.dispatchEvent(this.showEvent);
  }
  hidePanel(tab) {
    const $panel = this.getPanel(tab);
    $panel.classList.add(this.jsHiddenClass);
    $panel.dispatchEvent(this.hideEvent);
  }
  unhighlightTab($tab) {
    $tab.setAttribute("aria-selected", "false");
    $tab.parentNode.classList.remove(`${this.namespace}__list-item--selected`);
    $tab.setAttribute("tabindex", "-1");
  }
  highlightTab($tab) {
    $tab.setAttribute("aria-selected", "true");
    $tab.parentNode.classList.add(`${this.namespace}__list-item--selected`);
    $tab.setAttribute("tabindex", "0");
  }
  getCurrentTab() {
    return this.$module.querySelector(`.${this.namespace}__list-item--selected .${this.namespace}__tab`);
  }
  // this is because IE doesn't always return the actual value but a relative full path
  // should be a utility function most prob
  // http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
  static getHref($tab) {
    const href = $tab.getAttribute("href");
    const hash = href.slice(href.indexOf("#"), href.length);
    return hash;
  }
};
var tabs_default = ({ namespace = "nhsuk-tabs", responsive = true, historyEnabled = true } = {}) => {
  const tabs = document.querySelectorAll(`[data-module="${namespace}"]`);
  tabs.forEach((el) => {
    new Tabs(el, namespace, responsive, historyEnabled).init();
  });
};
export {
  tabs_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3RhYnMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNsYXNzIFRhYnMge1xuICBjb25zdHJ1Y3RvcigkbW9kdWxlLCBuYW1lc3BhY2UsIHJlc3BvbnNpdmUsIGhpc3RvcnlFbmFibGVkKSB7XG4gICAgdGhpcy4kbW9kdWxlID0gJG1vZHVsZVxuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlXG4gICAgdGhpcy5yZXNwb25zaXZlID0gcmVzcG9uc2l2ZVxuICAgIHRoaXMuaGlzdG9yeUVuYWJsZWQgPSBoaXN0b3J5RW5hYmxlZFxuICAgIHRoaXMuJHRhYnMgPSAkbW9kdWxlLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RoaXMubmFtZXNwYWNlfV9fdGFiYClcblxuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGRvd246IDQwLFxuICAgICAgbGVmdDogMzcsXG4gICAgICByaWdodDogMzksXG4gICAgICB1cDogMzhcbiAgICB9XG4gICAgdGhpcy5qc0hpZGRlbkNsYXNzID0gYCR7dGhpcy5uYW1lc3BhY2V9X19wYW5lbC0taGlkZGVuYFxuXG4gICAgdGhpcy5zaG93RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RhYi5zaG93JylcbiAgICB0aGlzLmhpZGVFdmVudCA9IG5ldyBDdXN0b21FdmVudCgndGFiLmhpZGUnKVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5tYXRjaE1lZGlhID09PSAnZnVuY3Rpb24nICYmIHRoaXMucmVzcG9uc2l2ZSkge1xuICAgICAgdGhpcy5zZXR1cFJlc3BvbnNpdmVDaGVja3MoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHVwKClcbiAgICB9XG4gIH1cblxuICBzZXR1cFJlc3BvbnNpdmVDaGVja3MoKSB7XG4gICAgLy8gJG1xLWJyZWFrcG9pbnRzOiAoXG4gICAgLy8gbW9iaWxlOiAzMjBweCxcbiAgICAvLyB0YWJsZXQ6IDY0MXB4LFxuICAgIC8vIGRlc2t0b3A6IDc2OXB4LFxuICAgIC8vIGxhcmdlIC0gZGVza3RvcDogOTkwcHhcbiAgICAvLyApO1xuICAgIHRoaXMubXFsID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDY0MXB4KScpXG4gICAgdGhpcy5tcWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5jaGVja01vZGUuYmluZCh0aGlzKSlcbiAgICB0aGlzLmNoZWNrTW9kZSgpXG4gIH1cblxuICBjaGVja01vZGUoKSB7XG4gICAgaWYgKHRoaXMubXFsLm1hdGNoZXMpIHtcbiAgICAgIHRoaXMuc2V0dXAoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH1cblxuICBzZXR1cCgpIHtcbiAgICBjb25zdCB7ICRtb2R1bGUgfSA9IHRoaXNcbiAgICBjb25zdCB7ICR0YWJzIH0gPSB0aGlzXG4gICAgY29uc3QgJHRhYkxpc3QgPSAkbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMubmFtZXNwYWNlfV9fbGlzdGApXG4gICAgY29uc3QgJHRhYkxpc3RJdGVtcyA9ICRtb2R1bGUucXVlcnlTZWxlY3RvckFsbChgLiR7dGhpcy5uYW1lc3BhY2V9X19saXN0LWl0ZW1gKVxuXG4gICAgaWYgKCEkdGFicyB8fCAhJHRhYkxpc3QgfHwgISR0YWJMaXN0SXRlbXMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgICR0YWJMaXN0LnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0JylcblxuICAgICR0YWJMaXN0SXRlbXMuZm9yRWFjaCgoJGl0ZW0pID0+IHtcbiAgICAgICRpdGVtLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKVxuICAgIH0pXG5cbiAgICAkdGFicy5mb3JFYWNoKCgkdGFiKSA9PiB7XG4gICAgICAvLyBTZXQgSFRNTCBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoJHRhYilcblxuICAgICAgLy8gU2F2ZSBib3VuZGVkIGZ1bmN0aW9ucyB0byB1c2Ugd2hlbiByZW1vdmluZyBldmVudCBsaXN0ZW5lcnMgZHVyaW5nIHRlYXJkb3duXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICR0YWIuYm91bmRUYWJDbGljayA9IHRoaXMub25UYWJDbGljay5iaW5kKHRoaXMpXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICR0YWIuYm91bmRUYWJLZXlkb3duID0gdGhpcy5vblRhYktleWRvd24uYmluZCh0aGlzKVxuXG4gICAgICAvLyBIYW5kbGUgZXZlbnRzXG4gICAgICAkdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgJHRhYi5ib3VuZFRhYkNsaWNrLCB0cnVlKVxuICAgICAgJHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgJHRhYi5ib3VuZFRhYktleWRvd24sIHRydWUpXG5cbiAgICAgIC8vIFJlbW92ZSBvbGQgYWN0aXZlIHBhbmVsc1xuICAgICAgdGhpcy5oaWRlVGFiKCR0YWIpXG4gICAgfSlcblxuICAgIC8vIFNob3cgZWl0aGVyIHRoZSBhY3RpdmUgdGFiIGFjY29yZGluZyB0byB0aGUgVVJMJ3MgaGFzaCBvciB0aGUgZmlyc3QgdGFiXG4gICAgY29uc3QgJGFjdGl2ZVRhYiA9IHRoaXMuZ2V0VGFiKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB8fCB0aGlzLiR0YWJzWzBdXG4gICAgdGhpcy5zaG93VGFiKCRhY3RpdmVUYWIpXG5cbiAgICAvLyBIYW5kbGUgaGFzaGNoYW5nZSBldmVudHNcbiAgICBpZiAodGhpcy5oaXN0b3J5RW5hYmxlZCkge1xuICAgICAgJG1vZHVsZS5ib3VuZE9uSGFzaENoYW5nZSA9IHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgJG1vZHVsZS5ib3VuZE9uSGFzaENoYW5nZSwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICB0ZWFyZG93bigpIHtcbiAgICBjb25zdCB7ICRtb2R1bGUgfSA9IHRoaXNcbiAgICBjb25zdCB7ICR0YWJzIH0gPSB0aGlzXG4gICAgY29uc3QgJHRhYkxpc3QgPSAkbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMubmFtZXNwYWNlfV9fbGlzdGApXG4gICAgY29uc3QgJHRhYkxpc3RJdGVtcyA9ICRtb2R1bGUucXVlcnlTZWxlY3RvckFsbChgLiR7dGhpcy5uYW1lc3BhY2V9X19saXN0LWl0ZW1gKVxuXG4gICAgaWYgKCEkdGFicyB8fCAhJHRhYkxpc3QgfHwgISR0YWJMaXN0SXRlbXMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgICR0YWJMaXN0LnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpXG5cbiAgICAkdGFiTGlzdEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICAkaXRlbS5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJylcbiAgICB9KVxuXG4gICAgJHRhYnMuZm9yRWFjaCgoJHRhYikgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGV2ZW50c1xuICAgICAgJHRhYi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsICR0YWIuYm91bmRUYWJDbGljaywgdHJ1ZSlcbiAgICAgICR0YWIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsICR0YWIuYm91bmRUYWJLZXlkb3duLCB0cnVlKVxuXG4gICAgICAvLyBVbnNldCBIVE1MIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMudW5zZXRBdHRyaWJ1dGVzKCR0YWIpXG4gICAgfSlcblxuICAgIGlmICh0aGlzLmhpc3RvcnlFbmFibGVkKSB7XG4gICAgICAvLyBSZW1vdmUgaGFzaGNoYW5nZSBldmVudCBoYW5kbGVyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICRtb2R1bGUuYm91bmRPbkhhc2hDaGFuZ2UsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIGNvbnN0IHsgaGFzaCB9ID0gd2luZG93LmxvY2F0aW9uXG4gICAgY29uc3QgJHRhYldpdGhIYXNoID0gdGhpcy5nZXRUYWIoaGFzaClcbiAgICBpZiAoISR0YWJXaXRoSGFzaCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBjaGFuZ2luZyB0aGUgaGFzaFxuICAgIGlmICh0aGlzLmNoYW5naW5nSGFzaCkge1xuICAgICAgdGhpcy5jaGFuZ2luZ0hhc2ggPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gU2hvdyBlaXRoZXIgdGhlIGFjdGl2ZSB0YWIgYWNjb3JkaW5nIHRvIHRoZSBVUkwncyBoYXNoIG9yIHRoZSBmaXJzdCB0YWJcbiAgICBjb25zdCAkcHJldmlvdXNUYWIgPSB0aGlzLmdldEN1cnJlbnRUYWIoKVxuXG4gICAgdGhpcy5oaWRlVGFiKCRwcmV2aW91c1RhYilcbiAgICB0aGlzLnNob3dUYWIoJHRhYldpdGhIYXNoKVxuICAgICR0YWJXaXRoSGFzaC5mb2N1cygpXG4gIH1cblxuICBoaWRlVGFiKCR0YWIpIHtcbiAgICB0aGlzLnVuaGlnaGxpZ2h0VGFiKCR0YWIpXG4gICAgdGhpcy5oaWRlUGFuZWwoJHRhYilcbiAgfVxuXG4gIHNob3dUYWIoJHRhYikge1xuICAgIHRoaXMuaGlnaGxpZ2h0VGFiKCR0YWIpXG4gICAgdGhpcy5zaG93UGFuZWwoJHRhYilcbiAgfVxuXG4gIGdldFRhYihoYXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuJG1vZHVsZS5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLm5hbWVzcGFjZX1fX3RhYltocmVmPVwiJHtoYXNofVwiXWApXG4gIH1cblxuICBzZXRBdHRyaWJ1dGVzKCR0YWIpIHtcbiAgICAvLyBzZXQgdGFiIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBwYW5lbElkID0gVGFicy5nZXRIcmVmKCR0YWIpLnNsaWNlKDEpXG4gICAgJHRhYi5zZXRBdHRyaWJ1dGUoJ2lkJywgYHRhYl8ke3BhbmVsSWR9YClcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKVxuICAgICR0YWIuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgcGFuZWxJZClcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpXG4gICAgJHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcblxuICAgIC8vIHNldCBwYW5lbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKVxuICAgICRwYW5lbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKVxuICAgICRwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsICR0YWIuaWQpXG4gICAgJHBhbmVsLmNsYXNzTGlzdC5hZGQodGhpcy5qc0hpZGRlbkNsYXNzKVxuICB9XG5cbiAgdW5zZXRBdHRyaWJ1dGVzKCR0YWIpIHtcbiAgICAvLyB1bnNldCB0YWIgYXR0cmlidXRlc1xuICAgICR0YWIucmVtb3ZlQXR0cmlidXRlKCdpZCcpXG4gICAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKVxuICAgICR0YWIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJylcbiAgICAkdGFiLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpXG4gICAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JylcblxuICAgIC8vIHVuc2V0IHBhbmVsIGF0dHJpYnV0ZXNcbiAgICBjb25zdCAkcGFuZWwgPSB0aGlzLmdldFBhbmVsKCR0YWIpXG4gICAgJHBhbmVsLnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpXG4gICAgJHBhbmVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JylcbiAgICAkcGFuZWwucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpXG4gICAgJHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5qc0hpZGRlbkNsYXNzKVxuICB9XG5cbiAgb25UYWJDbGljayhlKSB7XG4gICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoYCR7dGhpcy5uYW1lc3BhY2V9X190YWJgKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0ICRuZXdUYWIgPSBlLnRhcmdldFxuICAgIGNvbnN0ICRjdXJyZW50VGFiID0gdGhpcy5nZXRDdXJyZW50VGFiKClcbiAgICB0aGlzLmhpZGVUYWIoJGN1cnJlbnRUYWIpXG4gICAgdGhpcy5zaG93VGFiKCRuZXdUYWIpXG4gICAgdGhpcy5jcmVhdGVIaXN0b3J5RW50cnkoJG5ld1RhYilcbiAgfVxuXG4gIGNyZWF0ZUhpc3RvcnlFbnRyeSgkdGFiKSB7XG4gICAgaWYgKHRoaXMuaGlzdG9yeUVuYWJsZWQpIHtcbiAgICAgIGNvbnN0ICRwYW5lbCA9IHRoaXMuZ2V0UGFuZWwoJHRhYilcblxuICAgICAgLy8gU2F2ZSBhbmQgcmVzdG9yZSB0aGUgaWRcbiAgICAgIC8vIHNvIHRoZSBwYWdlIGRvZXNuJ3QganVtcCB3aGVuIGEgdXNlciBjbGlja3MgYSB0YWIgKHdoaWNoIGNoYW5nZXMgdGhlIGhhc2gpXG4gICAgICBjb25zdCB7IGlkIH0gPSAkcGFuZWxcbiAgICAgICRwYW5lbC5pZCA9ICcnXG4gICAgICB0aGlzLmNoYW5naW5nSGFzaCA9IHRydWVcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gVGFicy5nZXRIcmVmKCR0YWIpLnNsaWNlKDEpXG4gICAgICAkcGFuZWwuaWQgPSBpZFxuICAgIH1cbiAgfVxuXG4gIG9uVGFiS2V5ZG93bihlKSB7XG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIGNhc2UgdGhpcy5rZXlzLmxlZnQ6XG4gICAgICBjYXNlIHRoaXMua2V5cy51cDpcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVByZXZpb3VzVGFiKClcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIHRoaXMua2V5cy5yaWdodDpcbiAgICAgIGNhc2UgdGhpcy5rZXlzLmRvd246XG4gICAgICAgIHRoaXMuYWN0aXZhdGVOZXh0VGFiKClcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9XG5cbiAgYWN0aXZhdGVOZXh0VGFiKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUYWIgPSB0aGlzLmdldEN1cnJlbnRUYWIoKVxuICAgIGNvbnN0IG5leHRUYWJMaXN0SXRlbSA9IGN1cnJlbnRUYWIucGFyZW50Tm9kZS5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICBsZXQgbmV4dFRhYlxuXG4gICAgaWYgKG5leHRUYWJMaXN0SXRlbSkge1xuICAgICAgbmV4dFRhYiA9IG5leHRUYWJMaXN0SXRlbS5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLm5hbWVzcGFjZX1fX3RhYmApXG4gICAgfVxuICAgIGlmIChuZXh0VGFiKSB7XG4gICAgICB0aGlzLmhpZGVUYWIoY3VycmVudFRhYilcbiAgICAgIHRoaXMuc2hvd1RhYihuZXh0VGFiKVxuICAgICAgbmV4dFRhYi5mb2N1cygpXG4gICAgICB0aGlzLmNyZWF0ZUhpc3RvcnlFbnRyeShuZXh0VGFiKVxuICAgIH1cbiAgfVxuXG4gIGFjdGl2YXRlUHJldmlvdXNUYWIoKSB7XG4gICAgY29uc3QgY3VycmVudFRhYiA9IHRoaXMuZ2V0Q3VycmVudFRhYigpXG4gICAgY29uc3QgcHJldmlvdXNUYWJMaXN0SXRlbSA9IGN1cnJlbnRUYWIucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgbGV0IHByZXZpb3VzVGFiXG5cbiAgICBpZiAocHJldmlvdXNUYWJMaXN0SXRlbSkge1xuICAgICAgcHJldmlvdXNUYWIgPSBwcmV2aW91c1RhYkxpc3RJdGVtLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMubmFtZXNwYWNlfV9fdGFiYClcbiAgICB9XG4gICAgaWYgKHByZXZpb3VzVGFiKSB7XG4gICAgICB0aGlzLmhpZGVUYWIoY3VycmVudFRhYilcbiAgICAgIHRoaXMuc2hvd1RhYihwcmV2aW91c1RhYilcbiAgICAgIHByZXZpb3VzVGFiLmZvY3VzKClcbiAgICAgIHRoaXMuY3JlYXRlSGlzdG9yeUVudHJ5KHByZXZpb3VzVGFiKVxuICAgIH1cbiAgfVxuXG4gIGdldFBhbmVsKCR0YWIpIHtcbiAgICBjb25zdCAkcGFuZWwgPSB0aGlzLiRtb2R1bGUucXVlcnlTZWxlY3RvcihUYWJzLmdldEhyZWYoJHRhYikpXG4gICAgcmV0dXJuICRwYW5lbFxuICB9XG5cbiAgc2hvd1BhbmVsKCR0YWIpIHtcbiAgICBjb25zdCAkcGFuZWwgPSB0aGlzLmdldFBhbmVsKCR0YWIpXG4gICAgJHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5qc0hpZGRlbkNsYXNzKVxuICAgICRwYW5lbC5kaXNwYXRjaEV2ZW50KHRoaXMuc2hvd0V2ZW50KVxuICB9XG5cbiAgaGlkZVBhbmVsKHRhYikge1xuICAgIGNvbnN0ICRwYW5lbCA9IHRoaXMuZ2V0UGFuZWwodGFiKVxuICAgICRwYW5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuanNIaWRkZW5DbGFzcylcbiAgICAkcGFuZWwuZGlzcGF0Y2hFdmVudCh0aGlzLmhpZGVFdmVudClcbiAgfVxuXG4gIHVuaGlnaGxpZ2h0VGFiKCR0YWIpIHtcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpXG4gICAgJHRhYi5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5uYW1lc3BhY2V9X19saXN0LWl0ZW0tLXNlbGVjdGVkYClcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKVxuICB9XG5cbiAgaGlnaGxpZ2h0VGFiKCR0YWIpIHtcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJylcbiAgICAkdGFiLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChgJHt0aGlzLm5hbWVzcGFjZX1fX2xpc3QtaXRlbS0tc2VsZWN0ZWRgKVxuICAgICR0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJylcbiAgfVxuXG4gIGdldEN1cnJlbnRUYWIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJG1vZHVsZS5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLm5hbWVzcGFjZX1fX2xpc3QtaXRlbS0tc2VsZWN0ZWQgLiR7dGhpcy5uYW1lc3BhY2V9X190YWJgKVxuICB9XG5cbiAgLy8gdGhpcyBpcyBiZWNhdXNlIElFIGRvZXNuJ3QgYWx3YXlzIHJldHVybiB0aGUgYWN0dWFsIHZhbHVlIGJ1dCBhIHJlbGF0aXZlIGZ1bGwgcGF0aFxuICAvLyBzaG91bGQgYmUgYSB1dGlsaXR5IGZ1bmN0aW9uIG1vc3QgcHJvYlxuICAvLyBodHRwOi8vbGFicy50aGVzZWRheXMuY29tL2Jsb2cvMjAxMC8wMS8wOC9nZXR0aW5nLXRoZS1ocmVmLXZhbHVlLXdpdGgtanF1ZXJ5LWluLWllL1xuICBzdGF0aWMgZ2V0SHJlZigkdGFiKSB7XG4gICAgY29uc3QgaHJlZiA9ICR0YWIuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICBjb25zdCBoYXNoID0gaHJlZi5zbGljZShocmVmLmluZGV4T2YoJyMnKSwgaHJlZi5sZW5ndGgpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxufVxuXG4vKipcbiAqIE1haW4gZnVuY3Rpb24gdG8gaW52b2tlIHRhYnMuIENhbiBiZSBjYWxsZWQgYXMgZm9sbG93cyB0byBhbHRlciB2YXJpb3VzIGZlYXR1cmVzXG4gKlxuICogVGFicyh7aGlzdG9yeUVuYWJsZWQ6IGZhbHNlfSk7XG4gKiBUYWJzKHtyZXNwb25zaXZlOiBmYWxzZX0pO1xuICogVGFicyh7bmFtZXNwYWNlOiAnbXktY3VzdG9tLW5hbWVzcGFjZSd9KTsgIC8vIEFsdGVycyBjbGFzc2VzIGFsbG93aW5nIGFsdGVybmF0aXZlIGNzc1xuICovXG5leHBvcnQgZGVmYXVsdCAoeyBuYW1lc3BhY2UgPSAnbmhzdWstdGFicycsIHJlc3BvbnNpdmUgPSB0cnVlLCBoaXN0b3J5RW5hYmxlZCA9IHRydWUgfSA9IHt9KSA9PiB7XG4gIGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1tb2R1bGU9XCIke25hbWVzcGFjZX1cIl1gKVxuICB0YWJzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgbmV3IFRhYnMoZWwsIG5hbWVzcGFjZSwgcmVzcG9uc2l2ZSwgaGlzdG9yeUVuYWJsZWQpLmluaXQoKVxuICB9KVxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxJQUFNLE9BQU4sTUFBTSxNQUFLO0FBQUEsRUFDVCxZQUFZLFNBQVMsV0FBVyxZQUFZLGdCQUFnQjtBQUMxRCxTQUFLLFVBQVU7QUFDZixTQUFLLFlBQVk7QUFDakIsU0FBSyxhQUFhO0FBQ2xCLFNBQUssaUJBQWlCO0FBQ3RCLFNBQUssUUFBUSxRQUFRLGlCQUFpQixJQUFJLEtBQUssU0FBUyxPQUFPO0FBRS9ELFNBQUssT0FBTztBQUFBLE1BQ1YsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsSUFBSTtBQUFBLElBQ047QUFDQSxTQUFLLGdCQUFnQixHQUFHLEtBQUssU0FBUztBQUV0QyxTQUFLLFlBQVksSUFBSSxZQUFZLFVBQVU7QUFDM0MsU0FBSyxZQUFZLElBQUksWUFBWSxVQUFVO0FBQUEsRUFDN0M7QUFBQSxFQUVBLE9BQU87QUFDTCxRQUFJLE9BQU8sT0FBTyxlQUFlLGNBQWMsS0FBSyxZQUFZO0FBQzlELFdBQUssc0JBQXNCO0FBQUEsSUFDN0IsT0FBTztBQUNMLFdBQUssTUFBTTtBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQUEsRUFFQSx3QkFBd0I7QUFPdEIsU0FBSyxNQUFNLE9BQU8sV0FBVyxvQkFBb0I7QUFDakQsU0FBSyxJQUFJLGlCQUFpQixVQUFVLEtBQUssVUFBVSxL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
