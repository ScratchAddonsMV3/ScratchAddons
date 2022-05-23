function fixConsole() {
  window._realConsole = {
    ...console,
  };
}

runMainWorldScript(fixConsole);

function runMainWorldScript(fn) {
  if (typeof fn !== "function") throw "Expected function";
  const div = document.createElement("div");
  div.setAttribute("onclick", `(${fn.toString()})()`);
  document.documentElement.appendChild(div);
  div.click();
  div.remove();
}
