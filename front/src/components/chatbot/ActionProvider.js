import LoadingDots from "./LoadingDots";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMessage = async (message) => {
    const loadingId = Date.now();
    const loadingMessage = {
      ...this.createChatBotMessage(<LoadingDots />, {
        withAvatar: true,
        // loading: true,
        customComponent: true,
      }),
      id: loadingId,
    };

    try {
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, loadingMessage],
      }));

      const response = await fetch("https://back.a.ringgo.site//chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      if (data.answer) {
        this.setState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages.filter((msg) => msg.id !== loadingId),
            this.createChatBotMessage(data.answer, {
              withAvatar: true,
            }),
          ],
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState((prevState) => ({
        ...prevState,
        messages: [
          ...prevState.messages.filter((msg) => msg.id !== loadingId),
          this.createChatBotMessage("오류가 발생했습니다. 다시 시도해주세요.", {
            withAvatar: true,
          }),
        ],
      }));
    }
  };
}

export default ActionProvider;
