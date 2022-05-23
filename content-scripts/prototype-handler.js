function injectPrototype() {
  const oldBind = Function.prototype.bind;
  // Use custom event target
  window.__scratchAddonsTraps = new EventTarget();
  const onceMap = (__scratchAddonsTraps._onceMap = Object.create(null));

  Function.prototype.bind = function (...args) {
    if (Function.prototype.bind === oldBind) {
      // Just in case some code stores the bind function once on startup, then always uses it.
      return oldBind.apply(this, args);
    } else if (
      args[0] &&
      Object.prototype.hasOwnProperty.call(args[0], "editingTarget") &&
      Object.prototype.hasOwnProperty.call(args[0], "runtime")
    ) {
      onceMap.vm = args[0];
      // After finding the VM, return to previous Function.prototype.bind
      Function.prototype.bind = oldBind;
      return oldBind.apply(this, args);
    } else {
      return oldBind.apply(this, args);
    }
  };
}

runMainWorldScript(injectPrototype);

function runMainWorldScript(fn) {
  if (typeof fn !== "function") throw "Expected function";
  const div = document.createElement("div");
  div.setAttribute("onclick", `(${fn.toString()})()`);
  document.documentElement.appendChild(div);
  div.click();
  div.remove();
}
