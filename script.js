import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

document.addEventListener("DOMContentLoaded", async () => {
  const $form = document.getElementById("messageForm");
  const $input = document.getElementById("messageInput");
  const $template = document.getElementById("template-message");
  const $messages = document.getElementById("messages");
  const $container = document.querySelector("main");
  const $button = document.getElementById("btnEnviar");

  const $info = document.querySelector("small");
  let messages = [];

  const SELECTED_MODEL = "gemma-2b-it-q4f32_1-MLC";

  const engine = CreateMLCEngine(SELECTED_MODEL, {
    initProgressCallback: (info) => {
      console.log("initProgressCallback", info);
      $info.textContent = `${info.text}%`;
      if (info.progress === 1) {
        $button.removeAttribute("disabled");
      }
    },
  });

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();

    if (messageText !== "") {
      $input.value = ""; // Limpiar el input después de enviar el mensaje
    }
    addMessage(messageText, "user");
    $button.setAttribute("disabled", true);

    const reply = await engine.chat.completions.create({
      messages,
    });
    console.log(reply);
  });

  function addMessage(text, sender) {
    const clonedTemplate = $template.content.cloneNode(true);
    const $newMessage = clonedTemplate.querySelector(".message");

    const $who = $newMessage.querySelector("span");
    const $text = $newMessage.querySelector("p");

    $text.textContent = text;
    $who.textContent = sender === "bot" ? "TB" : "TU";
    $newMessage.classList.add(sender);

    $messages.appendChild($newMessage);
    $container.scrollTop = $container.scrollHeight;
  }
});
